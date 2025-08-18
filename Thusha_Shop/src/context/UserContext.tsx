import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { authClient, apiClient } from "@/lib/api-clients";
import { User, UserContextType, UserRole, FaceShape, VisionProblem, UserPreferences } from "@/types/user";
import { validateForm, registerSchema } from "@/utils/validation";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Configure API client interceptors for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = sessionStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const response = await authClient.post("/api/core/token/refresh/", {
          refresh: refreshToken,
        });

        sessionStorage.setItem("access_token", response.data.access);
        if (response.data.refresh) {
          sessionStorage.setItem("refresh_token", response.data.refresh);
        }

        apiClient.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
        originalRequest.headers["Authorization"] = `Bearer ${response.data.access}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isInitialized: false,
  });
  const { toast } = useToast();

  const performCleanup = useCallback(async (showToast: boolean = false) => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    sessionStorage.removeItem("user");

    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: true,
    });

    if (showToast) {
      toast({
        title: "Logged Out",
        description: "You have been successfully signed out",
      });
    }
  }, [toast]);

  const initializeAuth = useCallback(async () => {
    const accessToken = sessionStorage.getItem("access_token");
    const refreshToken = sessionStorage.getItem("refresh_token");
    const savedUser = sessionStorage.getItem("user");

    if (!accessToken || !refreshToken || !savedUser) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        isInitialized: true,
      }));
      return;
    }

    try {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      const res = await apiClient.get("/api/core/verify-token/");
      
      if (res?.data?.valid) {
        setAuthState({
          user: JSON.parse(savedUser),
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
      } else {
        throw new Error("Invalid token");
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      await performCleanup();
    }
  }, [performCleanup]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const response = await authClient.post("/api/core/login/", {
        email,
        password,
      });
      const { access, refresh, user } = response.data;

      sessionStorage.setItem("access_token", access);
      sessionStorage.setItem("refresh_token", refresh);
      sessionStorage.setItem("user", JSON.stringify(user));
      
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
      });

      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
      });

      return user;
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      const message = error.response?.data?.message || error.message || "Login failed";
      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
      throw new Error(message);
    }
  };

  const logout = async (showToast: boolean = true) => {
    await performCleanup(showToast);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role?: UserRole
  ): Promise<void> => {
    const validation = validateForm(registerSchema, {
      name,
      email,
      password,
      confirmPassword: password,
      role: role || "customer",
    });

    if (!validation.success) {
      const errorMessage =
        Array.isArray(validation.errors) && validation.errors.length > 0
          ? validation.errors[0].message
          : "Invalid registration data";
      toast({
        title: "Registration Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }

    try {
      const response = await authClient.post("/api/core/register/", {
        name,
        email,
        password,
        confirm_password: password,
        role: role || "customer",
      });

      toast({
        title: "Verification Code Sent",
        description: `We've sent a 6-digit code to ${email}`,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Registration failed";
      toast({
        title: "Registration Failed",
        description: message,
        variant: "destructive",
      });
      throw new Error(message);
    }
  };

  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    try {
      const response = await authClient.post("/api/core/verify-otp/", { email, otp });
      const { access, refresh, user } = response.data;

      sessionStorage.setItem("access_token", access);
      sessionStorage.setItem("refresh_token", refresh);
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
      });

      await createInitialProfile();
      return true;
    } catch (error) {
      return false;
    }
  };

  const createInitialProfile = async () => {
    try {
      await apiClient.post("/api/core/profile/", {
        phone_number: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        zip_code: "",
        country: "",
      });
    } catch (error) {
      console.error("Profile creation failed:", error);
    }
  };

  const resendOTP = async (email: string): Promise<void> => {
    try {
      await authClient.post("/api/core/resend-otp/", { email });
      toast({
        title: "OTP Resent",
        description: `A new verification code has been sent to ${email}`,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Could not resend OTP.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw new Error(message);
    }
  };

  const fetchProfile = async () => {
    try {
      if (authState.user?.role !== "customer") return; 

      const response = await apiClient.get("/api/core/profile/");
      const profileData = response.data;

      setAuthState(prev => ({
        ...prev,
        user: {
          ...prev.user!,
          name: profileData.name || prev.user?.name,
          created_at: profileData.created_at,
          profile: {
            ...prev.user?.profile,
            phone_number: profileData.phone_number,
            address_line1: profileData.address_line1,
            address_line2: profileData.address_line2,
            city: profileData.city,
            state: profileData.state,
            zip_code: profileData.zip_code,
            country: profileData.country,
          },
        },
      }));
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const updateProfile = async (profileData: Partial<User>): Promise<void> => {
    if (!profileData) {
      throw new Error("No data provided to update");
    }

    try {
      const payload = {
        name: profileData.name,
        ...(profileData.profile || {}),
      };

      const response = await apiClient.patch("/api/core/profile/", payload);
      const updatedUser = response.data;

      setAuthState(prev => ({
        ...prev,
        user: {
          ...prev.user!,
          name: updatedUser.name || prev.user?.name,
          profile: {
            ...prev.user?.profile,
            phone_number: updatedUser.phone_number,
            address_line1: updatedUser.address_line1,
            address_line2: updatedUser.address_line2,
            city: updatedUser.city,
            state: updatedUser.state,
            zip_code: updatedUser.zip_code,
            country: updatedUser.country,
          },
        },
      }));

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Failed to update profile.";
      toast({
        title: "Update Failed",
        description: message,
        variant: "destructive",
      });
      throw new Error(message);
    }
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    try {
      await apiClient.post("/api/core/change-password/", {
        currentPassword,
        newPassword,
      });
      toast({
        title: "Password Changed",
        description: "Your password has been successfully changed.",
      });
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Password change failed.";
      toast({
        title: "Change Failed",
        description: message,
        variant: "destructive",
      });
      throw new Error(message);
    }
  };

  const setUserFaceShape = (faceShape: FaceShape) => {
    if (!authState.user) return;
    setAuthState(prev => ({
      ...prev,
      user: {
        ...prev.user!,
        faceShape,
      },
    }));
  };

  const setUserVisionProblem = (visionProblem: VisionProblem) => {
    if (!authState.user) return;
    setAuthState(prev => ({
      ...prev,
      user: {
        ...prev.user!,
        visionProblem,
      },
    }));
  };

  const updatePreferences = (preferences: Partial<UserPreferences>) => {
    if (!authState.user || !authState.user.preferences) return;
    setAuthState(prev => ({
      ...prev,
      user: {
        ...prev.user!,
        preferences: { ...prev.user!.preferences, ...preferences },
      },
    }));
  };

  const hasRole = (requiredRoles: UserRole | UserRole[]): boolean => {
    if (!authState.user || !authState.isAuthenticated) return false;
    return Array.isArray(requiredRoles)
      ? requiredRoles.includes(authState.user.role)
      : authState.user.role === requiredRoles;
  };

   // forgot password section 
  const sendPasswordResetOtp = async (email: string): Promise<void> => {
    try {
      await authClient.post("/api/core/forgot-password/send-otp/", { email });
      toast({
        title: "OTP Sent",
        description: `A 6-digit code has been sent to ${email}`,
      });
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Failed to send OTP";
      toast({
        title: "Enter the correct Email",
        description: message,
        variant: "destructive",
      });
      throw new Error(message);
    }
  };

  const verifyPasswordResetOtp = async (
    email: string,
    otp: string
  ): Promise<boolean> => {
    try {
      const response = await authClient.post(
        "/api/core/forgot-password/verify-otp/",
        {
          email,
          otp,
        }
      );
      return response.data.verified;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Invalid OTP";
      toast({
        title: "Enter Correct OTP",
        description: message,
        variant: "destructive",
      });
      return false;
    }
  };

  const resetPassword = async (
    email: string,
    newPassword: string
  ): Promise<void> => {
    try {
      await authClient.post("/api/core/forgot-password/reset/", {
        email,
        new_password: newPassword,
      });
      toast({
        title: "Password Reset",
        description: "Your password has been updated successfully",
      });
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Password reset failed";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw new Error(message);
    }
  };


  return (
    <UserContext.Provider
      value={{
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        isLoggedIn: authState.isAuthenticated, // Alias for isAuthenticated
        login,
        logout,
        register,
        updateProfile,
        updatePassword,
        hasRole,
        setUserFaceShape,
        setUserVisionProblem,
        updatePreferences,
        fetchProfile,
        validateForm, // Imported from validation utils
        verifyOTP,
        resendOTP,
        sendPasswordResetOtp,
        verifyPasswordResetOtp,
        resetPassword,
        authLoading: authState.isLoading,
        initialized: authState.isInitialized,
        isLoading: authState.isLoading,
        isInitialized: authState.isInitialized,
      }}
    >
      {authState.isInitialized ? children : (
        <div className="flex justify-center items-center h-screen w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}