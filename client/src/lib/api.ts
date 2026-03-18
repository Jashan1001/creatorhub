import axios from "axios";

const api = axios.create({
  baseURL:         import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",
  withCredentials: true,   // send httpOnly cookie on every request
});

// Response interceptor — on 401 redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;