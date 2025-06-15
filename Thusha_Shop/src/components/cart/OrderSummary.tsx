
import React from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Prescription } from "@/types/user";

interface OrderSummaryProps {
  cartTotal: number;
  lensTotal: number;
  shippingCost: number;
  tax: number;
  orderTotal: number;
  isProcessing: boolean;
  hasPrescriptionLenses: boolean;
  verifiedPrescription: Prescription | null;
  onCheckout: () => void;
  onVerifyPrescription: () => void;
  onOpenPrescriptionDialog: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartTotal,
  lensTotal,
  shippingCost,
  tax,
  orderTotal,
  isProcessing,
  hasPrescriptionLenses,
  verifiedPrescription,
  onCheckout,
  onVerifyPrescription,
  onOpenPrescriptionDialog,
}) => {
  return (
    <div className="bg-background rounded-lg shadow-md overflow-hidden sticky top-4">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Products Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          {lensTotal > 0 && (
            <div className="flex justify-between">
              <span>Lens Options</span>
              <span>${lensTotal.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Tax (5%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <Separator className="my-3" />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${orderTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Prescription Section */}
        {hasPrescriptionLenses && !verifiedPrescription && (
          <div className="mt-6 bg-accent/50 p-4 rounded-md">
            <h3 className="font-medium mb-2">Prescription Required</h3>
            <p className="text-sm text-muted-foreground mb-2">
              You have prescription lenses in your cart. Please verify your prescription.
            </p>
            <Button 
              onClick={onVerifyPrescription}
              className="w-full"
              variant="outline"
            >
              Enter Prescription ID
            </Button>
          </div>
        )}

        {/* Verified Prescription Section */}
        {verifiedPrescription && (
          <div className="mt-6 bg-green-50 p-4 rounded-md border border-green-200">
            <div className="flex items-start">
              <Check className="h-4 w-4 text-green-500 mt-1 mr-2" />
              <div>
                <h3 className="font-medium text-green-700">Prescription Verified</h3>
                <p className="text-xs text-green-600 mb-2">
                  ID: {verifiedPrescription.id}
                </p>
                <Button
                  variant="link"
                  className="p-0 h-auto text-xs text-primary"
                  onClick={onOpenPrescriptionDialog}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Promo Code Section */}
        <div className="mt-6">
          <h3 className="font-medium mb-2">Promo Code</h3>
          <div className="flex gap-2">
            <Input placeholder="Enter promo code" className="flex-1" />
            <Button variant="outline">Apply</Button>
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
              over $100
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
