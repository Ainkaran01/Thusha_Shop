
import React, { createContext, useContext, useState, useReducer, useEffect } from "react";
import { useToast } from "../hooks/use-toast";
import { Product } from "../types";
import { CartItem } from "../types/cart";
import { calculateCartTotal, calculateLensTotal, calculateItemCount } from "../utils/cartUtils";
import { cartReducer, CartState } from "./cartReducer";
import { useUser } from "./UserContext";
type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updateLensOption: (productId: number, lensOption: { type: "standard" | "prescription"; option: string; price: number; }) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getLensTotal: () => number;
  getItemCount: () => number;
  setPrescriptionVerified?: (verified: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const initialState: CartState = {
    cartItems: [],
    prescriptionVerified: false
  };
  
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { toast } = useToast();
  const { isAuthenticated } = useUser(); 
  // Load cart from sessionStorage on initial load
  useEffect(() => {
    const savedCart = sessionStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // We need to set each item individually through the reducer
        parsedCart.forEach((item: CartItem) => {
          dispatch({ type: 'ADD_ITEM', product: item.product, quantity: item.quantity });
          
          // If there's a lens option, update it
          if (item.lensOption) {
            dispatch({ 
              type: 'UPDATE_LENS_OPTION', 
              productId: item.product.id, 
              lensOption: item.lensOption 
            });
          }
        });
      } catch (error) {
        console.error("Failed to parse cart data:", error);
      }
    }
  }, []);

  // Save cart to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(state.cartItems));
  }, [state.cartItems]);

 const addToCart = (product: Product, quantity = 1) => {
  if (!isAuthenticated) {
    toast({
      title: "Login Required",
      description: "Please login to add items to your cart",
      variant: "destructive",
    });
    return;
  }
  
  dispatch({ type: 'ADD_ITEM', product, quantity });
  
  const existingItem = state.cartItems.find(
    (item) => item.product.id === product.id
  );
  
  if (existingItem) {
    toast({
      title: "Product updated in cart",
      description: `${product.name} quantity updated to ${existingItem.quantity + quantity}`,
    });
  } else {
    toast({
      title: "Product added to cart",
      description: `${product.name} added to your cart`,
    });
  }
};

  const removeFromCart = (productId: number) => {
    const itemToRemove = state.cartItems.find(
      (item) => item.product.id === productId
    );
    
    if (itemToRemove) {
      toast({
        title: "Product removed from cart",
        description: `${itemToRemove.product.name} removed from your cart`,
      });
    }
    
    dispatch({ type: 'REMOVE_ITEM', productId });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  };

  const updateLensOption = (productId: number, lensOption: { type: "standard" | "prescription"; option: string; price: number }) => {
    dispatch({ type: 'UPDATE_LENS_OPTION', productId, lensOption });

    toast({
      title: "Lens option updated",
      description: `Lens option updated for your frame`,
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  const getCartTotal = () => calculateCartTotal(state.cartItems);
  const getLensTotal = () => calculateLensTotal(state.cartItems);
  const getItemCount = () => calculateItemCount(state.cartItems);

  const setPrescriptionVerified = (verified: boolean) => {
    dispatch({ type: 'SET_PRESCRIPTION_VERIFIED', verified });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateLensOption,
        clearCart,
        getCartTotal,
        getLensTotal,
        getItemCount,
        setPrescriptionVerified,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
