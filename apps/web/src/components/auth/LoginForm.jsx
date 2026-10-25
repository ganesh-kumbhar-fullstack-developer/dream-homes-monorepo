import EmailCodeForm from "./EmailCodeForm.jsx"

export default function LoginForm({ onSuccess, setIsLoading }) {
  return <EmailCodeForm mode="signin" onSuccess={onSuccess} setIsLoading={setIsLoading} />
}
