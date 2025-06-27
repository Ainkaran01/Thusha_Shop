
import React from "react";
import { Truck, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface DeliveryHeaderProps {
  user: { name: string } | null;
}

const DeliveryHeader: React.FC<DeliveryHeaderProps> = ({ user }) => {
  const { logout } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/");
  };
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Truck className="mr-2 h-8 w-8" /> Delivery Dashboard
        </h1>
        <p className="text-muted-foreground">Manage your deliveries and track orders</p>
      </div>
      
      <div className="flex items-center space-x-4 mt-4 md:mt-0">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mr-2">
            {user?.name.charAt(0)}
          </div>
          <span>{user?.name}</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-1" /> Logout
        </Button>
      </div>
    </div>
  );
};

export default DeliveryHeader;
