"use client";

import React, { useEffect, useState } from "react";
import DesktopPalette from "./desktop/desktop-palette";
import MobilePalette from "./mobile/mobile-palette";

export default function FieldPalette() {
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Simple media query listener
    const checkMobile = () => setIsMobile(window.innerWidth < 768); // 768px = md in Tailwind

    checkMobile(); // Check on mount
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Cegah hydration error di Next.js
  if (!isMounted) return null;

  return isMobile ? <MobilePalette /> : <DesktopPalette />;
}
