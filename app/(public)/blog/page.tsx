"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { useEffect } from "react";

export default function BlogPage() {
  const blogPosts = useQuery(api.blogPosts.listPublished);

  // Update page title for SEO
  useEffect(() => {
    document.title = "Blog - Automotive Tips & Guides | Tompo's Auto Spare Parts";
  }, []);

  if (!blogPosts) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  // JSON-LD structured data for the blog
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Tompo's Auto Blog",
    description: "Tips, guides, and insights about automotive maintenance, car parts, and vehicle care from Tompo's Auto Spare Parts.",
    url: "https://www.tomposauto.com/blog",
    publisher: {
      "@type": "Organization",
      name: "Tompo's Auto Spare Parts",
      logo: {
        "@type": "ImageObject",
        url: "https://www.tomposauto.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.tomposauto.com/blog",
    },
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Our Blog
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 leading-relaxed">
              Tips, guides, and insights about automotive maintenance and parts
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          {blogPosts.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="max-w-md mx-auto">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="mx-auto h-16 w-16 sm:h-20 sm:w-20"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  No blog posts yet
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Check back soon for automotive tips and guides
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
              {blogPosts.map((post) => {
                const publishedDate = post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });

                return (
                  <article
                    key={post._id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                  >
                    {post.image && (
                      <div className="relative h-48 sm:h-56 overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="p-5 sm:p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {publishedDate}
                        </div>
                        {post.author && (
                          <div className="flex items-center">
                            <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {post.author}
                          </div>
                        )}
                      </div>

                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2">
                        {post.title}
                      </h2>

                      {post.excerpt && (
                        <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-3 flex-1">
                          {post.excerpt}
                        </p>
                      )}

                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base group mt-auto"
                      >
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
    </>
  );
}
