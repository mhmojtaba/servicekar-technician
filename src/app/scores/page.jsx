"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { ChartArea, TrendingUp, AlertCircle, Star } from "lucide-react";

import SearchAndFilter from "./components/SearchAndFilter";
import TechnicianChartComponent from "./components/TechnicianChartComponent";

import { useAuth } from "@/context/AuthContext";
import { chart_review_report } from "@/services/requestsServices";

const TechnicianRatings = () => {
  const { token } = useAuth();

  const [filter, setFilter] = useState({
    type_report: null,
    group_type: null,
    start_time: null,
    end_time: null,
  });

  const [chartData, setChartData] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    handleSearch();
  }, []);

  const type_report_options = [
    { value: "user", label: "کاربران" },
    { value: "admin", label: "مدیران" },
    { value: "all", label: "همه" },
  ];

  const group_type_options = [
    { value: "daily", label: "روزانه" },
    { value: "weekly", label: "هفتگی" },
    { value: "monthly", label: "ماهانه" },
    { value: "yearly", label: "سالانه" },
  ];

  const {
    mutateAsync: fetchChartData,
    isPending,
    error,
  } = useMutation({
    mutationFn: chart_review_report,
    onError: (error) => {
      console.error("Chart data fetch error:", error);
      toast.error("خطا در دریافت داده‌های نمودار");
    },
  });

  const handleSearch = useCallback(async () => {
    try {
      setHasSearched(true);

      const requestData = {
        token,
        ...filter,
      };

      const { data: response } = await fetchChartData(requestData);

      if (response?.msg === 0) {
        const newChartData = response?.chart_data || [];

        setChartData(newChartData);
        if (newChartData.length === 0) {
          toast.info("داده‌ای برای نمایش یافت نشد");
        } else {
          toast.success(`تعداد ${newChartData.length} رکورد یافت شد`);
        }
      } else {
        toast.error(response?.msg_text || "خطا در دریافت داده‌ها");
        setChartData([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("خطا در جستجو");
      setChartData([]);
    }
  }, [token, filter, fetchChartData]);

  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
    setHasSearched(false);
  }, []);

  const stats = useMemo(() => {
    if (!chartData.length) return null;

    const totalReviews = chartData.reduce(
      (sum, item) => sum + (Number(item.total_reviews) || 0),
      0
    );
    const totalRating = chartData.reduce(
      (sum, item) =>
        sum + (Number(item.avg_rating) * Number(item.total_reviews) || 0),
      0
    );
    const avgRating = totalReviews > 0 ? totalRating / totalReviews : 0;

    return {
      totalRecords: chartData.length,
      totalReviews,
      avgRating: avgRating.toFixed(1),
    };
  }, [chartData]);

  const EmptyState = useMemo(
    () => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-96 text-gray-500"
      >
        <ChartArea className="w-24 h-24 mb-4 text-gray-300" />
        <h3 className="text-lg font-medium mb-2">داده‌ای یافت نشد</h3>
        <p className="text-sm text-center max-w-md">
          {hasSearched
            ? "برای بازه زمانی انتخابی داده‌ای موجود نیست. لطفاً فیلترهای دیگری را امتحان کنید."
            : "برای مشاهده گزارش امتیازات خود، لطفاً فیلترهای مورد نظر را انتخاب کرده و جستجو کنید."}
        </p>
      </motion.div>
    ),
    [hasSearched]
  );

  const ErrorState = useMemo(
    () => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-96 text-gray-500"
      >
        <AlertCircle className="w-24 h-24 mb-4 text-red-300" />
        <h3 className="text-lg font-medium mb-2 text-red-600">
          خطا در دریافت داده‌ها
        </h3>
        <p className="text-sm text-center max-w-md">
          مشکلی در دریافت داده‌ها رخ داده است. لطفاً دوباره تلاش کنید.
        </p>
      </motion.div>
    ),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-[95%] mx-auto px-0 h-full max-w-[1200px] flex flex-col mt-20 md:mt-0"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="text-primary-600 text-lg" />
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mt-2 mb-4">
              گزارش امتیازات شما
            </h3>
            <p className="text-neutral-600">
              در این بخش می‌توانید امتیازات و نظرات دریافتی خود را مشاهده و
              تحلیل کنید
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-1 w-full flex flex-col bg-white rounded-xl shadow-sm p-6 mb-6"
      >
        <SearchAndFilter
          filter={filter}
          setFilter={handleFilterChange}
          handleSearch={handleSearch}
          isSearching={isPending}
          type_report_options={type_report_options}
          group_type_options={group_type_options}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-lg min-h-[500px] overflow-hidden"
      >
        {error ? (
          ErrorState
        ) : chartData?.length > 0 ? (
          <TechnicianChartComponent
            chartData={chartData}
            selectReportType={filter?.type_report}
            selectGroupType={filter?.group_type}
            isPending={isPending}
            type_report_options={type_report_options}
            group_type_options={group_type_options}
          />
        ) : (
          EmptyState
        )}
      </motion.div>

      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">کل رکوردها</p>
                <p className="text-2xl font-bold">{stats.totalRecords}</p>
              </div>
              <ChartArea className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">کل نظرات</p>
                <p className="text-2xl font-bold">{stats.totalReviews}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">میانگین امتیاز</p>
                <p className="text-2xl font-bold">{stats.avgRating}</p>
              </div>
              <div className="w-8 h-8 text-purple-200 flex items-center justify-center">
                <Star className="w-6 h-6" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TechnicianRatings;
