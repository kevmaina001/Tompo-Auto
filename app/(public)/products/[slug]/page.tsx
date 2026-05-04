import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductClient from "./ProductClient";

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await fetchQuery(api.products.list);
  return products
    .filter((p) => p.slug && p.slug === p.slug.trim() && !p.slug.endsWith("-"))
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await fetchQuery(api.products.getBySlug, { slug: params.slug });

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested auto spare part could not be found.",
    };
  }

  return {
    title: product.title,
    description: product.description || `Buy ${product.title} - Quality auto spare part available at Tompo's Auto`,
    openGraph: {
      title: product.title,
      description: product.description || `Buy ${product.title} at Tompo's Auto Spare Parts`,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
    alternates: {
      canonical: `/products/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await fetchQuery(api.products.getBySlug, { slug: params.slug });

  if (!product) {
    notFound();
  }

  const category = await fetchQuery(api.categories.getById, { id: product.categoryId });

  return <ProductClient product={product} category={category} />;
}
