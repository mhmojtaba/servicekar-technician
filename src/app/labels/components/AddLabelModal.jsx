import { useState } from "react";
import { Loader2, Minus, Plus, X } from "lucide-react";
import { toast } from "react-toastify";
import BarcodeInput from "@/components/BarcodeInput";

const AddLabelModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [labels, setLabels] = useState([{ tag: "", note: "" }]);

  const handleAddField = () => {
    setLabels([...labels, { tag: "", note: "" }]);
  };

  const handleRemoveField = (index) => {
    if (index < 1) return;
    setLabels(labels.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const newLabels = [...labels];
    newLabels[index][field] = value;
    setLabels(newLabels);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validLabels = labels.filter((label) => label.tag.trim() !== "");
    if (validLabels.length === 0) {
      toast.error("لطفا حداقل یک برچسب وارد کنید");
      return;
    }
    onSubmit(validLabels);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setLabels([{ tag: "", note: "" }]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-fadeIn"
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <div className="bg-surface rounded-2xl w-full max-w-2xl max-h-[95vh] shadow-2xl border border-neutral-200 overflow-hidden transform transition-all duration-300 flex flex-col">
          <div className="bg-gradient-to-r from-primary-50 via-white to-primary-50 px-4 sm:px-6 py-4 sm:py-5 border-b border-neutral-100 relative flex-shrink-0">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="absolute top-3 sm:top-4 left-3 sm:left-4 p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="بستن"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg sm:text-xl font-semibold text-neutral-800 text-center pr-10">
              افزودن برچسب جدید
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
              <div className="space-y-4 max-h-[65vh]">
                {labels.map((label, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-neutral-200 p-4 hover:border-neutral-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-neutral-700 text-sm sm:text-base">
                        برچسب {index + 1}
                      </h4>
                      {index >= 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveField(index)}
                          className="p-1.5 text-error-500 hover:bg-error-50 rounded-lg transition-colors"
                          title="حذف برچسب"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label
                          className="block text-sm font-medium text-neutral-700 mb-2"
                          htmlFor="tag"
                        >
                          شماره برچسب <span className="text-error-500">*</span>
                        </label>
                        <BarcodeInput
                          id={"tag"}
                          inputValue={label.tag}
                          setInputValue={(e) => handleChange(index, "tag", e)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          توضیحات
                        </label>
                        <textarea
                          value={label.note}
                          onChange={(e) =>
                            handleChange(index, "note", e.target.value)
                          }
                          className="w-full px-4 py-3 text-sm text-neutral-700 bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all duration-200 resize-none"
                          rows="3"
                          placeholder="توضیحات مربوط به برچسب..."
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-shrink-0 p-4 sm:p-6 border-t border-neutral-100 bg-neutral-50/50">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleAddField}
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-50 text-primary-700 rounded-xl border border-primary-200 hover:bg-primary-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm sm:text-base">
                    افزودن برچسب جدید
                  </span>
                </button>

                <div className="flex gap-3 sm:flex-1 sm:justify-end">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none px-6 py-2.5 text-neutral-600 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    انصراف
                  </button>

                  <button
                    type="submit"
                    disabled={
                      isSubmitting || labels.every((label) => !label.tag.trim())
                    }
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 disabled:bg-neutral-300 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm sm:text-base">
                          در حال ثبت...
                        </span>
                      </>
                    ) : (
                      <span className="text-sm sm:text-base">ثبت برچسب‌ها</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddLabelModal;

// @AddLabelModal.jsx cannot read the properties of undefined , reading `getusermedia`

/*
import React, { useState } from 'react';
import { Camera, Barcode } from 'lucide-react';
import BarcodeScanner from '../components/BarcodeScanner';

const Index = () => {
  const [inputValue, setInputValue] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleScan = (scannedValue) => {
    setInputValue(scannedValue);
    console.log('Scanned value:', scannedValue);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const clearInput = () => {
    setInputValue('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto pt-16">
        
        <div className="text-center mb-8">
          <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Barcode size={32} className="text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Barcode Scanner</h1>
          <p className="text-gray-600">Type manually or scan with camera</p>
        </div>

     
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="space-y-4">
           
            <div>
              <label htmlFor="barcode-input" className="block text-sm font-medium text-gray-700 mb-2">
                Barcode Value
              </label>
              <div className="relative">
                <input
                  id="barcode-input"
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Enter barcode or scan with camera"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg"
                />
                {inputValue && (
                  <button
                    onClick={clearInput}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            
            <button
              onClick={() => setIsScannerOpen(true)}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-3 font-medium text-lg shadow-md hover:shadow-lg"
            >
              <Camera size={24} />
              <span>Scan Barcode</span>
            </button>
          </div>
        </div>

        
        {inputValue && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Barcode Value:</p>
                <p className="text-sm text-green-700 font-mono break-all">{inputValue}</p>
              </div>
            </div>
          </div>
        )}

       
        <div className="mt-8 text-center text-sm text-gray-500 space-y-2">
          <p>• Type directly into the input field</p>
          <p>• Or tap the camera button to scan</p>
          <p>• Works on mobile, tablet, and desktop</p>
        </div>
      </div>

      
      <BarcodeScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleScan}
      />
    </div>
  );
};

export default Index;

*/
