"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, CheckCircle, AlertCircle } from "lucide-react"

// Card type detection
const detectCardType = (cardNumber: string): string => {
  const number = cardNumber.replace(/\s/g, "")
  if (/^4/.test(number)) return "Visa"
  if (/^5[1-5]/.test(number)) return "MasterCard"
  if (/^3[47]/.test(number)) return "American Express"
  if (/^6(?:011|5)/.test(number)) return "Discover"
  if (/^(9|8)/.test(number)) return "LankaPay"
  return "Unknown"
}

// Card logo display function — images must be in public/logos folder
const getCardIcon = (type: string) => {
  const size = "h-6 w-auto"
  switch (type) {
    case "Visa":
      return <img src="/logos/Visa.png" alt="Visa" className={size} />
    case "MasterCard":
      return <img src="/logos/mastercard.png" alt="MasterCard" className={size} />
    case "American Express":
      return <img src="/logos/AmericanExpress.png" alt="Amex" className={size} />
    case "Discover":
      return <img src="/logos/discover.png" alt="Discover" className={size} />
    case "LankaPay":
      return <img src="/logos/lankapay.png" alt="LankaPay" className={size} />
    default:
      return null
  }
}

// Block common suspicious card numbers & patterns
const isBlockedCardNumber = (number: string): boolean => {
  const clean = number.replace(/\s/g, "")
  if (clean.length !== 16) return false

  // Repeating single digit (1111..., 2222..., etc)
  if (/^(\d)\1{15}$/.test(clean)) return true

  // Repeating 1234 pattern
  if (/^(1234){4}$/.test(clean)) return true

  // Hardcoded blocked cards
  const hardcodedBlocked = ["0000000000000000", "1234567812345678", "9999999999999999"]
  if (hardcodedBlocked.includes(clean)) return true

  // Ascending 4-digit sequences repeated 4 times e.g., 1234 5678 9012 3456
  const chunks = clean.match(/.{1,4}/g)
  if (chunks && chunks.length === 4) {
    const isAscending = chunks.every((chunk, i) => {
      if (i === 0) return true
      return Number.parseInt(chunk) === Number.parseInt(chunks[i - 1]) + 1
    })
    if (isAscending) return true

    const isDescending = chunks.every((chunk, i) => {
      if (i === 0) return true
      return Number.parseInt(chunk) === Number.parseInt(chunks[i - 1]) - 1
    })
    if (isDescending) return true
  }

  return false
}

interface StripePaymentFormProps {
  onSuccess: (paymentId: string) => void
  amount: number
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ onSuccess, amount }) => {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cardType, setCardType] = useState<string | null>(null)
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "cardNumber") {
      const cleaned = value.replace(/\D/g, "").slice(0, 16)
      const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ").trim()
      setPaymentInfo((prev) => ({ ...prev, cardNumber: formatted }))
      setCardType(detectCardType(cleaned))
    } else if (name === "cvv") {
      const cleaned = value.replace(/\D/g, "").slice(0, 3) // 3 digits CVV (Sri Lanka)
      setPaymentInfo((prev) => ({ ...prev, cvv: cleaned }))
    } else if (name === "expiryDate") {
      const cleaned = value.replace(/\D/g, "").slice(0, 4)
      const formatted = cleaned.length > 2 ? cleaned.slice(0, 2) + "/" + cleaned.slice(2) : cleaned
      setPaymentInfo((prev) => ({ ...prev, expiryDate: formatted }))
    } else {
      setPaymentInfo((prev) => ({ ...prev, [name]: value }))
    }
  }

  const isValidExpiry = (date: string) => {
    if (!/^\d{2}\/\d{2}$/.test(date)) return false
    const [month, year] = date.split("/").map(Number)
    if (month < 1 || month > 12) return false
    const now = new Date()
    const expiry = new Date(2000 + year, month - 1)
    return expiry >= new Date(now.getFullYear(), now.getMonth())
  }

  const validateForm = () => {
    const errors: string[] = []
    const number = paymentInfo.cardNumber.replace(/\s/g, "")

    if (!number || number.length !== 16) {
      errors.push("Enter a valid 16-digit card number")
    } else if (isBlockedCardNumber(number)) {
      errors.push("Invalid or suspicious card number detected")
    }

    if (!paymentInfo.cardName.trim()) {
      errors.push("Enter the name on the card")
    }

    if (!paymentInfo.expiryDate || !isValidExpiry(paymentInfo.expiryDate)) {
      errors.push("Enter a valid expiry date (MM/YY) in the future")
    }

    if (!paymentInfo.cvv || paymentInfo.cvv.length !== 3) {
      errors.push("Enter a valid 3-digit CVV")
    }

    return errors
  }

  // Validation state helper
  const getFieldValidationState = (fieldName: string) => {
    if (!paymentInfo[fieldName as keyof typeof paymentInfo]) return null

    switch (fieldName) {
      case "cardNumber":
        const number = paymentInfo.cardNumber.replace(/\s/g, "")
        return number.length === 16 && !isBlockedCardNumber(number)
      case "cardName":
        return paymentInfo.cardName.trim().length > 0
      case "expiryDate":
        return isValidExpiry(paymentInfo.expiryDate)
      case "cvv":
        return paymentInfo.cvv.length === 3
      default:
        return null
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validateForm()

    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors[0],
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      const paymentId = `pi_${Math.random().toString(36).substring(2, 15)}`
      setIsSubmitting(false)
      toast({
        title: "Payment Successful",
        description: `Your payment of LKR ${amount.toFixed(2)} was successful.`,
      })
      setPaymentInfo({ cardNumber: "", cardName: "", expiryDate: "", cvv: "" })
      setCardType(null)
      onSuccess(paymentId)
    }, 2000)
  }

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
          {/* Card Number with icon inside input */}
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
                    ? "border-green-500 bg-green-50 focus:ring-green-500"
                    : getFieldValidationState("cardNumber") === false
                      ? "border-red-500 bg-red-50 focus:ring-red-500"
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

          {/* Cardholder Name */}
          <div>
            <Label htmlFor="cardName">Name on Card</Label>
            <div className="relative">
              <Input
                id="cardName"
                name="cardName"
                value={paymentInfo.cardName}
                onChange={handleChange}
                placeholder="John M. Doe"
                autoComplete="cc-name"
                required
                className={`${
                  getFieldValidationState("cardName") === true
                    ? "border-green-500 bg-green-50 focus:ring-green-500 pr-10"
                    : getFieldValidationState("cardName") === false
                      ? "border-red-500 bg-red-50 focus:ring-red-500 pr-10"
                      : ""
                }`}
              />
              {getFieldValidationState("cardName") === true && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
              )}
              {getFieldValidationState("cardName") === false && (
                <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
              )}
            </div>
          </div>

          {/* Expiry Date & CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <div className="relative">
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  value={paymentInfo.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  autoComplete="cc-exp"
                  required
                  className={`${
                    getFieldValidationState("expiryDate") === true
                      ? "border-green-500 bg-green-50 focus:ring-green-500 pr-10"
                      : getFieldValidationState("expiryDate") === false
                        ? "border-red-500 bg-red-50 focus:ring-red-500 pr-10"
                        : ""
                  }`}
                />
                {getFieldValidationState("expiryDate") === true && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
                {getFieldValidationState("expiryDate") === false && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <div className="relative">
                <Input
                  id="cvv"
                  name="cvv"
                  value={paymentInfo.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  type="password"
                  autoComplete="cc-csc"
                  required
                  className={`${
                    getFieldValidationState("cvv") === true
                      ? "border-green-500 bg-green-50 focus:ring-green-500 pr-10"
                      : getFieldValidationState("cvv") === false
                        ? "border-red-500 bg-red-50 focus:ring-red-500 pr-10"
                        : ""
                  }`}
                />
                {getFieldValidationState("cvv") === true && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
                {getFieldValidationState("cvv") === false && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground mt-2">
            <p>
              Amount to be charged: <span className="font-medium">LKR {amount.toFixed(2)}</span>
            </p>
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
  )
}

// Demo wrapper component
export default function PaymentPage() {
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentId, setPaymentId] = useState("")

  const handlePaymentSuccess = (id: string) => {
    setPaymentId(id)
    setPaymentSuccess(true)
  }

  const resetDemo = () => {
    setPaymentSuccess(false)
    setPaymentId("")
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
          <p className="text-gray-600">Payment ID: {paymentId}</p>
          <button
            onClick={resetDemo}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Make Another Payment
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <StripePaymentForm amount={2500.0} onSuccess={handlePaymentSuccess} />
      </div>
    </div>
  )
}
