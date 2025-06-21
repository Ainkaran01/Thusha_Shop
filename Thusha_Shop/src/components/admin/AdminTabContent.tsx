import React from "react";
import { useAdminDashboard } from "@/context/AdminDashboardContext";
import { useUser } from "@/context/UserContext";
import { TabsContent } from "@/components/ui/tabs";
import { StaffAccountReceiverProps } from "./StaffAccountManager";

// Import dashboard components
import DashboardOverview from "@/components/admin/DashboardOverview";
import OrdersTable from "@/components/admin/OrdersTable";
import ProductsTable from "@/components/admin/ProductsTable";
import AppointmentsTable from "@/components/admin/AppointmentsTable";
import CustomersTable from "@/components/admin/CustomersTable";
import ProfileSettings from "@/components/admin/ProfileSettings";

// Import mock data
import {
  mockCustomers,
  salesData,
  categoryData,
} from "@/components/admin/mockData";

interface AdminTabContentProps extends StaffAccountReceiverProps {
  viewMode: "list" | "grid";
  setActiveTab: (tab: string) => void;
}

const AdminTabContent: React.FC<AdminTabContentProps> = ({
  viewMode,
  setActiveTab,
  onCreateStaffAccount,
}) => {
  const { user } = useUser();
  const {
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
    addProduct,
    updateProduct,

    accessories,
    updateAccessory,
    addAccessory,
    deleteAccessory,
    updateAccessoryStock,

  } = useAdminDashboard();

  const handleUpdateAppointmentStatus = (
    appointmentId: string,
    newStatus: string
  ) => {
    // Only doctors can update appointment status
    if (user?.role === "admin") {
      return;
    }

    updateAppointmentStatus(appointmentId, newStatus);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    // Only doctors can delete appointments
    if (user?.role === "admin") {
      return;
    }

    deleteAppointment(appointmentId);
  };

  const handleAssignDelivery = (orderId: string, deliveryPerson: string) => {
    // Handle delivery assignment logic here
    console.log(`Assigning order ${orderId} to ${deliveryPerson}`);
  };

  return (
    <>
      <TabsContent value="overview">
        <DashboardOverview
          viewMode={viewMode}
          stats={stats}
          orders={orders}
          products={products}
          appointments={appointments}
          salesData={salesData}
          categoryData={categoryData}
          setActiveTab={setActiveTab}
        />
      </TabsContent>

      <TabsContent value="orders">
        <OrdersTable
          orders={orders}
          onUpdateOrderStatus={updateOrderStatus}
          onDeleteOrder={deleteOrder}
          onAssignDelivery={handleAssignDelivery}
        />
      </TabsContent>

      <TabsContent value="products">
        <ProductsTable
          products={products}
          onUpdateStock={updateStock}
          onDeleteProduct={deleteProduct}
          onAddProduct={addProduct}
          onUpdateProduct={updateProduct}

          accessories={accessories}
          onUpdateAccessoryStock={updateAccessoryStock}
          onDeleteAccessory={deleteAccessory}
          onAddAccessory={addAccessory}
          onUpdateAccessory={updateAccessory}
        />
      </TabsContent>

      <TabsContent value="appointments">
        <AppointmentsTable
          appointments={appointments}
          onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
          onDeleteAppointment={handleDeleteAppointment}
          onCreateStaffAccount={onCreateStaffAccount}
        />
      </TabsContent>

      <TabsContent value="customers">
        <CustomersTable
          customers={mockCustomers}
          onCreateStaffAccount={onCreateStaffAccount}
        />
      </TabsContent>

      <TabsContent value="settings">
        <ProfileSettings />
      </TabsContent>
    </>
  );
};

// Add static propTypes to help with dynamic prop checking
AdminTabContent.propTypes = {
  onCreateStaffAccount: () => null,
};

export default AdminTabContent;
