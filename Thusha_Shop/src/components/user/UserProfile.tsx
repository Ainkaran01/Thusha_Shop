import React ,{ useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/context/UserContext";
import AccountTabs from "@/components/account/AccountTabs";
import { Card } from "@/components/ui/card";
import ProfileInformation from "@/components/user/ProfileInformation";

const UserProfile = () => {
  const { user} = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  // Format the creation date with proper error handling
  const formatCreationDate = () => {
    if (!user.created_at) return "Not available";
    
    try {
      const date = new Date(user.created_at);
      if (isNaN(date.getTime())) return "Invalid date";
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Not available";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="md:w-1/4 flex flex-col items-center">
          <Avatar className="h-32 w-32 mb-4">
            <AvatarImage src={user.avatarUrl || ""} alt={user.name} />
            <AvatarFallback className="text-3xl">
              {user.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          
          <h1 className="text-2xl font-bold text-center">
            {user.name || "User"}
          </h1>
          
          <p className="text-muted-foreground text-center">
            {user.email || "No email provided"}
          </p>
          
          <p className="text-sm text-muted-foreground text-center mt-1">
            Member since {formatCreationDate()}
          </p>
          
          <Button 
            variant="outline" 
            className="mt-4 w-full"
            onClick={() => navigate("/user-dashboard")}
          >
            Go to Dashboard
          </Button>
        </div>
        
        <Separator className="md:hidden" />
        
        <div className="md:w-3/4">
          <AccountTabs defaultTab="profile">
            <Card>
              <ProfileInformation />
            </Card>
          </AccountTabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;