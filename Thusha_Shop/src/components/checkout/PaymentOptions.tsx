
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Banknote } from "lucide-react";

interface PaymentOptionsProps {
  selectedMethod: "card" | "cash";
  onMethodChange: (method: "card" | "cash") => void;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  selectedMethod,
  onMethodChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedMethod} onValueChange={onMethodChange}>
          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent">
            <RadioGroupItem value="card" id="card-payment" />
            <Label htmlFor="card-payment" className="flex items-center space-x-3 cursor-pointer flex-1">
              <CreditCard className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Credit/Debit Card</div>
                <div className="text-sm text-muted-foreground">
                  Pay securely with your card
                </div>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent">
            <RadioGroupItem value="cash" id="cash-payment" />
            <Label htmlFor="cash-payment" className="flex items-center space-x-3 cursor-pointer flex-1">
              <Banknote className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Cash on Delivery</div>
                <div className="text-sm text-muted-foreground">
                  Pay with cash when your order is delivered
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default PaymentOptions;
