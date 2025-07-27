import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, CheckCircle, AlertCircle } from "lucide-react";


const detectCardType = (cardNumber: string): string | null => {
  const number = cardNumber.replace(/\s/g, "");
  if (/^4/.test(number)) return "Visa";
  if (/^5[1-5]/.test(number)) return "MasterCard";
  if (/^3[47]/.test(number)) return "American Express";
  if (/^6(?:011|5)/.test(number)) return "Discover";
  if (/^(9|8)/.test(number)) return "LankaPay";
  return null;
};


const getCardIcon = (type: string) => {
  const size = "h-6 w-auto";
  switch (type) {
    case "Visa":
      return <img src="/logos/Visa.png" alt="Visa" className={size} />;
    case "MasterCard":
      return <img src="/logos/mastercard.png" alt="MasterCard" className={size} />;
    case "American Express":
      return <img src="/logos/AmericanExpress.png" alt="Amex" className={size} />;
    case "Discover":
      return <img src="/logos/discover.png" alt="Discover" className={size} />;
    case "LankaPay":
      return <img src="/logos/lankapay.png" alt="LankaPay" className={size} />;
    default:
      return null;
  }
};

const isBlockedCardNumber = (number: string): boolean => {
  const clean = number.replace(/\s/g, "");
  if (clean.length !== 16) return false;
  if (/^(\d)\1{15}$/.test(clean)) return true;
  if (/^(1234){4}$/.test(clean)) return true;

  const blocked = ["0000000000000000", "1234567812345678", "9999999999999999"];
  if (blocked.includes(clean)) return true;

  const chunks = clean.match(/.{1,4}/g);
  if (chunks && chunks.length === 4) {
    const isAsc = chunks.every((chunk, i) => i === 0 || +chunk === +chunks[i - 1] + 1);
    const isDesc = chunks.every((chunk, i) => i === 0 || +chunk === +chunks[i - 1] - 1);
    return isAsc || isDesc;
  }

  return false;
};

const isValidExpiry = (date: string): boolean => {
  if (!/^\d{2}\/\d{2}$/.test(date)) return false;
  const [month, year] = date.split("/").map(Number);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const expiry = new Date(2000 + year, month - 1);
  return expiry >= new Date(now.getFullYear(), now.getMonth());
};

interface StripePaymentFormProps {
  onSuccess: (paymentId: string) => void;
  amount: number;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ onSuccess, amount }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardType, setCardType] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      const cleaned = value.replace(/\D/g, "").slice(0, 16);
      const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
      setPaymentInfo((prev) => ({ ...prev, cardNumber: formatted }));
      setCardType(detectCardType(cleaned));
    } else if (name === "cvv") {
      const cleaned = value.replace(/\D/g, "").slice(0, 3);
      setPaymentInfo((prev) => ({ ...prev, cvv: cleaned }));
    } else if (name === "expiryDate") {
      const cleaned = value.replace(/\D/g, "").slice(0, 4);
      const formatted = cleaned.length > 2 ? `${cleaned.slice(0, 2)}/${cleaned.slice(2)}` : cleaned;
      setPaymentInfo((prev) => ({ ...prev, expiryDate: formatted }));
    } else if (name === "cardName") {
      const cleaned = value.replace(/[^A-Za-z\s]/g, "");
      setPaymentInfo((prev) => ({ ...prev, cardName: cleaned }));
    }
  };

  const getFieldValidationState = (fieldName: string) => {
    const value = paymentInfo[fieldName as keyof typeof paymentInfo];
    if (!value) return null;

    switch (fieldName) {
      case "cardNumber": {
        const number = value.replace(/\s/g, "");
        const type = detectCardType(number);
        return number.length === 16 && type !== null && !isBlockedCardNumber(number);
      }
      case "cardName":
        return /^[A-Za-z\s]+$/.test(value.trim()) && value.trim().length > 2;
      case "expiryDate":
        return isValidExpiry(value);
      case "cvv":
        return value.length === 3;
      default:
        return null;
    }
  };

  const validateForm = () => {
    const errors: string[] = [];
    const number = paymentInfo.cardNumber.replace(/\s/g, "");

    if (!number || number.length !== 16 || !cardType) {
      errors.push("Enter a valid 16-digit card number with a recognizable card type");
    } else if (isBlockedCardNumber(number)) {
      errors.push("Suspicious card number pattern detected");
    }

    if (!/^[A-Za-z\s]+$/.test(paymentInfo.cardName.trim())) {
      errors.push("Cardholder name must contain only English letters");
    }

    if (!paymentInfo.cardName.trim()) {
      errors.push("Enter the name on the card");
    }

    if (!paymentInfo.expiryDate || !isValidExpiry(paymentInfo.expiryDate)) {
      errors.push("Enter a valid expiry date (MM/YY)");
    }

    if (!paymentInfo.cvv || paymentInfo.cvv.length !== 3) {
      errors.push("Enter a valid 3-digit CVV");
    }

    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

    setTimeout(() => {
      const paymentId = `pi_${Math.random().toString(36).substring(2, 15)}`;
      setIsSubmitting(false);
      toast({
        title: "Payment Successful",
        description: `Your payment of LKR ${amount.toFixed(2)} was successful.`,
      });
      setPaymentInfo({
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: "",
      });
      setCardType(null);
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
          {/* Card Number */}
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <div className="relative">
              <Input
                id="cardNumber"
                name="cardNumber"
                value={paymentInfo.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                autoComplete="cc-number"
                required
                className={`pr-20 ${
                  getFieldValidationState("cardNumber") === true
                    ? "border-green-500 bg-green-50"
                    : getFieldValidationState("cardNumber") === false
                    ? "border-red-500 bg-red-50"
                    : ""
                }`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                {getFieldValidationState("cardNumber") === true && <CheckCircle className="h-4 w-4 text-green-500" />}
                {getFieldValidationState("cardNumber") === false && <AlertCircle className="h-4 w-4 text-red-500" />}
                {cardType && getCardIcon(cardType)}
              </div>
            </div>
          </div>

          {/* Card Name */}
          <div>
            <Label htmlFor="cardName">Name on Card</Label>
            <Input
              id="cardName"
              name="cardName"
              value={paymentInfo.cardName}
              onChange={handleChange}
              autoComplete="cc-name"
              placeholder="John Doe"
              required
              className={`${
                getFieldValidationState("cardName") === true
                  ? "border-green-500 bg-green-50"
                  : getFieldValidationState("cardName") === false
                  ? "border-red-500 bg-red-50"
                  : ""
              }`}
            />
          </div>

          {/* Expiry & CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                name="expiryDate"
                value={paymentInfo.expiryDate}
                onChange={handleChange}
                placeholder="MM/YY"
                required
                className={`${
                  getFieldValidationState("expiryDate") === true
                    ? "border-green-500 bg-green-50"
                    : getFieldValidationState("expiryDate") === false
                    ? "border-red-500 bg-red-50"
                    : ""
                }`}
              />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                name="cvv"
                type="password"
                value={paymentInfo.cvv}
                onChange={handleChange}
                placeholder="123"
                required
                className={`${
                  getFieldValidationState("cvv") === true
                    ? "border-green-500 bg-green-50"
                    : getFieldValidationState("cvv") === false
                    ? "border-red-500 bg-red-50"
                    : ""
                }`}
              />
            </div>
          </div>

          <div className="text-sm text-muted-foreground mt-2">
            <p>Amount to be charged: <span className="font-medium">LKR {amount.toFixed(2)}</span></p>
            <p className="text-xs mt-1">By proceeding, you agree to our terms and conditions</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : `Pay LKR ${amount.toFixed(2)}`}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default StripePaymentForm;
