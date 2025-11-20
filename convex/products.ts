import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all products
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("products").order("desc").collect();
  },
});

// Get featured products
export const getFeatured = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    return await ctx.db
      .query("products")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .order("desc")
      .take(limit);
  },
});

// Get products by category
export const getByCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .order("desc")
      .collect();
  },
});

// Get a single product by ID
export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get a single product by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Increment product views
export const incrementViews = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product) throw new Error("Product not found");

    await ctx.db.patch(args.id, {
      views: product.views + 1,
    });
  },
});

// Create a new product
export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    categoryId: v.id("categories"),
    price: v.number(),
    stock: v.number(),
    description: v.optional(v.string()),
    images: v.array(v.string()),
    brand: v.optional(v.string()),
    oemNumber: v.optional(v.string()),
    compatibleModels: v.optional(v.array(v.string())),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const productId = await ctx.db.insert("products", {
      title: args.title,
      slug: args.slug,
      categoryId: args.categoryId,
      price: args.price,
      stock: args.stock,
      description: args.description,
      images: args.images,
      brand: args.brand,
      oemNumber: args.oemNumber,
      compatibleModels: args.compatibleModels,
      featured: args.featured ?? false,
      views: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return productId;
  },
});

// Update a product
export const update = mutation({
  args: {
    id: v.id("products"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
    price: v.optional(v.number()),
    stock: v.optional(v.number()),
    description: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    brand: v.optional(v.string()),
    oemNumber: v.optional(v.string()),
    compatibleModels: v.optional(v.array(v.string())),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // Filter out undefined values
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(id, {
      ...filteredUpdates,
      updatedAt: Date.now(),
    });
    return id;
  },
});

// Delete a product
export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Search products
export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const allProducts = await ctx.db.query("products").collect();
    const searchLower = args.searchTerm.toLowerCase();

    return allProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower) ||
        product.oemNumber?.toLowerCase().includes(searchLower)
    );
  },
});

// Get low stock products
export const getLowStock = query({
  args: { threshold: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const threshold = args.threshold ?? 10;
    const allProducts = await ctx.db.query("products").collect();

    return allProducts.filter((product) => product.stock <= threshold);
  },
});
