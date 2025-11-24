import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all contact messages (admin)
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("contacts").order("desc").collect();
  },
});

// Get contacts by status
export const listByStatus = query({
  args: { status: v.union(v.literal("new"), v.literal("read"), v.literal("responded")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("contacts")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("desc")
      .collect();
  },
});

// Create a new contact message
export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const contactId = await ctx.db.insert("contacts", {
      ...args,
      status: "new",
      createdAt: Date.now(),
    });
    return contactId;
  },
});

// Update contact status
export const updateStatus = mutation({
  args: {
    id: v.id("contacts"),
    status: v.union(v.literal("new"), v.literal("read"), v.literal("responded")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
    });
    return args.id;
  },
});

// Delete a contact message
export const remove = mutation({
  args: { id: v.id("contacts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});
