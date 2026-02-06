"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, X, ScanLine, Keyboard } from "lucide-react";

interface VinScannerProps {
  onScan: (vin: string) => void;
  onClose: () => void;
}

export default function VinScanner({ onScan, onClose }: VinScannerProps) {
  const [isScanning, setIsScanning] = useState(true);
  const [manualVin, setManualVin] = useState("");

  const handleSimulatedScan = () => {
    // Simulate a successful scan after a short delay
    setTimeout(() => {
      onScan("1HGCM82633A004352"); // Mock VIN for a Honda Accord
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      {/* Header */}
      <div className="absolute top-4 right-4 z-10">
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      {isScanning ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-gray-900">
          <div className="relative w-72 h-48 border-2 border-white/50 rounded-lg overflow-hidden mb-8">
             {/* Simulated Camera Feed */}
            <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center text-gray-500">
                <Camera className="w-12 h-12 opacity-50" />
            </div>
            
            {/* Scanning Laser Line */}
            <motion.div
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]"
            />
            
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-400"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-400"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-400"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-400"></div>
          </div>

          <p className="text-white mb-8 text-center px-6">
            Align VIN code within the frame logic
          </p>

          <button
            onClick={handleSimulatedScan}
            className="bg-white text-black px-8 py-3 rounded-full font-bold flex items-center gap-2 active:scale-95 transition-transform"
          >
            <ScanLine className="w-5 h-5" />
            Capture
          </button>
          
          <button 
            onClick={() => setIsScanning(false)}
            className="mt-8 text-white/70 hover:text-white flex items-center gap-2"
          >
            <Keyboard className="w-5 h-5" />
            Enter manually
          </button>
        </div>
      ) : (
        <div className="w-full h-full bg-white p-6 pt-20">
            <h2 className="text-2xl font-bold mb-6">Enter VIN Manually</h2>
            <input 
                type="text" 
                value={manualVin}
                onChange={(e) => setManualVin(e.target.value.toUpperCase())}
                placeholder="17 Character VIN"
                className="w-full text-2xl p-4 border-2 border-gray-300 rounded-lg mb-6 tracking-widest font-mono uppercase focus:border-black outline-none"
                maxLength={17}
            />
             <button
                onClick={() => onScan(manualVin)}
                disabled={manualVin.length < 17}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50"
            >
                Confirm
            </button>
             <button 
                onClick={() => setIsScanning(true)}
                className="w-full mt-4 text-gray-500 py-4"
            >
                Back to Scanner
            </button>
        </div>
      )}
    </div>
  );
}
