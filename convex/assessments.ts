import { v } from "convex/values";
import { mutation, internalAction, internalMutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { rateLimiter } from "./rateLimits";

export const createAssessment = mutation({
  args: {
    organizationId: v.string(),
    vehicleData: v.any(), // v.object({...}) in real app
    clientInfo: v.any(), // v.object({...})
  },
  handler: async (ctx, args) => {
    // Rate limit by organization to prevent spam
    const { ok, retryAfter } = await rateLimiter.limit(
      ctx, 
      "assessmentCreation",
      { key: args.organizationId }
    );
    
    if (!ok) {
        throw new Error(
            `Too many assessments. Please wait ${Math.ceil(retryAfter / 1000)}s`
        );
    }
    
    // Proceed with assessment creation
    const assessmentId = await ctx.db.insert("assessments", {
      organizationId: args.organizationId,
      vehicleData: args.vehicleData,
      clientInfo: args.clientInfo,
      status: "pending_pricing",
      createdAt: Date.now(),
    });
    
    // Schedule AI pricing (separate action)
    await ctx.scheduler.runAfter(
      0, 
      internal.assessments.calculatePricing, // calling internal action in this file for simplicity
      { assessmentId }
    );
    
    return assessmentId;
  },
});

export const getAssessment = query({
  args: { assessmentId: v.id("assessments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.assessmentId);
  },
});

export const updatePricing = internalMutation({
    args: { assessmentId: v.id("assessments"), pricing: v.any() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.assessmentId, { 
            pricing: args.pricing,
            status: "priced" 
        });
    }
});

export const listAssessments = query({
    args: { organizationId: v.string() },
    handler: async (ctx, args) => {
        // In a real app, you would add an index on organizationId
        // For now, full table scan filtered in memory (Ok for MVP small data)
        const assessments = await ctx.db
            .query("assessments")
            .filter((q) => q.eq(q.field("organizationId"), args.organizationId))
            .order("desc")
            .take(50);
            
        return assessments;
    }
});

// Protected AI pricing action
export const calculatePricing = internalAction({
  args: { assessmentId: v.id("assessments") },
  handler: async (ctx, { assessmentId }) => {
    const assessment = await ctx.runQuery((internal.assessments as any).getAssessment, {
      assessmentId
    });
    
    // Rate limit AI calls to control costs
    const { ok } = await rateLimiter.limit(ctx, "aiPricing", {
      key: assessment.organizationId,
      throws: true,  // Auto-throw if exceeded
    });
    
    // Mock AI call
    // const pricing = await generatePricingWithOllama(assessment);
    const pricing = { estimate: 150, confidence: 0.9 };
    
    await ctx.runMutation(internal.assessments.updatePricing, {
      assessmentId,
      pricing,
    });
  },
});

export const updateVehicleData = internalMutation({
  args: { assessmentId: v.id("assessments"), vehicleData: v.any() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.assessmentId, { 
      vehicleData: args.vehicleData
    });
  }
});
