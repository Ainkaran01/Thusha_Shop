
import React from "react";
import { useUser } from "@/context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DoctorAppointments from "@/components/dashboard/DoctorAppointments";
import QuickActions from "@/components/dashboard/QuickActions";
import PrescriptionDisplay from "@/components/PrescriptionDisplay";

const UserDashboard = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatarUrl || ""} alt={user.name} />
            <AvatarFallback className="text-xl">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user.name.split(' ')[0]}!</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your account
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <QuickActions />
        <DoctorAppointments />
      </div>

      {/* Prescription Details Section */}
      <PrescriptionDisplay 
        prescriptions={user.prescriptions || []} 
        title="My Prescriptions"
      />
    </div>
  );
};

export default UserDashboard;