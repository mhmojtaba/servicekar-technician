"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRequests } from "@/context/RequestsContext";
import { FaTimes, FaCreditCard, FaCheckCircle } from "react-icons/fa";
import Select from "react-select";
import { customSelectStyles } from "@/styles/customeStyles";

const RequestStatusModal = ({ isOpen, onClose }) => {
  const {
    selectedRequest,
    status_requests_technician,
    isGettingRequestsMain,
    updateRequestStatus,
  } = useRequests();

  const [selectedRequestStatusOption, setSelectedRequestStatusOption] =
    useState(null);
  const [currentRequestStatusOption, setCurrentRequestStatusOption] =
    useState(null);

  useEffect(() => {
    if (selectedRequest && status_requests_technician) {
      const currentRequestStatus = status_requests_technician.find(
        (requestStatus) => requestStatus.value == selectedRequest.status
      );
      setSelectedRequestStatusOption(currentRequestStatus);
      setCurrentRequestStatusOption(currentRequestStatus);
    }
  }, [selectedRequest, status_requests_technician, isOpen]);

  const handleSubmit = async () => {
    if (selectedRequestStatusOption && selectedRequest) {
      const data = {
        order_id: selectedRequest.id,
        status: selectedRequestStatusOption.value,
      };
      await updateRequestStatus(data);
      onClose();
    }
  };

  const handleRequestStatusChange = (selected) => {
    setSelectedRequestStatusOption(selected);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      ``
      <motion.div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-auto relative max-h-[90vh] flex flex-col overflow-hidden border border-neutral-100"
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-8 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <FaCreditCard className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">تغییر وضعیت درخواست</h3>
                <p className="text-blue-100 text-sm">
                  درخواست شماره {selectedRequest?.id}#
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200 group backdrop-blur-sm"
              aria-label="بستن"
            >
              <FaTimes
                size={20}
                className="group-hover:rotate-90 transition-transform duration-300"
              />
            </button>
          </div>
        </div>

        <div className="flex-1 p-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-white" size={16} />
              </div>
              <h4 className="text-lg font-semibold text-gray-800">
                اطلاعات درخواست
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">شماره درخواست:</span>
                <span className="font-semibold text-gray-800 mr-2">
                  {selectedRequest?.id}#
                </span>
              </div>
              <div>
                <span className="text-gray-600">وضعیت فعلی:</span>
                <span className="font-semibold text-gray-800 mr-2">
                  {currentRequestStatusOption?.label}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              <label className="text-lg font-semibold text-gray-800">
                انتخاب وضعیت درخواست جدید
              </label>
            </div>

            <div className="relative">
              <Select
                options={status_requests_technician}
                isLoading={isGettingRequestsMain}
                isSearchable={true}
                isClearable={true}
                placeholder="وضعیت درخواست را انتخاب کنید..."
                styles={{
                  ...customSelectStyles,
                  control: (provided, state) => ({
                    ...customSelectStyles.control(provided, state),
                    minHeight: "56px",
                    fontSize: "16px",
                    border: state.isFocused
                      ? "2px solid #3B82F6"
                      : "2px solid #E5E7EB",
                    boxShadow: state.isFocused
                      ? "0 0 0 4px rgba(59, 130, 246, 0.1)"
                      : "0 1px 3px rgba(0, 0, 0, 0.1)",
                  }),
                }}
                className="w-full"
                value={selectedRequestStatusOption}
                onChange={handleRequestStatusChange}
                isDisabled={isGettingRequestsMain}
              />
              {isGettingRequestsMain && (
                <div className="absolute inset-0 bg-white/50 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {selectedRequestStatusOption && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 text-green-700">
                  <FaCheckCircle size={16} />
                  <span className="font-medium">
                    وضعیت انتخاب شده: {selectedRequestStatusOption.label}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 bg-gray-50/50 p-6">
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-8 py-3 text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl font-medium transition-all duration-200 hover:shadow-md hover:border-gray-300"
            >
              انصراف
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedRequestStatusOption || isGettingRequestsMain}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed disabled:hover:shadow-none transform hover:scale-[1.02] disabled:hover:scale-100"
            >
              {isGettingRequestsMain ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  در حال پردازش...
                </div>
              ) : (
                "ثبت تغییرات"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RequestStatusModal;
