import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaStar, FaTimes } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";

import { useAuth } from "@/context/AuthContext";
import { getRatingData } from "@/services/requestsServices";

const RatingModal = ({ isOpen, onClose }) => {
  const { token } = useAuth();
  const [ratingData, setRatingData] = useState(0);

  const { avg_all, distribution, last_100, last_100_count } = ratingData;

  const { isPending: isGettingRatingData, mutateAsync: mutateGetRatingData } =
    useMutation({
      mutationFn: getRatingData,
    });

  useEffect(() => {
    if (token && isOpen) {
      fetchRatingData(token);
      console.log("fetching rating data");
    }
  }, [token, isOpen]);

  const fetchRatingData = async () => {
    try {
      const { data } = await mutateGetRatingData(token);
      setRatingData(data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <motion.div
      className="fixed z-50 flex items-center justify-center bg-neutral-900/70 backdrop-blur-md p-4 overflow-y-auto"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl  relative max-h-[95vh] flex flex-col overflow-hidden"
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {isGettingRatingData ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <>
            <div className="relative bg-gradient-to-l from-primary-500 to-primary-600 text-white p-8">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex-col items-center justify-center">
                  <h3 className="text-2xl font-bold mb-2 text-center">
                    امتیاز شما
                  </h3>
                  <div className="flex items-center gap-2 justify-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const rating = avg_all;
                        const filled = star <= Math.floor(rating);
                        const partial =
                          star === Math.ceil(rating) && rating % 1 !== 0;
                        const fillPercentage = partial ? (rating % 1) * 100 : 0;

                        return (
                          <div key={star} className="relative w-5 h-5">
                            <svg
                              className="absolute inset-0 w-5 h-5 text-gray-300 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>

                            {(filled || partial) && (
                              <div
                                className="absolute inset-0 overflow-hidden"
                                style={{
                                  width: filled ? "100%" : `${fillPercentage}%`,
                                }}
                              >
                                <svg
                                  className="w-5 h-5 text-yellow-300 fill-current"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                </svg>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <span className="text-lg font-bold">
                      {avg_all ? Number(avg_all).toFixed(1) : "0.0"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-3 text-white/80 hover:text-white hover:bg-white/20 rounded-2xl transition-all duration-200 transform hover:scale-110"
                  aria-label="بستن"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>

            <div className="px-8 py-4">
              <h4 className="text-lg font-bold mb-2">امتیاز های شما</h4>
              {Object.entries(distribution || {}).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <h5 className="flex items-center justify-end gap-2 w-[10%] text-sm">
                    {key} <FaStar size={16} className="text-yellow-300" />
                  </h5>
                  <div className="flex items-center gap-2 w-[80%]">
                    <div className="w-full h-1 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-yellow-300 rounded-full"
                        style={{ width: `${(value / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="flex items-center gap-2 text-sm text-gray-500 w-[10%]">
                    {value} نفر
                  </p>
                </div>
              ))}
              <p className="text-sm text-gray-500 text-center mt-2 font-bold">
                بر اساس {last_100_count} نظر امتیازدهی شده اخیر
              </p>
            </div>

            <div className="px-8 pb-4 max-h-[400px] overflow-y-auto">
              <h4 className="text-lg font-bold mb-2">آخرین نظرات درباره شما</h4>
              <div className="flex flex-col gap-2">
                {last_100?.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <span className="flex items-center gap-2 bg-gray-200 rounded-full px-2 py-1 text-sm">
                      {item.rating}{" "}
                      <FaStar size={16} className="text-yellow-300" />
                    </span>
                    <p className="flex-1 text-sm text-gray-500">
                      {item.text || "---"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default RatingModal;
