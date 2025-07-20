"use client";
import { useState } from "react";
import Image from "next/image";

import { toast } from "react-toastify";

import {
  User,
  Phone,
  Calendar,
  Settings,
  MapPin,
  CreditCard,
  Tag,
  FileText,
  RefreshCw,
  Link,
  CheckCircle,
  ZoomIn,
  ImagePlus,
  Plus,
  Minus,
} from "lucide-react";

import { useRequests } from "@/context/RequestsContext";
import NavigationModal from "./navigationButton";
import ImagePreview from "./ImagePreview";
import { useAuth } from "@/context/AuthContext";

export default function RequestCard({
  request,
  index,
  onConfirm,
  onEditAddress,
  onChangePaymentStatus,
  onLabel,
  onBill,
  onComplete,
  onChangeRequestStatus,
  onSetPeriodicService,
  // onAddImage,
  isExpanded,
  onToggleExpand,
}) {
  const { token } = useAuth();
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  const {
    status_requests,
    array_type_payment,
    service,
    isResendingCode,
    mutateResendCode,
    url,
  } = useRequests();

  const selectedStatus = status_requests.find((s) => s.value == request.status);
  const selectedPaymentStatus = array_type_payment.find(
    (s) => s.value == request.type_payment
  );
  const selectedService = service.find((t) => t.id == request.id_service);

  const getStatusColor = (status) => {
    switch (status) {
      case 8:
        return "bg-success-100 text-success-700 border-success-200";
      case 2:
        return "bg-error-100 text-error-700 border-error-200";
      default:
        return "bg-accent-100 text-accent-700 border-accent-200";
    }
  };

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 1:
        return "bg-success-100 text-success-700 border-success-200";
      case 0:
        return "bg-error-100 text-error-700 border-error-200";
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };

  const handleEditAddress = () => onEditAddress(request);
  const handleChangePaymentStatus = () => onChangePaymentStatus(request);
  const handleLabel = () => onLabel(request);
  const handleBill = () => onBill(request);
  const handleChangeRequestStatus = () => onChangeRequestStatus(request);
  const handleSetPeriodicService = () => onSetPeriodicService(request);
  // const handleAddImage = () => onAddImage(request);
  const handleConfirm = () => onConfirm(request);
  const handleComplete = () => onComplete(request);
  const handleResendCode = async () => {
    try {
      const data = {
        token: token,
        order_id: request.id,
      };

      const { data: res } = await mutateResendCode(data);
      if (res.msg === 0) {
        toast.success(res.msg_text);
      } else {
        toast.error(res.msg_text);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePaymentLink = async () => {
    try {
      const paymentUrl = url + request.id;

      if (typeof window !== "undefined" && navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(paymentUrl);
        toast.success("لینک پرداخت با موفقیت کپی شد");
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = paymentUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (successful) {
          toast.success("لینک پرداخت با موفقیت کپی شد");
        } else {
          toast.error("خطا در کپی کردن لینک پرداخت");
        }
      }
    } catch (error) {
      console.error("خطا در کپی کردن لینک پرداخت:", error);
    }
  };

  const completedRequest = request.status == 8 || request.status == 9;
  const canceledRequest = request.status == 2;

  return (
    <div
      className="bg-surface rounded-xl mb-4 border border-neutral-200 shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div
        className="bg-gradient-to-r from-primary-50 via-white to-primary-50 px-6 py-4 border-b border-neutral-100 cursor-pointer"
        onClick={onToggleExpand}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-text">درخواست #{request.id}</h3>
              <p className="text-sm text-neutral-500">
                {new Date(request.date * 1000).toLocaleDateString("fa-IR")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1 rounded-full border text-[10px] sm:text-sm font-medium ${getStatusColor(request.status)}`}
            >
              {selectedStatus?.label}
            </div>
            <span
              className="p-2 bg-white hover:bg-neutral-50 rounded-lg border border-neutral-200 transition-all duration-200 hover:shadow-sm group"
              aria-label={isExpanded ? "بستن جزئیات" : "نمایش جزئیات"}
            >
              {isExpanded ? (
                <Minus className="w-4 h-4 text-neutral-600 group-hover:text-neutral-800 transition-colors duration-200" />
              ) : (
                <Plus className="w-4 h-4 text-neutral-600 group-hover:text-neutral-800 transition-colors duration-200" />
              )}
            </span>
          </div>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 flex-1">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-2.5 bg-secondary-100 rounded-lg">
                  <User className="w-4 h-4 text-secondary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                    نام کاربر
                  </p>
                  <p className="font-medium text-text truncate">
                    {request.first_name} {request.last_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-2.5 bg-accent-100 rounded-lg">
                  <Phone className="w-4 h-4 text-accent-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                    شماره تماس
                  </p>
                  <p className="font-medium text-text truncate">
                    {request.mobile}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-2.5 bg-success-100 rounded-lg">
                  <Settings className="w-4 h-4 text-success-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                    سرویس
                  </p>
                  <p className="font-medium text-text truncate">
                    {selectedService?.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-2.5 bg-primary-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                    تعداد دستگاه
                  </p>
                  <p className="font-medium text-text">
                    {request.device_count}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-2.5 bg-error-100 rounded-lg">
                  <CreditCard className="w-4 h-4 text-error-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                    وضعیت پرداخت
                  </p>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full border text-xs font-medium ${getPaymentStatusColor(request.type_payment)}`}
                  >
                    {selectedPaymentStatus?.label}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-2.5 bg-neutral-100 rounded-lg">
                  <MapPin className="w-4 h-4 text-neutral-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                    آدرس
                  </p>
                  <p
                    className="font-medium text-text text-sm truncate"
                    title={request.address}
                  >
                    {request.address}
                  </p>
                </div>
              </div>
            </div>
            {request.img ? (
              <div className="bg-white rounded-xl border border-neutral-200 p-3 shadow-sm hover:shadow-md transition-shadow duration-200">
                <p className="text-xs text-neutral-500 uppercase tracking-wide mb-2">
                  عکس
                </p>
                <div
                  className="relative cursor-pointer group"
                  onClick={() => setIsImagePreviewOpen(true)}
                >
                  <Image
                    src={request.img}
                    alt="عکس"
                    width={100}
                    height={100}
                    className="rounded-lg object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors duration-200 flex items-center justify-center">
                    <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="pt-6 border-t border-neutral-100">
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-neutral-600 mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                عملیات اصلی
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <button
                  onClick={handleEditAddress}
                  className={`flex items-center justify-center gap-2 h-12 px-4 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-xl border border-primary-200 transition-all duration-200 text-sm font-medium hover:shadow-sm ${
                    completedRequest || canceledRequest
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={completedRequest || canceledRequest}
                >
                  <MapPin className="w-4 h-4" />
                  ویرایش آدرس
                </button>

                <button
                  onClick={handleChangePaymentStatus}
                  className={`flex items-center justify-center gap-2 h-12 px-4 bg-accent-50 hover:bg-accent-100 text-accent-700 rounded-xl border border-accent-200 transition-all duration-200 text-sm font-medium hover:shadow-sm ${
                    completedRequest || canceledRequest
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={completedRequest || canceledRequest}
                >
                  <CreditCard className="w-4 h-4" />
                  تغییر پرداخت
                </button>

                <button
                  onClick={handleChangeRequestStatus}
                  className={`flex items-center justify-center gap-2 h-12 px-4 bg-secondary-50 hover:bg-secondary-100 text-secondary-700 rounded-xl border border-secondary-200 transition-all duration-200 text-sm font-medium hover:shadow-sm ${
                    completedRequest || canceledRequest
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={completedRequest || canceledRequest}
                >
                  <CreditCard className="w-4 h-4" />
                  تغییر وضعیت
                </button>

                <button
                  onClick={handleSetPeriodicService}
                  className={`flex items-center justify-center gap-2 h-12 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200 transition-all duration-200 text-sm font-medium hover:shadow-sm ${
                    completedRequest || canceledRequest
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={completedRequest || canceledRequest}
                >
                  <CreditCard className="w-4 h-4" />
                  تنظیم سرویس دوره ای
                </button>

                <div className="h-12">
                  <NavigationModal
                    lat={request.latitude}
                    lng={request.longitude}
                    disabled={completedRequest || canceledRequest}
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-neutral-600 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                مدیریت سند و پرداخت
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  onClick={handleLabel}
                  className={`flex items-center justify-center gap-2 h-12 px-4 bg-secondary-50 hover:bg-secondary-100 text-secondary-700 rounded-xl border border-secondary-200 transition-all duration-200 text-sm font-medium hover:shadow-sm ${
                    completedRequest || canceledRequest
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={completedRequest || canceledRequest}
                >
                  <Tag className="w-4 h-4" />
                  برچسب
                </button>

                <button
                  onClick={handleBill}
                  className={`flex items-center justify-center gap-2 h-12 px-4 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 rounded-xl border border-neutral-200 transition-all duration-200 text-sm font-medium hover:shadow-sm `}
                >
                  <FileText className="w-4 h-4" />
                  فاکتور
                </button>

                {/* <button
                  onClick={handleAddImage}
                  className={`flex items-center justify-center gap-2 h-12 px-4 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 rounded-xl border border-neutral-200 transition-all duration-200 text-sm font-medium hover:shadow-sm `}
                >
                  <ImagePlus className="w-4 h-4" />
                  اضافه کردن عکس
                </button> */}

                <button
                  onClick={
                    completedRequest || canceledRequest
                      ? null
                      : handleResendCode
                  }
                  className={`flex items-center justify-center gap-2 h-12 px-4 bg-error-50 hover:bg-error-100 text-error-700 rounded-xl border border-error-200 transition-all duration-200 text-sm font-medium hover:shadow-sm ${
                    isResendingCode || completedRequest || canceledRequest
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={isResendingCode}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isResendingCode ? "animate-spin" : ""}`}
                  />
                  {isResendingCode ? (
                    <span>در حال ارسال...</span>
                  ) : (
                    <span>ارسال مجدد کد</span>
                  )}
                </button>

                <button
                  onClick={handlePaymentLink}
                  className={`flex items-center justify-center gap-2 h-12 px-4 bg-success-50 hover:bg-success-100 text-success-700 rounded-xl border border-success-200 transition-all duration-200 text-sm font-medium hover:shadow-sm ${
                    completedRequest || canceledRequest
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={completedRequest || canceledRequest}
                >
                  <Link className="w-4 h-4" />
                  لینک پرداخت
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-neutral-600 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                تایید نهایی
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
                <button
                  onClick={handleConfirm}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 h-12 px-8 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 ${
                    completedRequest || canceledRequest
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={completedRequest || canceledRequest}
                >
                  <CheckCircle className="w-4 h-4" />
                  تایید فاکتور
                </button>

                <button
                  onClick={handleComplete}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 h-12 px-8 bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white rounded-xl transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 ${
                    completedRequest || canceledRequest
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={completedRequest || canceledRequest}
                >
                  <CheckCircle className="w-4 h-4" />
                  تکمیل
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ImagePreview
        isOpen={isImagePreviewOpen}
        onClose={() => setIsImagePreviewOpen(false)}
        imageUrl={request.img}
      />
    </div>
  );
}
