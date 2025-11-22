"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { CartProvider } from "./cart-context";
import { PWARegister } from "@/components/pwa-register";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexProvider client={convex}>
        <CartProvider>
          <PWARegister />
          {children}
        </CartProvider>
      </ConvexProvider>
    </ClerkProvider>
  );
}
