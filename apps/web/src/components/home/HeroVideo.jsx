import { useEffect, useRef, useState } from "react"

// Ambient background video for the hero. It is muted and looping, sits behind the text,
// and is skipped for people who ask for reduced motion or whose browser can't play it.
export default function HeroVideo({ src = "/media/hero-loop.mp4" }) {
  const [available, setAvailable] = useState(true)
  const videoRef = useRef(null)

  // Play only while the hero is on screen and the tab is visible. Saves battery and frame time.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let onScreen = true
    const sync = () => {
      if (onScreen && !document.hidden) video.play().catch(() => {})
      else video.pause()
    }
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      // Off-screen video is removed from rendering entirely, not just paused.
      video.style.display = onScreen ? "" : "none"
      sync()
    })
    observer.observe(video)
    document.addEventListener("visibilitychange", sync)
    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", sync)
    }
  }, [available])
  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {available && !reduceMotion && (
        <video
          ref={videoRef}
          className="hero-video absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={(e) => e.currentTarget.setAttribute("data-ready", "true")}
        >
          <source src="/media/hero-loop.webm" type="video/webm" />
          <source src={src} type="video/mp4" onError={() => setAvailable(false)} />
        </video>
      )}
      {/* Keeps the text readable in both light and dark themes. */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/70 to-amber-50/95 dark:from-slate-900/60 dark:via-slate-900/80 dark:to-slate-900" />
    </div>
  )
}
