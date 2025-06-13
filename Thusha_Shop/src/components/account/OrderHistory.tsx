import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Eye, Download, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOrderHistory } from "@/hooks/useOrderHistory";

// Mock order data - in a real app this would come from a backend
const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-05-15",
    status: "delivered",
    total: 159.99,
    items: [
      { 
        id: 1,
        name: "Classic Aviator Frames", 
        quantity: 1, 
        price: 89.99,
        image: "/placeholder.svg",
        frameType: "Aviator",
        frameMaterial: "Metal",
        color: "Gold"
      },
      { 
        id: 2,
        name: "Anti-Blue Light Lenses", 
        quantity: 1, 
        price: 49.99,
        image: "/placeholder.svg",
        frameType: "Lens",
        frameMaterial: "Plastic",
        color: "Clear"
      },
      { 
        id: 3,
        name: "Lens Cleaning Kit", 
        quantity: 1, 
        price: 19.99,
        image: "/placeholder.svg",
        frameType: "Accessory",
        frameMaterial: "Mixed",
        color: "Blue"
      }
    ]
  },
  {
    id: "ORD-002",
    date: "2024-04-22",
    status: "shipped",
    total: 124.99,
    items: [
      { 
        id: 4,
        name: "Round Tortoiseshell Frames", 
        quantity: 1, 
        price: 99.99,
        image: "/placeholder.svg",
        frameType: "Round",
        frameMaterial: "Plastic",
        color: "Tortoiseshell"
      },
      { 
        id: 5,
        name: "UV Protection Spray", 
        quantity: 1, 
        price: 24.99,
        image: "/placeholder.svg",
        frameType: "Accessory",
        frameMaterial: "Liquid",
        color: "Clear"
      }
    ]
  },
  {
    id: "ORD-003",
    date: "2024-04-10",
    status: "processing",
    total: 199.99,
    items: [
      { 
        id: 6,
        name: "Designer Cat-Eye Frames", 
        quantity: 1, 
        price: 149.99,
        image: "/placeholder.svg",
        frameType: "Cat-Eye",
        frameMaterial: "Metal",
        color: "Black"
      },
      { 
        id: 7,
        name: "Progressive Lenses", 
        quantity: 1, 
        price: 49.99,
        image: "/placeholder.svg",
        frameType: "Lens",
        frameMaterial: "Glass",
        color: "Clear"
      }
    ]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "processing":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const OrderHistory = () => {
  const navigate = useNavigate();
  const { handleViewDetails, handleDownloadInvoice, handleReorder } = useOrderHistory();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Order History</h2>
      
      {mockOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't placed any orders yet. Start shopping to see your order history here.
            </p>
            <Button onClick={() => navigate('/catalog')}>Start Shopping</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {mockOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <span className="font-semibold">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <span className="font-medium">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2"
                    onClick={() => handleViewDetails(order.id)}
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2"
                    onClick={() => handleDownloadInvoice(order.id)}
                  >
                    <Download className="h-4 w-4" />
                    Download Invoice
                  </Button>
                  {order.status === "delivered" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => handleReorder(order)}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reorder
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
