"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useParams } from "next/navigation";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const category = useQuery(api.categories.getBySlug, { slug });
  const allProducts = useQuery(api.products.list);
  const { addItem } = useCart();

  const products = allProducts?.filter(
    (p) => category && p.categoryId === category._id
  );

  const handleAddToCart = (product: NonNullable<typeof products>[number]) => {
    addItem({
      productId: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0],
    });
  };

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      {/* Category Header */}
      <div className="mb-8">
        {category.image && (
          <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600">{category.description}</p>
        )}
      </div>

      {/* Products Grid */}
      {!products ? (
        <div>Loading products...</div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-gray-600">{products.length} products found</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card
                key={product._id}
                className="hover:shadow-lg transition-shadow"
              >
                <Link href={`/products/${product.slug}`}>
                  {product.images[0] && (
                    <div className="aspect-square w-full overflow-hidden rounded-t-lg">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                </Link>
                <CardHeader>
                  <Link href={`/products/${product.slug}`}>
                    <CardTitle className="text-base hover:text-blue-600">
                      {product.title}
                    </CardTitle>
                  </Link>
                  {product.brand && (
                    <p className="text-xs text-gray-500">{product.brand}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-lg font-bold text-blue-600">
                      KES {product.price.toLocaleString()}
                    </p>
                    {product.stock > 0 ? (
                      <Badge variant="outline" className="text-green-600">
                        In Stock
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Out of Stock</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Enquiry
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No products in this category yet.
            </div>
          )}
        </>
      )}
    </div>
  );
}
