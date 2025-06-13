
import React from 'react';

interface CheckoutStepsProps {
  currentStep: number;
  hasEyeglasses: boolean;
  needsPrescriptionVerification: boolean;
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({
  currentStep,
  hasEyeglasses,
  needsPrescriptionVerification,
}) => {
  const totalSteps = needsPrescriptionVerification ? 5 : (hasEyeglasses ? 4 : 3);

  return (
    <div className="flex items-center space-x-2">
      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
        1
      </div>
      <div className={`h-0.5 w-6 ${currentStep >= 2 ? "bg-primary" : "bg-muted"}`}></div>
      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
        2
      </div>
      {hasEyeglasses && (
        <>
          <div className={`h-0.5 w-6 ${currentStep >= 3 ? "bg-primary" : "bg-muted"}`}></div>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            3
          </div>
          {needsPrescriptionVerification && (
            <>
              <div className={`h-0.5 w-6 ${currentStep >= 4 ? "bg-primary" : "bg-muted"}`}></div>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep >= 4 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                4
              </div>
            </>
          )}
        </>
      )}
      <div className={`h-0.5 w-6 ${currentStep >= totalSteps ? "bg-primary" : "bg-muted"}`}></div>
      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep >= totalSteps ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
        {totalSteps}
      </div>
    </div>
  );
};

export default CheckoutSteps;
