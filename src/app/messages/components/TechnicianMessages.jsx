import React, { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Check,
  CheckCheck,
  SendHorizontal,
  Loader2,
  MessageSquare,
  Shield,
  User,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

import { getMessages, sendMessage } from "@/services/messageService";
import { useAuth } from "@/context/AuthContext";
import { useDeviceType } from "@/hooks/useDeviceType";
import { useRequests } from "@/context/RequestsContext";

const MessageBubble = React.memo(({ message, isOwn }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.8 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.3 }}
    className={`flex ${isOwn ? "justify-start" : "justify-end"} mb-4`}
  >
    <div className={`max-w-xs lg:max-w-md ${isOwn ? "order-2" : "order-1"}`}>
      <div
        className={`relative px-4 py-3 rounded-2xl shadow-md ${
          isOwn
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
            : "bg-white border border-gray-100 text-gray-800 rounded-bl-md"
        }`}
      >
        <div className="text-sm leading-relaxed">{message?.content}</div>

        <div
          className={`flex items-center justify-between mt-2 pt-2 border-t ${
            isOwn ? "border-blue-400/30" : "border-gray-100"
          }`}
        >
          <div className="flex items-center">
            <div
              className={`p-1 rounded-full ${
                isOwn ? "bg-blue-400/20" : "bg-gray-100"
              }`}
            >
              {message?.sender_type === "admin" ? (
                <Shield className="w-3 h-3 text-purple-600" />
              ) : (
                <User
                  className={`w-3 h-3 ${isOwn ? "text-blue-100" : "text-blue-600"}`}
                />
              )}
            </div>
            <span
              className={`text-xs ${isOwn ? "text-blue-100" : "text-gray-500"}`}
            >
              {message?.sender_type === "admin" ? "مدیر" : "تکنسین"}
            </span>
          </div>

          <div className="flex items-center gap-2 mr-1">
            <span
              className={`text-xs ${isOwn ? "text-blue-100" : "text-gray-400"}`}
            >
              {new Date(message?.date * 1000).toLocaleString("fa-IR", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {isOwn && (
              <div className="text-blue-100">
                {message?.is_read ? (
                  <CheckCheck className="w-4 h-4" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </motion.div>
));

const TechnicianMessages = () => {
  const { token } = useAuth();
  const deviceType = useDeviceType();
  const { fetchUnreadMessagesCount } = useRequests();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const { isPending: isGettingMessages, mutateAsync: mutateGetMessages } =
    useMutation({
      mutationFn: getMessages,
    });

  const { isPending: isSendingMessage, mutateAsync: mutateSendMessage } =
    useMutation({
      mutationFn: sendMessage,
    });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  const fetchMessages = async () => {
    try {
      const { data: response } = await mutateGetMessages(token);

      if (response.msg === 0) {
        setMessages(response?.messages);

        setTimeout(scrollToBottom, 100);
      } else {
        toast.error(response.msg);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessageHandler = async () => {
    if (!newMessage.trim() || isSendingMessage) return;

    try {
      const data = {
        token,
        content: newMessage,
      };
      const { data: response } = await mutateSendMessage(data);

      if (response.msg === 0) {
        toast.success(response.msg_text);
        fetchMessages();
        fetchUnreadMessagesCount();
        setNewMessage("");
      } else {
        toast.error(response.msg);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = (e) => {
    if (deviceType === "desktop" && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessageHandler();
    }
  };

  const handleChange = (e) => {
    setNewMessage(e.target.value);
  };

  useEffect(() => {
    if (token) {
      fetchMessages();
      fetchUnreadMessagesCount();
    }
  }, [token]);

  console.log("TechnicianMessages rendered");

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isGettingMessages ? (
          <div className="flex items-center justify-center h-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 text-gray-500"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>در حال بارگذاری پیام‌ها...</span>
            </motion.div>
          </div>
        ) : messages?.length > 0 ? (
          <AnimatePresence>
            {messages.map((msg) => (
              <MessageBubble
                key={msg?.id}
                message={msg}
                isOwn={msg?.sender_type !== "admin"}
              />
            ))}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-gray-500"
          >
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium mb-2">هنوز پیامی ندارید</p>
            <p className="text-sm text-gray-400">
              اولین پیام خود را ارسال کنید
            </p>
          </motion.div>
        )}
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-end gap-2">
          <textarea
            rows={1}
            value={newMessage}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={"پیام خود را بنویسید..."}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none max-h-32"
            style={{ minHeight: "44px" }}
          />
          <button
            onClick={sendMessageHandler}
            disabled={isSendingMessage || !newMessage.trim()}
            className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:bg-gray-300 transition-colors flex-shrink-0"
          >
            {isSendingMessage ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <SendHorizontal className="w-5 h-5 rotate-180" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicianMessages;
