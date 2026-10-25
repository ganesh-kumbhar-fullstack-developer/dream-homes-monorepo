"use client";

import dynamic from "next/dynamic";

// The original app is a client-only React app (react-router, localStorage, window).
// Load it in the browser only, so server rendering never touches browser APIs.
const Root = dynamic(() => import("@/Root.jsx"), { ssr: false });

export default function LegacyApp() {
  return <Root />;
}
