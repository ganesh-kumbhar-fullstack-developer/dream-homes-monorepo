import { useEffect } from "react"
import { X } from "lucide-react"
import AuthPage from "./AuthPage.jsx"

// Opened when a visitor without an account tries to save a home.
// Closing it leaves the visitor where they were.
export default function AuthPrompt({ prompt, onClose, onSuccess }) {
  useEffect(() => {
    if (!prompt) return
    const onKey = (e) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [prompt, onClose])

  if (!prompt) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Sign in to continue"
    >
      <div
        className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-800 [&_.min-h-screen]:min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <X className="h-5 w-5" />
        </button>
        <p className="px-6 pt-6 pr-16 text-sm text-slate-600 dark:text-slate-300">{prompt.reason}</p>
        <AuthPage onAuthSuccess={onSuccess} />
      </div>
    </div>
  )
}
