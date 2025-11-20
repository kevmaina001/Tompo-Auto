import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all categories
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("categories").order("desc").collect();
  },
});

// Get a single category by ID
export const getById = query({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get a single category by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Create a new category
export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    image: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const categoryId = await ctx.db.insert("categories", {
      name: args.name,
      slug: args.slug,
      image: args.image,
      description: args.description,
      createdAt: Date.now(),
    });
    return categoryId;
  },
});

// Update a category
export const update = mutation({
  args: {
    id: v.id("categories"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    image: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // Filter out undefined values
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(id, filteredUpdates);
    return id;
  },
});

// Delete a category
export const remove = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    // Check if any products are using this category
    const productsWithCategory = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("categoryId", args.id))
      .first();

    if (productsWithCategory) {
      throw new Error("Cannot delete category with existing products");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});
