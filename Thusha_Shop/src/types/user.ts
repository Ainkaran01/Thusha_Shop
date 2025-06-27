export type UserRole = "customer" | "admin" | "doctor" | "delivery" | "manufacturer";

export type FaceShape = "round" | "oval" | "square" | "heart" | "diamond" | "oblong" | "triangle" | "unknown";

export type VisionProblem = "nearsighted" | "farsighted" | "astigmatism" | "presbyopia" | "none" | "unknown";

// Base profile interface for common fields
export interface User {
  profilePhoto: string;
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profile?: {
    phone_number: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
   
  };
  faceShape?: string;
  visionProblem?: string;
  prescriptions?: Prescription[];
  avatarUrl?: string;
  preferences?: UserPreferences;
  created_at: string;
  lastLogin?: string;
  orders?: string[];
  createdBy?: string;
  is_active?: boolean;
}


export interface Prescription {
  id: number;
  prescription_id: string;
  doctor_name: string;
  patient_name: string;
  date_issued: string;
  expiry_date: string;
  right_sphere: string | null;
  right_cylinder: string | null;
  right_axis: string | null;
  left_sphere: string | null;
  left_cylinder: string | null;
  left_axis: string | null;
  pupillary_distance: number | null |string;
  status: string;  // add this line for status
  patient_email_display: string;
  additional_notes: string;
}

export interface UserPreferences {
  frameStyle?: string;
  preferredBrands?: string[];
  budgetRange?: {
    min: number;
    max: number;
  };
  faceShape?: FaceShape;
  visionProblem?: VisionProblem;
}


export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: UserRole;
}

export interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: (showToast?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  hasRole: (requiredRoles: UserRole | UserRole[]) => boolean;
  setUserFaceShape: (faceShape: FaceShape) => void;
  setUserVisionProblem: (visionProblem: VisionProblem) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  fetchProfile: () => Promise<void>;
  validateForm: (schema: any, data: any) => { success: boolean; errors?: any };
  verifyOTP: (email: string, otp: string) => Promise<boolean>;
  resendOTP: (email: string) => Promise<void>;
}