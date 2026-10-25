import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Card, CardContent, CardHeader } from "../../ui/Card.jsx"
import { Button } from "../../ui/Button.jsx"
import { Input } from "../../ui/Input.jsx"
import { Label } from "../../ui/Label.jsx"
import { Badge } from "../../ui/Badge.jsx"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/Avtar.jsx"
import { useAuth } from "../../../context/AuthContext.jsx"
import {
  User,
  Mail,
  Phone,
  Lock,
  Camera,
  Save,
  Eye,
  EyeOff,
  Loader2,
  Star,
  Shield,
  Crown,
  Edit3,
  Sparkles,
  Award,
  Calendar,
} from "lucide-react"
import toast from "react-hot-toast"


const profileSchema = yup.object({
  name: yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
  phone: yup.string().matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
})

const passwordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup.string().min(6, "Password must be at least 6 characters").required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
})

export default function ProfilePage() {
  const { user, updateProfile, updatePassword } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [isUpdating, setIsUpdating] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profileImage, setProfileImage] = useState(user?.profilePic || null)
  const fileInputRef = useRef(null)

  const profileForm = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
    },
  })

  const passwordForm = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target.result)
        updateProfile({ profilePic: e.target.result })
        toast.success("Profile image updated successfully!", {
          duration: 3000,
          style: {
            background: "#10B981",
            color: "#fff",
            fontWeight: "600",
            borderRadius: "12px",
            padding: "16px",
          },
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const onProfileSubmit = async (data) => {
    setIsUpdating(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const success = await updateProfile(data)

      if (success) {
        toast.success("Profile updated successfully!", {
          duration: 3000,
          style: {
            background: "white",
            color: "black",
            border: "1px solid black",
            fontWeight: "600",
            borderRadius: "12px",
            padding: "16px",
          },
        })
      } else {
        toast.error("Failed to update profile", {
          duration: 3000,
          style: {
            background: "#EF4444",
            color: "#fff",
            fontWeight: "600",
            borderRadius: "12px",
            padding: "16px",
          },
        })
      }
    } catch (error) {
      toast.error("Failed to update profile", {
        duration: 3000,
        style: {
          background: "#EF4444",
          color: "#fff",
          fontWeight: "600",
          borderRadius: "12px",
          padding: "16px",
        },
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const onPasswordSubmit = async (data) => {
    setIsUpdating(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const success = await updatePassword(data.currentPassword, data.newPassword)

      if (success) {
        passwordForm.reset()
        toast.success("Password updated successfully!", {
          duration: 3000,
          style: {
            background: "#10B981",
            color: "#fff",
            fontWeight: "600",
            borderRadius: "12px",
            padding: "16px",
          },
        })
      } else {
        toast.error("Current password is incorrect", {
          duration: 3000,
          style: {
            background: "#EF4444",
            color: "#fff",
            fontWeight: "600",
            borderRadius: "12px",
            padding: "16px",
          },
        })
      }
    } catch (error) {
      toast.error("Failed to update password", {
        duration: 3000,
        style: {
          background: "#EF4444",
          color: "#fff",
          fontWeight: "600",
          borderRadius: "12px",
          padding: "16px",
        },
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const tabs = [
    { id: "profile", label: "Profile Info", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Star },
  ]

  const stats = [
    { label: "Properties Viewed", value: "24", icon: Eye, color: "text-blue-500" },
    { label: "Favorites", value: "8", icon: Star, color: "text-yellow-500" },
    { label: "Inquiries Sent", value: "12", icon: Mail, color: "text-emerald-500" },
    { label: "Member Since", value: "2024", icon: Calendar, color: "text-purple-500" },
  ]

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Profile Content */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-8 sm:py-12 relative -mt-6 sm:-mt-10 z-10"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Profile Sidebar */}
            <motion.div variants={itemVariants} className="lg:col-span-1 order-2 lg:order-1">
              <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg shadow-xl lg:sticky lg:top-8">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  {/* Profile Image */}
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="relative inline-block">
                      <Avatar className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 border-4 border-yellow-400/30 shadow-2xl">
                        <AvatarImage src={profileImage || "/placeholder.svg?height=128&width=128"} alt={user?.name} />
                        <AvatarFallback className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xl sm:text-2xl lg:text-3xl font-bold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full h-8 w-8 sm:h-10 sm:w-10 shadow-lg"
                      >
                        <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 dark:text-white mt-3 sm:mt-4 break-words">
                      {user?.name}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 break-all">{user?.email}</p>
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 mt-2 text-xs sm:text-sm">
                      <Award className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                      Verified Member
                    </Badge>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3 sm:space-y-4">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center justify-between p-2 sm:p-3 bg-slate-50 dark:bg-slate-700 rounded-xl"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color} flex-shrink-0`} />
                          <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">
                            {stat.label}
                          </span>
                        </div>
                        <span className="font-bold text-sm sm:text-base text-slate-800 dark:text-white flex-shrink-0">
                          {stat.value}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div variants={itemVariants} className="lg:col-span-3 order-1 lg:order-2">
              <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg shadow-xl">
                <CardHeader className="pb-0 p-4 sm:p-6">
                  {/* Tabs */}
                  <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 bg-slate-100 dark:bg-slate-700 rounded-2xl p-1 mb-4 sm:mb-6">
                    {tabs.map((tab) => (
                      <Button
                        key={tab.id}
                        variant="ghost"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 rounded-xl font-semibold transition-all duration-300 text-xs sm:text-sm h-10 sm:h-auto ${
                          activeTab === tab.id
                            ? "bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-lg"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                        }`}
                      >
                        <tab.icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:hidden">{tab.label.slice(0, 4)}</span>
                      </Button>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {activeTab === "profile" && (
                        <div className="space-y-6 sm:space-y-8">
                          <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                              <Edit3 className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                              Personal Information
                            </h3>
                            <form
                              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                              className="space-y-4 sm:space-y-6"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                  <Label
                                    htmlFor="name"
                                    className="text-slate-700 dark:text-slate-300 font-semibold mb-2 block text-sm sm:text-base"
                                  >
                                    Full Name *
                                  </Label>
                                  <div className="relative">
                                    <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
                                    <Input
                                      id="name"
                                      {...profileForm.register("name")}
                                      className={`pl-10 sm:pl-12 h-10 sm:h-12 bg-slate-50 dark:bg-slate-700 border-0 focus:ring-2 focus:ring-yellow-400 rounded-xl text-sm sm:text-base ${
                                        profileForm.formState.errors.name ? "ring-2 ring-red-400" : ""
                                      }`}
                                    />
                                  </div>
                                  {profileForm.formState.errors.name && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-2">
                                      {profileForm.formState.errors.name.message}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <Label className="text-slate-700 dark:text-slate-300 font-semibold mb-2 block text-sm sm:text-base">
                                    Email Address
                                  </Label>
                                  <div className="relative">
                                    <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
                                    <Input
                                      id="email"
                                      value={user?.email}
                                      disabled
                                      className="pl-10 sm:pl-12 h-10 sm:h-12 bg-slate-100 dark:bg-slate-600 dark:text-white border-0 rounded-xl text-slate-500 cursor-not-allowed text-sm sm:text-base"
                                    />
                                  </div>
                                  <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                                </div>
                              </div>
                              <div>
                                <Label
                                  htmlFor="phone"
                                  className="text-slate-700 dark:text-slate-300 font-semibold mb-2 block text-sm sm:text-base"
                                >
                                  Phone Number
                                </Label>
                                <div className="relative">
                                  <Phone className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
                                  <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="Enter 10-digit phone number"
                                    {...profileForm.register("phone")}
                                    className={`pl-10 sm:pl-12 h-10 sm:h-12 bg-slate-50 dark:bg-slate-700 border-0 focus:ring-2 focus:ring-yellow-400 rounded-xl text-sm sm:text-base ${
                                      profileForm.formState.errors.phone ? "ring-2 ring-red-400" : ""
                                    }`}
                                  />
                                </div>
                                {profileForm.formState.errors.phone && (
                                  <p className="text-red-500 text-xs sm:text-sm mt-2">
                                    {profileForm.formState.errors.phone.message}
                                  </p>
                                )}
                              </div>
                              <Button
                                type="submit"
                                disabled={isUpdating}
                                className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white h-10 sm:h-12 px-6 sm:px-8 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl text-sm sm:text-base"
                              >
                                {isUpdating ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                                    Updating...
                                  </>
                                ) : (
                                  <>
                                    <Save className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                                    Save Changes
                                  </>
                                )}
                              </Button>
                            </form>
                          </div>
                        </div>
                      )}

                      {activeTab === "security" && (
                        <div className="space-y-6 sm:space-y-8">
                          <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500" />
                              Change Password
                            </h3>
                            <form
                              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                              className="space-y-4 sm:space-y-6"
                            >
                              <div>
                                <Label
                                  htmlFor="currentPassword"
                                  className="text-slate-700 dark:text-slate-300 font-semibold mb-2 block text-sm sm:text-base"
                                >
                                  Current Password *
                                </Label>
                                <div className="relative">
                                  <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
                                  <Input
                                    id="currentPassword"
                                    type={showCurrentPassword ? "text" : "password"}
                                    placeholder="Enter current password"
                                    {...passwordForm.register("currentPassword")}
                                    className={`pl-10 sm:pl-12 pr-10 sm:pr-12 h-10 sm:h-12 bg-slate-50 dark:bg-slate-700 border-0 focus:ring-2 focus:ring-yellow-400 rounded-xl text-sm sm:text-base ${
                                      passwordForm.formState.errors.currentPassword ? "ring-2 ring-red-400" : ""
                                    }`}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8 p-0"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                  >
                                    {showCurrentPassword ? (
                                      <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                                    ) : (
                                      <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                    )}
                                  </Button>
                                </div>
                                {passwordForm.formState.errors.currentPassword && (
                                  <p className="text-red-500 text-xs sm:text-sm mt-2">
                                    {passwordForm.formState.errors.currentPassword.message}
                                  </p>
                                )}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                  <Label
                                    htmlFor="newPassword"
                                    className="text-slate-700 dark:text-slate-300 font-semibold mb-2 block text-sm sm:text-base"
                                  >
                                    New Password *
                                  </Label>
                                  <div className="relative">
                                    <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
                                    <Input
                                      id="newPassword"
                                      type={showNewPassword ? "text" : "password"}
                                      placeholder="Enter new password"
                                      {...passwordForm.register("newPassword")}
                                      className={`pl-10 sm:pl-12 pr-10 sm:pr-12 h-10 sm:h-12 bg-slate-50 dark:bg-slate-700 border-0 focus:ring-2 focus:ring-yellow-400 rounded-xl text-sm sm:text-base ${
                                        passwordForm.formState.errors.newPassword ? "ring-2 ring-red-400" : ""
                                      }`}
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8 p-0"
                                      onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                      {showNewPassword ? (
                                        <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                                      ) : (
                                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                      )}
                                    </Button>
                                  </div>
                                  {passwordForm.formState.errors.newPassword && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-2">
                                      {passwordForm.formState.errors.newPassword.message}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <Label
                                    htmlFor="confirmPassword"
                                    className="text-slate-700 dark:text-slate-300 font-semibold mb-2 block text-sm sm:text-base"
                                  >
                                    Confirm Password *
                                  </Label>
                                  <div className="relative">
                                    <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
                                    <Input
                                      id="confirmPassword"
                                      type={showConfirmPassword ? "text" : "password"}
                                      placeholder="Confirm new password"
                                      {...passwordForm.register("confirmPassword")}
                                      className={`pl-10 sm:pl-12 pr-10 sm:pr-12 h-10 sm:h-12 bg-slate-50 dark:bg-slate-700 border-0 focus:ring-2 focus:ring-yellow-400 rounded-xl text-sm sm:text-base ${
                                        passwordForm.formState.errors.confirmPassword ? "ring-2 ring-red-400" : ""
                                      }`}
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8 p-0"
                                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                      {showConfirmPassword ? (
                                        <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                                      ) : (
                                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                      )}
                                    </Button>
                                  </div>
                                  {passwordForm.formState.errors.confirmPassword && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-2">
                                      {passwordForm.formState.errors.confirmPassword.message}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <Button
                                type="submit"
                                disabled={isUpdating}
                                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white h-10 sm:h-12 px-6 sm:px-8 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl text-sm sm:text-base"
                              >
                                {isUpdating ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                                    Updating...
                                  </>
                                ) : (
                                  <>
                                    <Shield className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                                    Update Password
                                  </>
                                )}
                              </Button>
                            </form>
                          </div>

                          {/* Security Info */}
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 sm:p-6 rounded-2xl border border-blue-200/50 dark:border-blue-700/50">
                            <h4 className="text-base sm:text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                              <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                              Security Tips
                            </h4>
                            <ul className="text-xs sm:text-sm text-blue-700 dark:text-blue-400 space-y-2">
                              <li>• Use a strong password with at least 8 characters</li>
                              <li>• Include uppercase, lowercase, numbers, and symbols</li>
                              <li>• Don't reuse passwords from other accounts</li>
                              <li>• Change your password regularly</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {activeTab === "preferences" && (
                        <div className="space-y-6 sm:space-y-8">
                          <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                              <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                              Account Preferences
                            </h3>
                            <div className="space-y-4 sm:space-y-6">
                              <div className="p-4 sm:p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-2xl">
                                <h4 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                                  Premium Features
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                  <div className="flex items-center justify-between p-3 sm:p-4 bg-white dark:bg-slate-700 rounded-xl">
                                    <span className="text-sm sm:text-base text-slate-700 dark:text-slate-300">
                                      Email Notifications
                                    </span>
                                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 text-xs">
                                      Enabled
                                    </Badge>
                                  </div>
                                  <div className="flex items-center justify-between p-3 sm:p-4 bg-white dark:bg-slate-700 rounded-xl">
                                    <span className="text-sm sm:text-base text-slate-700 dark:text-slate-300">
                                      SMS Alerts
                                    </span>
                                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 text-xs">
                                      Enabled
                                    </Badge>
                                  </div>
                                  <div className="flex items-center justify-between p-3 sm:p-4 bg-white dark:bg-slate-700 rounded-xl">
                                    <span className="text-sm sm:text-base text-slate-700 dark:text-slate-300">
                                      Priority Support
                                    </span>
                                    <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 text-xs">
                                      Premium
                                    </Badge>
                                  </div>
                                  <div className="flex items-center justify-between p-3 sm:p-4 bg-white dark:bg-slate-700 rounded-xl">
                                    <span className="text-sm sm:text-base text-slate-700 dark:text-slate-300">
                                      Advanced Filters
                                    </span>
                                    <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 text-xs">
                                      Premium
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="text-center">
                                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4 px-2">
                                  Enjoying Dream Homes? Your premium membership gives you access to exclusive features!
                                </p>
                                <Button className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base">
                                  <Crown className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                                  Manage Subscription
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}