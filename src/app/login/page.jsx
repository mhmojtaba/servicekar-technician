"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import SendOtp from "./sendOtp";
import CheckOtp from "./checkOtp";
import { checkOtp, sendOtp } from "@/services/authServices";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/images/logo.png";

const LoginPage = () => {
  const { setUser } = useAuth();
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [sendOtpTimer, setSendOtpTimer] = useState(0);
  const [checkOtpTimer, setCheckOtpTimer] = useState(0);

  const { isPending, mutateAsync: mutateSendOtp } = useMutation({
    mutationFn: sendOtp,
  });

  const { mutateAsync: mutateCheckOtp, isPending: isChecking } = useMutation({
    mutationFn: checkOtp,
  });

  const sendOTPHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await mutateSendOtp(phoneNumber);
      console.log(data);
      if (data?.msg == -1) {
        toast.error("شما دسترسی ورود به این پنل را ندارید");
        setSendOtpTimer(5);
        return;
      }
      setStep(2);
      setSendOtpTimer(60);
      toast.success("کد تایید برای شما ارسال شد");
    } catch (err) {
      console.error(err);
      toast.error("خطایی در ارسال کد رخ داده است");
    }
  };

  const checkOTPHandler = async (otp) => {
    try {
      const data = { phoneNumber, otp };
      const { data: response } = await mutateCheckOtp(data);

      setCheckOtpTimer(5);

      if (response.msg === 0 && response.token.length > 0) {
        const userData = {
          first_name: response?.value?.first_name,
          last_name: response?.value?.last_name,
          mobile: response?.value?.mobile,
        };
        setUser(userData);
        localStorage.setItem("tech-token", response?.token);
        localStorage.setItem("user", JSON.stringify(userData));
        router.push("/");
        toast.success("ورود با موفقیت انجام شد");
      } else {
        toast.error(response.msg_text);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let interval;
    if (sendOtpTimer > 0) {
      interval = setInterval(() => {
        setSendOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sendOtpTimer]);

  useEffect(() => {
    let interval;
    if (checkOtpTimer > 0) {
      interval = setInterval(() => {
        setCheckOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [checkOtpTimer]);

  const phoneNumberHandler = (e) => {
    const target = e.target.value;

    if (target === "" || (/^0\d*$/.test(target) && target.length <= 11)) {
      setPhoneNumber(target);
    }
    if (target.length < 11) {
      setError("شماره وارد شده اشتباه است!");
    } else {
      setError("");
    }
  };

  const backHandler = () => {
    setStep(1);
    setSendOtpTimer(0);
  };

  useEffect(() => {
    localStorage.getItem("tech-token") && router.push("/");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-primary-100 via-white to-secondary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-primary-200 opacity-70"></div>
        <div className="absolute -bottom-8 -right-8 w-16 h-16 rounded-full bg-secondary-200 opacity-70"></div>
        <div className="absolute top-1/4 right-0 translate-x-1/2 w-8 h-8 rounded-full bg-primary-300 opacity-50"></div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm border border-gray-100">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-6 px-8 text-center">
            <div className="flex justify-center mb-2">
              <div className="bg-white rounded-full py-2 shadow-lg">
                <Image
                  src={logo}
                  width={100}
                  height={100}
                  alt="خدمات گستر جزائری"
                  className="rounded-full object-cover"
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">
              شرکت خدمات گستر جزائری
            </h1>
            <p className="text-primary-100 text-sm mt-1">پنل تکنسین</p>
          </div>

          <div className="p-8">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                      step >= 1
                        ? "bg-primary-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    <span className="text-lg font-medium">1</span>
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      step >= 1 ? "text-primary-700" : "text-gray-500"
                    }`}
                  >
                    شماره موبایل
                  </span>
                </div>

                <div
                  className={`flex-1 h-1.5 mx-4 rounded-full transition-all duration-500 ${
                    step >= 2 ? "bg-primary-500" : "bg-gray-200"
                  }`}
                ></div>

                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                      step >= 2
                        ? "bg-primary-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    <span className="text-lg font-medium">2</span>
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      step >= 2 ? "text-primary-700" : "text-gray-500"
                    }`}
                  >
                    تایید کد
                  </span>
                </div>
              </div>
            </div>

            <div className="transition-all duration-500 transform">
              {step === 1 ? (
                <div className="animate-fadeIn">
                  <SendOtp
                    timer={sendOtpTimer}
                    onSubmit={sendOTPHandler}
                    phoneNumber={phoneNumber}
                    onChange={phoneNumberHandler}
                    isLoading={isPending}
                    error={error}
                  />
                </div>
              ) : (
                <div className="animate-fadeIn">
                  <CheckOtp
                    onComplete={checkOTPHandler}
                    sendOtpTimer={sendOtpTimer}
                    checkOtpTimer={checkOtpTimer}
                    isChecking={isChecking}
                    onSubmit={checkOTPHandler}
                    backHandler={backHandler}
                    resendOtp={sendOTPHandler}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 py-4 px-8 text-center border-t border-gray-100">
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} شرکت خدمات گستر جزائری - تمامی حقوق
              محفوظ است
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
