"use client";
import React, { useState } from "react";
import { X, Upload, Trash2, Image as ImageIcon, Plus } from "lucide-react";

import { useRequests } from "@/context/RequestsContext";
import { uploadFile } from "@/utils/utils";
import { useAuth } from "@/context/AuthContext";

const AddImageModal = ({ isOpen, onClose }) => {
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
    console.log(imageUrls);
    // setImages([]);
    // onClose();
  };

  const handleClose = () => {
    setImages([]);
    setUploadingStates({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[95vh] bg-surface rounded-2xl shadow-2xl animate-fadeIn overflow-hidden">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-neutral-200 bg-gradient-to-r from-primary-500 to-primary-100">
          <h2 className="text-base md:text-2xl font-bold text-text flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-primary-500" />
            افزودن تصاویر
            <span className="text-sm text-neutral-500">
              درخواست شماره # {selectedRequest.id}
            </span>
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragActive
                ? "border-primary-500 bg-primary-50"
                : "border-neutral-300 hover:border-primary-400 hover:bg-primary-50/30"
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
              <div className="p-4 bg-primary-100 rounded-full">
                <Upload className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-text mb-2">
                  تصاویر خود را اینجا بکشید یا کلیک کنید
                </p>
                <p className="text-sm text-neutral-500">
                  فرمت‌های پشتیبانی شده: JPG, PNG, GIF - حداکثر حجم: 15MB
                </p>
              </div>
            </div>
          </div>

          {Object.keys(uploadingStates).length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-text mb-4">
                در حال آپلود...
              </h3>
              <div className="space-y-3">
                {Object.entries(uploadingStates).map(([id, state]) => (
                  <div
                    key={id}
                    className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-neutral-200 rounded-lg animate-pulse"></div>
                    <div className="flex-1">
                      <div className="w-2/3 h-4 bg-neutral-200 rounded animate-pulse mb-2"></div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div className="bg-primary-500 h-2 rounded-full w-1/3 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {images.length > 0 && (
            <div className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-neutral-100 border-2 border-neutral-200 hover:border-primary-300 transition-colors">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleImageRemove(image.id)}
                        className="absolute top-2 right-2 p-1.5 bg-error-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p
                      className="mt-2 text-xs text-neutral-600 truncate"
                      title={image.name}
                    >
                      {image.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {images.length === 0 && Object.keys(uploadingStates).length === 0 && (
            <div className="mt-8 text-center py-8">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-neutral-400" />
              </div>
              <p className="text-neutral-500">هنوز تصویری آپلود نشده است</p>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-start md:items-center justify-between p-3 md:p-6 border-t border-neutral-200 bg-neutral-50">
          <div className="text-sm text-neutral-600">
            {images.length > 0 && `${images.length} تصویر بارگذاری شده`}
          </div>
          <div className="flex gap-3 w-full md:w-auto justify-end">
            <button
              onClick={handleClose}
              className="px-6 py-2.5 text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors font-medium"
            >
              لغو
            </button>
            <button
              onClick={handleSave}
              disabled={images.length === 0}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                images.length > 0
                  ? "bg-primary-500 text-white hover:bg-primary-600"
                  : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
              }`}
            >
              ذخیره تصاویر
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddImageModal;
