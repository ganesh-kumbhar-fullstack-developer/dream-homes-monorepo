import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "../ui/Card.jsx"
import { Button } from "../ui/Button.jsx"
import { Badge } from "../ui/Badge.jsx"
import { useProperty } from "../../context/PropertyContext.jsx"
import { Heart, MapPin, Car, PawPrint, Eye, Square, Star, Phone, MessageCircle, Share2 } from "lucide-react"
import PropertyDetailsPopup from "./PropertyDetailsPopUp.jsx"
import PropertyEnquiryForm from "../forms/PropertyEnquiryForm.jsx"
import ContactPopup from "../forms/ContactPopUpForm.jsx"

export default function PropertyCard({ property }) {
  const { likedProperties, toggleLike } = useProperty()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [showDetailsPopup, setShowDetailsPopup] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const isLiked = likedProperties.includes(property.id)

  const formatPrice = (price, type) => {
    if (type === "rent") {
      return `₹${price.toLocaleString()}/month`
    }
    return `₹${(price / 100000).toFixed(1)}L`
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))
  }

  return (
    <>
      <div
        className="group cursor-pointer"
        onClick={(e) => {
          // Buttons, links and form controls on the card keep their own actions.
          if (e.target.closest("button, a, input, select, textarea, label")) return
          setShowDetailsPopup(true)
        }}
      >
        <Card className="overflow-hidden h-full flex flex-col bg-white dark:bg-slate-800 border-0 shadow-lg hover:shadow-2xl hover:shadow-gold-500/20 transition-all duration-500 rounded-2xl group hover:-translate-y-4">
          {/* Image Section */}
          <div className="relative h-64 overflow-hidden">
            <motion.img loading="lazy" decoding="async"
              src={property.images[currentImageIndex] || "/placeholder.svg"}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.7 }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Image Navigation */}
            {property.images.length > 1 && (
              <>
                <button
                  aria-label="Previous photo"
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110"
                >
                  ←
                </button>
                <button
                  aria-label="Next photo"
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110"
                >
                  →
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      aria-label={`Show photo ${index + 1}`}
                    onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                        }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <Badge
                className={`${property.type === "buy"
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                  : "bg-gradient-to-r from-blue-500 to-blue-600"
                  } text-white shadow-lg`}
              >
                {property.type === "buy" ? "For Sale" : "For Rent"}
              </Badge>
              {property.availability !== "available" && (
                <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg">
                  {property.availability === "sold" ? "Sold" : "Rented"}
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Save to favourites"
                aria-pressed={isLiked}
                onClick={() => toggleLike(property.id)}
                className={`p-3 rounded-full backdrop-blur-md shadow-lg transition-all duration-300 ${isLiked ? "bg-red-500 text-white" : "bg-white/90 hover:bg-white text-slate-700 hover:text-red-500"
                  }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
              </motion.button>

            </div>

            {/* Rating Badge */}
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
              <Star className="w-4 h-4 text-gold-500 fill-current" />
              <span className="text-sm font-semibold text-slate-800">4.8</span>
            </div>
          </div>

          <CardContent className="p-6 flex-1">
            <div className="space-y-4">
              {/* Price and Type */}
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gradient">{formatPrice(property.price, property.type)}</div>
                <Badge
                  variant="outline"
                  className="border-gold-400 text-gold-600 bg-gold-50 dark:bg-gold-900/20 font-semibold"
                >
                  {property.propertyType}
                </Badge>
              </div>

              {/* Title */}
              <h3 className="font-bold text-xl text-slate-800 dark:text-white line-clamp-2 group-hover:text-gold-600 transition-colors duration-300">
                {property.title}
              </h3>

              {/* Location */}
              <div className="flex items-center text-slate-600 dark:text-slate-400">
                <MapPin className="h-4 w-4 mr-2 text-gold-500" />
                <span className="line-clamp-1 text-sm">{property.location.address}</span>
              </div>

              {/* Property Details */}
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1 text-blue-500" />
                    <span>{property.size} sq ft</span>
                  </div>
                  {property.parking > 0 && (
                    <div className="flex items-center">
                      <Car className="h-4 w-4 mr-1 text-emerald-500" />
                      <span>{property.parking}</span>
                    </div>
                  )}
                  {property.petsAllowed && (
                    <div className="flex items-center">
                      <PawPrint className="h-4 w-4 mr-1 text-purple-500" />
                      <span>Pets OK</span>
                    </div>
                  )}
                </div>
                <div className="text-xs text-slate-500">Built {property.yearBuilt}</div>
              </div>

              {/* Amenities Preview */}
              <div className="flex flex-wrap gap-2">
                {property.amenities.slice(0, 3).map((amenity) => (
                  <Badge
                    key={amenity}
                    variant="secondary"
                    className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  >
                    {amenity}
                  </Badge>
                ))}
                {property.amenities.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-gold-100 dark:bg-gold-900/20 text-gold-600">
                    +{property.amenities.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-6 pt-0">
            <div className="flex gap-2 w-full">
              <Button
                className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setShowDetailsPopup(true)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Request a call back"
                  onClick={() => setShowContactForm(true)}
                  className="border-emerald-400 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 dark:hover:text-white  bg-transparent"
                >
                  <Phone className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setShowForm(true)}
                  aria-label="Send an enquiry"
                  variant="outline"
                  size="icon"
                  className="border-blue-400 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:hover:text-white bg-transparent"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
      <PropertyEnquiryForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        propertyTitle={property?.title}
        propertyId={property?._id}
      />
      <ContactPopup
        isOpen={showContactForm}
        onClose={() => setShowContactForm(false)}
        propertyTitle={property?.title}
        propertyId={property?._id}
      />
      {/* Property Details Popup */}
      <PropertyDetailsPopup isOpen={showDetailsPopup} onClose={() => setShowDetailsPopup(false)} property={property} />
    </>
  )
}

