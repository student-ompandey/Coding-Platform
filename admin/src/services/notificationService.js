import API from "./api";

export const notificationService = {
  getAll: () => API.get("/notifications"),
  create: (data) => API.post("/notifications", data),
};
