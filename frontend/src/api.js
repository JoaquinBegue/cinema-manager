// This file is used to manage the requests made to the backend.
// It includes the JWT tokens into the request's headers.
// It also refreshes the token.

import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import { jwtDecode } from "jwt-decode";

// Create a separate axios instance for token refresh
const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // If token is expired or close to expiring (within 30 seconds)
      if (decoded.exp < currentTime + 30) {
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
            // IMPORTANT: Refresh token updating needed due to token rotation and blacklisting.
            localStorage.setItem(REFRESH_TOKEN, response.data.refresh);

            // Update the access token in local storage and in the request header.
            const newAccessToken = response.data.access;
            localStorage.setItem(ACCESS_TOKEN, newAccessToken);
            config.headers.Authorization = `Bearer ${newAccessToken}`;
            return config;
          }
        } catch (error) {
          console.log("Error refreshing token:", error);
          localStorage.removeItem(ACCESS_TOKEN);
          localStorage.removeItem(REFRESH_TOKEN);
          window.location.href = "/";
          return Promise.reject(error);
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
      console.log("Authentication error - redirecting to login page");

      // Clear auth tokens
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);

      // Redirect to home page
      window.location.href = "/";

      // Return a resolved promise to prevent error propagation
      // This will stop any alert from showing in catch blocks
      return Promise.resolve({ silent_auth_error: true });
    }

    // Let other types of errors pass through to be handled by components
    return Promise.reject(error);
  }
);

export default api;
export { refreshApi };