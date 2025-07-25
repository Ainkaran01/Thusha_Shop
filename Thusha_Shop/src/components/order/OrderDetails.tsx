import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Order, OrderStatus } from "@/types/order";
import {
  Clock,
  Package,
  Truck,
  CheckCircle,
  HelpCircle
} from "lucide-react";

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return { label: "Pending", color: "text-yellow-500", icon: Clock };
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
        <h2 className="text-xl font-semibold">{order.order_number}</h2>
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
            {[
              { step: 1, label: "Order Placed", Icon: Clock },
              { step: 2, label: "Processing", Icon: Package },
              { step: 3, label: "Shipped", Icon: Truck },
              { step: 4, label: "Delivered", Icon: CheckCircle },
            ].map(({ step, label, Icon }, index) => (
              <div className="text-center w-24" key={index}>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center mx-auto ${
                  getStatusStep(order.status) >= step
                    ? "bg-primary text-primary-foreground"
                    : order.status === "cancelled"
                    ? "bg-red-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs mt-1 block">{label}</span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="absolute top-5 left-12 right-12 flex items-center">
            {[2, 3, 4].map((s, i) => (
              <div key={i} className={`h-1 flex-1 ${
                getStatusStep(order.status) >= s
                  ? "bg-primary"
                  : order.status === "cancelled"
                  ? "bg-red-500"
                  : "bg-muted"
              }`} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Order Details</h3>
          <div className="text-sm space-y-1">
            <p><span className="text-muted-foreground">Date Placed:</span> {new Date(order.created_at).toLocaleDateString()}</p>
            <p><span className="text-muted-foreground">Total Amount:</span> LKR { order.total_price}</p>
            <p><span className="text-muted-foreground">Payment Method:</span> {order.payment_method}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Billing Info</h3>
          <div className="text-sm space-y-1">
            <p>{order.billing.name}</p>
            <p>{order.billing.address1}</p>
            {order.billing.address2 && <p>{order.billing.address2}</p>}
            <p>{order.billing.city}, {order.billing.state} {order.billing.zipCode}</p>
            <p>{order.billing.country}</p>
            <p>Phone: {order.billing.phone}</p>
            <p>Email: {order.billing.email}</p>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <h3 className="font-semibold mb-4">Order Items</h3>
      <div className="space-y-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between">
            <div>
              <div className="font-medium">{item.product_name}</div>
              <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
            </div>
            <div className="font-medium">LKR {(item.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetails;
