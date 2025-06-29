
import { CartItem } from "../types/cart";

/**
 * Calculate the total price of items in the cart (excluding lens costs)
 */
export const calculateCartTotal = (cartItems: CartItem[]): number => {
  return cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
};

/**
 * Calculate the total price of lens options in the cart
 */
export const calculateLensTotal = (cartItems: CartItem[]): number => {
  return cartItems.reduce(
    (total, item) => total + (item.lensOption?.price || 0) * item.quantity,
    0
  );
};

/**
 * Calculate the total number of items in the cart
 */
export const calculateItemCount = (cartItems: CartItem[]): number => {
  return cartItems.reduce((count, item) => count + item.quantity, 0);
};

/**
 * Calculate the total price (product + lens)
 */
export const calculateGrandTotal = (cartItems: CartItem[]): number => {
  return calculateCartTotal(cartItems) + calculateLensTotal(cartItems);
};

/**
 * Calculate tax based on subtotal
 */
export const calculateTax = (cartItems: CartItem[], taxRate: number = 0.07): number => {
  return calculateGrandTotal(cartItems) * taxRate;
};


export const calculateShipping = (cartItems: CartItem[]): number => {
  const subtotal = calculateGrandTotal(cartItems);
  return subtotal >= 1000 ? 0 : 500;
};

/**
 * Format currency values to display properly
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'LKR'
  }).format(amount);
};
