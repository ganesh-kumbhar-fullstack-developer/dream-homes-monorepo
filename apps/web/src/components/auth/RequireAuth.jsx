import { useAuth } from "../../context/AuthContext.jsx"
import AuthPage from "./AuthPage.jsx"

// Shows the sign-in screen in place of pages that need an account.
// Waits for the session check first, so a signed-in visitor never sees the sign-in screen flash.
export default function RequireAuth({ children }) {
  const { user, sessionChecked } = useAuth()
  if (!sessionChecked) {
    return <div className="flex min-h-[50vh] items-center justify-center text-slate-500">Loading…</div>
  }
  if (!user) {
    return <AuthPage onAuthSuccess={() => {}} />
  }
  return children
}
