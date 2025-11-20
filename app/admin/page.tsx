"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function AdminDashboard() {
  const stats = useQuery(api.admin.getStats);
  const lowStockProducts = useQuery(api.products.getLowStock, {
    threshold: 10,
  });

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-4 sm:px-0">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total Products
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.totalProducts}
            </dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Categories
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.totalCategories}
            </dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total Enquiries
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.totalEnquiries}
            </dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-red-500 truncate">
              Low Stock Alert
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-red-600">
              {stats.lowStockCount}
            </dd>
          </div>
        </div>
      </div>

      {/* Low Stock Products */}
      {lowStockProducts && lowStockProducts.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Low Stock Products
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lowStockProducts.map((product) => (
                    <tr key={product._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        {product.stock} units
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        KES {product.price.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
