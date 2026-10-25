import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button } from "@/components/ui/Button.jsx";
import { Input } from "@/components/ui/Input.jsx";
import { Label } from "@/components/ui/Label.jsx";
import { Card, CardContent } from "@/components/ui/Card.jsx";
import { Badge } from "@/components/ui/Badge.jsx";
import { Textarea } from "@/components/ui/Textarea.jsx";
import axios from "axios";
import { api } from "../../lib/api.js";
import {
  X,
  User,
  Mail,
  Phone,
  MessageCircle,
  Send,
  Loader2,
  CheckCircle,
  Star,
  HeadphonesIcon,
  Clock,
  Shield,
} from "lucide-react";
import toast from "react-hot-toast";

const validationSchema = yup.object({
  consent: yup.boolean().oneOf([true], "Please agree to be contacted about this home"),
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Full name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneno: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
  subject: yup
    .string()
    .min(5, "Subject must be at least 5 characters")
    .required("Subject is required"),
  message: yup
    .string()
    .min(10, "Message must be at least 10 characters")
    .required("Message is required"),
});

export default function ContactUsPopup({ isOpen, onClose, propertyTitle, propertyId }) {

  // Sends the enquiry to the API, which stores it and emails the team.
  const postEnquiry = async (body) => {
    await api.createEnquiry({
      name: body.name,
      phone: body.phoneno ?? body.phone,
      email: body.email ?? "",
      message: body.message ?? (body.city ? `Area of interest: ${body.city}` : ""),
      property: propertyId ?? null,
      consent_contact: body.consent === true,
      source: "website_form",
    });
    return { status: 200 };
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      consent: false,
      name: "",
      email: "",
      phoneno: "",
      subject: "",
      message: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      try {
        const response = await postEnquiry(
          {
            ...values,
            timestamp: new Date().toISOString(),
            type: "contact_us",
          }
        );

        if (response.status === 200) {
          setIsSuccess(true);
          toast.success(
            "Thank you for reaching out! We'll get back to you soon!",
            {
              duration: 4000,
              style: {
                background: "white",
                color: "black",
                fontWeight: "600",
                borderRadius: "12px",
                padding: "16px",
              },
            }
          );

          // Reset form and close popup after success animation
          setTimeout(() => {
            resetForm();
            setIsSuccess(false);
            onClose();
          }, 2000);
        } else {
          throw new Error("Failed to submit form");
        }
      } catch (error) {
        toast.error("Something went wrong! Please try again.", {
          duration: 4000,
          style: {
            background: "white",
            color: "black",
            fontWeight: "600",
            borderRadius: "12px",
            padding: "16px",
          },
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSubmitting) {
      onClose();
    }
  };

  // Remove backdrop click to close functionality
  const handleBackdropClick = (e) => {
    // Only prevent event propagation, don't close the modal
    e.stopPropagation();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div
            className="w-full max-w-lg max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="border-0 bg-white dark:bg-slate-800 shadow-2xl overflow-hidden">
              <CardContent className="p-0">
                {isSuccess ? (
                  <div key="success" className="text-center py-10 px-6">
                    <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Our team will review your message and get back to you
                      within 24 hours.
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>24h Response</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        <span>Secure</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key="form">
                    {/* Modern Header */}
                    <div className="relative bg-amber-500 px-6 py-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClose}
                        className="absolute top-2 right-2 text-white hover:bg-white/20 rounded-full h-7 w-7 z-10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                          <HeadphonesIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-white">
                            Get in Touch
                          </h2>
                          <p className="text-white/90 text-xs">
                            We'd love to hear from you!
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Form */}
                    <div className="p-5">
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:hover:text-white dark:text-amber-400 text-xs px-2 py-1">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Support
                          </Badge>
                          <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:hover:text-white dark:text-yellow-400 text-xs px-2 py-1">
                            <Clock className="w-3 h-3 mr-1" />
                            Consent first
                          </Badge>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-xs">
                          Have questions or need assistance? Our expert team is
                          here to help.
                        </p>
                      </div>

                      <form
                        onSubmit={formik.handleSubmit}
                        className="space-y-4"
                      >
                        {/* Two Column Layout */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label
                              htmlFor="name"
                              className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block"
                            >
                              Full Name *
                            </Label>
                            <div className="relative">
                              <User className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                              <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Your name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`pl-9 h-9 bg-slate-50 dark:bg-slate-700 border-0 focus:ring-2 focus:ring-amber-400 rounded-lg text-sm ${
                                  formik.touched.name && formik.errors.name
                                    ? "ring-2 ring-red-400"
                                    : ""
                                }`}
                              />
                            </div>
                            {formik.touched.name && formik.errors.name && (
                              <p className="text-red-500 text-xs mt-1">
                                {formik.errors.name}
                              </p>
                            )}
                          </div>

                          <div>
                            <Label
                              htmlFor="email"
                              className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block"
                            >
                              Email *
                            </Label>
                            <div className="relative">
                              <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="your@email.com"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`pl-9 h-9 bg-slate-50 dark:bg-slate-700 border-0 focus:ring-2 focus:ring-amber-400 rounded-lg text-sm ${
                                  formik.touched.email && formik.errors.email
                                    ? "ring-2 ring-red-400"
                                    : ""
                                }`}
                              />
                            </div>
                            {formik.touched.email && formik.errors.email && (
                              <p className="text-red-500 text-xs mt-1">
                                {formik.errors.email}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label
                              htmlFor="phoneno"
                              className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block"
                            >
                              Phone *
                            </Label>
                            <div className="relative">
                              <Phone className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                              <Input
                                id="phoneno"
                                name="phoneno"
                                type="tel"
                                placeholder="10-digit number"
                                value={formik.values.phoneno}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`pl-9 h-9 bg-slate-50 dark:bg-slate-700 border-0 focus:ring-2 focus:ring-amber-400 rounded-lg text-sm ${
                                  formik.touched.phoneno &&
                                  formik.errors.phoneno
                                    ? "ring-2 ring-red-400"
                                    : ""
                                }`}
                              />
                            </div>
                            {formik.touched.phoneno &&
                              formik.errors.phoneno && (
                                <p className="text-red-500 text-xs mt-1">
                                  {formik.errors.phoneno}
                                </p>
                              )}
                          </div>

                          <div>
                            <Label
                              htmlFor="subject"
                              className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block"
                            >
                              Subject *
                            </Label>
                            <div className="relative">
                              <MessageCircle className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                              <Input
                                id="subject"
                                name="subject"
                                type="text"
                                placeholder="What's this about?"
                                value={formik.values.subject}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`pl-9 h-9 bg-slate-50 dark:bg-slate-700 border-0 focus:ring-2 focus:ring-amber-400 rounded-lg text-sm ${
                                  formik.touched.subject &&
                                  formik.errors.subject
                                    ? "ring-2 ring-red-400"
                                    : ""
                                }`}
                              />
                            </div>
                            {formik.touched.subject &&
                              formik.errors.subject && (
                                <p className="text-red-500 text-xs mt-1">
                                  {formik.errors.subject}
                                </p>
                              )}
                          </div>
                        </div>

                        <div>
                          <Label
                            htmlFor="message"
                            className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block"
                          >
                            Message *
                          </Label>
                          <Textarea
                            id="message"
                            name="message"
                            placeholder="Tell us more about your inquiry or how we can help you..."
                            rows={3}
                            value={formik.values.message}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`bg-slate-50 dark:bg-slate-700 border-0 focus:ring-2 focus:ring-amber-400 rounded-lg resize-none text-sm ${
                              formik.touched.message && formik.errors.message
                                ? "ring-2 ring-red-400"
                                : ""
                            }`}
                          />
                          {formik.touched.message && formik.errors.message && (
                            <p className="text-red-500 text-xs mt-1">
                              {formik.errors.message}
                            </p>
                          )}
                        </div>

                        <label className="flex items-start gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                          <input
                            type="checkbox"
                            name="consent"
                            checked={formik.values.consent}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="mt-0.5 size-4 accent-amber-500"
                          />
                          <span>I agree that Dream Homes may contact me about this home by phone, SMS or WhatsApp.</span>
                        </label>
                        {formik.touched.consent && formik.errors.consent && (
                          <p className="text-red-500 text-xs">{formik.errors.consent}</p>
                        )}

                        <Button
                          type="submit"
                          disabled={isSubmitting || !formik.isValid}
                          className="w-full h-10 bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg disabled:opacity-50 text-sm"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>

                      {/* Compact Footer */}
                      <div className="mt-4 text-center">
                        <div className="flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Secure
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Consent first
                          </span>
                          <span className="flex items-center gap-1">
                            <HeadphonesIcon className="w-3 h-3" />
                            Here to help
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
