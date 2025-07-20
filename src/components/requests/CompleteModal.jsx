"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  Loader2,
  X,
  Calendar,
  User,
  Hash,
  MapPin,
  Building,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  Upload,
  Trash2,
  Plus,
  Shield,
  Star,
  Home,
} from "lucide-react";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { toast } from "react-toastify";

import { useRequests } from "@/context/RequestsContext";
import {
  convertToEnglishDigits,
  selectOptionsGenerator,
  uploadFile,
} from "@/utils/utils";
import { useAuth } from "@/context/AuthContext";
import DateObject from "react-date-object";

const customStyles = `
  <style>
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: #cbd5e1 #f1f5f9;
    }
    
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #06b6d4, #0891b2);
      border-radius: 10px;
      border: 2px solid #f1f5f9;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #0891b2, #0e7490);
    }

    .bg-grid-white\\/10 {
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    }

    .react-select-container .react-select__control {
      border: none !important;
      box-shadow: none !important;
    }

    .react-select-error .react-select__control {
      border: none !important;
      box-shadow: none !important;
    }

    @media (max-width: 768px) {
      .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
      }
    }

    /* Enhanced animations */
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    .float-animation {
      animation: float 6s ease-in-out infinite;
    }

    @keyframes shimmer {
      0% { background-position: -200px 0; }
      100% { background-position: calc(200px + 100%) 0; }
    }

    .shimmer {
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.4),
        transparent
      );
      background-size: 200px 100%;
      animation: shimmer 2s infinite;
    }
  </style>
`;

const INSTALL_AS_OPTIONS = [
  { value: "اولین", label: "اولین" },
  { value: "جایگزین", label: "جایگزین" },
];

const CompleteModal = ({ isOpen, onClose }) => {
  const { token } = useAuth();
  const {
    selectedRequest,
    isChangingStatus,
    mutateCompleteRequestByTechnician,
    install_garanti_type_request,
    garanti_sherkati,
    brands,
    brand_models,
    fetchRequests,
  } = useRequests();
  console.log("install_garanti_type_request", install_garanti_type_request);

  const [formData, setFormData] = useState({
    install_date: "",
    national_id: "",
    birth_date: "",
    manufacturer_serial: "",
    brand_id: "",
    model_id: "",
    images: [],
    install_location: "",
    usage_location: "",
    construction_status: "",
    install_as: "",
    building_area: "",
    postal_code: "",
    install_garanti_type_request: "",
    garanti_sherkati: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [uploadingImages, setUploadingImages] = useState({});

  console.log("selectedRequest", selectedRequest);

  useEffect(() => {
    if (selectedRequest) {
      setFormData({
        national_id: selectedRequest?.national_id || "",
        birth_date: selectedRequest?.birth_date || "",
        manufacturer_serial: selectedRequest?.manufacturer_serial || "",
        brand_id: selectedRequest?.brand_id || "",
        model_id: selectedRequest?.model_id || "",
        images: JSON.parse(selectedRequest?.images) || [],
        install_location: selectedRequest?.install_location || "",
        install_date: selectedRequest?.install_date || "",
        usage_location: selectedRequest?.usage_location || "",
        construction_status: selectedRequest?.construction_status || "",
        install_as: selectedRequest?.install_as || "",
        building_area: selectedRequest?.building_area || "",
        postal_code: selectedRequest?.postal_code || "",
        install_garanti_type_request:
          selectedRequest?.install_garanti_type_request || "",
        garanti_sherkati: selectedRequest?.garanti_sherkati || "",
        description: selectedRequest?.description || "",
      });
    }
  }, [selectedRequest]);

  const brandOptions = useMemo(() => {
    if (!selectedRequest?.id_service || !brands.length) return [];
    const filteredBrands = brands.filter(
      (brand) => brand.id_service == selectedRequest.id_service
    );
    return selectOptionsGenerator(filteredBrands);
  }, [selectedRequest?.id_service, brands]);

  const modelOptions = useMemo(() => {
    if (!formData.brand_id || !brand_models.length) return [];
    const filteredModels = brand_models.filter(
      (model) => model.id_parent == formData.brand_id
    );
    return selectOptionsGenerator(filteredModels);
  }, [formData.brand_id, brand_models]);

  const getRequiredFields = () => {
    const operationType = selectedRequest?.operation_type;

    if (operationType === 1) {
      return {
        install_garanti_type_request: "نوع گارانتی الزامی است",
        national_id: "کد ملی الزامی است",
        birth_date: "تاریخ تولد الزامی است",
        manufacturer_serial: "سریال سازنده الزامی است",
        install_location: "محل نصب الزامی است",
        usage_location: "محل استفاده الزامی است",
        construction_status: "وضعیت ساختمان الزامی است",
        install_as: "نوع نصب الزامی است",
        building_area: "متراژ ساختمان الزامی است",
        postal_code: "کد پستی الزامی است",
        description: "توضیحات الزامی است",
        images: "حداقل 3 تصویر الزامی است",
        brand_id: "برند الزامی است",
        model_id: "مدل الزامی است",
      };
    }

    if (operationType === 2) {
      return {
        garanti_sherkati: "گارانتی شرکت الزامی است",
        brand_id: "برند الزامی است",
        model_id: "مدل الزامی است",
      };
    }

    return {};
  };

  const validateForm = () => {
    const requiredFields = getRequiredFields();
    const newErrors = {};

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (field === "images") {
        if (!formData.images || formData.images.length < 3) {
          newErrors[field] = message;
        }
      } else if (!formData[field]) {
        newErrors[field] = message;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleImageUpload = async (files) => {
    const fileList = Array.from(files);

    for (const file of fileList) {
      if (!file.type.startsWith("image/")) {
        alert("لطفا فقط فایل تصویری انتخاب کنید");
        continue;
      }
      if (file.size > 15 * 1024 * 1024) {
        alert("حجم فایل باید کمتر از 15 مگابایت باشد");
        continue;
      }

      const tempId = Date.now() + Math.random();
      setUploadingImages((prev) => ({ ...prev, [tempId]: true }));

      try {
        const { data: response } = await uploadFile(file, token);
        if (response.msg === 0 && response.path) {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, response.path],
          }));
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("خطا در آپلود فایل");
      } finally {
        setUploadingImages((prev) => {
          const { [tempId]: removed, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const data = {
        token,
        order_id: selectedRequest.id,
        ...formData,
      };

      const { data: response } = await mutateCompleteRequestByTechnician(data);
      if (response?.msg === 0) {
        console.log("response success", response);
        toast.success(response?.msg_text);
        onClose();
        fetchRequests();
      } else {
        console.log("response error", response);
        toast.error(response?.msg_text);
      }
    } catch (error) {
      console.error("Error completing request:", error);
    }
  };

  const isFieldRequired = (fieldName) => {
    const requiredFields = getRequiredFields();
    return fieldName in requiredFields;
  };

  if (!isOpen) return null;
  console.log("formData", formData);
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: customStyles }} />

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="w-full max-w-7xl max-h-[95vh]  bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="relative bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 px-4 sm:px-6 pt-4 sm:pt-6 pb-2 sm:pb-3">
              <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-transparent"></div>

              <div className="relative text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg float-animation"
                >
                  <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight flex items-center gap-2 justify-center"
                >
                  تکمیل درخواست
                  <span className="bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full font-semibold text-xs sm:text-sm">
                    {selectedRequest?.id} #
                  </span>
                </motion.h3>
              </div>

              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                onClick={onClose}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 sm:p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200 backdrop-blur-sm"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>

              {selectedRequest?.operation_type && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="absolute top-3 sm:top-4 left-3 sm:left-4"
                >
                  <div className="bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-white font-medium text-xs">
                    {selectedRequest.operation_type === 1 ? "نصب" : "سرویس"}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="p-4 sm:p-6 lg:p-8 max-h-[calc(80vh-200px)] sm:max-h-[calc(85vh-220px)] overflow-y-auto custom-scrollbar">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 h-full">
                  <div className="space-y-6 sm:space-y-8">
                    <motion.section
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-blue-100 shadow-sm"
                    >
                      <div className="flex items-center gap-3 mb-4 sm:mb-6">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                          <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
                            اطلاعات شخصی
                          </h2>
                          <p className="text-blue-600 text-xs sm:text-sm">
                            اطلاعات هویتی و شخصی
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 sm:space-y-6">
                        <InputField
                          label="کد ملی"
                          value={formData.national_id}
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10);
                            updateField("national_id", value);
                          }}
                          required={isFieldRequired("national_id")}
                          error={errors.national_id}
                          icon={<Hash className="w-4 h-4 sm:w-5 sm:h-5" />}
                          placeholder="1234567890"
                          maxLength={10}
                        />

                        <DateField
                          label="تاریخ تولد"
                          value={formData.birth_date}
                          onChange={(value) =>
                            updateField(
                              "birth_date",
                              convertToEnglishDigits(
                                new DateObject(value).format("YYYY/MM/DD")
                              )
                            )
                          }
                          required={isFieldRequired("birth_date")}
                          error={errors.birth_date}
                          icon={<Calendar className="w-4 h-4 sm:w-5 sm:h-5" />}
                        />

                        <InputField
                          label="سریال سازنده"
                          value={formData.manufacturer_serial}
                          onChange={(e) =>
                            updateField("manufacturer_serial", e.target.value)
                          }
                          required={isFieldRequired("manufacturer_serial")}
                          error={errors.manufacturer_serial}
                          icon={<Hash className="w-4 h-4 sm:w-5 sm:h-5" />}
                          placeholder="ABC123456"
                        />
                      </div>
                    </motion.section>

                    <motion.section
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-green-100 shadow-sm"
                    >
                      <div className="flex items-center gap-3 mb-4 sm:mb-6">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
                            اطلاعات مکانی
                          </h2>
                          <p className="text-green-600 text-xs sm:text-sm">
                            آدرس و مشخصات مکان
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 sm:space-y-6">
                        <InputField
                          label="محل نصب"
                          value={formData.install_location}
                          onChange={(e) =>
                            updateField("install_location", e.target.value)
                          }
                          required={isFieldRequired("install_location")}
                          error={errors.install_location}
                          icon={<Home className="w-4 h-4 sm:w-5 sm:h-5" />}
                          placeholder="زیرزمین، آشپزخانه، تراس"
                        />

                        <InputField
                          label="محل استفاده"
                          value={formData.usage_location}
                          onChange={(e) =>
                            updateField("usage_location", e.target.value)
                          }
                          required={isFieldRequired("usage_location")}
                          error={errors.usage_location}
                          icon={<MapPin className="w-4 h-4 sm:w-5 sm:h-5" />}
                          placeholder="مسکونی، تجاری، اداری"
                        />

                        <InputField
                          label="وضعیت ساختمان"
                          value={formData.construction_status}
                          onChange={(e) =>
                            updateField("construction_status", e.target.value)
                          }
                          required={isFieldRequired("construction_status")}
                          error={errors.construction_status}
                          icon={<Building className="w-4 h-4 sm:w-5 sm:h-5" />}
                          placeholder="نوساز، قدیمی"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                          <InputField
                            label="متراژ ساختمان"
                            value={formData.building_area}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              updateField("building_area", value);
                            }}
                            required={isFieldRequired("building_area")}
                            error={errors.building_area}
                            icon={
                              <Building className="w-4 h-4 sm:w-5 sm:h-5" />
                            }
                            placeholder="متر مربع"
                          />

                          <InputField
                            label="کد پستی"
                            value={formData.postal_code}
                            onChange={(e) => {
                              const value = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 10);
                              updateField("postal_code", value);
                            }}
                            required={isFieldRequired("postal_code")}
                            error={errors.postal_code}
                            icon={<Hash className="w-4 h-4 sm:w-5 sm:h-5" />}
                            placeholder="1234567890"
                            maxLength={10}
                          />
                        </div>
                      </div>
                    </motion.section>
                  </div>

                  <div className="space-y-6 sm:space-y-8">
                    <motion.section
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-purple-100 shadow-sm"
                    >
                      <div className="flex items-center gap-3 mb-4 sm:mb-6">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                          <Building className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
                            محصول و نصب
                          </h2>
                          <p className="text-purple-600 text-xs sm:text-sm">
                            اطلاعات محصول و نحوه نصب
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 sm:space-y-6">
                        <SelectField
                          label="برند"
                          value={formData.brand_id}
                          onChange={(value) => updateField("brand_id", value)}
                          options={brandOptions}
                          required={isFieldRequired("brand_id")}
                          error={errors.brand_id}
                          icon={<Star className="w-4 h-4 sm:w-5 sm:h-5" />}
                        />

                        <SelectField
                          label="مدل"
                          value={formData.model_id}
                          onChange={(value) => updateField("model_id", value)}
                          options={modelOptions}
                          required={isFieldRequired("model_id")}
                          error={errors.model_id}
                          icon={<Building className="w-4 h-4 sm:w-5 sm:h-5" />}
                        />

                        <SelectField
                          label="نوع نصب"
                          value={formData.install_as}
                          onChange={(value) => updateField("install_as", value)}
                          options={INSTALL_AS_OPTIONS}
                          required={isFieldRequired("install_as")}
                          error={errors.install_as}
                          icon={<Star className="w-4 h-4 sm:w-5 sm:h-5" />}
                        />

                        <DateField
                          label="تاریخ نصب"
                          value={formData.install_date}
                          onChange={(value) =>
                            updateField(
                              "install_date",
                              convertToEnglishDigits(
                                new DateObject(value).format("YYYY/MM/DD")
                              )
                            )
                          }
                          required={isFieldRequired("install_date")}
                          error={errors.install_date}
                          icon={<Calendar className="w-4 h-4 sm:w-5 sm:h-5" />}
                        />

                        <SelectField
                          label="نوع گارانتی"
                          value={formData.install_garanti_type_request}
                          onChange={(value) =>
                            updateField("install_garanti_type_request", value)
                          }
                          options={install_garanti_type_request}
                          required={isFieldRequired(
                            "install_garanti_type_request"
                          )}
                          error={errors.install_garanti_type_request}
                          icon={<Shield className="w-4 h-4 sm:w-5 sm:h-5" />}
                        />

                        <SelectField
                          label="گارانتی شرکت"
                          value={formData.garanti_sherkati}
                          onChange={(value) =>
                            updateField("garanti_sherkati", value)
                          }
                          options={garanti_sherkati}
                          required={isFieldRequired("garanti_sherkati")}
                          error={errors.garanti_sherkati}
                          icon={<Shield className="w-4 h-4 sm:w-5 sm:h-5" />}
                        />
                      </div>
                    </motion.section>

                    <motion.section
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-pink-100 shadow-sm"
                    >
                      <div className="flex items-center gap-3 mb-4 sm:mb-6">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                          <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
                            تصاویر و توضیحات
                          </h2>
                          <p className="text-pink-600 text-xs sm:text-sm">
                            مستندات و توضیحات تکمیلی
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 sm:space-y-6">
                        <TextareaField
                          label="توضیحات"
                          value={formData.description}
                          onChange={(value) =>
                            updateField("description", value)
                          }
                          required={isFieldRequired("description")}
                          error={errors.description}
                          rows={4}
                          placeholder="توضیحات تکمیلی در مورد کار انجام شده..."
                        />

                        <ImageUploadField
                          images={formData.images}
                          onUpload={handleImageUpload}
                          onRemove={removeImage}
                          uploading={uploadingImages}
                          required={isFieldRequired("images")}
                          error={errors.images}
                          minImages={
                            selectedRequest?.operation_type === 1 ? 3 : 0
                          }
                        />
                      </div>
                    </motion.section>
                  </div>
                </div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
            >
              <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <button
                  onClick={onClose}
                  disabled={isChangingStatus}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg sm:rounded-xl border border-gray-300 transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md text-sm sm:text-base"
                >
                  انصراف
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isChangingStatus}
                  className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-sm sm:text-base"
                >
                  {isChangingStatus ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      در حال پردازش...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      تکمیل درخواست
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default CompleteModal;

const InputField = ({
  label,
  value,
  onChange,
  required,
  error,
  icon,
  ...props
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-3"
  >
    <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
      {icon && (
        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
          <span className="text-blue-600">{icon}</span>
        </div>
      )}
      <span>{label}</span>
      {required && <span className="text-red-500 text-lg">*</span>}
    </label>
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e)}
        className={`w-full px-4 py-4 text-lg border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 placeholder-gray-400 ${
          error
            ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100"
            : "border-gray-200 bg-white hover:border-blue-300 focus:border-blue-500"
        }`}
        {...props}
      />
      {error && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          <AlertCircle className="w-5 h-5 text-red-500" />
        </div>
      )}
    </div>
    {error && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200"
      >
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>{error}</span>
      </motion.div>
    )}
  </motion.div>
);

const SelectField = ({
  label,
  value,
  onChange,
  options,
  required,
  error,
  icon,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-3"
  >
    <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
      {icon && (
        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
          <span className="text-blue-600">{icon}</span>
        </div>
      )}
      <span>{label}</span>
      {required && <span className="text-red-500 text-lg">*</span>}
    </label>
    <div className="relative">
      <Select
        value={options?.find((opt) => opt.value == value)}
        onChange={(option) => onChange(option?.value)}
        options={options}
        placeholder={`انتخاب ${label}`}
        className={error ? "react-select-error" : "react-select-container"}
        classNames={{
          control: (state) => `
            !border-2 !rounded-xl !py-2 !px-2 !text-lg !min-h-[60px]
            ${
              error
                ? "!border-red-500 !bg-red-50 !shadow-none"
                : state.isFocused
                  ? "!border-blue-500 !bg-white !shadow-none !ring-4 !ring-blue-100"
                  : "!border-gray-200 !bg-white hover:!border-blue-300"
            }
            !transition-all !duration-200
          `,
          menu: () =>
            "!bg-white !border-2 !border-gray-200 !rounded-xl !shadow-xl !mt-2 !z-50",
          menuList: () => "!py-2",
          option: (state) => `
            !px-4 !py-3 !cursor-pointer !transition-all !duration-150
            ${
              state.isSelected
                ? "!bg-blue-500 !text-white"
                : state.isFocused
                  ? "!bg-blue-50 !text-blue-900"
                  : "!bg-white !text-gray-700"
            }
            hover:!bg-blue-50 hover:!text-blue-900
          `,
          placeholder: () => "!text-gray-400 !text-lg",
          singleValue: () => "!text-gray-900 !text-lg",
          dropdownIndicator: () => "!text-gray-400 hover:!text-gray-600",
          indicatorSeparator: () => "!bg-gray-300",
        }}
      />
      {error && (
        <div className="absolute top-4 right-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500" />
        </div>
      )}
    </div>
    {error && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200"
      >
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>{error}</span>
      </motion.div>
    )}
  </motion.div>
);

const DateField = ({ label, value, onChange, required, error, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-3"
  >
    <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
      {icon && (
        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
          <span className="text-blue-600">{icon}</span>
        </div>
      )}
      <span>{label}</span>
      {required && <span className="text-red-500 text-lg">*</span>}
    </label>
    <div className="relative">
      <DatePicker
        value={value}
        onChange={onChange}
        calendar={persian}
        locale={persian_fa}
        format="YYYY/MM/DD"
        style={{ direction: "ltr" }}
        placeholder={`انتخاب ${label}`}
        inputClass={`w-full px-4 py-4 text-lg border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
          error
            ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100"
            : "border-gray-200 bg-white hover:border-blue-300 focus:border-blue-500"
        }`}
        containerStyle={{ width: "100%" }}
      />
      {error && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          <AlertCircle className="w-5 h-5 text-red-500" />
        </div>
      )}
    </div>
    {error && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200"
      >
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>{error}</span>
      </motion.div>
    )}
  </motion.div>
);

const TextareaField = ({
  label,
  value,
  onChange,
  required,
  error,
  rows = 4,
  ...props
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-3"
  >
    <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
        <FileText className="w-5 h-5 text-blue-600" />
      </div>
      <span>{label}</span>
      {required && <span className="text-red-500 text-lg">*</span>}
    </label>
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`w-full px-4 py-4 text-lg border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 resize-none placeholder-gray-400 ${
          error
            ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100"
            : "border-gray-200 bg-white hover:border-blue-300 focus:border-blue-500"
        }`}
        {...props}
      />
      {error && (
        <div className="absolute top-4 right-4">
          <AlertCircle className="w-5 h-5 text-red-500" />
        </div>
      )}
    </div>
    {error && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200"
      >
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>{error}</span>
      </motion.div>
    )}
  </motion.div>
);

const ImageUploadField = ({
  images,
  onUpload,
  onRemove,
  uploading,
  required,
  error,
  minImages,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-4"
  >
    <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
        <ImageIcon className="w-5 h-5 text-blue-600" />
      </div>
      <span>تصاویر</span>
      {required && <span className="text-red-500 text-lg">*</span>}
      {minImages > 0 && (
        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">
          حداقل {minImages} تصویر
        </span>
      )}
    </label>

    <div
      className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
        error
          ? "border-red-300 bg-red-50"
          : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/30"
      }`}
    >
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => onUpload(e.target.files)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        id="image-upload"
      />
      <div className="text-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <Upload className="w-8 h-8 text-blue-600" />
        </motion.div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          تصاویر خود را بارگذاری کنید
        </h3>
        <p className="text-gray-600 mb-2">
          کلیک کنید یا فایل‌ها را اینجا بکشید
        </p>
        <p className="text-xs text-gray-500">JPG, PNG, GIF - حداکثر 15MB</p>
      </div>
    </div>

    {Object.keys(uploading).length > 0 && (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          در حال آپلود...
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Object.keys(uploading).map((id) => (
            <div
              key={id}
              className="aspect-square bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center"
            >
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    )}

    {images.length > 0 && (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700">
            تصاویر بارگذاری شده ({images.length})
          </h4>
          {minImages > 0 && images.length >= minImages && (
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              کامل
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images?.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative group aspect-square"
            >
              <img
                src={image}
                alt={`تصویر ${index + 1}`}
                className="w-full h-full object-cover rounded-xl border-2 border-gray-200 group-hover:border-blue-300 transition-all duration-200"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl transition-all duration-200"></div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onRemove(index)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg">
                  تصویر {index + 1}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )}

    {error && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200"
      >
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>{error}</span>
      </motion.div>
    )}
  </motion.div>
);
