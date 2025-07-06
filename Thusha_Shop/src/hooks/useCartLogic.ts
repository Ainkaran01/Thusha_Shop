import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/use-toast";


export const useCartLogic = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getLensTotal,
  } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState<"home" | "pickup">(
    "home"
  );

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before checking out",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      navigate("/checkout");
    }, 1000);
  };

  const cartTotal = getCartTotal();
  const lensTotal = getLensTotal();
  const subtotal = cartTotal + lensTotal;
  const baseShippingCost = subtotal >= 1000 ? 0 : 500;
  const shippingCost = deliveryOption === "pickup" ? 0 : baseShippingCost;
  const tax = subtotal * 0.05;
  const orderTotal = subtotal + shippingCost + tax;

  const hasPrescriptionLenses = cartItems.some(
    (item) => item.lensOption?.type === "prescription"
  );

  return {
    // State
    cartItems,
    isProcessing,
    deliveryOption,
    cartTotal,
    lensTotal,
    shippingCost,
    tax,
    orderTotal,
    hasPrescriptionLenses,
    // Actions
    handleQuantityChange,
    handleRemoveItem,
    handleClearCart,
    handleCheckout,
    setDeliveryOption,
  };
};
