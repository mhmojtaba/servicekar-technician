"use client";
import React from "react";
import Image from "next/image";
import AdminMenuItems from "./adminMenuItems";
import { X } from "lucide-react";
import logo from "@/assets/images/logo.png";
import { useAuth } from "@/context/AuthContext";

const SideBar = ({ setIsShow, isShow, isMobile }) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-neutral-200 bg-gradient-to-r from-primary-200 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-primary-100 shadow-sm">
              <Image
                src={logo}
                alt="Logo"
                loading="lazy"
                fill
                sizes="100%"
                className="bg-white object-contain"
              />
            </div>
            <div>
              <div className="flex flex-col items-start">
                <span className="text-primary-700 font-bold text-lg ml-1">
                  شرکت خدمات گستر جزائری
                </span>
                <span className="text-neutral-600 text-sm">پنل تکنسین</span>
              </div>

              <div className="text-sm text-neutral-500 mt-0.5">
                {user?.first_name
                  ? `${user.first_name} ${user.last_name || ""}`
                  : "کاربر"}
              </div>
            </div>
          </div>

          {isMobile && (
            <button
              onClick={() => setIsShow(false)}
              className="p-1.5 rounded-md text-neutral-500 hover:bg-neutral-100 transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent overflow-x-hidden">
        <AdminMenuItems setIsShow={setIsShow} />
      </div>
    </div>
  );
};

export default SideBar;
