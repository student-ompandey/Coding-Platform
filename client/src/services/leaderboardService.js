import API from "./api";

export const leaderboardService = {
  get: () => API.get("/leaderboard"),
};
