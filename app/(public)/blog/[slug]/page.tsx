"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const blogPost = useQuery(api.blogPosts.getBySlug, { slug });

  if (blogPost === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (blogPost === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-20 w-20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Blog Post Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {"The blog post you're looking for doesn't exist or has been removed."}
          </p>
          <Button onClick={() => router.push("/blog")} className="mx-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  const publishedDate = blogPost.publishedAt
    ? new Date(blogPost.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date(blogPost.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Unpublished Banner */}
      {!blogPost.published && (
        <div className="bg-yellow-500 text-white py-3 px-4 text-center font-semibold">
          ⚠️ Preview Mode: This post is not published yet and is only visible to you
        </div>
      )}

      <article className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Back Button */}
          <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>
          </div>

          {/* Featured Image */}
          {blogPost.image && (
            <div className="max-w-5xl mx-auto mb-8 sm:mb-12">
              <div className="relative h-64 sm:h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={blogPost.image}
                  alt={blogPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Article Header */}
          <div className="max-w-4xl mx-auto">
            <header className="mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                {blogPost.title}
              </h1>

              {blogPost.excerpt && (
                <p className="text-lg sm:text-xl text-gray-600 mb-6 leading-relaxed">
                  {blogPost.excerpt}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm sm:text-base text-gray-500 border-t border-b border-gray-200 py-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
                  {publishedDate}
                </div>
                {blogPost.author && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
                    {blogPost.author}
                  </div>
                )}
              </div>
            </header>

            {/* Article Content */}
            <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base sm:text-lg">
                {blogPost.content}
              </div>
            </div>

            {/* Footer */}
            <footer className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Link
                  href="/blog"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base group"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Blog
                </Link>

                <div className="flex gap-3">
                  <Link
                    href="/contact"
                    className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm sm:text-base"
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="/"
                    className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm sm:text-base"
                  >
                    Browse Products
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </div>
  );
}
