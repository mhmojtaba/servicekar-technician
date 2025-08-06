"use client";
import React, { useState } from "react";
import {
  X,
  Upload,
  Trash2,
  Image as ImageIcon,
  Plus,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useRequests } from "@/context/RequestsContext";
import { uploadFile } from "@/utils/utils";
import { useAuth } from "@/context/AuthContext";

const AddImage = ({ setRequestData, onClose }) => {
  const { token } = useAuth();
  const [images, setImages] = useState([]);
  const [uploadingStates, setUploadingStates] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const { selectedRequest } = useRequests();

  const handleImageUpload = async (files) => {
    const fileList = Array.from(files);

    const validFiles = fileList.filter((file) => {
      if (!file.type.startsWith("image/")) {
        alert("لطفا فقط فایل تصویری انتخاب کنید");
        return false;
      }
      if (file.size > 15 * 1024 * 1024) {
        alert("حجم فایل باید کمتر از 15 مگابایت باشد");
        return false;
      }
      return true;
    });

    for (const file of validFiles) {
      const tempId = Date.now() + Math.random();

      setUploadingStates((prev) => ({
        ...prev,
        [tempId]: { isUploading: true, progress: 0 },
      }));

      try {
        const { data: response } = await uploadFile(file, token);

        if (response.msg === 0 && response.path) {
          setImages((prev) => [
            ...prev,
            {
              id: tempId,
              url: response.path,
              name: file.name,
              size: file.size,
            },
          ]);

          setUploadingStates((prev) => {
            const newState = { ...prev };
            delete newState[tempId];
            return newState;
          });
        }
      } catch (error) {
        console.error("Upload error:", error);
        setUploadingStates((prev) => {
          const newState = { ...prev };
          delete newState[tempId];
          return newState;
        });
        alert("خطا در آپلود فایل. لطفا دوباره تلاش کنید.");
      }
    }
  };

  const handleImageRemove = (imageId) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleImageUpload(files);
    }
  };

  const handleSave = () => {
    const imageUrls = images.map((img) => img.url);

    setRequestData((prev) => ({
      ...prev,
      images: imageUrls,
    }));
    setImages([]);
    setUploadingStates({});
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center relative">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              افزودن تصاویر
            </h2>
            <p className="text-white/90">
              درخواست شماره:{" "}
              {selectedRequest?.requestNumber || selectedRequest?.id}
            </p>

            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(78vh-200px)] overflow-y-auto">
            {/* Upload Area */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragActive
                  ? "border-blue-500 bg-blue-50 border-4"
                  : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/30"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="flex flex-col items-center gap-4">
                <motion.div
                  animate={{ rotate: dragActive ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-4 bg-blue-100 rounded-full"
                >
                  <Upload className="w-8 h-8 text-blue-600" />
                </motion.div>
                <div>
                  <p className="text-lg font-medium text-gray-800 mb-2">
                    تصاویر خود را اینجا بکشید یا کلیک کنید
                  </p>
                  <p className="text-sm text-gray-500">
                    فرمت‌های پشتیبانی شده: JPG, PNG, GIF - حداکثر حجم: 15MB
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Uploading Progress */}
            {Object.keys(uploadingStates).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  در حال آپلود...
                </h3>
                <div className="space-y-3">
                  {Object.entries(uploadingStates).map(([id, state]) => (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                      <div className="flex-1">
                        <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full w-1/3 animate-pulse"></div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Uploaded Images */}
            {images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    تصاویر آپلود شده ({images.length})
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {images.map((image, index) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative group"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-md hover:shadow-lg">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                        <button
                          onClick={() => handleImageRemove(image.id)}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 transform hover:scale-110"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p
                        className="mt-2 text-xs text-gray-600 truncate text-center"
                        title={image.name}
                      >
                        {image.name}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {images.length === 0 &&
              Object.keys(uploadingStates).length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 text-center py-12"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">
                    هنوز تصویری آپلود نشده است
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    تصاویر خود را در بالا آپلود کنید
                  </p>
                </motion.div>
              )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="text-sm text-gray-600">
                {images.length > 0 && (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {images.length} تصویر آماده ذخیره
                  </span>
                )}
              </div>
              <div className="flex gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={handleClose}
                  className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  لغو
                </button>
                <button
                  onClick={handleSave}
                  disabled={images.length === 0}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    images.length > 0
                      ? "bg-blue-500 text-white hover:bg-blue-600 transform hover:scale-105"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  ذخیره تصاویر
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddImage;
