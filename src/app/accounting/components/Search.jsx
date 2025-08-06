import React from "react";
import Select from "react-select";
import { FiSearch, FiCreditCard, FiFilter } from "react-icons/fi";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import { useRequests } from "@/context/RequestsContext";
import { Calendar } from "lucide-react";

const Search = ({
  handleSearch,
  selectedPayment_to_technician_type,
  setSelectedPayment_to_technician_type,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  const { payment_to_technician_type, isGettingRequestsMain } = useRequests();

  const handleClearFilter = () => {
    setSelectedPayment_to_technician_type(null);
    handleSearch(0);
  };

  // const customSelectStyles = {
  //   control: (provided, state) => ({
  //     ...provided,
  //     minHeight: "52px",
  //     borderColor: state.isFocused ? "#6366F1" : "#E5E7EB",
  //     borderWidth: "2px",
  //     borderRadius: "12px",
  //     backgroundColor: state.isFocused ? "#FAFBFF" : "#FFFFFF",
  //     boxShadow: state.isFocused
  //       ? "0 0 0 4px rgba(99, 102, 241, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)"
  //       : "0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  //     transition: "all 0.2s ease-in-out",
  //     "&:hover": {
  //       borderColor: state.isFocused ? "#6366F1" : "#9CA3AF",
  //       boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  //     },
  //   }),
  //   placeholder: (provided) => ({
  //     ...provided,
  //     color: "#9CA3AF",
  //     fontSize: "15px",
  //     fontWeight: "400",
  //   }),
  //   option: (provided, state) => ({
  //     ...provided,
  //     backgroundColor: state.isSelected
  //       ? "#6366F1"
  //       : state.isFocused
  //         ? "#F0F9FF"
  //         : "white",
  //     color: state.isSelected ? "white" : "#1F2937",
  //     fontSize: "15px",
  //     fontWeight: "500",
  //     padding: "12px 16px",
  //     borderRadius: state.isFocused && !state.isSelected ? "8px" : "0px",
  //     margin: state.isFocused && !state.isSelected ? "2px 4px" : "0px",
  //     transition: "all 0.15s ease-in-out",
  //     "&:hover": {
  //       backgroundColor: state.isSelected ? "#6366F1" : "#F0F9FF",
  //       transform: state.isSelected ? "none" : "translateX(2px)",
  //     },
  //   }),
  //   singleValue: (provided) => ({
  //     ...provided,
  //     color: "#1F2937",
  //     fontSize: "15px",
  //     fontWeight: "500",
  //   }),
  //   menu: (provided) => ({
  //     ...provided,
  //     borderRadius: "12px",
  //     boxShadow:
  //       "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  //     border: "1px solid #E5E7EB",
  //     overflow: "hidden",
  //   }),
  //   menuList: (provided) => ({
  //     ...provided,
  //     padding: "8px",
  //   }),
  // };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <FiFilter className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">فیلتر و جستجو</h2>
            <p className="text-sm text-gray-500 mt-1">
              نتایج را بر اساس نوع پرداخت فیلتر کنید
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="relative">
          <div className="relative group">
            {/* <label className="flex items-center text-base font-semibold text-gray-800 mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg ml-3">
                <FiCreditCard className="text-indigo-600" size={18} />
              </div>
              نوع پرداخت
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full mr-2 font-normal">
                اختیاری
              </span>
            </label>
             <Select
              instanceId="payment-type-select"
              isLoading={isGettingRequestsMain}
              options={payment_to_technician_type}
              value={
                payment_to_technician_type?.find(
                  (option) =>
                    option.value === selectedPayment_to_technician_type
                ) || null
              }
              onChange={(selectedOption) =>
                setSelectedPayment_to_technician_type(
                  selectedOption?.value || null
                )
              }
              isSearchable
              placeholder="انتخاب نوع پرداخت از لیست..."
              noOptionsMessage={() => "نوع پرداختی یافت نشد"}
              loadingMessage={() => "در حال بارگذاری..."}
              styles={customSelectStyles}
              className="react-select-container"
              classNamePrefix="react-select"
              isClearable
            /> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar className="w-4 h-4 text-primary-600" />
                  تاریخ شروع
                </label>
                <DatePicker
                  style={{
                    direction: "ltr",
                  }}
                  calendar={persian}
                  locale={persian_fa}
                  placeholder="انتخاب تاریخ شروع"
                  value={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                  }}
                  inputClass={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 placeholder:text-right ${"border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 hover:bg-white"}`}
                  containerStyle={{ width: "100%" }}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar className="w-4 h-4 text-primary-600" />
                  تاریخ پایان
                </label>
                <DatePicker
                  style={{
                    direction: "ltr",
                  }}
                  calendar={persian}
                  locale={persian_fa}
                  placeholder="انتخاب تاریخ پایان"
                  value={endDate}
                  onChange={(date) => {
                    setEndDate(date);
                  }}
                  minDate={startDate}
                  inputClass={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 placeholder:text-right ${"border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 hover:bg-white"}`}
                  containerStyle={{ width: "100%" }}
                />
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl -z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
          <button
            onClick={() => handleSearch(selectedPayment_to_technician_type)}
            disabled={
              !selectedPayment_to_technician_type || isGettingRequestsMain
            }
            className={`
              group relative inline-flex justify-center items-center px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300 transform w-full sm:w-auto sm:min-w-[200px]
              ${
                !selectedPayment_to_technician_type || isGettingRequestsMain
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-sm"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              }
            `}
          >
            {!(
              !selectedPayment_to_technician_type || isGettingRequestsMain
            ) && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}

            <div className="flex items-center space-x-3 space-x-reverse relative z-10">
              <FiSearch
                className={`${isGettingRequestsMain ? "animate-pulse" : "group-hover:scale-110"} transition-transform duration-200`}
                size={20}
              />
              <span>
                {isGettingRequestsMain ? "در حال بارگذاری..." : "جستجو و فیلتر"}
              </span>
            </div>
          </button>

          {selectedPayment_to_technician_type && (
            <button
              onClick={handleClearFilter}
              className="inline-flex justify-center items-center px-6 py-4 border-2 border-gray-200 rounded-xl text-base font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 w-full sm:w-auto"
            >
              پاک کردن فیلتر
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
