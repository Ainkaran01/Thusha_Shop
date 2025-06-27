
import React from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";
import { products } from "@/data/products";

interface RelatedProductsProps {
  currentProductId: number;
  category?: "eyeglasses" | "sunglasses" | "accessories";
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ 
  currentProductId, 
  category 
}) => {
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Find the current product
  const currentProduct = products.find(p => p.id === currentProductId);
  
  if (!currentProduct) return null;

  // Get related products with improved logic for eyeglasses
  const getRelatedProducts = () => {
    let related = products.filter(p => p.id !== currentProductId);

    // If looking for eyeglasses specifically
    if (category === "eyeglasses" || currentProduct.category === "eyeglasses") {
      related = related.filter(p => p.category === "eyeglasses");
    }
    // If looking for sunglasses specifically  
    else if (category === "sunglasses" || currentProduct.category === "sunglasses") {
      related = related.filter(p => p.category === "sunglasses");
    }
    // If looking for accessories
    else if (category === "accessories" || currentProduct.category === "accessories") {
      related = related.filter(p => p.category === "accessories");
    }

    // Sort by relevance
    return related
      .sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;

        // Same frame type gets high priority
        if (a.frameType === currentProduct.frameType) scoreA += 3;
        if (b.frameType === currentProduct.frameType) scoreB += 3;

        // Shared face shapes get priority
        const sharedFaceShapesA = a.recommendedFaceShapes.filter(shape =>
          currentProduct.recommendedFaceShapes.includes(shape)
        ).length;
        const sharedFaceShapesB = b.recommendedFaceShapes.filter(shape =>
          currentProduct.recommendedFaceShapes.includes(shape)
        ).length;
        
        scoreA += sharedFaceShapesA;
        scoreB += sharedFaceShapesB;

        // Same material gets some priority
        if (a.frameMaterial === currentProduct.frameMaterial) scoreA += 2;
        if (b.frameMaterial === currentProduct.frameMaterial) scoreB += 2;

        // Similar price range gets some priority
        const priceA = Math.abs(a.price - currentProduct.price);
        const priceB = Math.abs(b.price - currentProduct.price);
        if (priceA < 30) scoreA += 1;
        if (priceB < 30) scoreB += 1;

        return scoreB - scoreA;
      })
      .slice(0, 4);
  };

  const relatedProducts = getRelatedProducts();

  const handleToggleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const getProductBenefits = (product: Product) => {
    const benefits = [];
    if (product.features.some(f => f.toLowerCase().includes('uv'))) {
      benefits.push({ icon: <Shield className="h-3 w-3" />, text: "UV Protection" });
    }
    if (product.features.some(f => f.toLowerCase().includes('blue light'))) {
      benefits.push({ icon: <Eye className="h-3 w-3" />, text: "Blue Light" });
    }
    return benefits.slice(0, 2);
  };

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">You May Also Like</h2>
        <p className="text-muted-foreground">
          {category === "eyeglasses" ? "More eyeglasses perfect for your style" :
           category === "sunglasses" ? "More sunglasses for sun protection" :
           category === "accessories" ? "Essential accessories for your eyewear" :
           "Recommended based on your selection"}
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map(product => (
          <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <Link to={`/product/${product.id}`} className="block">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-white/80 hover:bg-white text-foreground"
                    onClick={(e) => handleToggleWishlist(e, product)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </Button>
                </div>
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <Badge className="capitalize bg-white/90 text-foreground hover:bg-white">
                    {product.frameType}
                  </Badge>
                  {product.category === "eyeglasses" && (
                    <Badge variant="outline" className="bg-white/90">
                      <Eye className="h-3 w-3 mr-1" />
                      Prescription
                    </Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium line-clamp-1">{product.name}</h3>
                  <span className="font-semibold">${product.price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                {/* Product Benefits */}
                <div className="flex gap-2 mb-3">
                  {getProductBenefits(product).map((benefit, index) => (
                    <div key={index} className="flex items-center gap-1 text-xs text-muted-foreground">
                      {benefit.icon}
                      <span>{benefit.text}</span>
                    </div>
                  ))}
                </div>

                {/* Face Shape Compatibility */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.recommendedFaceShapes.slice(0, 2).map(shape => (
                    <Badge key={shape} variant="outline" className="text-xs capitalize">
                      {shape}
                    </Badge>
                  ))}
                  {product.recommendedFaceShapes.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{product.recommendedFaceShapes.length - 2}
                    </Badge>
                  )}
                </div>

                <Button
                  className="w-full"
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={!product.inStock}
                >
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
