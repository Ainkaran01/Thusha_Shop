import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { Product } from "@/types/product";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist, isLoading } = useWishlist();
  const { addToCart } = useCart();

  const handleRemoveItem = async (productId: number) => {
    await removeFromWishlist(productId);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleClearWishlist = async () => {
    await clearWishlist();
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const getFirstImage = (images: string[]): string => {
    if (!images || images.length === 0) {
      return '/placeholder.jpg';
    }
    return images[0] || '/placeholder.jpg';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Heart className="mr-2 h-8 w-8" /> Your Wishlist
      </h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8">
              Save your favorite frames to your wishlist for easy access later.
            </p>
          </motion.div>
          <Button asChild size="lg">
            <Link to="/catalog">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {wishlistItems.length} {wishlistItems.length === 1 ? "Item" : "Items"}
            </h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearWishlist}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Clear Wishlist
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((product, index) => (
              <motion.div
                key={`${product.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-background border border-border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <Link to={`/product/${product.id}`} className="block relative">
                  <img
                    src={getFirstImage(product.images)}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.jpg';
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white text-destructive rounded-full"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveItem(product.id);
                    }}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Link>

                <div className="p-4">
                  <div className="flex justify-between mb-2">
                    <Link
                      to={`/product/${product.id}`}
                      className="font-medium hover:underline line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <span className="font-semibold">{formatPrice(product.price)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full"
                      onClick={() => handleAddToCart(product)}
                      disabled={isLoading}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" /> Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <Link to={`/product/${product.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;  
