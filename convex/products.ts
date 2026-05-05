import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";

// Builds the denormalized search field. Higher-signal fields are repeated so
// BM25 ranks them ahead of body text.
function buildSearchBlob(input: {
  title: string;
  brand?: string;
  oemNumber?: string;
  compatibleModels?: string[];
  description?: string;
  categoryName?: string;
}): string {
  const parts: string[] = [];
  parts.push(input.title, input.title, input.title);
  if (input.brand) parts.push(input.brand, input.brand);
  if (input.oemNumber) parts.push(input.oemNumber, input.oemNumber);
  if (input.categoryName) parts.push(input.categoryName);
  if (input.compatibleModels?.length) parts.push(input.compatibleModels.join(" "));
  if (input.description) parts.push(input.description.slice(0, 200));
  return parts.join(" ");
}

async function getCategoryName(ctx: MutationCtx, categoryId: Id<"categories">) {
  const category = await ctx.db.get(categoryId);
  return category?.name;
}

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
    const categoryName = await getCategoryName(ctx, args.categoryId);
    const searchBlob = buildSearchBlob({ ...args, categoryName });

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
      searchBlob,
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
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Product not found");

    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    ) as Partial<typeof existing>;

    const merged = { ...existing, ...filteredUpdates };
    const categoryName = await getCategoryName(ctx, merged.categoryId);
    const searchBlob = buildSearchBlob({
      title: merged.title,
      brand: merged.brand,
      oemNumber: merged.oemNumber,
      compatibleModels: merged.compatibleModels,
      description: merged.description,
      categoryName,
    });

    await ctx.db.patch(id, {
      ...filteredUpdates,
      searchBlob,
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

// Search products via Convex full-text search index.
// Supports: prefix matching, single-character typo tolerance, BM25 ranking.
export const search = query({
  args: {
    searchTerm: v.string(),
    categoryId: v.optional(v.id("categories")),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    inStockOnly: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const term = args.searchTerm.trim();
    if (!term) return [];

    const limit = args.limit ?? 20;
    // Pull more than `limit` so post-filter (price/stock) still has results to return.
    const fetchSize = Math.min(limit * 4, 200);

    const results = await ctx.db
      .query("products")
      .withSearchIndex("by_search", (q) => {
        const search = q.search("searchBlob", term);
        return args.categoryId ? search.eq("categoryId", args.categoryId) : search;
      })
      .take(fetchSize);

    const filtered = results.filter((product) => {
      if (args.minPrice !== undefined && product.price < args.minPrice) return false;
      if (args.maxPrice !== undefined && product.price > args.maxPrice) return false;
      if (args.inStockOnly && product.stock <= 0) return false;
      return true;
    });

    return filtered.slice(0, limit);
  },
});

// One-time backfill: populate searchBlob for products that don't have it yet.
// Run from Convex dashboard → Functions → products:backfillSearchBlob → Run.
// Idempotent — safe to run multiple times. Recomputes blobs every time so it
// also serves as a manual reindex if buildSearchBlob logic changes.
export const backfillSearchBlob = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("products").collect();
    let updated = 0;
    for (const product of all) {
      const categoryName = await getCategoryName(ctx, product.categoryId);
      const searchBlob = buildSearchBlob({
        title: product.title,
        brand: product.brand,
        oemNumber: product.oemNumber,
        compatibleModels: product.compatibleModels,
        description: product.description,
        categoryName,
      });
      if (searchBlob !== product.searchBlob) {
        await ctx.db.patch(product._id, { searchBlob });
        updated++;
      }
    }
    return { total: all.length, updated };
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
