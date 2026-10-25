// Turns an API listing into the shape the existing screens were built around.
// The screens keep their markup and filters, so only this mapping knows the API's field names.

const CONTACT_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE ?? ""
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? ""

function propertyTypeLabel(listing) {
  switch (listing.property_type) {
    case "apartment":
      return `${listing.bedrooms || 1}BHK`
    case "villa":
      return "Villa"
    case "house":
      return "Bungalow"
    default:
      return "Other"
  }
}

export function toScreenListing(listing) {
  const details = listing.details ?? {}
  return {
    id: `api_${listing.id}`,
    _id: listing.id,
    title: listing.title,
    description: listing.description,
    price: Number(listing.price),
    type: listing.listing_type === "rent" ? "rent" : "buy",
    propertyType: propertyTypeLabel(listing),
    location: {
      address: listing.address_line,
      locality: listing.locality,
      city: listing.city,
      state: listing.state,
      zipCode: listing.postal_code,
    },
    bedrooms: listing.bedrooms ?? 0,
    bathrooms: listing.bathrooms ?? 0,
    size: listing.area_sqft ?? 0,
    yearBuilt: details.year_built ?? null,
    parking: details.parking ?? 0,
    images: listing.images?.length ? listing.images.map((image) => image.url) : [],
    amenities: details.amenities ?? [],
    features: details.features ?? [],
    nearbyPlaces: details.nearby_places ?? [],
    availability: "available",
    petsAllowed: Boolean(details.pets_allowed),
    featured: Boolean(listing.featured),
    verified: Boolean(listing.verified),
    latitude: listing.lat ?? null,
    longitude: listing.lng ?? null,
    publishedAt: listing.published_at ?? null,
    // Contact details are set per deployment. Nothing is invented when they are missing.
    dealer: { name: "Dream Homes", phone: CONTACT_PHONE, email: CONTACT_EMAIL, image: "/placeholder.svg" },
    views: 0,
    likes: 0,
  }
}
