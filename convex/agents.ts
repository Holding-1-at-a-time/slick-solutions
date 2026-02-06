import { Agent, createTool } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";
import { internal } from "./_generated/api";
import { components } from "./_generated/api";
import { z } from "zod";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const pricingAgent = new Agent(components.agent, {
  name: "Pricing Assistant",
  languageModel: openai("gpt-4o-mini"),
  instructions: `You are a helpful auto detailing pricing assistant. 
  Ask clarifying questions about the vehicle condition to provide accurate estimates.`,
  
  tools: {
    calculatePrice: createTool({
      description: "Calculate final price based on vehicle details and condition",
      args: z.object({
        vehicleSize: z.enum(["compact", "sedan", "suv", "truck"]),
        conditionLevel: z.enum(["light", "moderate", "heavy"]),
        services: z.array(z.string()),
        businessId: z.string(),
      }),
      handler: async (ctx, args) => {
        // Stub calculation
        return "Estimated price: $150.00";
      },
    }),
    
    bookAppointment: createTool({
      description: "Book an appointment once customer agrees to pricing",
      args: z.object({
        assessmentId: z.string(),
        preferredDate: z.string(),
        preferredTime: z.string(),
      }),
      handler: async (ctx, args) => {
        // Stub booking
        return "Appointment booked! You'll receive a confirmation email.";
      },
    }),
  },
});

export const supportAgent = new Agent(components.agent, {
  name: "Support Agent",
  languageModel: openai("gpt-4o-mini"),
  instructions: `You are a customer support agent. Help customers with booking and service questions.`,
  tools: {
    lookupCustomer: createTool({
      description: "Look up customer by phone or email",
      args: z.object({
        phone: z.string().optional(),
        email: z.string().optional(),
      }),
      handler: async (ctx, args) => {
        return JSON.stringify({ found: true, totalAssessments: 1 });
      },
    }),
    createTicket: createTool({
      description: "Create a support ticket",
      args: z.object({
        issue: z.string(),
        priority: z.enum(["low", "medium", "high"]),
      }),
      handler: async (ctx, args) => {
        return "Ticket created #12345.";
      },
    }),
  },
});

export const insightsAgent = new Agent(components.agent, {
  name: "Insights Agent",
  languageModel: openai("gpt-4o-mini"),
  instructions: `You are a business analytics assistant. Provide insights on revenue and trends.`,
  tools: {
    getRevenueData: createTool({
      description: "Get revenue data",
      args: z.object({ orgId: z.string() }),
      handler: async (ctx, args) => {
        return JSON.stringify({ total: 5000, trend: "up" });
      },
    }),
  },
});
