"use client";

import { motion } from "framer-motion";
import { Sparkles, Gauge, AlertTriangle } from "lucide-react";

interface StepConditionProps {
    data: any;
    onUpdate: (data: any) => void;
    onNext: () => void;
}

const conditions = [
    {
        id: "light",
        label: "Light",
        description: "Regular maintenance, minor dust/dirt.",
        icon: Sparkles,
        color: "text-green-500",
        bg: "bg-green-50",
        border: "border-green-200"
    },
    {
        id: "moderate",
        label: "Moderate",
        description: "Visible dirt, some stains, pet hair.",
        icon: Gauge,
        color: "text-yellow-500",
        bg: "bg-yellow-50",
        border: "border-yellow-200"
    },
    {
        id: "heavy",
        label: "Heavy",
        description: "Deep stains, mud, heavy pet hair, odors.",
        icon: AlertTriangle,
        color: "text-red-500",
        bg: "bg-red-50",
        border: "border-red-200"
    }
];

export default function StepCondition({ data, onUpdate, onNext }: StepConditionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="space-y-4">
                {conditions.map((level) => {
                    const Icon = level.icon;
                    const isSelected = data.condition === level.id;
                    
                    return (
                        <button
                            key={level.id}
                            onClick={() => onUpdate({ ...data, condition: level.id })}
                            className={`w-full p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden ${
                                isSelected 
                                    ? "border-black bg-gray-50" 
                                    : "border-gray-100 hover:border-gray-200"
                            }`}
                        >
                            <div className="flex items-start gap-4 z-10 relative">
                                <div className={`p-3 rounded-full ${level.bg} ${level.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">{level.label}</h3>
                                    <p className="text-gray-500 text-sm">{level.description}</p>
                                </div>
                                {isSelected && (
                                    <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center">
                                        ✓
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            <button
                onClick={onNext}
                disabled={!data.condition}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 shadow-lg shadow-black/10"
            >
                Calculate Price
            </button>
        </motion.div>
    );
}
