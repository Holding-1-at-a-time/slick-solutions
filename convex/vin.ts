import { v } from "convex/values";
import { internalAction } from "./_generated/server";

export const performLookup = internalAction({
  args: { vin: v.string() },
  handler: async (ctx, { vin }) => {
     // Mock external VIN API call
    // In real app: const res = await fetch(`https://vpic.nhtsa.dot.gov/api/...`);
    
    // Mock return
    return {
        make: "Toyota",
        model: "Camry",
        year: 2020,
        vin
    };
  }
});
