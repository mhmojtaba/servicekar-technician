import React, { useState } from "react";
import { Barcode, ScanLine } from "lucide-react";
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

const BracodeInput = ({ inputValue, setInputValue, id }) => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleScan = (scannedValue) => {
    setInputValue(scannedValue);
    console.log("Scanned value:", scannedValue);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const clearInput = () => {
    setInputValue("");
  };

  console.log(inputValue);

  return (
    <div className="">
      <div className=" pt-1">
        {/* <div className="text-center mb-8">
          <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Barcode size={32} className="text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">اسکن بارکد</h1>
          <p className="text-gray-600">بارکد را وارد کنید یا اسکن کنید</p>
        </div> */}

        <div className="space-y-4 w-full">
          <div>
            {/* <label
                htmlFor="barcode-input"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                مقدار بارکد
              </label> */}
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
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsScannerOpen(true);
                }}
                className=" absolute top-1/2 -translate-y-1/2 left-3 text-blue-500 transition-colors flex items-center justify-center space-x-3 font-medium text-lg shadow-md hover:text-blue-600"
              >
                <ScanLine size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* {inputValue && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-green-800">
                  مقدار بارکد:
                </p>
                <p className="text-sm text-green-700 font-mono break-all">
                  {inputValue}
                </p>
              </div>
            </div>
          </div>
        )} */}

        {/* <div className="mt-8 text-center text-sm text-gray-500 space-y-2">
          <p>• بارکد را درون فیلد وارد کنید</p>
          <p>• یا بر روی دکمه اسکن کلیک کنید</p>
          <p>• بر روی موبایل، تبلت و دسکتاپ کار میکند</p>
        </div> */}
      </div>

      <BarcodeScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleScan}
      />
    </div>
  );
};

export default BracodeInput;
