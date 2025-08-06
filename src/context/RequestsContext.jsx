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
  get_address_with_mobile,
  getByBarcode,
  addUpdateRequest,
  completeRequestByTechnician,
  getInvoiceData,
} from "@/services/requestsServices";
import { toast } from "react-toastify";
import { unreadCount } from "@/services/messageService";

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
  const [brands, setBrands] = useState([]);
  const [brand_models, setBrand_models] = useState([]);
  const [garanti_type_request, setGaranti_type_request] = useState([]);
  const [install_garanti_type_request, setInstall_garanti_type_request] =
    useState([]);
  const [garanti_sherkati, setGaranti_sherkati] = useState([]);
  const [status_requests_technician, setStatus_requests_technician] = useState(
    []
  );
  const [technician_report, setTechnician_report] = useState([]);
  const [message_confirm_work, setMessage_confirm_work] = useState("");
  const [suggestedAddresses, setSuggestedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [reasonBlock, setReasonBlock] = useState(null);

  const [unreadMessagesCount, setUnreadMessagesCount] = useState(null);

  const [incompleteRequests, setIncompleteRequests] = useState([]);
  const [payment_to_technician_type, setPayment_to_technician_type] = useState(
    []
  );

  const [invoiceData, setInvoiceData] = useState([]);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [technician_travel_cost, setTechnician_travel_cost] = useState(0);

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
    isPending: isGettingIncompleteRequests,
    mutateAsync: mutateGetIncompleteRequests,
  } = useMutation({
    mutationFn: getUnconfirmedRequests,
  });

  const { isPending: isResendingCode, mutateAsync: mutateResendCode } =
    useMutation({
      mutationFn: ResendConfirmationCode,
    });

  const {
    isPending: isGettingAddress,
    mutateAsync: mutateGetAddressWithMobile,
  } = useMutation({
    mutationFn: get_address_with_mobile,
  });

  const {
    isPending: isGettingDeviceWithBarcode,
    mutateAsync: mutateGetDeviceWithBarcode,
  } = useMutation({
    mutationFn: getByBarcode,
  });

  const { isPending: isUpdating, mutateAsync: mutateAddUpdateRequest } =
    useMutation({
      mutationFn: addUpdateRequest,
    });

  const {
    isPending: isCompleteRequestByTechnician,
    mutateAsync: mutateCompleteRequestByTechnician,
  } = useMutation({
    mutationFn: completeRequestByTechnician,
  });

  const { isPending: isGettingUnreadCount, mutateAsync: mutateUnreadCount } =
    useMutation({
      mutationFn: unreadCount,
    });

  const { isPending: isGettingInvoiceData, mutateAsync: mutateGetInvoiceData } =
    useMutation({
      mutationFn: getInvoiceData,
    });

  const fetchInvoiceData = async (order_id) => {
    try {
      const data = {
        token,
        order_id,
      };
      const { data: response } = await mutateGetInvoiceData(data);
      if (response?.msg === 0) {
        setInvoiceData(response?.order);
        setInvoiceItems(response?.items);
      } else {
        toast.error(response?.msg_text);
      }
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const getDeviceWithBarcode = async (barcode) => {
    try {
      const data = {
        token,
        barcode,
      };
      const { data: response } = await mutateGetDeviceWithBarcode(data);
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const addUpdateRequests = async (values) => {
    try {
      const data = {
        token,
        ...values,
        id: selectedRequest ? selectedRequest.id : 0,
      };
      const { data: response } = await mutateAddUpdateRequest(data);
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

  const getAddressWithMobile = async (values) => {
    try {
      const data = {
        token,
        ...values,
      };
      const { data: response } = await mutateGetAddressWithMobile(data);

      if (response?.msg === 0) {
        setSuggestedAddresses(response?.value);
      } else {
        toast.error(response?.msg_text);
        setReasonBlock(response?.reason_block);
      }
      return response;
    } catch (error) {
      console.error(error);
    }
  };

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
        setBrands(response?.brands);
        setBrand_models(response?.brand_models);
        setGaranti_type_request(response?.garanti_type_request);
        setMessage_confirm_work(response?.message_confirm_work);
        setStatus_requests_technician(response?.status_requests_technician);
        setInstall_garanti_type_request(response?.install_garanti_type_request);
        setGaranti_sherkati(response?.garanti_sherkati);
        setTechnician_travel_cost(response?.technician_travel_cost);
        setTechnician_report(response?.technician_report);
      } else {
        toast.error(response?.msg_text);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchIncompleteRequests = async () => {
    try {
      const { data: response } = await mutateGetIncompleteRequests(token);

      if (response?.msg === 0) {
        setIncompleteRequests(response?.count);
      } else {
        toast.error(response?.msg_text);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUnreadMessagesCount = async () => {
    try {
      const { data: response } = await mutateUnreadCount(token);

      if (response?.msg === 0) {
        setUnreadMessagesCount(response?.count);
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
      fetchIncompleteRequests();
      fetchUnreadMessagesCount();
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
        incompleteRequests,
        isGettingIncompleteRequests,
        updateRequestStatus,
        isChangingStatus,
        payment_to_technician_type,
        url,
        brands,
        brand_models,
        garanti_type_request,
        message_confirm_work,
        suggestedAddresses,
        setSuggestedAddresses,
        selectedAddress,
        setSelectedAddress,
        reasonBlock,
        setReasonBlock,
        isGettingAddress,
        getAddressWithMobile,
        getDeviceWithBarcode,
        isGettingDeviceWithBarcode,
        addUpdateRequests,
        isUpdating,
        status_requests_technician,
        isCompleteRequestByTechnician,
        mutateCompleteRequestByTechnician,
        install_garanti_type_request,
        garanti_sherkati,
        unreadMessagesCount,
        isGettingUnreadCount,
        fetchUnreadMessagesCount,
        fetchInvoiceData,
        isGettingInvoiceData,
        invoiceData,
        invoiceItems,
        fetchIncompleteRequests,
        technician_travel_cost,
        technician_report,
      }}
    >
      {children}
    </RequestsContext.Provider>
  );
};

export const useRequests = () => useContext(RequestsContext);
