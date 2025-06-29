
import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Info, MapPin } from "lucide-react";

interface DesktopNavigationProps {
  isAdminPath: boolean;
  handleBookAppointment: () => void;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  isAdminPath,
  handleBookAppointment,
}) => {
  if (isAdminPath) return null;

  return (
    <nav className="hidden md:flex space-x-6">
      <Link
        to="/"
        className="nav-link font-medium text-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
      >
        Home
      </Link>
      <Link
        to="/catalog"
        className="nav-link font-medium text-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
      >
        Eyeglasses
      </Link>
      <Link
        to="/face-shape"
        className="nav-link font-medium text-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
      >
        Face Shape
      </Link>
      {/* <Link
        to="/vision-test"
        className="nav-link font-medium text-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
      >
        Vision Test
      </Link> */}
      <button
        onClick={handleBookAppointment}
        className="nav-link font-medium text-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full flex items-center"
      >
        <Calendar className="mr-1 h-4 w-4" />
        Book Appointment
      </button>
      <Link
        to="/about"
        className="nav-link font-medium text-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full flex items-center"
      >
        <Info className="mr-1 h-4 w-4" />
        About
      </Link>
      <Link
        to="/contact"
        className="nav-link font-medium text-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full flex items-center"
      >
        <MapPin className="mr-1 h-4 w-4" />
        Contact
      </Link>
    </nav>
  );
};

export default DesktopNavigation;
