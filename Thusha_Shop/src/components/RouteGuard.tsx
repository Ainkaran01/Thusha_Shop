// src/components/RouteGuard.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { UserRole } from '@/types/user';
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
  const { isAuthenticated, user, hasRole, initialized } = useUser();
  const location = useLocation();
  const { toast } = useToast();
  const [toastShown, setToastShown] = useState(false);

  const dashboardMap: Record<UserRole, string> = {
    admin: '/admin-dashboard',
    doctor: '/doctor-dashboard',
    delivery: '/delivery-dashboard',
    manufacturer: '/manufacturer-dashboard',
    customer: '/user-dashboard',
  };

  const isAuthorized = isAuthenticated && user && allowedRoles.some(role => hasRole(role));
  const isCustomerRoute = customersOnly && user?.role !== 'customer';

  useEffect(() => {
    if (!initialized || toastShown) return;

    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to continue.",
        variant: "destructive",
      });
    } else if (!isAuthorized) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to view this page.",
        variant: "destructive",
      });
    } else if (isCustomerRoute) {
      toast({
        title: "Customer Only",
        description: "This page is only for customers.",
        variant: "destructive",
      });
    }

    setToastShown(true);
  }, [isAuthenticated, isAuthorized, isCustomerRoute, toast, toastShown, initialized]);

  if (!initialized) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectURL = `${redirectTo}&redirect=${encodeURIComponent(location.pathname)}`;
    return <Navigate to={redirectURL} replace />;
  }

  if (!isAuthorized || isCustomerRoute) {
    const fallback = dashboardMap[user?.role as UserRole] || '/';
    if (location.pathname !== fallback) {
      return <Navigate to={fallback} replace />;
    }
    return <Outlet />;
  }

  return <Outlet />;
};

export default RouteGuard;