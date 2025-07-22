"use client";
import React, { useRef, useEffect, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { Camera, X, RotateCcw } from "lucide-react";

const BarcodeScanner = ({ isOpen, onClose, onScan }) => {
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");
  const [cameras, setCameras] = useState([]);
  const [selectedCameraIndex, setSelectedCameraIndex] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isBrowser, setIsBrowser] = useState(false);
  const codeReader = useRef(null);

  useEffect(() => {
    setIsBrowser(typeof window !== "undefined");
  }, []);

  useEffect(() => {
    if (isBrowser && isOpen) {
      const timer = setTimeout(() => {
        if (
          typeof window !== "undefined" &&
          window.navigator &&
          window.navigator.mediaDevices
        ) {
          console.log("Browser environment ready for camera access");
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isBrowser, isOpen]);

  useEffect(() => {
    if (isOpen && isBrowser) {
      startScanning();
    } else {
      stopScanning();
      setSelectedCameraIndex(0);
      setCameras([]);
      setIsInitialLoad(true);
    }

    return () => {
      stopScanning();
    };
  }, [isOpen, isBrowser]);

  useEffect(() => {
    if (isOpen && isBrowser && cameras.length > 0 && !isInitialLoad) {
      stopScanning();
      setTimeout(() => {
        startScanning();
      }, 100);
    }
  }, [selectedCameraIndex, isBrowser]);

  const startScanning = async () => {
    try {
      setError("");
      setIsScanning(true);

      if (!isBrowser || typeof window === "undefined") {
        throw new Error("این ویژگی فقط در محیط مرورگر قابل استفاده است.");
      }

      if (
        !navigator ||
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        throw new Error(
          "دسترسی به دوربین در دسترس نیست. لطفاً اطمینان حاصل کنید که مرورگر شما از دسترسی به دوربین پشتیبانی می‌کند."
        );
      }

      const isLocalhost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname === "0.0.0.0" ||
        window.location.hostname.includes("localhost");

      const isHttps = window.location.protocol === "https:";
      const isFileProtocol = window.location.protocol === "file:";

      // if (!isHttps && !isLocalhost && !isFileProtocol) {
      //   throw new Error("دسترسی به دوربین نیازمند اتصال امن (HTTPS) است.");
      // }

      if (!codeReader.current) {
        codeReader.current = new BrowserMultiFormatReader();
      }

      let videoInputDevices = [];
      let selectedDeviceId = undefined;

      try {
        // Try to enumerate devices
        videoInputDevices = await codeReader.current.listVideoInputDevices();

        if (videoInputDevices.length === 0) {
          throw new Error("هیچ دوربینی در این دستگاه یافت نشد");
        }

        setCameras(videoInputDevices);

        if (isInitialLoad) {
          setIsInitialLoad(false);
          // Find back camera with "facing back" in label and set as default
          const backCameraIndex = videoInputDevices.findIndex(
            (device) =>
              device.label.toLowerCase().includes("facing back") ||
              device.label.toLowerCase().includes("back") ||
              device.label.toLowerCase().includes("environment")
          );

          if (backCameraIndex !== -1) {
            setSelectedCameraIndex(backCameraIndex);
            selectedDeviceId = videoInputDevices[backCameraIndex].deviceId;
          } else {
            selectedDeviceId = videoInputDevices[0].deviceId;
          }
        } else {
          console.log(videoInputDevices);
          if (videoInputDevices.length > selectedCameraIndex) {
            selectedDeviceId = videoInputDevices[selectedCameraIndex].deviceId;
          } else {
            const backCamera = videoInputDevices.find(
              (device) =>
                device.label.toLowerCase().includes("facing back") ||
                device.label.toLowerCase().includes("back") ||
                device.label.toLowerCase().includes("environment")
            );
            selectedDeviceId = backCamera
              ? backCamera.deviceId
              : videoInputDevices[0].deviceId;
          }
        }
      } catch (enumerationError) {
        console.warn(
          "Device enumeration failed, using default camera:",
          enumerationError
        );
        // Fallback: use default camera without enumeration
        setCameras([{ deviceId: "default", label: "Default Camera" }]);
        setIsInitialLoad(false);
        selectedDeviceId = undefined; // Use default camera
      }

      // Additional check before starting video decode
      if (!videoRef.current) {
        throw new Error("عنصر ویدئو آماده نیست. لطفاً دوباره تلاش کنید.");
      }

      await codeReader.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, error) => {
          if (result) {
            console.log("Barcode detected:", result.getText());
            onScan(result.getText());
            stopScanning();
            onClose();
          }
          if (error && error.name !== "NotFoundException") {
            console.error("Scanning error:", error);
          }
        }
      );
    } catch (err) {
      console.error("Error starting scanner:", err);

      let errorMessage = "راه‌اندازی دوربین با خطا مواجه شد";

      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        errorMessage =
          "دسترسی به دوربین رد شد. لطفاً دسترسی به دوربین را مجاز کنید و دوباره تلاش کنید.";
      } else if (
        err.name === "NotFoundError" ||
        err.name === "DevicesNotFoundError"
      ) {
        errorMessage = "هیچ دوربینی در این دستگاه یافت نشد.";
      } else if (err.name === "NotSupportedError") {
        errorMessage = "دوربین در این دستگاه یا مرورگر پشتیبانی نمی‌شود.";
      } else if (
        err.name === "NotReadableError" ||
        err.name === "TrackStartError"
      ) {
        errorMessage = "دوربین توسط برنامه دیگری در حال استفاده است.";
      } else if (err.name === "SecurityError") {
        errorMessage =
          "دسترسی به دوربین به دلایل امنیتی مسدود شده است. لطفاً از HTTPS استفاده کنید.";
      } else if (err.message && err.message.includes("getUserMedia")) {
        errorMessage =
          "API دوربین در این محیط پشتیبانی نمی‌شود. لطفاً در مرورگر دیگری تست کنید.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setIsScanning(false);
    }
  };
  console.log("cameras", cameras);

  // useEffect(() => {
  //   if (cameras.length > 0) {
  //     alert(JSON.stringify(cameras));
  //   }
  // }, [cameras]);

  const stopScanning = () => {
    if (codeReader.current) {
      codeReader.current.reset();
    }
    setIsScanning(false);
  };

  const switchCamera = async () => {
    if (cameras.length <= 1) return;

    // Don't try to switch if we're using default camera fallback
    if (cameras.length === 1 && cameras[0].deviceId === "default") return;

    const nextIndex = (selectedCameraIndex + 1) % cameras.length;
    setSelectedCameraIndex(nextIndex);
  };

  const getCameraLabel = (index) => {
    if (!cameras[index]) return "";

    if (cameras[index].deviceId === "default") return "دوربین پیش‌فرض";

    const label = cameras[index].label.toLowerCase();
    if (
      label.includes("facing back") ||
      label.includes("back") ||
      label.includes("environment")
    )
      return "عقب";
    if (
      label.includes("facing front") ||
      label.includes("front") ||
      label.includes("user")
    )
      return "جلو";
    return `دوربین ${index + 1}`;
  };

  if (!isOpen) return null;

  if (!isBrowser) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-2xl w-full max-w-md mx-auto shadow-2xl border border-neutral-200 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-neutral-200 bg-neutral-50">
          <h2 className="text-lg font-semibold text-text flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary-500" />
            اسکن بارکد
          </h2>
          <div className="flex items-center gap-2">
            {cameras.length > 1 && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  switchCamera();
                }}
                className="flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200 transition-colors text-sm font-medium"
                disabled={!isScanning}
              >
                <RotateCcw size={16} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <X size={20} className="text-neutral-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {error ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-error-500" />
              </div>
              <div className="text-error-500 mb-4 font-medium">{error}</div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  startScanning();
                }}
                className="bg-primary-500 text-white px-6 py-2.5 rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                تلاش مجدد
              </button>
            </div>
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-64 bg-neutral-900 rounded-xl object-cover"
                autoPlay
                playsInline
                muted
              />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-accent-500 rounded-lg shadow-lg -mt-14">
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-accent-500"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-accent-500"></div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-accent-500"></div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-accent-500"></div>
                </div>
              </div>
              <div className="text-center mt-4 text-neutral-600 font-medium">
                بارکد را درون قاب زرد قرار دهید
              </div>
              {cameras.length > 0 &&
                !(
                  cameras.length === 1 && cameras[0].deviceId === "default"
                ) && (
                  <div className="text-center mt-2 text-sm text-neutral-500">
                    دوربین فعلی: {getCameraLabel(selectedCameraIndex)}
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
