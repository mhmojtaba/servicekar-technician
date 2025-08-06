import http from "./httpservices";

export function getRequests(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "register_data",
    get_count: 1,
    type: "technician",
    ...data,
  });
}

export function getRequestsMain(token) {
  return http.post("", {
    token: token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "main",
    type: "technician",
  });
}

export function addUpdateRequest(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "register_service_request",
    registered_by_type: "technician",
    type: "technician",
    ...data,
  });
}

export function assignTechnician(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "assign_technician",
    type: "technician",
    ...data,
  });
}

export function changeRequestStatus(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "update_status",
    type: "technician",
    ...data,
  });
}

export function changeRequestPayment(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "update_payment_status",
    type: "technician",
    ...data,
  });
}

export function addLocation(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "add_location",
    type: "technician",
    ...data,
  });
}

export function getUnconfirmedRequests(token) {
  return http.post("", {
    token: token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "get_uncompleted_count",
    type: "technician",
  });
}

export function ResendConfirmationCode(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "send_code",
    order_id: data.order_id,
    type: "technician",
  });
}

export function ConfirmRequest(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "confirm_invoice",
    type: "technician",
    ...data,
  });
}

export function getDeviceTags(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "list_device_tags",
    order_id: data.order_id,
    type: "technician",
  });
}

export function register_device_tags(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "register_device_tags",
    type: "technician",
    ...data,
  });
}

export function cancel_device_tag(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "cancel_device_tag",
    type: "technician",
    ...data,
  });
}

export function register_invoice(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "register_invoice",
    type: "technician",
    ...data,
  });
}

export function addFile(data) {
  const formData = new FormData();

  formData.append("class_name", "main");
  formData.append("function_name", "add_file");
  formData.append("token", data.token);
  formData.append("file", data.file);

  return http.post("", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function getTasks(data) {
  return http.post("", {
    token: data.token,
    class_name: "tasks",
    cnt_group: "service",
    function_name: "tasks_data",
    id_service: data.id_service,
    active: 1,
    type: "technician",
  });
}

export function getParts(data) {
  return http.post("", {
    token: data.token,
    class_name: "parts",
    cnt_group: "service",
    function_name: "parts_data",
    id_service: data.id_service,
    active: 1,
    type: "technician",
  });
}

export function get_address_with_mobile(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "get_with_mobile",
    mobile: data.mobile,
    type: "technician",
  });
}

export function getByBarcode(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "get_by_barcode",
    barcode: data.barcode,
    type: "technician",
  });
}

// chart_review_report
export function chart_review_report(data) {
  // تبدیل تاریخ‌ها به فرمت مناسب
  const formatDate = (date) => {
    if (!date) return null;
    if (typeof date === "string") return date;
    if (date.format) return date.format("YYYY-MM-DD");
    return date;
  };

  return http.post("", {
    token: data.token,
    class_name: "reviews",
    cnt_group: "service",
    function_name: "chart_review_report",
    type_report: data.type_report,
    start_time: formatDate(data.start_time),
    end_time: formatDate(data.end_time),
    group_type: data.group_type, // daily | weekly | monthly | yearly
    type: "technician",
  });
}

export function completeRequestByTechnician(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "complete_request_by_technician",
    type: "technician",
    ...data,
  });
}

export function setPeriodicService(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "set_periodic_service",
    order_id: data.order_id,
    service_period_months: data.service_period_months,
    type: "technician",
  });
}

export function getInvoiceData(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "get_invoice_details",
    order_id: data.order_id,
    type: "technician",
  });
}

// rating
export function getRatingData(token) {
  return http.post("", {
    token: token,
    class_name: "reviews",
    cnt_group: "service",
    function_name: "get_reviews_summary",
    type: "technician",
  });
}
