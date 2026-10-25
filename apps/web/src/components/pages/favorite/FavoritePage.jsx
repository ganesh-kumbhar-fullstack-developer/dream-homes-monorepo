// import { useState, useEffect } from "react"
// import { Link } from "react-router-dom"
// import { motion } from "framer-motion"
// import { Card, CardContent } from "@/components/ui/Card.jsx"
// import { Button } from "@/components/ui/Button.jsx"
// import { Badge } from "@/components/ui/Badge.jsx"
// import { Input } from "@/components/ui/Input.jsx"
// import PropertyFilters from "../../property/PropertyFilter.jsx"
// import { useProperty } from "../../../context/PropertyContext.jsx"
// import { useAuth } from "../../../context/AuthContext.jsx"
// import ContactPopUpForm from "../../forms/ContactPopUpForm.jsx"
// import {
//   Heart,
//   Search,
//   Grid3X3,
//   List,
//   Home,
//   MapPin,
//   Calendar,
//   Star,
//   Trash2,
//   Share2,
//   Download,
//   Sparkles,
//   Filter,
//   TrendingUp,
// } from "lucide-react"
// import PropertyGrid from "../../property/PropertyGrid.jsx"

// export default function Favorites() {
//   const { getLikedProperties, toggleLike, filterProperties } = useProperty()
//   const { user } = useAuth()
//   const [likedProperties, setLikedProperties] = useState([])
//   const [filteredProperties, setFilteredProperties] = useState([])
//   const [searchTerm, setSearchTerm] = useState("")
//   const [sortBy, setSortBy] = useState("newest")
//   const [viewMode, setViewMode] = useState("grid")
//   const [isContactUsOpen, setIsContactUsOpen] = useState(false)

//   // Property Filters state
//   const [filters, setFilters] = useState({
//     type: "all",
//     propertyType: [],
//     availability: "available",
//     location: undefined,
//     priceRange: undefined,
//     petsAllowed: false,
//     swimmingPool: false,
//     parking: false,
//   })

//   useEffect(() => {
//     const properties = getLikedProperties()
//     setLikedProperties(properties)
//   }, [getLikedProperties])

//   useEffect(() => {
//     let filtered = [...likedProperties]

//     // Apply search term filter
//     if (searchTerm) {
//       filtered = filtered.filter(
//         (property) =>
//           property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           property.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           property.location.address.toLowerCase().includes(searchTerm.toLowerCase()),
//       )
//     }

//     // Apply PropertyFilters using the context's filterProperties function
//     // First create a temporary array with all liked properties
//     const allLikedIds = likedProperties.map((p) => p.id)

//     // Apply filters to all properties, then filter to only liked ones
//     const contextFiltered = filterProperties(filters)
//     filtered = filtered.filter((property) => contextFiltered.some((contextProp) => contextProp.id === property.id))

//     // Apply sorting
//     switch (sortBy) {
//       case "price-low":
//         filtered.sort((a, b) => a.price - b.price)
//         break
//       case "price-high":
//         filtered.sort((a, b) => b.price - a.price)
//         break
//       case "newest":
//         filtered.sort((a, b) => new Date(b.yearBuilt) - new Date(a.yearBuilt))
//         break
//       case "oldest":
//         filtered.sort((a, b) => new Date(a.yearBuilt) - new Date(b.yearBuilt))
//         break
//       case "size-large":
//         filtered.sort((a, b) => b.size - a.size)
//         break
//       case "size-small":
//         filtered.sort((a, b) => a.size - b.size)
//         break
//       default:
//         break
//     }

//     setFilteredProperties(filtered)
//   }, [likedProperties, searchTerm, sortBy, filters, filterProperties])

//   const handleFiltersChange = (newFilters) => {
//     setFilters(newFilters)
//   }

//   const handleRemoveAll = () => {
//     if (window.confirm("Are you sure you want to remove all properties from favorites?")) {
//       likedProperties.forEach((property) => {
//         toggleLike(property.id)
//       })
//       setLikedProperties([])
//       setFilteredProperties([])
//     }
//   }

//   const handleExportFavorites = () => {
//     const data = filteredProperties.map((property) => ({
//       title: property.title,
//       price: property.price,
//       type: property.type,
//       location: property.location.address,
//       size: property.size,
//     }))
//     const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = "my-favorite-properties.json"
//     a.click()
//     URL.revokeObjectURL(url)
//   }

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   }

//   const itemVariants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.6, ease: "easeOut" },
//     },
//   }

//   const stats = [
//     {
//       icon: Heart,
//       label: "Total Favorites",
//       value: likedProperties.length,
//       color: "text-red-500",
//       bgColor: "bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20",
//       change: "+12%",
//     },
//     {
//       icon: Home,
//       label: "For Sale",
//       value: likedProperties.filter((p) => p.type === "buy").length,
//       color: "text-emerald-500",
//       bgColor: "bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/20 dark:to-emerald-800/20",
//       change: "+8%",
//     },
//     {
//       icon: MapPin,
//       label: "For Rent",
//       value: likedProperties.filter((p) => p.type === "rent").length,
//       color: "text-blue-500",
//       bgColor: "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20",
//       change: "+15%",
//     },
//     {
//       icon: Star,
//       label: "Avg. Rating",
//       value: "4.8",
//       color: "text-amber-500",
//       bgColor: "bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/20 dark:to-amber-800/20",
//       change: "+0.2",
//     },
//   ]

//   if (likedProperties.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
//         {/* Header */}
//         <motion.section
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.8 }}
//           className="relative py-32 overflow-hidden"
//         >
//           {/* Background Elements */}
//           <div className="absolute inset-0 bg-mesh opacity-30"></div>
//           <div className="absolute top-20 left-10 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
//           <div
//             className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
//             style={{ animationDelay: "2s" }}
//           ></div>
//           <div className="container mx-auto px-4 relative z-10">
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.2 }}
//               className="text-center max-w-5xl mx-auto"
//             >
//               <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 text-lg font-semibold shadow-lg mb-6">
//                 <Heart className="w-5 h-5 mr-2" />
//                 My Favorites
//               </Badge>
//               <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
//                 Your Favorite
//                 <span className="block text-gradient bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
//                   Properties
//                 </span>
//               </h1>
//             </motion.div>
//           </div>
//         </motion.section>
//         {/* Empty State */}
//         <div className="container mx-auto px-4 py-20">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5 }}
//             className="text-center max-w-2xl mx-auto"
//           >
//             <div className="relative mb-12">
//               <div className="w-40 h-40 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20 rounded-full flex items-center justify-center mx-auto shadow-2xl">
//                 <Heart className="w-20 h-20 text-red-400" />
//               </div>
//               <div className="absolute -top-4 -right-4 w-8 h-8 bg-amber-400 rounded-full animate-bounce"></div>
//               <div
//                 className="absolute -bottom-4 -left-4 w-6 h-6 bg-emerald-400 rounded-full animate-bounce"
//                 style={{ animationDelay: "0.5s" }}
//               ></div>
//             </div>
//             <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-6">No Favorites Yet</h2>
//             <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 leading-relaxed">
//               Start exploring our amazing properties and add them to your favorites to see them here. Your dream home is
//               waiting!
//             </p>
//             <Link to={'/'}>
//               <Button
//                 size="lg"
//                 className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-10 py-4 text-lg font-semibold shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105"
//               >
//                 <Home className="mr-2 h-6 w-6" />
//                 Explore Properties
//               </Button>
//             </Link>
//           </motion.div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
//       {/* Header */}
//       <motion.section
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.8 }}
//         className="relative py-20 overflow-hidden"
//       >
//         {/* Background Elements */}
//         <div className="absolute inset-0 bg-mesh opacity-30"></div>
//         <div className="absolute top-20 left-10 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
//         <div
//           className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
//           style={{ animationDelay: "2s" }}
//         ></div>
//         <div className="container mx-auto px-4 relative z-10">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//             className="text-center max-w-5xl mx-auto"
//           >
//             <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 text-lg font-semibold shadow-lg mb-6">
//               <Heart className="w-5 h-5 mr-2" />
//               My Favorites
//             </Badge>
//             <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
//               Your Favorite
//               <span className="block text-gradient bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
//                 Properties
//               </span>
//             </h1>
//             <p className="text-2xl text-slate-600 dark:text-slate-300 leading-relaxed">
//               Welcome back, <span className="text-amber-600 font-semibold">{user?.name}</span>! Here are all your
//               carefully curated properties.
//             </p>
//           </motion.div>
//         </div>
//       </motion.section>

//       {/* Stats Section */}
//       <motion.section
//         variants={containerVariants}
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true }}
//         className="py-20 relative -mt-16 z-10"
//       >
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             {stats.map((stat, index) => (
//               <motion.div key={index} variants={itemVariants}>
//                 <Card className="text-center p-8 hover:shadow-2xl transition-all duration-500 group hover:-translate-y-4 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg">
//                   <CardContent className="p-0">
//                     <motion.div
//                       className={`inline-flex items-center justify-center w-20 h-20 ${stat.bgColor} rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
//                       whileHover={{ rotate: 360 }}
//                       transition={{ duration: 0.6 }}
//                     >
//                       <stat.icon className={`w-10 h-10 ${stat.color}`} />
//                     </motion.div>
//                     <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{stat.value}</h3>
//                     <p className="text-slate-600 dark:text-slate-400 font-medium mb-2">{stat.label}</p>
//                     <div className="flex items-center justify-center">
//                       <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
//                       <span className="text-sm text-emerald-600 font-semibold">{stat.change}</span>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </motion.section>

//       {/* Property Filters Section */}
//       <motion.section
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 0.3 }}
//         className="py-8"
//       >
//         <div className="container mx-auto px-4">
//           <PropertyFilters filters={filters} onFiltersChange={handleFiltersChange} />
//         </div>
//       </motion.section>

//       {/* Filters and Controls */}
//       <motion.section
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 0.4 }}
//         className="py-8"
//       >
//         <div className="container mx-auto px-4">
//           <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-xl">
//             <CardContent className="p-6">
//               <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
//                 {/* Search and Legacy Filters */}
//                 <div className="flex flex-col sm:flex-row gap-4 flex-1">
//                   <div className="relative flex-1">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
//                     <Input
//                       placeholder="Search favorites..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10 bg-slate-50 dark:bg-slate-700 border-0 focus:ring-2 focus:ring-amber-400"
//                     />
//                   </div>
//                   <div className="flex gap-2">
//                     <select
//                       value={sortBy}
//                       onChange={(e) => setSortBy(e.target.value)}
//                       className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border-0 rounded-md focus:ring-2 focus:ring-amber-400 text-sm"
//                     >
//                       <option value="newest">Newest First</option>
//                       <option value="oldest">Oldest First</option>
//                       <option value="price-low">Price: Low to High</option>
//                       <option value="price-high">Price: High to Low</option>
//                       <option value="size-large">Size: Large to Small</option>
//                       <option value="size-small">Size: Small to Large</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* View Controls */}
//                 <div className="flex gap-2">
//                   <Button
//                     variant={viewMode === "grid" ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => setViewMode("grid")}
//                     className={viewMode === "grid" ? "bg-amber-500 hover:bg-amber-600" : ""}
//                   >
//                     <Grid3X3 className="w-4 h-4" />
//                   </Button>
//                   <Button
//                     variant={viewMode === "list" ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => setViewMode("list")}
//                     className={viewMode === "list" ? "bg-amber-500 hover:bg-amber-600" : ""}
//                   >
//                     <List className="w-4 h-4" />
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={handleExportFavorites}
//                     className="border-emerald-400 text-emerald-600 hover:bg-emerald-50 bg-transparent"
//                   >
//                     <Download className="w-4 h-4 mr-2" />
//                     Export
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={handleRemoveAll}
//                     className="border-red-400 text-red-600 hover:bg-red-50 bg-transparent"
//                   >
//                     <Trash2 className="w-4 h-4 mr-2" />
//                     Clear All
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </motion.section>

//       {/* Properties Grid */}
//       <motion.section variants={containerVariants} initial="hidden" animate="visible" className="py-16 w-full h-full">
//         <div className="container mx-auto px-4">
//           {filteredProperties.length === 0 ? (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
//               <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
//                 <Search className="w-16 h-16 text-slate-400" />
//               </div>
//               <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">No Properties Found</h3>
//               <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
//                 Try adjusting your search or filters to find what you're looking for
//               </p>
//               <Button
//                 onClick={() => {
//                   setSearchTerm("")
//                   setSortBy("newest")
//                   setFilters({
//                     type: "all",
//                     propertyType: [],
//                     availability: "available",
//                     location: undefined,
//                     priceRange: undefined,
//                     petsAllowed: false,
//                     swimmingPool: false,
//                     parking: false,
//                   })
//                 }}
//                 className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3"
//               >
//                 <Filter className="w-4 h-4 mr-2" />
//                 Reset Filters
//               </Button>
//             </motion.div>
//           ) : (

//             <PropertyGrid properties={filteredProperties} />

//           )}
//         </div>
//       </motion.section>

//       {/* CTA Section */}
//       <motion.section
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.8 }}
//         className="py-24 bg-gradient-to-r from-red-500 via-red-600 to-amber-500 text-white relative overflow-hidden"
//       >
//         <div className="absolute inset-0 bg-black/20"></div>
//         <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
//         <div
//           className="absolute bottom-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"
//           style={{ animationDelay: "2s" }}
//         ></div>
//         <div className="container mx-auto px-4 text-center relative z-10">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//           >
//             <Badge className="bg-white/20 text-white px-6 py-2 text-sm font-semibold mb-8 backdrop-blur-sm">
//               <Sparkles className="w-4 h-4 mr-2" />
//               Ready for the Next Step?
//             </Badge>
//             <h2 className="text-5xl md:text-6xl font-bold mb-8">Turn Dreams Into Reality!</h2>
//             <p className="text-2xl mb-12 max-w-3xl mx-auto opacity-90">
//               Contact our experts to schedule viewings for your favorite properties and make your dream home a reality.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-6 justify-center">
//               <Button
//                 onClick={() => setIsContactUsOpen(true)}
//                 size="lg"
//                 className="bg-white text-red-600 hover:bg-gray-100 px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
//               >
//                 <Calendar className="mr-2 h-6 w-6" />
//                 Schedule Viewing
//               </Button>
//               {/* <Button
//                 size="lg"
//                 variant="outline"
//                 className="border-2 border-white text-white hover:bg-white hover:text-red-600 bg-transparent px-10 py-4 text-lg font-semibold backdrop-blur-sm"
//               >
//                 <Share2 className="mr-2 h-6 w-6" />
//                 Share Favorites
//               </Button> */}
//             </div>
//           </motion.div>
//         </div>
//       </motion.section>
//       <ContactPopUpForm
//         isOpen={isContactUsOpen}
//         onClose={() => setIsContactUsOpen(false)}
//       />
//     </div>
//   )
// }








// liked properties from the database

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/Card.jsx"
import { Button } from "@/components/ui/Button.jsx"
import { Badge } from "@/components/ui/Badge.jsx"
import { Input } from "@/components/ui/Input.jsx"
import PropertyFilters from "../../property/PropertyFilter.jsx"
import { useProperty } from "../../../context/PropertyContext.jsx"
import { useAuth } from "../../../context/AuthContext.jsx"
import ContactPopUpForm from "../../forms/ContactPopUpForm.jsx"
import { Heart, Search, Grid3X3, List, Home, MapPin, Calendar, Star, Trash2, Share2, Download, Sparkles, Filter, TrendingUp, Loader2 } from 'lucide-react'
import PropertyGrid from "../../property/PropertyGrid.jsx"

export default function Favorites() {
  const { getLikedProperties, toggleLike, filterProperties, isLoadingLikes } = useProperty()
  const { user } = useAuth()
  const [likedProperties, setLikedProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState("grid")
  const [isContactUsOpen, setIsContactUsOpen] = useState(false)

  // Property Filters state
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

  useEffect(() => {
    const properties = getLikedProperties()
    setLikedProperties(properties)
  }, [getLikedProperties])

  useEffect(() => {
    let filtered = [...likedProperties]
    
    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.location.address.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply PropertyFilters using the context's filterProperties function
    // First create a temporary array with all liked properties
    const allLikedIds = likedProperties.map((p) => p.id)
    // Apply filters to all properties, then filter to only liked ones
    const contextFiltered = filterProperties(filters)
    filtered = filtered.filter((property) => contextFiltered.some((contextProp) => contextProp.id === property.id))

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.yearBuilt) - new Date(a.yearBuilt))
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.yearBuilt) - new Date(b.yearBuilt))
        break
      case "size-large":
        filtered.sort((a, b) => b.size - a.size)
        break
      case "size-small":
        filtered.sort((a, b) => a.size - b.size)
        break
      default:
        break
    }

    setFilteredProperties(filtered)
  }, [likedProperties, searchTerm, sortBy, filters, filterProperties])

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleRemoveAll = () => {
    if (window.confirm("Are you sure you want to remove all properties from favorites?")) {
      likedProperties.forEach((property) => {
        toggleLike(property.id)
      })
      setLikedProperties([])
      setFilteredProperties([])
    }
  }

  const handleExportFavorites = () => {
    const data = filteredProperties.map((property) => ({
      title: property.title,
      price: property.price,
      type: property.type,
      location: property.location.address,
      size: property.size,
    }))
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "my-favorite-properties.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const stats = [
    {
      icon: Heart,
      label: "Total Favorites",
      value: likedProperties.length,
      color: "text-red-500",
      bgColor: "bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20",
      change: "+12%",
    },
    {
      icon: Home,
      label: "For Sale",
      value: likedProperties.filter((p) => p.type === "buy").length,
      color: "text-emerald-500",
      bgColor: "bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/20 dark:to-emerald-800/20",
      change: "+8%",
    },
    {
      icon: MapPin,
      label: "For Rent",
      value: likedProperties.filter((p) => p.type === "rent").length,
      color: "text-blue-500",
      bgColor: "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20",
      change: "+15%",
    },
    {
      icon: Star,
      label: "Avg. Rating",
      value: "4.8",
      color: "text-amber-500",
      bgColor: "bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/20 dark:to-amber-800/20",
      change: "+0.2",
    },
  ]

  // Show loading state while fetching liked properties
  if (isLoadingLikes) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-2">Loading Your Favorites</h2>
          <p className="text-slate-600 dark:text-slate-300">Please wait while we fetch your saved properties...</p>
        </div>
      </div>
    )
  }

  if (likedProperties.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative py-32 overflow-hidden"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 bg-mesh opacity-30"></div>
          <div className="absolute top-20 left-10 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center max-w-5xl mx-auto"
            >
              <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 text-lg font-semibold shadow-lg mb-6">
                <Heart className="w-5 h-5 mr-2" />
                My Favorites
              </Badge>
              <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
                Your Favorite
                <span className="block text-gradient bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                  Properties
                </span>
              </h1>
            </motion.div>
          </div>
        </motion.section>

        {/* Empty State */}
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="relative mb-12">
              <div className="w-40 h-40 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <Heart className="w-20 h-20 text-red-400" />
              </div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-amber-400 rounded-full animate-bounce"></div>
              <div
                className="absolute -bottom-4 -left-4 w-6 h-6 bg-emerald-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>
            <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-6">No Favorites Yet</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 leading-relaxed">
              Start exploring our amazing properties and add them to your favorites to see them here. Your dream home is
              waiting!
            </p>
            <Link to={'/'}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-10 py-4 text-lg font-semibold shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105"
              >
                <Home className="mr-2 h-6 w-6" />
                Explore Properties
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative py-20 overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-mesh opacity-30"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center max-w-5xl mx-auto"
          >
            <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 text-lg font-semibold shadow-lg mb-6">
              <Heart className="w-5 h-5 mr-2" />
              My Favorites
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              Your Favorite
              <span className="block text-gradient bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                Properties
              </span>
            </h1>
            <p className="text-2xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Welcome back, <span className="text-amber-600 font-semibold">{user?.name}</span>! Here are all your
              carefully curated properties.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 relative -mt-16 z-10"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center p-8 hover:shadow-2xl transition-all duration-500 group hover:-translate-y-4 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg">
                  <CardContent className="p-0">
                    <motion.div
                      className={`inline-flex items-center justify-center w-20 h-20 ${stat.bgColor} rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <stat.icon className={`w-10 h-10 ${stat.color}`} />
                    </motion.div>
                    <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{stat.value}</h3>
                    <p className="text-slate-600 dark:text-slate-400 font-medium mb-2">{stat.label}</p>
                    <div className="flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                      <span className="text-sm text-emerald-600 font-semibold">{stat.change}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Property Filters Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="py-8"
      >
        <div className="container mx-auto px-4">
          <PropertyFilters filters={filters} onFiltersChange={handleFiltersChange} />
        </div>
      </motion.section>

      {/* Filters and Controls */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="py-8"
      >
        <div className="container mx-auto px-4">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Search and Legacy Filters */}
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Search favorites..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-50 dark:bg-slate-700 border-0 focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border-0 rounded-md focus:ring-2 focus:ring-amber-400 text-sm"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="size-large">Size: Large to Small</option>
                      <option value="size-small">Size: Small to Large</option>
                    </select>
                  </div>
                </div>
                {/* View Controls */}
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-amber-500 hover:bg-amber-600" : ""}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-amber-500 hover:bg-amber-600" : ""}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportFavorites}
                    className="border-emerald-400 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveAll}
                    className="border-red-400 text-red-600 hover:bg-red-50 bg-transparent"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Properties Grid */}
      <motion.section variants={containerVariants} initial="hidden" animate="visible" className="py-16 w-full h-full">
        <div className="container mx-auto px-4">
          {filteredProperties.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                <Search className="w-16 h-16 text-slate-400" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">No Properties Found</h3>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
                Try adjusting your search or filters to find what you're looking for
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSortBy("newest")
                  setFilters({
                    type: "all",
                    propertyType: [],
                    availability: "available",
                    location: undefined,
                    priceRange: undefined,
                    petsAllowed: false,
                    swimmingPool: false,
                    parking: false,
                  })
                }}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3"
              >
                <Filter className="w-4 h-4 mr-2" />
                Reset Filters
              </Button>
            </motion.div>
          ) : (
            <PropertyGrid properties={filteredProperties} />
          )}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-gradient-to-r from-red-500 via-red-600 to-amber-500 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Badge className="bg-white/20 text-white px-6 py-2 text-sm font-semibold mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Ready for the Next Step?
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-8">Turn Dreams Into Reality!</h2>
            <p className="text-2xl mb-12 max-w-3xl mx-auto opacity-90">
              Contact our experts to schedule viewings for your favorite properties and make your dream home a reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                onClick={() => setIsContactUsOpen(true)}
                size="lg"
                className="bg-white text-red-600 hover:bg-gray-100 px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Calendar className="mr-2 h-6 w-6" />
                Schedule Viewing
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <ContactPopUpForm
        isOpen={isContactUsOpen}
        onClose={() => setIsContactUsOpen(false)}
      />
    </div>
  )
}
