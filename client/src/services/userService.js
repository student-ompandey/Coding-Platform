import API from "./api";

export const userService = {
  getAll: () => API.get("/users"),
  getStats: () => API.get("/users/stats"),
  ban: (id) => API.put(`/users/${id}/ban`),
  disqualify: (id) => API.put(`/users/${id}/disqualify`),
  activate: (id) => API.put(`/users/${id}/activate`),
};
