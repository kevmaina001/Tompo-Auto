"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Trash2, Plus, Minus, Send } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const createEnquiry = useMutation(api.enquiries.create);

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    location: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsSubmitting(true);

    try {
      // Build WhatsApp message
      const message = `*New Enquiry Request*\n\n*Customer Details:*\nName: ${
        customerInfo.name || "Not provided"
      }\nPhone: ${customerInfo.phone || "Not provided"}\nLocation: ${
        customerInfo.location || "Not provided"
      }\n\n*Items:*\n${items
        .map(
          (item, idx) =>
            `${idx + 1}. ${item.title}\n   Quantity: ${item.quantity}\n   Price: KES ${item.price.toLocaleString()}\n   Subtotal: KES ${(
              item.quantity * item.price
            ).toLocaleString()}`
        )
        .join("\n\n")}\n\n*Total: KES ${totalPrice.toLocaleString()}*`;

      // Save enquiry to database
      await createEnquiry({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        name: customerInfo.name || undefined,
        phone: customerInfo.phone || undefined,
        location: customerInfo.location || undefined,
        whatsappMessage: message,
      });

      // Create WhatsApp deep link
      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      // Clear cart
      clearCart();

      // Open WhatsApp
      window.open(whatsappUrl, "_blank");

      // Reset form
      setCustomerInfo({ name: "", phone: "", location: "" });

      alert("Enquiry saved! Opening WhatsApp...");
    } catch (error) {
      console.error("Error creating enquiry:", error);
      alert("Error creating enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your Enquiry Cart is Empty</h2>
          <p className="text-gray-600 mb-6">
            Browse our products and add items to your enquiry.
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
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
        Continue Shopping
      </Link>

      <h1 className="text-3xl font-bold mb-8">Enquiry Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.productId}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}

                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600">
                      KES {item.price.toLocaleString()} each
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-3 py-1 font-semibold min-w-[3ch] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="min-w-[100px] text-right">
                      <p className="font-bold">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.productId)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Checkout Form */}
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Complete Your Enquiry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, name: e.target.value })
                  }
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={customerInfo.phone}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, phone: e.target.value })
                  }
                  placeholder="e.g., 0712345678"
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={customerInfo.location}
                  onChange={(e) =>
                    setCustomerInfo({
                      ...customerInfo,
                      location: e.target.value,
                    })
                  }
                  placeholder="e.g., Nairobi"
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    KES {totalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">
                    KES {totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={isSubmitting}
              >
                <Send className="mr-2 h-5 w-5" />
                {isSubmitting ? "Processing..." : "Send Enquiry via WhatsApp"}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                {"Your enquiry will be sent via WhatsApp. We'll get back to you with availability and final pricing."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
