import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // Matches backend port
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers["x-auth-token"] = token; // Matches backend header expectation
  }
  return req;
});

export default API;