import React from "react";
import { Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { isAuthenticated, getCurrentUser, UserRole } from "@/services/auth";
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  const user = getCurrentUser();
  if (requiredRole && user?.role !== requiredRole) {
    // If user is admin but on a brand page, we might allow it, 
    // but if brand_owner is trying to access /admin, we definitely block.
    if (requiredRole === 'admin' && user?.role !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
  }
  return <AppLayout container>{children}</AppLayout>;
}