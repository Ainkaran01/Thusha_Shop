// src/hooks/useCheckoutLogic.ts
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { createOrder } from '@/services/apiService';


export const useCheckoutLogic = () => {
  const { cartItems, getCartTotal, getLensTotal, updateLensOption, clearCart } = useCart();
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
 

  const [currentStep, setCurrentStep] = useState(1);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");
  const [deliveryOption, setDeliveryOption] = useState<"home" | "pickup">("home");

  const [billingInfo, setBillingInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.profile?.phone_number || "",
    address1: user?.profile?.address_line1 || "",
    address2: user?.profile?.address_line2 || "",
    city: user?.profile?.city || "",
    state: user?.profile?.state || "",
    zipCode: user?.profile?.zip_code || "",
    country: user?.profile?.country || "",
  });

  const [sameAsBilling, setSameAsBilling] = useState(true);

  const hasEyeglasses = useMemo(() => 
    cartItems.some(item => item.product.category.name === "Eyeglasses"),
  [cartItems]);

  const cartTotal = useMemo(() => getCartTotal(), [getCartTotal]);
  const lensTotal = useMemo(() => getLensTotal(), [getLensTotal]);
  const subtotal = useMemo(() => cartTotal + lensTotal, [cartTotal, lensTotal]);

  const shippingCost = useMemo(() => {
    const baseCost = subtotal >= 1000 ? 0 : 500;
    return deliveryOption === "pickup" ? 0 : baseCost;
  }, [subtotal, deliveryOption]);

  const tax = useMemo(() => subtotal * 0.05, [subtotal]);
  const orderTotal = useMemo(() => subtotal + shippingCost + tax, [subtotal, shippingCost, tax]);

  const validateBillingInfo = () => {
    const requiredFields = ['name', 'email', 'phone', 'address1', 'city', 'state', 'zipCode'];
    return requiredFields.every(field => Boolean(billingInfo[field as keyof typeof billingInfo]));
  };

  const validateLensSelections = () => {
    if (!hasEyeglasses) return true;
    return cartItems
      .filter(item => item.product.category.name === "Eyeglasses")
      .every(item => item.lensOption);
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateBillingInfo()) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required billing fields",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 3 && hasEyeglasses && !validateLensSelections()) {
      toast({
        title: "Missing Lens Selection",
        description: "Please select lens options for all eyeglasses",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep(prev => {
      if (prev === 1) return 2;
      if (prev === 2) return hasEyeglasses ? 3 : 5;
      if (prev === 3) return hasEyeglasses ? 4 : 5;
      if (prev === 4) return 5;
      return prev;
    });
  };

  const prevStep = () => {
    setCurrentStep(prev => {
      if (prev === 2) return 1;
      if (prev === 3) return 2;
      if (prev === 4) return 3;
      if (prev === 5) return hasEyeglasses ? 4 : 2;
      return prev;
    });
  };
    const generateOrderNumber = () => {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${datePart}-${randomPart}`;
};

const handlePaymentSuccess = async (paymentId?: string) => {
  try {
    const orderNumber = generateOrderNumber();
    
    // Validate cart items
    if (cartItems.length === 0) {
      throw new Error("Your cart is empty");
    }

    const orderData = {
      order_number: orderNumber,
      user: user?.id,
      payment_method: paymentMethod,
      delivery_option: deliveryOption,
      total_price: orderTotal.toFixed(2),
      items: cartItems.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        lens_option: item.lensOption ? {
          option: item.lensOption.option,
          type: item.lensOption.type,
          price: item.lensOption.price,
          ...(item.lensOption.prescriptionId && {
            prescriptionId: item.lensOption.prescriptionId
          })
        } : null,
        prescription: item.lensOption?.prescriptionId || null
      })),
      billing: {
        name: billingInfo.name,
        email: billingInfo.email,
        phone: billingInfo.phone,
        address1: billingInfo.address1,
        address2: billingInfo.address2 || null,
        city: billingInfo.city,
        state: billingInfo.state,
        zip_code: billingInfo.zipCode,
        country: billingInfo.country
      }
    };

    const createdOrder = await createOrder(orderData);
    
    setOrderNumber(createdOrder.order_number);
    setOrderComplete(true);
    clearCart();
    toast({
      title: "Order Placed Successfully",
      description: `Your order #${createdOrder.order_number} has been received. Confirmation sent to ${billingInfo.email}.`,
      duration: 5000,
    });

    return createdOrder;
  } catch (error: any) {
    toast({
      title: "Order Failed",
      description: error.message || "There was an error processing your order. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

  useEffect(() => {
    if (cartItems.length === 0 && !orderComplete) {
      navigate("/cart");
    }
  }, [cartItems, orderComplete, navigate]);

  return {
    currentStep,
    hasEyeglasses,
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
  };
};