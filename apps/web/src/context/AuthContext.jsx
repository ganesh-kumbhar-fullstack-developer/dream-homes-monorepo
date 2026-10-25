import { createContext, useContext, useEffect, useState } from "react"
import { api } from "../lib/api.js"

const AuthContext = createContext(undefined)

// Accounts sign in with a one-time code sent by email. There are no passwords.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sessionChecked, setSessionChecked] = useState(false)

  useEffect(() => {
    api
      .getSession()
      .then((session) => {
        setUser(session)
        setIsAuthenticated(Boolean(session))
      })
      .catch(() => setUser(null))
      .finally(() => setSessionChecked(true))
  }, [])

  const requestCode = (email) => api.requestSignInCode(email)

  const verifyCode = async (email, code, fullName) => {
    const data = await api.verifySignInCode(email, code, fullName)
    setUser(data.user)
    setIsAuthenticated(true)
    return data.user
  }

  const logout = async () => {
    await api.signOut().catch(() => undefined)
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateProfile = async (userData) => {
    if (!user) return false
    try {
      setUser(await api.updateProfile({ full_name: userData.name ?? userData.full_name, phone: userData.phone }))
      return true
    } catch {
      return false
    }
  }

  // Passwords no longer exist, so there is nothing to change here.
  const updatePassword = async () => false

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, sessionChecked, requestCode, verifyCode, logout, updateProfile, updatePassword }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
