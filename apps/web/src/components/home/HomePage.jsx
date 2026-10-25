import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import PropertyGrid from "../property/PropertyGrid.jsx"
import HeroVideo from "./HeroVideo.jsx"
import PropertyFilters from "../property/PropertyFilter.jsx"
import { useProperty } from "../../context/PropertyContext.jsx"
import { Building2, MapPin, Tag, KeyRound, Sparkles, ArrowRight } from "lucide-react"
import PropertyDetailsPopup from "../property/PropertyDetailsPopUp.jsx"
import { Button } from "@/components/ui/Button.jsx"
import { Badge } from "@/components/ui/Badge.jsx"

export default function HomePage() {
  const [filters, setFilters] = useState({
    type: "all",
    propertyType: [],
    availability: "available",
    location: undefined,
    priceRange: undefined,
    petsAllowed: false,
    swimmingPool: false,
    parking: false,
  })

  const { filterProperties, getPropertyById, properties: liveListings } = useProperty()
  const [sharedId, setSharedId] = useState(null)
  useEffect(() => {
    setSharedId(new URLSearchParams(window.location.search).get("property"))
  }, [])
  const sharedProperty = sharedId ? getPropertyById(sharedId) : undefined
  const filteredProperties = filterProperties(filters)

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  // Every number below is computed from live listings. No invented figures.
  const cities = new Set(liveListings.map((p) => p.location?.city).filter(Boolean))
  const stats = [
    { icon: Building2, label: "Live listings", value: String(liveListings.length), color: "text-amber-600" },
    { icon: MapPin, label: "Cities", value: String(cities.size), color: "text-emerald-600" },
    { icon: Tag, label: "For sale", value: String(liveListings.filter((p) => p.type === "buy").length), color: "text-blue-600" },
    { icon: KeyRound, label: "For rent", value: String(liveListings.filter((p) => p.type === "rent").length), color: "text-purple-600" },
  ]
  const targetRef = useRef(null)
  const handleScroll = () => {
    targetRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <HeroVideo />
        {/* Background Elements */}
        <div className="absolute inset-0 bg-mesh opacity-30"></div>
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-100 animate-float" style={{ background: "radial-gradient(circle, rgba(251,191,36,0.35), transparent 70%)" }}></div>
        <div
          className="absolute top-40 right-10 w-72 h-72 rounded-full opacity-100 animate-float" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.30), transparent 70%)", animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/2 w-72 h-72 rounded-full opacity-100 animate-float" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.25), transparent 70%)", animationDelay: "4s" }}
        ></div>
        <div className="relative container mx-auto px-4 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-6xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6"
            >
              <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2 text-sm font-semibold shadow-lg">
                <Sparkles className="w-4 h-4 mr-2" />
                Browse without signing up
              </Badge>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
            >
              Find Your
              <span className="block text-gradient animate-shimmer bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent bg-size-200 bg-pos-0">
                Dream Home
              </span>
              <span className="text-emerald-600 dark:text-emerald-400">Today</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed"
            >
              Discover premium properties with cutting-edge technology. From luxury villas to cozy apartments, we make
              finding your perfect home effortless and exciting.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Button
                size="lg"
                onClick={handleScroll}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 text-lg font-semibold shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105"
              >
                Explore Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div key={index} whileHover={{ scale: 1.05 }} className="text-center group">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-lg mb-4 group-hover:shadow-xl transition-all duration-300 ${stat.color}`}
                  >
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-1">{stat.value}</div>
                  <div className="text-slate-600 dark:text-slate-400 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Property Filters Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="py-8 relative -mt-8 z-10"
      >
        <div className="container mx-auto px-4">
          <PropertyFilters filters={filters} onFiltersChange={handleFiltersChange} />
        </div>
      </motion.section>

      {/* Properties Section */}
      <section className="py-16" ref={targetRef}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">
                Featured{" "}
                <span className="text-gradient bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
                  Properties
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                {filteredProperties.length} premium properties available
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleScroll}
              className="hidden md:flex border-amber-400 text-amber-600 hover:bg-amber-50 bg-transparent"
            >
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
          <PropertyGrid properties={filteredProperties} />
        </div>
      </section>
      {sharedProperty && (
        <PropertyDetailsPopup
          isOpen
          onClose={() => {
            setSharedId(null)
            window.history.replaceState(null, "", "/")
          }}
          property={sharedProperty}
        />
      )}
    </div>
  )
}
