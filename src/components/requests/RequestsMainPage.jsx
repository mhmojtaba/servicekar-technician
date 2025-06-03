"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Search, Filter } from "lucide-react";

import SearchAndAddRequests from "./SearchAndAddRequests";
import { useRequests } from "@/context/RequestsContext";
import RequetsContents from "./RequetsContents";
import Pagination from "@/common/Pagination";

export default function RequestsMainPage() {
  const { fetchRequests, requestsCount } = useRequests();

  const [page, setPage] = useState(1);
  const [searchFilters, setSearchFilters] = useState({});
  const perPage = 10;

  const totalPages = Math.ceil(requestsCount / perPage);
  const currentPage = Math.min(totalPages, page);

  const onSearch = (data = {}) => {
    setSearchFilters(data);

    const value = {
      count_per_page: perPage,
      page: 1,
      ...data,
    };

    console.log("Fetching requests with params:", value);

    if (page !== 1) {
      setPage(1);
    }

    fetchRequests(value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);

    const value = {
      count_per_page: perPage,
      page: newPage,
      ...searchFilters,
    };

    fetchRequests(value);
  };

  useEffect(() => {
    console.log("Fetching requests with params:", {});
    handlePageChange(1);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-16 md:mt-0"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-text to-neutral-600 bg-clip-text text-transparent">
                مدیریت درخواست‌ها
              </h1>
              <p className="text-neutral-500 mt-1 text-lg">
                جستجو، فیلتر و مدیریت درخواست‌های{" "}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-surface rounded-2xl shadow-card border border-neutral-200 overflow-hidden"
        >
          <div className="border-b border-neutral-200 bg-gradient-to-r from-neutral-50 to-white">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <SearchAndAddRequests onSearch={onSearch} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <RequetsContents />
              </motion.div>
            </AnimatePresence>

            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
