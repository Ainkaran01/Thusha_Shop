import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { OrderStatus } from "@/types";
import {
  getFrameTypes,
  createFrameType,
  updateFrameType as apiUpdateFrameType,
  deleteFrameType as apiDeleteFrameType,
  FrameType,
} from "@/api/frameTypes";
import {
  getCategories,
  createCategory,
  updateCategory as apiUpdateCategory,
  deleteCategory as apiDeleteCategory,
  Category,
} from "@/api/categories";
import {
  fetchProducts,
  addProduct as apiAddProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
  updateStock as apiUpdateStock,
  deleteProductImage as apiDeleteProductImage,
  setPrimaryImage as apiSetPrimaryImage,
} from "@/api/products";
import {
  fetchAdminProfile as apiFetchAdminProfile,
  updateAdminProfile as apiUpdateAdminProfile,
  AdminProfile,
} from "@/api/adminProfile";
import {
  fetchAppointments,
  deleteAppointment as apiDeleteAppointment,
  Appointment,
} from "@/api/appointments";
import {
  fetchActiveCustomers,
  deactivateCustomer,
  activateCustomer,
  Customer,
  fetchCustomerCount
} from "@/api/customers";
import {
  fetchOrders,
  updateOrderStatus as apiUpdateOrderStatus,
  assignDelivery as apiAssignDelivery,
  fetchDeliveryPersons as apiFetchDeliveryPersons,
  Order,
  fetchPendingOrderCount,
  fetchTotalSales,
  fetchMonthlyRevenue,
} from "@/api/orders"
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { Accessory } from "@/types/accessory";

interface AdminContextType {
  products: Product[];

  stats: {
    totalSales: number;
    monthlyRevenue: number;
    totalCustomers: number;
    totalOrders: number;
    pendingOrders: number;
    conversion: number;
    salesGrowth: number;       
    revenueGrowth: number;
  };

  // Frame Types
  frameTypes: FrameType[];
  addFrameType: (name: string, description: string) => Promise<void>;
  updateFrameType: (
    id: number,
    name: string,
    description: string
  ) => Promise<void>;
  deleteFrameType: (id: number) => Promise<void>;

  // Categories
  categories: Category[];
  addCategory: (name: string, description: string) => Promise<void>;
  updateCategory: (
    id: number,
    name: string,
    description: string
  ) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;

  // Orders
  orders: Order[];
  updateOrderStatus: (orderNumber: string, newStatus: OrderStatus) => void;
  assignDelivery: (orderId: number, deliveryPersonId: number) => Promise<void>;
  fetchDeliveryPersons: () => Promise<{ id: number; name: string; email: string }[]>;

  // Appointments
  appointments: Appointment[];
  deleteAppointment: (id: number) => Promise<void>;

  // Products
  addProduct: (productData: FormData) => Promise<Product>;
  updateProduct: (id: number, productData: FormData) => Promise<Product>;
  deleteProduct: (id: number) => Promise<void>;
  updateStock: (productId: number, newStock: number) => Promise<void>;
  refreshProducts: () => Promise<void>;

  // Product Image Management
  deleteProductImage: (productId: number, imageId: number) => Promise<void>;
  setPrimaryProductImage: (productId: number, imageId: number) => Promise<void>;

  adminProfile: AdminProfile | null;
  fetchAdminProfile: () => Promise<void>;
  updateAdminProfile: (profileData: FormData) => Promise<AdminProfile>;

  customers: Customer[];
  deactivateCustomer: (id: number) => Promise<void>;
  activateCustomer: (id: number) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdminDashboard = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error(
      "useAdminDashboard must be used within an AdminDashboardProvider"
    );
  }
  return context;
};

interface AdminDashboardProviderProps {
  children: ReactNode;
}

export const AdminDashboardProvider: React.FC<AdminDashboardProviderProps> = ({
  children,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalSales: 0,
    monthlyRevenue: 0,
    totalCustomers: 0,
    totalOrders: 412,
    pendingOrders: 0,
    conversion: 3.2,
    salesGrowth: 0,      
    revenueGrowth: 0,
  });

  const [frameTypes, setFrameTypes] = useState<FrameType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          frameTypesData,
          categoriesData,
          productsData,
          appointmentData,
          customersData,
          customerCount,
          pendingOrderCount,
          totalSalesData,
          monthlyRevenueData,
        ] = await Promise.all([
          getFrameTypes(),
          getCategories(),
          fetchProducts(),
          fetchAppointments(),
          fetchActiveCustomers(),
          fetchCustomerCount(),
          fetchPendingOrderCount(),
          fetchTotalSales(),
          fetchMonthlyRevenue(),
        ]);
        setFrameTypes(frameTypesData);
        setCategories(categoriesData);
        setProducts(productsData);
        setAppointments(appointmentData);
        setCustomers(customersData);
        setStats((prev) => ({
        ...prev,  
        totalSales: totalSalesData.total_sales,
        monthlyRevenue: monthlyRevenueData.monthly_revenue,
        totalCustomers: customerCount,
        pendingOrders: pendingOrderCount,
        salesGrowth:
          totalSalesData.last_month_sales === 0
            ? 100
            : ((totalSalesData.total_sales - totalSalesData.last_month_sales) /
                totalSalesData.last_month_sales) * 100,
        revenueGrowth:
          monthlyRevenueData.last_month_revenue === 0
            ? 100
            : ((monthlyRevenueData.monthly_revenue - monthlyRevenueData.last_month_revenue) /
                monthlyRevenueData.last_month_revenue) * 100,
        }));
    
      } catch (error) {
        console.error("Failed to load initial data:", error);
        toast({
          title: "Error",
          description: "Failed to load initial data",
          variant: "destructive",
        });
      }
    };
    loadData();
  }, [toast]);

  // Refresh products function
  const refreshProducts = async () => {
    try {
      const productsData = await fetchProducts();
      setProducts(productsData);
    } catch (error) {
      console.error("Failed to refresh products:", error);
      toast({
        title: "Error",
        description: "Failed to refresh products",
        variant: "destructive",
      });
    }
  };

  // Order functions

   useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersData = await fetchOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error("Failed to load orders:", error);
        toast({
          title: "Error",
          description: "Failed to load initial data",
          variant: "destructive",
        });
      }
    };

    loadOrders();
  }, [toast]);

  const updateOrderStatus = async (orderNumber: string, newStatus: OrderStatus) => {
  try {
    const updatedOrder = await apiUpdateOrderStatus(orderNumber, newStatus);
    setOrders(prev =>
  prev.map(order =>
    order.order_number === orderNumber
      ? { ...order, status: newStatus }  
      : order
  )
);

    toast({
      title: "Success",
      description: "Order status updated successfully",
    });
  } catch (error) {
    console.error("Failed to update order status:", error);
    toast({
      title: "Error",
      description: "Failed to update order status",
      variant: "destructive",
    });
  }
};

// Assign Delivery to Order
  const assignDelivery = async (orderId: number, deliveryPersonId: number) => {
    try {
      await apiAssignDelivery(orderId, deliveryPersonId);
      toast({
        title: "Success",
        description: `Order ${orderId} assigned successfully`,
      });
      const updatedOrders = await fetchOrders();
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Failed to assign delivery:", error);
      toast({
        title: "Error",
        description: "Failed to assign delivery",
        variant: "destructive",
      });
    }
  };

  // Fetch delivery persons (active only)
  const fetchDeliveryPersons = async (): Promise<{ id: number; name: string; email: string }[]> => {
    try {
      const persons = await apiFetchDeliveryPersons();
      return persons;
    } catch (error) {
      console.error("Failed to fetch delivery persons:", error);
      toast({
        title: "Error",
        description: "Failed to load delivery personnel",
        variant: "destructive",
      });
      return [];
    }
  };


  // Appointment functions

  const deleteAppointment = async (id: number) => {
    try {
      await apiDeleteAppointment(id);
      setAppointments((prev) => prev.filter((apt) => apt.id !== id));
      toast({
        title: "Success",
        description: "Appointment deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete appointment:", error);
      toast({
        title: "Error",
        description: "Failed to delete appointment",
        variant: "destructive",
      });
    }
  };

  // Product functions
  const addProduct = async (productData: FormData) => {
    try {
      const newProduct = await apiAddProduct(productData);
      setProducts((prev) => [...prev, newProduct]);
      toast({
        title: "Success",
        description: "Product added successfully",
      });
      return newProduct;
    } catch (error) {
      console.error("Failed to add product:", error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProduct = async (
    id: number,
    productData: FormData
  ): Promise<Product> => {
    try {
      const updatedProduct = await apiUpdateProduct(id, productData);
      setProducts((prev) =>
        prev.map((product) => (product.id === id ? updatedProduct : product))
      );
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      return updatedProduct;
    } catch (error) {
      console.error("Failed to update product:", error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProduct = async (id: number): Promise<void> => {
    try {
      await apiDeleteProduct(id);
      setProducts((prev) => prev.filter((product) => product.id !== id));
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateStock = async (
    productId: number,
    newStock: number
  ): Promise<void> => {
    try {
      await apiUpdateStock(productId, newStock);
      const updated = products.map((p) =>
        p.id === productId ? { ...p, stock: newStock } : p
      );
      setProducts(updated);
      toast({
        title: "Success",
        description: "Stock updated successfully",
      });
    } catch (error) {
      console.error("Failed to update stock:", error);
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProductImage = async (
    productId: number,
    imageId: number
  ): Promise<void> => {
    try {
      await apiDeleteProductImage(productId, imageId);
      await refreshProducts(); // Refresh to update UI
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete product image:", error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
      throw error;
    }
  };

  const setPrimaryProductImage = async (
    productId: number,
    imageId: number
  ): Promise<void> => {
    try {
      await apiSetPrimaryImage(productId, imageId);
      await refreshProducts(); // Refresh to reflect new primary
      toast({
        title: "Success",
        description: "Primary image set successfully",
      });
    } catch (error) {
      console.error("Failed to set primary image:", error);
      toast({
        title: "Error",
        description: "Failed to set primary image",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Frame Type functions
  const addFrameType = async (name: string, description: string) => {
    try {
      const newType = await createFrameType(name, description);
      setFrameTypes((prev) => [...prev, newType]);
      toast({
        title: "Success",
        description: "Frame type added successfully",
      });
    } catch (error) {
      console.error("Failed to add frame type:", error);
      toast({
        title: "Error",
        description: "Failed to add frame type",
        variant: "destructive",
      });
    }
  };

  const updateFrameType = async (
    id: number,
    name: string,
    description: string
  ) => {
    try {
      const updated = await apiUpdateFrameType(id, name, description);
      setFrameTypes((prev) => prev.map((f) => (f.id === id ? updated : f)));
      toast({
        title: "Success",
        description: "Frame type updated successfully",
      });
    } catch (error) {
      console.error("Failed to update frame type:", error);
      toast({
        title: "Error",
        description: "Failed to update frame type",
        variant: "destructive",
      });
    }
  };

  const deleteFrameType = async (id: number) => {
    try {
      await apiDeleteFrameType(id);
      setFrameTypes((prev) => prev.filter((f) => f.id !== id));
      toast({
        title: "Success",
        description: "Frame type deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete frame type:", error);
      toast({
        title: "Error",
        description: "Failed to delete frame type",
        variant: "destructive",
      });
    }
  };

  // Category functions
  const addCategory = async (name: string, description: string) => {
    try {
      const newCategory = await createCategory(name, description);
      setCategories((prev) => [...prev, newCategory]);
      toast({
        title: "Success",
        description: "Category added successfully",
      });
    } catch (error) {
      console.error("Failed to add category:", error);
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
    }
  };

  const updateCategory = async (
    id: number,
    name: string,
    description: string
  ) => {
    try {
      const updated = await apiUpdateCategory(id, name, description);
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? updated : cat))
      );
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    } catch (error) {
      console.error("Failed to update category:", error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await apiDeleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };


  // Optimized admin profile fetching
  const fetchAdminProfile = useCallback(async () => {
    if (profileLoaded && adminProfile) return; // Skip if already loaded
    
    try {
      setProfileLoading(true);
      const profile = await apiFetchAdminProfile();
      setAdminProfile(profile);
      setProfileLoaded(true);
    } catch (error) {
      console.error("Failed to fetch admin profile:", error);
      toast({
        title: "Error",
        description: "Failed to load admin profile",
        variant: "destructive",
      });
    } finally {
      setProfileLoading(false);
    }
  }, [adminProfile, profileLoaded, toast]);


  const updateAdminProfile = async (profileData: FormData) => {
    try {
      const updatedProfile = await apiUpdateAdminProfile(profileData);
      setAdminProfile(updatedProfile);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      return updatedProfile;
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Add User management functions
  const handleDeactivateCustomer = async (id: number) => {
    try {
      await deactivateCustomer(id);
      const updated = await fetchActiveCustomers();
      setCustomers(updated);
      toast({
        title: "Success",
        description: "Customer deactivated successfully",
      });
    } catch (error) {
      console.error("Failed to deactivate customer:", error);
      toast({
        title: "Error",
        description: "Failed to deactivate customer",
        variant: "destructive",
      });
    }
  };

  const handleActivateCustomer = async (id: number) => {
    try {
      await activateCustomer(id);
      const updated = await fetchActiveCustomers();
      setCustomers(updated);
      toast({
        title: "Success",
        description: "Customer activated successfully",
      });
    } catch (error) {
      console.error("Failed to activate customer:", error);
      toast({
        title: "Error",
        description: "Failed to activate customer",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminContext.Provider
      value={{
        stats,

        orders,
        updateOrderStatus,
        assignDelivery,
        fetchDeliveryPersons,

        appointments,
        deleteAppointment,

        products,
        updateStock,
        deleteProduct,
        addProduct,
        updateProduct,
        refreshProducts,
        setPrimaryProductImage,
        deleteProductImage,

        frameTypes,
        addFrameType,
        updateFrameType,
        deleteFrameType,

        categories,
        addCategory,
        updateCategory,
        deleteCategory,

        adminProfile,
        fetchAdminProfile,
        updateAdminProfile,

        customers,
        deactivateCustomer: handleDeactivateCustomer,
        activateCustomer: handleActivateCustomer,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
