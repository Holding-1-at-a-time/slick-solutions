import { v } from "convex/values";
import { internalAction, query } from "./_generated/server";
import Stripe from "@convex-dev/stripe";
import { components } from "./_generated/api";

export const stripeClient = new Stripe(components.stripe, {
  // Stripe automatically handles webhooks, customers, subscriptions
});

// Create subscription for a detailing business
export const createBusinessSubscription = internalAction({
  args: { 
    orgId: v.string(), 
    priceId: v.string() 
  },
  handler: async (ctx, { orgId, priceId }) => {
    // In a real app, you'd get the user ID from auth
    // const userId = await getAuthUserId(ctx);
    // For now we'll assume the orgId context is sufficient or passed in
    
    // Component handles customer creation, subscription, webhooks
    const session = await stripeClient.createCheckoutSession(ctx, {
      priceId,
      mode: "subscription",
      successUrl: `${process.env.SITE_URL}/dashboard?success=true`,
      cancelUrl: `${process.env.SITE_URL}/pricing`,
      metadata: { orgId },
    });
    
    return session.url;
  },
});

// Query subscriptions (auto-synced by component)
export const getOrgSubscription = query({
  args: { orgId: v.string() },
  handler: async (ctx, { orgId }) => {
    return await ctx.runQuery(
      components.stripe.public.getSubscriptionByOrgId,
      { orgId }
    );
  },
});
