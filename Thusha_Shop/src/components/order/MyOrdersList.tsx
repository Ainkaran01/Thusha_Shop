
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Clock, CheckCircle, Truck, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { orders } from "@/data/products";
import { Order, OrderStatus } from "@/types";

interface MyOrdersListProps {
  onViewOrder: (order: Order) => void;
}

const MyOrdersList: React.FC<MyOrdersListProps> = ({ onViewOrder }) => {
  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return { label: "Order Pending", color: "text-yellow-500", icon: Clock };
      case "processing":
        return { label: "Processing", color: "text-blue-500", icon: Package };
      case "shipped":
        return { label: "Shipped", color: "text-indigo-500", icon: Truck };
      case "delivered":
        return { label: "Delivered", color: "text-green-500", icon: CheckCircle };
      case "cancelled":
        return { label: "Cancelled", color: "text-red-500", icon: HelpCircle };
      default:
        return { label: "Unknown", color: "text-gray-500", icon: HelpCircle };
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-background rounded-lg">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No orders yet</h3>
        <p className="text-muted-foreground mb-6">
          You haven't placed any orders yet. Start shopping to place your first order.
        </p>
        <Button asChild>
          <Link to="/catalog">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => {
        // Ensure order.status is treated as OrderStatus
        const typedOrder: Order = {
          ...order,
          status: order.status as OrderStatus
        };
        
        return (
          <Card key={order.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-base">Order #{order.id}</CardTitle>
                <CardDescription>
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-1">
                {(() => {
                  const { icon: StatusIcon, color } = getStatusLabel(typedOrder.status);
                  return (
                    <span className={`${color} flex items-center`}>
                      <StatusIcon className="h-4 w-4 mr-1" />
                      {getStatusLabel(typedOrder.status).label}
                    </span>
                  );
                })()}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
                </div>
                
                <div className="text-sm">
                  <span className="text-muted-foreground">Items:</span>{" "}
                  {order.items.length} {order.items.length === 1 ? "item" : "items"}
                </div>
                
                {order.trackingNumber && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Tracking Number:</span>{" "}
                    {order.trackingNumber}
                  </div>
                )}
                
                <div className="text-sm">
                  <span className="text-muted-foreground">Estimated Delivery:</span>{" "}
                  {new Date(order.estimatedDelivery).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full"
                onClick={() => onViewOrder(typedOrder)}
              >
                View Order Details
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default MyOrdersList;
