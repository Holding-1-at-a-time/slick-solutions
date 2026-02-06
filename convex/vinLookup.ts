import { v } from "convex/values";
import { internalAction, internalMutation } from "./_generated/server";
import { internal, components } from "./_generated/api";
import { ActionRetrier } from "@convex-dev/action-retrier";

const retrier = new ActionRetrier(components.actionRetrier);

// Helper to poll for completion
async function waitForRun(ctx: any, runId: string) {
  const pollInterval = 500; // 0.5s
  const maxTime = 10000; // 10s
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxTime) {
    const status = await retrier.status(ctx, runId as any);
    if (status.type === "completed") {
      if (status.result.type === "success") {
        return status.result.returnValue;
      } else if (status.result.type === "failed") {
         throw new Error(status.result.error);
      } else {
         throw new Error("Run canceled");
      }
    }
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }
  throw new Error("Timeout waiting for VIN lookup");
}

export const lookupVIN = internalAction({
  args: { vin: v.string(), assessmentId: v.id("assessments") },
  handler: async (ctx, { vin, assessmentId }) => {
    // 1. Schedule the durable action
    const runId = await retrier.run(
      ctx,
      internal.vin.performLookup,
      { vin },
      {
        initialBackoffMs: 1000,
        maxFailures: 3,
      }
    );
    
    // 2. Poll for the result (since we need to return it to client)
    const vehicleData = await waitForRun(ctx, runId);
    
    // 3. Update assessment (fire and forget mutation)
    await ctx.runMutation(internal.assessments.updateVehicleData, {
      assessmentId,
      vehicleData,
    });
    
    return vehicleData;
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
