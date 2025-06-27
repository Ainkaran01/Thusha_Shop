
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types";

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: OrderStatus;
  date: string;
  items: number;
}

interface RecentOrdersProps {
  orders: Order[];
  onViewAllOrders: () => void;
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders, onViewAllOrders }) => {
  // Function to get badge variant based on order status
  const getOrderBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case "delivered": return "default";
      case "shipped": return "secondary";
      case "processing": return "outline";
      case "cancelled": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">{order.id}</p>
                <p className="text-sm text-muted-foreground">{order.customer}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${order.amount}</p>
                <Badge variant={getOrderBadgeVariant(order.status)}>
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4" onClick={onViewAllOrders}>View All Orders</Button>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
