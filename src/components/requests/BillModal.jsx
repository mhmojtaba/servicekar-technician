"use client";
import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRequests } from "@/context/RequestsContext";
import { X, ShoppingCart, Wrench, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import {
  getParts,
  getTasks,
  register_invoice,
} from "@/services/requestsServices";
import { useAuth } from "@/context/AuthContext";
import TaskContent from "./Bill/TaskContent";
import PartContent from "./Bill/PartContent";
import CompletedInvoiceView from "./Bill/CompletedInvoiceView";

const BillModal = ({ isOpen, onClose }) => {
  const { token } = useAuth();
  const { selectedRequest } = useRequests();
  const [currentTab, setCurrentTab] = useState("task");

  const [taskList, setTaskList] = useState([]);
  const [partList, setPartList] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectedParts, setSelectedParts] = useState([]);
  const [isInvoiceCompleted, setIsInvoiceCompleted] = useState(false);
  const [completedInvoiceData, setCompletedInvoiceData] = useState(null);

  const { isPending: isGettingTasks, mutateAsync: mutateGetTasks } =
    useMutation({
      mutationFn: getTasks,
    });

  const { isPending: isGettingParts, mutateAsync: mutateGetParts } =
    useMutation({
      mutationFn: getParts,
    });

  const { isPending: isRegisteringBill, mutateAsync: mutateRegisterBill } =
    useMutation({
      mutationFn: register_invoice,
    });

  const isLoading = isGettingTasks || isGettingParts;

  const fetchTaskAndPartList = useCallback(async () => {
    if (!selectedRequest?.id_service || !token) return;

    try {
      const [tasksResponse, partsResponse] = await Promise.all([
        mutateGetTasks({
          token: token,
          id_service: selectedRequest.id_service,
        }),
        mutateGetParts({
          token: token,
          id_service: selectedRequest.id_service,
        }),
      ]);

      if (tasksResponse.data.msg === 0) {
        setTaskList(tasksResponse.data.value || []);
      } else {
        toast.error(tasksResponse.data.msg_text || "خطا در دریافت خدمات");
        setTaskList([]);
      }

      if (partsResponse.data.msg === 0) {
        setPartList(partsResponse.data.value || []);
      } else {
        toast.error(partsResponse.data.msg_text || "خطا در دریافت قطعات");
        setPartList([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("خطا در دریافت اطلاعات");
      setTaskList([]);
      setPartList([]);
    }
  }, [selectedRequest, token, mutateGetTasks, mutateGetParts]);

  const checkInvoiceStatus = useCallback(async () => {
    if (!selectedRequest) return;

    // First fetch task and part lists
    await fetchTaskAndPartList();

    // Check if invoice is already completed
    let parsedTasks = [];
    let parsedParts = [];

    try {
      // Parse tasks
      if (selectedRequest.tasks && selectedRequest.tasks !== "") {
        parsedTasks =
          typeof selectedRequest.tasks === "string"
            ? JSON.parse(selectedRequest.tasks)
            : selectedRequest.tasks;
      }

      // Parse parts
      if (selectedRequest.parts && selectedRequest.parts !== "") {
        parsedParts =
          typeof selectedRequest.parts === "string"
            ? JSON.parse(selectedRequest.parts)
            : selectedRequest.parts;
      }

      if (parsedTasks.length > 0 || parsedParts.length > 0) {
        setIsInvoiceCompleted(true);
        setCompletedInvoiceData({
          tasks: parsedTasks,
          parts: parsedParts,
          customerName:
            selectedRequest.first_name + " " + selectedRequest.last_name ||
            "نامشخص",
          customerPhone: selectedRequest.mobile,
          customerSignature: selectedRequest.signature_img,
          deviceCount: selectedRequest.device_count || 1,
          totalPrice: selectedRequest.total_price.toLocaleString(),
          date: new Date(selectedRequest.date * 1000).toLocaleDateString(
            "fa-IR"
          ),
        });
      } else {
        setIsInvoiceCompleted(false);
      }
    } catch (error) {
      console.error("Error parsing invoice data:", error);
      setIsInvoiceCompleted(false);
    }
  }, [selectedRequest, fetchTaskAndPartList]);

  useEffect(() => {
    if (isOpen && selectedRequest) {
      checkInvoiceStatus();
    }
  }, [isOpen, selectedRequest, checkInvoiceStatus]);

  const handleAddTask = (task, quantity) => {
    if (!task || !quantity || quantity <= 0) {
      toast.error("لطفا خدمت و تعداد معتبر انتخاب کنید");
      return;
    }

    const existingIndex = selectedTasks.findIndex(
      (item) => item.id === task.id
    );
    if (existingIndex >= 0) {
      const updatedTasks = [...selectedTasks];
      updatedTasks[existingIndex].quantity = parseFloat(quantity);
      setSelectedTasks(updatedTasks);
      toast.success("تعداد خدمت بروزرسانی شد");
    } else {
      setSelectedTasks((prev) => [
        ...prev,
        { ...task, quantity: parseFloat(quantity) },
      ]);
      toast.success("خدمت افزوده شد");
    }
  };

  const handleAddPart = (part, quantity) => {
    if (!part || !quantity || quantity <= 0) {
      toast.error("لطفا قطعه و تعداد معتبر انتخاب کنید");
      return;
    }

    const existingIndex = selectedParts.findIndex(
      (item) => item.id === part.id
    );
    if (existingIndex >= 0) {
      const updatedParts = [...selectedParts];
      updatedParts[existingIndex].quantity = parseFloat(quantity);
      setSelectedParts(updatedParts);
      toast.success("تعداد قطعه بروزرسانی شد");
    } else {
      setSelectedParts((prev) => [
        ...prev,
        { ...part, quantity: parseFloat(quantity) },
      ]);
      toast.success("قطعه افزوده شد");
    }
  };

  const handleRemoveTask = (taskId) => {
    setSelectedTasks((prev) => prev.filter((task) => task.id !== taskId));
    toast.success("خدمت حذف شد");
  };

  const handleRemovePart = (partId) => {
    setSelectedParts((prev) => prev.filter((part) => part.id !== partId));
    toast.success("قطعه حذف شد");
  };

  const calculateTotal = () => {
    const tasksTotal = selectedTasks.reduce(
      (sum, task) => sum + task.price * task.quantity,
      0
    );
    const partsTotal = selectedParts.reduce(
      (sum, part) => sum + part.price * part.quantity,
      0
    );
    return tasksTotal + partsTotal;
  };

  const handleSubmitBill = async () => {
    if (selectedTasks.length === 0 && selectedParts.length === 0) {
      toast.error("لطفا حداقل یک خدمت یا قطعه انتخاب کنید");
      return;
    }

    try {
      const billData = {
        token: token,
        order_id: selectedRequest.id,
        parts: selectedParts.map((part) => ({
          id: part.id,
          quantity: part.quantity,
        })),
        tasks: selectedTasks.map((task) => ({
          id: task.id,
          quantity: task.quantity,
        })),
      };
      console.log("billData", billData);
      const { data: response } = await mutateRegisterBill(billData);
      console.log("response", response);
      if (response.msg === 0) {
        toast.success(response.msg_text);
        handleClose();
      } else {
        toast.error(response.msg_text);
      }
    } catch (error) {
      console.error("Error submitting bill:", error);
      toast.error("خطا در ثبت فاکتور");
    }
  };

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
                <p className="text-sm text-neutral-600 mt-1">
                  درخواست شماره {selectedRequest.id}
                </p>
              )}
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

        <div className="flex-1 overflow-hidden min-h-0">
          {isInvoiceCompleted ? (
            <CompletedInvoiceView
              data={completedInvoiceData}
              taskList={taskList}
              partList={partList}
              isLoading={isLoading}
            />
          ) : (
            <>
              {(selectedTasks.length > 0 || selectedParts.length > 0) && (
                <div className="px-4 sm:px-6 py-3 bg-primary-50 border-b border-primary-100 flex-shrink-0">
                  <div className="flex flex-wrap items-center gap-4 text-sm mb-3">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-primary-600" />
                      <span className="text-primary-800">
                        خدمات: {selectedTasks.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-primary-600" />
                      <span className="text-primary-800">
                        قطعات: {selectedParts.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mr-auto">
                      <span className="text-primary-800 font-medium">
                        مجموع: {calculateTotal().toLocaleString()} تومان
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-24 overflow-y-auto">
                    {selectedTasks.map((task) => (
                      <div
                        key={`task-${task.id}`}
                        className="flex items-center justify-between p-2 bg-white rounded-lg text-xs"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <Wrench className="w-3 h-3 text-primary-600 flex-shrink-0" />
                            <span className="font-medium text-neutral-800 truncate">
                              {task.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-neutral-600">
                              تعداد: {task.quantity}
                            </span>{" "}
                            <span className="text-neutral-600">
                              &times; {task.price.toLocaleString()} تومان
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveTask(task.id)}
                          className="p-1 text-error-500 hover:bg-error-100 rounded transition-colors flex-shrink-0"
                          title="حذف"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {selectedParts.map((part) => (
                      <div
                        key={`part-${part.id}`}
                        className="flex items-center justify-between p-2 bg-white rounded-lg text-xs"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <ShoppingCart className="w-3 h-3 text-primary-600 flex-shrink-0" />
                            <span className="font-medium text-neutral-800 truncate">
                              {part.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-neutral-600">
                              تعداد: {part.quantity}
                            </span>{" "}
                            <span className="text-neutral-600">
                              &times; {part.price.toLocaleString()} تومان
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemovePart(part.id)}
                          className="p-1 text-error-500 hover:bg-error-100 rounded transition-colors flex-shrink-0"
                          title="حذف"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="px-4 sm:px-6 py-3 border-b border-neutral-100 flex-shrink-0">
                <div className="flex rounded-lg border border-neutral-200 overflow-hidden">
                  <button
                    className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                      currentTab === "task"
                        ? "bg-primary-500 text-white"
                        : "bg-white text-neutral-600 hover:bg-neutral-50"
                    }`}
                    onClick={() => setCurrentTab("task")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Wrench className="w-4 h-4" />
                      خدمات
                    </div>
                  </button>
                  <button
                    className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                      currentTab === "part"
                        ? "bg-primary-500 text-white"
                        : "bg-white text-neutral-600 hover:bg-neutral-50"
                    }`}
                    onClick={() => setCurrentTab("part")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      قطعات
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden min-h-0">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-primary-500 mx-auto mb-3" />
                      <p className="text-sm text-neutral-600">
                        در حال بارگذاری...
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {currentTab === "task" ? (
                      <TaskContent
                        taskList={taskList}
                        selectedTasks={selectedTasks}
                        onAddTask={handleAddTask}
                      />
                    ) : (
                      <PartContent
                        partList={partList}
                        selectedParts={selectedParts}
                        onAddPart={handleAddPart}
                      />
                    )}
                  </>
                )}
              </div>

              <div className="px-4 sm:px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex-shrink-0">
                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 text-neutral-600 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={handleSubmitBill}
                    disabled={
                      (selectedTasks.length === 0 &&
                        selectedParts.length === 0) ||
                      isRegisteringBill
                    }
                    className={`px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors ${
                      isRegisteringBill &&
                      "opacity-50 animate-pulse cursor-not-allowed"
                    }`}
                  >
                    {isRegisteringBill ? (
                      <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                    ) : (
                      "ثبت فاکتور"
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BillModal;
