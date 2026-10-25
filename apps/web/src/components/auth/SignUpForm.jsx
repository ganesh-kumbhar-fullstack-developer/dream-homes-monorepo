import EmailCodeForm from "./EmailCodeForm.jsx"

export default function SignUpForm({ onSuccess, setIsLoading }) {
  return <EmailCodeForm mode="signup" onSuccess={onSuccess} setIsLoading={setIsLoading} />
}
