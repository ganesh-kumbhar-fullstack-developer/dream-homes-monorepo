import { useEffect, useState } from "react"
import AuthPage from "./components/auth/AuthPage.jsx"
import RequireAuth from "./components/auth/RequireAuth.jsx"
import HomePage from "./components/home/HomePage.jsx"
import { PropertyProvider } from "./context/PropertyContext.jsx"
import { Routes, Route, Navigate } from "react-router-dom"
import AboutPage from "./components/pages/about/About.jsx"
import ContactPage from "./components/pages/contact/Contact.jsx"
import Favoritespage from "./components/pages/favorite/FavoritePage.jsx"
import Wrapper from "./components/wrapper/wrapper.jsx"
import ScrollToTop from "./utility/ScrollToTop.jsx"
import ScrollToTopButton from "./utility/ScrollToTopButton.jsx"
import { ThemeProvider } from "./components/ThemeProvider.jsx"
import ProfilePage from "./components/pages/profilepage/ProfilePage.jsx"
import { Toaster } from "react-hot-toast"

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-gold-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-gold-500 mx-auto mb-8"></div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Loading Dream Homes</h2>
            <p className="text-slate-600 dark:text-slate-300">Please wait while we prepare your experience...</p>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <PropertyProvider>
        <div className="App min-h-screen bg-background text-foreground">
          <ScrollToTop />
          <ScrollToTopButton />
          <Routes>
            {/* The old admin panel used a static token. It is removed until the staff console is built. */}
            <Route path="/admin" element={<Navigate to="/" replace />} />

            {/* Browsing is open to everyone. Saving and account pages ask for sign-in. */}
            <Route path="/" element={<Wrapper />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="favorites" element={<RequireAuth><Favoritespage /></RequireAuth>} />
              <Route path="profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            className: "dark:bg-slate-800 dark:text-white",
            duration: 4000,
            style: {
              border: "1px solid black",
              borderRadius: "12px",
              padding: "16px",
              fontSize: "14px",
              fontWeight: "600",
            },
          }}
        />
      </PropertyProvider>
    </ThemeProvider>
  )
}

export default App
