
import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Info, MapPin, Home, Package, Activity, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUser } from "../../context/UserContext";

interface MobileMenuProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  isAdminPath: boolean;
  handleBookAppointment: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isMenuOpen,
  toggleMenu,
  isAdminPath,
  handleBookAppointment,
}) => {
  const { user, isAuthenticated, logout, hasRole } = useUser();
  const isCustomer = user?.role === "customer";

  if (!isMenuOpen) return null;

  return (
    <div className="fixed inset-0 top-[57px] mobile-navbar-overlay z-50 md:hidden animate-in fade-in slide-in-from-top-5">
    <div className="container h-[calc(100vh-57px)] mx-auto px-4 py-6 bg-black/80 backdrop-blur-lg text-white flex flex-col">

        <div className="flex-1 overflow-y-auto pb-20">
          {isAuthenticated && (
            <div className="flex items-center space-x-3 py-4 mb-4 border-b border-white/10">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user?.profilePhoto || ""} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-white">{user?.name}</p>
                <p className="text-sm text-gray-300">{user?.email}</p>
                <p className="text-xs capitalize bg-accent px-2 py-0.5 rounded-full inline-block mt-1">{user?.role}</p>
              </div>
            </div>
          )}

          <nav className="space-y-6">
            {/* Navigation links for regular users */}
            {!isAdminPath && (
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-medium text-gray-400 tracking-wider">Navigation</h3>
                
                <Link
                  to="/catalog"
                  className="flex items-center py-2 px-2 rounded-md hover:bg-white/10 text-white"
                  onClick={toggleMenu}
                >
                  <span>Eyeglasses</span>
                </Link>
                <Link
                  to="/face-shape"
                  className="flex items-center py-2 px-2 rounded-md hover:bg-white/10 text-white"
                  onClick={toggleMenu}
                >
                  <span>Face Shape</span>
                </Link>
                <Link
                  to="/vision-test"
                  className="flex items-center py-2 px-2 rounded-md hover:bg-white/10 text-white"
                  onClick={toggleMenu}
                >
                  <span>Vision Test</span>
                </Link>
                <button
                  onClick={() => {
                    toggleMenu();
                    handleBookAppointment();
                  }}
                  className="flex items-center py-2 px-2 w-full text-left rounded-md hover:bg-white/10 text-white"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  <span>Book Appointment</span>
                </button>
                <Link
                  to="/about"
                  className="flex items-center py-2 px-2 rounded-md hover:bg-white/10 text-white"
                  onClick={toggleMenu}
                >
                  <Info className="mr-2 h-5 w-5" />
                  <span>About</span>
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center py-2 px-2 rounded-md hover:bg-white/10 text-white"
                  onClick={toggleMenu}
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  <span>Contact</span>
                </Link>
              </div>
            )}

            {isAuthenticated ? (
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-medium text-gray-400 tracking-wider">Account</h3>
                
                {/* Customer-only dashboard and order tracking */}
                {isCustomer && !isAdminPath && (
                  <>
                    <Link
                      to="/user-dashboard"
                      className="flex items-center py-2 px-2 rounded-md hover:bg-white/10 text-white"
                      onClick={toggleMenu}
                    >
                      <Home className="mr-2 h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/order-tracking"
                      className="flex items-center py-2 px-2 rounded-md hover:bg-white/10 text-white"
                      onClick={toggleMenu}
                    >
                      <Package className="mr-2 h-5 w-5" />
                      <span>Order Tracking</span>
                    </Link>
                  </>
                )}
                
                {/* Admin dashboards */}
                {hasRole("admin") && (
                  <>
                    <Link
                      to="/admin-dashboard"
                      className="flex items-center py-2 px-2 rounded-md hover:bg-white/10 text-white"
                      onClick={toggleMenu}
                    >
                      <Activity className="mr-2 h-5 w-5" />
                      <span>Admin Dashboard</span>
                    </Link>
                    <Link
                      to="/manufacturer-dashboard"
                      className="flex items-center py-2 px-2 rounded-md hover:bg-white/10 text-white"
                      onClick={toggleMenu}
                    >
                      <Package className="mr-2 h-5 w-5" />
                      <span>Manufacturer Dashboard</span>
                    </Link>
                  </>
                )}
                
                {/* Doctor dashboard */}
                {hasRole("doctor") && (
                  <Link
                    to="/doctor-dashboard"
                    className="flex items-center py-2 px-2 rounded-md hover:bg-white/10 text-white"
                    onClick={toggleMenu}
                  >
                    <Activity className="mr-2 h-5 w-5" />
                    <span>Doctor Dashboard</span>
                  </Link>
                )}
                
                {/* Delivery dashboard */}
                {hasRole("delivery") && (
                  <Link
                    to="/delivery-dashboard"
                    className="flex items-center py-2 px-2 rounded-md hover:bg-white/10 text-white"
                    onClick={toggleMenu}
                  >
                    <Activity className="mr-2 h-5 w-5" />
                    <span>Delivery Dashboard</span>
                  </Link>
                )}
                
                <Link
                  to="/account"
                  className="flex items-center py-2 px-2 rounded-md hover:bg-white/10 text-white"
                  onClick={toggleMenu}
                >
                  <Settings className="mr-2 h-5 w-5" />
                  <span>Account Settings</span>
                </Link>
                
                <button
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                  className="flex items-center py-2 px-2 w-full text-left text-red-400 rounded-md hover:bg-white/10"
                >
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-medium text-gray-400 tracking-wider">Account</h3>
                
                <Link
                  to="/account?login=true"
                  className="flex items-center py-2 px-2 rounded-md hover:bg-white/10 text-white"
                  onClick={toggleMenu}
                >
                  <span>Login</span>
                </Link>
                <Link
                  to="/account?register=true"
                  className="flex items-center py-2 px-2 rounded-md hover:bg-white/10 text-white"
                  onClick={toggleMenu}
                >
                  <span>Register</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
