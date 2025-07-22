"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRequests } from "@/context/RequestsContext";
import { X } from "lucide-react";

import CompletedInvoiceView from "./Bill/CompletedInvoiceView";
import BillForm from "./Bill/BillForm";

const BillModal = ({ isOpen, onClose }) => {
  const {
    selectedRequest,
    isGettingInvoiceData,
    invoiceData,
    invoiceItems,
    fetchInvoiceData,
  } = useRequests();

  const [currentTab, setCurrentTab] = useState("task");

  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectedParts, setSelectedParts] = useState([]);
  const [isInvoiceCompleted, setIsInvoiceCompleted] = useState(false);
  const [completedInvoiceData, setCompletedInvoiceData] = useState(null);
  const [isPreviewInvoice, setIsPreviewInvoice] = useState(false);

  useEffect(() => {
    fetchInvoiceData(selectedRequest.id);
  }, [selectedRequest.id]);

  const handleClose = () => {
    setSelectedTasks([]);
    setSelectedParts([]);
    setCurrentTab("task");
    setIsInvoiceCompleted(false);
    setCompletedInvoiceData(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-surface rounded-2xl w-full max-w-5xl max-h-[95vh] shadow-2xl border border-neutral-200 overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-primary-50 via-white to-primary-50 px-4 sm:px-6 py-4 sm:py-5 border-b border-neutral-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-neutral-800">
                {isInvoiceCompleted ? "فاکتور نهایی" : "فاکتور سفارش"}
              </h3>
              {selectedRequest && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                  <p className="text-sm text-neutral-600">
                    درخواست شماره {selectedRequest.id}
                  </p>
                  {!isInvoiceCompleted &&
                    (selectedTasks.length > 0 || selectedParts.length > 0) && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        قابل ویرایش
                      </span>
                    )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-2">
              <div>
                <button
                  onClick={() => setIsPreviewInvoice(!isPreviewInvoice)}
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                >
                  {isPreviewInvoice ? "ویرایش فاکتور" : "پیش نمایش فاکتور"}
                </button>
              </div>

              <button
                onClick={handleClose}
                className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                title="بستن"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {!isPreviewInvoice ? (
          <BillForm
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            selectedTasks={selectedTasks}
            selectedParts={selectedParts}
            handleClose={handleClose}
            setSelectedTasks={setSelectedTasks}
            setSelectedParts={setSelectedParts}
            invoiceItems={invoiceItems}
          />
        ) : (
          <CompletedInvoiceView
            invoiceData={invoiceData}
            invoiceItems={invoiceItems}
            isGettingInvoiceData={isGettingInvoiceData}
            handleClose={handleClose}
          />
        )}
      </div>
    </motion.div>
  );
};

export default BillModal;
