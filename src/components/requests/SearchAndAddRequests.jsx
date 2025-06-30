"use client";
import React, { useState } from "react";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ChevronDown,
  Filter,
  Plus,
  Search,
  X,
  Calendar,
  User,
  Settings,
} from "lucide-react";

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import { useRequests } from "@/context/RequestsContext";
import { customSelectStyles } from "@/styles/customeStyles";
import {
  convertToEnglishDigits,
  selectOptionsGenerator,
  selectOptionsGeneratorWithName,
} from "@/utils/utils";

const SearchAndAddRequests = ({ openAddModal, onSearch }) => {
  const {
    isUpdating,
    isGettingRequestsMain,
    array_type_payment,
    status_requests,
    service,
  } = useRequests();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState({
    id_service: null,
    start_time: "",
    end_time: "",
    status: -1,
    type_payment: -1,
    search: "",
  });

  const enhancedSelectStyles = {
    ...customSelectStyles,
    control: (provided, state) => ({
      ...provided,
      minHeight: "48px",
      borderRadius: "12px",
      border: `2px solid ${state.isFocused ? "#3D8BFF" : "#E2E8F0"}`,
      backgroundColor: state.isFocused ? "#FFFFFF" : "#F8FAFC",
      boxShadow: state.isFocused ? "0 0 0 4px rgba(61, 139, 255, 0.1)" : "none",
      transition: "all 0.2s ease",
      "&:hover": {
        borderColor: state.isFocused ? "#3D8BFF" : "#CBD5E1",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#94A3B8",
      fontSize: "14px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#1E293B",
    }),
  };

  const serviceOptions = selectOptionsGenerator(service);

  const hasActiveFilters =
    filter.type_payment !== -1 ||
    filter.status !== -1 ||
    filter.search !== "" ||
    filter.id_service ||
    filter.start_time ||
    filter.end_time;

  const handleSearchClick = () => {
    const data = {
      id_service: filter.id_service ? filter.id_service.value : null,
      start_time: filter?.start_time
        ? convertToEnglishDigits(filter?.start_time.format("YYYY-MM-DD"))
        : "",
      end_time: filter?.end_time
        ? convertToEnglishDigits(filter?.end_time.format("YYYY-MM-DD"))
        : "",
      status: filter.status,
      type_payment: filter.type_payment,
      search: filter.search,
    };
    onSearch(data);
  };

  const clearFilters = () => {
    const clearedFilter = {
      id_service: null,
      start_time: "",
      end_time: "",
      status: -1,
      type_payment: -1,
      search: "",
    };
    setFilter(clearedFilter);
    onSearch(clearedFilter);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filter.type_payment !== -1) count++;
    if (filter.status !== -1) count++;
    if (filter.search !== "") count++;
    if (filter.technician) count++;
    if (filter.service) count++;
    if (filter.start_time) count++;
    if (filter.end_time) count++;
    return count;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-surface rounded-2xl shadow-card border border-neutral-200 p-4 sm:p-6 mb-3"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-xl">
            <Search className="text-primary-600" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text">
              جستجو و فیلتر درخواست‌ها
            </h2>
            <p className="text-sm text-neutral-500">
              درخواست‌های خود را جستجو و مدیریت کنید
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="relative group w-full">
          <input
            type="text"
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            placeholder="جستجو در درخواست‌ها..."
            className="w-full h-12 pl-12 pr-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all duration-200 bg-neutral-50 focus:bg-white placeholder:text-neutral-400 text-text"
          />
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors duration-200"
            size={20}
          />
        </div>

        <div className="flex flex-col w-full md:flex-row gap-3 justify-end md:items-center">
          <motion.button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 min-w-[140px] relative ${
              isFilterOpen || hasActiveFilters
                ? "bg-primary-500 text-white shadow-lg"
                : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200"
            }`}
          >
            <Filter size={18} />
            <span>فیلترها</span>
            {getActiveFilterCount() > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
              >
                {getActiveFilterCount()}
              </motion.div>
            )}
            <ChevronDown
              className={`transition-transform duration-200 ${isFilterOpen ? "rotate-180" : ""}`}
              size={16}
            />
          </motion.button>

          <motion.button
            onClick={handleSearchClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isGettingRequestsMain}
            className="flex items-center justify-center gap-2 px-3 py-3 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-hover min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGettingRequestsMain ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Search size={18} />
            )}
            <span>جستجو</span>
          </motion.button>

          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={clearFilters}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 px-3 py-3 bg-error-100 hover:bg-error-200 text-error-700 rounded-xl font-medium transition-all duration-200 border border-error-200 text-xs"
            >
              <X size={16} />
              <span>پاک کردن</span>
            </motion.button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mt-6 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl border border-neutral-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Settings className="text-primary-600" size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-text">
                      فیلترهای پیشرفته
                    </h4>
                    <p className="text-sm text-neutral-500">
                      نتایج را با جزییات بیشتری فیلتر کنید
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
                    <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
                    وضعیت پرداخت
                  </label>
                  <Select
                    options={array_type_payment}
                    isLoading={isGettingRequestsMain}
                    isSearchable={true}
                    isClearable={true}
                    placeholder="انتخاب وضعیت پرداخت..."
                    styles={enhancedSelectStyles}
                    className="w-full"
                    value={
                      array_type_payment?.find(
                        (t) => t.value === filter.type_payment
                      ) || null
                    }
                    onChange={(selected) => {
                      setFilter({
                        ...filter,
                        type_payment: selected?.value ?? -1,
                      });
                    }}
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
                    <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                    وضعیت درخواست
                  </label>
                  <Select
                    options={status_requests}
                    isLoading={isGettingRequestsMain}
                    isSearchable={true}
                    isClearable={true}
                    placeholder="انتخاب وضعیت درخواست..."
                    styles={enhancedSelectStyles}
                    className="w-full"
                    value={
                      status_requests?.find((t) => t.value === filter.status) ||
                      null
                    }
                    onChange={(selected) => {
                      setFilter({
                        ...filter,
                        status: selected?.value ?? -1,
                      });
                    }}
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
                    <Settings size={14} className="text-primary-500" />
                    سرویس
                  </label>
                  <Select
                    options={serviceOptions}
                    isLoading={isGettingRequestsMain}
                    isSearchable={true}
                    isClearable={true}
                    placeholder="انتخاب سرویس..."
                    styles={enhancedSelectStyles}
                    className="w-full"
                    value={filter.id_service}
                    onChange={(selected) => {
                      setFilter({
                        ...filter,
                        id_service: selected,
                      });
                    }}
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
                      placeholder="...انتخاب تاریخ شروع"
                      calendar={persian}
                      locale={persian_fa}
                      containerClassName="w-full"
                      inputClass="w-full h-12 pl-8 pr-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all duration-200 bg-neutral-50 focus:bg-white placeholder:text-neutral-400 placeholder:text-right"
                      value={filter.start_time}
                      onChange={(date) =>
                        setFilter({
                          ...filter,
                          start_time: date,
                        })
                      }
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
                      placeholder="...انتخاب تاریخ پایان"
                      calendar={persian}
                      locale={persian_fa}
                      containerClassName="w-full"
                      inputClass="w-full h-12 pl-8 pr-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all duration-200 bg-neutral-50 focus:bg-white placeholder:text-neutral-400 placeholder:text-right"
                      value={filter.end_time}
                      onChange={(date) =>
                        setFilter({
                          ...filter,
                          end_time: date,
                        })
                      }
                      minDate={filter.start_time}
                    />
                    <Calendar
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none"
                      size={16}
                    />
                  </div>
                </div>
              </div>

              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="pt-6 border-t border-neutral-200"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-semibold text-neutral-600 flex items-center gap-2">
                      <BookOpen size={16} />
                      فیلترهای فعال:
                    </span>

                    {filter.search && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                      >
                        <Search size={12} />
                        جستجو: {filter.search}
                      </motion.span>
                    )}

                    {filter.id_service && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-medium"
                      >
                        <Settings size={12} />
                        سرویس: {filter.id_service.label}
                      </motion.span>
                    )}

                    {filter.type_payment !== -1 && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm font-medium"
                      >
                        وضعیت پرداخت:{" "}
                        {
                          array_type_payment?.find(
                            (t) => t.value === filter.type_payment
                          )?.label
                        }
                      </motion.span>
                    )}

                    {filter.status !== -1 && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-error-100 text-error-700 rounded-full text-sm font-medium"
                      >
                        وضعیت درخواست:{" "}
                        {
                          status_requests?.find(
                            (t) => t.value === filter.status
                          )?.label
                        }
                      </motion.span>
                    )}

                    {filter.start_time && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm font-medium"
                      >
                        <Calendar size={12} />
                        از: {filter.start_time.format("YYYY/MM/DD")}
                      </motion.span>
                    )}

                    {filter.end_time && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm font-medium"
                      >
                        <Calendar size={12} />
                        تا: {filter.end_time.format("YYYY/MM/DD")}
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchAndAddRequests;
