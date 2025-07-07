import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

import DeliveryHeader from "@/components/delivery/DeliveryHeader";
import DeliveryStats from "@/components/delivery/DeliveryStats";
import DeliveryList from "@/components/delivery/DeliveryList";
import DeliveryDetails from "@/components/delivery/DeliveryDetails";
import PasswordChangeForm from "@/components/account/PasswordChangeForm";
import { fetchOrders, updateOrderStatus,Order, OrderStatus } from "@/api/orders";

const DeliveryDashboard = () => {
  const { user } = useUser();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("assigned");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await fetchOrders();
        const assignedOrders = data.filter(order => 
          order.assigned_delivery_person?.email === user?.email
        );
        setOrders(assignedOrders);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch orders",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  const handleStatusUpdate = async (orderNumber: string, status: OrderStatus) => {
    if (status !== "delivered") {
      toast({
        title: "Action Not Allowed",
        description: "You can only mark orders as Delivered",
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdatingStatus(orderNumber);
      const updatedOrder = await updateOrderStatus(orderNumber, status);

      setOrders(prev =>
        prev.map(order =>
          order.order_number === orderNumber
            ? { ...order, status: status }
            : order
        )
      );

      if (selectedOrder?.order_number === orderNumber) {
        setSelectedOrder(updatedOrder);
      }

      toast({
        title: "Status Updated",
        description: `Order ${orderNumber} marked as delivered`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const assignedDeliveries = orders.filter(order =>
    order.status === "shipped" || order.status === "delivered"
  );

  const filteredDeliveries = assignedDeliveries.filter(order => {
    if (activeTab === "assigned") return order.status === "shipped";
    if (activeTab === "delivered") return order.status === "delivered";
    return false;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <DeliveryHeader user={user} />

      <Tabs defaultValue="deliveries" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
          <TabsTrigger value="settings">Account Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="deliveries">
          {selectedOrder ? (
            <div className="mb-8">
              <DeliveryDetails
                delivery={selectedOrder}
                onBack={() => setSelectedOrder(null)}
                onStatusChange={handleStatusUpdate}
                isEditing={false}
              />
            </div>
          ) : (
            <>
              <DeliveryStats deliveries={assignedDeliveries} />
              <DeliveryList
                deliveries={assignedDeliveries}
                filteredDeliveries={filteredDeliveries}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onViewDetails={setSelectedOrder}
              />
            </>
          )}
        </TabsContent>

        <TabsContent value="settings">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PasswordChangeForm />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeliveryDashboard;
