import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import LoginForm from "./LoginForm.jsx"
import SignupForm from "./SignUpForm.jsx"
import { Card, CardContent } from "../ui/Card.jsx"
import { Button } from "../ui/Button.jsx"
import { Building2, Sparkles, Star, Users, Award, Shield, Eye } from "lucide-react"
import { Badge } from "../ui/Badge.jsx"

export default function AuthPage({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const features = [
    {
      icon: Building2,
      title: "Browse homes",
      description: "Curated premium listings",
      color: "from-gold-400 to-gold-600",
    },
    {
      icon: Users,
      title: "Your saved homes",
      description: "Keep every home you like in one place",
      color: "from-emerald-400 to-emerald-600",
    },
    {
      icon: Award,
      title: "Browse freely",
      description: "No account needed to look around",
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: Shield,
      title: "Consent first",
      description: "We contact you only when you agree",
      color: "from-purple-400 to-purple-600",
    },
  ]

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Property Buyer",
      content: "Found my dream home in just 2 weeks! Amazing service.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Rajesh Kumar",
      role: "Real Estate Investor",
      content: "Best platform for property investment. Highly recommended!",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Anita Patel",
      role: "First-time Buyer",
      content: "The team guided me through every step. Excellent experience!",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gold-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-center p-12 xl:p-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            {/* Logo & Brand */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center mb-8"
            >
              <div className="relative mr-4">
                <div className="absolute inset-0 bg-gradient-to-r from-gold-400 to-gold-600 rounded-3xl blur-lg opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-gold-500 to-gold-600 p-4 rounded-3xl shadow-2xl">
                  <Building2 className="h-12 w-12 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl xl:text-5xl font-bold text-gradient mb-2">Dream Homes</h1>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold-500" />
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Premium Real Estate Platform</span>
                </div>
              </div>
            </motion.div>

            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-12"
            >
              <h2 className="text-3xl xl:text-4xl font-bold text-slate-800 dark:text-white mb-6 leading-tight">
                Discover Your
                <span className="block text-gradient">Dream Home</span>
                <span className="text-emerald-600 dark:text-emerald-400">Today</span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                Save the homes you like and come back to them anytime. Browsing never needs an account.
                Experience luxury, comfort, and excellence.
              </p>

              <div className="flex flex-wrap gap-4">
                <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 text-sm font-semibold shadow-lg">
                  <Shield className="w-4 h-4 mr-2" />
                  Contact only with consent
                </Badge>
              </div>
            </motion.div>

            {/* Features Grid */}
            {/* <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 gap-6 mb-12"
            >
              {features?.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group"
                >
                  <Card className="p-6 h-full border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:shadow-gold-500/20">
                    <CardContent className="p-0">
                      <div
                        className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${feature.color} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-slate-800 dark:text-white mb-2 group-hover:text-gold-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div> */}

            {/* Testimonials */}
            {/* <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">What Our Clients Say</h3>
              <div className="space-y-4">
                {testimonials?.slice(0, 2).map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/20"
                  >
                    <img loading="lazy" decoding="async"
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gold-400/30"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-slate-800 dark:text-white">{testimonial.name}</h4>
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-gold-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">"{testimonial.content}"</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">{testimonial.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div> */}
          </motion.div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-3/5 xl:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-lg"
          >
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center mb-4"
              >
                <div className="relative mr-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-gold-400 to-gold-600 rounded-2xl blur opacity-75 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-gold-500 to-gold-600 p-3 rounded-2xl shadow-lg">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gradient">Dream Homes</h1>
                  <div className="flex items-center gap-1 justify-center">
                    <Sparkles className="w-3 h-3 text-gold-500" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">Premium Real Estate</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Auth Card */}
            <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-2xl shadow-gold-500/10 overflow-hidden">
              <CardContent className="p-0">
                {/* Tab Header */}
                <div className="p-8 pb-0">
                  <div className="text-center mb-8">
                    <motion.h2
                      key={isLogin ? "login" : "signup"}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-3xl font-bold text-slate-800 dark:text-white mb-2"
                    >
                      {isLogin ? "Welcome Back!" : "Join Dream Homes"}
                    </motion.h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      {isLogin ? "Sign in to access your account" : "Create your account to get started"}
                    </p>
                  </div>

                  {/* Tab Buttons */}
                  <div className="flex bg-slate-100 dark:bg-slate-700 rounded-2xl p-1 mb-8">
                    <Button
                      variant="ghost"
                      className={`flex-1 rounded-xl font-semibold transition-all duration-300 ${isLogin
                          ? "bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-lg"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                        }`}
                      onClick={() => setIsLogin(true)}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="ghost"
                      className={`flex-1 rounded-xl font-semibold transition-all duration-300 ${!isLogin
                          ? "bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-lg"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                        }`}
                      onClick={() => setIsLogin(false)}
                    >
                      Sign Up
                    </Button>
                  </div>
                </div>

                {/* Form Content */}
                <div className="px-8 pb-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isLogin ? "login" : "signup"}
                      initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isLogin ? (
                        <LoginForm onSuccess={onAuthSuccess} setIsLoading={setIsLoading} />
                      ) : (
                        <SignupForm onSuccess={onAuthSuccess} setIsLoading={setIsLoading} />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="px-8 pb-8 pt-0">
                  <div className="text-center text-sm text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-6">
                    <p className="mb-4">
                      {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                      <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-gold-600 hover:text-gold-700 font-semibold transition-colors"
                      >
                        {isLogin ? "Sign up here" : "Sign in here"}
                      </button>
                    </p>
                    <div className="flex items-center justify-center gap-4 text-xs">
                      <span>🔒 SSL Secured</span>
                      <span>•</span>
                      <span>🛡️ Privacy Protected</span>
                      <span>•</span>
                      <span>⚡ Instant Access</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Demo Credentials */}
            {/* {isLogin && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">Demo Credentials</span>
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                  <p>📧 Email: demo@example.com</p>
                  <p>🔑 Password: demo123</p>
                </div>
              </motion.div>
            )} */}
          </motion.div>
        </div>

      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl"
            >
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gold-500 mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">Processing...</h3>
                <p className="text-slate-600 dark:text-slate-400">Please wait a moment</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
