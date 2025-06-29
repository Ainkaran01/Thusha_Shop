
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingBag, Package, Heart, Calendar, Eye, Phone } from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      title: "Browse Catalog",
      description: "Explore our eyewear collection",
      icon: ShoppingBag,
      href: "/catalog",
      color: "bg-blue-500"
    },
    {
      title: "Track Orders",
      description: "Check your order status",
      icon: Package,
      href: "/order-tracking",
      color: "bg-green-500"
    },
    {
      title: "View Wishlist",
      description: "See your saved items",
      icon: Heart,
      href: "/wishlist",
      color: "bg-red-500"
    },
    {
      title: "Book Appointment",
      description: "Schedule eye exam",
      icon: Calendar,
      href: "/doctor-appointment",
      color: "bg-purple-500"
    },
    
    {
      title: "Contact Support",
      description: "Get help from our team",
      icon: Phone,
      href: "/contact",
      color: "bg-gray-500"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              asChild
              variant="outline"
              className="h-auto p-4 justify-start"
            >
              <Link to={action.href} className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <action.icon className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium">{action.title}</p>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;