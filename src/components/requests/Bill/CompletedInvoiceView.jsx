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
} from "lucide-react";
import { useRequests } from "@/context/RequestsContext";

const options = {
  filename: "invoice.pdf",
  // default is `save`
  method: "save",
  // default is Resolution.MEDIUM = 3, which should be enough, higher values
  // increases the image quality but also the size of the PDF, so be careful
  // using values higher than 10 when having multiple pages generated, it
  // might cause the page to crash or hang.
  resolution: Resolution.HIGH,
  page: {
    // margin is in MM, default is Margin.NONE = 0
    margin: Margin.SMALL,
    // default is 'A4'
    format: "A4",
    // default is 'portrait'
    orientation: "portrait",
  },
  canvas: {
    // default is 'image/jpeg' for better size performance
    mimeType: "image/png",
    qualityRatio: 1,
  },
  // Customize any value passed to the jsPDF instance and html2canvas
  // function. You probably will not need this and things can break,
  // so use with caution.
  overrides: {
    // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
    pdf: {
      compress: true,
    },
    // see https://html2canvas.hertzen.com/configuration for more options
    canvas: {
      useCORS: true,
    },
  },
};

const CompletedInvoiceView = ({
  invoiceData,
  invoiceItems,
  isGettingInvoiceData,
  handleClose,
}) => {
  const targetRef = useRef();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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
        .pdf-generation-mode .md\\:grid-cols-2 {
          grid-template-columns: repeat(2, 1fr) !important;
        }
        .pdf-generation-mode .overflow-x-auto {
          overflow-x: visible !important;
        }
        .pdf-generation-mode table {
          width: 100% !important;
          font-size: 12px !important;
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
    <div className="h-full overflow-y-auto p-4 sm:p-6 max-h-[70vh] relative">
      <div
        className="max-w-4xl mx-auto bg-white rounded-lg border border-neutral-200 p-6"
        ref={targetRef}
      >
        <div className="max-w-4xl mx-auto bg-white rounded-lg border border-neutral-200 p-6 ">
          <div className="text-center mb-6 pb-4 border-b border-neutral-200">
            <h2 className="text-2xl font-bold text-neutral-800 mb-2">
              فاکتور خدمات
            </h2>
            <p className="text-neutral-600">شرکت خدمات فنی</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-neutral-500" />
                <span className="text-sm text-neutral-600">نام مشتری:</span>
                <span className="font-medium">{customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-neutral-500" />
                <span className="text-sm text-neutral-600">شماره موبایل:</span>
                <span className="font-medium">{invoiceData.mobile}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral-500" />
                <span className="text-sm text-neutral-600">تاریخ:</span>
                <span className="font-medium">
                  {new Date(invoiceData.date * 1000).toLocaleDateString(
                    "fa-IR",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-neutral-500" />
                <span className="text-sm text-neutral-600">تعداد دستگاه:</span>
                <span className="font-medium">{invoiceData.device_count}</span>
              </div>
            </div>
          </div>

          {tasks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-neutral-800 mb-3 flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                خدمات ارائه شده
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-neutral-300">
                  <thead>
                    <tr className="bg-neutral-50">
                      <th className="border border-neutral-300 px-4 py-2 text-right">
                        ردیف
                      </th>
                      <th className="border border-neutral-300 px-4 py-2 text-right">
                        عنوان خدمت
                      </th>
                      <th className="border border-neutral-300 px-4 py-2 text-right">
                        تعداد
                      </th>
                      <th className="border border-neutral-300 px-4 py-2 text-right">
                        قیمت واحد
                      </th>
                      <th className="border border-neutral-300 px-4 py-2 text-right">
                        قیمت کل
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((t, index) => (
                      <tr key={t.id}>
                        <td className="border border-neutral-300 px-4 py-2">
                          {index + 1}
                        </td>
                        <td className="border border-neutral-300 px-4 py-2">
                          {t?.title}
                        </td>
                        <td className="border border-neutral-300 px-4 py-2">
                          {t?.quantity}
                        </td>
                        <td className="border border-neutral-300 px-4 py-2">
                          {t?.unit_price?.toLocaleString()} تومان
                        </td>
                        <td className="border border-neutral-300 px-4 py-2">
                          {t?.total_price?.toLocaleString()} تومان
                          {t?.used_guarantee_reason && (
                            <span className="text-xs text-neutral-500 mr-1">
                              ({t?.used_guarantee_reason})
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {parts.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-neutral-800 mb-3 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                قطعات استفاده شده
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-neutral-300">
                  <thead>
                    <tr className="bg-neutral-50">
                      <th className="border border-neutral-300 px-4 py-2 text-right">
                        ردیف
                      </th>
                      <th className="border border-neutral-300 px-4 py-2 text-right">
                        نام قطعه
                      </th>
                      <th className="border border-neutral-300 px-4 py-2 text-right">
                        تعداد
                      </th>
                      <th className="border border-neutral-300 px-4 py-2 text-right">
                        قیمت واحد
                      </th>
                      <th className="border border-neutral-300 px-4 py-2 text-right">
                        قیمت کل
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {parts.map((p, index) => (
                      <tr key={p.id}>
                        <td className="border border-neutral-300 px-4 py-2">
                          {index + 1}
                        </td>
                        <td className="border border-neutral-300 px-4 py-2">
                          {p.title}
                        </td>
                        <td className="border border-neutral-300 px-4 py-2">
                          {p?.quantity}
                        </td>
                        <td className="border border-neutral-300 px-4 py-2">
                          {p?.unit_price.toLocaleString()} تومان
                        </td>
                        <td className="border border-neutral-300 px-4 py-2">
                          {p?.total_price.toLocaleString()} تومان
                          {p?.used_guarantee_reason && (
                            <span className="text-xs text-neutral-500 mr-1">
                              ({p?.used_guarantee_reason})
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {invoiceData?.discount_percent ? (
            <div className="bg-primary-50 rounded-lg p-4 h-fit">
              <div className="text-xl font-bold text-primary-800">
                {invoiceData?.discount_percent}% تخفیف در جشنواره{" "}
                {invoiceData?.discount_reason_title}
              </div>
            </div>
          ) : null}
          <div className="border-t border-neutral-200 pt-4 mb-6">
            <div className="flex justify-between">
              {invoiceData?.signature_img !== "" ? (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-neutral-700 mb-2">
                    امضای مشتری:
                  </h4>
                  <div className="border border-neutral-300 rounded-lg p-4 bg-neutral-50">
                    <img
                      src={invoiceData?.signature_img}
                      alt="امضای مشتری"
                      className="max-h-20 mx-auto"
                    />
                  </div>
                </div>
              ) : null}
              <div className="bg-primary-50 rounded-lg p-4 h-fit">
                <div className="text-xl font-bold text-primary-800">
                  مبلغ کل: {invoiceData?.total_price?.toLocaleString()} تومان
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="flex justify-center absolute top-0 left-0">
        <button
          onClick={handleGeneratePDF}
          disabled={isGeneratingPDF}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
            isGeneratingPDF
              ? "bg-primary-400 cursor-not-allowed"
              : "bg-primary-500 hover:bg-primary-600"
          } text-white shadow-lg`}
        >
          {isGeneratingPDF ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>در حال تولید PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>دانلود PDF</span>
            </>
          )}
        </button>
      </div> */}
    </div>
  );
};

export default CompletedInvoiceView;
