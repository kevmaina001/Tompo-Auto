import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get admin user by Clerk ID
export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("adminUsers")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Create admin user
export const create = mutation({
  args: {
    clerkId: v.string(),
    role: v.union(v.literal("owner"), v.literal("staff")),
  },
  handler: async (ctx, args) => {
    // Check if admin already exists
    const existing = await ctx.db
      .query("adminUsers")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existing) {
      throw new Error("Admin user already exists");
    }

    const adminId = await ctx.db.insert("adminUsers", {
      clerkId: args.clerkId,
      role: args.role,
      createdAt: Date.now(),
    });

    return adminId;
  },
});

// Get dashboard statistics
export const getStats = query({
  handler: async (ctx) => {
    const [products, categories, enquiries, lowStockProducts] =
      await Promise.all([
        ctx.db.query("products").collect(),
        ctx.db.query("categories").collect(),
        ctx.db.query("enquiries").collect(),
        ctx.db.query("products").collect(),
      ]);

    const lowStock = lowStockProducts.filter(
      (product) => product.stock <= 10
    ).length;

    const totalViews = products.reduce((sum, product) => sum + product.views, 0);

    return {
      totalProducts: products.length,
      totalCategories: categories.length,
      totalEnquiries: enquiries.length,
      lowStockCount: lowStock,
      totalViews,
    };
  },
});
