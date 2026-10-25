import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button.jsx"
import { Input } from "@/components/ui/Input.jsx"
import { Badge } from "@/components/ui/Badge.jsx"
import { Card } from "@/components/ui/Card.jsx"
import {FaRupeeSign } from "react-icons/fa"
import { Search, SlidersHorizontal, MapPin, Home, BadgeIndianRupee, Filter, X, ChevronDown } from "lucide-react"
export default function PropertyFilters({ filters, onFiltersChange }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchLocation, setSearchLocation] = useState("")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })

  const propertyTypes = ["1BHK", "2BHK", "3BHK", "Bungalow", "Villa"]

  // Sync local state with filters prop
  useEffect(() => {
    if (filters.location !== searchLocation) {
      setSearchLocation(filters.location || "")
    }
  }, [filters.location])

  useEffect(() => {
    if (filters.priceRange) {
      setPriceRange({
        min: filters.priceRange.min > 0 ? filters.priceRange.min.toString() : "",
        max: filters.priceRange.max !== Number.POSITIVE_INFINITY ? filters.priceRange.max.toString() : "",
      })
    } else {
      setPriceRange({ min: "", max: "" })
    }
  }, [filters.priceRange])

  const handleTypeChange = (type) => {
    onFiltersChange({ ...filters, type })
  }

  const handlePropertyTypeChange = (propertyType) => {
    const currentTypes = filters.propertyType || []
    const newTypes = currentTypes.includes(propertyType)
      ? currentTypes.filter((t) => t !== propertyType)
      : [...currentTypes, propertyType]
    onFiltersChange({ ...filters, propertyType: newTypes })
  }

  const handleLocationSearch = () => {
    onFiltersChange({ ...filters, location: searchLocation || undefined })
  }

  const handlePriceFilter = () => {
    const min = priceRange.min ? Number.parseInt(priceRange.min) : undefined
    const max = priceRange.max ? Number.parseInt(priceRange.max) : undefined
    if (min || max) {
      onFiltersChange({
        ...filters,
        priceRange: { min: min || 0, max: max || Number.POSITIVE_INFINITY },
      })
    } else {
      onFiltersChange({ ...filters, priceRange: undefined })
    }
  }

  const handleAdditionalFilterChange = (filterKey) => {
    onFiltersChange({ ...filters, [filterKey]: !filters[filterKey] })
  }

  const clearFilters = () => {
    onFiltersChange({
      type: "all",
      propertyType: [],
      availability: "available",
      location: undefined,
      priceRange: undefined,
      petsAllowed: false,
      swimmingPool: false,
      parking: false,
    })
    setSearchLocation("")
    setPriceRange({ min: "", max: "" })
  }

  const activeFiltersCount =
    (filters.type !== "all" ? 1 : 0) +
    (filters.propertyType?.length || 0) +
    (filters.location ? 1 : 0) +
    (filters.priceRange ? 1 : 0) +
    (filters.petsAllowed ? 1 : 0) +
    (filters.swimmingPool ? 1 : 0) +
    (filters.parking ? 1 : 0)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-20 w-full">
      <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg border-0 shadow-2xl shadow-amber-500/10 mx-auto max-w-7xl">
        {/* Main Filter Bar */}
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search Location - Full width on mobile */}
            <div className="w-full">
              <div className="relative">
                <MapPin className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  placeholder="Search by location..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLocationSearch()}
                  className="pl-10 sm:pl-12 h-10 sm:h-12 text-sm sm:text-lg border-0 bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-amber-400 w-full"
                />
              </div>
            </div>

            {/* Property Type Buttons - Stack on mobile, horizontal on larger screens */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
              <div className="flex gap-2 flex-1 min-w-0">
                <Button
                  variant={filters.type === "all" ? "default" : "outline"}
                  onClick={() => handleTypeChange("all")}
                  className={`h-9 sm:h-10 lg:h-12 px-3 sm:px-4 lg:px-6 text-xs sm:text-sm lg:text-base flex-1 sm:flex-none ${
                    filters.type === "all"
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg hover:from-amber-600 hover:to-amber-700"
                      : "border-slate-200 hover:border-amber-400 hover:text-amber-600 dark:border-slate-600 dark:hover:border-amber-400"
                  }`}
                >
                  All
                </Button>
                <Button
                  variant={filters.type === "buy" ? "default" : "outline"}
                  onClick={() => handleTypeChange("buy")}
                  className={`h-9 sm:h-10 lg:h-12 px-3 sm:px-4 lg:px-6 text-xs sm:text-sm lg:text-base flex-1 sm:flex-none ${
                    filters.type === "buy"
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:from-emerald-600 hover:to-emerald-700"
                      : "border-slate-200 hover:border-emerald-400 hover:text-emerald-600 dark:border-slate-600 dark:hover:border-emerald-400"
                  }`}
                >
                  <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Buy</span>
                </Button>
                <Button
                  variant={filters.type === "rent" ? "default" : "outline"}
                  onClick={() => handleTypeChange("rent")}
                  className={`h-9 sm:h-10 lg:h-12 px-3 sm:px-4 lg:px-6 text-xs sm:text-sm lg:text-base flex-1 sm:flex-none ${
                    filters.type === "rent"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:from-blue-600 hover:to-blue-700"
                      : "border-slate-200 hover:border-blue-400 hover:text-blue-600 dark:border-slate-600 dark:hover:border-blue-400"
                  }`}
                >
                  <FaRupeeSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Rent</span>
                </Button>
              </div>

              {/* Advanced Filters Toggle & Search */}
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-9 sm:h-10 lg:h-12 px-3 sm:px-4 lg:px-6 border-slate-200 hover:border-amber-400 hover:bg-gold-500 hover:text-white dark:border-slate-600 dark:hover:border-amber-400 relative flex-1 sm:flex-none text-xs sm:text-sm lg:text-base"
                >
                  <SlidersHorizontal className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Filters</span>
                  <ChevronDown
                    className={`w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                  {activeFiltersCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-amber-500 text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 min-w-[1.25rem] h-5 sm:h-6 flex items-center justify-center">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
                <Button
                  onClick={handleLocationSearch}
                  className="h-9 sm:h-10 lg:h-12 px-3 sm:px-4 lg:px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg flex-1 sm:flex-none text-xs sm:text-sm lg:text-base"
                >
                  <Search className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Search</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
                {/* Property Types */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-2 sm:mb-3 flex items-center">
                    <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-500" />
                    Property Type
                  </h3>
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                    {propertyTypes.map((type) => (
                      <Button
                        key={type}
                        variant={filters.propertyType?.includes(type) ? "default" : "outline"}
                        onClick={() => handlePropertyTypeChange(type)}
                        className={`h-8 sm:h-9 lg:h-10 px-3 sm:px-4 text-xs sm:text-sm ${
                          filters.propertyType?.includes(type)
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg hover:from-amber-600 hover:to-amber-700"
                            : "border-slate-200 hover:border-amber-400 hover:text-amber-600 dark:border-slate-600 dark:hover:border-amber-400"
                        }`}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-2 sm:mb-3 flex items-center">
                    <FaRupeeSign className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-500" />
                    Price Range
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center">
                    <Input
                      placeholder="Min Price"
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="flex-1 bg-slate-50 dark:bg-slate-700 border-0 focus:ring-2 focus:ring-amber-400 h-9 sm:h-10 text-sm"
                    />
                    <span className="text-slate-400 text-center sm:text-left text-sm">to</span>
                    <Input
                      placeholder="Max Price"
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="flex-1 bg-slate-50 dark:bg-slate-700 border-0 focus:ring-2 focus:ring-amber-400 h-9 sm:h-10 text-sm"
                    />
                    <Button
                      onClick={handlePriceFilter}
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white h-9 sm:h-10 px-4 sm:px-6 text-sm w-full sm:w-auto"
                    >
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Additional Filters */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-2 sm:mb-3 flex items-center">
                    <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-500" />
                    Additional Options
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2">
                    <Button
                      variant={filters.petsAllowed ? "default" : "outline"}
                      onClick={() => handleAdditionalFilterChange("petsAllowed")}
                      className={`h-8 sm:h-9 lg:h-10 px-3 sm:px-4 text-xs sm:text-sm justify-start sm:justify-center ${
                        filters.petsAllowed
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:from-emerald-600 hover:to-emerald-700"
                          : "border-slate-200 hover:border-emerald-400 hover:text-emerald-600 dark:border-slate-600 dark:hover:border-emerald-400"
                      }`}
                    >
                      🐕 Pets Allowed
                    </Button>
                    <Button
                      variant={filters.swimmingPool ? "default" : "outline"}
                      onClick={() => handleAdditionalFilterChange("swimmingPool")}
                      className={`h-8 sm:h-9 lg:h-10 px-3 sm:px-4 text-xs sm:text-sm justify-start sm:justify-center ${
                        filters.swimmingPool
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:from-blue-600 hover:to-blue-700"
                          : "border-slate-200 hover:border-blue-400 hover:text-blue-600 dark:border-slate-600 dark:hover:border-blue-400"
                      }`}
                    >
                      🏊 Swimming Pool
                    </Button>
                    <Button
                      variant={filters.parking ? "default" : "outline"}
                      onClick={() => handleAdditionalFilterChange("parking")}
                      className={`h-8 sm:h-9 lg:h-10 px-3 sm:px-4 text-xs sm:text-sm justify-start sm:justify-center ${
                        filters.parking
                          ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg hover:from-purple-600 hover:to-purple-700"
                          : "border-slate-200 hover:border-purple-400 hover:text-purple-600 dark:border-slate-600 dark:hover:border-purple-400"
                      }`}
                    >
                      🚗 Parking
                    </Button>
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <div className="flex justify-center sm:justify-end pt-2">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="border-red-200 text-red-800 hover:bg-red-50 hover:border-red-400 dark:border-red-800 dark:text-red-600 dark:hover:bg-red-950 dark:hover:text-white  dark:hover:border-red-600 bg-transparent h-8 sm:h-9 lg:h-10 px-3 sm:px-4 text-xs sm:text-sm w-full sm:w-auto"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}
