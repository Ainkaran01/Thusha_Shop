
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Truck, Store } from "lucide-react";

interface DeliveryOptionsProps {
  selectedOption: "home" | "pickup";
  onOptionChange: (option: "home" | "pickup") => void;
  shippingCost: number;
}

const DeliveryOptions: React.FC<DeliveryOptionsProps> = ({
  selectedOption,
  onOptionChange,
  shippingCost,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Options</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedOption} onValueChange={onOptionChange}>
          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent">
            <RadioGroupItem value="home" id="home-delivery" />
            <Label htmlFor="home-delivery" className="flex items-center space-x-3 cursor-pointer flex-1">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Home Delivery</div>
                <div className="text-sm text-muted-foreground">
                  Delivered to your address in 3-5 business days
                </div>
                <div className="text-sm font-medium">
                  {shippingCost === 0 ? "Free" : `LKR ${shippingCost.toFixed(2)}`}
                </div>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent">
            <RadioGroupItem value="pickup" id="store-pickup" />
            <Label htmlFor="store-pickup" className="flex items-center space-x-3 cursor-pointer flex-1">
              <Store className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">In-Store Pickup</div>
                <div className="text-sm text-muted-foreground">
                  Ready for pickup in 1-2 business days
                </div>
                <div className="text-sm font-medium text-green-600">Free</div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default DeliveryOptions;
