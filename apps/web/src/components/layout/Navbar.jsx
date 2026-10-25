import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "../ui/Button.jsx"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avtar.jsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/DropDownMenu.jsx"
import { useTheme } from "../ThemeProvider.jsx"
import { useAuth } from "../../context/AuthContext.jsx"
import { Building2, Heart, User, LogOut, Sun, Moon, Home, Info, Phone, Menu, X, Sparkles, Bell } from "lucide-react"
import { Badge } from "../ui/Badge.jsx"
import { useProperty } from "../../context/PropertyContext.jsx"

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const {likedProperties} = useProperty()

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const getCurrentPage = () => {
    const path = location.pathname
    if (path === "/") return "home"
    if (path === "/favorites") return "favorites"
    if (path === "/about") return "about"
    if (path === "/contact") return "contact"
    if (path === "/profile") return "profile"
    return "home"
  }

  const currentPage = getCurrentPage()

  const handleNavigation = (page) => {
    setIsMobileMenuOpen(false)
    switch (page) {
      case "home":
        navigate("/")
        break
      case "favorites":
        navigate("/favorites")
        break
      case "about":
        navigate("/about")
        break
      case "contact":
        navigate("/contact")
        break
      case "profile":
        navigate("/profile")
        break
      default:
        navigate("/")
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/")
    window.location.reload()
  }

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  const getThemeIcon = () => {
    if (!mounted) return <Sun className="h-5 w-5" />

    if (theme === "light") return <Sun className="h-5 w-5" />
    if (theme === "dark") return <Moon className="h-5 w-5" />

    // System theme - show based on actual system preference
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    return systemTheme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />
  }

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "about", label: "About", icon: Info },
    { id: "contact", label: "Contact", icon: Phone },
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg shadow-gold-500/5"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => handleNavigation("home")}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gold-400 to-gold-600 rounded-2xl blur opacity-75 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-gold-500 to-gold-600 p-3 rounded-2xl shadow-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold text-gradient">Dream <span className="text-[15px] sm:text-2xl">Homes</span></span>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-gold-500" />
                <span className="text-xs text-slate-500 dark:text-slate-400">Premium Real Estate</span>
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <motion.div key={item.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={currentPage === item.id ? "default" : "ghost"}
                  onClick={() => handleNavigation(item.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    currentPage === item.id
                      ? "bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-lg shadow-gold-500/25"
                      : "text-slate-600 dark:text-slate-300 hover:text-gold-600 hover:bg-gold-50 dark:hover:bg-gold-900/20"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {item.id === "favorites" && <Badge className="bg-red-500 text-white text-xs px-2 py-1 ml-1">{likedProperties.length}</Badge>}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            {/* <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-slate-600 dark:text-slate-300 hover:text-gold-600 hover:bg-gold-50 dark:hover:bg-gold-900/20 rounded-xl"
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5">2</Badge>
              </Button>
            </motion.div> */}

            {/* Theme Toggle */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-slate-600 dark:text-slate-300 hover:text-gold-600 hover:bg-gold-50 dark:hover:bg-gold-900/20 rounded-xl"
                aria-label="Change theme"
                title={`Current theme: ${theme}. Click to cycle through light/dark/system`}
              >
                {getThemeIcon()}
              </Button>
            </motion.div>

            {/* Guests see a sign-in button. Signed-in users see the account menu. */}
            {!user ? (
              <Button
                onClick={() => navigate("/profile")}
                className="rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold"
              >
                Sign in
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      aria-label="Account menu"
                    className="relative h-12 w-12 rounded-full p-0 ring-2 ring-gold-400/20 hover:ring-gold-400/40 transition-all duration-300"
                    >
                      <Avatar className="h-12 w-12 border-2 border-gold-400/20">
                        <AvatarImage src={user?.profilePic || "/placeholder.svg"} alt={user?.name} />
                        <AvatarFallback className="bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold text-lg">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 p-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 shadow-xl"
                  align="end"
                  forceMount
                >
                  <div className="flex items-center justify-start gap-3 p-3 rounded-lg bg-gradient-to-r from-gold-50 to-gold-100 dark:from-gold-400 dark:to-gold-500">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user?.profilePic || "/placeholder.svg"} alt={user?.name} />
                      <AvatarFallback className="bg-gradient-to-r from-gold-500 to-gold-600 text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-semibold text-slate-800 dark:text-white mb-2">{user?.name}</p>
                      {/* <p className="w-[180px] truncate text-sm text-slate-600 dark:text-white/80">{user?.email}</p> */}
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-green-500 dark:border dark:border-green-600 dark:text-white text-xs w-fit">
                        Member
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="my-2" />

                  {/* Theme Selection in Dropdown */}
                  <DropdownMenuItem
                    onClick={toggleTheme}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gold-50 dark:hover:bg-gold-400 cursor-pointer"
                  >
                    {getThemeIcon()}
                    <span className="font-medium">
                      Theme: {theme === "system" ? "System" : theme === "light" ? "Light" : "Dark"}
                    </span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-2" />

                  <DropdownMenuItem
                    onClick={() => handleNavigation("profile")}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gold-50 dark:hover:bg-gold-400 cursor-pointer"
                  >
                    <User className="h-5 w-5 text-gold-900" />
                    <span className="font-medium">Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNavigation("favorites")}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-gold-400 cursor-pointer"
                  >
                    <Heart className="h-5 w-5 text-red-600" />
                    <span className="font-medium">My Favorites</span>
                    <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-white text-xs ml-auto">
                     {likedProperties.length}
                    </Badge>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-gold-500 cursor-pointer text-[#FF0000]"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                  className="text-slate-600 dark:text-slate-300 hover:text-gold-600 hover:bg-gold-50 dark:hover:bg-gold-900/20 rounded-xl"
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-slate-200/50 dark:border-slate-700/50 py-4"
            >
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Button
                      variant={currentPage === item.id ? "default" : "ghost"}
                      onClick={() => handleNavigation(item.id)}
                      className={`w-full justify-start space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        currentPage === item.id
                          ? "bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-lg"
                          : "text-slate-600 dark:text-slate-300 hover:text-gold-600 hover:bg-gold-50 dark:hover:bg-gold-900/20"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                      {item.id === "favorites" && (
                        <Badge className="bg-red-500 text-white text-xs px-2 py-1 ml-auto">3</Badge>
                      )}
                    </Button>
                  </motion.div>
                ))}

                {/* Mobile Profile Link */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <Button
                    variant={currentPage === "profile" ? "default" : "ghost"}
                    onClick={() => handleNavigation("profile")}
                    className={`w-full justify-start space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                      currentPage === "profile"
                        ? "bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-lg"
                        : "text-slate-600 dark:text-slate-300 hover:text-gold-600 hover:bg-gold-50 dark:hover:bg-gold-900/20"
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Button>
                </motion.div>

                {/* Mobile Theme Toggle */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <Button
                    variant="ghost"
                    onClick={toggleTheme}
                    className="w-full justify-start space-x-3 px-4 py-3 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:text-gold-600 hover:bg-gold-50 dark:hover:bg-gold-900/20"
                  >
                    {getThemeIcon()}
                    <span>Theme: {theme === "system" ? "System" : theme === "light" ? "Light" : "Dark"}</span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
