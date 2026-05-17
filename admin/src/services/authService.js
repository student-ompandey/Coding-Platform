import API from "./api";

export const authService = {
  login: (email, password) => API.post("/auth/login", { email, password }),
  register: (data) => API.post("/auth/register", data),
  getProfile: () => API.get("/auth/me"),
};
