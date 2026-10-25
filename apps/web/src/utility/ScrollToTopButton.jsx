import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    visible && (
      <div
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 cursor-pointer group"
      >
        <div className="border border-white frelative flex items-center justify-center w-14 h-14 rounded-full bg-gold-500 text-white shadow-lg">
          <ArrowUp className="z-10 w-6 h-6 group-hover:scale-110 transition-transform" />
          {/* Animated circular waves */}
          <span className="absolute w-full h-full rounded-full animate-slow-ping bg-gold-500 opacity-75"></span>
          <span className="absolute w-full h-full rounded-full animate-slow-ping bg-gold-500 opacity-50 delay-200"></span>
        </div>
      </div>
    )
  );
};

export default ScrollToTopButton;
