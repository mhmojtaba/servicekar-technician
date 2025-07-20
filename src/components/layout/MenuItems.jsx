"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

import Link from "next/link";

import { useRequests } from "@/context/RequestsContext";
import { mainMeniRoutes } from "@/constants/constants";
import { Loader2 } from "lucide-react";

const MenuItems = ({ setIsShow }) => {
  const {
    isGettingIncompleteRequests,
    incompleteRequests,
    unreadMessagesCount,
    isGettingUnreadCount,
  } = useRequests();

  const pathname = usePathname();

  const isActive = (path) => {
    if (path === "/") {
      return pathname === "/";
    }

    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <nav className="px-2 py-1">
      <ul className="space-y-1">
        {mainMeniRoutes.map((item) => (
          <li key={item.id}>
            <Link
              href={item.path}
              onClick={() => setIsShow(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive(item.path)
                  ? "bg-primary-50 text-primary-700 font-medium shadow-sm"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <span className="text-sm flex items-center gap-2">
                {item.icon}
                {item.name}
              </span>
              {item.name === "داشبورد" &&
                incompleteRequests > 0 &&
                !isGettingIncompleteRequests && (
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-error-500 text-white">
                    {incompleteRequests}
                  </span>
                )}
              {item.name === "داشبورد" && isGettingIncompleteRequests && (
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-error-500 text-white">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </span>
              )}
              {item.name === "پیام رسان" &&
                unreadMessagesCount > 0 &&
                !isGettingUnreadCount && (
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-success-500 text-white">
                    {unreadMessagesCount}
                  </span>
                )}
              {item.name === "پیام رسان" && isGettingUnreadCount && (
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-success-500 text-white">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MenuItems;
