"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu as MenuIcon, X } from "lucide-react";
import logo from "@/assets/images/logo.png";
import SideBar from "./SideBar";

const MenuComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close sidebar when screen size changes to desktop
  useEffect(() => {
    if (!mounted) return;

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (!mounted) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white shadow-sm h-16">
        <div className="flex items-center justify-between px-4 h-full">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Open menu"
          >
            <MenuIcon size={24} />
          </button>
          <div className="text-lg font-semibold text-primary-700 flex items-center gap-2">
            <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-primary-100 shadow-sm">
              <Image
                src={logo}
                alt="Logo"
                loading="lazy"
                fill
                sizes="100%"
                className="bg-white object-cover"
              />
            </div>
            شرکت خدمات گستر جزائری
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-30 md:hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-neutral-900 bg-opacity-50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>

        <div
          className={`absolute top-0 right-0 h-full w-80 max-w-[80%] bg-white shadow-xl transition-transform duration-300 ease-in-out transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <SideBar setIsShow={setIsOpen} isShow={isOpen} isMobile={true} />
        </div>
      </div>

      <div className="hidden md:block w-1/4 flex-shrink-0 border-r border-neutral-200 bg-white shadow-sm fixed inset-0">
        <SideBar setIsShow={setIsOpen} isShow={isOpen} isMobile={false} />
      </div>
    </>
  );
};

export default MenuComponent;
