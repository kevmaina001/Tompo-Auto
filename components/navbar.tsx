"use client";

import Link from "next/link";
import { ShoppingCart, Phone, Mail, Wrench } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export function Navbar() {
  const { totalItems } = useCart();

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <a href="tel:+254708328905" className="flex items-center hover:text-blue-300 transition">
                <Phone className="h-3 w-3 mr-1" />
                +254 708 328 905
              </a>
              <a href="mailto:info@autospares.com" className="hidden md:flex items-center hover:text-blue-300 transition">
                <Mail className="h-3 w-3 mr-1" />
                info@autospares.com
              </a>
            </div>
            <div className="text-xs">
              Quality Auto Parts | Fast Delivery
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2.5 rounded-lg group-hover:scale-105 transition-transform">
                  <Wrench className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    Tompo's Auto
                  </div>
                  <div className="text-xs text-gray-500 leading-tight">
                    Where quality<br />Meets Experience 🚘
                  </div>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
              <Link href="/" className="hidden sm:block">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                  Home
                </Button>
              </Link>

              <Link href="/about" className="hidden md:block">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                  About
                </Button>
              </Link>

              <Link href="/blog" className="hidden md:block">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                  Blog
                </Button>
              </Link>

              <Link href="/contact" className="hidden md:block">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                  Contact
                </Button>
              </Link>

              <Link href="/cart">
                <Button
                  variant="default"
                  className="relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-sm sm:text-base"
                >
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
                  <span className="hidden sm:inline">Enquiry Cart</span>
                  {totalItems > 0 && (
                    <Badge
                      className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 bg-orange-500 border-2 border-white"
                    >
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
