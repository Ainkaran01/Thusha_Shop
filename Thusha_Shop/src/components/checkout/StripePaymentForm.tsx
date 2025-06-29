
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CreditCard } from "lucide-react";

interface StripePaymentFormProps {
  onSuccess: (paymentId: string) => void;
  amount: number;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ onSuccess, amount }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Basic validation and formatting
    if (name === 'cardNumber') {
      // Only allow numbers and format with spaces
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 16) {
        // Format with spaces every 4 digits
        const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
        setPaymentInfo(prev => ({ ...prev, [name]: formatted }));
      }
    } else if (name === 'cvv') {
      // Only allow max 3 digits for CVV
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 3) {
        setPaymentInfo(prev => ({ ...prev, [name]: cleaned }));
      }
    } else if (name === 'expiryDate') {
      // Format as MM/YY
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 4) {
        const formatted = cleaned.length > 2 
          ? cleaned.substring(0, 2) + '/' + cleaned.substring(2)
          : cleaned;
        setPaymentInfo(prev => ({ ...prev, [name]: formatted }));
      }
    } else {
      setPaymentInfo(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const errors = [];
    
    if (!paymentInfo.cardNumber || paymentInfo.cardNumber.replace(/\s/g, '').length < 16) {
      errors.push("Please enter a valid 16-digit card number");
    }
    
    if (!paymentInfo.cardName) {
      errors.push("Please enter the name on card");
    }
    
    if (!paymentInfo.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
      errors.push("Please enter a valid expiry date (MM/YY)");
    }
    
    if (!paymentInfo.cvv || paymentInfo.cvv.length < 3) {
      errors.push("Please enter a valid CVV (3 digits)");
    }
    
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors[0],
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate Stripe payment processing
    setTimeout(() => {
      // Generate a fake payment ID that mimics Stripe's format
      const paymentId = `pi_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      setIsSubmitting(false);
      toast({
        title: "Payment Successful",
        description: `Your payment of LKR ${amount.toFixed(2)} was processed successfully`,
      });
      
      // Clear form data
      setPaymentInfo({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
      });
      
      onSuccess(paymentId);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" /> 
          Secure Payment
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input 
              id="cardNumber" 
              name="cardNumber" 
              value={paymentInfo.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              autoComplete="cc-number"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="cardName">Name on Card</Label>
            <Input 
              id="cardName" 
              name="cardName" 
              value={paymentInfo.cardName}
              onChange={handleChange}
              autoComplete="cc-name"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input 
                id="expiryDate" 
                name="expiryDate" 
                value={paymentInfo.expiryDate}
                onChange={handleChange}
                placeholder="MM/YY"
                autoComplete="cc-exp"
                required
              />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input 
                id="cvv" 
                name="cvv" 
                value={paymentInfo.cvv}
                onChange={handleChange}
                type="password"
                maxLength={3}
                autoComplete="cc-csc"
                required
              />
            </div>
          </div>

          <div className="text-sm text-muted-foreground mt-2">
            <p>Amount to be charged: <span className="font-medium">LKR {amount.toFixed(2)}</span></p>
            <p className="text-xs mt-1">By proceeding, you agree to our terms and conditions</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : `Pay LKR ${amount.toFixed(2)}`}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default StripePaymentForm;
