"use client";

import { useState, memo, useCallback } from "react";
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
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  published: boolean;
}

interface BlogFormProps {
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const BlogForm = memo(function BlogForm({
  onSubmit,
  submitLabel,
  formData,
  setFormData
}: BlogFormProps) {
  const handleFieldChange = useCallback((field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, [setFormData]);

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="title">Blog Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            required
            placeholder="e.g., Understanding Car Aerodynamics"
          />
          <p className="text-xs text-gray-500 mt-1">Enter the blog post title (not the image URL)</p>
        </div>

        <div className="col-span-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => handleFieldChange('slug', e.target.value)}
            placeholder="Auto-generated from title"
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => handleFieldChange('excerpt', e.target.value)}
            rows={2}
            placeholder="Short summary of the blog post"
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="content">Content *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => handleFieldChange('content', e.target.value)}
            required
            rows={10}
            placeholder="Write your blog post content here..."
          />
        </div>

        <div className="col-span-2">
          <Label>Featured Image</Label>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2 text-sm">⚡ Upload Image (Fast Direct Upload)</h4>
              <FastMultiUpload
                currentImages={formData.image ? [formData.image] : []}
                onUpdate={(urls) => handleFieldChange('image', urls[0] || '')}
                onRemove={() => handleFieldChange('image', '')}
                maxFiles={1}
              />
            </div>

            <div className="border rounded-lg p-4 bg-blue-50">
              <h4 className="font-medium mb-2 text-sm">🔗 Or Paste Image URL</h4>
              <Input
                id="image"
                type="url"
                value={formData.image}
                onChange={(e) => handleFieldChange('image', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => handleFieldChange('author', e.target.value)}
            placeholder="Author name"
          />
        </div>

        <div className="col-span-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => handleFieldChange('published', e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="published" className="cursor-pointer">
              Publish immediately
            </Label>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {"Unpublished posts won't be visible to visitors"}
          </p>
        </div>
      </div>

      <Button type="submit" className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
});

export default function BlogPage() {
  const blogPosts = useQuery(api.blogPosts.list);
  const createBlogPost = useMutation(api.blogPosts.create);
  const updateBlogPost = useMutation(api.blogPosts.update);
  const deleteBlogPost = useMutation(api.blogPosts.remove);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<NonNullable<typeof blogPosts>[number] | null>(null);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    author: "",
    published: false,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      image: "",
      author: "",
      published: false,
    });
  };

  const handleCreatePost = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBlogPost({
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
        excerpt: formData.excerpt || undefined,
        content: formData.content,
        image: formData.image || undefined,
        author: formData.author || undefined,
        published: formData.published,
      });
      resetForm();
      setIsCreateOpen(false);
    } catch (error) {
      console.error("Error creating blog post:", error);
      alert("Failed to create blog post. Please try again.");
    }
  }, [formData, createBlogPost]);

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    try {
      await updateBlogPost({
        id: editingPost._id,
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || undefined,
        content: formData.content,
        image: formData.image || undefined,
        author: formData.author || undefined,
        published: formData.published,
      });
      resetForm();
      setEditingPost(null);
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error updating blog post:", error);
      alert("Failed to update blog post. Please try again.");
    }
  };

  const handleDelete = async (id: Id<"blogPosts">) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteBlogPost({ id });
      } catch (error: unknown) {
        alert((error as Error).message || "Error deleting blog post");
      }
    }
  };

  const openEditDialog = (post: NonNullable<typeof blogPosts>[number]) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      image: post.image || "",
      author: post.author || "",
      published: post.published,
    });
    setIsEditOpen(true);
  };

  if (!blogPosts) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-4 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Blog Post</DialogTitle>
            </DialogHeader>
            <BlogForm
              onSubmit={handleCreatePost}
              submitLabel="Create Post"
              formData={formData}
              setFormData={setFormData}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
          </DialogHeader>
          <BlogForm
            onSubmit={handleUpdatePost}
            submitLabel="Update Post"
            formData={formData}
            setFormData={setFormData}
          />
        </DialogContent>
      </Dialog>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogPosts.map((post) => {
              const createdDate = new Date(post.createdAt).toLocaleDateString();
              return (
                <TableRow key={post._id}>
                  <TableCell>
                    <div className="flex items-center">
                      {post.image && (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-12 h-12 rounded object-cover mr-3"
                        />
                      )}
                      <div>
                        <div className="font-medium">{post.title}</div>
                        {post.excerpt && (
                          <div className="text-xs text-gray-500 line-clamp-1">
                            {post.excerpt}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{post.author || "—"}</TableCell>
                  <TableCell>
                    {post.published ? (
                      <Badge className="bg-green-600">
                        <Eye className="h-3 w-3 mr-1" />
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Draft
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{createdDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(post)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(post._id)}
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

        {blogPosts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No blog posts yet. Create your first post to get started.
          </div>
        )}
      </div>
    </div>
  );
}
