"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, X, Loader2, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch search results
  const searchResults = useQuery(
    api.products.search,
    debouncedTerm.length >= 2 ? { searchTerm: debouncedTerm, limit: 8 } : "skip"
  );

  // Fetch categories for suggestions
  const categories = useQuery(api.categories.list);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      // Ctrl/Cmd + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Save recent search
  const saveRecentSearch = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s !== trimmed);
      const updated = [trimmed, ...filtered].slice(0, 5);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Handle search submit
  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchTerm.trim()) {
      saveRecentSearch(searchTerm);
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      onClose();
    }
  };

  // Handle clicking a product
  const handleProductClick = (slug: string) => {
    saveRecentSearch(searchTerm);
    onClose();
    router.push(`/products/${slug}`);
  };

  // Handle clicking a recent search
  const handleRecentClick = (term: string) => {
    setSearchTerm(term);
    setDebouncedTerm(term);
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  if (!isOpen) return null;

  const isLoading = debouncedTerm.length >= 2 && searchResults === undefined;
  const hasResults = searchResults && searchResults.length > 0;
  const noResults = debouncedTerm.length >= 2 && searchResults && searchResults.length === 0;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative mx-auto mt-4 sm:mt-20 w-full max-w-2xl px-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Search Header */}
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center border-b">
              <Search className="absolute left-4 h-5 w-5 text-gray-400" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search for parts, brands, OEM numbers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-4 text-lg border-0 focus:ring-0 focus-visible:ring-0"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setDebouncedTerm("");
                  }}
                  className="absolute right-14 p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </form>

          {/* Content */}
          <div className="max-h-[60vh] overflow-y-auto">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            )}

            {/* Search Results */}
            {hasResults && (
              <div className="p-4">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
                  Products ({searchResults.length})
                </div>
                <div className="space-y-2">
                  {searchResults.map((product) => (
                    <button
                      key={product._id}
                      onClick={() => handleProductClick(product.slug)}
                      className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                    >
                      {product.images[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-14 h-14 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {product.title}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-bold text-blue-600">
                            KES {product.price.toLocaleString()}
                          </span>
                          {product.brand && (
                            <span className="text-gray-500">
                              {product.brand}
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </button>
                  ))}
                </div>
                {searchResults.length >= 8 && (
                  <Button
                    onClick={handleSearch}
                    variant="outline"
                    className="w-full mt-4"
                  >
                    View all results for "{searchTerm}"
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {/* No Results */}
            {noResults && (
              <div className="py-12 text-center">
                <div className="text-gray-400 mb-2">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-gray-600 font-medium">
                  No products found for "{debouncedTerm}"
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Try different keywords or browse categories
                </p>
              </div>
            )}

            {/* Default State - Recent & Categories */}
            {!isLoading && !hasResults && !noResults && (
              <div className="p-4 space-y-6">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Recent Searches
                      </div>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleRecentClick(term)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Categories */}
                {categories && categories.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1 mb-3">
                      <TrendingUp className="h-3 w-3" />
                      Browse Categories
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {categories.slice(0, 6).map((category) => (
                        <Link
                          key={category._id}
                          href={`/categories/${category.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        >
                          {category.image && (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-8 h-8 object-cover rounded-lg"
                            />
                          )}
                          <span className="text-sm font-medium truncate">
                            {category.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Search Tips */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-sm font-medium text-blue-900 mb-2">
                    Search Tips
                  </div>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>Search by product name: "brake pads"</li>
                    <li>Search by brand: "Toyota", "Nissan"</li>
                    <li>Search by OEM number: "04465-33450"</li>
                    <li>Search by compatible model: "Corolla 2020"</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-4 py-3 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white border rounded text-xs">Enter</kbd>
              <span>to search</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white border rounded text-xs">Esc</kbd>
              <span>to close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
