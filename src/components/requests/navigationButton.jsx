import { MapPin, ExternalLink, X } from "lucide-react";
import React, { useState } from "react";

const apps = [
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
                          className="w-12 h-12 rounded-xl object-contain shadow-sm"
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
