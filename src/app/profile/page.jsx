"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { useAuth } from "@/context/AuthContext";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ScoresTab from "@/components/profile/ScoresTab";

const page = () => {
  const { user } = useAuth();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">در حال بارگیری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 mt-16 md:mt-0"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text mb-3 text-center">
            پروفایل کاربری
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto text-center">
            اطلاعات پروفایل و امتیازات خود را مشاهده و مدیریت کنید
          </p>
        </motion.div>

        <motion.div
          key={user?.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ProfileInfo />
        </motion.div>
      </div>
    </div>
  );
};

export default page;
