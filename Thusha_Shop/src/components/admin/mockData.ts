
import { OrderStatus } from "@/types";

// Mock data for orders
export const mockOrders = [
  { id: "ORD-001", customer: "John Smith", amount: 129.99, status: "delivered" as OrderStatus, date: "2025-04-01", items: 2 },
  { id: "ORD-002", customer: "Sarah Johnson", amount: 249.99, status: "processing" as OrderStatus, date: "2025-04-02", items: 1, updatedAt: "2025-04-03T10:30:00Z", updatedBy: "Delivery" },
  { id: "ORD-003", customer: "Michael Brown", amount: 89.99, status: "shipped" as OrderStatus, date: "2025-04-03", items: 3, updatedAt: "2025-04-04T08:15:00Z", updatedBy: "Delivery" },
  { id: "ORD-004", customer: "Emily Davis", amount: 159.99, status: "pending" as OrderStatus, date: "2025-04-03", items: 2 },
  { id: "ORD-005", customer: "David Wilson", amount: 199.99, status: "processing" as OrderStatus, date: "2025-04-04", items: 1 },
  { id: "ORD-006", customer: "Jessica Taylor", amount: 79.99, status: "delivered" as OrderStatus, date: "2025-04-05", items: 1, updatedAt: "2025-04-06T14:22:00Z", updatedBy: "Delivery" },
  { id: "ORD-007", customer: "Robert Martin", amount: 349.99, status: "cancelled" as OrderStatus, date: "2025-04-06", items: 4 },
  { id: "ORD-008", customer: "Jennifer Lewis", amount: 129.99, status: "shipped" as OrderStatus, date: "2025-04-07", items: 2, updatedAt: "2025-04-08T09:45:00Z", updatedBy: "Admin" },
];

// Mock data for products
export const mockProducts = [
  { id: 1, name: "Ray-Ban Classic", stock: 24, sold: 156, category: "Sunglasses", price: 149.99 },
  { id: 2, name: "Oakley Aviator", stock: 12, sold: 89, category: "Sunglasses", price: 179.99 },
  { id: 3, name: "Gucci Designer", stock: 8, sold: 65, category: "Prescription", price: 299.99 },
  { id: 4, name: "Prada Elegance", stock: 16, sold: 78, category: "Prescription", price: 249.99 },
  { id: 5, name: "Tom Ford Square", stock: 19, sold: 42, category: "Sunglasses", price: 219.99 },
  { id: 6, name: "Warby Parker Blue Light", stock: 31, sold: 122, category: "Blue Light", price: 99.99 },
  { id: 7, name: "Dolce & Gabbana Round", stock: 7, sold: 36, category: "Prescription", price: 259.99 },
  { id: 8, name: "Persol Classic", stock: 14, sold: 68, category: "Sunglasses", price: 189.99 },
];

// Mock data for appointments
export const mockAppointments = [
  { id: "APT-001", customer: "Emma Wilson", date: "2025-05-03", time: "10:00 AM", status: "scheduled", doctor: "Dr. Smith" },
  { id: "APT-002", customer: "James Brown", date: "2025-05-03", time: "11:30 AM", status: "completed", doctor: "Dr. Johnson" },
  { id: "APT-003", customer: "Olivia Davis", date: "2025-05-04", time: "2:00 PM", status: "scheduled", doctor: "Dr. Smith" },
  { id: "APT-004", customer: "William Taylor", date: "2025-05-05", time: "9:30 AM", status: "cancelled", doctor: "Dr. Johnson" },
  { id: "APT-005", customer: "Sophia Miller", date: "2025-05-05", time: "3:15 PM", status: "scheduled", doctor: "Dr. Wilson" },
];

// Mock data for customers
export const mockCustomers = [
  { id: "user-001", name: "John Smith", email: "john@example.com" },
  { id: "user-002", name: "Sarah Johnson", email: "sarah@example.com" },
  { id: "user-003", name: "Michael Brown", email: "michael@example.com" },
  { id: "user-004", name: "Emily Davis", email: "emily@example.com" },
  { id: "user-005", name: "David Wilson", email: "david@example.com" },
];

// Chart data
export const salesData = [
  { month: "Jan", revenue: 12450 },
  { month: "Feb", revenue: 14280 },
  { month: "Mar", revenue: 18970 },
  { month: "Apr", revenue: 22340 },
  { month: "May", revenue: 25890 },
];

export const categoryData = [
  { id: "Sunglasses", value: 35 },
  { id: "Prescription", value: 40 },
  { id: "Blue Light", value: 15 },
  { id: "Reading", value: 10 },
];
