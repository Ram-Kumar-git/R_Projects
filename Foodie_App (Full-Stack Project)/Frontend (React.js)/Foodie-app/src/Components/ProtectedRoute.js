import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ adminOnly = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      setErrorMessage("You need to log in first.");
      return;
    }

    // Extract email from token
    try {
      const tokenParts = token.split(".");
      const payload = JSON.parse(atob(tokenParts[1])); // Decode base64 payload
      setUserEmail(payload.email); // Extract email from payload

      // Admin-only check
      if (adminOnly && payload.email !== "Adminfoodie@gmail.com") {
        setIsAuthenticated(false);
        return;
      }

      // Validate token with backend
      axios
        .get("http://localhost:8080/api/users/validate-token", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => setIsAuthenticated(true))
        .catch(() => {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setErrorMessage("Session expired. Please log in again.");
          navigate("/");
        });
    } catch (error) {
      console.error("Invalid token format", error);
      setIsAuthenticated(false);
      navigate("/");
    }
  }, [navigate, adminOnly]);

  if (isAuthenticated === null) return <p>Loading...</p>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
