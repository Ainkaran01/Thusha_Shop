import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Clock, CheckCircle, Truck, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Order, OrderStatus } from "@/types/order";
import { getUserOrders } from "@/services/apiService"; // adjust path if different
import { Loader2 } from "lucide-react";

interface MyOrdersListProps {
  onViewOrder: (order: Order) => void;
}

const MyOrdersList: React.FC<MyOrdersListProps> = ({ onViewOrder }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders();
        setOrders(data);
        console.log(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading your orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <HelpCircle className="h-8 w-8 mx-auto mb-2" />
        <p>{error}</p>
      </div>
    );
  }

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
        const typedOrder: Order = {
          ...order,
          status: order.status as OrderStatus
        };

        const { icon: StatusIcon, color, label } = getStatusLabel(typedOrder.status);

        return (
          <Card key={order.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-base">Order #{order.id}</CardTitle>
                <CardDescription>
                  Placed on {new Date(order.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-1">
                <span className={`${color} flex items-center`}>
                  <StatusIcon className="h-4 w-4 mr-1" />
                  {label}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-medium"> LKR { order.total_price}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Items:</span>{" "}
                  {order.items.length} {order.items.length === 1 ? "item" : "items"}
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
