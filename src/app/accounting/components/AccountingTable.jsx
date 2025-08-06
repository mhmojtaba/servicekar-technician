"use client";
import { useState } from "react";
import {
  FiFileText,
  FiUser,
  FiDollarSign,
  FiTag,
  FiCalendar,
  FiInfo,
  FiPercent,
  FiHash,
} from "react-icons/fi";
import { IoFileTrayFull } from "react-icons/io5";
import { Popover, PopoverTrigger, PopoverContent, Button } from "@heroui/react";

import { useRequests } from "@/context/RequestsContext";

const AccountingTable = ({ thead, tbody, total_paid_balance }) => {
  const { payment_to_technician_type } = useRequests();

  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString("fa-IR");
  };

  const getPaymentTypeBadgeColor = (type) => {
    const colors = {
      1: "bg-emerald-50 text-emerald-700 border-emerald-200",
      2: "bg-blue-50 text-blue-700 border-blue-200",
      3: "bg-amber-50 text-amber-700 border-amber-200",
      4: "bg-purple-50 text-purple-700 border-purple-200",
      default: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return colors[type] || colors.default;
  };

  const getAmountColor = (type) => {
    return type >= 0 ? "text-emerald-600" : "text-red-600";
  };

  const getAmountIcon = (type) => {
    return type == 1 ? "+" : "-";
  };

  const getStatusText = (type) => {
    return type == 1 ? "بدهکار" : "بستانکار";
  };

  const getStatusColor = (type) => {
    return type == -1
      ? "text-red-600 bg-red-50"
      : "text-emerald-600 bg-emerald-50";
  };

  const calculateRunningBalance = () => {
    let runningBalance = 0;
    const price = "technician_price";
    const type = "technician_type";
    const total_paid_balance_number = Number(total_paid_balance);
    return tbody.map((item, index) => {
      if (index === 0) {
        runningBalance = total_paid_balance_number + item[price] * item[type];
      } else {
        runningBalance += item[price] * item[type];
      }
      return {
        ...item,
        runningBalance,
      };
    });
  };

  const dataWithBalance = calculateRunningBalance();

  if (tbody.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="text-center py-20">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-gray-50 rounded-full">
              <IoFileTrayFull className="w-10 h-10 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-gray-700">
                هیچ اطلاعاتی برای نمایش وجود ندارد
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                لطفاً ابتدا تکنسین را انتخاب کرده و جستجو کنید تا اطلاعات
                حسابداری نمایش داده شود
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                {thead.map((item) => (
                  <th
                    key={item.id}
                    className="px-4 lg:px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                  >
                    {item.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dataWithBalance.map((item, index) => {
                const amount = item?.technician_price;
                const type = item?.technician_type;
                const isPositive = type >= 0;

                return (
                  <tr
                    key={index}
                    className="hover:bg-gray-50/50 transition-all duration-200 group"
                  >
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <FiHash className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {index + 1}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 lg:px-6 py-4">
                      {item?.title ? (
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900 text-sm leading-5">
                            {item?.title}
                          </div>
                          {item?.request_id && (
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <span className="text-xs text-gray-500">
                                درخواست #{item?.request_id}
                              </span>
                              <Popover
                                showArrow
                                placement="bottom-start"
                                classNames={{
                                  content:
                                    "p-0 border-0 bg-transparent shadow-lg",
                                }}
                              >
                                <PopoverTrigger>
                                  <button className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-200">
                                    <FiInfo className="w-3 h-3 ml-1" />
                                    جزییات
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent>
                                  <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-[300px]">
                                    <div className="border-b border-gray-100 pb-3 mb-3">
                                      <h3 className="text-sm font-semibold text-gray-900">
                                        درخواست #{item?.request_id}
                                      </h3>
                                      <p className="text-xs text-gray-500 mt-1">
                                        تاریخ: {formatDate(item?.request_date)}
                                      </p>

                                      {item?.used_guarantee_type != "" ? (
                                        <span className="text-xs text-gray-500 mt-1">
                                          شامل گارانتی
                                        </span>
                                      ) : null}
                                    </div>

                                    <div className="space-y-3">
                                      <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-gray-50 rounded-lg p-2">
                                          <div className="text-xs text-gray-500 mb-1">
                                            قیمت واحد
                                          </div>
                                          <div className="text-sm font-medium text-gray-900">
                                            {formatPrice(item?.unit_price)}{" "}
                                            تومان
                                          </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-2">
                                          <div className="text-xs text-gray-500 mb-1">
                                            تعداد
                                          </div>
                                          <div className="text-sm font-medium text-gray-900">
                                            {item?.quantity}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="bg-blue-50 rounded-lg p-3">
                                        <div className="text-xs text-blue-600 mb-1">
                                          قیمت کل
                                        </div>
                                        <div className="text-sm font-semibold text-blue-900">
                                          {formatPrice(item?.commission_base)}{" "}
                                          تومان
                                        </div>
                                      </div>

                                      <div className="bg-green-50 rounded-lg p-3">
                                        <div className="text-xs text-green-600 mb-1">
                                          درصد تکنسین
                                        </div>
                                        <div className="text-sm font-semibold text-green-900">
                                          {formatPrice(item?.sahm_tecnician)}{" "}
                                          تومان
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          {item?.description}
                        </div>
                      )}
                    </td>

                    {/* بدهکار */}
                    <td className="px-4 lg:px-6 py-4">
                      {!isPositive ? (
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <span
                            className={`text-sm font-bold ${getAmountColor(type)}`}
                          >
                            {formatPrice(amount)}
                          </span>
                          <span className="text-xs text-gray-500">تومان</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>

                    {/* بستانکار */}
                    <td className="px-4 lg:px-6 py-4">
                      {isPositive ? (
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <span
                            className={`text-sm font-bold ${getAmountColor(amount)}`}
                          >
                            {formatPrice(amount)}
                          </span>
                          <span className="text-xs text-gray-500">تومان</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>

                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <span
                          className={`text-sm font-bold ${getAmountColor(item.runningBalance)}`}
                        >
                          {formatPrice(Math.abs(item.runningBalance))}
                        </span>
                        <span className="text-xs text-gray-500">تومان</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden">
        <div className="divide-y divide-gray-100">
          {dataWithBalance.map((item, index) => {
            const amount = item?.technician_price;
            const type = item?.technician_type;
            const isPositive = type >= 0;

            return (
              <div
                key={index}
                className="p-4 hover:bg-gray-50/50 transition-colors duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiHash className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      ردیف {index + 1}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2 leading-5">
                    {item?.title || item?.description || "---"}
                  </h4>
                  {item?.request_id && (
                    <div className="flex items-center space-x-2 space-x-reverse mb-2">
                      <span className="text-xs text-gray-500">
                        درخواست #{item?.request_id}
                      </span>
                      <Popover
                        showArrow
                        placement="bottom"
                        classNames={{
                          content: "p-0 border-0 bg-transparent shadow-lg",
                        }}
                      >
                        <PopoverTrigger>
                          <button className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-md">
                            <FiInfo className="w-3 h-3 ml-1" />
                            جزییات
                          </button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-[280px]">
                            <div className="border-b border-gray-100 pb-3 mb-3">
                              <h3 className="text-sm font-semibold text-gray-900">
                                درخواست #{item?.request_id}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(item?.request_date)}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">
                                  قیمت واحد:
                                </span>
                                <span className="font-medium">
                                  {formatPrice(item?.unit_price)} تومان
                                </span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">تعداد:</span>
                                <span className="font-medium">
                                  {item?.quantity}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs border-t pt-2">
                                <span className="text-gray-500">قیمت کل:</span>
                                <span className="font-semibold">
                                  {formatPrice(item?.commission_base)} تومان
                                </span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">
                                  درصد تکنسین:
                                </span>
                                <span className="font-semibold text-green-600">
                                  {formatPrice(item?.sahm_tecnician)} تومان
                                </span>
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-red-50 rounded-lg p-3">
                    <div className="text-xs font-medium text-red-700 mb-1">
                      بدهکار
                    </div>
                    <div className="text-sm font-bold">
                      {!isPositive ? (
                        <span className={getAmountColor(type)}>
                          {formatPrice(amount)} تومان
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </div>

                  {/* Debit */}
                  <div className="bg-emerald-50 rounded-lg p-3">
                    <div className="text-xs font-medium text-emerald-700 mb-1">
                      بستانکار
                    </div>
                    <div className="text-sm font-bold">
                      {isPositive ? (
                        <span className={getAmountColor(type)}>
                          {formatPrice(amount)} تومان
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Running Balance */}
                <div className="bg-blue-50 rounded-lg p-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-blue-700">
                      مانده:
                    </span>
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <span
                        className={`text-sm font-bold ${getAmountColor(item.runningBalance)}`}
                      >
                        {formatPrice(Math.abs(item.runningBalance))}
                      </span>
                      <span className="text-xs text-gray-500">تومان</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AccountingTable;
