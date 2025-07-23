"use client";

import React from "react";
import { motion } from "framer-motion";

import TechnicianMessages from "./components/TechnicianMessages";

const MessagesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="container mx-auto px-4 py-6 max-w-4xl h-full pt-16 md:pt-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden"
        >
          <div className="h-[calc(100vh-100px)] flex flex-col">
            <TechnicianMessages />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MessagesPage;
