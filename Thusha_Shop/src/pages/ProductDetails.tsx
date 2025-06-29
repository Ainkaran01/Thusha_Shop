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
  Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { products, reviews } from "@/data/products";
import { Product} from "../types/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import ProductReviews from "@/components/ProductReviews";
import RelatedProducts from "@/components/RelatedProducts";
import LensSelector from "@/components/LensSelector";
import VirtualTryOn from "@/components/VirtualTryOn";
import AccessoriesSection from "@/components/AccessoriesSection";

// Extend Product type for cart items
interface CartProduct extends Product {
  quantity: number;
  selectedLens?: any;
}

const API_BASE_URL = 'http://localhost:8000/api';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLensSelector, setShowLensSelector] = useState(false);
  const [selectedLens, setSelectedLens] = useState<any>(null);
  const [showVirtualTryOn, setShowVirtualTryOn] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/products/${id}/`);
        if (!response.ok) {
          if (response.status === 404) {
            navigate('/not-found');
          }
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
        
        // Fetch reviews for this product
        const reviewsResponse = await fetch(`${API_BASE_URL}/products/${id}/reviews/`);
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          setProductReviews(reviewsData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product) return;

    // If it's glasses but no lens is selected
    if (product.frameType && !selectedLens) {
      setShowLensSelector(true);
      return;
    }

    // If lens is selected or it's not glasses
    addToCart({
      ...product,
      quantity: 1,
      selectedLens: selectedLens
    } as unknown as Product);
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleLensSelected = (lensData: any) => {
    setSelectedLens(lensData);
    setShowLensSelector(false);
    
    // Add the product with the lens to the cart
    if (product) {
      addToCart({
        ...product,
        quantity: 1,
        selectedLens: lensData,
        price: product.price + (lensData.lensOption?.price || 0) // Add lens price to total
      } as unknown as Product);
      
      toast({
        title: "Added to Cart",
        description: `${product.name} with ${lensData.lensOption?.name || 'selected'} lenses has been added to your cart.`,
      });
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
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
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
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link to="/catalog" className="hover:text-primary">Catalog</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-foreground font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div>
          <div className="relative overflow-hidden bg-secondary rounded-lg mb-4 h-[500px]">
            <motion.img 
              key={currentImageIndex}
              src={product.images?.[currentImageIndex] || ''} 
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
    setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : (product.images?.length || 1) - 1));
  }}
>
  <ChevronLeft className="h-5 w-5" />
</Button>
<Button 
  variant="ghost" 
  size="icon" 
  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 text-foreground rounded-full"
  onClick={() => {
    setCurrentImageIndex(prev => (prev < (product.images?.length || 1) - 1 ? prev + 1 : 0));
  }}
>
  <ChevronRight className="h-5 w-5" />
</Button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {product.images?.map((image, index) => (
              <div 
                key={index} 
                className={`cursor-pointer border-2 rounded-md overflow-hidden h-24 ${
                  index === currentImageIndex ? 'border-primary' : 'border-transparent'
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
                      i < Math.floor(product.ratings || 0) ? "fill-yellow-500" : "fill-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">
                {(product.ratings || 0).toFixed(1)} ({product.reviewCount || 0} reviews)
              </span>
            </div>
            <div className="text-2xl font-bold mb-4">LKR {Number(product.price || 0).toFixed(2)}</div>
            <p className="text-muted-foreground mb-6">{product.description}</p>
          </div>

          <div className="space-y-4 mb-6">
            {product.frameType && (
              <div className="flex justify-between">
                <span className="font-medium">Frame Type:</span>
                <span className="capitalize">{product.frameType}</span>
              </div>
            )}
            {product.frameMaterial && (
              <div className="flex justify-between">
                <span className="font-medium">Material:</span>
                <span className="capitalize">{product.frameMaterial}</span>
              </div>
            )}
            {product.color && (
              <div className="flex justify-between">
                <span className="font-medium">Color:</span>
                <span className="capitalize">{product.color}</span>
              </div>
            )}
            {(product.recommendedFaceShapes?.length || product.recommendedVisionProblems?.length) && (
              <div className="flex justify-between">
                <span className="font-medium">Recommended For:</span>
                <div className="text-right">
                  {product.recommendedFaceShapes?.length ? (
                    <div>
                      {product.recommendedFaceShapes.map((shape, index) => (
                        <Badge key={shape} variant="outline" className="capitalize mr-1 mb-1">
                          {shape} {index < product.recommendedFaceShapes.length - 1 ? "" : ""}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                  {product.recommendedVisionProblems?.length ? (
                    <div className="mt-1">
                      {product.recommendedVisionProblems.map((problem, index) => (
                        <Badge key={problem} variant="outline" className="capitalize mr-1">
                          {problem} {index < product.recommendedVisionProblems.length - 1 ? "" : ""}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>

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
        disabled={('stock' in product ? product.stock <= quantity : !product.inStock)}
        className="h-10 px-3"
      >
        +
      </Button>
    </div>
    <div className="ml-auto text-right">
      <div className="text-sm text-muted-foreground">
        {'stock' in product ? (
          product.stock > 0 ? (
            <span className="text-green-600 flex items-center">
              <Check className="h-4 w-4 mr-1" /> 
              {product.stock} in Stock
            </span>
          ) : (
            <span className="text-red-600">Out of Stock</span>
          )
        ) : product.inStock ? (
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
      disabled={'stock' in product ? product.stock <= 0 : !product.inStock}
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

          {/* Virtual Try-On Button */}
          {product.frameType && (
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
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

      {/* Product Tabs */}
      <div className="mb-16">
        <Tabs defaultValue="details">
          <TabsList className="w-full justify-start mb-6 border-b">
            <TabsTrigger value="details" className="text-lg">Details</TabsTrigger>
            <TabsTrigger value="reviews" className="text-lg">Reviews</TabsTrigger>
            <TabsTrigger value="shipping" className="text-lg">Shipping & Returns</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="p-4">
            <div>
              <h3 className="text-xl font-semibold mb-4">Product Details</h3>
              <p className="mb-4">{product.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium mb-2">Specifications</h4>
                  <ul className="space-y-2">
                    {product.frameType && <li><strong>Frame Type:</strong> {product.frameType}</li>}
                    {product.frameMaterial && <li><strong>Frame Material:</strong> {product.frameMaterial}</li>}
                    {product.color && <li><strong>Color:</strong> {product.color}</li>}
                    <li><strong>UV Protection:</strong> Yes</li>
                    <li><strong>Prescription Compatible:</strong> Yes</li>
                  </ul>
                </div>
               <div>
  <h4 className="font-medium mb-2">Recommended For</h4>
  {product.face_shapes?.length ? (
    <div className="mb-4">
    <p className="font-medium">Face Shapes:</p>
      <div className="flex flex-wrap gap-2 mt-1">
        {product.face_shapes.map(shape => (
          <Badge key={shape} className="capitalize">{shape}</Badge>
        ))}
      </div>
    </div>
  ) : null}
  {product.vision_problems?.length ? (
    <div>
      <p className="font-medium">Vision Problems:</p>
      <div className="flex flex-wrap gap-2 mt-1">
        {product.vision_problems.map(problem => (
          <Badge key={problem} className="capitalize">{problem}</Badge>
        ))}
      </div>
    </div>
  ) : null}
</div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="p-4">
            <ProductReviews productId={product.id} reviews={productReviews} />
          </TabsContent>
          <TabsContent value="shipping" className="p-4">
            <div>
              <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
              <p className="mb-4">
                We offer free standard shipping on all orders within the United States. 
                International shipping rates vary by destination.
              </p>
              
              <h4 className="font-medium mb-2">Shipping Options</h4>
              <ul className="space-y-2 mb-6">
                <li><strong>Standard Shipping:</strong> 5-7 business days (Free)</li>
                <li><strong>Express Shipping:</strong> 2-3 business days (LKR 400)</li>
                <li><strong>Next Day Shipping:</strong> Next business day if ordered before 2pm EST (LKR 500)</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-4">Return Policy</h3>
              <p className="mb-4">
                We offer a 30-day return policy for all our frames. If you're not completely 
                satisfied with your purchase, you can return it within 30 days for a full refund 
                or exchange.
              </p>
              
              <h4 className="font-medium mb-2">Return Process</h4>
              <ol className="list-decimal list-inside space-y-2">
                <li>Contact our customer service to initiate a return</li>
                <li>Pack your glasses in their original packaging</li>
                <li>Print the prepaid return label that we'll send to you</li>
                <li>Drop off the package at any postal service location</li>
                <li>Once we receive and inspect the return, we'll process your refund</li>
              </ol>
              
              <div className="bg-secondary p-4 rounded-lg mt-6">
                <p className="font-medium">Note</p>
                <p className="text-sm">
                  Prescription lenses are custom-made for your specific vision needs and 
                  cannot be returned unless there's a manufacturing defect. Please contact 
                  our customer service if you have any issues with your prescription lenses.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

    
      {/* Accessories Section - Only show for eyeglasses */}
      {product.category === "eyeglasses" && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Complete Your Eyewear</h2>
          <AccessoriesSection />
        </div>
      )}

      {/* Related Products - Enhanced with category-specific recommendations */}
      <div className="mb-16">
        {product.category === "eyeglasses" && (
          <>
            <RelatedProducts currentProductId={product.id} category="eyeglasses" />
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Essential Accessories</h2>
              <RelatedProducts currentProductId={product.id} category="accessories" />
            </div>
          </>
        )}
        
        {product.category === "sunglasses" && (
          <RelatedProducts currentProductId={product.id} category="sunglasses" />
        )}
        
        {product.category === "accessories" && (
          <>
            <RelatedProducts currentProductId={product.id} category="accessories" />
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Perfect Frames for These Accessories</h2>
              <RelatedProducts currentProductId={product.id} category="eyeglasses" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;