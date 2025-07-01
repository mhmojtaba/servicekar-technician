"use client";
import React, { useState } from "react";
import { ScanLine } from "lucide-react";
import dynamic from "next/dynamic";

const BarcodeScanner = dynamic(
  () => import("@/components/requests/BarcodeScanner"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[180px] bg-neutral-100 rounded-xl flex items-center justify-center">
        <div className="animate-pulse text-neutral-500">
          در حال بارگذاری دوربین...
        </div>
      </div>
    ),
  }
);

const BarcodeInput = ({ inputValue, setInputValue, id }) => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleScan = (scannedValue) => {
    const match = scannedValue.match(/id=(\d+)/);

    const finalCode = match ? match[1] : null;
    setInputValue(finalCode);
    setIsScannerOpen(false);
    console.log("Scanned value:", scannedValue);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const clearInput = () => {
    setInputValue("");
  };

  const openScanner = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsScannerOpen(true);
  };

  const closeScanner = () => {
    setIsScannerOpen(false);
  };

  return (
    <div className="">
      <div className="pt-1">
        <div className="space-y-4 w-full">
          <div>
            <div className="relative">
              <input
                id={id}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="کد برچسب"
                className="w-full px-4 py-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg placeholder:text-sm placeholder:text-gray-400"
              />
              {inputValue && (
                <button
                  onClick={clearInput}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              )}
              <button
                onClick={openScanner}
                className="absolute top-1/2 -translate-y-1/2 left-3 text-blue-500 transition-colors flex items-center justify-center font-medium text-lg shadow-md hover:text-blue-600"
                title="اسکن بارکد"
              >
                <ScanLine size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isScannerOpen && (
        <BarcodeScanner
          isOpen={isScannerOpen}
          onClose={closeScanner}
          onScan={handleScan}
        />
      )}
    </div>
  );
};

export default BarcodeInput;
