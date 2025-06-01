"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import MenuComponent from "./Menu";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname?.includes("login");

  if (isLoginPage) {
    return <div className="w-full h-screen">{children}</div>;
  }

  return (
    <div className="bg-white min-h-screen relative">
      <div className="md:hidden fixed top-0 right-0 w-full z-10 bg-white shadow-lg">
        <div className="pt-14">
          <MenuComponent />
        </div>
      </div>

      <div className="grid grid-cols-4 h-full">
        <div className="hidden md:block md:col-span-1">
          <MenuComponent />
        </div>

        <div className="col-span-4 md:col-span-3 px-4 md:py-6 overflow-x-hidden mr-4">
          {children}
        </div>
      </div>
    </div>
  );
}
