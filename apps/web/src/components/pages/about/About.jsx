import { motion } from "framer-motion"
import { useRef, useState } from "react"
import ContactPopUpForm from "../../forms/ContactPopUpForm.jsx"
import { Card, CardContent } from "@/components/ui/Card.jsx"
import { Badge } from "@/components/ui/Badge.jsx"
import { Button } from "@/components/ui/Button.jsx"
import { aboutUsData } from "../../../data/globalData.js"
import { useProperty } from "../../../context/PropertyContext.jsx"
import { Link } from "react-router-dom"
import {
  Building2,
  Users,
  Award,
  MapPin,
  Tag,
  KeyRound,
  Target,
  Eye,
  Heart,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  Shield,
  Lightbulb,
  Sparkles,
  ArrowRight,
  Star,
  CheckCircle,
} from "lucide-react"


export default function AboutUs() {
  const targetRef = useRef(null)
  const handleScroll = () => {
    targetRef.current?.scrollIntoView({ behavior: "smooth" });
  };
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

  // Every number is computed from live listings. No invented figures.
  const { properties: liveListings } = useProperty()
  const cityCount = new Set(liveListings.map((p) => p.location?.city).filter(Boolean)).size
  const stats = [
    { icon: Building2, label: "Live listings", value: String(liveListings.length), color: "text-gold-600", bg: "bg-gold-100 dark:bg-gold-900/20" },
    { icon: MapPin, label: "Cities", value: String(cityCount), color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/20" },
    { icon: Tag, label: "For sale", value: String(liveListings.filter((p) => p.type === "buy").length), color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/20" },
    { icon: KeyRound, label: "For rent", value: String(liveListings.filter((p) => p.type === "rent").length), color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/20" },
  ]

  const values = [
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "Complete transparency in all our dealings with zero hidden costs",
      color: "gold",
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "Your satisfaction is our top priority in every interaction",
      color: "red",
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "Cutting-edge technology to enhance your property experience",
      color: "emerald",
    },
    {
      icon: Lightbulb,
      title: "Excellence",
      description: "Delivering exceptional service that exceeds expectations",
      color: "blue",
    },
  ]

  const [isContactUsOpen, setIsContactUsOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gold-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative py-20 overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-mesh opacity-30"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-gold-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8"
            >
              <Badge className="bg-gradient-to-r from-gold-500 to-gold-600 text-white px-8 py-3 text-lg font-semibold shadow-lg mb-6">
                <Sparkles className="w-5 h-5 mr-2" />
                About Dream Homes
              </Badge>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              Building
              <span className="block text-gradient bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent">
                Dream Homes
              </span>
              <span className="text-emerald-600 dark:text-emerald-400">Since 2008</span>
            </h1>

            <p className="text-2xl text-slate-600 dark:text-slate-300 leading-relaxed mb-12 max-w-4xl mx-auto">
              {aboutUsData.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-10 py-4 text-lg font-semibold shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105"
              >
                Our Story
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button

                onClick={handleScroll}
                variant="outline"
                size="lg"
                className="border-2 border-gold-400 text-gold-600 hover:bg-gold-50 dark:hover:bg-gold-900/20 dark:hover:text-white px-10 py-4 text-lg font-semibold backdrop-blur-sm bg-transparent"
              >
                Meet Our Team
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center p-8 hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg group hover:-translate-y-4 hover:rotate-1">
                  <CardContent className="p-0">
                    <motion.div
                      className={`inline-flex items-center justify-center w-20 h-20 ${stat.bg} rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <stat.icon className={`w-10 h-10 ${stat.color}`} />
                    </motion.div>
                    <h3 className="text-4xl font-bold text-slate-800 dark:text-white mb-3">{stat.value}</h3>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Mission & Vision Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-24 bg-gradient-to-r from-gold-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="text-center mb-20">
            <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2 text-sm font-semibold mb-6">
              Our Purpose
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-slate-800 dark:text-white mb-6">
              Mission & <span className="text-gradient">Vision</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Driving the future of real estate with innovation and excellence
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div variants={itemVariants}>
              <Card className="h-full p-10 hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-gold-50 dark:from-slate-800 dark:to-slate-700 group hover:-translate-y-2">
                <CardContent className="p-0">
                  <div className="flex items-center mb-8">
                    <div className="p-4 bg-gradient-to-r from-gold-500 to-gold-600 rounded-2xl mr-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Target className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800 dark:text-white">Our Mission</h3>
                  </div>
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                    {aboutUsData.mission}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Badge className="bg-gold-100 text-gold-700 px-4 py-2">Transparency</Badge>
                    <Badge className="bg-emerald-100 text-emerald-700 px-4 py-2">Excellence</Badge>
                    <Badge className="bg-blue-100 text-blue-700 px-4 py-2">Innovation</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full p-10 hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-slate-700 group hover:-translate-y-2">
                <CardContent className="p-0">
                  <div className="flex items-center mb-8">
                    <div className="p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl mr-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Eye className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800 dark:text-white">Our Vision</h3>
                  </div>
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                    {aboutUsData.vision}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Badge className="bg-purple-100 text-purple-700 px-4 py-2">Trust</Badge>
                    <Badge className="bg-red-100 text-red-700 px-4 py-2">Leadership</Badge>
                    <Badge className="bg-blue-100 text-blue-700 px-4 py-2">Growth</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-24 bg-white dark:bg-slate-900"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="text-center mb-20">
            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 text-sm font-semibold mb-6">
              Core Values
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-slate-800 dark:text-white mb-6">
              What We <span className="text-gradient">Stand For</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center p-8 h-full hover:shadow-2xl transition-all duration-500 group hover:-translate-y-4 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700">
                  <CardContent className="p-0">
                    <motion.div
                      className={`inline-flex items-center justify-center w-20 h-20 bg-${value.color}-100 dark:bg-${value.color}-900/20 rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <value.icon className={`w-10 h-10 text-${value.color}-600 dark:text-${value.color}-400`} />
                    </motion.div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{value.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        ref={targetRef}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-24 bg-gradient-to-r from-slate-50 to-gold-50 dark:from-slate-900 dark:to-slate-800"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="text-center mb-20">
            <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 text-sm font-semibold mb-6">
              Our Team
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-slate-800 dark:text-white mb-6">
              Meet Our <span className="text-gradient">Experts</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              The passionate professionals behind Dream Homes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            {aboutUsData.team.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 group border-0 bg-white dark:bg-slate-800">
                  <div className="relative aspect-[3/4] w-full overflow-hidden">
                    <img loading="lazy" decoding="async"
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex space-x-3">
                        <Button
                          size="sm"
                          className="bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30"
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{member.name}</h3>
                    <Badge className="bg-gradient-to-r from-gold-500 to-gold-600 text-white mb-4 px-4 py-1">
                      {member.position}
                    </Badge>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{member.description}</p>
                    <div className="flex items-center mt-4">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-gold-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-slate-500 ml-2">5.0 Rating</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-gradient-to-r from-gold-500 via-gold-600 to-emerald-500 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Badge className="bg-white/20 text-white px-6 py-2 text-sm font-semibold mb-8 backdrop-blur-sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              Ready to Start?
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-8">Ready to Find Your Dream Home?</h2>
            <p className="text-2xl mb-12 max-w-3xl mx-auto opacity-90">
              Join Dream Homes to save the homes you like and ask about them on your terms
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to={"/"}>
                <Button
                  size="lg"
                  className="bg-white text-gold-600 hover:bg-gray-100 px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <Building2 className="mr-2 h-6 w-6" />
                  Browse Properties
                </Button>
              </Link>
              <Button
                size="lg"
                onClick={() => setIsContactUsOpen(true)}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-gold-600 bg-transparent px-10 py-4 text-lg font-semibold backdrop-blur-sm"
              >
                <Phone className="mr-2 h-6 w-6" />
                Contact Us Today
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
