
import { useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { calculateTax, calculateShipping, formatCurrency } from '../utils/cartUtils';

/**
 * A hook that provides additional cart operations beyond the basic ones in useCart
 */
export function useCartOperations() {
  const { 
    cartItems, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    getLensTotal 
  } = useCart();

  /**
   * Check if a product is already in the cart
   */
  const isInCart = useCallback((productId: number): boolean => {
    return cartItems.some(item => item.product.id === productId);
  }, [cartItems]);

  /**
   * Get a specific cart item by product ID
   */
  const getCartItem = useCallback((productId: number) => {
    return cartItems.find(item => item.product.id === productId);
  }, [cartItems]);

  /**
   * Calculate the total price for a specific item (including lens option)
   */
  const getItemTotal = useCallback((productId: number): number => {
    const item = getCartItem(productId);
    if (!item) return 0;
    
    const productTotal = item.product.price * item.quantity;
    const lensTotal = (item.lensOption?.price || 0) * item.quantity;
    
    return productTotal + lensTotal;
  }, [cartItems, getCartItem]);

  /**
   * Calculate the subtotal (product total + lens total)
   */
  const getSubtotal = useCallback((): number => {
    return getCartTotal() + getLensTotal();
  }, [getCartTotal, getLensTotal]);

  /**
   * Calculate the shipping cost based on subtotal
   */
  const getShippingCost = useCallback((): number => {
    return calculateShipping(cartItems);
  }, [cartItems]);

  /**
   * Calculate tax amount
   */
  const getTaxAmount = useCallback((taxRate: number = 0.07): number => {
    return calculateTax(cartItems, taxRate);
  }, [cartItems]);

  /**
   * Calculate the final total (subtotal + shipping + tax)
   */
  const getFinalTotal = useCallback((): number => {
    return getSubtotal() + getShippingCost() + getTaxAmount();
  }, [getSubtotal, getShippingCost, getTaxAmount]);

  /**
   * Check if the cart has any prescription lens items
   */
  const hasPrescriptionLenses = useCallback((): boolean => {
    return cartItems.some(item => item.lensOption?.type === "prescription");
  }, [cartItems]);

  /**
   * Format a price amount as currency
   */
  const formatPrice = useCallback((amount: number): string => {
    return formatCurrency(amount);
  }, []);

  /**
   * Get cart summary data
   */
  const getCartSummary = useCallback(() => {
    return {
      subtotal: getSubtotal(),
      lensTotal: getLensTotal(),
      tax: getTaxAmount(),
      shipping: getShippingCost(),
      total: getFinalTotal(),
      itemCount: cartItems.reduce((count, item) => count + item.quantity, 0)
    };
  }, [getSubtotal, getLensTotal, getTaxAmount, getShippingCost, getFinalTotal, cartItems]);

  return {
    isInCart,
    getCartItem,
    getItemTotal,
    getSubtotal,
    getShippingCost,
    getTaxAmount,
    getFinalTotal,
    hasPrescriptionLenses,
    formatPrice,
    getCartSummary
  };
}
