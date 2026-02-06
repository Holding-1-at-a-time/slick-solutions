"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Calendar } from "lucide-react";
// In a real app, this would use the Convex mutation to call the AI agent
// import { useAction } from "convex/react";
// import { api } from "@/convex/_generated/api";

interface StepPricingProps {
  data: any;
}

export default function StepPricing({ data }: StepPricingProps) {
    const [status, setStatus] = useState<"analyzing" | "complete">("analyzing");
    const [price, setPrice] = useState<string | null>(null);

    useEffect(() => {
        // Simulate AI processing time
        const timer = setTimeout(() => {
            // Mock pricing logic based on inputs
            let basePrice = 120;
            if (data.type === "SUV") basePrice += 30;
            if (data.type === "Truck") basePrice += 50;
            if (data.condition === "moderate") basePrice += 40;
            if (data.condition === "heavy") basePrice += 100;
            
            setPrice(`$${basePrice}`);
            setStatus("complete");
        }, 3000);

        return () => clearTimeout(timer);
    }, [data]);

    if (status === "analyzing") {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="relative w-32 h-32 mb-8">
                     <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute inset-0 border-4 border-blue-100 border-t-blue-600 rounded-full"
                    />
                    <div className="absolute inset-4 bg-blue-50 rounded-full flex items-center justify-center animate-pulse">
                         <span className="text-2xl">🤖</span>
                    </div>
                </div>
                <h3 className="text-xl font-bold mb-2">AI Agent is thinking...</h3>
                <p className="text-gray-500 max-w-[250px]">
                    Analyzing your {data.year} {data.make} {data.model} and market rates for {data.condition} condition.
                </p>
                
                {/* Steps simulating thought process */}
                <div className="mt-8 space-y-2 text-sm text-gray-400">
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                        className="flex items-center gap-2"
                    >
                        <Check className="w-4 h-4 text-green-500" /> Checking vehicle size database
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                         className="flex items-center gap-2"
                    >
                        <Check className="w-4 h-4 text-green-500" /> Estimating labor hours
                    </motion.div>
                     <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
                         className="flex items-center gap-2"
                    >
                        <Check className="w-4 h-4 text-green-500" /> Applying local demand factor
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
        >
            <div className="bg-gradient-to-br from-gray-900 to-black text-white p-8 rounded-2xl shadow-xl mb-8">
                <p className="text-gray-400 text-sm uppercase tracking-wide font-semibold mb-2">Estimated Price</p>
                <div className="text-5xl font-bold mb-1">{price}</div>
                <p className="text-xs text-gray-500">Includes all taxes & fees</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 text-left">
                <h4 className="font-bold text-green-900 mb-1">Excellent Condition!</h4>
                <p className="text-green-800 text-sm">
                    Based on your "Light" condition report, we applied a 10% discount to standard rates.
                </p>
            </div>

            <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5" />
                Book Appointment
            </button>
             <button className="w-full mt-4 text-gray-500 py-2 text-sm">
                Save Quote for Later
            </button>
        </motion.div>
    );
}
