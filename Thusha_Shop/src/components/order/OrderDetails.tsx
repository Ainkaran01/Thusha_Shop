
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Order, OrderStatus } from "@/types";
import { Clock, Package, Truck, CheckCircle, HelpCircle } from "lucide-react";

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
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

  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case "pending": return 1;
      case "processing": return 2;
      case "shipped": return 3;
      case "delivered": return 4;
      case "cancelled": return 0;
      default: return 0;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Order #{order.id}</h2>
        <div className="flex items-center">
          <span className={`${getStatusLabel(order.status).color} font-medium`}>
            {getStatusLabel(order.status).label}
          </span>
        </div>
      </div>
      
      {/* Order Progress */}
      <div className="mb-8">
        <div className="relative">
          <div className="flex justify-between mb-2">
            <div className="text-center w-24">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mx-auto ${
                getStatusStep(order.status) >= 1 
                  ? "bg-primary text-primary-foreground" 
                  : order.status === "cancelled" 
                    ? "bg-red-500 text-white" 
                    : "bg-muted text-muted-foreground"
              }`}>
                <Clock className="h-5 w-5" />
              </div>
              <span className="text-xs mt-1 block">Order Placed</span>
            </div>
            <div className="text-center w-24">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mx-auto ${
                getStatusStep(order.status) >= 2 
                  ? "bg-primary text-primary-foreground" 
                  : order.status === "cancelled" 
                    ? "bg-red-500 text-white" 
                    : "bg-muted text-muted-foreground"
              }`}>
                <Package className="h-5 w-5" />
              </div>
              <span className="text-xs mt-1 block">Processing</span>
            </div>
            <div className="text-center w-24">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mx-auto ${
                getStatusStep(order.status) >= 3 
                  ? "bg-primary text-primary-foreground" 
                  : order.status === "cancelled" 
                    ? "bg-red-500 text-white" 
                    : "bg-muted text-muted-foreground"
              }`}>
                <Truck className="h-5 w-5" />
              </div>
              <span className="text-xs mt-1 block">Shipped</span>
            </div>
            <div className="text-center w-24">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mx-auto ${
                getStatusStep(order.status) >= 4 
                  ? "bg-primary text-primary-foreground" 
                  : order.status === "cancelled" 
                    ? "bg-red-500 text-white" 
                    : "bg-muted text-muted-foreground"
              }`}>
                <CheckCircle className="h-5 w-5" />
              </div>
              <span className="text-xs mt-1 block">Delivered</span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="absolute top-5 left-12 right-12 flex items-center">
            <div className={`h-1 flex-1 ${
              getStatusStep(order.status) >= 2 
                ? "bg-primary" 
                : order.status === "cancelled" 
                  ? "bg-red-500" 
                  : "bg-muted"
            }`}></div>
            <div className={`h-1 flex-1 ${
              getStatusStep(order.status) >= 3 
                ? "bg-primary" 
                : order.status === "cancelled" 
                  ? "bg-red-500" 
                  : "bg-muted"
            }`}></div>
            <div className={`h-1 flex-1 ${
              getStatusStep(order.status) >= 4 
                ? "bg-primary" 
                : order.status === "cancelled" 
                  ? "bg-red-500" 
                  : "bg-muted"
            }`}></div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Order Details</h3>
          <div className="text-sm space-y-1">
            <p><span className="text-muted-foreground">Date Placed:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p><span className="text-muted-foreground">Total Amount:</span> ${order.totalAmount.toFixed(2)}</p>
            <p><span className="text-muted-foreground">Payment Method:</span> {order.paymentMethod}</p>
            {order.trackingNumber && (
              <p><span className="text-muted-foreground">Tracking Number:</span> {order.trackingNumber}</p>
            )}
            <p><span className="text-muted-foreground">Estimated Delivery:</span> {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Shipping Address</h3>
          <div className="text-sm space-y-1">
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </p>
            <p>{order.shippingAddress.country}</p>
            <p>Phone: {order.shippingAddress.phone}</p>
          </div>
        </div>
      </div>
      
      <Separator className="my-6" />
      
      <h3 className="font-semibold mb-4">Order Items</h3>
      <div className="space-y-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between">
            <div>
              <div className="font-medium">Product #{item.productId}</div>
              <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
            </div>
            <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetails;
