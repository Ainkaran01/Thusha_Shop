
import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PrescriptionChecker from "@/components/PrescriptionChecker";
import PrescriptionVerifier from "@/components/checkout/PrescriptionVerifier";
import DeliveryOptions from "@/components/checkout/DeliveryOptions";
import CartItemList from "@/components/cart/CartItemList";
import OrderSummary from "@/components/cart/OrderSummary";
import EmptyCart from "@/components/cart/EmptyCart";
import { useCartLogic } from "@/hooks/useCartLogic";

const Cart = () => {
  const {
    cartItems,
    isProcessing,
    showPrescriptionChecker,
    verifiedPrescription,
    prescriptionDialogOpen,
    deliveryOption,
    cartTotal,
    lensTotal,
    shippingCost,
    tax,
    orderTotal,
    hasPrescriptionLenses,
    handleQuantityChange,
    handleRemoveItem,
    handleClearCart,
    handleCheckout,
    handleVerifyPrescription,
    handlePrescriptionVerified,
    handlePrescriptionConfirmed,
    setDeliveryOption,
    setShowPrescriptionChecker,
    setPrescriptionDialogOpen,
  } = useCartLogic();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <span className="mr-2 h-8 w-8">🛒</span> Your Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <CartItemList 
              cartItems={cartItems}
              onQuantityChange={handleQuantityChange}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
            />

            <DeliveryOptions
              selectedOption={deliveryOption}
              onOptionChange={setDeliveryOption}
              shippingCost={shippingCost}
            />

            <div className="mt-6">
              <Button asChild variant="outline" className="flex items-center">
                <Link to="/catalog">
                  <ChevronLeft className="h-4 w-4 mr-2" /> Continue Shopping
                </Link>
              </Button>
            </div>
          </div>

          <div>
            <OrderSummary
              cartTotal={cartTotal}
              lensTotal={lensTotal}
              shippingCost={shippingCost}
              tax={tax}
              orderTotal={orderTotal}
              isProcessing={isProcessing}
              hasPrescriptionLenses={hasPrescriptionLenses}
              verifiedPrescription={verifiedPrescription}
              onCheckout={handleCheckout}
              onVerifyPrescription={handleVerifyPrescription}
              onOpenPrescriptionDialog={() => setPrescriptionDialogOpen(true)}
            />
          </div>
        </div>
      )}

      <Dialog open={showPrescriptionChecker} onOpenChange={setShowPrescriptionChecker}>
        <DialogContent className="sm:max-w-md">
          <PrescriptionChecker 
            onPrescriptionVerified={handlePrescriptionVerified}
            onCancel={() => setShowPrescriptionChecker(false)}
          />
        </DialogContent>
      </Dialog>

      {verifiedPrescription && (
        <PrescriptionVerifier
          prescription={verifiedPrescription}
          open={prescriptionDialogOpen}
          onConfirm={handlePrescriptionConfirmed}
          onCancel={() => setPrescriptionDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default Cart;
