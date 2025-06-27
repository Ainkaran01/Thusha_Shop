import React from 'react';
import { CheckCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface OrderCompleteProps {
  orderNumber: string;
  billingEmail: string;
  cartTotal: number;
  lensTotal: number;
  shippingCost: number;
  tax: number;
  orderTotal: number;
  onTrackOrder: () => void;
}

const OrderComplete: React.FC<OrderCompleteProps> = ({
  orderNumber,
  billingEmail,
  cartTotal = 0,
  lensTotal = 0,
  shippingCost = 0,
  tax = 0,
  orderTotal = 0,
  onTrackOrder,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card className="border-green-100">
          <CardContent className="pt-6 text-center">
            <div role="status" aria-label="Order successful">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Order Complete!</h1>
              <p className="text-muted-foreground mb-6">
                Thank you for your purchase. Your order has been received and is being processed.
              </p>
            </div>
            
            <div className="bg-accent p-4 rounded-lg mb-6" aria-live="polite">
              <p className="text-lg font-medium mb-2">Order Number: {orderNumber}</p>
              <p className="text-sm text-muted-foreground">
                A confirmation has been sent to <span className="font-medium">{billingEmail}</span>
              </p>
            </div>
            
            <section aria-labelledby="order-summary-heading">
              <h2 id="order-summary-heading" className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Products Subtotal:</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                {lensTotal > 0 && (
                  <div className="flex justify-between">
                    <span>Lens Options:</span>
                    <span>{formatCurrency(lensTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{shippingCost === 0 ? "Free" : formatCurrency(shippingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{formatCurrency(orderTotal)}</span>
                </div>
              </div>
            </section>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <Button 
                onClick={onTrackOrder} 
                className="flex items-center justify-center"
                aria-label="Track your order"
              >
                <ShoppingBag className="mr-2 h-4 w-4" /> Track Your Order
              </Button>
              <Button variant="outline" asChild>
                <a href="/" className="flex items-center justify-center" aria-label="Continue shopping">
                  Continue Shopping
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderComplete;