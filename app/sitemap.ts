import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tomposauto.com";

  // Static pages - always included
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic pages - fetch from database if Convex URL is available
  let dynamicPages: MetadataRoute.Sitemap = [];

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (convexUrl) {
    try {
      // Dynamically import to avoid build-time issues
      const { ConvexHttpClient } = await import("convex/browser");
      const { api } = await import("@/convex/_generated/api");

      const convex = new ConvexHttpClient(convexUrl);

      // Fetch all products
      const products = await convex.query(api.products.list);
      const productPages = products.map((product: { slug: string; updatedAt?: number; createdAt: number }) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(product.updatedAt || product.createdAt),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));

      // Fetch all categories
      const categories = await convex.query(api.categories.list);
      const categoryPages = categories.map((category: { slug: string }) => ({
        url: `${baseUrl}/categories/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));

      // Fetch all published blog posts
      const blogPosts = await convex.query(api.blogPosts.listPublished);
      const blogPages = blogPosts.map((post: { slug: string; updatedAt: number }) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));

      dynamicPages = [...categoryPages, ...productPages, ...blogPages];
    } catch (error) {
      // Log error but don't fail sitemap generation
      console.error("Error fetching dynamic sitemap data:", error);
    }
  }

  return [...staticPages, ...dynamicPages];
}
