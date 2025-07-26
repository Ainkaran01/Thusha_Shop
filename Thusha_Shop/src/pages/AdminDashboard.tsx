
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import dashboard components
import DashboardHeader from "@/components/admin/DashboardHeader";
import AdminTabContent from "@/components/admin/AdminTabContent";
import StaffAccountManager from "@/components/admin/StaffAccountManager";
import { AdminDashboardProvider } from "@/context/AdminDashboardContext";

const AdminDashboard = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [activeTab, setActiveTab] = useState("overview");
  const { isAuthenticated, user } = useUser();
  const navigate = useNavigate();

  // Redirect if not authenticated admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate('/account?login=true');
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
      <AdminDashboardProvider>
        <DashboardHeader 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          setActiveTab={setActiveTab} 
        />

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sale">Point Of Sale</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="customers">Users</TabsTrigger>
            <TabsTrigger value="contactus">Contactus</TabsTrigger>
            <TabsTrigger value="settings">Account</TabsTrigger>
          </TabsList>
          
          <StaffAccountManager>
            <AdminTabContent 
              viewMode={viewMode} 
              setActiveTab={setActiveTab} 
            />
          </StaffAccountManager>
        </Tabs>
      </AdminDashboardProvider>
    </div>
  );
};

export default AdminDashboard;
