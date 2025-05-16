// This component is used to protect the routes that are not public.
// It checks if the user is authorized to access the route and if not, redirects to notfound.
// Token validation and refresh is handled by the API interceptors.

import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const access_token = localStorage.getItem(ACCESS_TOKEN);
    const refresh_token = localStorage.getItem(REFRESH_TOKEN);

    if (access_token && refresh_token) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null; // TODO: return a loading spinner component
  }
  return isAuthorized ? children : <Navigate to="/notfound" />;
}

export default ProtectedRoute;
