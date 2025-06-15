
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderComplete from "@/components/checkout/OrderComplete";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import { useCheckoutLogic } from "@/hooks/useCheckoutLogic";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";

const Checkout = () => {
  const { cartItems } = useCart();
  const { user } = useUser();
  
  const {
    currentStep,
    orderComplete,
    orderNumber,
    prescriptionVerified,
    paymentMethod,
    deliveryOption,
    billingInfo,
    sameAsBilling,
    cartTotal,
    lensTotal,
    baseShippingCost,
    shippingCost,
    tax,
    orderTotal,
    nextStep,
    prevStep,
    setBillingInfo,
    setSameAsBilling,
    setPaymentMethod,
    setDeliveryOption,
    setPrescriptionVerified,
    updateLensOption,
    handlePaymentSuccess,
  } = useCheckoutLogic();

  // Define lens options with updated terminology
  const lensOptions = {
    standard: [
      { id: "basic", name: "Basic", price: 50, description: "Standard lenses with no additional features" },
      { id: "antiBlue", name: "Anti-Blue Light", price: 95, description: "Lenses with blue light filtering technology" },
      { id: "premium", name: "Premium", price: 150, description: "High-quality lenses with advanced features" }
    ],
    prescription: [
      { id: "basicRx", name: "Basic Powered", price: 100, description: "Standard prescription lenses" },
      { id: "antiBlueRx", name: "Anti-Blue Light Powered", price: 145, description: "Prescription lenses with blue light filtering" },
      { id: "premiumRx", name: "Premium Powered", price: 200, description: "High-quality prescription lenses with all features" }
    ]
  };

  const goToOrderTracking = () => {
    window.location.href = "/order-tracking";
  };

  const handleBillingInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSameAsBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSameAsBilling(e.target.checked);
  };

  const handleLensTypeSelect = (productId: number, lensType: "standard" | "prescription") => {
    const defaultOption = lensType === "standard" ? lensOptions.standard[0] : lensOptions.prescription[0];
    
    updateLensOption(productId, {
      type: lensType,
      option: defaultOption.name,
      price: defaultOption.price
    });

    if (lensType === "prescription") {
      const activePrescription = user?.prescriptions?.find(p => p.isActive === true) || user?.prescriptions?.[0];
      if (activePrescription) {
        setPrescriptionVerified(true);
      } else {
        setPrescriptionVerified(false);
      }
    }
  };

  const handleLensOptionSelect = (productId: number, lensType: "standard" | "prescription", optionId: string) => {
    const option = lensType === "standard" 
      ? lensOptions.standard.find(opt => opt.id === optionId)
      : lensOptions.prescription.find(opt => opt.id === optionId);
      
    if (option) {
      updateLensOption(productId, {
        type: lensType,
        option: option.name,
        price: option.price
      });
    }
  };

  const handlePrescriptionVerified = (id: string) => {
    setPrescriptionVerified(true);
  };

  const handleSkipPrescription = () => {
    setPrescriptionVerified(true);
  };

  if (orderComplete) {
    return (
      <OrderComplete
        orderNumber={orderNumber}
        billingEmail={billingInfo.email}
        cartTotal={cartTotal}
        lensTotal={lensTotal}
        shippingCost={shippingCost}
        tax={tax}
        orderTotal={orderTotal}
        onTrackOrder={goToOrderTracking}
      />
    );
  }

  const eyeglassesItems = cartItems.filter(item => item.product.category === "eyeglasses");
  const hasEyeglasses = eyeglassesItems.length > 0;
  const needsPrescriptionVerification = cartItems.some(
    item => item.lensOption?.type === "prescription"
  );

  const getTotalSteps = () => {
    return needsPrescriptionVerification ? 5 : (hasEyeglasses ? 4 : 3);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm
            currentStep={currentStep}
            hasEyeglasses={hasEyeglasses}
            needsPrescriptionVerification={needsPrescriptionVerification}
            billingInfo={billingInfo}
            sameAsBilling={sameAsBilling}
            deliveryOption={deliveryOption}
            paymentMethod={paymentMethod}
            baseShippingCost={baseShippingCost}
            prescriptionVerified={prescriptionVerified}
            eyeglassesItems={eyeglassesItems}
            lensOptions={lensOptions}
            orderTotal={orderTotal}
            onBillingInfoChange={handleBillingInfoChange}
            onSameAsBillingChange={handleSameAsBillingChange}
            onDeliveryOptionChange={setDeliveryOption}
            onPaymentMethodChange={setPaymentMethod}
            onLensTypeSelect={handleLensTypeSelect}
            onLensOptionSelect={handleLensOptionSelect}
            onPrescriptionVerified={handlePrescriptionVerified}
            onSkipPrescription={handleSkipPrescription}
            onPaymentSuccess={handlePaymentSuccess}
          />

          <CardFooter className="flex justify-between mt-4">
            {currentStep > 1 && (
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
            )}
            {currentStep < getTotalSteps() ? (
              <Button onClick={nextStep} className="flex items-center">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : currentStep !== 5 && (
              <Button 
                onClick={nextStep} 
                className="flex items-center"
              >
                Proceed to Payment <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </div>
        
        <div>
          <CheckoutSummary
            cartItems={cartItems}
            cartTotal={cartTotal}
            lensTotal={lensTotal}
            shippingCost={shippingCost}
            tax={tax}
            orderTotal={orderTotal}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
