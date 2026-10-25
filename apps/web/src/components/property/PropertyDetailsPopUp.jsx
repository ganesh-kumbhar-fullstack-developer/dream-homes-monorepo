import { useState } from "react"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../ui/Button.jsx"
import { Card, CardContent } from "../ui/Card.jsx"
import { Badge } from "../ui/Badge.jsx"
import {
  X,
  MapPin,
  Car,
  PawPrint,
  Square,
  Calendar,
  Star,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  Eye,
  Home,
  Wifi,
  Shield,
  Zap,
  Trees,
  Dumbbell,
  Waves,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Building,
  Navigation,
} from "lucide-react"
import { useProperty } from "../../context/PropertyContext.jsx"
import ContactPopup from "../forms/ContactPopUpForm.jsx"

export default function PropertyDetailsPopup({ isOpen, onClose, property }) {
  const { likedProperties, toggleLike } = useProperty()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContactForm, setShowContactForm] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const handleShare = async () => {
    const url = `${window.location.origin}/?property=${encodeURIComponent(property.id)}`
    if (navigator.share) {
      navigator.share({ title: property.title, url }).catch(() => {})
      return
    }
    await navigator.clipboard.writeText(url)
    toast.success("Link copied")
  }

  if (!property) return null

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

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      "Swimming Pool": Waves,
      Gym: Dumbbell,
      Parking: Car,
      Security: Shield,
      Garden: Trees,
      Elevator: Building,
      "Power Backup": Zap,
      "Water Supply": Waves,
      "WiFi Ready": Wifi,
      AC: Home,
    }
    return iconMap[amenity] || Home
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "amenities", label: "Amenities", icon: Star },
    { id: "location", label: "Location", icon: MapPin },
    { id: "dealer", label: "Contact", icon: User },
  ]

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70  !w-full !h-full backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-6xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="border-0 bg-white dark:bg-slate-800 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="relative">
                  <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Save to favourites"
                      aria-pressed={isLiked}
                      onClick={() => toggleLike(property.id)}
                      className={`rounded-full backdrop-blur-md shadow-lg transition-all duration-300 ${
                        isLiked
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-white/90 hover:bg-white text-slate-700 hover:text-red-500"
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Share this home"
                      onClick={handleShare}
                      className="rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-gold-600 backdrop-blur-md shadow-lg"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onClose}
                      aria-label="Close"
                      className="rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-red-500 backdrop-blur-md shadow-lg"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Image Gallery */}
                  <div className="relative h-80 overflow-hidden">
                    <motion.img loading="lazy" decoding="async"
                      key={currentImageIndex}
                      src={property.images[currentImageIndex] || "/placeholder.svg"}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    />

                    {/* Image Navigation */}
                    {property.images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Previous photo"
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 rounded-full shadow-lg"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Next photo"
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 rounded-full shadow-lg"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>

                        {/* Image Indicators */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {property.images.map((_, index) => (
                            <button
                              key={index}
                              aria-label={`Show photo ${index + 1}`}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === currentImageIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Property Type Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge
                        className={`${
                          property.type === "buy"
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                            : "bg-gradient-to-r from-blue-500 to-blue-600"
                        } text-white shadow-lg px-4 py-2 text-sm font-semibold`}
                      >
                        {property.type === "buy" ? "For Sale" : "For Rent"}
                      </Badge>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                      <Star className="w-4 h-4 text-gold-500 fill-current" />
                      <span className="text-sm font-semibold text-slate-800">4.8</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="max-h-[calc(90vh-320px)] overflow-y-auto">
                  <CardContent className="p-8">
                    {/* Title and Price */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                      <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{property.title}</h1>
                        <div className="flex items-center text-slate-600 dark:text-slate-400 mb-4">
                          <MapPin className="h-5 w-5 mr-2 text-gold-500" />
                          <span>{property.location.address}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold text-gradient mb-2">
                          {formatPrice(property.price, property.type)}
                        </div>
                        <Badge
                          variant="outline"
                          className="border-gold-400 text-gold-600 bg-gold-50 dark:bg-gold-900/20 font-semibold px-4 py-2"
                        >
                          {property.propertyType}
                        </Badge>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl">
                        <Square className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-slate-800 dark:text-white">{property.size}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">sq ft</div>
                      </div>
                      <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl">
                        <Car className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-slate-800 dark:text-white">{property.parking}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Parking</div>
                      </div>
                      <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl">
                        <Calendar className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-slate-800 dark:text-white">{property.yearBuilt}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Built</div>
                      </div>
                      <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl">
                        <PawPrint className="h-6 w-6 text-pink-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-slate-800 dark:text-white">
                          {property.petsAllowed ? "Yes" : "No"}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Pets</div>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="mb-8">
                      <div className="flex space-x-1 bg-slate-100 dark:bg-slate-700 rounded-2xl p-1 mb-6">
                        {tabs.map((tab) => (
                          <Button
                            key={tab.id}
                            variant="ghost"
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 rounded-xl font-semibold transition-all duration-300 ${
                              activeTab === tab.id
                                ? "bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-lg"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                            }`}
                          >
                            <tab.icon className="h-4 w-4 mr-2" />
                            {tab.label}
                          </Button>
                        ))}
                      </div>

                      {/* Tab Content */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeTab}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          {activeTab === "overview" && (
                            <div className="space-y-6">
                              <div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Description</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                  {property.description}
                                </p>
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Key Features</h3>
                                <div className="grid grid-cols-2 gap-3">
                                  {property.features.map((feature, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl"
                                    >
                                      <div className="w-2 h-2 bg-gold-500 rounded-full mr-3"></div>
                                      <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {activeTab === "amenities" && (
                            <div>
                              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
                                Available Amenities
                              </h3>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {property.amenities.map((amenity, index) => {
                                  const IconComponent = getAmenityIcon(amenity)
                                  return (
                                    <motion.div
                                      key={index}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: index * 0.1 }}
                                      className="flex items-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-2xl hover:shadow-lg transition-all duration-300"
                                    >
                                      <div className="p-2 bg-gold-100 dark:bg-gold-900/20 rounded-xl mr-3">
                                        <IconComponent className="h-5 w-5 text-gold-600" />
                                      </div>
                                      <span className="font-medium text-slate-700 dark:text-slate-300">{amenity}</span>
                                    </motion.div>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                          {activeTab === "location" && (
                            <div className="space-y-6">
                              <div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Address</h3>
                                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl">
                                  <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-gold-500 mt-1" />
                                    <div>
                                      <p className="font-semibold text-slate-800 dark:text-white">
                                        {property.location.address}
                                      </p>
                                      <p className="text-slate-600 dark:text-slate-400">
                                        {property.location.city}, {property.location.state}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Nearby Places</h3>
                                <div className="space-y-3">
                                  {property.nearbyPlaces.map((place, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl"
                                    >
                                      <Navigation className="h-4 w-4 text-emerald-500 mr-3" />
                                      <span className="text-slate-700 dark:text-slate-300">{place}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {activeTab === "dealer" && (
                            <div className="space-y-6">
                              <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-gold-50 to-emerald-50 dark:from-gold-900/20 dark:to-emerald-900/20 rounded-2xl">
                                <img loading="lazy" decoding="async"
                                  src={property.dealer.image || "/placeholder.svg"}
                                  alt={property.dealer.name}
                                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                                <div className="flex-1">
                                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                                    {property.dealer.name}
                                  </h3>
                                  <p className="text-slate-600 dark:text-slate-400 mb-4">Property Consultant</p>
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4 text-emerald-500" />
                                      <span className="text-slate-700 dark:text-slate-300">
                                        {property.dealer.phone}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-4 w-4 text-blue-500" />
                                      <span className="text-slate-700 dark:text-slate-300">
                                        {property.dealer.email}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                      <Button
                        onClick={() => setShowContactForm(true)}
                        className="flex-1 h-14 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl "
                      >
                        <MessageCircle className="mr-3 h-5 w-5" />
                        Get More Details
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (!property.dealer?.phone) {
                            toast.error("Phone number not available yet. Use Get More Details instead.")
                            return
                          }
                          window.location.href = `tel:${property.dealer.phone}`
                        }}
                        className="h-14 px-8 border-2 border-emerald-400 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 font-semibold rounded-xl bg-transparent dark:hover:text-white"
                      >
                        <Phone className="mr-3 h-5 w-5" />
                        Call Now
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowContactForm(true)}
                        className="h-14 px-8 border-2 border-blue-400 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold rounded-xl bg-transparent dark:hover:text-white"
                      >
                        <Eye className="mr-3 h-5 w-5" />
                        Schedule Visit
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Form Popup */}
      <ContactPopup
        isOpen={showContactForm}
        onClose={() => setShowContactForm(false)}
        propertyTitle={property?.title}
        propertyId={property?._id}
      />
    </>
  )
}
