
import React from "react";
import { Package, CheckCircle, Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Order } from "@/api/orders";

interface DeliveryStatsProps {
  deliveries: Order[];
}

const DeliveryStats: React.FC<DeliveryStatsProps> = ({ deliveries }) => {
  const pendingDeliveries = deliveries.filter(
    d => d.status === "processing" || d.status === "shipped"
  ).length;
  
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
              <p className="text-2xl font-bold">2</p>
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
              <p className="text-2xl font-bold">1.8 days</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Customer Rating</p>
              <p className="text-2xl font-bold">4.9/5</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryStats;
