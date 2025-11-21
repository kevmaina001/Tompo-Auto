"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, CheckCircle } from "lucide-react";
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <Link
        href="/"
        className="inline-flex items-center text-xs sm:text-sm text-blue-600 hover:text-blue-800 mb-4 sm:mb-6"
      >
        <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
        Back to Home
      </Link>

      {/* Category Header */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        {category.image && (
          <div className="w-full h-32 sm:h-40 md:h-48 rounded-lg overflow-hidden mb-3 sm:mb-4">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-sm sm:text-base text-gray-600">{category.description}</p>
        )}
      </div>

      {/* Products Grid */}
      {!products ? (
        <div>Loading products...</div>
      ) : (
        <>
          <div className="mb-3 sm:mb-4">
            <p className="text-sm sm:text-base text-gray-600">{products.length} products found</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
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
                <CardHeader className="p-2 sm:p-3 md:p-4">
                  <Link href={`/products/${product.slug}`}>
                    <CardTitle className="text-xs sm:text-sm md:text-base hover:text-blue-600 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
                      {product.title}
                    </CardTitle>
                  </Link>
                  {product.brand && (
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 line-clamp-1">{product.brand}</p>
                  )}
                  <div className="flex items-center justify-between mt-1 sm:mt-2 gap-1">
                    <div>
                      <p className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                        {product.price.toLocaleString()}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500">KES</p>
                    </div>
                    {product.stock > 0 ? (
                      <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50 text-[10px] sm:text-xs px-1 sm:px-2 py-0.5">
                        <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                        <span className="hidden sm:inline">In Stock</span>
                        <span className="sm:hidden">✓</span>
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-[10px] sm:text-xs px-1 sm:px-2 py-0.5">Out</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 md:p-4 pt-0">
                  <Button
                    className="w-full text-xs sm:text-sm py-1.5 sm:py-2 h-auto"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Add to Enquiry</span>
                    <span className="sm:hidden">Add</span>
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
