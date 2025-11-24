"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EnquiriesPage() {
  const enquiries = useQuery(api.enquiries.listWithProducts);

  if (!enquiries) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-4 sm:px-0">
      <h2 className="text-2xl font-bold mb-6">Customer Enquiries</h2>

      <div className="space-y-6">
        {enquiries.map((enquiry) => (
          <Card key={enquiry._id}>
            <CardHeader className="pb-3">
              <CardTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="text-sm sm:text-base">
                  <span className="font-semibold">Enquiry from {enquiry.name || "Anonymous"}</span>
                  {enquiry.phone && (
                    <span className="block sm:inline text-gray-600 sm:ml-1">- {enquiry.phone}</span>
                  )}
                </div>
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {new Date(enquiry.createdAt).toLocaleDateString()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
                  {enquiry.location && (
                    <div>
                      <span className="font-semibold">Location:</span> {enquiry.location}
                    </div>
                  )}
                  <div>
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(enquiry.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* Products */}
                <div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Requested Items:</h4>

                  {/* Mobile Card View */}
                  <div className="sm:hidden space-y-3">
                    {enquiry.items.map((item, idx) => (
                      <div key={idx} className="border rounded-lg p-3">
                        <div className="flex items-start gap-3">
                          {item.product?.images?.[0] && (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.title}
                              className="w-12 h-12 rounded object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {item.product?.title || "Product not found"}
                            </div>
                            {item.product?.brand && (
                              <div className="text-xs text-gray-500">{item.product.brand}</div>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                          <div>
                            <span className="text-gray-500 block">Qty</span>
                            <span className="font-medium">{item.quantity}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Price</span>
                            <span>KES {item.price.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Subtotal</span>
                            <span className="font-medium">KES {(item.quantity * item.price).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden sm:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {enquiry.items.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell>
                              <div className="flex items-center">
                                {item.product?.images?.[0] && (
                                  <img
                                    src={item.product.images[0]}
                                    alt={item.product.title}
                                    className="w-10 h-10 rounded object-cover mr-3"
                                  />
                                )}
                                <div>
                                  <div className="font-medium">
                                    {item.product?.title || "Product not found"}
                                  </div>
                                  {item.product?.brand && (
                                    <div className="text-xs text-gray-500">
                                      {item.product.brand}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>KES {item.price.toLocaleString()}</TableCell>
                            <TableCell>
                              KES {(item.quantity * item.price).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-end">
                  <div className="text-base sm:text-lg font-bold">
                    Total: KES{" "}
                    {enquiry.items
                      .reduce((sum, item) => sum + item.quantity * item.price, 0)
                      .toLocaleString()}
                  </div>
                </div>

                {/* WhatsApp Message */}
                <div className="bg-gray-50 p-3 sm:p-4 rounded">
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">WhatsApp Message:</h4>
                  <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{enquiry.whatsappMessage}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {enquiries.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No enquiries yet.
          </div>
        )}
      </div>
    </div>
  );
}
