import React from "react"
import { Outlet } from "react-router-dom"
import Navbar from "../../components/layout/Navbar.jsx"
// import Footer from "../components/layout/Footer.jsx"

export default function Wrapper() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page-specific content will render here */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* <Footer /> */}
    </div>
  )
}
