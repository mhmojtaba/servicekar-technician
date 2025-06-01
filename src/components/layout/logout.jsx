"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Modal, Box } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import Button from "@/common/button";
import { LogOut } from "lucide-react";
import { toast } from "react-toastify";

const Logout = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Use useEffect to handle client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.clear();
      router.push("/login");
      toast.success("با موفقیت از حساب کاربری خارج شدید");
      setLoading(false);
    }, 1000);
  };

  const openLogoutModal = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <button
        onClick={openLogoutModal}
        className="w-[95%] flex items-center gap-3 px-4 py-3 text-error-600 hover:bg-error-200 rounded-lg transition-all duration-200 mx-2"
      >
        <LogOut size={18} />
        <span className="text-sm font-medium">خروج از حساب</span>
      </button>

      <Modal
        open={showModal}
        onClose={handleClose}
        aria-labelledby="logout-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            maxWidth: "95%",
            bgcolor: "background.paper",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            p: 0,
            overflow: "hidden",
          }}
        >
          <div className="bg-gradient-to-r from-error-50 to-white p-5 border-b border-neutral-200">
            <h3
              className="text-xl font-semibold text-error-700 text-right"
              id="logout-modal-title"
            >
              تایید خروج
            </h3>
          </div>

          <div className="p-5">
            <p className="text-neutral-600 mb-6 text-right">
              آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors text-sm font-medium"
              >
                انصراف
              </button>
              <Button
                className="px-4 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors text-sm font-medium"
                value="خروج"
                isLoading={loading}
                onClick={handleLogout}
              />
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default Logout;
