
import React, { useState } from "react";
import { Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardFooter } from "@/components/ui/card";
import { useUser } from "@/context/UserContext";
import { Order } from "@/types";
import OrderSearch from "@/components/order/OrderSearch";
import OrderDetails from "@/components/order/OrderDetails";
import MyOrdersList from "@/components/order/MyOrdersList";

const OrderTracking = () => {
  const { isAuthenticated } = useUser();
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);

  const handleOrderFound = (order: Order) => {
    setFoundOrder(order);
  };

  const handleViewOrder = (order: Order) => {
    setFoundOrder(order);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Package className="mr-2 h-8 w-8" /> Order Tracking
      </h1>
      
      <Tabs defaultValue={isAuthenticated ? "myOrders" : "trackOrder"}>
        <TabsList className="mb-6">
          <TabsTrigger value="trackOrder">Track an Order</TabsTrigger>
          {isAuthenticated && (
            <TabsTrigger value="myOrders">My Orders</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="trackOrder">
          <div className="max-w-3xl mx-auto">
            <OrderSearch onOrderFound={handleOrderFound} />
            
            {foundOrder && (
              <div className="mt-8">
                <OrderDetails order={foundOrder} />
              </div>
            )}
            
            <CardFooter className="flex flex-col items-start space-y-4 mt-6">
              <div className="text-sm text-muted-foreground">
                <p>If you need any assistance, please contact us:</p>
                <p>Email: support@visage-vista.com</p>
                <p>Phone: (800) 555-1234</p>
              </div>
            </CardFooter>
          </div>
        </TabsContent>
        
        {isAuthenticated && (
          <TabsContent value="myOrders">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-semibold mb-6">Your Orders</h2>
              
              {foundOrder ? (
                <div>
                  <button 
                    onClick={() => setFoundOrder(null)}
                    className="mb-4 text-primary hover:underline"
                  >
                    ← Back to Orders List
                  </button>
                  <OrderDetails order={foundOrder} />
                </div>
              ) : (
                <MyOrdersList onViewOrder={handleViewOrder} />
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default OrderTracking;
