import { defineApp } from "convex/server";
// @ts-expect-error - Stripe config resolution issue
import stripe from "@convex-dev/stripe/convex.config";
import rateLimiter from "@convex-dev/rate-limiter/convex.config";
import actionRetrier from "@convex-dev/action-retrier/convex.config";
import resend from "@convex-dev/resend/convex.config";
import crons from "@convex-dev/crons/convex.config";
import agent from "@convex-dev/agent/convex.config";

const app = defineApp();

app.use(stripe);
app.use(rateLimiter);
app.use(actionRetrier);
app.use(resend);
app.use(crons);
app.use(agent);

export default app;
