
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { UserRole } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

interface RouteGuardProps {
  allowedRoles: UserRole[];
  redirectTo?: string;
  customersOnly?: boolean;
}

const RouteGuard: React.FC<RouteGuardProps> = ({
  allowedRoles,
  redirectTo = '/account?login=true',
  customersOnly = false,
}) => {
  const { isAuthenticated, user, hasRole } = useUser();
  const location = useLocation();
  const { toast } = useToast();
  // Add a state to prevent infinite redirects
  const [hasShownToast, setHasShownToast] = useState(false);
  
  // Check authentication and permissions
  const isAuthorized = isAuthenticated && user && allowedRoles.some(role => hasRole(role));
  const isCustomerRoute = customersOnly && user?.role !== "customer";
  
  // Use useEffect to show toast notifications to avoid re-render loops
  useEffect(() => {
    // Only show toast once to prevent multiple renders triggering toasts repeatedly
    if (!hasShownToast) {
      if (!isAuthenticated) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access this page",
          variant: "destructive",
        });
        setHasShownToast(true);
      } else if (!isAuthorized) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page",
          variant: "destructive",
        });
        setHasShownToast(true);
      } else if (isCustomerRoute) {
        toast({
          title: "Access Denied",
          description: "This page is only available for customers",
          variant: "destructive",
        });
        setHasShownToast(true);
      }
    }
  }, [isAuthenticated, isAuthorized, isCustomerRoute, toast, hasShownToast]);

  // Prevent redirect loops by checking if we're already on the redirect path
  if (!isAuthenticated) {
    // Extract the base path from redirectTo (before any query params)
    const redirectBase = redirectTo.split('?')[0];
    
    // Only redirect if we're not already on the target path
    if (location.pathname !== redirectBase) {
      // Include the redirect parameter but avoid overcomplicating the URL
      const targetPath = `${redirectTo}&redirect=${encodeURIComponent(location.pathname)}`;
      return <Navigate to={targetPath} replace />;
    }
    // If already on the redirect page, just show the page (no further redirection)
    return <Outlet />;
  }

  // If authenticated but doesn't have the required role
  if (!isAuthorized || isCustomerRoute) {
    // Redirect to appropriate dashboard based on role
    if (user) {
      if (user.role === "admin") {
        return <Navigate to="/admin-dashboard" replace />;
      } else if (user.role === "doctor") {
        return <Navigate to="/doctor-dashboard" replace />;
      } else if (user.role === "delivery") {
        return <Navigate to="/delivery-dashboard" replace />;
      }
    }
    
    // Default redirect to home if no specific dashboard available
    if (location.pathname !== '/') {
      return <Navigate to="/" replace />;
    }
    return <Outlet />; // Already at home, just render
  }

  // User is authenticated and has the correct role
  return <Outlet />;
};

export default RouteGuard;
