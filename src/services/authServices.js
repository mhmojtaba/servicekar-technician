import http from "./httpservices";

export function sendOtp(phoneNumber) {
  return http.post("", {
    token: "",
    class_name: "login",
    function_name: "send_cod",
    id_project: "0",
    mobile: phoneNumber,
    type: "technician",
  });
}

export function checkOtp(data) {
  return http.post("", {
    token: "",
    class_name: "login",
    function_name: "start",
    mobile: data.phoneNumber,
    code: data.otp,
    type: "technician",
  });
}

export function userUpdate(data) {
  return http.post("", {
    token: data.token,
    class_name: "users",
    function_name: "set",
    first_name: data.first_name,
    last_name: data.last_name,
    type: "technician",
  });
}

export function settings_main(token) {
  return http.post("", {
    token: token,
    class_name: "main",
    function_name: "setting_main",
    type: "technician",
  });
}
