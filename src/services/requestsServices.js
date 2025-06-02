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
  });
}

export function addUpdateRequest(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "register_service_request",
    registered_by_type: "technician",
    ...data,
  });
}

export function assignTechnician(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "assign_technician",
    ...data,
  });
}

export function changeRequestStatus(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "update_status",
    ...data,
  });
}

export function changeRequestPayment(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "update_payment_status",
    ...data,
  });
}

export function addLocation(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "add_location",
    ...data,
  });
}

export function getUnconfirmedRequests(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "get_uncompleted_count",
    id_technician: 0,
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
  });
}

export function ConfirmRequest(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "confirm_invoice",
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
  });
}

export function register_device_tags(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "register_device_tags",
    ...data,
  });
}

export function cancel_device_tag(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "cancel_device_tag",
    ...data,
  });
}

export function register_invoice(data) {
  return http.post("", {
    token: data.token,
    class_name: "requests",
    cnt_group: "service",
    function_name: "register_invoice",
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
