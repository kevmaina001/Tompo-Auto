import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { Calendar, User, ArrowLeft } from "lucide-react";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function generateStaticParams() {
  const posts = await fetchQuery(api.blogPosts.listPublished);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blogPost = await fetchQuery(api.blogPosts.getBySlug, { slug: params.slug });

  if (!blogPost) {
    return {
      title: "Post Not Found | Tompo's Auto Blog",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: blogPost.title,
    description: blogPost.excerpt || blogPost.content.substring(0, 160),
    openGraph: {
      title: blogPost.title,
      description: blogPost.excerpt || blogPost.content.substring(0, 160),
      images: blogPost.image ? [{ url: blogPost.image }] : [],
      type: "article",
    },
    alternates: {
      canonical: `/blog/${blogPost.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const blogPost = await fetchQuery(api.blogPosts.getBySlug, { slug: params.slug });

  if (!blogPost) {
    notFound();
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

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blogPost.title,
    description: blogPost.excerpt || blogPost.content.substring(0, 160),
    image: blogPost.image || "https://www.tomposauto.com/og-image.jpg",
    author: {
      "@type": "Person",
      name: blogPost.author || "Tompo's Auto",
    },
    publisher: {
      "@type": "Organization",
      name: "Tompo's Auto Spare Parts",
      logo: {
        "@type": "ImageObject",
        url: "https://www.tomposauto.com/logo.png",
      },
    },
    datePublished: blogPost.publishedAt
      ? new Date(blogPost.publishedAt).toISOString()
      : new Date(blogPost.createdAt).toISOString(),
    dateModified: new Date(blogPost.updatedAt).toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.tomposauto.com/blog/${blogPost.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {!blogPost.published && (
          <div className="bg-yellow-500 text-white py-3 px-4 text-center font-semibold">
            ⚠️ Preview Mode: This post is not published yet and is only visible to you
          </div>
        )}

        <article className="py-8 sm:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
              <Link
                href="/blog"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base group"
              >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Blog
              </Link>
            </div>

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

              <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base sm:text-lg">
                  {blogPost.content}
                </div>
              </div>

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
    </>
  );
}
