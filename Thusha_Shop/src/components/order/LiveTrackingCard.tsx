
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { OrderStatus } from "@/types/order";

interface LiveTrackingCardProps {
  currentStatus: OrderStatus;
}

const LiveTrackingCard: React.FC<LiveTrackingCardProps> = ({ currentStatus }) => {
  if (currentStatus !== "shipped") {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Live Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Out for Delivery</p>
              <p className="text-sm text-muted-foreground">Your package is on the delivery truck</p>
            </div>
            <Badge className="bg-orange-500">In Transit</Badge>
          </div>
          <Button className="w-full" variant="outline">
            Track on Map
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveTrackingCard;
