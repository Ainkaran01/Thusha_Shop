import React from 'react';

interface CheckoutStepsProps {
  currentStep: number;
  hasEyeglasses: boolean;
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({
  currentStep,
  hasEyeglasses,
}) => {
  const steps = [
    { number: 1, label: 'Billing' },
    { number: 2, label: 'Delivery/Payment' },
  ];

  if (hasEyeglasses) {
    steps.push(
      { number: 3, label: 'Lens Selection' },
      // { number: 4, label: 'Prescription' }
    );
  }

  steps.push({ number: hasEyeglasses ? 4 : 3, label: 'Payment' });

  return (
    <div className="flex items-center">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
            currentStep >= step.number ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}>
            {step.number}
          </div>
          {index < steps.length - 1 && (
            <div className={`h-0.5 w-6 ${currentStep > step.number ? "bg-primary" : "bg-muted"}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;