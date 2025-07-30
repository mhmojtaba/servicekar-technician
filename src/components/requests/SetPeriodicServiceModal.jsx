import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import {
  FaTimes,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { toast } from "react-toastify";

import { preventArrowKeyChange } from "@/utils/utils";
import { useAuth } from "@/context/AuthContext";
import { useRequests } from "@/context/RequestsContext";
import { setPeriodicService } from "@/services/requestsServices";

const SetPeriodicServiceModal = ({ isOpen, onClose }) => {
  const { token } = useAuth();
  const { selectedRequest, setSelectedRequest } = useRequests();

  const [servicePeriodMonths, setServicePeriodMonths] = useState("");
  const [servicePeriodMonthsError, setServicePeriodMonthsError] = useState("");

  const { isPending, mutateAsync: mutateSetPeriodicService } = useMutation({
    mutationFn: setPeriodicService,
  });

  console.log(selectedRequest);

  useEffect(() => {
    if (isOpen) {
      setServicePeriodMonths(selectedRequest?.operation_type === 1 ? 24 : 12);
      setServicePeriodMonthsError("");
    }
  }, [isOpen]);

  const validateInput = (value) => {
    if (!value || String(value).trim() === "") {
      return "لطفاً مدت زمان سرویس دوره ای را وارد کنید";
    }

    return "";
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setServicePeriodMonths(value);
    setServicePeriodMonthsError("");
  };

  const handleSubmit = async () => {
    const validationError = validateInput(servicePeriodMonths);
    if (validationError) {
      setServicePeriodMonthsError(validationError);
      return;
    }

    try {
      const data = {
        token: token,
        order_id: selectedRequest.id,
        service_period_months: parseInt(servicePeriodMonths),
      };
      const { data: response } = await mutateSetPeriodicService(data);
      if (response.msg === 0) {
        toast.success(response.msg_text);
        setSelectedRequest(null);
        setServicePeriodMonths("");
        setServicePeriodMonthsError("");
        handleClose();
      } else {
        toast.error(response.msg_text);
      }
    } catch (error) {
      console.error("Error setting periodic service:", error);
      toast.error("خطا در تنظیم سرویس دوره ای");
    }
  };

  const handleClose = () => {
    setSelectedRequest(null);
    setServicePeriodMonths("");
    setServicePeriodMonthsError("");
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto relative overflow-hidden border border-gray-100"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FaCalendarAlt className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">تنظیم سرویس دوره‌ای</h3>
                  <p className="text-blue-100 text-sm">
                    درخواست #{selectedRequest?.id}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                aria-label="بستن"
              >
                <FaTimes size={18} />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <FaCheckCircle className="text-green-500 text-sm" />
                <h4 className="text-sm font-semibold text-gray-700">
                  اطلاعات درخواست
                </h4>
              </div>
              <div className="text-sm text-gray-600">
                <span>شماره درخواست: </span>
                <span className="font-semibold text-gray-800">
                  #{selectedRequest?.id}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  مدت زمان سرویس دوره‌ای (ماه)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 no-spinner ${
                      servicePeriodMonthsError
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="مثال: 6"
                    value={servicePeriodMonths}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      preventArrowKeyChange(e);
                      if (e.key === "Enter") {
                        handleSubmit();
                      }
                    }}
                    min="1"
                  />
                  {servicePeriodMonthsError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-6 left-0 flex items-center gap-1 text-red-500 text-xs"
                    >
                      <FaExclamationTriangle size={12} />
                      <span>{servicePeriodMonthsError}</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 p-6">
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200"
              >
                انصراف
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending || !servicePeriodMonths}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>در حال پردازش...</span>
                  </div>
                ) : (
                  "ثبت سرویس دوره‌ای"
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SetPeriodicServiceModal;
