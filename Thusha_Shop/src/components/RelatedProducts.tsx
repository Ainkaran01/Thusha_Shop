import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/product";

interface RelatedProductsProps {
  currentProductId: number;
  currentProduct: Product;
  category?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
  currentProduct,
  category,
}) => {
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = "http://localhost:8000/api";

  useEffect(() => {
    const fetchAndFilterProducts = async () => {
      try {
        setIsLoading(true);

        // Fetch all products
        const response = await fetch(`${API_BASE_URL}/products/products`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        console.log(data);
        // Ensure we have an array of products
        const allProducts: Product[] = Array.isArray(data) ? data : [];

        // Filter products
        const filtered = allProducts
          .filter((product) => product.id !== currentProductId) // Exclude current product
          .filter(
            (product) =>
              !category ||
              product.category?.name?.toLowerCase() === category.toLowerCase()
          ); // Case-insensitive category filter

        // Sort by relevance
        const sorted = filtered.sort((a, b) => {
          let scoreA = 0;
          let scoreB = 0;

          // Same frame type
          if (a.frame_type?.name === currentProduct.frame_type?.name)
            scoreA += 3;
          if (b.frame_type?.name === currentProduct.frame_type?.name)
            scoreB += 3;

          // Shared face shapes
          const sharedShapesA =
            a.face_shapes?.filter((shape) =>
              currentProduct.face_shapes?.includes(shape)
            ).length || 0;
          const sharedShapesB =
            b.face_shapes?.filter((shape) =>
              currentProduct.face_shapes?.includes(shape)
            ).length || 0;

          scoreA += sharedShapesA;
          scoreB += sharedShapesB;

          // Same material
          if (a.frame_material === currentProduct.frame_material) scoreA += 2;
          if (b.frame_material === currentProduct.frame_material) scoreB += 2;

          // Similar price
          const priceDiffA = Math.abs(a.price - currentProduct.price);
          const priceDiffB = Math.abs(b.price - currentProduct.price);
          if (priceDiffA < 30) scoreA += 1;
          if (priceDiffB < 30) scoreB += 1;

          return scoreB - scoreA;
        });

        setRelatedProducts(sorted.slice(0, 4)); // Take top 4
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndFilterProducts();
  }, [currentProductId, category, currentProduct]);

  const handleToggleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    isInWishlist(product.id)
      ? removeFromWishlist(product.id)
      : addToWishlist(product);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const getProductBenefits = (product: Product) => {
    const benefits = [];
    if (product.features?.some((f) => f?.toLowerCase()?.includes("uv"))) {
      benefits.push({
        icon: <Shield className="h-3 w-3" />,
        text: "UV Protection",
      });
    }
    if (
      product.features?.some((f) => f?.toLowerCase()?.includes("blue light"))
    ) {
      benefits.push({ icon: <Eye className="h-3 w-3" />, text: "Blue Light" });
    }
    return benefits.slice(0, 2);
  };

  if (isLoading)
    return <div className="text-center py-8">Loading related products...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;
  if (relatedProducts.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">You May Also Like</h2>
        <p className="text-muted-foreground">
          {category?.toLowerCase() === "Eyeglasses"
            ? "More eyeglasses perfect for your style"
            : category?.toLowerCase() === "sunglasses"
            ? "More sunglasses for sun protection"
            : category?.toLowerCase() === "accessories"
            ? "Essential accessories for your eyewear"
            : "Recommended based on your selection"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <Card
            key={product.id}
            className="group overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <Link to={`/product/${product.id}`} className="block">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.images?.[0] || "/placeholder-product.jpg"}
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
                        isInWishlist(product.id)
                          ? "fill-red-500 text-red-500"
                          : ""
                      }`}
                    />
                  </Button>
                </div>
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <Badge className="capitalize bg-white/90 text-foreground hover:bg-white">
                    {product.frame_type?.name || "Standard"}
                  </Badge>
                  {product.category?.name?.toLowerCase() === "eyeglasses" && (
                    <Badge variant="outline" className="bg-white/90">
                      <Eye className="h-3 w-3 mr-1" />
                      Prescription
                    </Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    {" "}
                    {/* Added flex container for name */}
                    <h3 className="font-medium line-clamp-1">{product.name}</h3>
                  </div>
                  <span className="font-semibold ml-4 whitespace-nowrap">
                    LKR {product.price}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex gap-2 mb-3">
                  {getProductBenefits(product).map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 text-xs text-muted-foreground"
                    >
                      {benefit.icon}
                      <span>{benefit.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {product.face_shapes?.slice(0, 2).map((shape) => (
                    <Badge
                      key={shape}
                      variant="outline"
                      className="text-xs capitalize"
                    >
                      {shape}
                    </Badge>
                  ))}
                  {(product.face_shapes?.length || 0) > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{(product.face_shapes?.length || 0) - 2}
                    </Badge>
                  )}
                </div>

                <Button
                  className="w-full"
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={!product.stock || product.stock <= 0}
                >
                  {product.stock ? "Add to Cart" : "Out of Stock"}
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
