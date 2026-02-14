import React, { JSX } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
  allowedRole: "ADMIN" | "CANDIDATE";
}

const ProtectedRoute: React.FC<Props> = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
