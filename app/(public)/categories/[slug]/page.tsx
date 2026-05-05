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

  const title = `${category.name} - Auto Parts in Kenya`;
  const description =
    category.description ||
    `Buy quality ${category.name.toLowerCase()} auto parts in Nairobi, Kenya. Genuine OEM ${category.name.toLowerCase()} for all vehicle makes at Tompo's Auto Spare Parts. Fast delivery & instant WhatsApp quotes.`;

  return {
    title,
    description,
    keywords: [
      category.name,
      `${category.name} Kenya`,
      `${category.name} Nairobi`,
      `${category.name} parts`,
      `buy ${category.name.toLowerCase()}`,
      "auto spare parts Kenya",
    ],
    openGraph: {
      title,
      description,
      images: category.image ? [{ url: category.image, width: 1200, height: 630, alt: category.name }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: category.image ? [category.image] : [],
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

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} - Auto Parts`,
    description:
      category.description ||
      `Browse quality ${category.name} auto parts at Tompo's Auto Spare Parts. Genuine parts for all vehicle makes.`,
    url: `https://www.tomposauto.com/categories/${category.slug}`,
    isPartOf: { "@type": "WebSite", name: "Tompo's Auto Spare Parts", url: "https://www.tomposauto.com" },
    provider: {
      "@type": "AutoPartsStore",
      name: "Tompo's Auto Spare Parts",
      url: "https://www.tomposauto.com",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.slice(0, 50).map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `https://www.tomposauto.com/products/${p.slug}`,
        name: p.title,
      })),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.tomposauto.com" },
      {
        "@type": "ListItem",
        position: 2,
        name: category.name,
        item: `https://www.tomposauto.com/categories/${category.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CategoryClient category={category} products={products} />
    </>
  );
}
