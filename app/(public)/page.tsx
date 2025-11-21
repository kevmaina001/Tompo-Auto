"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ShoppingCart, Search, CheckCircle, Clock, Shield, TrendingUp, ArrowRight, Star, Phone } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function HomePage() {
  const categories = useQuery(api.categories.list);
  const featuredProducts = useQuery(api.products.getFeatured, { limit: 8 });
  const { addItem } = useCart();

  const handleAddToCart = (product: NonNullable<typeof featuredProducts>[number]) => {
    addItem({
      productId: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0],
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 overflow-hidden min-h-[400px] md:min-h-[600px] flex items-center">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-black opacity-10" />
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aC0ydi0yaDJ2MnptMC00aC0ydi0yaDJ2MnptMC00aC0ydi0yaDJ2MnptMC00aC0ydi0yaDJ2MnptMC00aC0ydi0yaDJ2MnptMC00aC0ydi0yaDJ2MnptMC00aC0ydi0yaDJ2MnptMC00aC0ydi0yaDJ2MnptMC00aC0ydi0yaDJ2MnoiLz48L2c+PC9nPjwvc3ZnPg==')" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-md rounded-full px-5 py-2.5 text-white shadow-lg border border-white/30">
                <Star className="h-4 w-4 mr-2 fill-yellow-300 text-yellow-300" />
                <span className="text-sm font-semibold">Trusted by 1000+ Customers</span>
                <span className="ml-2 text-xs opacity-75">⭐⭐⭐⭐⭐</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white leading-tight drop-shadow-2xl">
                  Premium
                  <br />
                  <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent animate-gradient">
                    Auto Parts
                  </span>
                </h1>

                <p className="text-base sm:text-xl md:text-2xl text-blue-50 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
                  Quality spare parts for <span className="text-yellow-300 font-bold">all vehicle makes</span> and models. Browse, select, and get instant quotes via WhatsApp.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="#categories"
                  className="group inline-flex items-center justify-center bg-white text-blue-700 hover:bg-yellow-300 hover:text-blue-900 font-bold shadow-2xl px-8 py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-yellow-300/50"
                >
                  <Search className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Browse Categories
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="#featured"
                  className="group inline-flex items-center justify-center bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 font-bold px-8 py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-white/50"
                >
                  <Star className="mr-2 h-5 w-5 group-hover:fill-current transition-all" />
                  Featured Products
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 sm:pt-8 border-t border-white/20">
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white">500+</div>
                  <div className="text-xs sm:text-sm text-blue-200">Products</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white">1000+</div>
                  <div className="text-xs sm:text-sm text-blue-200">Customers</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white">24/7</div>
                  <div className="text-xs sm:text-sm text-blue-200">Support</div>
                </div>
              </div>
            </div>

            {/* Right Column - Visual Element */}
            <div className="hidden lg:block relative">
              <div className="relative z-10">
                {/* Floating Card Effect */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 bg-white/90 rounded-2xl p-4 shadow-lg animate-float">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-xl">
                        <Shield className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">Authentic Parts</div>
                        <div className="text-sm text-gray-600">100% Genuine</div>
                      </div>
                      <CheckCircle className="h-6 w-6 text-green-500 ml-auto" />
                    </div>

                    <div className="flex items-center space-x-4 bg-white/90 rounded-2xl p-4 shadow-lg animate-float animation-delay-1000">
                      <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl">
                        <TrendingUp className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">Best Prices</div>
                        <div className="text-sm text-gray-600">Save up to 40%</div>
                      </div>
                      <CheckCircle className="h-6 w-6 text-green-500 ml-auto" />
                    </div>

                    <div className="flex items-center space-x-4 bg-white/90 rounded-2xl p-4 shadow-lg animate-float animation-delay-2000">
                      <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl">
                        <Clock className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">Fast Delivery</div>
                        <div className="text-sm text-gray-600">Same Day Available</div>
                      </div>
                      <CheckCircle className="h-6 w-6 text-green-500 ml-auto" />
                    </div>
                  </div>

                  {/* WhatsApp CTA */}
                  <a
                    href={`https://wa.me/254708328905?text=${encodeURIComponent("Hi! I'm interested in your auto spare parts.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 group"
                  >
                    <Phone className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Chat on WhatsApp
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-300 rounded-full opacity-50 blur-2xl animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-orange-400 rounded-full opacity-30 blur-3xl animate-pulse animation-delay-2000"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="rgb(249, 250, 251)"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {[
            { icon: Shield, title: "Authentic Parts", desc: "100% genuine products" },
            { icon: TrendingUp, title: "Best Prices", desc: "Competitive market rates" },
            { icon: Clock, title: "Fast Delivery", desc: "Quick order processing" },
            { icon: CheckCircle, title: "Quality Assured", desc: "Tested & verified" }
          ].map((feature, idx) => (
            <div key={idx} className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1 sm:mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 text-xs sm:text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">Browse by Category</h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Explore our wide range of auto parts organized by category for easy navigation
          </p>
        </div>

        {!categories ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/categories/${category.slug}`}
                className="group block"
              >
                <Card className="h-full border-2 border-transparent hover:border-blue-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  {category.image && (
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-gradient-to-br from-gray-100 to-gray-200">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-4 pt-3 sm:pt-4">
                    <CardTitle className="text-sm sm:text-base md:text-lg font-bold group-hover:text-blue-600 transition-colors flex items-center justify-between">
                      <span className="line-clamp-1">{category.name}</span>
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1" />
                    </CardTitle>
                  </CardHeader>
                  {category.description && (
                    <CardContent className="pt-0 px-3 sm:px-4 pb-3 sm:pb-4">
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                        {category.description}
                      </p>
                    </CardContent>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}

        {categories && categories.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No categories available yet.</p>
          </div>
        )}
      </section>

      {/* Featured Products Section */}
      <section id="featured" className="bg-gradient-to-b from-white to-gray-50 py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">Featured Products</h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
              Hand-picked premium parts for your vehicle. Special deals and popular items.
            </p>
          </div>

          {!featuredProducts ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading featured products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <Card
                  key={product._id}
                  className="group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-400 transform hover:-translate-y-1 overflow-hidden"
                >
                  <Link href={`/products/${product.slug}`} className="block relative">
                    {product.images[0] && (
                      <div className="aspect-square w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 relative">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {product.featured && (
                          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 md:top-3 md:left-3">
                            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
                              <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1 fill-current" />
                              <span className="hidden sm:inline">Featured</span>
                              <span className="sm:hidden">⭐</span>
                            </Badge>
                          </div>
                        )}
                        {product.stock > 0 && product.stock <= 10 && (
                          <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 md:top-3 md:right-3">
                            <Badge variant="destructive" className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
                              <span className="hidden sm:inline">Only {product.stock} left</span>
                              <span className="sm:hidden">{product.stock}</span>
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}
                  </Link>

                  <CardHeader className="pb-2 sm:pb-3 px-2 sm:px-3 md:px-4 pt-2 sm:pt-3 md:pt-4">
                    <Link href={`/products/${product.slug}`}>
                      <CardTitle className="text-xs sm:text-sm md:text-base font-bold group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] md:min-h-[3rem]">
                        {product.title}
                      </CardTitle>
                    </Link>
                    {product.brand && (
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium mt-0.5 sm:mt-1 line-clamp-1">{product.brand}</p>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-2 sm:space-y-3 px-2 sm:px-3 md:px-4 pb-2 sm:pb-3 md:pb-4">
                    <div className="flex items-center justify-between gap-1">
                      <div>
                        <p className="text-base sm:text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                          {product.price.toLocaleString()}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500">KES</p>
                      </div>
                      {product.stock > 0 ? (
                        <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50 text-[10px] sm:text-xs px-1 sm:px-2 py-0.5">
                          <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                          <span className="hidden sm:inline">In Stock</span>
                          <span className="sm:hidden">✓</span>
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-[10px] sm:text-xs px-1 sm:px-2 py-0.5">Out</Badge>
                      )}
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 group text-xs sm:text-sm py-1.5 sm:py-2 h-auto"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:animate-bounce" />
                      <span className="hidden sm:inline">Add to Enquiry</span>
                      <span className="sm:hidden">Add</span>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {featuredProducts && featuredProducts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No featured products available yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
