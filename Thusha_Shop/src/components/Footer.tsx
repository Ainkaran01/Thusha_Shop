
import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">Thusha <span className="text-yellow-500">Optical</span></h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Premium eyewear with personalized recommendations. Find the perfect frames for your face shape and vision needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center hover:bg-yellow-500 transition-colors duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center hover:bg-yellow-500 transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center hover:bg-yellow-500 transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 border-b border-yellow-500/30 pb-2">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/catalog" className="text-gray-300 hover:text-yellow-500 transition-colors duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                  All Eyeglasses
                </Link>
              </li>
              <li>
                <Link to="/catalog?type=prescription" className="text-gray-300 hover:text-yellow-500 transition-colors duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                  Prescription Glasses
                </Link>
              </li>
              <li>
                <Link to="/catalog?type=sunglasses" className="text-gray-300 hover:text-yellow-500 transition-colors duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                  Sunglasses
                </Link>
              </li>
              <li>
                <Link to="/catalog?type=bluelight" className="text-gray-300 hover:text-yellow-500 transition-colors duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                  Blue Light Glasses
                </Link>
              </li>
              <li>
                <Link to="/catalog?type=reading" className="text-gray-300 hover:text-yellow-500 transition-colors duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                  Reading Glasses
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 border-b border-yellow-500/30 pb-2">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/face-shape" className="text-gray-300 hover:text-yellow-500 transition-colors duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                  Face Shape Analysis
                </Link>
              </li>
              <li>
                <Link to="/vision-test" className="text-gray-300 hover:text-yellow-500 transition-colors duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                  Vision Problem Test
                </Link>
              </li>
              <li>
                <Link to="/doctor-appointment" className="text-gray-300 hover:text-yellow-500 transition-colors duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                  Book Doctor Appointment
                </Link>
              </li>
              <li>
                <Link to="/order-tracking" className="text-gray-300 hover:text-yellow-500 transition-colors duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-yellow-500 transition-colors duration-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                  Shipping Information
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 border-b border-yellow-500/30 pb-2">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                <span className="text-gray-300">123 Vision Street, Eyewear City, EC 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-yellow-500 mr-3" />
                <a href="tel:+1234567890" className="text-gray-300 hover:text-yellow-500 transition-colors duration-200">+123 456 7890</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-yellow-500 mr-3" />
                <a href="mailto:info@thushaoptical.com" className="text-gray-300 hover:text-yellow-500 transition-colors duration-200">info@thushaoptical.com</a>
              </li>
              <li className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-500 mr-3" />
                <span className="text-gray-300">Mon-Fri: 9am-6pm, Sat: 10am-4pm</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Thusha Optical. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-yellow-500 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-gray-400 hover:text-yellow-500 transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/faq" className="text-sm text-gray-400 hover:text-yellow-500 transition-colors duration-200">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
