import React, { useEffect, useState } from "react";
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
import ContactUsTable, { ContactMessage } from "@/components/admin/ContactUsTable";
import AccountSettings from "@/components/admin/AccountSettings";
import { useState,useEffect } from "react";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

// Import mock data
import {
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

    accessories,
    updateAccessory,
    addAccessory,
    deleteAccessory,
    updateAccessoryStock,

    customers,
    deactivateCustomer,
    activateCustomer,

  } = useAdminDashboard();

  const [contacts, setContacts] = useState<ContactMessage[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/messages/");
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    };

    fetchContacts();
  }, []);


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
          onDeleteAppointment={deleteAppointment}
        />
      </TabsContent>

      <TabsContent value="customers">
        <CustomersTable
          customers={customers}
          onDeactivateCustomer={deactivateCustomer}
          onActivateCustomer={activateCustomer}
          onCreateStaffAccount={onCreateStaffAccount}
        />
      </TabsContent>

      <TabsContent value="contactus">
        <ContactUsTable contacts={contacts} />
      </TabsContent>

      <TabsContent value="settings">
        <AccountSettings />
      </TabsContent>
    </>

  );
};

// Add static propTypes to help with dynamic prop checking
AdminTabContent.propTypes = {
  onCreateStaffAccount: () => null,
};

export default AdminTabContent;
