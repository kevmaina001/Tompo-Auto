"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { CartProvider } from "./cart-context";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexProvider client={convex}>
        <CartProvider>{children}</CartProvider>
      </ConvexProvider>
    </ClerkProvider>
  );
}
