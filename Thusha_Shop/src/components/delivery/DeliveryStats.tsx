
import React from "react";
import { Package, CheckCircle, Clock, PackageCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Order } from "@/api/orders";

interface DeliveryStatsProps {
  deliveries: Order[];
}

const DeliveryStats: React.FC<DeliveryStatsProps> = ({ deliveries }) => {
  const pendingDeliveries = deliveries.filter(
    d => d.status === "processing" || d.status === "shipped"
  ).length;

const today = new Date().toISOString().slice(0, 10); // e.g., "2025-07-08"
const completedToday = deliveries.filter(
  (d) =>
    d.status === "delivered" &&
    d.status_updated_at?.slice(0, 10) === today
).length;

const deliveredOrders = deliveries.filter(
  (d) =>
    d.status === "delivered" &&
    d.status_updated_at &&
    d.delivery?.assigned_at
);

const deliveryTimes = deliveredOrders.map((order) => {
  const assigned = new Date(order.delivery.assigned_at);
  const delivered = new Date(order.status_updated_at!);
  const diffMs = delivered.getTime() - assigned.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays;
});

const averageDeliveryTime =
  deliveryTimes.length > 0
    ? (deliveryTimes.reduce((a, b) => a + b, 0) / deliveryTimes.length).toFixed(1)
    : "N/A";

  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Pending Deliveries</p>
              <p className="text-2xl font-bold">{pendingDeliveries}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Completed Today</p>
              <p className="text-2xl font-bold">{completedToday}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Average Delivery Time</p>
              <p className="text-2xl font-bold"> {averageDeliveryTime !== "N/A" ? `${averageDeliveryTime} days` : "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              <PackageCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Completed Orders</p>
              <p className="text-2xl font-bold">{deliveredOrders.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryStats;
