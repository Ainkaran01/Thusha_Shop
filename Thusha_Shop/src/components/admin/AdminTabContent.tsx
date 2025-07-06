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
import ContactUsTable from "@/components/admin/ContactUsTable";
import AccountSettings from "@/components/admin/AccountSettings";
import { useState,useEffect } from "react";
import { fetchProductCategoryCounts } from "@/api/products";

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

    customers,
    deactivateCustomer,
    activateCustomer,

  } = useAdminDashboard();

  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [categoryData, setCategoryData] = useState<{ id: string; value: number }[]>([]);

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

  useEffect(() => {
  fetchProductCategoryCounts().then((data) => {
    setCategoryData(data);
  }).catch((err) => {
    console.error("Failed to fetch category chart data:", err);
  });
}, []);


  const handleAssignDelivery = async (orderId: number, deliveryPersonId: number) => {
    try {
      await assignDelivery(orderId, deliveryPersonId);
      console.log(`Assigned order ${orderId} to delivery person ${deliveryPersonId}`);
    } catch (error) {
      console.error("Failed to assign delivery:", error);
    }
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
          onUpdateOrderStatus={async (orderNumber, newStatus) => {
            try {
              await updateOrderStatus(orderNumber, newStatus);
            } catch (error) {
              console.error("Failed to update status", error);
            }
          }}
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
