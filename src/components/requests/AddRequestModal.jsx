"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { ChevronDown, Loader2 } from "lucide-react";
import Select from "react-select";
import {
  FaTimes,
  FaUpload,
  FaTrash,
  FaSpinner,
  FaImage,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { toast } from "react-toastify";

import { useRequests } from "@/context/RequestsContext";
import {
  preventArrowKeyChange,
  selectOptionsGenerator,
  uploadFile,
} from "@/utils/utils";
import { customSelectStyles } from "@/styles/customeStyles";
import { useAuth } from "@/context/AuthContext";

const MapSection = dynamic(
  () => import("@/components/SelectLocation/MapSection"),
  {
    loading: () => (
      <div className="flex items-center justify-center h-[250px] sm:h-[350px] md:h-[400px] bg-neutral-100">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary-500 mx-auto mb-2" />
          <p className="text-sm text-neutral-600">بارگذاری نقشه...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);

const AddRequestModal = ({ isOpen, onClose }) => {
  const { token } = useAuth();
  const {
    service,
    requester_type,
    operation_type,
    addUpdateRequests,
    isUpdating,
    selectedRequest,
    getAddressWithMobile,
    suggestedAddresses,
    setSuggestedAddresses,
    selectedAddress,
    setSelectedAddress,
    isGettingAddress,
    reasonBlock,
    brands,
    brand_models,
    getDeviceWithBarcode,
  } = useRequests();

  const [isBlocked, setIsBlocked] = useState(false);

  const [requestData, setRequestData] = useState({
    id_service: null,
    requester_type: null,
    operation_type: null,
    address: "",
    device_count: 1,
    mobile: "",
    first_name: "",
    last_name: "",
    national_id: "",
    birth_date: "",
    phone: "",
    img: null,
    install_date: "",
    manufacturer_serial: "",
    manufacturer_acceptance_code: "",
    barcode: "",
    brand_id: null,
    model_id: null,
    install_location: "",
    usage_location: "",
    construction_status: "",
    install_as: "",
    building_area: "",
    postal_code: "",
    recommender_mobile: "",
    description: "",
  });

  const [location, setLocation] = useState([32.644397, 51.667455]);
  const [imageUploadState, setImageUploadState] = useState({
    isUploading: false,
    previewUrl: null,
    error: null,
  });

  const [errors, setErrors] = useState({
    id_service: false,
    requester_type: false,
    operation_type: false,
    address: false,
    location: false,
    mobile: false,
    first_name: false,
    last_name: false,
  });

  const install_as_options = [
    { value: "اولین", label: "اولین" },
    { value: "جایگزین", label: "جایگزین" },
  ];

  const [openSection, setOpenSection] = useState("service");
  const sectionKeys = ["personal", "service", "device", "image", "location"];

  const handleSectionToggle = (key) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  const brandOptions = useMemo(() => {
    if (requestData.id_service) {
      const brandsFound = brands.filter(
        (brand) => brand.id_service == requestData.id_service
      );
      return brandsFound.length > 0 ? selectOptionsGenerator(brandsFound) : [];
    }
    return [];
  }, [requestData.id_service, brands]);

  const modelOptions = useMemo(() => {
    if (requestData.brand_id) {
      const modelsFound = brand_models.filter(
        (model) => model.id_parent == requestData.brand_id
      );
      return modelsFound.length > 0 ? selectOptionsGenerator(modelsFound) : [];
    }
    return [];
  }, [requestData.brand_id, brand_models]);

  const handleServiceChange = (e) => {
    setRequestData((prev) => ({
      ...prev,
      id_service: e.value,
      brand_id: null,
      model_id: null,
    }));
  };

  const handleBrandChange = (e) => {
    setRequestData((prev) => ({
      ...prev,
      brand_id: e.value,
      model_id: null,
    }));
  };

  const serviceOptions = selectOptionsGenerator(service);
  // const isEditMode = selectedRequest ? true : false;

  // useEffect(() => {
  //   if (selectedRequest && isOpen) {
  //     setRequestData({
  //       id_service: selectedRequest.id_service || null,
  //       requester_type: selectedRequest.requester_type || null,
  //       operation_type: selectedRequest.operation_type || null,
  //       address: selectedRequest.address || "",
  //       device_count: 1,
  //       mobile: selectedRequest.mobile || "",
  //       first_name: selectedRequest.first_name || "",
  //       last_name: selectedRequest.last_name || "",
  //       img: selectedRequest.img || null,
  //       install_date: selectedRequest.install_date || "",
  //       national_id: selectedRequest.national_id || "",
  //       birth_date: selectedRequest.birth_date || "",
  //       phone: selectedRequest.phone || "",
  //       manufacturer_serial: selectedRequest.manufacturer_serial || "",
  //       manufacturer_acceptance_code:
  //         selectedRequest.manufacturer_acceptance_code || "",
  //       barcode: selectedRequest.barcode || "",
  //       brand_id: selectedRequest.brand_id || null,
  //       model_id: selectedRequest.model_id || null,
  //       install_location: selectedRequest.install_location || "",
  //       usage_location: selectedRequest.usage_location || "",
  //       construction_status: selectedRequest.construction_status || "",
  //       install_as: selectedRequest.install_as || "",
  //       building_area: selectedRequest.building_area || "",
  //       postal_code: selectedRequest.postal_code || "",
  //     });
  //     setLocation([
  //       selectedRequest.latitude || 32.644397,
  //       selectedRequest.longitude || 51.667455,
  //     ]);
  //     setImageUploadState({
  //       isUploading: false,
  //       previewUrl: selectedRequest.img || null,
  //       error: null,
  //     });
  //   } else if (!selectedRequest && isOpen) {
  //     setRequestData({
  //       id_service: null,
  //       requester_type: null,
  //       operation_type: null,
  //       address: "",
  //       device_count: 1,
  //       mobile: "",
  //       first_name: "",
  //       last_name: "",
  //       img: null,
  //       install_date: "",
  //       national_id: "",
  //       birth_date: "",
  //       phone: "",
  //       manufacturer_serial: "",
  //       manufacturer_acceptance_code: "",
  //       barcode: "",
  //       brand_id: null,
  //       model_id: null,
  //       install_location: "",
  //       usage_location: "",
  //       construction_status: "",
  //       install_as: "",
  //       building_area: "",
  //       postal_code: "",
  //     });
  //     setLocation([32.644397, 51.667455]);
  //     setImageUploadState({
  //       isUploading: false,
  //       previewUrl: null,
  //       error: null,
  //     });
  //   }
  // }, [selectedRequest, isOpen]);

  useEffect(() => {
    const checkMobileStatus = async () => {
      if (requestData.mobile && errors.mobile === false) {
        try {
          const data = {
            mobile: requestData?.mobile,
            id_service: requestData?.id_service,
          };
          const res = await getAddressWithMobile(data);
          if (res?.msg === 2) {
            setIsBlocked(true);
          } else {
            setIsBlocked(false);
          }
        } catch (error) {
          console.error("Error checking mobile status:", error);
          setIsBlocked(false);
        }
      } else {
        setSuggestedAddresses([]);
        setIsBlocked(false);
      }
    };

    checkMobileStatus();
  }, [requestData.mobile, errors.mobile]);

  useEffect(() => {
    const getDeviceDataWithBarcode = async () => {
      if (requestData.barcode) {
        const res = await getDeviceWithBarcode(requestData.barcode);

        if (res?.msg === 0) {
          setRequestData((prev) => ({
            ...prev,
            id_service: res?.data?.id_service,
            brand_id: res?.data?.brand_id,
            model_id: res?.data?.model_id,
            requester_type: res?.data?.requester_type,
          }));
        }
      }
    };
    getDeviceDataWithBarcode();
  }, [requestData.barcode]);

  useEffect(() => {
    if (selectedAddress !== null) {
      setRequestData((prev) => ({
        ...prev,
        id_service: selectedAddress?.id_service || null,
        requester_type: selectedAddress?.requester_type || null,
        operation_type: selectedAddress?.operation_type || null,
        first_name: selectedAddress?.first_name || "",
        last_name: selectedAddress?.last_name || "",
        address: selectedAddress?.address || "",
        barcode: selectedAddress?.barcode || "",
        brand_id: selectedAddress?.brand_id || null,
        model_id: selectedAddress?.model_id || null,
        install_location: selectedAddress?.install_location || "",
        usage_location: selectedAddress?.usage_location || "",
        construction_status: selectedAddress?.construction_status || "",
        install_as: selectedAddress?.install_as || "",
        building_area: selectedAddress?.building_area || "",
        postal_code: selectedAddress?.postal_code || "",
        recommender_mobile: selectedAddress?.recommender_mobile || "",
        img: selectedAddress?.img || null,
        install_date: selectedAddress?.install_date || "",
        national_id: selectedAddress?.national_id || "",
        birth_date: selectedAddress?.birth_date || "",
        phone: selectedAddress?.phone || "",
        manufacturer_serial: selectedAddress?.manufacturer_serial || "",
        manufacturer_acceptance_code:
          selectedAddress?.manufacturer_acceptance_code || "",
        mobile: selectedAddress?.mobile || "",
        description: selectedAddress?.description || "",
      }));
      setLocation([
        selectedAddress.latitude || 32.644397,
        selectedAddress.longitude || 51.667455,
      ]);
      setImageUploadState({
        isUploading: false,
        previewUrl: selectedAddress?.img || null,
        error: null,
      });
    }
  }, [selectedAddress]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageUploadState((prev) => ({
        ...prev,
        error: "لطفا فقط فایل تصویری انتخاب کنید",
      }));
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setImageUploadState((prev) => ({
        ...prev,
        error: "حجم فایل باید کمتر از 15 مگابایت باشد",
      }));
      return;
    }

    setImageUploadState((prev) => ({
      ...prev,
      isUploading: true,
      error: null,
    }));

    try {
      const { data: response } = await uploadFile(file, token);

      if (response.msg === 0 && response.path) {
        setRequestData((prev) => ({
          ...prev,
          img: response.path,
        }));
        setImageUploadState({
          isUploading: false,
          previewUrl: response.path,
          error: null,
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setImageUploadState({
        isUploading: false,
        previewUrl: null,
        error: "خطا در آپلود فایل. لطفا دوباره تلاش کنید.",
      });
    }
  };

  const handleImageRemove = () => {
    setRequestData((prev) => ({
      ...prev,
      img: null,
    }));
    setImageUploadState({
      isUploading: false,
      previewUrl: null,
      error: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("لطفا تمام فیلدهای اجباری را تکمیل کنید");
      return;
    }

    if (isBlocked) {
      toast.error("این شماره موبایل مسدود شده است");
      return;
    }

    try {
      const res = await addUpdateRequests({
        ...requestData,
        location: { lat: location[0], lng: location[1] },
        registered_by_type: "technician",
      });

      if (res?.msg === 0) {
        handleClose();
      }
    } catch (error) {
      console.error(error);
      toast.error("خطا در ثبت درخواست. لطفا دوباره تلاش کنید");
    }
  };

  const validateForm = () => {
    let valid = true;
    if (
      !requestData.first_name ||
      !requestData.last_name ||
      !requestData.mobile ||
      !requestData.id_service ||
      !requestData.operation_type ||
      !requestData.address ||
      !requestData.requester_type ||
      isUpdating ||
      errors.mobile
    ) {
      valid = false;
    }
    return valid;
  };

  const handleClose = () => {
    setRequestData({
      id_service: null,
      requester_type: null,
      operation_type: null,
      address: "",
      device_count: 1,
      mobile: "",
      first_name: "",
      last_name: "",
      img: null,
      install_date: "",
      national_id: "",
      birth_date: "",
      phone: "",
      manufacturer_serial: "",
      manufacturer_acceptance_code: "",
      barcode: "",
      brand_id: null,
      model_id: null,
      install_location: "",
      usage_location: "",
      construction_status: "",
      install_as: "",
      building_area: "",
      postal_code: "",
      description: "",
    });
    setLocation([32.644397, 51.667455]);
    setImageUploadState({
      isUploading: false,
      previewUrl: null,
      error: null,
    });
    setErrors({
      id_service: false,
      requester_type: false,
      operation_type: false,
      address: false,
      location: false,
      device_count: false,
      mobile: false,
      first_name: false,
      last_name: false,
    });
    setOpenSection("service");
    onClose();
  };

  const selectStyles = {
    ...customSelectStyles,
    control: (provided, state) => ({
      ...provided,
      minHeight: "48px",
      borderRadius: "12px",
      borderColor: state.isFocused ? "#3D8BFF" : "#CBD5E1",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(61, 139, 255, 0.1)" : "none",
      "&:hover": {
        borderColor: "#3D8BFF",
      },
    }),
  };

  if (!isOpen) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/70 backdrop-blur-md p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl mx-auto relative max-h-[95vh] flex flex-col overflow-hidden"
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-gradient-to-l from-primary-500 to-primary-600 text-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">ثبت درخواست جدید</h3>
              <p className="text-primary-100 text-sm">
                فرم زیر را تکمیل کرده و درخواست را ثبت کنید
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-3 text-white/80 hover:text-white hover:bg-white/20 rounded-2xl transition-all duration-200 transform hover:scale-110"
              aria-label="بستن"
            >
              <FaTimes size={20} />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <DataWrapper
              title="اطلاعات سرویس"
              description="نوع سرویس، برند و مدل دستگاه"
              tab="service"
              openSection={openSection}
              handleSectionToggle={handleSectionToggle}
              buttonClassName="bg-gradient-to-r from-secondary-50 to-secondary-100 hover:from-secondary-100 hover:to-secondary-200"
              headerClassName="from-secondary-500 to-secondary-600"
            >
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-700">
                      نام سرویس <span className="text-error-500">*</span>
                    </label>
                    <Select
                      options={serviceOptions}
                      value={serviceOptions.find(
                        (option) => option.value == requestData.id_service
                      )}
                      onChange={handleServiceChange}
                      styles={selectStyles}
                      placeholder="سرویس مورد نظر را انتخاب کنید"
                      isSearchable
                      menuPortalTarget={
                        typeof document !== "undefined" ? document.body : null
                      }
                      menuPosition="fixed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-700">
                      درخواست کننده <span className="text-error-500">*</span>
                    </label>
                    <Select
                      options={requester_type}
                      value={requester_type.find(
                        (option) => option.value == requestData.requester_type
                      )}
                      onChange={(e) =>
                        setRequestData({
                          ...requestData,
                          requester_type: e.value,
                        })
                      }
                      styles={selectStyles}
                      placeholder="نوع درخواست کننده را انتخاب کنید"
                      isSearchable
                      menuPortalTarget={
                        typeof document !== "undefined" ? document.body : null
                      }
                      menuPosition="fixed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-700">
                      نام برند
                    </label>
                    <Select
                      options={brandOptions}
                      isDisabled={
                        !requestData.id_service || brandOptions.length === 0
                      }
                      value={
                        brandOptions.find(
                          (option) => option.value == requestData.brand_id
                        ) || null
                      }
                      onChange={handleBrandChange}
                      styles={selectStyles}
                      placeholder="نام برند را انتخاب کنید"
                      isSearchable
                      menuPosition="fixed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-700">
                      نام مدل
                    </label>
                    <Select
                      options={modelOptions}
                      isDisabled={
                        !requestData.brand_id || modelOptions.length === 0
                      }
                      value={
                        modelOptions.find(
                          (option) => option.value == requestData.model_id
                        ) || null
                      }
                      onChange={(e) =>
                        setRequestData({
                          ...requestData,
                          model_id: e.value,
                        })
                      }
                      styles={selectStyles}
                      placeholder="نام مدل را انتخاب کنید"
                      isSearchable
                      menuPortalTarget={
                        typeof document !== "undefined" ? document.body : null
                      }
                      menuPosition="fixed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-700">
                      نوع سرویس <span className="text-error-500">*</span>
                    </label>
                    <Select
                      options={operation_type}
                      value={operation_type.find(
                        (option) => option.value == requestData.operation_type
                      )}
                      onChange={(e) =>
                        setRequestData({
                          ...requestData,
                          operation_type: e.value,
                        })
                      }
                      styles={selectStyles}
                      placeholder="نوع سرویس را انتخاب کنید"
                      isSearchable
                      menuPortalTarget={
                        typeof document !== "undefined" ? document.body : null
                      }
                      menuPosition="fixed"
                    />
                  </div>
                </div>
              </div>
            </DataWrapper>

            <DataWrapper
              title="اطلاعات شخصی"
              description="نام، شماره تماس و اطلاعات هویتی"
              tab="personal"
              openSection={openSection}
              handleSectionToggle={handleSectionToggle}
              buttonClassName="bg-gradient-to-r from-primary-50 to-primary-100 hover:from-primary-100 hover:to-primary-200"
              headerClassName="from-primary-500 to-primary-600"
            >
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-700">
                      نام <span className="text-error-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={requestData.first_name}
                      onChange={(e) =>
                        setRequestData({
                          ...requestData,
                          first_name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 text-neutral-700 bg-white border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 placeholder:text-neutral-400"
                      placeholder="نام خود را وارد کنید"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-700">
                      نام خانوادگی <span className="text-error-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={requestData.last_name}
                      onChange={(e) =>
                        setRequestData({
                          ...requestData,
                          last_name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 text-neutral-700 bg-white border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 placeholder:text-neutral-400"
                      placeholder="نام خانوادگی خود را وارد کنید"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-700">
                      شماره موبایل <span className="text-error-500">*</span>
                    </label>
                    <input
                      style={{ direction: "ltr" }}
                      type="tel"
                      value={requestData.mobile}
                      onChange={(e) => {
                        const value = e.target.value;
                        setRequestData({ ...requestData, mobile: value });
                        const regex = /^09\d{9}$/;
                        if (value && !regex.test(value)) {
                          setErrors({ ...errors, mobile: true });
                        } else {
                          setErrors({ ...errors, mobile: false });
                        }
                      }}
                      className={`w-full px-4 py-3 text-neutral-700 bg-white border rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 placeholder:text-neutral-400 ${
                        errors.mobile
                          ? "border-error-500 bg-error-50"
                          : "border-neutral-300"
                      }`}
                      placeholder="09123456789"
                      maxLength="11"
                      required
                    />
                    {errors.mobile && requestData.mobile && (
                      <p className="text-sm text-error-500 flex items-center mt-2">
                        <span className="w-1 h-1 bg-error-500 rounded-full ml-2"></span>
                        شماره موبایل معتبر نیست
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-700">
                      تلفن ثابت
                    </label>
                    <input
                      style={{ direction: "ltr" }}
                      type="tel"
                      value={requestData.phone}
                      onChange={(e) => {
                        const value = e.target.value;
                        setRequestData({ ...requestData, phone: value });
                      }}
                      className="w-full px-4 py-3 text-neutral-700 bg-white border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 placeholder:text-neutral-400"
                      placeholder="02111111111"
                      maxLength="11"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-700">
                      کد ملی
                    </label>
                    <input
                      style={{ direction: "ltr" }}
                      type="text"
                      value={requestData.national_id}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        setRequestData({
                          ...requestData,
                          national_id: value,
                        });
                      }}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-right"
                      placeholder="کد ملی"
                      maxLength={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-700">
                      تاریخ تولد
                    </label>
                    <div className="relative">
                      <DatePicker
                        value={requestData.birth_date || null}
                        onChange={(date) =>
                          setRequestData({
                            ...requestData,
                            birth_date: date?.format?.("YYYY/MM/DD") || date,
                          })
                        }
                        calendar={persian}
                        locale={persian_fa}
                        containerClassName="w-full"
                        style={{ direction: "ltr" }}
                        format="YYYY/MM/DD"
                        placeholder="انتخاب تاریخ تولد"
                        inputClass="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-right z-10"
                        calendarPosition="bottom-start"
                        calendarClassName="z-[9999]"
                        portalClassName="z-[9999]"
                        portal={true}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      شماره موبایل معرف
                    </label>
                    <input
                      type="tel"
                      style={{ direction: "ltr" }}
                      value={requestData.recommender_mobile}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 11);
                        setRequestData({
                          ...requestData,
                          recommender_mobile: value,
                        });
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all `}
                      placeholder="09xxxxxxxxx"
                      maxLength={11}
                    />
                  </div>
                </div>
              </div>
            </DataWrapper>

            {isGettingAddress && (
              <div className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-6 border border-neutral-200">
                <h4 className="text-xl font-bold text-neutral-800 mb-6 flex items-center">
                  در حال دریافت اطلاعات
                </h4>
                <div className="flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                </div>
              </div>
            )}

            {isBlocked && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 border-2 border-red-200 relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-6 left-6 w-12 h-12 bg-red-400 rounded-full blur-sm"></div>
                  <div className="absolute bottom-6 right-6 w-8 h-8 bg-red-300 rounded-full blur-sm"></div>
                  <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-red-500 rounded-full blur-sm"></div>
                  <div className="absolute bottom-1/3 left-1/4 w-4 h-4 bg-red-200 rounded-full blur-sm"></div>
                </div>

                <div className="relative z-10 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.2,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-red-500 text-white rounded-full mb-4 shadow-lg"
                  >
                    <FaExclamationTriangle size={24} />
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    className="text-2xl font-bold text-red-800 mb-3"
                  >
                    کاربر مسدود شده
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className="text-red-700 text-base mb-4 leading-relaxed max-w-md mx-auto"
                  >
                    این شماره موبایل در لیست سیاه قرار دارد و امکان ثبت درخواست
                    جدید ندارد
                  </motion.p>

                  {reasonBlock && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6, duration: 0.3 }}
                      className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-red-200 shadow-inner max-w-md mx-auto"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-red-800 block mb-1">
                            دلیل مسدودیت:
                          </span>
                          <p className="text-sm text-red-700 leading-relaxed">
                            {reasonBlock}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {suggestedAddresses.length > 0 && (
              <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-2xl p-6 border border-secondary-200">
                <h4 className="text-lg font-bold text-neutral-800 mb-4 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-secondary-500 to-secondary-600 rounded-full ml-3"></div>
                  پیشنهادات آدرس
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {suggestedAddresses.map((address, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer border-2 p-3 rounded-xl transition-all duration-200 ${
                        selectedAddress === address
                          ? "border-secondary-400 bg-secondary-50"
                          : "border-neutral-200 hover:border-secondary-300"
                      }`}
                      onClick={() => setSelectedAddress(address)}
                    >
                      <div className="text-sm">
                        <span
                          className={`font-medium block mb-1 ${
                            selectedAddress === address
                              ? "text-secondary-600"
                              : "text-neutral-600"
                          }`}
                        >
                          {address.first_name || "نام ثبت نشده"}{" "}
                          {address.last_name}
                        </span>
                        <span
                          className={`text-xs ${
                            selectedAddress === address
                              ? "text-secondary-500"
                              : "text-neutral-500"
                          }`}
                        >
                          {address.address}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <DataWrapper
              title="اطلاعات دستگاه"
              description="جزئیات فنی و مشخصات نصب"
              tab="device"
              openSection={openSection}
              handleSectionToggle={handleSectionToggle}
              buttonClassName="bg-gradient-to-r from-sky-50 to-sky-100 hover:from-sky-100 hover:to-sky-200"
              headerClassName="from-sky-500 to-sky-600"
            >
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-700">
                      تاریخ نصب
                    </label>
                    <DatePicker
                      value={requestData.install_date}
                      onChange={(date) =>
                        setRequestData({
                          ...requestData,
                          install_date: date?.format?.("YYYY/MM/DD") || date,
                        })
                      }
                      calendar={persian}
                      locale={persian_fa}
                      containerClassName="w-full"
                      style={{ direction: "ltr" }}
                      format="YYYY/MM/DD"
                      placeholder="انتخاب تاریخ نصب"
                      inputClass="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-right"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-700">
                      کد اشتراک
                    </label>
                    <input
                      style={{ direction: "ltr" }}
                      type="text"
                      value={requestData.barcode}
                      onChange={(e) =>
                        setRequestData({
                          ...requestData,
                          barcode: e.target.value,
                        })
                      }
                      placeholder="کد اشتراک"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-700">
                      شماره سریال تولید کننده
                    </label>
                    <input
                      style={{ direction: "ltr" }}
                      type="text"
                      value={requestData.manufacturer_serial}
                      onChange={(e) =>
                        setRequestData({
                          ...requestData,
                          manufacturer_serial: e.target.value,
                        })
                      }
                      placeholder="شماره سریال تولید کننده"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-right"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-700">
                      کد پذیرش تولید کننده
                    </label>
                    <input
                      style={{ direction: "ltr" }}
                      type="text"
                      value={requestData.manufacturer_acceptance_code}
                      onChange={(e) =>
                        setRequestData({
                          ...requestData,
                          manufacturer_acceptance_code: e.target.value,
                        })
                      }
                      placeholder="کد پذیرش تولید کننده"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-700">
                      محل نصب
                    </label>
                    <input
                      type="text"
                      value={requestData.install_location}
                      onChange={(e) =>
                        setRequestData({
                          ...requestData,
                          install_location: e.target.value,
                        })
                      }
                      placeholder="زیرزمین، آشپزخانه، تراس"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-700">
                      محل استفاده
                    </label>
                    <input
                      type="text"
                      value={requestData.usage_location}
                      onChange={(e) =>
                        setRequestData({
                          ...requestData,
                          usage_location: e.target.value,
                        })
                      }
                      placeholder="مسکونی ، تجاری، اداری"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-700">
                      وضعیت ساختمان
                    </label>
                    <input
                      type="text"
                      value={requestData.construction_status}
                      onChange={(e) =>
                        setRequestData({
                          ...requestData,
                          construction_status: e.target.value,
                        })
                      }
                      placeholder="نوساز، قدیمی"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-right"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-700">
                      مساحت ساختمان
                    </label>
                    <input
                      style={{ direction: "ltr" }}
                      type="number"
                      value={requestData.building_area}
                      onChange={(e) =>
                        setRequestData({
                          ...requestData,
                          building_area: e.target.value,
                        })
                      }
                      onKeyDown={preventArrowKeyChange}
                      placeholder="مساحت ساختمان"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-right no-spinner"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-700">
                      نوع نصب
                    </label>
                    <Select
                      options={install_as_options}
                      value={install_as_options.find(
                        (option) => option.value == requestData.install_as
                      )}
                      onChange={(e) =>
                        setRequestData({
                          ...requestData,
                          install_as: e.value,
                        })
                      }
                      styles={selectStyles}
                      placeholder="نوع نصب"
                      menuPortalTarget={
                        typeof document !== "undefined" ? document.body : null
                      }
                      menuPosition="fixed"
                    />
                  </div>
                </div>
              </div>
            </DataWrapper>

            <DataWrapper
              title="تصویر ضمیمه"
              description="آپلود تصویر دستگاه (اختیاری)"
              tab="image"
              openSection={openSection}
              handleSectionToggle={handleSectionToggle}
              buttonClassName="bg-gradient-to-r from-accent-50 to-accent-100 hover:from-accent-100 hover:to-accent-200"
              headerClassName="from-accent-500 to-accent-600"
            >
              <div className="p-6 space-y-4">
                {!imageUploadState.previewUrl &&
                  !imageUploadState.isUploading && (
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-300 rounded-xl bg-neutral-50 hover:bg-neutral-100 hover:border-primary-400 transition-all duration-200 cursor-pointer group"
                      >
                        <FaUpload className="text-2xl text-neutral-400 group-hover:text-primary-500 mb-2 transition-colors duration-200" />
                        <p className="text-sm text-neutral-600 font-medium">
                          برای آپلود تصویر کلیک کنید
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">
                          فرمت‌های مجاز: JPG, PNG, GIF - حداکثر 15 مگابایت
                        </p>
                      </label>
                    </div>
                  )}

                {imageUploadState.isUploading && (
                  <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-primary-300 rounded-xl bg-primary-50">
                    <FaSpinner className="text-2xl text-primary-500 mb-2 animate-spin" />
                    <p className="text-sm text-primary-600 font-medium">
                      در حال آپلود...
                    </p>
                  </div>
                )}

                {imageUploadState.previewUrl &&
                  !imageUploadState.isUploading && (
                    <div className="relative group">
                      <div className="relative w-full h-48 bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200">
                        <img
                          src={imageUploadState.previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200"></div>
                      </div>
                      <button
                        type="button"
                        onClick={handleImageRemove}
                        className="absolute top-3 left-3 p-2 bg-error-500 text-white rounded-lg hover:bg-error-600 transition-all duration-200 transform hover:scale-110 opacity-0 group-hover:opacity-100"
                        title="حذف تصویر"
                      >
                        <FaTrash size={14} />
                      </button>
                      <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/70 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <FaImage className="inline ml-1" />
                        تصویر آپلود شده
                      </div>
                    </div>
                  )}

                {imageUploadState.error && (
                  <div className="p-4 bg-error-50 border border-error-200 rounded-xl">
                    <p className="text-sm text-error-600 flex items-center">
                      <span className="w-2 h-2 bg-error-500 rounded-full ml-2"></span>
                      {imageUploadState.error}
                    </p>
                  </div>
                )}
              </div>
            </DataWrapper>

            <DataWrapper
              title="اطلاعات مکانی"
              description="موقعیت جغرافیایی و آدرس"
              tab="location"
              openSection={openSection}
              handleSectionToggle={handleSectionToggle}
              buttonClassName="bg-gradient-to-r from-success-50 to-success-100 hover:from-success-100 hover:to-success-200"
              headerClassName="from-success-500 to-success-600"
            >
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-neutral-700">
                    کد پستی
                  </label>
                  <input
                    style={{ direction: "ltr" }}
                    type="text"
                    value={requestData.postal_code}
                    onChange={(e) =>
                      setRequestData({
                        ...requestData,
                        postal_code: e.target.value,
                      })
                    }
                    maxLength={10}
                    placeholder="کد پستی"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-right"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-neutral-700">
                    آدرس <span className="text-error-500">*</span>
                  </label>
                  <textarea
                    rows="4"
                    value={requestData.address}
                    onChange={(e) =>
                      setRequestData({
                        ...requestData,
                        address: e.target.value,
                      })
                    }
                    className="w-full px-4 py-4 text-neutral-700 bg-white border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 resize-none placeholder:text-neutral-400"
                    placeholder="آدرس کامل را وارد کنید..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-neutral-700">
                    توضیحات (اختیاری)
                  </label>
                  <textarea
                    rows="4"
                    value={requestData.description}
                    onChange={(e) =>
                      setRequestData({
                        ...requestData,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-4 text-neutral-700 bg-white border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 resize-none placeholder:text-neutral-400 no-resize"
                    placeholder="توضیحات مربوط به درخواست (اختیاری)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-neutral-700">
                    انتخاب موقعیت <span className="text-error-500">*</span>
                  </label>
                  <div className="h-80 w-full rounded-xl overflow-hidden border-2 border-neutral-200 shadow-inner">
                    {/* <SelectLocation
                      location={location}
                      setLocation={setLocation}
                    /> */}
                    <MapSection
                      location={
                        location.length > 0
                          ? { lat: location[0], lng: location[1] }
                          : null
                      }
                      onChange={(lat, lng) => {
                        setLocation([lat, lng]);
                      }}
                    />
                  </div>
                  <p className="text-xs text-neutral-500 flex items-center">
                    <span className="w-1 h-1 bg-neutral-400 rounded-full ml-2"></span>
                    موقعیت مورد نظر را روی نقشه پیدا کنید
                  </p>
                </div>
              </div>
            </DataWrapper>
            <div className="bg-gradient-to-r from-neutral-50 to-white border-t border-neutral-200 p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-8 py-4 text-neutral-700 bg-white border-2 border-neutral-300 rounded-xl hover:bg-neutral-50 hover:border-neutral-400 focus:ring-4 focus:ring-neutral-200 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] font-medium"
                >
                  لغو
                </button>

                <button
                  disabled={!validateForm() || isBlocked}
                  type="submit"
                  className={`px-8 py-4 text-white rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] font-medium min-w-[160px] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${"bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 focus:ring-4 focus:ring-success-200 shadow-lg shadow-success-500/25"}`}
                >
                  {isUpdating ? (
                    <div className="flex items-center justify-center">
                      <FaSpinner className="animate-spin ml-2" />
                      لطفا صبر کنید...
                    </div>
                  ) : (
                    "ثبت درخواست"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddRequestModal;

const DataWrapper = ({
  children,
  title,
  description,
  tab,
  openSection,
  handleSectionToggle,
  buttonClassName,
  headerClassName,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => handleSectionToggle(tab)}
        className={`w-full px-6 py-4 bg-gradient-to-r  transition-all duration-200 flex items-center justify-between text-right ${buttonClassName}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-2 h-8 bg-gradient-to-b rounded-full ${headerClassName}`}
          ></div>
          <div>
            <h4 className="text-lg font-bold text-neutral-800">{title}</h4>
            <p className="text-sm text-neutral-600">{description}</p>
          </div>
        </div>
        <div
          className={`transform transition-transform duration-200 ${openSection === tab ? "rotate-180" : ""}`}
        >
          <ChevronDown className="w-5 h-5 text-neutral-600" />
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === tab ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        {children}
      </div>
    </div>
  );
};
