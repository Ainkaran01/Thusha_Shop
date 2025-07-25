import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Heart, Package, Clock } from "lucide-react";
import { getUserOrders } from "@/services/apiService";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "@/components/ui/use-toast";

interface Order {
  order_number: string;
  status: string;

}

const DashboardStatsPage = () => {
  const { wishlistItems } = useWishlist();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await getUserOrders();
        setOrders(ordersData);
      } catch (error: any) {
        console.error("Failed to fetch orders", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load orders",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const totalOrders = orders.length;
  const wishlistCount = wishlistItems.length;
  const activeOrders = orders.filter((order) =>
    ["processing", "pending", "shipped"].includes(order.status.toLowerCase())
  ).length;
  const Delivered = orders.filter((order) =>
    ["delivered"].includes(order.status.toLowerCase())
  ).length;

  const stats = [
    {
      title: "Total Orders",
      value: loading ? "..." : totalOrders,
      icon: ShoppingBag,
      color: "text-blue-500",
    },
    {
      title: "Wishlist Items",
      value: loading ? "..." : wishlistCount,
      icon: Heart,
      color: "text-red-500",
    },
    {
      title: "Active Orders",
      value: loading ? "..." : activeOrders,
      icon: Package,
      color: "text-green-500",
    },
    {
      title: "Delivered Orders",
      value: loading ? "..." : Delivered,
      icon: Clock,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStatsPage;
