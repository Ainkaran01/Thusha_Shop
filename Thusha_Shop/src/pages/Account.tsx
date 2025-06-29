import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/context/UserContext";
import LoginForm from "@/components/account/LoginForm";
import RegisterForm from "@/components/account/RegisterForm";
import UserProfile from "@/components/user/UserProfile";
import { Glasses, Eye } from "lucide-react";
import ResetPasswordPage from "@/components/account/ResetPasswordPage";

const Account = () => {
  const { user, isAuthenticated } = useUser();
  const [authMode, setAuthMode] = useState<"login" | "register" | "reset">(
    "login"
  );
  const [emailForReset, setEmailForReset] = useState("");
  
  const toggleAuthMode = () => {
    setAuthMode(authMode === "login" ? "register" : "login");
  };

  // If logged in, show account page
  if (isAuthenticated && user) {
    return <UserProfile />;
  }

  // Login/Register form with enhanced styling
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-yellow-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 transform rotate-12">
          <Glasses size={120} className="text-yellow-500" />
        </div>
        <div className="absolute top-40 right-32 transform -rotate-45">
          <Eye size={80} className="text-yellow-400" />
        </div>
        <div className="absolute bottom-32 left-40 transform rotate-45">
          <Glasses size={100} className="text-yellow-600" />
        </div>
        <div className="absolute bottom-20 right-20 transform -rotate-12">
          <Eye size={60} className="text-yellow-300" />
        </div>
      </div>

      {/* Floating background shapes */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-400 rounded-full blur-xl animate-float"></div>
        <div
          className="absolute top-3/4 right-1/4 w-24 h-24 bg-yellow-500 rounded-full blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-20 h-20 bg-yellow-300 rounded-full blur-xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-3 rounded-full shadow-lg">
              <Glasses size={32} className="text-black" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">VisionCraft</h1>
          <p className="text-yellow-200">Premium Eyewear & Vision Care</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border-2 border-yellow-500/20 relative overflow-hidden">
          {/* Card decorative border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"></div>

          <CardHeader className="text-center pb-6 pt-8">
            <div className="flex items-center justify-center mb-4">
              {authMode === "login" ? (
                <Eye size={24} className="text-yellow-600 mr-2" />
              ) : (
                <Glasses size={24} className="text-yellow-600 mr-2" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">
              {authMode === "login" ? "Welcome Back" : "Join Our Community"}
            </CardTitle>
            <CardDescription className="text-slate-600 mt-2">
              {authMode === "login"
                ? "Sign in to access your vision profile and orders"
                : "Create your account to start your vision journey"}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {authMode === "login" && (
              <LoginForm
                onToggleAuthMode={() => setAuthMode("register")}
                onForgotPassword={(email) => {
                  setEmailForReset(email); // ✅ store email
                  setAuthMode("reset"); // ✅ show reset screen
                }}
              />
            )}

            {authMode === "register" && (
              <RegisterForm onToggleAuthMode={() => setAuthMode("login")} />
            )}

            {authMode === "reset" && (
              <ResetPasswordPage
                email={emailForReset}
                onBackToLogin={() => setAuthMode("login")}
              />
            )}
          </CardContent>
        </Card>

        {/* Trust indicators */}
        <div className="text-center mt-6">
          <p className="text-sm text-yellow-200 mb-2">
            Trusted by over 10,000+ customers
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-yellow-300">
            <span>🔒 Secure</span>
            <span>👥 Trusted</span>
            <span>⚡ Fast</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
