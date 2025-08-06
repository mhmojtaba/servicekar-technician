"use client";
import React, { useEffect, useState } from "react";
import { X, MapPin, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

import { useMutation } from "@tanstack/react-query";
import { addLocation } from "@/services/requestsServices";
import { useAuth } from "@/context/AuthContext";
import { useRequests } from "@/context/RequestsContext";

const MapSection = dynamic(
  () => import("@/components/SelectLocation/MapSection"),
  {
    loading: () => (
      <div className="flex items-center justify-center h-[250px] sm:h-[350px] md:h-[400px] bg-neutral-100">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary-500 mx-auto mb-2" />
          <p className="text-sm text-neutral-600">بارگذاری نقشه...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);

const LocationModal = ({ isOpen, onClose }) => {
  const { token } = useAuth();
  const { selectedRequest } = useRequests();
  const [location, setLocation] = useState([32.644397, 51.667455]);
  const [address, setAddress] = useState("");

  const { mutateAsync: MutateUpdateLocation, isPending: isUpdating } =
    useMutation({
      mutationFn: addLocation,
    });

  useEffect(() => {
    if (selectedRequest) {
      setLocation([selectedRequest.latitude, selectedRequest.longitude]);
      setAddress(selectedRequest.address);
    }
  }, [selectedRequest]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    try {
      const data = {
        token: token,
        order_id: selectedRequest.id,
        lat: location[0],
        lng: location[1],
        address: address,
      };
      const { data: res } = await MutateUpdateLocation(data);
      if (res.msg === 0) {
        toast.success("آدرس با موفقیت ویرایش شد");
        onClose();
      } else {
        toast.error(res.msg_text);
      }
    } catch (error) {
      console.log(error);
      toast.error("ثبت آدرس با مشکل مواجه شد");
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fadeIn"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
    >
      <div className="bg-surface rounded-2xl w-full max-w-2xl max-h-[95vh] shadow-2xl border border-neutral-200 overflow-hidden transform transition-all duration-300 flex flex-col">
        <div className="bg-gradient-to-r from-primary-50 via-white to-primary-50 px-4 sm:px-6 py-4 sm:py-5 border-b border-neutral-100 relative flex-shrink-0">
          <button
            onClick={handleClose}
            className="absolute top-3 sm:top-4 left-3 sm:left-4 p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-semibold text-neutral-800 text-center">
            ویرایش موقعیت مکانی
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-neutral-100 bg-neutral-50">
                <div className="flex items-center gap-2 text-neutral-700">
                  <MapPin className="w-5 h-5 text-primary-500" />
                  <h4 className="font-medium">انتخاب موقعیت روی نقشه</h4>
                </div>
              </div>
              <div className="relative">
                <div className="h-[300px] sm:h-[350px] md:h-[400px] w-full bg-neutral-50">
                  <MapSection
                    onChange={(lat, lng) => setLocation([lat, lng])}
                    location={location}
                  />
                </div>
                {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/10 to-transparent h-12 pointer-events-none" /> */}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-neutral-100 bg-neutral-50">
                <h4 className="font-medium text-neutral-700">آدرس دقیق</h4>
              </div>
              <div className="p-4">
                <textarea
                  id="address"
                  rows="3"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="block w-full px-4 py-3 text-sm text-neutral-700 bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none hover:border-neutral-400"
                  placeholder="آدرس کامل را وارد کنید..."
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t border-neutral-200 bg-neutral-50 rounded-b-2xl">
          <button
            onClick={handleSubmit}
            type="submit"
            disabled={isUpdating}
            className={`flex-1 px-6 py-3 text-sm font-medium text-white rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:bg-slate-300 disabled:cursor-not-allowed bg-success-500 hover:bg-success-600 focus:ring-4 focus:ring-success-200 shadow-sm hover:shadow-md`}
          >
            {isUpdating ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                در حال پردازش...
              </span>
            ) : (
              "ویرایش آدرس"
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-none px-6 py-3 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50 focus:ring-4 focus:ring-neutral-200 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
          >
            لغو
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LocationModal;
