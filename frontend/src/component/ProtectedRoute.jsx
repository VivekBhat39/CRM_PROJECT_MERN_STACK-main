import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isLogin = localStorage.getItem("email");

  return isLogin ? children : <Navigate to={"/login"} />;
}

export default ProtectedRoute;
