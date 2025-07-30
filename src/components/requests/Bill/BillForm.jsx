import React, { useCallback, useEffect, useState } from "react";
import { Loader2, ShoppingCart, Wrench, X } from "lucide-react";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

import { useRequests } from "@/context/RequestsContext";
import { useAuth } from "@/context/AuthContext";

import TaskContent from "./TaskContent";
import PartContent from "./PartContent";
import {
  getParts,
  getTasks,
  register_invoice,
} from "@/services/requestsServices";

const BillForm = ({
  currentTab,
  setCurrentTab,
  selectedTasks,
  selectedParts,
  handleClose,
  setSelectedTasks,
  setSelectedParts,
  invoiceItems,
}) => {
  const { token } = useAuth();
  const { selectedRequest, technician_travel_cost } = useRequests();

  const [taskList, setTaskList] = useState([]);
  const [partList, setPartList] = useState([]);
  const [hasTechnicianTravelCost, setHasTechnicianTravelCost] = useState(1);

  const technicianTravelCost = {
    id: 10001,
    title: "ایاب و ذهاب",
    price: technician_travel_cost,
    quantity: 1,
    travel_cost: 1,
  };

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

  const isLoading = isGettingTasks || isGettingParts;

  useEffect(() => {
    fetchTaskAndPartList();
  }, []);

  useEffect(() => {
    if (invoiceItems && invoiceItems.length > 0) {
      const tasks = invoiceItems
        .filter((item) => item.type === "task")
        .filter((item) => item.id_item !== 0)
        .map((item) => ({
          id: item.id_item,
          title: item.title,
          quantity: item.quantity,
          price: item.unit_price,
        }));

      const parts = invoiceItems
        .filter((item) => item.type === "part")
        .map((item) => ({
          id: item.id_item,
          title: item.title,
          quantity: item.quantity,
          price: item.unit_price,
        }));

      const hasTravelCostItem = invoiceItems.some(
        (item) => item.type === "task" && item.id_item === 0
      );

      setSelectedTasks(tasks);
      setSelectedParts(parts);
      setHasTechnicianTravelCost(hasTravelCostItem ? 1 : 0);
    } else {
      setSelectedTasks([]);
      setSelectedParts([]);
      setHasTechnicianTravelCost(1);
    }
  }, [invoiceItems, setSelectedTasks, setSelectedParts]);

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

  const handleSubmitBill = async () => {
    if (
      selectedTasks.length === 0 &&
      selectedParts.length === 0 &&
      hasTechnicianTravelCost === 0
    ) {
      toast.error("لطفا حداقل یک خدمت یا قطعه انتخاب کنید");
      return;
    }

    try {
      const billData = {
        token: token,
        order_id: selectedRequest.id,
        has_technician_travel_cost: hasTechnicianTravelCost,
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
      if (response.msg === 0) {
        toast.success(response.msg_text);
      } else {
        toast.error(response.msg_text);
      }
    } catch (error) {
      console.error("Error submitting bill:", error);
      toast.error("خطا در ثبت فاکتور");
    }
  };

  return (
    <div className="flex-1 overflow-hidden min-h-0">
      <>
        {(selectedTasks.length > 0 ||
          selectedParts.length > 0 ||
          hasTechnicianTravelCost === 1) && (
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
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 max-h-24 overflow-y-auto">
              {hasTechnicianTravelCost === 1 ? (
                <div
                  key={`task-${technicianTravelCost.id}`}
                  className="flex items-center justify-between p-2 bg-white rounded-lg text-xs"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <Wrench className="w-3 h-3 text-primary-600 flex-shrink-0" />
                      <span className="font-medium text-neutral-800 truncate">
                        {technicianTravelCost?.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-neutral-600">
                        هزینه: {technicianTravelCost?.price?.toLocaleString()}
                        تومان
                      </span>{" "}
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-neutral-600">
                        تعداد: {technicianTravelCost?.quantity}
                      </span>{" "}
                    </div>
                  </div>
                </div>
              ) : null}

              {selectedTasks.map((task) => (
                <div
                  key={`task-${task.id}`}
                  className="flex items-center justify-between p-2 bg-white rounded-lg text-xs w-full"
                >
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-1">
                      <Wrench className="w-3 h-3 text-primary-600 flex-shrink-0" />
                      <span className="font-medium text-neutral-800">
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-neutral-600">
                        تعداد: {task.quantity}
                      </span>{" "}
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
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="travel-cost"
                  checked={hasTechnicianTravelCost === 1}
                  onChange={(e) =>
                    setHasTechnicianTravelCost(e.target.checked ? 1 : 0)
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label
                  htmlFor="travel-cost"
                  className="mr-3 text-sm font-medium text-blue-800 cursor-pointer"
                >
                  هزینه ایاب وذهاب
                </label>
              </div>
            </div>

            <div className="flex rounded-lg border border-neutral-200 overflow-hidden flex-1 sm:max-w-md">
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
        </div>

        <div className="flex-1 overflow-hidden min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary-500 mx-auto mb-3" />
                <p className="text-sm text-neutral-600">در حال بارگذاری...</p>
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
                  selectedParts.length === 0 &&
                  hasTechnicianTravelCost === 0) ||
                isRegisteringBill
              }
              className={`px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors ${
                isRegisteringBill &&
                "opacity-50 animate-pulse cursor-not-allowed"
              }`}
            >
              {isRegisteringBill ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              ) : invoiceItems && invoiceItems.length > 0 ? (
                "بروزرسانی فاکتور"
              ) : (
                "ثبت فاکتور"
              )}
            </button>
          </div>
        </div>
      </>
    </div>
  );
};

export default BillForm;
