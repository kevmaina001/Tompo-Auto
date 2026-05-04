import { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import HomeClient from "./HomeClient";

export const dynamic = "force-static";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    absolute: "Tompo's Auto Spare Parts | Quality Auto Parts in Kenya",
  },
  description: "Kenya's trusted supplier of genuine auto spare parts. Quality engine parts, brake systems, suspension, electrical components for all vehicle makes. Fast delivery in Nairobi & nationwide.",
  alternates: {
    canonical: "https://www.tomposauto.com",
  },
};

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    fetchQuery(api.categories.list),
    fetchQuery(api.products.getFeatured, { limit: 8 }),
  ]);

  return <HomeClient categories={categories} featuredProducts={featuredProducts} />;
}
