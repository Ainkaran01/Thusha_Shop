import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

import DeliveryHeader from "@/components/delivery/DeliveryHeader";
import DeliveryStats from "@/components/delivery/DeliveryStats";
import DeliveryList from "@/components/delivery/DeliveryList";
import DeliveryDetails from "@/components/delivery/DeliveryDetails";
import DeleteDeliveryDialog from "@/components/delivery/DeleteDeliveryDialog";
import PasswordChangeForm from "@/components/account/PasswordChangeForm";

import type { Order, OrderStatus } from "@/types";

const mockDeliveries: Order[] = [
  {
    id: "ord-123456",
    userId: "user-123",
    items: [
      { 
        productId: 1, 
        quantity: 1, 
        price: 149.99,
        frameDetails: {
          name: "Classic Aviator",
          color: "Gold",
          material: "Metal"
        },
        lensDetails: {
          type: "prescription",
          option: "Premium Prescription"
        }
      }
    ],
    totalAmount: 279.98,
    status: "shipped",
    shippingAddress: {
      fullName: "Emily Johnson",
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "USA",
      phone: "415-555-1234"
    },
    paymentMethod: "credit_card",
    createdAt: "2025-04-28T08:00:00Z",
    updatedAt: "2025-04-29T09:30:00Z",
    estimatedDelivery: "2025-05-03",
    trackingNumber: "TRK789012345",
    assignedDeliveryPerson: "Current Delivery Person"
  },
  {
    id: "ord-234567",
    userId: "user-456",
    items: [
      { 
        productId: 3, 
        quantity: 1, 
        price: 199.99,
        frameDetails: {
          name: "Modern Square",
          color: "Black", 
          material: "Acetate"
        },
        lensDetails: {
          type: "standard",
          option: "Anti-Blue Light"
        }
      }
    ],
    totalAmount: 199.99,
    status: "shipped",
    shippingAddress: {
      fullName: "Michael Chen",
      street: "456 Oak Ave",
      city: "San Jose",
      state: "CA",
      zipCode: "95113",
      country: "USA",
      phone: "408-555-6789"
    },
    paymentMethod: "paypal",
    createdAt: "2025-04-29T10:15:00Z",
    updatedAt: "2025-04-30T11:45:00Z",
    estimatedDelivery: "2025-05-04",
    trackingNumber: "TRK890123456",
    assignedDeliveryPerson: "Current Delivery Person"
  }
];

const DeliveryDashboard = () => {
  const { user } = useUser();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("assigned");
  const [deliveries, setDeliveries] = useState<Order[]>(mockDeliveries);
  const [selectedDelivery, setSelectedDelivery] = useState<Order | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const assignedDeliveries = deliveries.filter(delivery => 
    delivery.assignedDeliveryPerson === "Current Delivery Person" &&
    (delivery.status === "shipped" || delivery.status === "delivered")
  );
  
  const filteredDeliveries = assignedDeliveries.filter(delivery => {
    if (activeTab === "assigned") return delivery.status === "shipped";
    if (activeTab === "delivered") return delivery.status === "delivered";
    return false;
  });
  
  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    if (status !== "delivered") {
      toast({
        title: "Action Not Allowed",
        description: "Delivery personnel can only mark orders as Delivered",
        variant: "destructive"
      });
      return;
    }

    setDeliveries(prev => 
      prev.map(delivery => 
        delivery.id === orderId 
          ? { ...delivery, status: status, updatedAt: new Date().toISOString() } 
          : delivery
      )
    );
    
    // Automatically go back to delivery list after marking as delivered
    setSelectedDelivery(null);
    
    toast({
      title: "Status Updated",
      description: `Order ${orderId} marked as ${status}`,
    });
  };
  
  const handleViewDetails = (delivery: Order) => {
    setSelectedDelivery(delivery);
  };
  
  const handleCloseDetails = () => {
    setSelectedDelivery(null);
  };
  
  const handleDeleteDelivery = (id: string) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };
  
  const confirmDelete = () => {
    if (!deleteId) return;
    
    setDeliveries(prev => prev.filter(delivery => delivery.id !== deleteId));
    
    if (selectedDelivery && selectedDelivery.id === deleteId) {
      setSelectedDelivery(null);
    }
    
    toast({
      title: "Delivery Removed",
      description: `Order ${deleteId} has been removed from your list.`,
      variant: "destructive",
    });
    
    setShowDeleteDialog(false);
    setDeleteId(null);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <DeliveryHeader user={user} />
      
      <DeleteDeliveryDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirmDelete={confirmDelete}
      />

      <Tabs defaultValue="deliveries" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
          <TabsTrigger value="settings">Account Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="deliveries">
          {selectedDelivery ? (
            <div className="mb-8">
              <DeliveryDetails
                delivery={selectedDelivery}
                onBack={handleCloseDetails}
                onStatusChange={handleStatusChange} onEdit={function (): void {
                  throw new Error("Function not implemented.");
                } } isEditing={false}              />
            </div>
          ) : (
            <>
              <DeliveryStats deliveries={assignedDeliveries} />
              <DeliveryList
                deliveries={assignedDeliveries}
                filteredDeliveries={filteredDeliveries}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onViewDetails={handleViewDetails}
                onDeleteDelivery={handleDeleteDelivery}
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