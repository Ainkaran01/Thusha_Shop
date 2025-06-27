
import React from 'react';
import DeliveryOptions from '../DeliveryOptions';
import PaymentOptions from '../PaymentOptions';

interface DeliveryPaymentStepProps {
  deliveryOption: "home" | "pickup";
  paymentMethod: "card" | "cash";
  shippingCost: number;
  onDeliveryOptionChange: (option: "home" | "pickup") => void;
  onPaymentMethodChange: (method: "card" | "cash") => void;
}

const DeliveryPaymentStep: React.FC<DeliveryPaymentStepProps> = ({
  deliveryOption,
  paymentMethod,
  shippingCost,
  onDeliveryOptionChange,
  onPaymentMethodChange,
}) => {
  return (
    <div className="space-y-6">
      <DeliveryOptions
        selectedOption={deliveryOption}
        onOptionChange={onDeliveryOptionChange}
        shippingCost={shippingCost}
      />
      
      <PaymentOptions
        selectedMethod={paymentMethod}
        onMethodChange={onPaymentMethodChange}
      />
    </div>
  );
};

export default DeliveryPaymentStep;
