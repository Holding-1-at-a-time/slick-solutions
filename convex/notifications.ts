import { v } from "convex/values";
import { internalAction, internalMutation } from "./_generated/server";
import { Resend } from "@convex-dev/resend";
import { components, internal } from "./_generated/api";

export const resend = new Resend(components.resend, {
  // Test mode during development if configured
  // testMode: process.env.CONVEX_CLOUD_URL?.includes("dev"),
});

// Send assessment completion email
export const sendAssessmentCompletedEmail = internalMutation({
  args: {
    assessmentId: v.id("assessments"),
    businessEmail: v.string(),
    clientEmail: v.string(),
    estimateAmount: v.number(),
  },
  handler: async (ctx, args) => {
    // Email to business owner
    await resend.sendEmail(ctx, {
      from: "Slick Solutions <notifications@slicksolutions.com>",
      to: args.businessEmail,
      subject: "New Assessment Completed",
      html: `
        <h2>New Customer Assessment</h2>
        <p>A customer has completed a self-assessment.</p>
        <p><strong>Estimate:</strong> $${args.estimateAmount}</p>
        <a href="${process.env.SITE_URL}/assessments/${args.assessmentId}">
          View Details
        </a>
      `,
    });
    
    // Email to client
    await resend.sendEmail(ctx, {
      from: "Slick Solutions <notifications@slicksolutions.com>",
      to: args.clientEmail,
      subject: "Your Detailing Estimate is Ready",
      html: `
        <h2>Thanks for using our service!</h2>
        <p>Your estimated cost: $${args.estimateAmount}</p>
        <p>We'll be in touch soon to schedule your appointment.</p>
      `,
    });
  },
});

// Batch emails for daily digest
export const sendDailyDigest = internalAction({
  args: { businessOrgId: v.string() },
  handler: async (ctx, { businessOrgId }) => {
    // In a real app, you would query for the day's assessments here
    // const assessments = await ctx.runQuery(internal.assessments.getDailyAssessments, { ... });
    const assessments = [{ id: "mock-id", total: 150 }]; // Mock data
    
    if (assessments.length === 0) return;
    
    // Mock getting business owner email
    // const business = await ctx.runQuery(internal.organizations.get, { orgId: businessOrgId });
    const businessOwnerEmail = "owner@example.com"; 

    await resend.sendEmail(ctx, {
      from: "Slick Solutions <digest@slicksolutions.com>",
      to: businessOwnerEmail,
      subject: `Daily Digest: ${assessments.length} New Assessments`,
      html: `<h1>Daily Digest</h1><p>You had ${assessments.length} assessments today.</p>`,
    });
  },
});
