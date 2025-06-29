import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Check if product is out of stock (stock < 1)
const isOutOfStock =
  typeof product.stock === 'number'
    ? product.stock < 1
    : !product.inStock;

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="group hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {isOutOfStock && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              Out of Stock
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleWishlistToggle}
          >
            <Heart 
              className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} 
            />
          </Button>
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{product.ratings}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount} reviews)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold">LKR {product.price}</span>
              {!isOutOfStock && (
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  className="flex items-center gap-1"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;