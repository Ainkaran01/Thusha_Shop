
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { sendOrderConfirmationEmail } from '@/services/emailService';

export const useCheckoutLogic = () => {
  const { cartItems, getCartTotal, getLensTotal, updateLensOption, clearCart } = useCart();
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [prescriptionVerified, setPrescriptionVerified] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");
  const [deliveryOption, setDeliveryOption] = useState<"home" | "pickup">("home");
  
  const [billingInfo, setBillingInfo] = useState({
    firstName: user?.name.split(" ")[0] || "",
    lastName: user?.name.split(" ")[1] || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });
  
  const [sameAsBilling, setSameAsBilling] = useState(true);

  // Calculate totals
  const cartTotal = getCartTotal();
  const lensTotal = getLensTotal();
  const subtotal = cartTotal + lensTotal;
  const baseShippingCost = subtotal >= 100 ? 0 : 10;
  const shippingCost = deliveryOption === "pickup" ? 0 : baseShippingCost;
  const tax = subtotal * 0.05;
  const orderTotal = subtotal + shippingCost + tax;

  const validateLensSelections = () => {
    const frameItems = cartItems.filter(item => item.product.category === "eyeglasses");
    
    for (const item of frameItems) {
      if (!item.lensOption) {
        toast({
          title: "Missing Lens Selection",
          description: `Please select lens type for ${item.product.name}`,
          variant: "destructive",
        });
        return false;
      }
      
      if (item.lensOption.type === "prescription") {
        const activePrescription = user?.prescriptions?.find(p => p.isActive === true) || user?.prescriptions?.[0];
        if (!activePrescription) {
          toast({
            title: "Prescription Required",
            description: "Please add a prescription to your account for powered lenses before proceeding",
            variant: "destructive",
          });
          return false;
        }
      }
    }
    
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!billingInfo.firstName || !billingInfo.lastName || !billingInfo.email || !billingInfo.phone || !billingInfo.address || !billingInfo.city || !billingInfo.state || !billingInfo.zipCode) {
        toast({
          title: "Missing Information",
          description: "Please fill out all required billing fields",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const hasEyeglasses = cartItems.some(item => item.product.category === "eyeglasses");
      
      if (hasEyeglasses) {
        setCurrentStep(3);
      } else {
        setCurrentStep(5);
      }
    } else if (currentStep === 3) {
      if (!validateLensSelections()) {
        return;
      }

      const needsPrescriptionVerification = cartItems.some(
        item => item.lensOption?.type === "prescription"
      );
      
      if (needsPrescriptionVerification && !prescriptionVerified) {
        setCurrentStep(4);
      } else {
        setCurrentStep(5);
      }
    } else if (currentStep === 4) {
      if (!prescriptionVerified) {
        toast({
          title: "Prescription Required",
          description: "Please verify your prescription before continuing",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep(5);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handlePaymentSuccess = async (paymentId?: string) => {
    const randomOrderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(randomOrderNumber);
    
    setOrderComplete(true);
    
    try {
      await sendOrderConfirmationEmail({
        to: billingInfo.email,
        subject: "Order Confirmation",
        orderNumber: randomOrderNumber,
        customerName: `${billingInfo.firstName} ${billingInfo.lastName}`,
        orderTotal: orderTotal,
        deliveryDate: deliveryOption === "pickup" ? "Ready for pickup in 1-2 business days" : "Delivered in 3-5 business days"
      });
      
      console.log("Order confirmation email sent successfully");
    } catch (error) {
      console.error("Failed to send order confirmation email:", error);
    }
    
    clearCart();
    
    toast({
      title: "Order Placed Successfully",
      description: `Your order #${randomOrderNumber} has been received and is being processed. A confirmation email has been sent to ${billingInfo.email}.`,
      duration: 5000,
    });
  };

  useEffect(() => {
    if (cartItems.length === 0 && !orderComplete) {
      navigate("/cart");
    }
  }, [cartItems, orderComplete, navigate]);

  return {
    // State
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
    // Actions
    nextStep,
    prevStep,
    setBillingInfo,
    setSameAsBilling,
    setPaymentMethod,
    setDeliveryOption,
    setPrescriptionVerified,
    updateLensOption,
    handlePaymentSuccess,
  };
};
