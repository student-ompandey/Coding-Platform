import API from "./api";

export const submissionService = {
  runCode: (data) => API.post("/submissions/run", data),
  submitCode: (data) => API.post("/submissions/submit", data),
  getAll: () => API.get("/submissions"),
  getUserSubmissions: () => API.get("/submissions/user"),
};
