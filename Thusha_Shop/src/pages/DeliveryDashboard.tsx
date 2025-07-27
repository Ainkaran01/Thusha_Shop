import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import DeliveryHeader from "@/components/delivery/DeliveryHeader";
import DeliveryStats from "@/components/delivery/DeliveryStats";
import DeliveryList from "@/components/delivery/DeliveryList";
import DeliveryDetails from "@/components/delivery/DeliveryDetails";
import PasswordChangeForm from "@/components/account/PasswordChangeForm";
import { fetchOrders, updateOrderStatus, Order, OrderStatus } from "@/api/orders";

const DeliveryDashboard = () => {
  const { user } = useUser();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("pending");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState<{orderNumber: string, status: OrderStatus} | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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
      setShowConfirmDialog(false);
      setOrderToUpdate(null);
    }
  };

  const initiateStatusUpdate = (orderNumber: string, status: OrderStatus) => {
    setOrderToUpdate({ orderNumber, status });
    setShowConfirmDialog(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
    toast({
      title: "Edit Mode",
      description: "You can now edit the delivery details",
    });
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    toast({
      title: "Changes Saved",
      description: "Delivery details updated successfully",
    });
    // Here you would typically call an API to save the changes
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    toast({
      title: "Edit Cancelled",
      description: "No changes were made",
    });
  };

  const assignedDeliveries = orders.filter(order =>
    order.status === "shipped" || order.status === "delivered"
  );

  const filteredDeliveries = assignedDeliveries.filter(order => {
    if (activeTab === "pending") return order.status === "shipped";
    if (activeTab === "delivered") return order.status === "delivered";
    if (activeTab === "all") return true;
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
                onBack={() => {
                  setIsEditing(false);
                  setSelectedOrder(null);
                }}
                onStatusChange={initiateStatusUpdate}
                onEdit={handleEdit}
                isEditing={isEditing}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
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
                onStatusUpdate={initiateStatusUpdate}
                updatingStatus={updatingStatus}
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

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delivery</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark order {orderToUpdate?.orderNumber} as delivered?
              This will notify the customer and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (orderToUpdate) {
                  handleStatusUpdate(orderToUpdate.orderNumber, orderToUpdate.status);
                }
              }}
              disabled={updatingStatus === orderToUpdate?.orderNumber}
            >
              {updatingStatus === orderToUpdate?.orderNumber ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                "Confirm Delivery"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeliveryDashboard;