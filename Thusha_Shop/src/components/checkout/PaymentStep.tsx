
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import StripePaymentForm from "./StripePaymentForm";

interface PaymentStepProps {
  paymentMethod: "card" | "cash";
  orderTotal: number;
  deliveryOption: "home" | "pickup";
  onPaymentSuccess: (paymentId?: string) => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  paymentMethod,
  orderTotal,
  deliveryOption,
  onPaymentSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCashPayment = async () => {
    setIsSubmitting(true);
    
    // Simulate processing time
    setTimeout(async () => {
      await onPaymentSuccess();
      setIsSubmitting(false);
    }, 2000);
  };

  if (paymentMethod === "card") {
    return (
      <StripePaymentForm 
        onSuccess={onPaymentSuccess}
        amount={orderTotal}
      />
    );
  }

  return (
    <div className="text-center space-y-4">
      <div className="bg-accent p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Cash on Delivery</h3>
        <p className="text-muted-foreground mb-4">
          You will pay LKR {orderTotal.toFixed(2)} in cash when your order is {deliveryOption === "pickup" ? "picked up" : "delivered"}.
        </p>
        <Button 
          onClick={handleCashPayment}
          disabled={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? "Processing Order..." : "Place Order"}
        </Button>
      </div>
    </div>
  );
};

export default PaymentStep;
