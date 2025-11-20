import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all enquiries
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("enquiries").order("desc").collect();
  },
});

// Get a single enquiry by ID
export const getById = query({
  args: { id: v.id("enquiries") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new enquiry
export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const enquiryId = await ctx.db.insert("enquiries", {
      items: args.items,
      name: args.name,
      phone: args.phone,
      location: args.location,
      whatsappMessage: args.whatsappMessage,
      createdAt: Date.now(),
    });
    return enquiryId;
  },
});

// Get recent enquiries
export const getRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    return await ctx.db.query("enquiries").order("desc").take(limit);
  },
});

// Get enquiries with product details
export const listWithProducts = query({
  handler: async (ctx) => {
    const enquiries = await ctx.db.query("enquiries").order("desc").collect();

    const enrichedEnquiries = await Promise.all(
      enquiries.map(async (enquiry) => {
        const itemsWithProducts = await Promise.all(
          enquiry.items.map(async (item) => {
            const product = await ctx.db.get(item.productId);
            return {
              ...item,
              product,
            };
          })
        );

        return {
          ...enquiry,
          items: itemsWithProducts,
        };
      })
    );

    return enrichedEnquiries;
  },
});
