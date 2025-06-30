"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";
import {
  changeRequestPayment,
  changeRequestStatus,
  getRequests,
  getRequestsMain,
  getUnconfirmedRequests,
  ResendConfirmationCode,
} from "@/services/requestsServices";
import { toast } from "react-toastify";

const RequestsContext = createContext();

export const RequestsProvider = ({ children }) => {
  const { token } = useAuth();
  const [mainRequests, setMainRequests] = useState([]);
  const [requestsCount, setRequestsCount] = useState(null);
  const [url, setUrl] = useState(null);
  const [operation_type, setOperation_type] = useState([]);
  const [status_requests, setStatus_requests] = useState([]);
  const [array_type_payment, setArray_type_payment] = useState([]);
  const [requester_type, setRequester_type] = useState([]);
  const [service, setService] = useState([]);
  const [technician, setTechnician] = useState([]);
  const [zones, setZones] = useState([]);
  const [uncompleteRequests, setUncompleteRequests] = useState([]);
  const [payment_to_technician_type, setPayment_to_technician_type] = useState(
    []
  );
  const [selectedRequest, setSelectedRequest] = useState(null);

  const { isPending: isGettingRequest, mutateAsync: mutateGetRequests } =
    useMutation({
      mutationFn: getRequests,
    });

  const {
    isPending: isGettingRequestsMain,
    mutateAsync: mutateGetRequestsMain,
  } = useMutation({
    mutationFn: getRequestsMain,
  });

  const {
    isPending: isChangingPayment,
    mutateAsync: mutateChangeRequestPayment,
  } = useMutation({
    mutationFn: changeRequestPayment,
  });

  const {
    isPending: isChangingStatus,
    mutateAsync: mutateChangeRequestStatus,
  } = useMutation({
    mutationFn: changeRequestStatus,
  });

  const {
    isPending: isGettingUncompleteRequests,
    mutateAsync: mutateGetUncompleteRequests,
  } = useMutation({
    mutationFn: getUnconfirmedRequests,
  });

  const { isPending: isResendingCode, mutateAsync: mutateResendCode } =
    useMutation({
      mutationFn: ResendConfirmationCode,
    });
  const updateRequestPayment = async (values) => {
    try {
      const data = {
        token,
        ...values,
      };
      const { data: response } = await mutateChangeRequestPayment(data);
      if (response?.msg === 0) {
        toast.success(response?.msg_text);
        setSelectedRequest(null);
        fetchRequests();
        return response;
      } else {
        toast.error(response?.msg_text);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateRequestStatus = async (values) => {
    try {
      const data = {
        token,
        ...values,
      };
      const { data: response } = await mutateChangeRequestStatus(data);
      if (response?.msg === 0) {
        toast.success(response?.msg_text);
        setSelectedRequest(null);
        fetchRequests();
        return response;
      } else {
        toast.error(response?.msg_text);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRequests = async (value) => {
    try {
      const data = {
        token: token,
        ...value,
      };
      const { data: response } = await mutateGetRequests(data);

      if (response?.msg === 0) {
        setMainRequests(response?.requests);
        setRequestsCount(response?.count);
        setUrl(response?.url);
      } else {
        toast.error(response?.msg_text);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRequestsMain = async () => {
    try {
      const { data: response } = await mutateGetRequestsMain(token);

      if (response?.msg === 0) {
        setOperation_type(response?.operation_type);
        setStatus_requests(response?.status_requests);
        setPayment_to_technician_type(response?.payment_to_technician_type);
        setArray_type_payment(response?.array_type_payment);
        setRequester_type(response?.requester_type);
        setService(response?.service);
        setTechnician(response?.technician?.technicians);
        setZones(response?.zones);
      } else {
        toast.error(response?.msg_text);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUncompleteRequests = async () => {
    try {
      const { data: response } = await mutateGetUncompleteRequests(token);
      if (response?.msg === 0) {
        setUncompleteRequests(response?.count);
      } else {
        toast.error(response?.msg_text);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRequestsMain();
      fetchUncompleteRequests();
    }
  }, [token]);

  return (
    <RequestsContext.Provider
      value={{
        mainRequests,
        setMainRequests,
        requestsCount,
        selectedRequest,
        setSelectedRequest,
        isGettingRequest,
        isGettingRequestsMain,
        operation_type,
        status_requests,
        array_type_payment,
        requester_type,
        service,
        technician,
        zones,
        fetchRequests,
        fetchRequestsMain,
        updateRequestPayment,
        isChangingPayment,
        isResendingCode,
        mutateResendCode,
        uncompleteRequests,
        isGettingUncompleteRequests,
        updateRequestStatus,
        isChangingStatus,
        payment_to_technician_type,
        url,
      }}
    >
      {children}
    </RequestsContext.Provider>
  );
};

export const useRequests = () => useContext(RequestsContext);
