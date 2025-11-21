"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Head from "next/head";
import { ShoppingCart, ArrowLeft, Plus, Minus } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const product = useQuery(api.products.getBySlug, { slug });
  const category = useQuery(
    api.categories.getById,
    product ? { id: product.categoryId } : "skip"
  );
  const incrementViews = useMutation(api.products.incrementViews);

  const { addItem, items, updateQuantity } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Increment views and update page title when product loads
  useEffect(() => {
    if (product) {
      incrementViews({ id: product._id });
      // Update document title for SEO
      document.title = `${product.title} | Tompo's Auto Spare Parts`;
    }
  }, [product?._id, product?.title]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  const cartItem = items.find((item) => item.productId === product._id);

  const handleAddToCart = () => {
    if (cartItem) {
      updateQuantity(product._id, cartItem.quantity + quantity);
    } else {
      for (let i = 0; i < quantity; i++) {
        addItem({
          productId: product._id,
          title: product.title,
          price: product.price,
          image: product.images[0],
        });
      }
    }
    setQuantity(1);
  };

  // JSON-LD structured data for the product
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || `${product.title} - Quality auto spare part available at Tompo's Auto`,
    image: product.images[0] || "",
    brand: product.brand ? {
      "@type": "Brand",
      name: product.brand,
    } : undefined,
    sku: product.oemNumber || product._id,
    mpn: product.oemNumber,
    offers: {
      "@type": "Offer",
      url: `https://www.tomposauto.com/products/${product.slug}`,
      priceCurrency: "KES",
      price: product.price,
      availability: product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Tompo's Auto Spare Parts",
      },
    },
    category: category?.name || "Auto Parts",
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href={category ? `/categories/${category.slug}` : "/"}
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to {category?.name || "Home"}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="aspect-square w-full rounded-lg overflow-hidden mb-4 bg-gray-100">
            <img
              src={product.images[selectedImage] || "/placeholder.png"}
              alt={product.title}
              className="w-full h-full object-contain"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === idx
                      ? "border-blue-600"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              {product.brand && (
                <p className="text-gray-600">Brand: {product.brand}</p>
              )}
            </div>
            {product.featured && (
              <Badge className="ml-2">Featured</Badge>
            )}
          </div>

          <div className="mb-6">
            <p className="text-3xl font-bold text-blue-600">
              KES {product.price.toLocaleString()}
            </p>
            {product.stock > 0 ? (
              <Badge variant="outline" className="mt-2 text-green-600">
                In Stock ({product.stock} available)
              </Badge>
            ) : (
              <Badge variant="destructive" className="mt-2">
                Out of Stock
              </Badge>
            )}
          </div>

          {product.description && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          )}

          {/* Specifications */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Specifications</h3>
              <div className="space-y-2 text-sm">
                {product.oemNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">OEM Number:</span>
                    <span className="font-medium">{product.oemNumber}</span>
                  </div>
                )}
                {product.brand && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Brand:</span>
                    <span className="font-medium">{product.brand}</span>
                  </div>
                )}
                {product.compatibleModels && product.compatibleModels.length > 0 && (
                  <div>
                    <span className="text-gray-600 block mb-2">
                      Compatible Models:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.compatibleModels.map((model, idx) => (
                        <Badge key={idx} variant="secondary">
                          {model}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 font-semibold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                size="lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {cartItem ? "Update Enquiry" : "Add to Enquiry"}
              </Button>
            </div>

            {cartItem && (
              <p className="text-sm text-gray-600 text-center">
                Currently {cartItem.quantity} in your enquiry cart
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
