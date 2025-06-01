"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

import Link from "next/link";

import { useRequests } from "@/context/RequestsContext";
import { mainMeniRoutes } from "@/constants/constants";

const MenuItems = ({ setIsShow }) => {
  const { mainRequests } = useRequests();

  const pathname = usePathname();

  const pendingRequests = mainRequests.filter(
    (item) => item.status != 8 && item.status != 2
  );
  const pendingRequestsLength = pendingRequests?.length;

  return (
    <nav className="px-2 py-1">
      <ul className="space-y-1">
        {mainMeniRoutes.map((item) => (
          <li key={item.id}>
            <Link
              href={item.path}
              onClick={() => setIsShow(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                pathname === item.path
                  ? "bg-primary-50 text-primary-700 font-medium shadow-sm"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <span className="text-sm flex items-center gap-2">
                {item.icon}
                {item.name}
              </span>
              {item.name === "داشبورد" && pendingRequestsLength > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-error-500 text-white">
                  {pendingRequestsLength}
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
