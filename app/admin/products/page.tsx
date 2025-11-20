"use client";

import { useState, memo, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FastMultiUpload } from "@/components/fast-multi-upload";
import { BulkImageInput } from "@/components/bulk-image-input";
import { Plus, Edit, Trash2 } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";

interface FormData {
  title: string;
  slug: string;
  categoryId: string;
  price: string;
  stock: string;
  description: string;
  images: string[];
  brand: string;
  oemNumber: string;
  compatibleModels: string;
  featured: boolean;
}

interface ProductFormProps {
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  categories: Array<{ _id: Id<"categories">; name: string; slug: string; image?: string; description?: string; createdAt: number }>;
}

const ProductForm = memo(function ProductForm({ onSubmit, submitLabel, formData, setFormData, categories }: ProductFormProps) {
  const handleFieldChange = useCallback((field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, [setFormData]);

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="title">Product Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => handleFieldChange('slug', e.target.value)}
            placeholder="Auto-generated"
          />
        </div>

        <div>
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.categoryId} onValueChange={(value) => handleFieldChange('categoryId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="price">Price (KES) *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => handleFieldChange('price', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="stock">Stock Quantity *</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => handleFieldChange('stock', e.target.value)}
            required
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            rows={3}
          />
        </div>

        <div className="col-span-2">
          <Label>Product Images</Label>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2 text-sm">⚡ Upload Files (Fast Direct Upload)</h4>
              <FastMultiUpload
                currentImages={formData.images}
                onUpdate={(urls) => handleFieldChange('images', urls)}
                onRemove={(index) => {
                  const newImages = formData.images.filter((_, i) => i !== index);
                  handleFieldChange('images', newImages);
                }}
                maxFiles={5}
              />
            </div>

            <div className="border rounded-lg p-4 bg-blue-50">
              <h4 className="font-medium mb-2 text-sm">🔗 Or Paste URLs (For Bulk)</h4>
              <BulkImageInput
                currentImages={formData.images}
                onUpdate={(urls) => handleFieldChange('images', urls)}
                onRemove={(index) => {
                  const newImages = formData.images.filter((_, i) => i !== index);
                  handleFieldChange('images', newImages);
                }}
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => handleFieldChange('brand', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="oemNumber">OEM Number</Label>
          <Input
            id="oemNumber"
            value={formData.oemNumber}
            onChange={(e) => handleFieldChange('oemNumber', e.target.value)}
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="compatibleModels">Compatible Models (comma-separated)</Label>
          <Textarea
            id="compatibleModels"
            value={formData.compatibleModels}
            onChange={(e) => handleFieldChange('compatibleModels', e.target.value)}
            placeholder="Toyota Corolla, Honda Civic"
            rows={2}
          />
        </div>

        <div className="col-span-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => handleFieldChange('featured', e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="featured" className="cursor-pointer">Mark as Featured Product</Label>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
});

export default function ProductsPage() {
  const products = useQuery(api.products.list);
  const categories = useQuery(api.categories.list);
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const deleteProduct = useMutation(api.products.remove);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<NonNullable<typeof products>[number] | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    categoryId: "",
    price: "",
    stock: "",
    description: "",
    images: [] as string[],
    brand: "",
    oemNumber: "",
    compatibleModels: "",
    featured: false,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      categoryId: "",
      price: "",
      stock: "",
      description: "",
      images: [],
      brand: "",
      oemNumber: "",
      compatibleModels: "",
      featured: false,
    });
  };

  const handleCreateProduct = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct({
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
        categoryId: formData.categoryId as Id<"categories">,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description || undefined,
        images: formData.images,
        brand: formData.brand || undefined,
        oemNumber: formData.oemNumber || undefined,
        compatibleModels: formData.compatibleModels
          ? formData.compatibleModels.split(",").map((m) => m.trim())
          : undefined,
        featured: formData.featured,
      });
      resetForm();
      setIsCreateOpen(false);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  }, [formData, createProduct, resetForm, setIsCreateOpen]);

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      await updateProduct({
        id: editingProduct._id,
        title: formData.title,
        slug: formData.slug,
        categoryId: formData.categoryId as Id<"categories">,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description || undefined,
        images: formData.images,
        brand: formData.brand || undefined,
        oemNumber: formData.oemNumber || undefined,
        compatibleModels: formData.compatibleModels
          ? formData.compatibleModels.split(",").map((m) => m.trim())
          : undefined,
        featured: formData.featured,
      });
      resetForm();
      setEditingProduct(null);
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDelete = async (id: Id<"products">) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct({ id });
      } catch (error: unknown) {
        alert((error as Error).message || "Error deleting product");
      }
    }
  };

  const openEditDialog = (product: NonNullable<typeof products>[number]) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      slug: product.slug,
      categoryId: product.categoryId,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description || "",
      images: product.images,
      brand: product.brand || "",
      oemNumber: product.oemNumber || "",
      compatibleModels: product.compatibleModels?.join(", ") || "",
      featured: product.featured || false,
    });
    setIsEditOpen(true);
  };

  if (!products || !categories) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-4 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
            </DialogHeader>
            <ProductForm
              onSubmit={handleCreateProduct}
              submitLabel="Create Product"
              formData={formData}
              setFormData={setFormData}
              categories={categories}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            onSubmit={handleUpdateProduct}
            submitLabel="Update Product"
            formData={formData}
            setFormData={setFormData}
            categories={categories}
          />
        </DialogContent>
      </Dialog>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const category = categories.find((c) => c._id === product.categoryId);
              return (
                <TableRow key={product._id}>
                  <TableCell>
                    <div className="flex items-center">
                      {product.images[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-10 h-10 rounded object-cover mr-3"
                        />
                      )}
                      <div>
                        <div className="font-medium">{product.title}</div>
                        {product.brand && (
                          <div className="text-xs text-gray-500">{product.brand}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{category?.name}</TableCell>
                  <TableCell>KES {product.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={product.stock <= 10 ? "text-red-600 font-semibold" : ""}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>{product.views}</TableCell>
                  <TableCell>
                    {product.featured && <Badge className="mr-1">Featured</Badge>}
                    {product.stock === 0 && <Badge variant="destructive">Out of Stock</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {products.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No products yet. Create your first product to get started.
          </div>
        )}
      </div>
    </div>
  );
}
