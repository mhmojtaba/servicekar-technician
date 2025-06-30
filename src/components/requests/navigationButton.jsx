"use client";
import React, { useState } from "react";
import { MapPin, ExternalLink, X } from "lucide-react";

const apps = [
  {
    name: "نشان",
    logo: "data:image/png;base64,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",
    scheme: (lat, lng) => `https://nshn.ir/?lat=${lat}&lng=${lng}`,
    fallback: (lat, lng) => `https://nshn.ir/?lat=${lat}&lng=${lng}`,
    color: "bg-primary-500",
  },
  {
    name: "بلد",
    logo: "https://cdn.balad.ir/public/_next/static/media/balad.5cb3184921efa5fc201eee128bef55bc.svg",
    scheme: (lat, lng) => `waze://?ll=${lat},${lng}&navigate=yes`,
    fallback: (lat, lng) =>
      `https://balad.ir/directions/driving?destination=${encodeURIComponent(`${lng},${lat}`)}`,
    color: "bg-primary-500",
  },
  {
    name: "گوگل مپ",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Google_Maps_icon_%282020%29.svg/627px-Google_Maps_icon_%282020%29.svg.png",
    scheme: (lat, lng) =>
      `comgooglemaps://?daddr=${lat},${lng}&directionsmode=driving`,
    fallback: (lat, lng) => {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
      window.open(url, "_blank");
    },
    color: "bg-error-500",
  },
];

const NavigationModal = ({ lat, lng, disabled }) => {
  const [open, setOpen] = useState(false);
  const [openingApp, setOpeningApp] = useState(null);

  const openNavigationApp = async (app) => {
    setOpeningApp(app.name);

    try {
      const appUrl = app.scheme(lat, lng);
      const fallbackUrl = app.fallback(lat, lng);

      const link = document.createElement("a");
      link.href = appUrl;
      link.style.display = "none";
      document.body.appendChild(link);

      const fallbackTimeout = setTimeout(() => {
        window.open(fallbackUrl, "_blank");
        setOpeningApp(null);
      }, 2000);

      link.click();

      setTimeout(() => {
        if (document.visibilityState === "visible") {
          clearTimeout(fallbackTimeout);
          window.open(fallbackUrl, "_blank");
        }
        setOpeningApp(null);
        document.body.removeChild(link);
      }, 1000);

      const handleVisibilityChange = () => {
        if (document.visibilityState === "hidden") {
          clearTimeout(fallbackTimeout);
          setOpeningApp(null);
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      setTimeout(() => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      }, 3000);
    } catch (error) {
      console.error("Error opening navigation app:", error);
      window.open(app.fallback(lat, lng), "_blank");
      setOpeningApp(null);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`w-full h-12 flex items-center justify-center gap-2 px-4 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-xl border border-primary-200 transition-all duration-200 text-sm font-medium hover:shadow-sm ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={disabled}
      >
        <MapPin className="w-4 h-4" />
        مسیریابی
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-surface rounded-2xl w-full max-w-md shadow-2xl border border-neutral-200 overflow-hidden transform transition-all duration-300 animate-fadeIn">
            <div className="bg-gradient-to-r from-primary-50 via-white to-primary-50 px-6 py-5 border-b border-neutral-100 relative">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 left-4 p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-text mb-1">
                  انتخاب اپلیکیشن مسیریابی
                </h2>
                <p className="text-neutral-500 text-sm">
                  اپلیکیشن مورد نظر خود را انتخاب کنید
                </p>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-3 mb-6">
                {apps.map((app) => (
                  <button
                    key={app.name}
                    onClick={() => openNavigationApp(app)}
                    disabled={openingApp === app.name}
                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-neutral-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {openingApp === app.name ? (
                      <div className="w-12 h-12 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
                      </div>
                    ) : (
                      <div className="relative flex-shrink-0">
                        <img
                          src={app.logo}
                          alt={app.name}
                          className="w-12 rounded-xl object-contain shadow-sm"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                        <div
                          className={`w-12 h-12 rounded-xl ${app.color} hidden items-center justify-center shadow-sm`}
                        >
                          <ExternalLink className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    )}

                    <div className="flex-1 text-right">
                      <h3 className="font-semibold text-text group-hover:text-primary-700 transition-colors">
                        {app.name}
                      </h3>
                      <p className="text-sm text-neutral-500">
                        {openingApp === app.name
                          ? "در حال اتصال..."
                          : "کلیک برای باز کردن"}
                      </p>
                    </div>

                    <div className="flex-shrink-0">
                      <ExternalLink className="w-5 h-5 text-neutral-400 group-hover:text-primary-500 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>

              <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-primary-500 rounded-lg flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-primary-700 mb-1">
                      نحوه کار مسیریابی
                    </h4>
                    <p className="text-xs text-primary-600 leading-relaxed">
                      اگر اپلیکیشن روی دستگاه شما نصب باشد، مستقیماً باز می‌شود.
                      در غیر این صورت نسخه وب آن باز خواهد شد.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="w-full py-3 text-center bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-sm font-medium transition-colors"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationModal;
