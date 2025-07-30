import { useEffect, useRef, useState } from "react";
import generatePDF, { Resolution, Margin } from "react-to-pdf";
import {
  Calendar,
  Download,
  Phone,
  ShoppingCart,
  User,
  Wrench,
  Loader2,
  Package,
  DollarSign,
  Hash,
  Tag,
} from "lucide-react";
import { useRequests } from "@/context/RequestsContext";

const options = {
  filename: "invoice.pdf",
  method: "save",
  resolution: Resolution.HIGH,
  page: {
    margin: Margin.SMALL,
    format: "A4",
    orientation: "portrait",
  },
  canvas: {
    mimeType: "image/png",
    qualityRatio: 1,
  },
  overrides: {
    pdf: {
      compress: true,
    },
    canvas: {
      useCORS: true,
    },
  },
};

// Service Card Component
const ServiceCard = ({ service, index }) => (
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
          {index + 1}
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
            {service?.title}
          </h4>
          <div className="flex items-center gap-1 mt-1">
            <Hash className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-500">
              تعداد: {service?.quantity}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-blue-600">
          {service?.total_price?.toLocaleString()}
          <span className="text-sm text-gray-500 mr-1">تومان</span>
        </div>
        <div className="text-xs text-gray-500">
          واحد: {service?.unit_price?.toLocaleString()} تومان
        </div>
      </div>
    </div>

    {service?.used_guarantee_reason && (
      <div className="bg-amber-100 border border-amber-200 rounded-lg p-2 mt-2">
        <div className="flex items-center gap-2">
          <Tag className="w-3 h-3 text-amber-600" />
          <span className="text-xs text-amber-700 font-medium">
            {service?.used_guarantee_reason}
          </span>
        </div>
      </div>
    )}
  </div>
);

// Part Card Component
const PartCard = ({ part, index }) => (
  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
          {index + 1}
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
            {part.title}
          </h4>
          <div className="flex items-center gap-1 mt-1">
            <Package className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-500">
              تعداد: {part?.quantity}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-green-600">
          {part?.total_price?.toLocaleString()}
          <span className="text-sm text-gray-500 mr-1">تومان</span>
        </div>
        <div className="text-xs text-gray-500">
          واحد: {part?.unit_price?.toLocaleString()} تومان
        </div>
      </div>
    </div>

    {part?.used_guarantee_reason && (
      <div className="bg-amber-100 border border-amber-200 rounded-lg p-2 mt-2">
        <div className="flex items-center gap-2">
          <Tag className="w-3 h-3 text-amber-600" />
          <span className="text-xs text-amber-700 font-medium">
            {part?.used_guarantee_reason}
          </span>
        </div>
      </div>
    )}
  </div>
);

// Summary Card Component
const SummaryCard = ({
  icon: Icon,
  label,
  value,
  className = "",
  textSize = "text-sm",
}) => (
  <div
    className={`bg-white border border-gray-200 rounded-lg p-3 ${className}`}
  >
    <div className="flex items-center gap-2 mb-1">
      <Icon className="w-4 h-4 text-gray-500" />
      <span className={`text-gray-600 ${textSize}`}>{label}</span>
    </div>
    <div className="font-semibold text-gray-800">{value}</div>
  </div>
);

const CompletedInvoiceView = ({ handleClose }) => {
  const {
    selectedRequest,
    isGettingInvoiceData,
    invoiceData,
    invoiceItems,
    fetchInvoiceData,
  } = useRequests();
  const targetRef = useRef();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    fetchInvoiceData(selectedRequest.id);
  }, [selectedRequest.id]);

  if (isGettingInvoiceData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary-500 mx-auto mb-3" />
          <p className="text-sm text-neutral-600">
            در حال بارگذاری اطلاعات فاکتور...
          </p>
        </div>
      </div>
    );
  }

  const tasks = invoiceItems.filter((item) => item.type === "task");
  const parts = invoiceItems.filter((item) => item.type === "part");
  const customerName = invoiceData.first_name + " " + invoiceData.last_name;

  const handleGeneratePDF = async () => {
    const element = targetRef.current;
    if (!element || isGeneratingPDF) return;

    setIsGeneratingPDF(true);

    try {
      const originalStyles = {
        width: element.style.width,
        maxWidth: element.style.maxWidth,
        transform: element.style.transform,
        transformOrigin: element.style.transformOrigin,
      };

      element.style.width = "210mm";
      element.style.maxWidth = "210mm";
      element.style.transform = "scale(1)";
      element.style.transformOrigin = "top left";

      element.classList.add("pdf-generation-mode");

      const tempStyle = document.createElement("style");
      tempStyle.id = "pdf-temp-styles";
      tempStyle.innerHTML = `
        .pdf-generation-mode {
          width: 210mm !important;
          max-width: 210mm !important;
          font-size: 14px !important;
        }
        .pdf-generation-mode .grid {
          display: grid !important;
        }
        .pdf-generation-mode .sm\\:grid-cols-2 {
          grid-template-columns: repeat(2, 1fr) !important;
        }
        .pdf-generation-mode .service-card,
        .pdf-generation-mode .part-card {
          break-inside: avoid !important;
          margin-bottom: 8px !important;
        }
        .pdf-generation-mode .text-sm {
          font-size: 12px !important;
        }
        .pdf-generation-mode .text-lg {
          font-size: 16px !important;
        }
        .pdf-generation-mode .text-xl {
          font-size: 18px !important;
        }
        .pdf-generation-mode .text-2xl {
          font-size: 22px !important;
        }
      `;
      document.head.appendChild(tempStyle);

      try {
        await new Promise((resolve) => setTimeout(resolve, 100));

        await generatePDF(targetRef, {
          ...options,
          canvas: {
            ...options.canvas,
            scale: 2,
            width: 794,
            height: 1123,
          },
          page: {
            ...options.page,
            format: "a4",
            orientation: "portrait",
            margin: Margin.SMALL,
          },
        });
      } finally {
        element.style.width = originalStyles.width;
        element.style.maxWidth = originalStyles.maxWidth;
        element.style.transform = originalStyles.transform;
        element.style.transformOrigin = originalStyles.transformOrigin;

        element.classList.remove("pdf-generation-mode");
        const tempStyleElement = document.getElementById("pdf-temp-styles");
        if (tempStyleElement) {
          document.head.removeChild(tempStyleElement);
        }
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-3 sm:p-6 max-h-[70vh] relative">
      <div
        className="max-w-4xl mx-auto bg-white rounded-lg border border-neutral-200 p-4 sm:p-6"
        ref={targetRef}
      >
        <div className="text-center mb-6 pb-4 border-b border-neutral-200">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-2">
            فاکتور خدمات
          </h2>
          <p className="text-sm sm:text-base text-neutral-600">
            شرکت خدمات گشتر جزائری
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <SummaryCard
            icon={User}
            label="نام مشتری"
            value={customerName}
            className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
          />
          <SummaryCard
            icon={Phone}
            label="شماره موبایل"
            value={invoiceData.mobile}
            className="bg-gradient-to-r from-green-50 to-green-100 border-green-200"
          />
          <SummaryCard
            icon={Calendar}
            label="تاریخ"
            value={new Date(invoiceData.date * 1000).toLocaleDateString(
              "fa-IR",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
            className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200"
          />
          <SummaryCard
            icon={DollarSign}
            label="مبلغ کل"
            value={`${invoiceData?.total_price?.toLocaleString()} تومان`}
            className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 sm:col-span-1"
            textSize="text-base"
          />
        </div>

        {invoiceData?.discount_percent && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-red-800">تخفیف ویژه</h3>
            </div>
            <div className="text-red-700">
              <span className="font-bold text-lg">
                {invoiceData?.discount_percent}%
              </span>
              <span className="mr-2">
                تخفیف در جشنواره {invoiceData?.discount_reason_title}
              </span>
            </div>
          </div>
        )}

        {tasks.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <Wrench className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-bold text-gray-800">
                خدمات ارائه شده
              </h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                {tasks.length} مورد
              </span>
            </div>
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <ServiceCard key={task.id} service={task} index={index} />
              ))}
            </div>
          </div>
        )}

        {parts.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <ShoppingCart className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-bold text-gray-800">
                قطعات استفاده شده
              </h3>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                {parts.length} مورد
              </span>
            </div>
            <div className="space-y-3">
              {parts.map((part, index) => (
                <PartCard key={part.id} part={part} index={index} />
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-neutral-200 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            {invoiceData?.signature_img && (
              <div className="w-full sm:w-auto">
                <h4 className="text-sm font-medium text-neutral-700 mb-3">
                  امضای مشتری:
                </h4>
                <div className="border border-neutral-300 rounded-lg p-4 bg-neutral-50 max-w-xs">
                  <img
                    src={invoiceData?.signature_img}
                    alt="امضای مشتری"
                    className="max-h-20 mx-auto"
                  />
                </div>
              </div>
            )}

            <div className="w-full sm:w-auto">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl p-4 text-center shadow-lg">
                <div className="text-sm opacity-90 mb-1">مبلغ نهایی</div>
                <div className="text-xl sm:text-2xl font-bold">
                  {invoiceData?.total_price?.toLocaleString()}
                  <span className="text-sm mr-1">تومان</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedInvoiceView;
