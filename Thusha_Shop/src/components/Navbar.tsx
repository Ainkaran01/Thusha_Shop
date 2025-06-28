
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useUser } from "../context/UserContext";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { useToast } from "./ui/use-toast";
import DesktopNavigation from "./navbar/DesktopNavigation";
import UserDropdown from "./navbar/UserDropdown";
import MobileMenu from "./navbar/MobileMenu";
import ShopIcons from "./navbar/ShopIcons";

const Navbar = () => {
  const { isAuthenticated } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  // Check if user is on admin-related paths
  const isAdminPath = location.pathname.includes('admin-dashboard') ||
    location.pathname.includes('doctor-dashboard') ||
    location.pathname.includes('delivery-dashboard') ||
    location.pathname.includes('manufacturer-dashboard');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Add scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle booking appointment when not logged in
  const handleBookAppointment = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to book an appointment with our doctors.",
        variant: "destructive",
      });
      navigate("/account?login=true&redirect=/doctor-appointment");
      return;
    }
    navigate("/doctor-appointment");
  };

  // Handle wishlist and cart navigation when not logged in
  const handleWishlistNavigation = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast({
        title: "Login Required",
        description: "Please log in to view your wishlist.",
        variant: "destructive",
      });
      navigate("/account?login=true&redirect=/wishlist");
      return;
    }
  };

  const handleCartNavigation = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast({
        title: "Login Required",
        description: "Please log in to view your cart.",
        variant: "destructive",
      });
      navigate("/account?login=true&redirect=/cart");
      return;
    }
  };

  // Only show shop-related links (wishlist, cart) for regular users, not on admin pages
  const showShopLinks = !isAdminPath;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 backdrop-blur-sm border-b",
        isScrolled
          ? "bg-background/80 shadow-sm py-2"
          : "bg-background py-4"
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div
          className={cn(
            "text-2xl font-bold flex items-center space-x-2 transition-all duration-300",
            isScrolled ? "scale-90" : ""
          )}
        >
          <span className="text-primary">Thusha</span>
          <span className="border-l-2 border-muted-foreground pl-2">Optical</span>
        </div>

        {/* Desktop Navigation */}
        <DesktopNavigation
          isAdminPath={isAdminPath}
          handleBookAppointment={handleBookAppointment}
        />

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center space-x-2">
          <ThemeToggle />
          <UserDropdown isAdminPath={isAdminPath} />
          {showShopLinks && (
            <ShopIcons
              handleWishlistNavigation={handleWishlistNavigation}
              handleCartNavigation={handleCartNavigation}
            />
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />

          {/* Only show cart and wishlist for regular users */}
          {showShopLinks && (
            <ShopIcons
              handleWishlistNavigation={handleWishlistNavigation}
              handleCartNavigation={handleCartNavigation}
            />
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={toggleMenu}
            className="ml-1"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          isAdminPath={isAdminPath}
          handleBookAppointment={handleBookAppointment}
        />
      </div>
    </header>
  );
};

export default Navbar;
