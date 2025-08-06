import http from "./httpservices";

export function getMessages(token) {
  return http.post("", {
    token: token,
    class_name: "messages",
    cnt_group: "service",
    function_name: "get_messages",
    caller_type: "technician",
    type: "technician",
  });
}

export function sendMessage(data) {
  return http.post("", {
    token: data.token,
    class_name: "messages",
    cnt_group: "service",
    function_name: "send_message",
    sender_type: "technician",
    receiver_type: "admin",
    receiver_ids: [],
    content: data.content,
    type: "technician",
  });
}

export function unreadCount(token) {
  return http.post("", {
    token: token,
    class_name: "messages",
    cnt_group: "service",
    function_name: "unread_count",
    caller_type: "technician",
    type: "technician",
  });
}

// get today quotes
export function getTodayQuotes(token) {
  return http.post("", {
    token: token,
    class_name: "quotes",
    cnt_group: "service",
    function_name: "get_today",
    type: "technician",
  });
}
