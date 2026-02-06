import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { components } from "./_generated/api";
import { pricingAgent, insightsAgent, supportAgent } from "./agents";
import { rateLimiter } from "./rateLimits";

// Create conversational assessment
export const startPricingChat = action({
  args: { 
    organizationId: v.string(),
    assessmentId: v.id("assessments"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // Check rate limit
    await rateLimiter.limit(ctx, "aiPricing", { key: args.organizationId, throws: true });

    // Create thread and start chat
    const { threadId } = await pricingAgent.createThread(ctx, {
        title: `Pricing for Org ${args.organizationId}`,
    });
    
    const result = await pricingAgent.generateText(ctx, { threadId }, {
      prompt: args.message,
    });
    
    return { threadId, message: result.text };
  },
});

export const continuePricingChat = action({
  args: {
    threadId: v.string(),
    userMessage: v.string(),
  },
  handler: async (ctx, { threadId, userMessage }) => {
    // We should ideally check the thread metadata for the orgId to rate limit here too
    // For now skipping to keep it simple
    
    const result = await pricingAgent.generateText(ctx, { threadId }, {
      prompt: userMessage,
    });
    
    return result.text;
  },
});

export const askBusinessQuestion = action({
  args: {
    orgId: v.string(),
    question: v.string(),
    threadId: v.optional(v.string()),
  },
  handler: async (ctx, { orgId, question, threadId }) => {
    if (!threadId) {
      const { threadId: newThreadId } = await insightsAgent.createThread(ctx, {
        title: `Insights for Org ${orgId}`,
      });
      threadId = newThreadId;
    }
    
    const result = await insightsAgent.generateText(ctx, { threadId }, {
      prompt: question,
    });
    
    return { threadId, answer: result.text };
  },
});
