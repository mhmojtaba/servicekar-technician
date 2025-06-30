"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, TrendingUp } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ScoresTab from "@/components/profile/ScoresTab";

const page = () => {
  const { user } = useAuth();

  // Loading state to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state until client is ready
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

  const tabs = [
    {
      id: "profile",
      label: "مشخصات پروفایل",
      icon: User,
      component: <ProfileInfo />,
    },
    {
      id: "scores",
      label: "امتیازات",
      icon: TrendingUp,
      component: <ScoresTab />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text mb-3 text-center">
            پروفایل کاربری
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto text-center">
            اطلاعات پروفایل و امتیازات خود را مشاهده و مدیریت کنید
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <div className="bg-surface rounded-2xl shadow-card border border-neutral-200 p-2">
            <div className="flex space-x-1 rtl:space-x-reverse">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-primary-500 text-white shadow-lg"
                        : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {tabs.find((tab) => tab.id === activeTab)?.component}
        </motion.div>
      </div>
    </div>
  );
};

export default page;
