import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { OrderStatus } from "@/types";
import { mockOrders, mockAppointments } from "@/components/admin/mockData";
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
  fetchAccessories,
  addAccessory as apiAddAccessory,
  updateAccessory as apiUpdateAccessory,
  deleteAccessory as apiDeleteAccessory,
  updateAccessoryStock as apiUpdateAccessoryStock,
} from "@/api/accessories";
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
} from "@/api/customers";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { Accessory } from "@/types/accessory";

interface AdminContextType {
  orders: typeof mockOrders;
  products: Product[];
  accessories: Accessory[];

  stats: {
    totalSales: number;
    monthlyRevenue: number;
    totalCustomers: number;
    totalOrders: number;
    pendingOrders: number;
    conversion: number;
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
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;

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

  // Accessories
  addAccessory: (accessoryData: FormData) => Promise<Accessory>;
  updateAccessory: (id: number, accessoryData: FormData) => Promise<Accessory>;
  deleteAccessory: (id: number) => Promise<void>;
  updateAccessoryStock: (
    accessoryId: number,
    newStock: number
  ) => Promise<void>;
  refreshAccessories: () => Promise<void>;

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
  const [orders, setOrders] = useState(mockOrders);
  const [products, setProducts] = useState<Product[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalSales: 25890.75,
    monthlyRevenue: 4560.25,
    totalCustomers: 235,
    totalOrders: 412,
    pendingOrders: 23,
    conversion: 3.2,
  });

  const [frameTypes, setFrameTypes] = useState<FrameType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          frameTypesData,
          categoriesData,
          productsData,
          accessoriesData,
          appointmentData,
          customersData,
        ] = await Promise.all([
          getFrameTypes(),
          getCategories(),
          fetchProducts(),
          fetchAccessories(),
          fetchAppointments(),
          fetchActiveCustomers(),
        ]);
        setFrameTypes(frameTypesData);
        setCategories(categoriesData);
        setProducts(productsData);
        setAccessories(accessoriesData);
        setAppointments(appointmentData);
        setCustomers(customersData);
        console.log("✅ Customers fetch response va:", customersData); // ✅ step 2
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

  const refreshAccessories = async (): Promise<void> => {
    try {
      const data = await fetchAccessories();
      setAccessories(data);
    } catch (error) {
      console.error("Failed to fetch accessories:", error);
      toast({
        title: "Error",
        description: "Failed to load accessories",
        variant: "destructive",
      });
    }
  };

  // Order functions
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              updatedAt: new Date().toISOString(),
              updatedBy: "Admin",
            }
          : order
      )
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders(orders.filter((order) => order.id !== orderId));
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

  // ADD accessory
  const addAccessory = async (accessoryData: FormData): Promise<Accessory> => {
    try {
      const newAccessory = await apiAddAccessory(accessoryData);
      setAccessories((prev) => [...prev, newAccessory]);
      toast({
        title: "Success",
        description: "Accessory added successfully",
      });
      return newAccessory;
    } catch (error) {
      console.error("Failed to add accessory:", error);
      toast({
        title: "Error",
        description: "Failed to add accessory",
        variant: "destructive",
      });
      throw error;
    }
  };

  // UPDATE accessory
  const updateAccessory = async (
    id: number,
    accessoryData: FormData
  ): Promise<Accessory> => {
    try {
      const updatedAccessory = await apiUpdateAccessory(id, accessoryData);
      setAccessories((prev) =>
        prev.map((accessory) =>
          accessory.id === id ? updatedAccessory : accessory
        )
      );
      toast({
        title: "Success",
        description: "Accessory updated successfully",
      });
      return updatedAccessory;
    } catch (error) {
      console.error("Failed to update accessory:", error);
      toast({
        title: "Error",
        description: "Failed to update accessory",
        variant: "destructive",
      });
      throw error;
    }
  };

  // DELETE accessory
  const deleteAccessory = async (id: number): Promise<void> => {
    try {
      await apiDeleteAccessory(id);
      setAccessories((prev) => prev.filter((accessory) => accessory.id !== id));
      toast({
        title: "Success",
        description: "Accessory deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete accessory:", error);
      toast({
        title: "Error",
        description: "Failed to delete accessory",
        variant: "destructive",
      });
      throw error;
    }
  };

  // UPDATE AccessoryStock
  const updateAccessoryStock = async (
    accessoryId: number,
    newStock: number
  ): Promise<void> => {
    try {
      await apiUpdateAccessoryStock(accessoryId, newStock);
      const updated = accessories.map((acc) =>
        acc.id === accessoryId ? { ...acc, stock: newStock } : acc
      );
      setAccessories(updated);
      toast({
        title: "Success",
        description: "Stock updated successfully",
      });
    } catch (error) {
      console.error("Failed to update accessory stock:", error);
      toast({
        title: "Error",
        description: "Failed to update accessory stock",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update AdminProfile

  const fetchAdminProfile = async () => {
    const profile = await apiFetchAdminProfile();
    setAdminProfile(profile);
  };

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
        orders,

        stats,
        updateOrderStatus,
        deleteOrder,

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

        accessories,
        updateAccessory,
        addAccessory,
        deleteAccessory,
        updateAccessoryStock,
        refreshAccessories,

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
