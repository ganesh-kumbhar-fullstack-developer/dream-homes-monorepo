import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { api } from "../../../lib/api.js"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import toast from "react-hot-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx"
import { Button } from "@/components/ui/Button.jsx"
import { Input } from "@/components/ui/Input.jsx"
import { Label } from "@/components/ui/Label.jsx"
import { Badge } from "@/components/ui/Badge.jsx"
import { contactData } from "../../../data/globalData.js"
import ContactPopUpForm from "../../forms/ContactPopUpForm.jsx"
import { FaWhatsapp } from "react-icons/fa";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Building2,
  Star,
  Facebook,
  Twitter,
  Github,
  Instagram,
  Linkedin,
  Users,
  Award,
  Headphones,
  Sparkles,
  ArrowRight,
  Globe,
  Zap,
} from "lucide-react"

const schema = yup.object({
  consent: yup.boolean().oneOf([true], "Please agree to be contacted"),
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  subject: yup.string().required("Subject is required"),
  message: yup.string().min(10, "Message must be at least 10 characters").required("Message is required"),
})

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const targetRef = useRef(null)
  const handleScroll = () => {
    targetRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await api.createEnquiry({
        name: data.name,
        phone: data.phone,
        email: data.email ?? "",
        message: data.subject ? `Subject: ${data.subject}\n\n${data.message}` : data.message,
        property: null,
        consent_contact: data.consent === true,
        source: "website_form",
      });
      const response = { status: 200 };

      if (response.status === 200) {
        console.log("Contact form data:", data);
        toast.success(
          <>
            Form submitted successfully! <br />
            We'll get back to you soon.
          </>
        );

        reset();
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Office",
      content: contactData.address,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20",
      description: "Come visit our beautiful office space",
    },
    {
      icon: Phone,
      title: "Call Us Anytime",
      content: contactData.phone,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/20 dark:to-emerald-800/20",
      description: "Reach us by phone or email",
    },
    {
      icon: Mail,
      title: "Email Support",
      content: contactData.email,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20",
      description: "Quick response within 2 hours",
    },
    {
      icon: Clock,
      title: "Working Hours",
      content: contactData.hours,
      color: "text-gold-600 dark:text-gold-400",
      bgColor: "bg-gradient-to-br from-gold-100 to-gold-200 dark:from-gold-900/20 dark:to-gold-800/20",
      description: "Extended hours for your convenience",
    },
  ]

  const features = [
    {
      icon: Headphones,
      title: "Talk to our team",
      description: "Round-the-clock customer support with dedicated account managers",
      color: "gold",
    },
    {
      icon: Users,
      title: "Property guidance",
      description: "Experienced real estate professionals to guide your journey",
      color: "emerald",
    },
    {
      icon: Award,
      title: "Contact only with consent",
      description: "We reach out only when you ask us to",
      color: "blue",
    },
    {
      icon: Zap,
      title: "Lightning Fast Response",
      description: "Average response time under 30 minutes for all inquiries",
      color: "purple",
    },
  ]

  const socialLinks = [
    { icon: Facebook, href: contactData.socialMedia.facebook, color: "hover:text-blue-600", bg: "hover:bg-blue-50" },
    { icon: Github, href: contactData.socialMedia.github, color: "hover:text-gray-800", bg: "hover:bg-gray-100" },
    { icon: Instagram, href: contactData.socialMedia.instagram, color: "hover:text-pink-600", bg: "hover:bg-pink-50" },
    { icon: Linkedin, href: contactData.socialMedia.linkedin, color: "hover:text-blue-700", bg: "hover:bg-blue-50" },
  ]

  const [isContactUsOpen, setIsContactUsOpen] = useState(false)



  return (
    <>
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
                className="mb-8 cursor-pointer"
                onClick={() => setIsContactUsOpen(true)}
              >
                <Badge className="bg-gradient-to-r from-gold-500 to-gold-600 text-white px-8 py-3 text-lg font-semibold shadow-lg mb-6">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Get In Touch
                </Badge>
              </motion.div>

              <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
                Let's Start a
                <span className="block text-gradient bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent">
                  Conversation
                </span>
              </h1>

              <p className="text-2xl text-slate-600 dark:text-slate-300 leading-relaxed mb-12 max-w-4xl mx-auto">
                Have questions? We'd love to hear from you. Send us a message and we'll respond faster than you can
                imagine.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  onClick={() => {
                    // setIsContactUsOpen(true)
                    handleScroll()
                  }}
                  size="lg"
                  className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-10 py-4 text-lg font-semibold shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Start Conversation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <a
                  href="https://wa.me/919096378354?text=Hello%2C%20I%20am%20interested%20in%20your%20services"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 dark:hover:bg-[#25D366]/20 dark:hover:text-white px-10 py-4 text-lg font-semibold backdrop-blur-sm bg-transparent"

                  >
                    <FaWhatsapp className="mr-2 h-8 w-8 text-green" />
                    Whatsapp Us
                  </Button>
                </a>

              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Contact Info Cards */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-20 relative -mt-16 z-10"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactInfo.map((info, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="text-center p-8 hover:shadow-2xl transition-all duration-500 group hover:-translate-y-4 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg">
                    <CardContent className="p-0">
                      <motion.div
                        className={`inline-flex items-center justify-center w-20 h-20 ${info.bgColor} rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <info.icon className={`w-10 h-10 ${info.color}`} />
                      </motion.div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">{info.title}</h3>
                      <p className="text-slate-600 dark:text-slate-300 font-medium mb-2">{info.content}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{info.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Contact Form & Info Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-24 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
        >
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <motion.div variants={itemVariants}>
                <Card className="p-10 hover:shadow-2xl transition-all duration-500 border-0 bg-white dark:bg-slate-800">
                  <CardHeader className="p-0 mb-8">
                    <div className="flex items-center mb-6">
                      <div className="p-3 bg-gradient-to-r from-gold-500 to-gold-600 rounded-2xl mr-4 shadow-lg">
                        <Send className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-bold text-slate-800 dark:text-white">
                          Send us a Message
                        </CardTitle>
                        <p className="text-slate-600 dark:text-slate-300 mt-2">We'll get back to you within 24 hours</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent ref={targetRef} className="p-0">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-semibold">
                            Full Name *
                          </Label>
                          <Input
                            id="name"
                            placeholder="Enter your full name"
                            {...register("name")}
                            className={`mt-2 h-12 bg-slate-50 dark:bg-slate-700 border-0 ring-1 ring-gold-400 focus:ring-2 focus:ring-gold-600 ${errors.name ? "ring-2 ring-red-400" : ""}`}
                          />
                          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                          <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-semibold">
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            {...register("email")}
                            className={`mt-2 h-12 bg-slate-50 dark:bg-slate-700 border-0 ring-1 ring-gold-400 focus:ring-2 focus:ring-gold-400 ${errors.email ? "ring-2 ring-red-400" : ""}`}
                          />
                          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="phone" className="text-slate-700 dark:text-slate-300 font-semibold">
                            Phone Number
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            {...register("phone")}
                            className={`mt-2 h-12 bg-slate-50 dark:bg-slate-700 border-0 ring-1 ring-gold-400  focus:ring-2 focus:ring-gold-400 ${errors.phone ? "ring-2 ring-red-400" : ""}`}
                          />
                          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                        </div>

                        <div>
                          <Label htmlFor="subject" className="text-slate-700 dark:text-slate-300 font-semibold">
                            Subject *
                          </Label>
                          <Input
                            id="subject"
                            placeholder="Enter subject"
                            {...register("subject")}
                            className={`mt-2 h-12 bg-slate-50 dark:bg-slate-700 border-0 ring-1 ring-gold-400 focus:ring-2 focus:ring-gold-400 ${errors.subject ? "ring-2 ring-red-400" : ""}`}
                          />
                          {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="message" className="text-slate-700 dark:text-slate-300 font-semibold">
                          Message *
                        </Label>
                        <textarea
                          id="message"
                          rows={6}
                          placeholder="Tell us how we can help you..."
                          {...register("message")}
                          className={`mt-2 ring-1 ring-gold-400 flex w-full rounded-lg bg-slate-50 dark:bg-slate-700 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-0 ${errors.message ? "ring-2 ring-red-400" : ""}`}
                        />
                        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                      </div>

                      <label className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                        <input type="checkbox" {...register("consent")} className="mt-0.5 size-4 accent-amber-500" />
                        <span>I agree that Dream Homes may contact me about my enquiry by phone, SMS or WhatsApp.</span>
                      </label>
                      {errors.consent && <p className="text-red-500 text-xs">{errors.consent.message}</p>}

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            Sending Message...
                          </>
                        ) : (
                          <>
                            <Send className="mr-3 h-5 w-5" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Info & Social */}
              <motion.div variants={itemVariants} className="space-y-8">
                {/* Map Placeholder */}
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-0">
                  <div className="h-80 bg-gradient-to-br from-gold-100 via-gold-200 to-emerald-200 dark:from-gold-900/20 dark:via-gold-800/20 dark:to-emerald-900/20 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-mesh opacity-20"></div>
                    <div className="text-center relative z-10">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className="mb-6"
                      >
                        <MapPin className="w-20 h-20 text-gold-600 dark:text-gold-400 mx-auto" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Find Us Here</h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-4">Interactive map integration coming soon</p>
                      <Badge className="bg-white/80 text-slate-700 px-4 py-2">
                        <Globe className="w-4 h-4 mr-2" />
                        Pune, Maharashtra
                      </Badge>
                    </div>
                  </div>
                </Card>

                {/* Social Media */}
                <Card className="p-8 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700">
                  <CardContent className="p-0">
                    <div className="flex items-center mb-6">
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl mr-4 shadow-lg">
                        <Star className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Follow Our Journey</h3>
                        <p className="text-slate-600 dark:text-slate-300">Stay connected for latest updates</p>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                      Follow us for the latest property listings and updates.
                    </p>
                    <div className="flex space-x-4">
                      {socialLinks.map((social, index) => (
                        <motion.div key={index} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            variant="outline"
                            size="icon"
                            className={`h-12 w-12 border-2 ${social.bg} ${social.color} transition-all duration-300 hover:shadow-lg`}
                            onClick={() => window.open(social.href, "_blank")}
                          >
                            <social.icon className="w-6 h-6" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-24 bg-gradient-to-r from-slate-50 to-gold-50 dark:from-slate-900 dark:to-slate-800"
        >
          <div className="container mx-auto px-4">
            <motion.div variants={itemVariants} className="text-center mb-20">
              <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2 text-sm font-semibold mb-6">
                Why Choose Us
              </Badge>
              <h2 className="text-5xl md:text-6xl font-bold text-slate-800 dark:text-white mb-6">
                Exceptional <span className="text-gradient">Service</span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                We're here to help with your property questions
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="text-center p-8 h-full hover:shadow-2xl transition-all duration-500 group hover:-translate-y-4 border-0 bg-white dark:bg-slate-800">
                    <CardContent className="p-0">
                      <motion.div
                        className={`inline-flex items-center justify-center w-20 h-20 bg-${feature.color}-100 dark:bg-${feature.color}-900/20 rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <feature.icon className={`w-10 h-10 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                      </motion.div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{feature.title}</h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{feature.description}</p>
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
                Ready to Connect?
              </Badge>
              <h2 className="text-5xl md:text-6xl font-bold mb-8">Let's Make It Happen!</h2>
              <p className="text-2xl mb-12 max-w-3xl mx-auto opacity-90">
                Your dream property is just one conversation away. Let's discuss your needs today.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to={'/'}>
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
                  Schedule Call
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
      <ContactPopUpForm
        isOpen={isContactUsOpen}
        onClose={() => setIsContactUsOpen(false)}
      />
    </>
  )
}
