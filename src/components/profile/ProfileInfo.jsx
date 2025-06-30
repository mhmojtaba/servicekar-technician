"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { UserIcon, Camera, Edit3, X, CheckCircle } from "lucide-react";
import { uploadFile } from "@/utils/utils";

import { useAuth } from "@/context/AuthContext";

const ProfileInfo = () => {
  const { user, token, setUser } = useAuth();

  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFirst_name(user.first_name || "");
      setLast_name(user.last_name || "");
      setProfileImage(user.image || null);
    }
  }, [user]);

  const handleSave = () => {
    console.log(first_name, last_name);
    setUser({ ...user, first_name, last_name, image: profileImage });
    setIsEditingName(false);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("لطفا فقط فایل تصویری انتخاب کنید");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("حجم فایل باید کمتر از 5 مگابایت باشد");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    setIsUploadingImage(true);

    try {
      const { data: response } = await uploadFile(file, token);

      if (response.msg === 0 && response.path) {
        setProfileImage(response.path);
        setImagePreview(null);
        setUser({ ...user, image: response.path });
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("خطا در آپلود فایل. لطفا دوباره تلاش کنید.");
      setImagePreview(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Image Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-surface rounded-2xl shadow-card border border-neutral-200 overflow-hidden"
      >
        <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 p-8 text-center">
          <div className="relative inline-block">
            <div className="relative w-32 h-32 mx-auto mb-4">
              {profileImage || imagePreview ? (
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={imagePreview || profileImage}
                    alt="پروفایل"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center border-4 border-white shadow-lg">
                  <UserIcon className="w-16 h-16 text-neutral-400" />
                </div>
              )}

              {isUploadingImage && (
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              <label className="absolute bottom-0 right-0 w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-accent-600 transition-colors shadow-lg border-2 border-white">
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploadingImage}
                />
              </label>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              {first_name || last_name ? `${first_name} ${last_name}` : "کاربر"}
            </h2>
            <p className="text-primary-100">شماره تماس: {user?.mobile}</p>
          </div>
        </div>

        {/* Profile Information */}
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-text flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-primary-500" />
              اطلاعات شخصی
            </h3>
            {!isEditingName && (
              <button
                onClick={() => setIsEditingName(true)}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                ویرایش
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                نام
              </label>
              {isEditingName ? (
                <input
                  type="text"
                  value={first_name}
                  onChange={(e) => setFirst_name(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  placeholder="نام خود را وارد کنید"
                />
              ) : (
                <div className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700">
                  {first_name || "وارد نشده"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                نام خانوادگی
              </label>
              {isEditingName ? (
                <input
                  type="text"
                  value={last_name}
                  onChange={(e) => setLast_name(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  placeholder="نام خانوادگی خود را وارد کنید"
                />
              ) : (
                <div className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700">
                  {last_name || "وارد نشده"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                شماره تماس
              </label>
              <div className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700">
                {user?.mobile || "وارد نشده"}
              </div>
            </div>
          </div>

          {isEditingName && (
            <div className="flex gap-3 mt-8 justify-end">
              <button
                onClick={() => {
                  setFirst_name(user?.first_name || "");
                  setLast_name(user?.last_name || "");
                  setIsEditingName(false);
                }}
                className="px-6 py-2.5 text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors font-medium flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                لغو
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-success-500 text-white rounded-lg hover:bg-success-600 transition-colors font-medium flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                ذخیره تغییرات
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileInfo;
