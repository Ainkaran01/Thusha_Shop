import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";
import { Review } from "@/types/review";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
interface ProductCardProps {
  product: Product;
}

const API_BASE_URL = "http://localhost:8000/api"; // Change to your actual API base URL

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Fetch reviews after component mounts
  useEffect(() => {
    async function fetchReviews() {
      setLoadingReviews(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/products/${product.id}/reviews/`);
        if (!response.ok) {
          throw new Error(`Failed to fetch reviews: ${response.statusText}`);
        }
        const data: Review[] = await response.json();
        setProductReviews(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoadingReviews(false);
      }
    }

    fetchReviews();
  }, [product.id]);

  // Calculate average rating and review count from fetched reviews
  const reviewCount = productReviews.length;
  const averageRating =
    reviewCount > 0
      ? productReviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
      : 0;

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

  const isOutOfStock =
    typeof product.stock === "number" ? product.stock < 1 : !product.stock;

  // Render stars for average rating
  const MAX_STARS = 5;
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= MAX_STARS; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <>
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
                className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""}`}
              />
            </Button>
          </div>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

              <div className="flex items-center gap-1">
                {renderStars(averageRating)}
                <span className="text-sm">{averageRating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({reviewCount} reviews)</span>
              </div>

              {loadingReviews && <p className="text-xs text-muted-foreground">Loading reviews...</p>}
              {error && <p className="text-xs text-destructive">{error}</p>}

             <div className="flex items-center justify-between">
              <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">LKR {product.price}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                  </div>
                </div>
                {!isOutOfStock && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleAddToCart}
                      className="flex items-center gap-1"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
      
    </>
  );
};

export default ProductCard;
