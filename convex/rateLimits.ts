import { RateLimiter, MINUTE, HOUR, DAY } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  // Prevent assessment spam (per QR code/business)
  assessmentCreation: { 
    kind: "token bucket", 
    rate: 50, 
    period: HOUR, 
    capacity: 10 
  },
  
  // Control AI pricing calls (expensive!)
  aiPricing: { 
    kind: "token bucket", 
    rate: 100, 
    period: HOUR,
    shards: 2  // Better concurrency
  },
  
  // Prevent VIN lookup abuse
  vinLookup: { 
    kind: "fixed window", 
    rate: 30, 
    period: MINUTE 
  },
  
  // Free trial signups (global limit)
  freeTrialSignup: { 
    kind: "fixed window", 
    rate: 100, 
    period: DAY 
  },
});
