"use client";

import { motion } from "framer-motion";
import { Car, Truck, LucideIcon } from "lucide-react";

interface StepVehicleInfoProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onScanVin: () => void;
}

export default function StepVehicleInfo({ data, onUpdate, onNext, onScanVin }: StepVehicleInfoProps) {
  const isFormValid = data.year && data.make && data.model && data.type;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
        <div>
          <p className="text-sm text-blue-800 font-medium">Have your VIN?</p>
          <p className="text-xs text-blue-600">Auto-fill vehicle details</p>
        </div>
        <button
          onClick={onScanVin}
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
        >
          Scan VIN
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input
            type="number"
            value={data.year || ""}
            onChange={(e) => onUpdate({ ...data, year: e.target.value })}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
            placeholder="e.g. 2024"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
          <input
            type="text"
            value={data.make || ""}
            onChange={(e) => onUpdate({ ...data, make: e.target.value })}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
            placeholder="e.g. Honda"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
          <input
            type="text"
            value={data.model || ""}
            onChange={(e) => onUpdate({ ...data, model: e.target.value })}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
            placeholder="e.g. Accord"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Vehicle Type</label>
        <div className="grid grid-cols-2 gap-3">
          {["Sedan", "SUV", "Truck", "Van"].map((type) => (
            <button
              key={type}
              onClick={() => onUpdate({ ...data, type })}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                data.type === type
                  ? "border-black bg-black text-white"
                  : "border-gray-100 bg-white hover:border-gray-200 text-gray-600"
              }`}
            >
              <Car className="w-6 h-6" /> {/* Placeholder icon logic could be better */}
              <span className="font-medium">{type}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!isFormValid}
        className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 shadow-lg shadow-black/10 mt-8"
      >
        Next Step
      </button>
    </motion.div>
  );
}
