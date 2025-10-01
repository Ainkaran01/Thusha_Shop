import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/types/cart";

interface CheckoutSummaryProps {
  cartItems: CartItem[];
  cartTotal: number;
  lensTotal: number;
  shippingCost: number;
  tax: number;
  orderTotal: number;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  cartItems,
  cartTotal,
  lensTotal,
  shippingCost,
  tax,
  orderTotal,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <div className="max-h-80 overflow-y-auto space-y-4 mb-4">
          {cartItems.map((item) => (
            <div key={item.product.id} className="flex items-start space-x-4">
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium mb-1">{item.product.name}</h4>
                {item.product.category?.name?.toLowerCase() !==
                  "accessories" && (
                  <p className="text-sm text-muted-foreground mb-1">
                    {item.product.frame_type?.name || "Frame type"},{" "}
                    {item.product.frame_material || "Material"}
                  </p>
                )}
                <div className="flex justify-between">
                  <div className="text-sm">Qty: {item.quantity}</div>
                  <div className="font-medium">
                    LKR {(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>

                {/* Show selected lens option */}
                {item.lensOption && (
                  <div className="mt-1">
                    <div className="text-sm text-primary">
                      {item.lensOption.type === "prescription"
                        ? "Prescription"
                        : "Standard"}
                      : {item.lensOption.option}
                    </div>
                    <div className="text-sm font-medium text-right">
                      + LKR {(item.lensOption.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
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
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>LKR {orderTotal.toFixed(2)}</span>
        </div>

        <div className="mt-4 bg-accent p-3 rounded-md text-sm text-muted-foreground">
          <p>
            Your order will be processed and shipped within 1-2 business days.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutSummary;
