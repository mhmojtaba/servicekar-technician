"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Loader2 } from "lucide-react";

import SearchAndAddRequests from "./SearchAndAddRequests";
import { useRequests } from "@/context/RequestsContext";
import RequetsContents from "./RequetsContents";
import Pagination from "@/common/Pagination";
import { useAuth } from "@/context/AuthContext";
import AddRequestModal from "./AddRequestModal";
import RatingModal from "./RatingModal";

export default function RequestsMainPage() {
  const { token } = useAuth();
  const {
    fetchRequests,
    requestsCount,
    technician_report,
    isGettingRequestsMain,
    fetchRequestsMain,
    fetchIncompleteRequests,
  } = useRequests();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchFilters, setSearchFilters] = useState({});
  const perPage = 10;

  const totalPages = Math.ceil(requestsCount / perPage);
  const currentPage = Math.min(totalPages, page);

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const onSearch = (data = {}) => {
    setSearchFilters(data);

    const value = {
      count_per_page: perPage,
      page: 1,
      ...data,
    };

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
    if (token) {
      handlePageChange(1);
      fetchRequestsMain();
      fetchIncompleteRequests();
    }
  }, [token]);

  const openRatingModal = () => {
    setIsRatingModalOpen(true);
  };

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
          className="mb-8 flex flex-col lg:flex-row items-center gap-4 justify-between"
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

          <div className="flex items-center gap-4">
            {isGettingRequestsMain ? (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-4">
                <Loader2 className="w-8 h-8 text-primary-100 animate-spin" />
              </div>
            ) : (
              technician_report.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div
                    className={`p-4 rounded-2xl shadow-lg ${
                      Number(item?.total_paid) >= 0
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                        : "bg-gradient-to-r from-red-500 to-red-600 text-white"
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">مانده حساب</div>
                    <div className="text-lg font-bold">
                      <span
                        className="text-white ml-2"
                        style={{ direction: "ltr" }}
                        dir="ltr"
                      >
                        {Number(item?.total_paid).toLocaleString()}
                      </span>
                      <span className="text-white">تومان</span>
                    </div>
                  </div>

                  <div
                    className="p-4 bg-gradient-to-r cursor-pointer from-blue-500 to-blue-600 rounded-2xl shadow-lg text-white"
                    onClick={openRatingModal}
                  >
                    <div className="text-sm font-medium mb-2">
                      امتیاز میانگین
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-5 h-5 ${
                              star <= Math.round(item?.avg_rating || 0)
                                ? "text-yellow-300 fill-current"
                                : "text-gray-300 fill-current"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-lg font-bold">
                        {item?.avg_rating
                          ? Number(item.avg_rating).toFixed(1)
                          : "0.0"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
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
                <SearchAndAddRequests
                  openAddModal={openAddModal}
                  onSearch={onSearch}
                />
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
          <AddRequestModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
          />
          <RatingModal
            isOpen={isRatingModalOpen}
            onClose={() => setIsRatingModalOpen(false)}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
