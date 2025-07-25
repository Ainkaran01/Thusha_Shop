import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { Mail, Clock, RefreshCw } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  email: string;
  onBackToLogin: () => void;
};

const ResetPasswordPage: React.FC<Props> = ({ email, onBackToLogin }) => {
  const { verifyPasswordResetOtp, resetPassword, sendPasswordResetOtp } = useUser();
  const { toast } = useToast();

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<"otp" | "reset">("otp");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the full 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const isValid = await verifyPasswordResetOtp(email, otp);
      if (isValid) {
        setStep("reset");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure both passwords match",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(email, newPassword);
      onBackToLogin();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      await sendPasswordResetOtp(email);
      setOtp("");
      setCountdown(60);
      setCanResend(false);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Resend failed",
        description: error.message || "Could not resend OTP",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto p-6 border rounded-md shadow-md">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Reset Password</h2>
        <p className="text-slate-600">We've sent a 6-digit verification code to</p>
        <p className="font-medium text-blue-600">{email}</p>
      </div>

      {step === "otp" ? (
        <>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-slate-700 font-medium">Enter Verification Code</label>
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={(val) => setOtp(val)}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <div className="text-center">
              {!canResend ? (
                <div className="flex items-center justify-center space-x-2 text-sm text-slate-600">
                  <Clock className="h-4 w-4" />
                  <span>Resend code in {formatTime(countdown)}</span>
                </div>
              ) : (
                <Button
                  variant="link"
                  onClick={handleResendOTP}
                  disabled={isResending}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="h-2 w-4 mr-2 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    "Resend verification code"
                  )}
                </Button>
              )}
            </div>
          </div>

          <Button
            onClick={verifyOtp}
            disabled={otp.length !== 6 || isSubmitting}
            className="w-full h-10 bg-gradient-to-r from-yellow-600 to-yellow-600 hover:from-yellow-700 hover:to-yellow-700"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Verifying...
              </div>
            ) : (
              "Verify OTP"
            )}
          </Button>
        </>
      ) : (
        <>
          <div className="relative">
            <Input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500"
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative mt-4">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <Button className="w-full" onClick={handleResetPassword} disabled={isSubmitting}>
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </>
      )}

      <Button variant="outline" className="w-full" onClick={onBackToLogin}>
        Back to Login
      </Button>
    </div>
  );
};

export default ResetPasswordPage;
