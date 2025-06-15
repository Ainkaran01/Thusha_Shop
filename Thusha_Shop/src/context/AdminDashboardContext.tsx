
import React, { createContext, useContext, useState, ReactNode } from "react";
import { OrderStatus } from "@/types";
import { mockOrders, mockProducts, mockAppointments } from "@/components/admin/mockData";

interface AdminContextType {
  orders: typeof mockOrders;
  products: typeof mockProducts;
  appointments: typeof mockAppointments;
  stats: {
    totalSales: number;
    monthlyRevenue: number;
    totalCustomers: number;
    totalOrders: number;
    pendingOrders: number;
    conversion: number;
  };
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  updateAppointmentStatus: (appointmentId: string, newStatus: string) => void;
  deleteAppointment: (appointmentId: string) => void;
  updateStock: (productId: number, newStock: number) => void;
  deleteProduct: (productId: number) => void;
  addProduct: (productData: Omit<typeof mockProducts[0], "id" | "sold">) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdminDashboard = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdminDashboard must be used within an AdminDashboardProvider");
  }
  return context;
};

interface AdminDashboardProviderProps {
  children: ReactNode;
}

export const AdminDashboardProvider: React.FC<AdminDashboardProviderProps> = ({ children }) => {
  // Data state for simulating real-time changes
  const [orders, setOrders] = useState(mockOrders);
  const [products, setProducts] = useState(mockProducts);
  const [appointments, setAppointments] = useState(mockAppointments);
  const [stats, setStats] = useState({
    totalSales: 25890.75,
    monthlyRevenue: 4560.25,
    totalCustomers: 235,
    totalOrders: 412,
    pendingOrders: 23,
    conversion: 3.2,
  });

  // Function to handle order status update
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status: newStatus, 
              updatedAt: new Date().toISOString(),
              updatedBy: "Admin" 
            } 
          : order
      )
    );
  };

  // Function to delete an order
  const deleteOrder = (orderId: string) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  // Function to handle appointment status update
  const updateAppointmentStatus = (appointmentId: string, newStatus: string) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    ));
  };

  // Function to delete an appointment
  const deleteAppointment = (appointmentId: string) => {
    setAppointments(appointments.filter(apt => apt.id !== appointmentId));
  };

  // Function to handle product stock update
  const updateStock = (productId: number, newStock: number) => {
    setProducts(products.map(product => 
      product.id === productId ? { ...product, stock: newStock } : product
    ));
  };

  // Function to delete a product
  const deleteProduct = (productId: number) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  // Function to add a new product
  const addProduct = (productData: Omit<typeof mockProducts[0], "id" | "sold">) => {
    const newId = Math.max(...products.map(p => p.id)) + 1;
    setProducts([
      ...products,
      {
        id: newId,
        ...productData,
        sold: 0
      }
    ]);
  };

  return (
    <AdminContext.Provider 
      value={{
        orders,
        products,
        appointments,
        stats,
        updateOrderStatus,
        deleteOrder,
        updateAppointmentStatus,
        deleteAppointment,
        updateStock,
        deleteProduct,
        addProduct
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
