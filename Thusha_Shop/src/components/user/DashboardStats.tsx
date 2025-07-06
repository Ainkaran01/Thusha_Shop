
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Heart, Package, Clock } from "lucide-react";

const DashboardStats = () => {
  const stats = [
    {
      title: "Total Orders",
      value: "12",
      icon: ShoppingBag,
      color: "text-blue-500"
    },
    {
      title: "Wishlist Items",
      value: "8",
      icon: Heart,
      color: "text-red-500"
    },
    {
      title: "Active Orders",
      value: "3",
      icon: Package,
      color: "text-green-500"
    },
    {
      title: "Pending Delivery",
      value: "2",
      icon: Clock,
      color: "text-orange-500"
    }
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

export default DashboardStats;