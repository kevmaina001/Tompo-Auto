import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductClient from "./ProductClient";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await fetchQuery(api.products.list);
  return products
    .filter((p) => p.slug && p.slug === p.slug.trim() && !p.slug.endsWith("-"))
    .map((p) => ({ slug: p.slug }));
}

function buildSeoTitle(product: { title: string; brand?: string; oemNumber?: string }) {
  const parts = [product.title];
  if (product.brand && !product.title.toLowerCase().includes(product.brand.toLowerCase())) {
    parts.push(product.brand);
  }
  if (product.oemNumber) {
    parts.push(`OEM ${product.oemNumber}`);
  }
  return parts.join(" - ");
}

function buildSeoDescription(product: {
  title: string;
  brand?: string;
  oemNumber?: string;
  price: number;
  stock: number;
  compatibleModels?: string[];
  description?: string;
}) {
  const bits: string[] = [];
  bits.push(`Buy ${product.title}`);
  if (product.brand) bits.push(`by ${product.brand}`);
  if (product.compatibleModels?.length) {
    bits.push(`fits ${product.compatibleModels.slice(0, 3).join(", ")}`);
  }
  bits.push(`KES ${product.price.toLocaleString()}`);
  if (product.stock > 0) bits.push("in stock");
  bits.push("at Tompo's Auto Spare Parts in Nairobi, Kenya");
  bits.push("Fast delivery & instant WhatsApp quotes");
  let desc = bits.join(" ") + ".";
  if (product.description) {
    desc = `${product.description.slice(0, 100).trim()}... ${desc}`;
  }
  return desc.slice(0, 300);
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await fetchQuery(api.products.getBySlug, { slug: params.slug });

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested auto spare part could not be found.",
    };
  }

  const title = buildSeoTitle(product);
  const description = buildSeoDescription(product);

  return {
    title,
    description,
    keywords: [
      product.title,
      product.brand,
      product.oemNumber,
      ...(product.compatibleModels || []),
      "auto parts Kenya",
      "spare parts Nairobi",
    ].filter(Boolean) as string[],
    openGraph: {
      title,
      description,
      images: product.images[0] ? [{ url: product.images[0], width: 1200, height: 1200, alt: product.title }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.images[0] ? [product.images[0]] : [],
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

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || `${product.title} - Quality auto spare part available at Tompo's Auto`,
    image: product.images.length > 0 ? product.images : undefined,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    sku: product.oemNumber || product._id,
    mpn: product.oemNumber,
    productID: product._id,
    category: category?.name || "Auto Parts",
    offers: {
      "@type": "Offer",
      url: `https://www.tomposauto.com/products/${product.slug}`,
      priceCurrency: "KES",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "AutoPartsStore",
        name: "Tompo's Auto Spare Parts",
        url: "https://www.tomposauto.com",
      },
      areaServed: { "@type": "Country", name: "Kenya" },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.tomposauto.com" },
      ...(category
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: category.name,
              item: `https://www.tomposauto.com/categories/${category.slug}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: category ? 3 : 2,
        name: product.title,
        item: `https://www.tomposauto.com/products/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductClient product={product} category={category} />
    </>
  );
}
