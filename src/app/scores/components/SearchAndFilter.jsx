"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import { Calendar, Search, Settings, Loader2 } from "lucide-react";
import { customSelectStyles } from "@/styles/customeStyles";

// Dynamically import Select to avoid SSR hydration issues
const Select = dynamic(() => import("react-select"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-12 bg-gray-100 rounded-lg animate-pulse"></div>
  ),
});

const SearchAndFilter = ({
  filter,
  setFilter,
  handleSearch,
  isSearching = false,
  type_report_options,
  group_type_options,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFilterChange = (field, value) => {
    setFilter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
          <Settings className="text-primary-600 text-sm" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            فیلترهای گزارش
          </h3>
          <p className="text-sm text-gray-500">
            فیلترهای مورد نظر خود را انتخاب کنید
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
            <Settings size={14} className="text-primary-500" />
            نوع ارسال کننده
          </label>
          <Select
            options={type_report_options}
            isSearchable={true}
            isClearable={true}
            placeholder="انتخاب نوع ارسال کننده..."
            styles={customSelectStyles}
            className="w-full"
            value={type_report_options.find(
              (option) => option.value === filter?.type_report
            )}
            onChange={(selected) => {
              handleFilterChange("type_report", selected?.value);
            }}
            isDisabled={isSearching}
            instanceId="report-type-select"
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
            <Settings size={14} className="text-primary-500" />
            نوع گروه‌بندی
          </label>
          <Select
            options={group_type_options}
            isSearchable={true}
            isClearable={true}
            placeholder="انتخاب نوع گروه‌بندی..."
            styles={customSelectStyles}
            className="w-full"
            value={group_type_options.find(
              (option) => option.value === filter?.group_type
            )}
            onChange={(selected) => {
              handleFilterChange("group_type", selected?.value);
            }}
            isDisabled={isSearching}
            instanceId="group-type-select"
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
            <Calendar size={14} className="text-success-500" />
            تاریخ شروع
          </label>
          <div className="relative">
            <DatePicker
              style={{ direction: "ltr" }}
              placeholder="انتخاب تاریخ شروع..."
              calendar={persian}
              locale={persian_fa}
              containerClassName="w-full"
              inputClass="w-full h-12 pl-8 pr-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all duration-200 bg-neutral-50 focus:bg-white placeholder:text-neutral-400 placeholder:text-right disabled:opacity-50 disabled:cursor-not-allowed"
              value={filter?.start_time}
              onChange={(date) => handleFilterChange("start_time", date)}
              disabled={isSearching}
            />
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none"
              size={16}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
            <Calendar size={14} className="text-error-500" />
            تاریخ پایان
          </label>
          <div className="relative">
            <DatePicker
              style={{ direction: "ltr" }}
              placeholder="انتخاب تاریخ پایان..."
              calendar={persian}
              locale={persian_fa}
              containerClassName="w-full"
              inputClass="w-full h-12 pl-8 pr-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all duration-200 bg-neutral-50 focus:bg-white placeholder:text-neutral-400 placeholder:text-right disabled:opacity-50 disabled:cursor-not-allowed"
              value={filter?.end_time}
              onChange={(date) => handleFilterChange("end_time", date)}
              minDate={filter?.start_time}
              disabled={isSearching}
            />
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none"
              size={16}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          className={`px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium ${
            isSearching
              ? "bg-neutral-400 text-white cursor-not-allowed"
              : "bg-primary-500 text-white hover:bg-primary-600 shadow-lg hover:shadow-xl transform hover:scale-105"
          }`}
          onClick={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              در حال جستجو...
            </>
          ) : (
            <>
              <Search size={18} />
              جستجو و نمایش نمودار
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SearchAndFilter;
