
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "../components/ui/use-toast";
import { Product } from "../types";
import { useUser } from "./UserContext";
type WishlistContextType = {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const { isAuthenticated } = useUser(); 

  // Load wishlist from sessionStorage on initial load
  useEffect(() => {
    const savedWishlist = sessionStorage.getItem("wishlist");
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error("Failed to parse wishlist data:", error);
      }
    }
  }, []);

  // Save wishlist to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);



const addToWishlist = (product: Product) => {
  if (!isAuthenticated) {
    toast({
      title: "Login Required",
      description: "Please login to add items to your wishlist",
      variant: "destructive",
    });
    return;
  }

  if (!isInWishlist(product.id)) {
    setWishlistItems((prevItems) => [...prevItems, product]);
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist`,
    });
  }
};

  const removeFromWishlist = (productId: number) => {
    setWishlistItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.id === productId);
      
      if (itemToRemove) {
        toast({
          title: "Removed from wishlist",
          description: `${itemToRemove.name} has been removed from your wishlist`,
        });
      }
      
      return prevItems.filter((item) => item.id !== productId);
    });
  };

  const isInWishlist = (productId: number) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist",
    });
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
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
