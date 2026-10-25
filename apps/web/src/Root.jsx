// Same provider tree as the original src/main.jsx, without ReactDOM.createRoot,
// because Next.js owns the root render.
import { AuthProvider } from "@/context/AuthContext.jsx"
import { BrowserRouter as Router } from "react-router-dom"
import App from "@/App.jsx"

export default function Root() {
  return (
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  )
}
