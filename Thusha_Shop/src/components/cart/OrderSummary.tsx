import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
  cartTotal: number;
  lensTotal: number;
  shippingCost: number;
  tax: number;
  orderTotal: number;
  isProcessing: boolean;
  onCheckout: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartTotal,
  lensTotal,
  shippingCost,
  tax,
  orderTotal,
  isProcessing,
  onCheckout,
}) => {
  return (
    <div className="bg-background rounded-lg shadow-md overflow-hidden sticky top-4">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Products Subtotal</span>
            <span>LKR {cartTotal.toFixed(2)}</span>
          </div>
          {lensTotal > 0 && (
            <div className="flex justify-between">
              <span>Lens Options</span>
              <span>LKR {lensTotal.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {shippingCost === 0 ? "Free" : `LKR ${shippingCost.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Tax (5%)</span>
            <span>LKR {tax.toFixed(2)}</span>
          </div>
          <Separator className="my-3" />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>LKR {orderTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6">
          <Button
            className="w-full flex items-center justify-center"
            size="lg"
            onClick={onCheckout}
            disabled={orderTotal === 0 || isProcessing}
          >
            {isProcessing ? "Processing..." : "Proceed to Checkout"}
            {!isProcessing && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>

        <div className="mt-4 bg-accent rounded-md p-4">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              <span className="font-medium">Free shipping</span> on orders
              over LKR 1000
            </p>
            <p>
              <span className="font-medium">30-day returns</span> on all
              frames
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
