"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Phone, Mail, Wrench, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export function Navbar() {
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <div className="flex items-center space-x-3 sm:space-x-6">
              <a href="tel:+254708328905" className="flex items-center hover:text-blue-300 transition">
                <Phone className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">+254 708 328 905</span>
                <span className="sm:hidden">Call</span>
              </a>
              <a href="mailto:info@autospares.com" className="hidden md:flex items-center hover:text-blue-300 transition">
                <Mail className="h-3 w-3 mr-1" />
                info@autospares.com
              </a>
            </div>
            <div className="text-[10px] sm:text-xs">
              Quality Auto Parts | Fast Delivery
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 sm:h-20">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-1.5 sm:p-2.5 rounded-lg group-hover:scale-105 transition-transform">
                  <Wrench className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                </div>
                <div>
                  <div className="text-base sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    {"Tompo's Auto"}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-500 leading-tight hidden sm:block">
                    Where quality<br />Meets Experience 🚘
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              <Link href="/">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                  Home
                </Button>
              </Link>

              <Link href="/about">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                  About
                </Button>
              </Link>

              <Link href="/blog">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                  Blog
                </Button>
              </Link>

              <Link href="/contact">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                  Contact
                </Button>
              </Link>

              <Link href="/cart">
                <Button
                  variant="default"
                  className="relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Enquiry Cart
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

            {/* Mobile Menu Button & Cart */}
            <div className="flex md:hidden items-center space-x-2">
              <Link href="/cart">
                <Button
                  variant="default"
                  size="sm"
                  className="relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-3"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {totalItems > 0 && (
                    <Badge
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-orange-500 border-2 border-white text-xs"
                    >
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-700" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <div className="px-4 py-3 space-y-1">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
              >
                About
              </Link>
              <Link
                href="/blog"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
