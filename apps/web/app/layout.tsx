import type { Metadata, Viewport } from "next";
import "@/index.css";

// Metadata copied from the original index.html so search and social previews stay the same.
export const metadata: Metadata = {
  title: "Dream Homes - Find Your Perfect Property in Pune | Real Estate Portal",
  description:
    "Explore Dream Homes - a modern real estate platform offering premium properties in Pune with smart filters, saved homes and direct enquiries. Find your dream property today.",
  keywords:
    "Dream Homes, real estate Pune, property for sale Pune, buy home Pune, real estate app, property finder, Pune homes, housing Pune",
  authors: [{ name: "Ganesh Kumbhar" }],
  robots: "index, follow",
  alternates: { canonical: "https://dream-homes-alpha.vercel.app/" },
  icons: { icon: [{ url: "/dream-homes-logo.webp", type: "image/webp" }] },
  openGraph: {
    title: "Dream Homes - Find Your Perfect Property in Pune",
    description: "Search, explore, and find your perfect home in Pune. Modern, fast, and responsive real estate platform.",
    url: "https://dream-homes-alpha.vercel.app/",
    images: ["https://dream-homes-alpha.vercel.app/og-image.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dream Homes - Find Your Perfect Property in Pune",
    description: "Search, explore, and find your perfect home in Pune. Fast, interactive, and built with React",
    images: ["https://dream-homes-alpha.vercel.app/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Dream Homes",
  url: "https://www.yourdomain.com/",
  author: { "@type": "Person", name: "Ganesh Kumbhar" },
  description:
    "Dream Homes is a real estate platform offering properties in Pune, with saved homes and direct enquiries.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
