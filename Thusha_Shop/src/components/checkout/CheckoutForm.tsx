import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CheckoutSteps from './CheckoutSteps';
import BillingStep from './steps/BillingStep';
import DeliveryPaymentStep from './steps/DeliveryPaymentStep';
import LensSelection from './LensSelection';
import PrescriptionChecker from '../PrescriptionChecker';
import PaymentStep from './PaymentStep';
import { CartItem } from "@/types/cart";

interface BillingInfo {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface LensOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface CheckoutFormProps {
  currentStep: number;
  hasEyeglasses: boolean;
  billingInfo: BillingInfo;
  sameAsBilling: boolean;
  deliveryOption: "home" | "pickup";
  paymentMethod: "card" | "cash";
  shippingCost: number;
  eyeglassesItems: CartItem[];
  lensOptions: {
    standard: LensOption[];
    prescription: LensOption[];
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
  billingInfo,
  sameAsBilling,
  deliveryOption,
  paymentMethod,
  shippingCost,
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
      case 3: return hasEyeglasses ? "Select lens options" : "Complete your payment";
      // case 4: return "Verify your prescription";
      case 4: return "Complete your payment";
      default: return "";
    }
  };

   const renderCurrentStep = () => {
    if (currentStep === 1) {
      return (
        <BillingStep
          billingInfo={billingInfo}
          sameAsBilling={sameAsBilling}
          onBillingInfoChange={onBillingInfoChange}
          onSameAsBillingChange={onSameAsBillingChange}
        />
      );
    }

   if (currentStep === 2) {
      return (
        <DeliveryPaymentStep
          deliveryOption={deliveryOption}
          paymentMethod={paymentMethod}
          shippingCost={shippingCost}
          onDeliveryOptionChange={onDeliveryOptionChange}
          onPaymentMethodChange={onPaymentMethodChange}
        />
      );
    }

    if (hasEyeglasses) {
      if (currentStep === 3) {
        return (
          <LensSelection
            eyeglassesItems={eyeglassesItems}
            lensOptions={lensOptions}
            onLensTypeSelect={onLensTypeSelect}
            onLensOptionSelect={onLensOptionSelect}
          />
        );
      }

      // if (currentStep === 4) {
      //   return (
      //     <PrescriptionChecker
      //        onPrescriptionVerified={(prescription) => onPrescriptionVerified(prescription.id.toString())}
      //       onCancel={onSkipPrescription}
      //     />
      //   );
      // }
    }

    // Final payment step (either step 3 for non-eyeglasses or step 5 for eyeglasses)
    return (
      <PaymentStep
        paymentMethod={paymentMethod}
        orderTotal={orderTotal}
        deliveryOption={deliveryOption}
        onPaymentSuccess={onPaymentSuccess}
      />
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Checkout</CardTitle>
          <CheckoutSteps
            currentStep={currentStep}
            hasEyeglasses={hasEyeglasses}
          />
        </div>
        <CardDescription>
          {getStepDescription()}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        {renderCurrentStep()}
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;