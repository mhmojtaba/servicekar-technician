"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { notFound, useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Plus, Loader2, Tag, RefreshCw, ArrowLeft } from "lucide-react";

import { useRequests } from "@/context/RequestsContext";
import { useMutation } from "@tanstack/react-query";
import {
  cancel_device_tag,
  getDeviceTags,
  register_device_tags,
} from "@/services/requestsServices";
import { useAuth } from "@/context/AuthContext";
import LabelCard from "./components/LabelCard";
import AddLabelModal from "./components/AddLabelModal";

function LabelsContent() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("request_id");
  const router = useRouter();

  const { token } = useAuth();
  const { selectedRequest, setSelectedRequest, mainRequests, fetchRequests } =
    useRequests();
  const [labelList, setLabelList] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRequestFound, setIsRequestFound] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const { isPending: isGettingDeviceTags, mutateAsync: mutateGetDeviceTags } =
    useMutation({
      mutationFn: getDeviceTags,
    });

  const { isPending: isAddingDeviceTag, mutateAsync: mutateAddDeviceTag } =
    useMutation({
      mutationFn: register_device_tags,
    });

  const { isPending: isDeletingDeviceTag, mutateAsync: mutateDeleteDeviceTag } =
    useMutation({
      mutationFn: cancel_device_tag,
    });

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    const numericRequestId = parseInt(requestId, 10);

    if (mainRequests && mainRequests.length > 0) {
      const request = mainRequests.find(
        (request) => request.id === numericRequestId
      );

      if (request) {
        setSelectedRequest(request);
        setIsRequestFound(true);
        setIsInitialized(true);
      } else {
        console.error("درخواستی یافت نشد");
        return notFound();
      }
    } else if (!isInitialized) {
      const timeout = setTimeout(() => {
        if (!isRequestFound) {
          return notFound();
        }
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [requestId, mainRequests, isInitialized, isRequestFound]);

  useEffect(() => {
    if (isRequestFound && selectedRequest) {
      fetchLabelList();
    }
  }, [isRequestFound, selectedRequest]);

  const fetchLabelList = useCallback(async () => {
    if (!requestId || !token) return;

    try {
      const { data } = await mutateGetDeviceTags({
        token: token,
        order_id: requestId,
      });

      if (data.msg === 0) {
        setLabelList(data.devices || []);
      } else {
        toast.error(data.msg_text || "خطا در دریافت لیست برچسب‌ها");
        setLabelList([]);
      }
    } catch (error) {
      console.error("Error fetching labels:", error);
      toast.error("خطا در دریافت لیست برچسب‌ها");
      setLabelList([]);
    }
  }, [requestId, token, mutateGetDeviceTags]);

  const handleAddLabels = async (labels) => {
    if (!selectedRequest) return;

    try {
      const { data } = await mutateAddDeviceTag({
        token: token,
        order_id: selectedRequest.id,
        device_tags: labels,
      });

      if (data.msg === 0) {
        toast.success(data.msg_text || "برچسب‌ها با موفقیت ثبت شدند");
        setIsAddModalOpen(false);
        await fetchLabelList();
      } else {
        toast.error(data.msg_text || "خطا در ثبت برچسب‌ها");
      }
    } catch (error) {
      console.error("Error adding labels:", error);
      toast.error("خطا در ثبت برچسب‌ها");
    }
  };

  const handleDeleteLabel = async (labelId) => {
    if (!selectedRequest) return;

    try {
      const { data } = await mutateDeleteDeviceTag({
        token: token,
        order_id: selectedRequest.id,
        device_tag: labelId,
      });

      if (data.msg === 0) {
        toast.success(data.msg_text || "برچسب با موفقیت حذف شد");
        await fetchLabelList();
      } else {
        toast.error(data.msg_text || "خطا در حذف برچسب");
      }
    } catch (error) {
      console.error("Error deleting label:", error);
      toast.error("خطا در حذف برچسب");
    }
  };

  const handleBackToRequests = () => {
    router.push("/");
  };

  if (!isInitialized || !isRequestFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-neutral-600">در حال بارگذاری اطلاعات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 mt-16 md:mt-0">
        <div className="bg-surface rounded-xl sm:rounded-2xl shadow-card border border-neutral-200 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-50 via-white to-primary-50 px-4 sm:px-6 py-4 sm:py-5 border-b border-neutral-100">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center gap-3 w-full">
                <div className="">
                  <h1 className="text-lg sm:text-xl font-semibold text-neutral-800">
                    مدیریت برچسب‌ها
                  </h1>
                  {selectedRequest && (
                    <p className="text-sm text-neutral-600 mt-1">
                      درخواست شماره {selectedRequest.id}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBackToRequests}
                    className="flex items-center gap-2 px-3 py-2 text-neutral-600 hover:text-neutral-800 hover:bg-white rounded-lg transition-all duration-200 border border-transparent hover:border-neutral-200"
                    title="بازگشت به درخواست‌ها"
                  >
                    <span className="text-sm">بازگشت</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={fetchLabelList}
                  disabled={isGettingDeviceTags}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-neutral-600 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="بروزرسانی"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isGettingDeviceTags ? "animate-spin" : ""}`}
                  />
                  <span className="hidden sm:inline text-sm">بروزرسانی</span>
                </button>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm sm:text-base">ثبت برچسب</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {isGettingDeviceTags ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary-500 mx-auto mb-3" />
                  <p className="text-sm text-neutral-600">
                    در حال بارگذاری برچسب‌ها...
                  </p>
                </div>
              </div>
            ) : labelList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 bg-neutral-100 rounded-full mb-4">
                  <Tag className="w-8 h-8 text-neutral-400" />
                </div>
                <h4 className="text-lg font-medium text-neutral-700 mb-2">
                  برچسبی یافت نشد
                </h4>
                <p className="text-neutral-500 max-w-md mb-6">
                  هنوز برچسبی برای این درخواست ثبت نشده است. برای شروع، روی دکمه
                  "ثبت برچسب" کلیک کنید.
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  ثبت اولین برچسب
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-medium text-primary-800">
                      تعداد برچسب‌ها: {labelList.length}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {labelList.map((label) => (
                    <LabelCard
                      key={label.code}
                      label={label}
                      onDelete={handleDeleteLabel}
                      isDeleting={isDeletingDeviceTag}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <AddLabelModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddLabels}
        isSubmitting={isAddingDeviceTag}
      />
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-4" />
        <p className="text-neutral-600">در حال بارگذاری صفحه...</p>
      </div>
    </div>
  );
}

export default function LabelsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LabelsContent />
    </Suspense>
  );
}
