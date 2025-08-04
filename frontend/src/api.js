// Request authentication handler.
// The main axios instance injects an access token in the request headers.
// If the token is expired or close to expiring, the secondary axios instance 
// refresh both access and refresh tokens.
// There is a queue to prevent multiple requests from being sent while a token
// is being refreshed.
// If the refresh fails, the user is redirected to the login page.

import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import { jwtDecode } from "jwt-decode";

// Main axios instance. This is used for all requests.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});
// Separate axios instance for token refresh.
const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});


// Add token refresh queue and flag
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  async (config) => {
    console.log("API Request Interceptor", config.url);
    let token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // If token is expired or close to expiring (within 30 seconds)
      if (decoded.exp < currentTime + 30) {
        // If we're already refreshing the token, add this request to the queue
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              config.headers.Authorization = `Bearer ${token}`;
              return config;
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }

        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem(REFRESH_TOKEN);

          // Check if refresh token exists
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await refreshApi.post("/auth/token/refresh/", {
            refresh: refreshToken
          });

          // If the response is successful, update the tokens in local storage.
          if (response.status === 200 && response.data.access && response.data.refresh) {
            // Update the tokens in local storage
            localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
            const newAccessToken = response.data.access;
            localStorage.setItem(ACCESS_TOKEN, newAccessToken);

            // Update the current request's authorization header
            config.headers.Authorization = `Bearer ${newAccessToken}`;

            // Process all queued requests with the new token
            processQueue(null, newAccessToken);

            return config;
          }
        } catch (error) {
          // If refresh fails, clear tokens and reject all queued requests
          processQueue(error, null);
          localStorage.removeItem(ACCESS_TOKEN);
          localStorage.removeItem(REFRESH_TOKEN);
          window.location.href = "/";
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }

      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error is due to an expired refresh token or authentication problem
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // If we're already refreshing the token, add this request to the queue
      if (error.config.url.includes('/auth/token/refresh/')) {
        // If we get here, the refresh token is invalid
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        window.location.href = "/";
        return Promise.reject(error);
      }

      alert("Session expired - please log in again");
      console.log("Authentication error - redirecting to login page");

      // Clear auth tokens
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);

      // Redirect to home page
      window.location.href = "/";
    }

    // Let other types of errors pass through to be handled by components
    return Promise.reject(error);
  }
);

export default api;
export { refreshApi };