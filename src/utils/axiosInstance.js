// src/utils/axiosInstance.js
// ─── Axios — pre-configured instance ─────────────────────────────────────────
// Used for: Firebase REST API calls, future backend endpoints, notification APIs
import axios from "axios";
import { auth } from "../firebase";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach Firebase ID token to every request ───────────
axiosInstance.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.params = { ...(config.params || {}), auth: token };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: normalise errors ───────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error?.message ||
      error.message ||
      "An unknown error occurred";
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;