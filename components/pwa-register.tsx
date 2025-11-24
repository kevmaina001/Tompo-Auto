"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function PWARegister() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered:", registration.scope);
        })
        .catch((error) => {
          console.log("SW registration failed:", error);
        });
    }
  }, []);

  useEffect(() => {
    // Dynamically update manifest link based on route
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      manifestLink.setAttribute(
        "href",
        isAdmin ? "/admin-manifest.json" : "/manifest.json"
      );
    }

    // Update theme color for admin
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute(
        "content",
        isAdmin ? "#1f2937" : "#2563eb"
      );
    }
  }, [isAdmin]);

  return null;
}
