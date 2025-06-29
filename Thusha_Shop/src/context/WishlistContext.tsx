  
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "../components/ui/use-toast";
import { Product,ApiProduct } from "@/types/product";
import { normalizeProduct } from "@/types/product";

type WishlistContextType = {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  refreshWishlist: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const API_BASE_URL = "http://localhost:8000/api";
const WISHLIST_ENDPOINTS = {
  BASE: "/wishlist/",
  ITEM: (id: number) => `/wishlist/${id}/`,
};

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState(() => sessionStorage.getItem("access_token"));

  const getAuthHeaders = () => {
    const token = sessionStorage.getItem("access_token");
    return token ? { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    } : {};
  };

  const isAuthenticated = () => !!sessionStorage.getItem("access_token");

  const fetchWishlist = async () => {
    if (!isAuthenticated()) {
      setWishlistItems([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${WISHLIST_ENDPOINTS.BASE}`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) throw new Error("Session expired. Please login again.");
      if (!response.ok) throw new Error("Failed to fetch wishlist");

      const data = await response.json();
      

      // Validate and transform wishlist items
     const products: Product[] = data
  .map((wishlistItem: any) => wishlistItem?.product_details)
  .filter((p: any): p is ApiProduct => !!p && typeof p.id === "number")
  .map((apiProduct: ApiProduct) => normalizeProduct(apiProduct));

      setWishlistItems(products);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load wishlist";
      setError(errorMessage);
      console.error("Wishlist fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = sessionStorage.getItem("access_token");
      if (currentToken !== token) {
        setToken(currentToken);
        if (currentToken) {
          fetchWishlist();
        } else {
          setWishlistItems([]);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [token]);

  const addToWishlist = async (product: Product) => {
    if (!isAuthenticated()) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your wishlist",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${WISHLIST_ENDPOINTS.BASE}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ product: product.id }),
      });

      if (response.status === 401) throw new Error("Session expired. Please login again.");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.detail || "Failed to add to wishlist");
      }

      setWishlistItems((prev) => [...prev, product]);
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add to wishlist";
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

  const removeFromWishlist = async (productId: number) => {
    if (!isAuthenticated()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${WISHLIST_ENDPOINTS.ITEM(productId)}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.status === 401) throw new Error("Please login again to perform this action");
      if (!response.ok) throw new Error("Failed to remove from wishlist");

      setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to remove from wishlist";
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

  const isInWishlist = (productId: number) =>
    wishlistItems.some((item) => item.id === productId);

  const clearWishlist = async () => {
    if (!isAuthenticated()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${WISHLIST_ENDPOINTS.BASE}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error("Failed to clear wishlist");

      setWishlistItems([]);
      toast({
        title: "Wishlist cleared",
        description: "All items have been removed from your wishlist",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to clear wishlist";
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

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        isLoading,
        error,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}  
