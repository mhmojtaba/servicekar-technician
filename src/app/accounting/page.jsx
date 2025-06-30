"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import { Calculator } from "lucide-react";

import Search from "./components/Search";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import Pagination from "@/common/Pagination";
import { list_payment_to_technician } from "@/services/accountingService";
import { useAuth } from "@/context/AuthContext";
import AccountingTable from "./components/AccountingTable";
import { accountingThead } from "@/constants/TableHeads";

const page = () => {
  const { token } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const count_per_page = 12;

  const [total_paid, setTotal_paid] = useState(0);
  const [accounting_list, setAccounting_list] = useState([]);
  const [total_count, setTotal_count] = useState(0);

  const totalPages = Math.ceil(total_count / count_per_page);

  const [
    selectedPayment_to_technician_type,
    setSelectedPayment_to_technician_type,
  ] = useState(null);

  const { isPending, mutateAsync: mutateGetPaymentToTechnicianList } =
    useMutation({
      mutationFn: list_payment_to_technician,
    });

  useEffect(() => {
    handleSearch();
  }, []);

  const handleNewSearch = (overrideTypePayment = null) => {
    setCurrentPage(1);
    handleSearch(1, overrideTypePayment);
  };

  const handleSearch = async (page = 1, overrideTypePayment = null) => {
    try {
      const type_payment =
        overrideTypePayment !== null
          ? overrideTypePayment
          : selectedPayment_to_technician_type === null
            ? 0
            : selectedPayment_to_technician_type;
      const data = {
        token,
        page,
        type_payment,
        count_per_page,
      };
      const { data: response } = await mutateGetPaymentToTechnicianList(data);
      if (response.msg === 0) {
        setTotal_paid(response.total_paid);
        setAccounting_list(response.accounting);
        setTotal_count(response.count);
      } else {
        toast.error(response.msg_text);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    handleSearch(page);
  };

  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getTotalAmountColor = (amount) => {
    if (amount > 0) return "from-emerald-50 to-emerald-100 border-emerald-200";
    if (amount < 0) return "from-red-50 to-red-100 border-red-200";
    return "from-gray-50 to-gray-100 border-gray-200";
  };

  const getTotalAmountTextColor = (amount) => {
    if (amount > 0) return "text-emerald-700";
    if (amount < 0) return "text-red-700";
    return "text-gray-700";
  };

  const getTotalAmountIcon = (amount) => {
    if (amount > 0) return <FiTrendingUp className="w-5 h-5" />;
    if (amount < 0) return <FiTrendingDown className="w-5 h-5" />;
    return <Calculator className="w-5 h-5" />;
  };

  const getTotalAmountStatus = (amount) => {
    if (amount > 0) return "بستانکار";
    if (amount < 0) return "بدهکار";
    return "تسویه";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 md:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            گزارشات حسابداری
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
            در این بخش می‌توانید گزارشات حسابداری تکنسین‌ها را مشاهده و مدیریت
            کنید
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
            <Search
              handleSearch={handleNewSearch}
              selectedPayment_to_technician_type={
                selectedPayment_to_technician_type
              }
              setSelectedPayment_to_technician_type={
                setSelectedPayment_to_technician_type
              }
            />
          </div>

          <div className="p-4 sm:p-6">
            {total_paid !== 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`mb-6 p-6 rounded-xl border bg-gradient-to-r ${getTotalAmountColor(total_paid)} shadow-sm`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div
                      className={`p-3 rounded-full bg-white shadow-sm ${getTotalAmountTextColor(total_paid)}`}
                    >
                      {getTotalAmountIcon(total_paid)}
                    </div>
                    <div>
                      <h3
                        className={`text-sm font-medium ${getTotalAmountTextColor(total_paid)} mb-1`}
                      >
                        مجموع حساب تکنسین
                      </h3>
                      <p className="text-xs text-gray-600">
                        خلاصه کل تراکنش‌های انجام شده
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end space-y-2">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span
                        className={`text-2xl sm:text-3xl font-bold ${getTotalAmountTextColor(total_paid)}`}
                        style={{ direction: "ltr" }}
                      >
                        {formatPrice(Math.abs(total_paid))}
                      </span>
                      <span
                        className={`text-sm font-medium ${getTotalAmountTextColor(total_paid)}`}
                      >
                        تومان
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white ${getTotalAmountTextColor(total_paid)} shadow-sm`}
                      >
                        {total_paid > 0 ? (
                          <FiTrendingUp className="w-3 h-3 ml-1" />
                        ) : (
                          <FiTrendingDown className="w-3 h-3 ml-1" />
                        )}
                        {getTotalAmountStatus(total_paid)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/30">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs space-y-1 sm:space-y-0">
                    <span className={getTotalAmountTextColor(total_paid)}>
                      {total_count} تراکنش یافت شد
                    </span>
                    <span
                      className={`${getTotalAmountTextColor(total_paid)} opacity-75`}
                    >
                      به‌روزرسانی: {new Date().toLocaleDateString("fa-IR")}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={isPending ? "loading" : "table"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg border border-gray-200 overflow-hidden"
              >
                {isPending ? (
                  <div className="p-4">
                    <TableSkeleton />
                  </div>
                ) : (
                  <>
                    <AccountingTable
                      title="accounting"
                      thead={accountingThead}
                      tbody={accounting_list}
                    />

                    {totalPages > 1 && (
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default page;
