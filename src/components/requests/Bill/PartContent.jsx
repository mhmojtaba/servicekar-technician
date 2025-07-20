import React, { useState } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";

const PartContent = ({ partList, selectedParts, onAddPart }) => {
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState({});

  const filteredPartList = partList.filter((part) =>
    part.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleQuantityChange = (partId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [partId]: value,
    }));
  };

  const handleAddPart = (part) => {
    const quantity = quantities[part.id];
    if (!quantity || isNaN(parseFloat(quantity)) || parseFloat(quantity) <= 0) {
      toast.error("لطفا تعداد معتبر وارد کنید");
      return;
    }

    onAddPart(part, parseFloat(quantity));
    setQuantities((prev) => ({
      ...prev,
      [part.id]: "",
    }));
  };

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="p-4 border-b border-neutral-100 flex-shrink-0">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <input
            type="text"
            placeholder="جستجوی قطعات..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 min-h-[30vh] max-h-[30vh]">
        {filteredPartList.length === 0 ? (
          <div className="text-center py-8">
            <div className="p-3 bg-neutral-100 rounded-full w-12 h-12 mx-auto mb-3">
              <ShoppingCart className="w-6 h-6 text-neutral-400 mx-auto" />
            </div>
            <p className="text-neutral-500">هیچ قطعه‌ای یافت نشد</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredPartList.map((part) => (
              <div
                key={part.id}
                className="p-4 rounded-lg border border-neutral-200 hover:border-neutral-300 bg-white transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-neutral-800 truncate">
                      {part.title}
                    </h5>
                    {/* <p className="text-sm text-neutral-600 mt-1">
                      {part.price.toLocaleString()} تومان
                    </p> */}
                  </div>
                  <div className="flex items-center gap-2 mr-4 flex-shrink-0">
                    <label className="text-sm text-neutral-600">تعداد:</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={quantities[part.id] || ""}
                      onChange={(e) =>
                        handleQuantityChange(part.id, e.target.value)
                      }
                      className="w-20 px-2 py-1 border border-neutral-300 rounded text-center text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      style={{ direction: "ltr" }}
                      placeholder="0"
                    />
                    <button
                      onClick={() => handleAddPart(part)}
                      disabled={
                        !quantities[part.id] ||
                        parseFloat(quantities[part.id]) <= 0
                      }
                      className="px-3 py-1 bg-primary-500 text-white rounded text-sm hover:bg-primary-600 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
                    >
                      افزودن
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartContent;
