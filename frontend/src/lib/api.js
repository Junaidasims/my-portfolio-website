/**
 * Axios client for the portfolio API.
 * Attaches JWT from localStorage when present.
 */
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

const TOKEN_KEY = "portfolio_jwt";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

export function assetUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${baseURL}${path.startsWith("/") ? path : `/${path}`}`;
}
