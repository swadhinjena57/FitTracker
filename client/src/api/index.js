import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 15_000,
});

export const UserSignUp = (data) => API.post("/user/signup", data);
export const UserSignIn = (data) => API.post("/user/signin", data);

export const getCurrentUser = (token) =>
  API.get("/user/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateProfile = (token, data) =>
  API.patch("/user/profile", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const changePassword = (token, data) =>
  API.patch("/user/password", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getDashboardDetails = (token) =>
  API.get("/user/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getWorkouts = (token, date = "") =>
  API.get(`/user/workout${date ? `?date=${encodeURIComponent(date)}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addWorkout = (token, data) =>
  API.post("/user/workout", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
