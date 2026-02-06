import { Crons } from "@convex-dev/crons";
import { internalMutation } from "./_generated/server";
import { components, internal } from "./_generated/api";

const crons = new Crons(components.crons);

// Register crons at app initialization
export const initializeCrons = internalMutation({
  handler: async (ctx) => {
    // Send weekly digest to businesses every Monday at 8 AM
    if (!(await crons.get(ctx, { name: "weekly-digest" }))) {
      await crons.register(
        ctx,
        { kind: "cron", cronspec: "0 8 * * 1" },
        internal.notifications.sendDailyDigest, // Reusing daily digest action for demo
        { businessOrgId: "demo-org-id" }, // In real app, this would likely iterate all orgs
        "weekly-digest"
      );
    }
    
    // Check for abandoned assessments every hour
    if (!(await crons.get(ctx, { name: "abandoned-check" }))) {
      await crons.register(
        ctx,
        { kind: "interval", ms: 3600000 }, // 1 hour
        internal.scheduledTasks.checkAbandoned,
        {},
        "abandoned-check"
      );
    }
    
    // Archive old assessments monthly
    // if (!(await crons.get(ctx, { name: "monthly-archive" }))) {
    //   await crons.register(
    //     ctx,
    //     { kind: "cron", cronspec: "0 0 1 * *" },
    //     internal.maintenance.archiveOldData,
    //     {},
    //     "monthly-archive"
    //   );
    // }
  },
});

// Check for assessments abandoned mid-flow
export const checkAbandoned = internalMutation({
  handler: async (ctx) => {
    const oneHourAgo = Date.now() - 3600000;
    
    // In a real app we would query:
    // const abandoned = await ctx.db.query("assessments").filter(...).collect();
    
    // Stub implementation
    console.log("Checking for abandoned assessments older than", new Date(oneHourAgo).toISOString());
    
    // Logic to email users would go here
  },
});
