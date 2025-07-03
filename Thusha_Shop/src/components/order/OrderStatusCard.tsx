
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types/order";

interface OrderStatusCardProps {
  orderId: string;
  currentStatus: OrderStatus;
  trackingNumber?: string;
  estimatedDelivery: string;
  currentTime: Date;
}

const OrderStatusCard: React.FC<OrderStatusCardProps> = ({
  orderId,
  currentStatus,
  trackingNumber,
  estimatedDelivery,
  currentTime
}) => {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "processing": return "bg-blue-500";
      case "shipped": return "bg-orange-500";
      case "delivered": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Order #{orderId}</span>
          <Badge className={getStatusColor(currentStatus)}>
            {currentStatus.replace('_', ' ').toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Tracking Number</p>
            <p className="font-semibold">{trackingNumber || "TRK-" + orderId}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Estimated Delivery</p>
            <p className="font-semibold">{estimatedDelivery}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Updated</p>
            <p className="font-semibold">{currentTime.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderStatusCard;
