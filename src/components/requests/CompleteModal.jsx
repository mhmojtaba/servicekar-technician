"use client";
import React from "react";
import { useRequests } from "@/context/RequestsContext";
import { CheckCircle, Loader2, X } from "lucide-react";

const CompleteModal = ({ isOpen, onClose }) => {
  const { selectedRequest, updateRequestStatus, isChangingStatus } =
    useRequests();

  const handleComplete = async () => {
    try {
      const data = {
        order_id: selectedRequest.id,
        status: 9,
      };
      const response = await updateRequestStatus(data);
      if (response?.msg === 0) {
        onClose();
      } else {
        return;
      }
    } catch (error) {
      console.error("Error completing request:", error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-t-2xl p-6 text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">تکمیل درخواست</h2>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-gray-600 text-lg mb-2">
              آیا از تکمیل این درخواست مطمئن هستید؟
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <p className="text-sm text-gray-500 mb-1">شماره درخواست:</p>
              <p className="font-semibold text-gray-800">
                {selectedRequest.requestNumber || selectedRequest.id}
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handleCancel}
              disabled={isChangingStatus}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              انصراف
            </button>
            <button
              onClick={handleComplete}
              disabled={isChangingStatus}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isChangingStatus ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  در حال پردازش...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  تکمیل درخواست
                </>
              )}
            </button>
          </div>
        </div>

        <button
          onClick={handleCancel}
          disabled={isChangingStatus}
          className="absolute top-4 right-4 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CompleteModal;
