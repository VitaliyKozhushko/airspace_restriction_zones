import React from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/" />;
  } else {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    console.log(decodedToken.exp)
    console.log(currentTime)
    console.log(decodedToken.exp < currentTime)
    if (decodedToken.exp < currentTime) return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
