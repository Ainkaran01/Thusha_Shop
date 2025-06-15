import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { User, Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import OTPVerification from "./OTPVerification";

type RegisterFormProps = {
  onToggleAuthMode: () => void;
};

const RegisterForm = ({ onToggleAuthMode }: RegisterFormProps) => {
  const { register } = useUser();
  const { toast } = useToast();

  const [step, setStep] = useState<"form" | "otp">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Validation functions
  const validateName = (name: string): boolean => {
    return /^[a-zA-Z\s]{2,50}$/.test(name);
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate name
    if (!validateName(formData.name)) {
      toast({
        title: "Invalid name",
        description: "Name should only contain letters and spaces, between 2-50 characters.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Validate email
    if (!validateEmail(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Validate password
    if (!validatePassword(formData.password)) {
      toast({
        title: "Weak password",
        description: "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Check password match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password, "customer");
      setStep("otp");
    } catch (error: Error | unknown) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSuccess = async () => {
    toast({
      title: "Account created!",
      description: "Welcome to Thusha Optical!",
    });
  };

  const handleBackToForm = () => {
    setStep("form");
  };

  if (step === "otp") {
    return (
      <OTPVerification
        email={formData.email}
        onVerificationSuccess={handleVerificationSuccess}
        onBack={handleBackToForm}
      />
    );
    
  }

  return (
    <form onSubmit={handleSubmit} method="POST" className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-slate-700 font-medium">Name</Label>
        <div className="relative">
          <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            className="pl-10 h-12 border-slate-200 focus:border-yellow-500 focus:ring-yellow-500/20"
            required
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
        <div className="relative">
          <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            className="pl-10 h-12 border-slate-200 focus:border-yellow-500 focus:ring-yellow-500/20"
            required
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
        <div className="relative">
          <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            className="pl-10 pr-10 h-12 border-slate-200 focus:border-yellow-500 focus:ring-yellow-500/20"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">Confirm Password</Label>
        <div className="relative">
          <Shield size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="pl-10 pr-10 h-12 border-slate-200 focus:border-yellow-500 focus:ring-yellow-500/20"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-12 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-black font-medium rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
            Creating account...
          </div>
        ) : (
          "Send Verification Code"
        )}
      </Button>

      {/* Already have an account? */}
      <div className="text-center">
        <p className="text-sm text-slate-600">
          Already have an account?{" "}
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto text-yellow-700 hover:text-yellow-800 font-medium"
            onClick={onToggleAuthMode}
          >
            Sign in here
          </Button>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;