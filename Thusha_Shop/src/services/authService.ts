import { User, UserRole } from "@/types/user";

// Default user for non-authenticated sessions
export const defaultUser: User = {
  id: "guest-user",
  name: "Guest User",
  email: "",
  role: "customer",
  preferences: {
    faceShape: "oval",
    visionProblem: "unknown",
    frameStyle: "",
    preferredBrands: [],
    budgetRange: {
      min: 0,
      max: 1000
    },
  },
  orders: [],
  createdAt: new Date().toISOString(),
};

// Mock authentication functions

export const mockLogin = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock successful login
      // For demo purposes, we'll use different roles based on email
      let role: UserRole = "customer";
      
      if (email.includes("admin")) {
        role = "admin";
      } else if (email.includes("doctor")) {
        role = "doctor";
      } else if (email.includes("delivery")) {
        role = "delivery";
      } else if (email.includes("manufacturer")) {
        role = "manufacturer";
      }
      
      const mockUser: User = {
        id: "user-123",
        name: email.split("@")[0],
        email: email,
        role: role,
        preferences: {
          faceShape: "oval",
          visionProblem: "nearsighted",
          frameStyle: "round",
          preferredBrands: ["Ray-Ban", "Oakley"],
          budgetRange: {
            min: 50,
            max: 300
          },
        },
        orders: ["order-1", "order-2"],
        createdAt: new Date().toISOString(),
        createdBy: role === "doctor" || role === "delivery" || role === "manufacturer" ? "admin-user" : undefined,
      };

      // Add prescriptions for doctors
      if (role === "doctor") {
        mockUser.prescriptions = [
          {
            id: "RX-001",
            rightEye: { sphere: -2.25, cylinder: -0.75, axis: 90 },
            leftEye: { sphere: -2.00, cylinder: -0.50, axis: 85 },
            pupillaryDistance: 64,
            doctorName: mockUser.name,
            dateIssued: "2025-04-15",
            expiryDate: "2027-04-15",
            patientName: "Michael Brown",
            date: "2025-04-15",
            doctor: mockUser.name,
            sphereRight: "-2.25",
            sphereLeft: "-2.00",
            cylinderRight: "-0.75",
            cylinderLeft: "-0.50",
            axisRight: "90",
            axisLeft: "85",
            pdRight: "32",
            pdLeft: "32",
            status: "Active"
          },
          {
            id: "RX-002",
            rightEye: { sphere: 1.25, cylinder: -0.25, axis: 180 },
            leftEye: { sphere: 1.50, cylinder: -0.50, axis: 175 },
            pupillaryDistance: 63,
            doctorName: mockUser.name,
            dateIssued: "2025-04-28",
            expiryDate: "2027-04-28",
            patientName: "Emma Wilson",
            date: "2025-04-28",
            doctor: mockUser.name,
            sphereRight: "+1.25",
            sphereLeft: "+1.50",
            cylinderRight: "-0.25",
            cylinderLeft: "-0.50",
            axisRight: "180",
            axisLeft: "175",
            pdRight: "31.5",
            pdLeft: "31.5",
            status: "Active"
          }
        ];
      } 
      // Add prescriptions for customers
      else if (role === "customer") {
        mockUser.prescriptions = [
          {
            id: "RX-003",
            rightEye: { sphere: -1.75, cylinder: -0.50, axis: 85 },
            leftEye: { sphere: -2.00, cylinder: -0.75, axis: 95 },
            pupillaryDistance: 64,
            doctorName: "Dr. Sarah Miller",
            dateIssued: "2025-03-22",
            expiryDate: "2027-03-22",
            patientName: mockUser.name,
            date: "2025-03-22",
            doctor: "Dr. Sarah Miller",
            sphereRight: "-1.75",
            sphereLeft: "-2.00",
            cylinderRight: "-0.50",
            cylinderLeft: "-0.75",
            axisRight: "85",
            axisLeft: "95",
            pdRight: "32",
            pdLeft: "32",
            status: "Active"
          }
        ];
      }
      
      resolve(mockUser);
    }, 1000);
  });
};

export const mockRegister = (name: string, email: string, password: string, role: UserRole = "customer", createdBy?: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Validate role assignment
      if ((role === "doctor" || role === "delivery" || role === "manufacturer") && !createdBy) {
        reject(new Error("Doctor, delivery, and manufacturer accounts can only be created by administrators"));
        return;
      }

      // Mock successful registration
      const newUser: User = {
        id: "user-" + Date.now(),
        name,
        email,
        role,
        preferences: {
          faceShape: "oval",
          visionProblem: "unknown",
          frameStyle: "",
          preferredBrands: [],
          budgetRange: {
            min: 0,
            max: 1000
          },
        },
        orders: [],
        createdAt: new Date().toISOString(),
        createdBy: createdBy,
      };
      
      // Add mock prescriptions for doctors
      if (role === "doctor") {
        newUser.prescriptions = [
          {
            id: "RX-001",
            rightEye: { sphere: -2.25, cylinder: -0.75, axis: 90 },
            leftEye: { sphere: -2.00, cylinder: -0.50, axis: 85 },
            pupillaryDistance: 64,
            doctorName: newUser.name,
            dateIssued: "2025-04-15",
            expiryDate: "2027-04-15",
            patientName: "Michael Brown",
            date: "2025-04-15",
            doctor: newUser.name,
            sphereRight: "-2.25",
            sphereLeft: "-2.00",
            cylinderRight: "-0.75",
            cylinderLeft: "-0.50",
            axisRight: "90",
            axisLeft: "85",
            pdRight: "32",
            pdLeft: "32",
            status: "Active"
          },
          {
            id: "RX-002",
            rightEye: { sphere: 1.25, cylinder: -0.25, axis: 180 },
            leftEye: { sphere: 1.50, cylinder: -0.50, axis: 175 },
            pupillaryDistance: 63,
            doctorName: newUser.name,
            dateIssued: "2025-04-28",
            expiryDate: "2027-04-28",
            patientName: "Emma Wilson",
            date: "2025-04-28",
            doctor: newUser.name,
            sphereRight: "+1.25",
            sphereLeft: "+1.50",
            cylinderRight: "-0.25",
            cylinderLeft: "-0.50",
            axisRight: "180",
            axisLeft: "175",
            pdRight: "31.5",
            pdLeft: "31.5",
            status: "Active"
          }
        ];
      }
      
      resolve(newUser);
    }, 1000);
  });
};

export const mockUpdatePassword = (currentPassword: string, newPassword: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      // In a real app, we would verify the current password and update to the new one
      // For this example, we'll just simulate success
      resolve();
    }, 1000);
  });
};
