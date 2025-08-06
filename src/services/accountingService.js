import http from "./httpservices";

export function list_payment_to_technician(data) {
  return http.post("", {
    token: data.token,
    class_name: "accounting",
    cnt_group: "service",
    function_name: "list_payment",
    type: "technician",
    get_count: 1,
    ...data,
  });
}
