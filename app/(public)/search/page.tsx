"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import {
  ShoppingCart,
  Search,
  Filter,
  X,
  CheckCircle,
  SlidersHorizontal,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Id } from "@/convex/_generated/dataModel";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<Id<"categories"> | null>(null);
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { addItem } = useCart();

  // Update page title
  useEffect(() => {
    document.title = searchTerm
      ? `Search: ${searchTerm} | Tompo's Auto Spare Parts`
      : `Search Products | Tompo's Auto Spare Parts`;
  }, [searchTerm]);

  // Fetch categories for filter
  const categories = useQuery(api.categories.list);

  // Fetch search results
  const searchResults = useQuery(
    api.products.search,
    searchTerm.length >= 2
      ? {
          searchTerm,
          categoryId: selectedCategory || undefined,
          minPrice,
          maxPrice,
          inStockOnly: inStockOnly || undefined,
          limit: 50,
        }
      : "skip"
  );

  const handleAddToCart = (product: NonNullable<typeof searchResults>[number]) => {
    addItem({
      productId: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0],
    });
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setInStockOnly(false);
  };

  const hasActiveFilters = selectedCategory || minPrice || maxPrice || inStockOnly;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Search Header */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center">
              Search Products
            </h1>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for parts, brands, OEM numbers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border-0 focus:ring-2 focus:ring-blue-300 text-gray-900"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5" />
                  Filters
                </h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Category
                </Label>
                <select
                  value={selectedCategory || ""}
                  onChange={(e) =>
                    setSelectedCategory(
                      e.target.value ? (e.target.value as Id<"categories">) : null
                    )
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories?.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Price Range (KES)
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minPrice || ""}
                    onChange={(e) =>
                      setMinPrice(e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="w-full"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxPrice || ""}
                    onChange={(e) =>
                      setMaxPrice(e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="w-full"
                  />
                </div>
              </div>

              {/* In Stock Only */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inStock"
                  checked={inStockOnly}
                  onCheckedChange={(checked: boolean | "indeterminate") => setInStockOnly(checked === true)}
                />
                <Label htmlFor="inStock" className="text-sm text-gray-700 cursor-pointer">
                  In Stock Only
                </Label>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              onClick={() => setShowFilters(true)}
              className="w-full flex items-center justify-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge className="bg-blue-600 text-white ml-2">Active</Badge>
              )}
            </Button>
          </div>

          {/* Mobile Filters Modal */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/60"
                onClick={() => setShowFilters(false)}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900">Filters</h2>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="h-6 w-6 text-gray-500" />
                  </button>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Category
                  </Label>
                  <select
                    value={selectedCategory || ""}
                    onChange={(e) =>
                      setSelectedCategory(
                        e.target.value ? (e.target.value as Id<"categories">) : null
                      )
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="">All Categories</option>
                    {categories?.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Price Range (KES)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={minPrice || ""}
                      onChange={(e) =>
                        setMinPrice(e.target.value ? Number(e.target.value) : undefined)
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={maxPrice || ""}
                      onChange={(e) =>
                        setMaxPrice(e.target.value ? Number(e.target.value) : undefined)
                      }
                    />
                  </div>
                </div>

                {/* In Stock Only */}
                <div className="flex items-center space-x-2 mb-6">
                  <Checkbox
                    id="inStockMobile"
                    checked={inStockOnly}
                    onCheckedChange={(checked: boolean | "indeterminate") => setInStockOnly(checked === true)}
                  />
                  <Label htmlFor="inStockMobile" className="text-sm text-gray-700">
                    In Stock Only
                  </Label>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="flex-1"
                  >
                    Clear All
                  </Button>
                  <Button
                    onClick={() => setShowFilters(false)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <main className="flex-1">
            {/* Results Header */}
            {searchTerm.length >= 2 && (
              <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-600">
                  {searchResults === undefined ? (
                    "Searching..."
                  ) : searchResults.length === 0 ? (
                    `No results found for "${searchTerm}"`
                  ) : (
                    <>
                      Found <span className="font-bold">{searchResults.length}</span>{" "}
                      results for &ldquo;<span className="font-medium">{searchTerm}</span>&rdquo;
                    </>
                  )}
                </p>
              </div>
            )}

            {/* Empty State */}
            {searchTerm.length < 2 && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  Start searching
                </h3>
                <p className="text-gray-500">
                  Enter at least 2 characters to search for products
                </p>
              </div>
            )}

            {/* Loading State */}
            {searchTerm.length >= 2 && searchResults === undefined && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Searching...</p>
              </div>
            )}

            {/* No Results */}
            {searchResults && searchResults.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search or filters
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            )}

            {/* Results Grid */}
            {searchResults && searchResults.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {searchResults.map((product) => (
                  <Card
                    key={product._id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <Link href={`/products/${product.slug}`}>
                      {product.images[0] && (
                        <div className="aspect-square w-full overflow-hidden rounded-t-lg">
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                    </Link>
                    <CardHeader className="p-2 sm:p-3 md:p-4">
                      <Link href={`/products/${product.slug}`}>
                        <CardTitle className="text-xs sm:text-sm md:text-base hover:text-blue-600 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
                          {product.title}
                        </CardTitle>
                      </Link>
                      {product.brand && (
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 line-clamp-1">
                          {product.brand}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-1 sm:mt-2 gap-1">
                        <div>
                          <p className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                            {product.price.toLocaleString()}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-500">KES</p>
                        </div>
                        {product.stock > 0 ? (
                          <Badge
                            variant="outline"
                            className="border-green-500 text-green-700 bg-green-50 text-[10px] sm:text-xs px-1 sm:px-2 py-0.5"
                          >
                            <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                            <span className="hidden sm:inline">In Stock</span>
                            <span className="sm:hidden">OK</span>
                          </Badge>
                        ) : (
                          <Badge
                            variant="destructive"
                            className="text-[10px] sm:text-xs px-1 sm:px-2 py-0.5"
                          >
                            Out
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-2 sm:p-3 md:p-4 pt-0">
                      <Button
                        className="w-full text-xs sm:text-sm py-1.5 sm:py-2 h-auto"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                      >
                        <ShoppingCart className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Add to Enquiry</span>
                        <span className="sm:hidden">Add</span>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function SearchPageFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center">
              Search Products
            </h1>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <div className="w-full pl-12 pr-4 py-4 text-lg rounded-xl bg-white h-14 animate-pulse" />
            </div>
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageContent />
    </Suspense>
  );
}
