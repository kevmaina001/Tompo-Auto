import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    image: v.optional(v.string()),
    description: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_slug", ["slug"]),

  products: defineTable({
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
    views: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["categoryId"])
    .index("by_featured", ["featured"]),

  enquiries: defineTable({
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
        price: v.number(),
      })
    ),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
    whatsappMessage: v.string(),
    createdAt: v.number(),
  }),

  adminUsers: defineTable({
    clerkId: v.string(),
    role: v.union(v.literal("owner"), v.literal("staff")),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),
});
