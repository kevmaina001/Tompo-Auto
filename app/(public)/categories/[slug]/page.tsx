import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import CategoryClient from "./CategoryClient";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await fetchQuery(api.categories.list);
  return categories
    .filter((c) => c.slug && c.slug === c.slug.trim() && !c.slug.endsWith("-"))
    .map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await fetchQuery(api.categories.getBySlug, { slug: params.slug });

  if (!category) {
    return {
      title: "Category Not Found",
      description: "The requested auto parts category could not be found.",
    };
  }

  return {
    title: `${category.name} - Auto Parts`,
    description: category.description || `Browse quality ${category.name} auto parts at Tompo's Auto Spare Parts. Genuine parts for all vehicle makes.`,
    openGraph: {
      title: `${category.name} - Auto Parts`,
      description: category.description || `Browse quality ${category.name} auto parts`,
      images: category.image ? [{ url: category.image }] : [],
    },
    alternates: {
      canonical: `/categories/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await fetchQuery(api.categories.getBySlug, { slug: params.slug });

  if (!category) {
    notFound();
  }

  const products = await fetchQuery(api.products.getByCategory, { categoryId: category._id });

  return <CategoryClient category={category} products={products} />;
}
