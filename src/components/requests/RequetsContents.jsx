"use client";
import { useState } from "react";
import { SearchX } from "lucide-react";
import { useRouter } from "next/navigation";

import { useRequests } from "@/context/RequestsContext";
import RequestCard from "./RequestCard";
import ConfirmModal from "./ConfirmModal";
import LocationModal from "./LocationModal";
import PaymentStatusModal from "./PaymentStatusModal";
import BillModal from "./BillModal";
import CompleteModal from "./CompleteModal";
import AddImageModal from "./AddImageModal";

export default function RequetsContents() {
  const router = useRouter();
  const { mainRequests, isGettingRequest, setSelectedRequest, url } =
    useRequests();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showPaymentStatusModal, setShowPaymentStatusModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showAddImageModal, setShowAddImageModal] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState(null);

  const handleConfirm = (request) => {
    setSelectedRequest(request);
    setShowConfirmModal(true);
  };

  const handleEditAddress = (request) => {
    setSelectedRequest(request);
    setShowLocationModal(true);
  };

  const handleChangePaymentStatus = (request) => {
    setSelectedRequest(request);
    setShowPaymentStatusModal(true);
  };

  const handleLabel = (request) => {
    setSelectedRequest(request);
    router.push(`/labels?request_id=${request.id}`);
  };

  const handleBill = (request) => {
    setSelectedRequest(request);
    setShowBillModal(true);
  };

  const handleComplete = (request) => {
    setSelectedRequest(request);
    setShowCompleteModal(true);
  };

  const handleAddImage = (request) => {
    setSelectedRequest(request);
    setShowAddImageModal(true);
  };

  const handleToggleExpand = (requestId) => {
    setExpandedCardId(expandedCardId === requestId ? null : requestId);
  };

  if (isGettingRequest) {
    return (
      <div className="">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-surface rounded-xl border border-neutral-200 overflow-hidden animate-pulse"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-neutral-200 rounded w-32"></div>
                <div className="h-8 bg-neutral-200 rounded w-24"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-neutral-200 rounded w-20"></div>
                    <div className="h-5 bg-neutral-200 rounded w-32"></div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 bg-neutral-200 rounded w-20"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const uncompletedRequests = mainRequests.filter(
    (r) => r.status != 8 && r.status != 2
  );

  if (!uncompletedRequests || uncompletedRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-r from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <SearchX className="w-12 h-12 text-neutral-400" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-700 mb-3">
            هیچ درخواستی یافت نشد
          </h3>
          <p className="text-neutral-500 leading-relaxed">
            با فیلترهای انتخاب شده هیچ درخواستی پیدا نشد. لطفاً فیلترها را تغییر
            دهید یا جستجوی جدیدی انجام دهید.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {uncompletedRequests.map((request, index) => (
        <RequestCard
          key={request.id}
          request={request}
          index={index}
          onConfirm={() => handleConfirm(request)}
          onEditAddress={() => handleEditAddress(request)}
          onChangePaymentStatus={() => handleChangePaymentStatus(request)}
          onLabel={() => handleLabel(request)}
          onBill={() => handleBill(request)}
          onComplete={() => handleComplete(request)}
          onAddImage={() => handleAddImage(request)}
          isExpanded={expandedCardId === request.id}
          onToggleExpand={() => handleToggleExpand(request.id)}
        />
      ))}

      {showConfirmModal && (
        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
        />
      )}

      {showLocationModal && (
        <LocationModal
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
        />
      )}

      {showPaymentStatusModal && (
        <PaymentStatusModal
          isOpen={showPaymentStatusModal}
          onClose={() => setShowPaymentStatusModal(false)}
        />
      )}

      {showBillModal && (
        <BillModal
          isOpen={showBillModal}
          onClose={() => setShowBillModal(false)}
        />
      )}

      {showCompleteModal && (
        <CompleteModal
          isOpen={showCompleteModal}
          onClose={() => setShowCompleteModal(false)}
        />
      )}

      {showAddImageModal && (
        <AddImageModal
          isOpen={showAddImageModal}
          onClose={() => setShowAddImageModal(false)}
        />
      )}
    </div>
  );
}
