import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderComplete from "@/components/checkout/OrderComplete";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import { useCheckoutLogic } from "@/hooks/useCheckoutLogic";
import { useCart } from "@/context/CartContext";

const LENS_OPTIONS = {
  standard: [
    { id: "basic", name: "Basic", price: 50, description: "Standard lenses with no additional features" },
    { id: "antiBlue", name: "Anti-Blue Light", price: 95, description: "Lenses with blue light filtering technology" },
    { id: "premium", name: "Premium", price: 150, description: "High-quality lenses with advanced features" },
  ],
  prescription: [
    { id: "basicRx", name: "Basic Powered", price: 100, description: "Standard prescription lenses" },
    { id: "antiBlueRx", name: "Anti-Blue Light Powered", price: 145, description: "Prescription lenses with blue light filtering" },
    { id: "premiumRx", name: "Premium Powered", price: 200, description: "High-quality prescription lenses with all features" },
  ],
};

const Checkout = () => {
  const { cartItems } = useCart();

  const {
    currentStep,
    orderComplete,
    orderNumber,
    paymentMethod,
    deliveryOption,
    billingInfo,
    sameAsBilling,
    cartTotal,
    lensTotal,
    shippingCost,
    tax,
    orderTotal,
    nextStep,
    prevStep,
    setBillingInfo,
    setSameAsBilling,
    setPaymentMethod,
    setDeliveryOption,
    updateLensOption,
    handlePaymentSuccess,
  } = useCheckoutLogic();

  const goToOrderTracking = () => window.location.href = "/order-tracking";

  const handleBillingInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSameAsBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSameAsBilling(e.target.checked);
  };

  const handleLensTypeSelect = (productId: number, lensType: "standard" | "prescription") => {
    const defaultOption = LENS_OPTIONS[lensType][0];
    updateLensOption(productId, {
      type: lensType,
      option: defaultOption.name,
      price: defaultOption.price
    });
  };

  const handleLensOptionSelect = (productId: number, lensType: "standard" | "prescription", optionId: string) => {
    const option = LENS_OPTIONS[lensType].find(opt => opt.id === optionId);
    if (option) {
      updateLensOption(productId, {
        type: lensType,
        option: option.name,
        price: option.price
      });
    }
  };

  const handlePrescriptionVerified = (id: string) => {
    // Handle prescription verification
    nextStep();
  };

  const handleSkipPrescription = () => {
    // Handle skipping prescription
    nextStep();
  };

  const eyeglassesItems = cartItems.filter(item => item.product.category === "eyeglasses");
  const hasEyeglasses = eyeglassesItems.length > 0;
  const totalSteps = hasEyeglasses ? 5 : 3;

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm
            currentStep={currentStep}
            hasEyeglasses={hasEyeglasses}
            shippingCost={shippingCost}
            billingInfo={billingInfo}
            sameAsBilling={sameAsBilling}
            deliveryOption={deliveryOption}
            paymentMethod={paymentMethod}
            eyeglassesItems={eyeglassesItems}
            lensOptions={LENS_OPTIONS}
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
            {currentStep < totalSteps ? (
              <Button onClick={nextStep} className="flex items-center">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={nextStep} className="flex items-center">
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