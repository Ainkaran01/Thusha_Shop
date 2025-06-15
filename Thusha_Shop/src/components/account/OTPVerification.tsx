import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Clock, RefreshCw } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useNavigate } from 'react-router-dom';
interface OTPVerificationProps {
  email: string;
  onVerificationSuccess: () => void;
  onBack: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerificationSuccess,
  onBack,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { verifyOTP, resendOTP } = useUser(); // Now uses context methods

  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

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

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit verification code",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    try {
      const success = await verifyOTP(email, otp);
      if (success) {
        toast({
          title: "Account created!",
          description: "Welcome to Thusha Optical!",
        });
        navigate('/user-dashboard'); // Redirect to dashboard
      }
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid or expired OTP",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);

    try {
      await resendOTP(email);
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
        title: "Resend Failed",
        description: error.message || "Could not resend OTP",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Verify Your Email</h2>
        <p className="text-slate-600">We've sent a 6-digit verification code to</p>
        <p className="font-medium text-blue-600">{email}</p>
      </div>

    

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-slate-700 font-medium">Enter Verification Code</Label>
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
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
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Resending...
                </>
              ) : (
                "Resend verification code"
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col space-y-3">
        <Button
          onClick={handleVerifyOTP}
          disabled={otp.length !== 6 || isVerifying}
          className="w-full h-12 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
        >
          {isVerifying ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Verifying...
            </div>
          ) : (
            "Verify & Create Account"
          )}
        </Button>

        <Button variant="outline" onClick={onBack} className="w-full">
          Back to Registration
        </Button>
      </div>
    </div>
  );
};

export default OTPVerification;