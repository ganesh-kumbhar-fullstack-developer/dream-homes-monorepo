import { createContext, useContext, useState, useEffect } from "react"
import toast from "react-hot-toast"
import { api } from "../lib/api.js"
import { toScreenListing } from "../lib/adapt.js"
import { useAuth } from "./AuthContext.jsx"
import AuthPrompt from "../components/auth/AuthPrompt.jsx"

const PropertyContext = createContext(undefined)

export function PropertyProvider({ children }) {
  const [properties, setProperties] = useState([]) // Only live listings from the API
  const { user, sessionChecked } = useAuth()
  const [apiProperties, setApiProperties] = useState([])
  const [likedProperties, setLikedProperties] = useState([])
  const [isLoadingApi, setIsLoadingApi] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isLoadingLikes, setIsLoadingLikes] = useState(false)
  const [authPrompt, setAuthPrompt] = useState(null)

  // Load API properties on mount (after initial render with global data)
  useEffect(() => {
    // Small delay to ensure global data is shown first
    const timer = setTimeout(() => {
      loadApiProperties()
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Load liked properties when component mounts
  useEffect(() => {
    if (sessionChecked) loadLikedProperties()
  }, [sessionChecked, user?._id])

  const loadApiProperties = async () => {
    try {
      setIsLoadingApi(true)
      const listings = await api.getListings()
      setApiProperties(listings.map(toScreenListing))
    } catch (error) {
      console.error("Failed to load API properties:", error)
      // Gracefully handle API failure - continue with local data
      toast.error("Some properties may not be available", { duration: 3000 })
    } finally {
      setIsLoadingApi(false)
      setIsInitialLoad(false)
    }
  }

  const loadLikedProperties = async () => {
    if (!user) {
      setLikedProperties([])
      return
    }
    try {
      setIsLoadingLikes(true)
      const saved = await api.getFavourites()
      setLikedProperties(saved.map((listing) => `api_${listing.id}`))
    } catch (error) {
      console.error("Failed to load favourites:", error)
      setLikedProperties([])
      toast.error("Failed to load your favourites")
    } finally {
      setIsLoadingLikes(false)
    }
  }

  // Refresh properties (for admin updates)
  const refreshProperties = async () => {
    await loadApiProperties()
    toast.success("Properties refreshed!")
  }

  // Get all properties (local + API) with proper ID handling
  const getAllProperties = () => {
    // Combine local properties with API properties
    const combinedProperties = [
      ...apiProperties.map((prop) => ({
        ...prop,
        id: `api_${prop._id}`, // Prefix API properties with 'api_'
        _id: prop._id, // Keep original MongoDB ID for admin operations
        // Ensure all required fields are present
        images: prop.images && prop.images.length > 0 ? prop.images : ["/placeholder.svg"],
        amenities: prop.amenities || [],
        features: prop.features || ["Modern Design", "Prime Location"],
        nearbyPlaces: prop.nearbyPlaces || ["Shopping Center", "Public Transport"],
        dealer: prop.dealer || {
          name: "Dream Homes",
          phone: "+1 (555) 123-4567",
          email: "contact@dreamhomes.com",
          image: "/placeholder.svg",
        },
        yearBuilt: prop.yearBuilt || new Date().getFullYear(),
        parking: prop.parking || 0,
      })),
    ]
    return combinedProperties
  }

  const saveHome = async (propertyId) => {
    await api.saveFavourite(propertyId.replace(/^api_/, ""))
    setLikedProperties((current) => (current.includes(propertyId) ? current : [...current, propertyId]))
  }

  const toggleLike = async (propertyId) => {
    if (!user) {
      // Saving needs an account. Ask here, then save the home once the visitor signs in.
      setAuthPrompt({
        reason: "Create a free account to save homes and find them anytime.",
        onSuccess: () => saveHome(propertyId),
      })
      return
    }
    const listingId = propertyId.replace(/^api_/, "")
    const isLiked = likedProperties.includes(propertyId)
    setLikedProperties((current) =>
      isLiked ? current.filter((id) => id !== propertyId) : [...current, propertyId],
    )
    try {
      if (isLiked) {
        await api.removeFavourite(listingId)
        toast.success("Removed from favourites")
      } else {
        await api.saveFavourite(listingId)
        toast.success("Saved to favourites")
      }
    } catch (error) {
      console.error("Failed to update favourite:", error)
      // Put the list back the way it was.
      setLikedProperties((current) =>
        isLiked ? [...current, propertyId] : current.filter((id) => id !== propertyId),
      )
      toast.error("Couldn't update favourites. Please try again.")
    }
  }

  const getLikedProperties = () => {
    const allProperties = getAllProperties()
    return allProperties.filter((property) => likedProperties.includes(property.id))
  }

  const getPropertyById = (id) => {
    const allProperties = getAllProperties()
    return allProperties.find((property) => property.id === id)
  }

  const filterProperties = (filters) => {
    const allProperties = getAllProperties()
    return allProperties.filter((property) => {
      // Type filter (all, buy, rent)
      if (filters.type && filters.type !== "all" && property.type !== filters.type) {
        return false
      }

      // Property type filter (1BHK, 2BHK, etc.)
      if (
        filters.propertyType &&
        filters.propertyType.length > 0 &&
        !filters.propertyType.includes(property.propertyType)
      ) {
        return false
      }

      // Price range filter
      if (filters.priceRange) {
        if (property.price < filters.priceRange.min || property.price > filters.priceRange.max) {
          return false
        }
      }

      // Location filter
      if (filters.location) {
        const searchTerm = filters.location.toLowerCase()
        const cityMatch = property.location.city.toLowerCase().includes(searchTerm)
        const addressMatch = property.location.address.toLowerCase().includes(searchTerm)
        if (!cityMatch && !addressMatch) {
          return false
        }
      }

      // Pets allowed filter
      if (filters.petsAllowed !== undefined && filters.petsAllowed && !property.petsAllowed) {
        return false
      }

      // Swimming pool filter
      if (filters.swimmingPool !== undefined && filters.swimmingPool) {
        if (
          !property.amenities ||
          !property.amenities.some(
            (amenity) => amenity.toLowerCase().includes("swimming") || amenity.toLowerCase().includes("pool"),
          )
        ) {
          return false
        }
      }

      // Parking filter
      if (filters.parking !== undefined && filters.parking) {
        if (
          !property.amenities ||
          !property.amenities.some(
            (amenity) => amenity.toLowerCase().includes("parking") || amenity.toLowerCase().includes("garage"),
          )
        ) {
          return false
        }
      }

      // Availability filter
      if (filters.availability && filters.availability !== "all" && property.availability !== filters.availability) {
        return false
      }

      return true
    })
  }

  const handleAuthPromptSuccess = async () => {
    const pending = authPrompt
    setAuthPrompt(null)
    try {
      await pending?.onSuccess?.()
    } catch (error) {
      console.error("Failed to save after sign-in:", error)
      toast.error("Signed in, but the home could not be saved. Try again.")
    }
  }

  return (
    <PropertyContext.Provider
      value={{
        properties: getAllProperties(), // Return combined properties
        likedProperties,
        isLoadingApi,
        isInitialLoad,
        isLoadingLikes,
        toggleLike,
        getLikedProperties,
        getPropertyById,
        filterProperties,
        refreshProperties, // For admin to refresh after changes
        apiProperties, // Separate access to API properties for admin
        loadLikedProperties,
      }}
    >
      {children}
      <AuthPrompt
        prompt={authPrompt}
        onClose={() => setAuthPrompt(null)}
        onSuccess={handleAuthPromptSuccess}
      />
    </PropertyContext.Provider>
  )
}

export function useProperty() {
  const context = useContext(PropertyContext)
  if (context === undefined) {
    throw new Error("useProperty must be used within a PropertyProvider")
  }
  return context
}
