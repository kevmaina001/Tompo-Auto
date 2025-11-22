"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderTree,
  Package,
  FileText,
  MessageSquare,
  Store,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 mr-2"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>

              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-base sm:text-xl font-bold text-gray-900">
                  <span className="hidden sm:inline">Auto Spares Admin</span>
                  <span className="sm:hidden">Admin</span>
                </h1>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:ml-6 md:flex md:space-x-4 lg:space-x-6">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors ${
                        isActive(item.href)
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-1.5 hidden lg:block" />
                      {item.label}
                    </Link>
                  );
                })}
                <Link
                  href="/"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
                >
                  <Store className="h-4 w-4 mr-1.5 hidden lg:block" />
                  View Store
                </Link>
              </div>
            </div>

            <div className="flex items-center">
              <div className="text-[10px] sm:text-xs text-gray-500 px-2 sm:px-3 py-1 bg-yellow-100 rounded">
                Dev Mode
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-40">
            <div className="flex items-center justify-between h-14 px-4 border-b">
              <h2 className="text-lg font-bold text-gray-900">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="px-2 py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Link>
                );
              })}

              <div className="my-4 border-t" />

              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <Store className="h-5 w-5 mr-3" />
                View Store
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
