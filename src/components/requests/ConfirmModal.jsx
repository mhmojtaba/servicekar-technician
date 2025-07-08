"use client";
import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import dynamic from "next/dynamic";
import {
  X,
  CheckCircle,
  Pen,
  CreditCard,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "@/context/AuthContext";
import { useRequests } from "@/context/RequestsContext";
import { customSelectStyles } from "@/styles/customeStyles";
import { ConfirmRequest } from "@/services/requestsServices";

const SignaturePad = dynamic(() => import("react-signature-canvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[180px] bg-neutral-100 rounded-xl flex items-center justify-center">
      <div className="animate-pulse text-neutral-500">
        در حال بارگذاری امضا...
      </div>
    </div>
  ),
});

const ConfirmModal = ({ isOpen, onClose }) => {
  const { token } = useAuth();
  const { array_type_payment, selectedRequest, message_confirm_work } =
    useRequests();
  const sigPadRef = useRef();
  const canvasContainerRef = useRef();
  const [isClient, setIsClient] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    signature: null,
    type_payment: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 250 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasContainerRef.current && isClient) {
        const containerWidth = canvasContainerRef.current.offsetWidth;
        const isMobile = window.innerWidth < 768;

        const newSize = {
          width: containerWidth - 4,
          height: isMobile ? 250 : 300,
        };

        setCanvasSize((prevSize) => {
          if (
            prevSize.width !== newSize.width ||
            prevSize.height !== newSize.height
          ) {
            return newSize;
          }
          return prevSize;
        });
      }
    };

    if (isClient) {
      updateCanvasSize();
      window.addEventListener("resize", updateCanvasSize);
      return () => window.removeEventListener("resize", updateCanvasSize);
    }
  }, [isOpen, isClient]);

  useEffect(() => {
    if (isOpen && sigPadRef.current && isClient) {
      setTimeout(() => {
        if (
          sigPadRef.current &&
          typeof sigPadRef.current.clear === "function"
        ) {
          sigPadRef.current.clear();
          setFormData((prev) => ({ ...prev, signature: null }));
        }
      }, 100);
    }
  }, [isOpen, isClient]);

  const handleInputChange = (field, value) => {
    if (field === "code") {
      const numericValue = value.replace(/[^0-9]/g, "");
      const limitedValue = numericValue.slice(0, 5);
      setFormData((prev) => ({ ...prev, [field]: limitedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSignatureEnd = () => {
    if (sigPadRef.current && isClient) {
      try {
        if (typeof sigPadRef.current.getTrimmedCanvas === "function") {
          const signatureData = sigPadRef.current
            .getTrimmedCanvas()
            .toDataURL();
          handleInputChange("signature", signatureData);
        }
      } catch (error) {
        console.error("Error getting signature data:", error);
        try {
          const canvas = sigPadRef.current.getCanvas();
          if (canvas) {
            const signatureData = canvas.toDataURL();
            handleInputChange("signature", signatureData);
          }
        } catch (fallbackError) {
          console.error("Fallback signature capture failed:", fallbackError);
        }
      }
    }
  };

  const clearSignature = () => {
    if (sigPadRef.current && isClient) {
      try {
        if (typeof sigPadRef.current.clear === "function") {
          sigPadRef.current.clear();
          handleInputChange("signature", null);
        }
      } catch (error) {
        console.error("Error clearing signature:", error);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = "کد تایید الزامی است";
    } else if (formData.code.length !== 5) {
      newErrors.code = "کد تایید باید دقیقاً 5 رقم باشد";
    }

    if (!formData.signature) {
      newErrors.signature = "امضای مشتری الزامی است";
    }

    if (!formData.type_payment) {
      newErrors.type_payment = "انتخاب نوع پرداخت الزامی است";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const submitData = {
        token: token,
        order_id: selectedRequest?.id,
        confirmation_code: formData.code,
        signature_img: formData.signature,
        type_payment: formData.type_payment.value,
      };
      console.log("submitData", submitData);
      const response = await ConfirmRequest(submitData);
      console.log("response", response);
      const responseData = response?.data;

      if (responseData.msg === 0) {
        onClose();
        resetForm();
        toast.success(responseData.msg_text);
      } else {
        toast.error(responseData.msg_text);
        setErrors({
          submit:
            responseData.msg_text ||
            "خطا در تایید درخواست. لطفاً دوباره تلاش کنید.",
        });
      }
    } catch (error) {
      console.error("Error confirming request:", error);
      setErrors({ submit: "خطا در تایید درخواست. لطفاً دوباره تلاش کنید." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      signature: null,
      type_payment: null,
    });
    setErrors({});
    if (sigPadRef.current) {
      sigPadRef.current.clear();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  console.log("formData", formData);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-surface rounded-2xl w-full max-w-2xl max-h-[92vh] shadow-2xl border border-neutral-200 overflow-hidden transform transition-all duration-300 flex flex-col">
        <div className="bg-gradient-to-r from-primary-50 via-white to-primary-50 px-4 sm:px-6 py-4 sm:py-5 border-b border-neutral-100 relative flex-shrink-0">
          <button
            onClick={handleClose}
            className="absolute top-3 sm:top-4 left-3 sm:left-4 p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-success-500 to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-base sm:text-xl font-bold text-text mb-1">
              تایید درخواست #{selectedRequest?.id}
            </h3>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 ">
            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3">
                <AlertCircle className="w-4 h-4 text-primary-500" />
                کد تایید
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
                placeholder="کد 5 رقمی را وارد کنید"
                className={`w-full h-12 sm:h-14 px-4 border-2 rounded-xl focus:outline-none transition-all duration-200 text-base text-center tracking-widest ${
                  errors.code
                    ? "border-error-300 focus:border-error-500 bg-error-50"
                    : "border-neutral-200 focus:border-primary-500 bg-white"
                }`}
                maxLength={5}
              />
              {errors.code && (
                <p className="text-error-600 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.code}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3">
                <CreditCard className="w-4 h-4 text-accent-500" />
                نوع پرداخت
              </label>
              <Select
                options={array_type_payment}
                value={formData.type_payment}
                onChange={(value) => handleInputChange("type_payment", value)}
                placeholder="انتخاب نوع پرداخت..."
                styles={customSelectStyles}
                isClearable
                isSearchable
                noOptionsMessage={() => "گزینه‌ای یافت نشد"}
              />
              {errors.type_payment && (
                <p className="text-error-600 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.type_payment}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3">
                <Pen className="w-4 h-4 text-secondary-500" />
                امضای مشتری
              </label>

              <div
                ref={canvasContainerRef}
                className={`border-2 rounded-xl overflow-hidden relative ${
                  errors.signature
                    ? "border-error-300 bg-error-50 "
                    : "border-neutral-200"
                }`}
              >
                {isClient ? (
                  <SignaturePad
                    ref={sigPadRef}
                    penColor="#22c55e"
                    canvasProps={{
                      width: canvasSize.width,
                      height: canvasSize.height,
                      style: {
                        width: "100%",
                        height: `${canvasSize.height}px`,
                        display: "block",
                        touchAction: "none",
                      },
                      className: "bg-white cursor-crosshair",
                    }}
                    onEnd={handleSignatureEnd}
                  />
                ) : (
                  <div className="w-full h-[180px] bg-neutral-100 rounded-xl flex items-center justify-center">
                    <div className="animate-pulse text-neutral-500">
                      در حال بارگذاری امضا...
                    </div>
                  </div>
                )}

                <div className="absolute bottom-4 flex items-center justify-center pointer-events-none">
                  <p className="text-error-400 text-sm sm:text-base text-center px-4 flex gap-2 items-center">
                    <AlertCircle className="w-4 h-4" />
                    {message_confirm_work}
                  </p>
                </div>

                {!formData.signature && isClient && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-neutral-400 text-sm sm:text-base text-center px-4">
                      برای امضا، انگشت خود را روی صفحه بکشید
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-2">
                {errors.signature && (
                  <p className="text-error-600 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.signature}
                  </p>
                )}
                <button
                  onClick={clearSignature}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-neutral-600 hover:text-error-600 transition-colors rounded-lg hover:bg-neutral-100"
                >
                  <Trash2 className="w-4 h-4" />
                  پاک کردن
                </button>
              </div>
            </div>

            {errors.submit && (
              <div className="bg-error-50 border border-error-200 rounded-xl p-4">
                <p className="text-error-700 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.submit}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 border-t border-neutral-100 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleClose}
              className="flex-1 h-12 sm:h-14 px-6 py-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl transition-colors text-sm font-medium"
            >
              انصراف
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 h-12 sm:h-14 px-6 py-4 bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white rounded-xl transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  در حال تایید...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  تایید درخواست
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
