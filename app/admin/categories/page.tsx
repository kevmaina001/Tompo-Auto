"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FastCloudinaryUpload } from "@/components/fast-cloudinary-upload";
import { Plus, Edit, Trash2 } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";

export default function CategoriesPage() {
  const categories = useQuery(api.categories.list);
  const createCategory = useMutation(api.categories.create);
  const updateCategory = useMutation(api.categories.update);
  const deleteCategory = useMutation(api.categories.remove);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<NonNullable<typeof categories>[number] | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: "",
    description: "",
  });

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategory({
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
        image: formData.image || undefined,
        description: formData.description || undefined,
      });
      setFormData({ name: "", slug: "", image: "", description: "" });
      setIsCreateOpen(false);
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      await updateCategory({
        id: editingCategory._id,
        name: formData.name,
        slug: formData.slug,
        image: formData.image || undefined,
        description: formData.description || undefined,
      });
      setFormData({ name: "", slug: "", image: "", description: "" });
      setEditingCategory(null);
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDelete = async (id: Id<"categories">) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory({ id });
      } catch (error: unknown) {
        alert((error as Error).message || "Error deleting category");
      }
    }
  };

  const openEditDialog = (category: NonNullable<typeof categories>[number]) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      image: category.image || "",
      description: category.description || "",
    });
    setIsEditOpen(true);
  };

  if (!categories) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-4 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Categories</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="Auto-generated from name"
                />
              </div>
              <div>
                <Label>Category Image</Label>
                <FastCloudinaryUpload
                  onUpload={(url) => setFormData({ ...formData, image: url })}
                  currentImages={formData.image ? [formData.image] : []}
                  onRemove={() => setFormData({ ...formData, image: "" })}
                />
                <Input
                  className="mt-2"
                  placeholder="Or paste image URL"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <Button type="submit" className="w-full">
                Create Category
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateCategory} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-slug">Slug</Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Category Image</Label>
              <FastCloudinaryUpload
                onUpload={(url) => setFormData({ ...formData, image: url })}
                currentImages={formData.image ? [formData.image] : []}
                onRemove={() => setFormData({ ...formData, image: "" })}
              />
              <div className="text-xs text-gray-500 mt-2">Or paste URL:</div>
              <Input
                className="mt-1"
                placeholder="Paste image URL here"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <Button type="submit" className="w-full">
              Update Category
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category._id}>
            <CardHeader className="pb-3">
              <CardTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <span className="text-base sm:text-lg truncate max-w-[180px] sm:max-w-none">{category.name}</span>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(category._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {category.image && (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-32 sm:h-40 object-cover rounded mb-2"
                />
              )}
              <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
              <p className="text-xs text-gray-400 mt-2 truncate">Slug: {category.slug}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No categories yet. Create your first category to get started.
        </div>
      )}
    </div>
  );
}
