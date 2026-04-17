import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
  role?: "user" | "partner" | "admin";
};

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;