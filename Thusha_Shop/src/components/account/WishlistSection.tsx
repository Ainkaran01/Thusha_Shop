
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { toast } from "@/components/ui/use-toast";

const WishlistSection = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleRemoveFromWishlist = (productId: number, productName: string) => {
    removeFromWishlist(productId);
    toast({
      title: "Removed from Wishlist",
      description: `${productName} has been removed from your wishlist.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Wishlist</h2>
        {wishlistItems.length > 0 && (
          <Button 
            variant="outline" 
            onClick={clearWishlist}
            className="text-red-600 hover:text-red-700"
          >
            Clear All
          </Button>
        )}
      </div>
      
      {wishlistItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-4">
              Save items you love to your wishlist. They'll appear here so you can easily find them later.
            </p>
            <Button>Continue Shopping</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFromWishlist(item.id, item.name)}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">{item.name}</h3>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                  {item.inStock ? (
                    <span className="text-green-600 text-sm">In Stock</span>
                  ) : (
                    <span className="text-red-600 text-sm">Out of Stock</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.inStock}
                    className="flex-1"
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistSection;
