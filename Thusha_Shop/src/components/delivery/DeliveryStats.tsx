
import React from "react";
import { Package, CheckCircle, Clock, PackageCheck ,DollarSign } from "lucide-react";
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

const currentDate = new Date(); 
const dateOnly = (d: Date) => d.toISOString().slice(0, 10);

const getCODTotalForDay = (daysAgo: number) => {
  const target = new Date();
  target.setDate(currentDate.getDate() - daysAgo); 
  const targetDate = dateOnly(target);

  return deliveries
    .filter(
      (d) =>
        d.status === "delivered" &&
        d.payment_method?.toLowerCase() === "cash" &&
        d.status_updated_at &&
        d.status_updated_at.slice(0, 10) === targetDate
    )
    .reduce((sum, d) => sum + parseFloat(d.total_price), 0);
};

const codToday = getCODTotalForDay(0);
const codYesterday = getCODTotalForDay(1);
const cod2DaysAgo = getCODTotalForDay(2);

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

      {/* ✅ COD Summary Card */}
      <Card className="sm:col-span-2 lg:col-span-4 border border-indigo-100 hover:shadow-md transition-shadow">
        <CardContent className="pt-6 pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Header Section */}
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Cash on Delivery</h3>
                <p className="text-sm text-gray-500">Last 3 days summary</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {/* Today */}
              <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                <p className="text-xs font-medium text-indigo-600 mb-1">Today</p>
                <p className="text-lg font-bold text-gray-800 truncate">
                  LKR {codToday.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>               
              </div>

              {/* Yesterday */}
              <div className="bg-indigo-50/30 p-3 rounded-lg border border-indigo-100">
                <p className="text-xs font-medium text-indigo-600 mb-1">Yesterday</p>
                <p className="text-lg font-bold text-gray-800 truncate">
                  LKR {codYesterday.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>

              {/* 2 Days Ago */}
              <div className="bg-indigo-50/10 p-3 rounded-lg border border-indigo-100">
                <p className="text-xs font-medium text-indigo-600 mb-1">2 Days Ago</p>
                <p className="text-lg font-bold text-gray-800 truncate">
                  LKR {cod2DaysAgo.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryStats;
