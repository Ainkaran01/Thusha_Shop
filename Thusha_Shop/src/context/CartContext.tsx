import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import { toast } from "../components/ui/use-toast";
import { Product, ApiProduct, normalizeProduct } from "@/types/product";
import { CartItem } from "@/types/cart";
import { cartReducer, CartState } from "./cartReducer";
import {
  calculateCartTotal,
  calculateLensTotal,
  calculateItemCount,
} from "../utils/cartUtils";

type LensOption = {
  type: "standard" | "prescription";
  option: string;
  price: number;
  prescriptionId?: string | null; 
  prescription?: string | null;
};

type CartContextType = {
  cartItems: CartItem[];
   addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => void;
  updateLensOption: (productId: number, lensOption: LensOption) => void;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getLensTotal: () => number;
  getItemCount: () => number;
  isLoading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const API_BASE_URL = "http://localhost:8000/api";
const CART_ENDPOINTS = {
  BASE: "/cart/",
  ITEM: (id: number) => `/cart/${id}/`,
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const initialState: CartState = {
    cartItems: [],
    
  };

  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.getItem("access_token")
  );

  // Get auth headers fresh on every call to handle token changes
  const getAuthHeaders = () => {
    const token = sessionStorage.getItem("access_token");
    return token
      ? {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      : {};
  };

  // Check if user is authenticated based on token presence
  const isAuthenticated = () => !!sessionStorage.getItem("access_token");

  // Fetch cart from backend and populate state
  const fetchCart = async () => {
    if (!isAuthenticated()) {
      dispatch({ type: "CLEAR_CART" });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${CART_ENDPOINTS.BASE}`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        // Token expired or invalid: clear cart & token
        dispatch({ type: "CLEAR_CART" });
        setToken(null);
        throw new Error("Session expired. Please login again.");
      }
      if (!response.ok) throw new Error("Failed to fetch cart");

      const data = await response.json();
     
 
      dispatch({ type: "CLEAR_CART" });
 
      const items: CartItem[] = data
        .map((item: any) => ({
          product: normalizeProduct(item.product),
          quantity: item.quantity,
          lensOption: item.lensOption || null,
        }))
        .filter((item) => !!item.product);

      // Add items one by one through reducer to keep state consistent
      items.forEach((item) => {
        dispatch({
          type: "ADD_ITEM",
          product: item.product,
          quantity: item.quantity,
        });

        if (item.lensOption) {
          dispatch({
            type: "UPDATE_LENS_OPTION",
            productId: item.product.id,
            lensOption: item.lensOption,
          });
        }
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load cart";
      setError(errorMessage);
      console.error("Cart fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch cart once on mount
  useEffect(() => {
    fetchCart();
  }, []);

  // Watch token changes every 2 seconds, update token state and refetch cart or clear cart on logout
  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = sessionStorage.getItem("access_token");
      if (currentToken !== token) {
        setToken(currentToken);
        if (currentToken) {
          fetchCart();
        } else {
          dispatch({ type: "CLEAR_CART" });
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [token]);

  // Add product to cart (quantity always 1 here)
  const addToCart = async (product: Product, quantity = 1) => {
    if (!isAuthenticated()) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your cart",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${CART_ENDPOINTS.BASE}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ product_id: product.id, quantity}),
      });

      if (response.status === 401) {
        setToken(null);
        throw new Error("Session expired. Please login again.");
      }
      if (!response.ok) throw new Error("Failed to add to cart");

      dispatch({ type: "ADD_ITEM", product, quantity });

      toast({
        title: "Added to cart",
         description: `${product.name} (x${quantity}) has been added to your cart`,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add to cart";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart by productId
  const removeFromCart = async (productId: number) => {
    if (!isAuthenticated()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}${CART_ENDPOINTS.ITEM(productId)}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (response.status === 401) {
        setToken(null);
        throw new Error("Please login again to perform this action");
      }
      if (!response.ok) throw new Error("Failed to remove from cart");

      dispatch({ type: "REMOVE_ITEM", productId });

      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove from cart";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!isAuthenticated()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${CART_ENDPOINTS.BASE}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        setToken(null);
        throw new Error("Please login again to perform this action");
      }
      if (!response.ok) throw new Error("Failed to clear cart");

      dispatch({ type: "CLEAR_CART" });
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to clear cart";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Update quantity locally (optional sync with backend if needed)
 const updateQuantity = async (productId: number, quantity: number) => {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  dispatch({ type: "UPDATE_QUANTITY", productId, quantity });

  try {
    const response = await fetch(`${API_BASE_URL}/cart/${productId}/update/`, {
      method: "PATCH",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to update quantity on server:", error);
  }
};


  // Update lens option locally (optional sync with backend if needed)
  const updateLensOption = (productId: number, lensOption: LensOption) => {
    dispatch({ type: "UPDATE_LENS_OPTION", productId, lensOption });
    toast({
      title: "Lens option updated",
      description: "Lens selection applied",
    });
  };

  const getCartTotal = () => calculateCartTotal(state.cartItems);
  const getLensTotal = () => calculateLensTotal(state.cartItems);
  const getItemCount = () => calculateItemCount(state.cartItems);

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
        isLoading,
        error,
        refreshCart: fetchCart,
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
