import API from "./api";

export const questionService = {
  getAll: () => API.get("/questions"),
  getById: (id) => API.get(`/questions/${id}`),
  create: (data) => API.post("/questions", data),
  update: (id, data) => API.put(`/questions/${id}`, data),
  delete: (id) => API.delete(`/questions/${id}`),
};
