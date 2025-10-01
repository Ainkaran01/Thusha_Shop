import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Share,
  Truck,
  ShieldCheck,
  Repeat,
  Star,
  ChevronRight,
  ChevronLeft,
  Check,
  Camera,
  Box,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import ProductReviews from "@/components/ProductReviews";
import RelatedProducts from "@/components/RelatedProducts";
import VirtualTryOn from "@/components/VirtualTryOn";
import ProductViewer360Modal from "@/components/ProductViewer360Modal";
import { useMemo } from "react";
import { Review } from "@/types/review";
import { useUser } from "@/context/UserContext";
import { get360ImagesForProduct, has360View } from "@/types/product360";
import { getOptimal360Frames } from "@/utils/360EffectUtils";
// Extend Product type for cart items
interface CartProduct extends Product {
  quantity: number;
}

const API_BASE_URL = "http://localhost:8000/api";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVirtualTryOn, setShowVirtualTryOn] = useState(false);
  const [show360Modal, setShow360Modal] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/products/${id}/`);
        if (!response.ok) {
          if (response.status === 404) {
            navigate("/not-found");
          }
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data);

        // Fetch reviews for this product
        const reviewsResponse = await fetch(
          `${API_BASE_URL}/products/${id}/reviews/`
        );

        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          setProductReviews(reviewsData);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    }
  };

  const averageRating = useMemo(() => {
    return productReviews.length > 0
      ? productReviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
          productReviews.length
      : 0;
  }, [productReviews]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Loading Product...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Error Loading Product</h2>
        <p className="mb-6">{error}</p>
        <Button asChild>
          <Link to="/catalog">Return to Catalog</Link>
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-6">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/catalog">Return to Catalog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link to="/catalog" className="hover:text-primary">
          Catalog
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-foreground font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div>
          <div className="relative overflow-hidden bg-secondary rounded-lg mb-4 h-[500px]">
            <motion.img
              key={currentImageIndex}
              src={product.images?.[currentImageIndex] || ""}
              alt={product.name}
              className="w-full h-full object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 text-foreground rounded-full"
              onClick={() => {
                setCurrentImageIndex((prev) =>
                  prev > 0 ? prev - 1 : (product.images?.length || 1) - 1
                );
              }}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 text-foreground rounded-full"
              onClick={() => {
                setCurrentImageIndex((prev) =>
                  prev < (product.images?.length || 1) - 1 ? prev + 1 : 0
                );
              }}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            {/* 360° Icon - Top Right Corner */}
            {product.category.name !== "accessories" && product.category.name !== "Eyeglasses" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShow360Modal(true)}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white text-yellow-600 hover:text-yellow-700 rounded-full shadow-lg border border-yellow-200 h-10 w-10"
              >
                <span className="text-lg font-bold">360°</span>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-4 gap-4">
            {product.images?.map((image, index) => (
              <div
                key={index}
                className={`cursor-pointer border-2 rounded-md overflow-hidden h-24 ${
                  index === currentImageIndex
                    ? "border-primary"
                    : "border-transparent"
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-500 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(averageRating)
                        ? "fill-yellow-500 text-yellow-500"
                        : "fill-gray-300 text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">
                {averageRating.toFixed(1)} ({productReviews.length}{" "}
                {productReviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>

            <div className="text-2xl font-bold mb-4">
              LKR {Number(product.price || 0).toFixed(2)}
            </div>
            <p className="text-muted-foreground mb-6">{product.description}</p>
          </div>

          {product.category.name === "Eyeglasses" && (
            <div className="space-y-4 mb-6">
              {product.frame_type && (
                <div className="flex justify-between">
                  <span className="font-medium">Frame Type:</span>
                  <span className="capitalize">{product.frame_type.name}</span>
                </div>
              )}
              {product.frame_material && (
                <div className="flex justify-between">
                  <span className="font-medium">Material:</span>
                  <span className="capitalize">{product.frame_material}</span>
                </div>
              )}
              {product.colors && (
                <div className="flex justify-between">
                  <span className="font-medium">Color:</span>
                  <span className="capitalize">{product.colors}</span>
                </div>
              )}
              {product.size && (
                <div className="flex justify-between">
                  <span className="font-medium">Size:</span>
                  <span className="capitalize">{product.size}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex justify-between">
                  <span className="font-medium">Weight:</span>
                  <span className="capitalize">{product.weight}</span>
                </div>
              )}
              {(product.face_shapes?.length ||
                product.vision_problems?.length) && (
                <div className="flex justify-between">
                  <span className="font-medium">Recommended For:</span>
                  <div className="text-right">
                    {product.face_shapes?.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-end">
                        {product.face_shapes.map((shape) => (
                          <Badge
                            key={shape}
                            variant="outline"
                            className="capitalize"
                          >
                            {shape}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {product.vision_problems?.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-end mt-1">
                        {product.vision_problems.map((vp) => (
                          <Badge
                            key={vp}
                            variant="outline"
                            className="capitalize"
                          >
                            {vp}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <Separator className="my-6" />

          {/* Add to Cart */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <span className="mr-4 font-medium">Quantity:</span>
              <div className="flex items-center border border-input rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="h-10 px-3"
                >
                  -
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={
                    "stock" in product
                      ? product.stock <= quantity
                      : !product.stock
                  }
                  className="h-10 px-3"
                >
                  +
                </Button>
              </div>
              <div className="ml-auto text-right">
                <div className="text-sm text-muted-foreground">
                  {"stock" in product ? (
                    product.stock > 0 ? (
                      <span className="text-green-600 flex items-center">
                        <Check className="h-4 w-4 mr-1" />
                        {product.stock} in Stock
                      </span>
                    ) : (
                      <span className="text-red-600">Out of Stock</span>
                    )
                  ) : product.stock ? (
                    <span className="text-green-600 flex items-center">
                      <Check className="h-4 w-4 mr-1" /> In Stock
                    </span>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={
                  "stock" in product ? product.stock <= 0 : !product.stock
                }
                className="flex-1"
                size="lg"
              >
                Add to Cart
              </Button>
              <Button
                variant="outline"
                onClick={handleToggleWishlist}
                className="flex-1"
                size="lg"
              >
                {isInWishlist(product.id) ? (
                  <span className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 fill-red-500 text-red-500" />
                    Added to Wishlist
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Heart className="h-5 w-5 mr-2" />
                    Add to Wishlist
                  </span>
                )}
              </Button>
            </div>
          </div>

          {showVirtualTryOn && (
            <VirtualTryOn
              product={product}
              onClose={() => setShowVirtualTryOn(false)}
              isOpen={true} // Changed from false to true
            />
          )}

          { (product.category.name === "Eyeglasses" || product.category.name === "sport glasses" || product.category.name === "sun glasses" )&& (
            <div className="mb-6">
              <Button
                onClick={() => setShowVirtualTryOn(true)}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Camera className="h-5 w-5 mr-2" />
                Try On Virtually
              </Button>
            </div>
          )}
          {/* Product Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center">
              <Truck className="h-5 w-5 mr-2 text-muted-foreground" />
              <span className="text-sm">Free Shipping</span>
            </div>
            <div className="flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2 text-muted-foreground" />
              <span className="text-sm">2-Year Warranty</span>
            </div>
            <div className="flex items-center">
              <Repeat className="h-5 w-5 mr-2 text-muted-foreground" />
              <span className="text-sm">30-Day Returns</span>
            </div>
          </div>

          {/* Product Features */}
          {product.features?.length ? (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Key Features:</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Share */}
          <div className="flex items-center mt-6">
            <span className="mr-3 text-muted-foreground">Share:</span>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Share className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs - Enhanced Design */}
      <div className="mb-16">
        <Tabs defaultValue="details" className="w-full">
          <div className="relative">
            <TabsList className="w-full justify-start mb-6 bg-gradient-to-r from-gray-50 to-gray-100 p-1 rounded-lg border border-gray-200 shadow-sm">
              <TabsTrigger
                value="details"
                className="text-sm font-medium px-4 py-2 rounded-md transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 data-[state=active]:border data-[state=active]:border-blue-200 hover:bg-white/50"
              >
                <Box className="h-3 w-3 mr-1" />
                Details
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="text-sm font-medium px-4 py-2 rounded-md transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 data-[state=active]:border data-[state=active]:border-blue-200 hover:bg-white/50"
              >
                <Star className="h-3 w-3 mr-1" />
                Reviews
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="text-sm font-medium px-4 py-2 rounded-md transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 data-[state=active]:border data-[state=active]:border-blue-200 hover:bg-white/50"
              >
                <Truck className="h-3 w-3 mr-1" />
                Shipping & Returns
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="details" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Box className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Product Details
                </h3>
              </div>

              {/* Product Description */}
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Description
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Only show this part for Eyeglasses */}
              {product.category.name === "Eyeglasses" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Specifications Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg mr-2">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        Specifications
                      </h4>
                    </div>
                    <div className="space-y-3">
                      {product.frame_type && (
                        <div className="flex justify-between items-center py-1 border-b border-blue-200">
                          <span className="font-medium text-gray-700 text-sm">
                            Frame Type:
                          </span>
                          <span className="text-gray-900 font-semibold text-sm">
                            {product.frame_type.name}
                          </span>
                        </div>
                      )}
                      {product.frame_material && (
                        <div className="flex justify-between items-center py-1 border-b border-blue-200">
                          <span className="font-medium text-gray-700 text-sm">
                            Frame Material:
                          </span>
                          <span className="text-gray-900 font-semibold text-sm">
                            {product.frame_material}
                          </span>
                        </div>
                      )}
                      {product.colors && (
                        <div className="flex justify-between items-center py-1 border-b border-blue-200">
                          <span className="font-medium text-gray-700 text-sm">
                            Color:
                          </span>
                          <span className="text-gray-900 font-semibold text-sm">
                            {product.colors}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center py-1 border-b border-blue-200">
                        <span className="font-medium text-gray-700 text-sm">
                          UV Protection:
                        </span>
                        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          Yes
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="font-medium text-gray-700 text-sm">
                          Prescription Compatible:
                        </span>
                        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          Yes
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Recommended For Card */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-purple-100 rounded-lg mr-2">
                        <Star className="h-4 w-4 text-purple-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        Recommended For
                      </h4>
                    </div>

                    {product.face_shapes?.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-800 mb-2 flex items-center text-sm">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                          Face Shapes
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {product.face_shapes.map((shape) => (
                            <Badge
                              key={shape}
                              className="bg-purple-100 text-purple-800 border-purple-200 capitalize px-2 py-1 text-xs"
                            >
                              {shape}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {product.vision_problems?.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2 flex items-center text-sm">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                          Vision Problems
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {product.vision_problems.map((problem) => (
                            <Badge
                              key={problem}
                              className="bg-pink-100 text-pink-800 border-pink-200 capitalize px-2 py-1 text-xs"
                            >
                              {problem}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Customer Reviews
                </h3>
              </div>
              <ProductReviews
                productId={product.id}
                reviews={productReviews}
                setReviews={setProductReviews}
              />
            </motion.div>
          </TabsContent>
          <TabsContent value="shipping" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
            >
              <div className="flex items-center mb-6">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <Truck className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Shipping & Returns
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Shipping Information Card */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <Truck className="h-5 w-5 text-green-600" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900">
                      Shipping Information
                    </h4>
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed">
                    We offer free standard shipping on all orders within Sri
                    Lanka. International shipping rates vary by destination.
                  </p>

                  <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Shipping Options
                  </h5>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-green-200">
                      <div>
                        <span className="font-semibold text-gray-900">
                          Standard Shipping
                        </span>
                        <p className="text-sm text-gray-600">
                          5-7 business days
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Free
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-green-200">
                      <div>
                        <span className="font-semibold text-gray-900">
                          Express Shipping
                        </span>
                        <p className="text-sm text-gray-600">
                          2-3 business days
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        LKR 400
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-green-200">
                      <div>
                        <span className="font-semibold text-gray-900">
                          Next Day Shipping
                        </span>
                        <p className="text-sm text-gray-600">
                          Next business day (before 2pm)
                        </p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                        LKR 500
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Return Policy Card */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg mr-3">
                      <Repeat className="h-5 w-5 text-orange-600" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900">
                      Return Policy
                    </h4>
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed">
                    We offer a 30-day return policy for all our frames. If
                    you're not completely satisfied with your purchase, you can
                    return it within 30 days for a full refund or exchange.
                  </p>

                  <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    Return Process
                  </h5>

                  <div className="space-y-3">
                    {[
                      "Contact our customer service to initiate a return",
                      "Pack your glasses in their original packaging",
                      "Print the prepaid return label that we'll send to you",
                      "Drop off the package at any postal service location",
                      "Once we receive and inspect the return, we'll process your refund",
                    ].map((step, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Important Note */}
              <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="flex items-start">
                  <div className="p-2 bg-amber-100 rounded-lg mr-4 flex-shrink-0">
                    <ShieldCheck className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-amber-800 mb-2">
                      Important Note
                    </h5>
                    <p className="text-amber-700 text-sm leading-relaxed">
                      Prescription lenses are custom-made for your specific
                      vision needs and cannot be returned unless there's a
                      manufacturing defect. Please contact our customer service
                      if you have any issues with your prescription lenses.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products - Enhanced with category-specific recommendations */}
      <div className="mb-16">
        {product.category.name === "Eyeglasses" && (
          <>
            <RelatedProducts
              currentProductId={product.id}
              currentProduct={product}
              category={product.category.name}
            />
          </>
        )}

        {product.category.name === "sport glasses" && (
          <RelatedProducts
            currentProductId={product.id}
            currentProduct={product}
            category={product.category.name}
          />
        )}
        {product.category.name === "sun glasses" && (
          <RelatedProducts
            currentProductId={product.id}
            currentProduct={product}
            category={product.category.name}
          />
        )}

        {product.category.name === "accessories" && (
          <>
            <RelatedProducts
              currentProductId={product.id}
              currentProduct={product}
              category={product.category.name}
            />
            {/* <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">
                Perfect Frames for These Accessories
              </h2>
              <RelatedProducts
                currentProductId={product.id}
                currentProduct={product}
                category={product.category.name}
              />
            </div> */}
          </>
        )}
      </div>
      {/* 360° Modal */}

      <ProductViewer360Modal
        isOpen={show360Modal}
        onClose={() => setShow360Modal(false)}
        images={getOptimal360Frames(product?.images || ["/images/f1.jpg"], 32)}
        productName={product?.name || "Unnamed Product"}
        fallbackImage={product?.images?.[0] || "/images/f1.jpg"}
      />
    </div>
  );
};

export default ProductDetails;
