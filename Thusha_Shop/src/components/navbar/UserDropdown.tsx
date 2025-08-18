
import React from "react";
import { Link } from "react-router-dom";
import { User, Home, Package, Activity, Settings } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUser } from "../../context/UserContext";

interface UserDropdownProps {
  isAdminPath: boolean;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ isAdminPath }) => {
  const { user, isAuthenticated, logout, hasRole } = useUser();
  const isCustomer = user?.role === "customer";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {isAuthenticated && user ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.profilePhoto || ""} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          ) : (
            <User className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {isAuthenticated ? (
          <>
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Customer-only dashboard and order tracking */}
            {isCustomer && !isAdminPath && (
              <>
                <DropdownMenuItem asChild>
                  <Link to="/user-dashboard" className="flex cursor-pointer items-center">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/order-tracking" className="flex cursor-pointer items-center">
                    <Package className="mr-2 h-4 w-4" />
                    <span>Order Tracking</span>
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            
            {/* Admin dashboards */}
            {hasRole("admin") && (
              <>
                <DropdownMenuItem asChild>
                  <Link to="/admin-dashboard" className="flex cursor-pointer items-center">
                    <Activity className="mr-2 h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            
            {/* Manufacturer dashboard */}
            {hasRole("manufacturer") && (
              <DropdownMenuItem asChild>
                <Link to="/manufacturer-dashboard" className="flex cursor-pointer items-center">
                  <Package className="mr-2 h-4 w-4" />
                  <span>Manufacturer Dashboard</span>
                </Link>
              </DropdownMenuItem>
            )}
            
            {/* Doctor dashboard */}
            {hasRole("doctor") && (
              <DropdownMenuItem asChild>
                <Link to="/doctor-dashboard" className="flex cursor-pointer items-center">
                  <Activity className="mr-2 h-4 w-4" />
                  <span>Doctor Dashboard</span>
                </Link>
              </DropdownMenuItem>
            )}
            
            {/* Delivery dashboard */}
            {hasRole("delivery") && (
              <DropdownMenuItem asChild>
                <Link to="/delivery-dashboard" className="flex cursor-pointer items-center">
                  <Activity className="mr-2 h-4 w-4" />
                  <span>Delivery Dashboard</span>
                </Link>
              </DropdownMenuItem>
            )}
              {isCustomer && (
            <DropdownMenuItem asChild>
              <Link to="/account" className="flex cursor-pointer items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </Link>
            </DropdownMenuItem>)
}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-destructive focus:text-destructive">
              Logout
            </DropdownMenuItem> 
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link to="/account?login=true" className="flex cursor-pointer items-center">
                Login
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/account?register=true" className="flex cursor-pointer items-center">
                Register
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
