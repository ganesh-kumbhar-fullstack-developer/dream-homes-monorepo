import { useState } from "react"
import { Button } from "@/components/ui/Button.jsx"
import { Input } from "@/components/ui/Input.jsx"
import { Label } from "@/components/ui/Label.jsx"
import { useAuth } from "../../context/AuthContext.jsx"
import toast from "react-hot-toast"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Passwordless sign-in: the visitor enters an email, then the six-digit code sent to it.
// Sign-up and sign-in use the same steps. A new email creates the account at the second step.
export default function EmailCodeForm({ mode, onSuccess, setIsLoading }) {
  const { requestCode, verifyCode } = useAuth()
  const [step, setStep] = useState("email")
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const isSignUp = mode === "signup"

  async function sendCode(event) {
    event.preventDefault()
    setError("")
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Enter a valid email address")
      return
    }
    if (isSignUp && fullName.trim().length < 2) {
      setError("Enter your full name")
      return
    }
    setBusy(true)
    setIsLoading?.(true)
    try {
      await requestCode(email.trim())
      setStep("code")
      toast.success("We sent a code to your email")
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
      setIsLoading?.(false)
    }
  }

  async function confirmCode(event) {
    event.preventDefault()
    setError("")
    if (!/^[0-9]{6}$/.test(code)) {
      setError("Enter the 6-digit code from your email")
      return
    }
    setBusy(true)
    setIsLoading?.(true)
    try {
      await verifyCode(email.trim(), code, isSignUp ? fullName.trim() : "")
      toast.success(isSignUp ? "Welcome to Dream Homes!" : "Welcome back!")
      onSuccess?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
      setIsLoading?.(false)
    }
  }

  const buttonClass =
    "w-full h-14 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white text-lg font-semibold shadow-lg"

  if (step === "email") {
    return (
      <form onSubmit={sendCode} className="space-y-6" noValidate>
        {isSignUp && (
          <div className="space-y-2">
            <Label htmlFor="full-name">Full name</Label>
            <Input id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            inputMode="email"
          />
        </div>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={busy} className={buttonClass}>
          {busy ? "Sending code…" : isSignUp ? "Create account" : "Send me a code"}
        </Button>
        <p className="text-center text-xs text-slate-500">
          No password needed. We email you a one-time code each time you sign in.
        </p>
      </form>
    )
  }

  return (
    <form onSubmit={confirmCode} className="space-y-6" noValidate>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Enter the 6-digit code we sent to <span className="font-semibold">{email}</span>. It expires in 10 minutes.
      </p>
      <div className="space-y-2">
        <Label htmlFor="code">Sign-in code</Label>
        <Input
          id="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="123456"
          className="text-center text-2xl tracking-[0.5em]"
        />
      </div>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={busy} className={buttonClass}>
        {busy ? "Checking…" : "Continue"}
      </Button>
      <button
        type="button"
        onClick={() => {
          setStep("email")
          setCode("")
          setError("")
        }}
        className="w-full text-center text-sm text-gold-600 hover:text-gold-700"
      >
        Use a different email
      </button>
    </form>
  )
}
