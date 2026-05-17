import API from "./api";

export const contestService = {
  getAll: () => API.get("/contests"),
  getActive: () => API.get("/contests/active"),
  create: (data) => API.post("/contests", data),
  update: (id, data) => API.put(`/contests/${id}`, data),
  start: (id) => API.put(`/contests/${id}/start`),
  end: (id) => API.put(`/contests/${id}/end`),
  pause: (id) => API.put(`/contests/${id}/pause`),
  join: (id) => API.post(`/contests/${id}/join`),
};
