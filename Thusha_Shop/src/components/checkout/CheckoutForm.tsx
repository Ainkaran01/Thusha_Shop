
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CheckoutSteps from './CheckoutSteps';
import BillingStep from './steps/BillingStep';
import DeliveryPaymentStep from './steps/DeliveryPaymentStep';
import LensSelection from './LensSelection';
import PrescriptionStep from './steps/PrescriptionStep';
import PaymentStep from './PaymentStep';
import { CartItem } from "@/types/cart";

interface CheckoutFormProps {
  currentStep: number;
  hasEyeglasses: boolean;
  needsPrescriptionVerification: boolean;
  billingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  sameAsBilling: boolean;
  deliveryOption: "home" | "pickup";
  paymentMethod: "card" | "cash";
  baseShippingCost: number;
  prescriptionVerified: boolean;
  eyeglassesItems: CartItem[];
  lensOptions: {
    standard: Array<{ id: string; name: string; price: number; description: string }>;
    prescription: Array<{ id: string; name: string; price: number; description: string }>;
  };
  orderTotal: number;
  onBillingInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSameAsBillingChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeliveryOptionChange: (option: "home" | "pickup") => void;
  onPaymentMethodChange: (method: "card" | "cash") => void;
  onLensTypeSelect: (productId: number, lensType: "standard" | "prescription") => void;
  onLensOptionSelect: (productId: number, lensType: "standard" | "prescription", optionId: string) => void;
  onPrescriptionVerified: (id: string) => void;
  onSkipPrescription: () => void;
  onPaymentSuccess: (paymentId?: string) => Promise<void>;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  currentStep,
  hasEyeglasses,
  needsPrescriptionVerification,
  billingInfo,
  sameAsBilling,
  deliveryOption,
  paymentMethod,
  baseShippingCost,
  prescriptionVerified,
  eyeglassesItems,
  lensOptions,
  orderTotal,
  onBillingInfoChange,
  onSameAsBillingChange,
  onDeliveryOptionChange,
  onPaymentMethodChange,
  onLensTypeSelect,
  onLensOptionSelect,
  onPrescriptionVerified,
  onSkipPrescription,
  onPaymentSuccess,
}) => {
  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Enter your billing information";
      case 2: return "Choose delivery and payment options";
      case 3: return "Select lens options (Normal or Powered)";
      case 4: return "Verify your prescription";
      case 5: return "Complete your payment";
      default: return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Checkout</CardTitle>
          <CheckoutSteps
            currentStep={currentStep}
            hasEyeglasses={hasEyeglasses}
            needsPrescriptionVerification={needsPrescriptionVerification}
          />
        </div>
        <CardDescription>
          {getStepDescription()}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        {currentStep === 1 && (
          <BillingStep
            billingInfo={billingInfo}
            sameAsBilling={sameAsBilling}
            onBillingInfoChange={onBillingInfoChange}
            onSameAsBillingChange={onSameAsBillingChange}
          />
        )}
        
        {currentStep === 2 && (
          <DeliveryPaymentStep
            deliveryOption={deliveryOption}
            paymentMethod={paymentMethod}
            baseShippingCost={baseShippingCost}
            onDeliveryOptionChange={onDeliveryOptionChange}
            onPaymentMethodChange={onPaymentMethodChange}
          />
        )}
        
        {currentStep === 3 && (
          <LensSelection
            eyeglassesItems={eyeglassesItems}
            lensOptions={lensOptions}
            onLensTypeSelect={onLensTypeSelect}
            onLensOptionSelect={onLensOptionSelect}
          />
        )}

        {currentStep === 4 && (
          <PrescriptionStep
            prescriptionVerified={prescriptionVerified}
            needsPrescriptionVerification={needsPrescriptionVerification}
            onPrescriptionVerified={onPrescriptionVerified}
            onSkipPrescription={onSkipPrescription}
          />
        )}
        
        {currentStep === 5 && (
          <PaymentStep
            paymentMethod={paymentMethod}
            orderTotal={orderTotal}
            deliveryOption={deliveryOption}
            onPaymentSuccess={onPaymentSuccess}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;
