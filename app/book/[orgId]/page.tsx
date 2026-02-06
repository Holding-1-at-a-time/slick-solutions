"use client";

import { use, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import VinScanner from "@/components/assessment/VinScanner";
import StepVehicleInfo from "@/components/assessment/StepVehicleInfo";
import StepCondition from "@/components/assessment/StepCondition";
import StepPricing from "@/components/assessment/StepPricing";

export default function BookingPage({ params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = use(params);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [formData, setFormData] = useState({
    year: "",
    make: "",
    model: "",
    type: "",
    condition: "",
  });

  const totalSteps = 3;

  const updateData = (newData: any) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleVinScan = (vin: string) => {
    // Mock VIN lookup logic
    setIsScannerOpen(false);
    updateData({
      year: "2024",
      make: "Honda",
      model: "Accord",
      type: "Sedan"
    });
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };
  
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-12">
      {/* Scanner Overlay */}
      <AnimatePresence>
        {isScannerOpen && (
          <VinScanner 
            onScan={handleVinScan} 
            onClose={() => setIsScannerOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-40 border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="w-10">
             {currentStep > 1 && (
                <button onClick={prevStep} className="p-2 -ml-2 text-gray-600 hover:text-black">
                    <ChevronLeft className="w-6 h-6" />
                </button>
             )}
          </div>
          <div className="text-sm font-semibold text-gray-500">
             Step {currentStep} of {totalSteps}
          </div>
          <div className="w-10"></div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
            <div 
                className="h-full bg-black transition-all duration-300 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-md mx-auto px-6 pt-24">
        {/* Title Section */}
        <div className="mb-8">
            <h1 className="text-3xl font-extrabold mb-2 tracking-tight">
                {currentStep === 1 && "Vehicle Details"}
                {currentStep === 2 && "Current Condition"}
                {currentStep === 3 && "Your Estimate"}
            </h1>
            <p className="text-gray-500">
                {currentStep === 1 && "Tell us about your vehicle to get started."}
                {currentStep === 2 && "Be honest for the most accurate quote."}
                {currentStep === 3 && "Our AI has analyzed your vehicle."}
            </p>
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
            {currentStep === 1 && (
                <StepVehicleInfo 
                    key="step1" 
                    data={formData} 
                    onUpdate={updateData} 
                    onNext={nextStep}
                    onScanVin={() => setIsScannerOpen(true)}
                />
            )}
            
            {currentStep === 2 && (
                <StepCondition
                    key="step2"
                    data={formData}
                    onUpdate={updateData}
                    onNext={nextStep}
                />
            )}
            
             {currentStep === 3 && (
                <StepPricing
                    key="step3"
                    data={formData}
                />
            )}
        </AnimatePresence>
      </main>
    </div>
  );
}
