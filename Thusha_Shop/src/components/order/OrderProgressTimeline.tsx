
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Package, Truck, MapPin, Clock } from "lucide-react";
import { OrderStatus } from "@/types/order";

interface OrderProgressTimelineProps {
  currentStatus: OrderStatus;
}

const OrderProgressTimeline: React.FC<OrderProgressTimelineProps> = ({ currentStatus }) => {
  const statusSteps = [
    { 
      status: "pending", 
      label: "Order Placed", 
      icon: <Circle className="h-5 w-5" />,
      description: "Your order has been received and is being verified"
    },
    { 
      status: "processing", 
      label: "Processing", 
      icon: <Package className="h-5 w-5" />,
      description: "Your eyewear is being prepared and quality checked"
    },
    { 
      status: "ready_to_deliver", 
      label: "Ready to Ship", 
      icon: <Clock className="h-5 w-5" />,
      description: "Your order is packed and ready for pickup"
    },
    { 
      status: "shipped", 
      label: "Shipped", 
      icon: <Truck className="h-5 w-5" />,
      description: "Your order is on its way to you"
    },
    { 
      status: "delivered", 
      label: "Delivered", 
      icon: <CheckCircle className="h-5 w-5" />,
      description: "Your order has been successfully delivered"
    }
  ];

  const getStatusIndex = (status: OrderStatus) => {
    return statusSteps.findIndex(step => step.status === status);
  };

  const currentStatusIndex = getStatusIndex(currentStatus);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            
            return (
              <div key={step.status} className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className={`font-medium ${isCurrent ? 'text-primary' : ''}`}>
                      {step.label}
                    </h4>
                    {isCurrent && (
                      <Badge variant="outline" className="animate-pulse">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.description}
                  </p>
                  {isCompleted && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Updated: {new Date().toLocaleDateString()}
                    </p>
                  )}
                </div>
                
                {index < statusSteps.length - 1 && (
                  <div className={`w-px h-16 ml-5 ${
                    isCompleted ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderProgressTimeline;
