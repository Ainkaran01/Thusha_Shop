
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

interface Accessory {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'case' | 'cleaner' | 'spray' | 'cloth' | 'chain';
  rating: number;
  reviewCount: number;
  inStock: boolean;
  features: string[];
}

const AccessoriesSection = () => {
  const { addToCart } = useCart();
  const [accessories] = useState<Accessory[]>([
    {
      id: 1001,
      name: 'Premium Microfiber Cleaning Cloth',
      description: 'Ultra-soft microfiber cloth for safe and effective lens cleaning',
      price: 12.99,
      image: '/placeholder.svg',
      category: 'cloth',
      rating: 4.8,
      reviewCount: 156,
      inStock: true,
      features: ['Lint-free', 'Anti-static', 'Washable', 'Scratch-safe']
    },
    {
      id: 1002,
      name: 'Anti-Fog Spray',
      description: 'Long-lasting anti-fog solution for clear vision',
      price: 19.99,
      image: '/placeholder.svg',
      category: 'spray',
      rating: 4.6,
      reviewCount: 89,
      inStock: true,
      features: ['Long-lasting', 'Safe for all lenses', 'Easy application', '50ml bottle']
    },
    {
      id: 1003,
      name: 'Lens Cleaning Solution',
      description: 'Professional-grade cleaning solution for crystal clear lenses',
      price: 15.99,
      image: '/placeholder.svg',
      category: 'cleaner',
      rating: 4.7,
      reviewCount: 203,
      inStock: true,
      features: ['Alcohol-free', 'Streak-free', 'Safe for coatings', '100ml bottle']
    },
    {
      id: 1004,
      name: 'Hard Shell Protective Case',
      description: 'Durable hard case to protect your eyeglasses',
      price: 24.99,
      image: '/placeholder.svg',
      category: 'case',
      rating: 4.9,
      reviewCount: 312,
      inStock: true,
      features: ['Shock-resistant', 'Compact design', 'Velvet interior', 'Multiple colors']
    },
    {
      id: 1005,
      name: 'Stylish Glasses Chain',
      description: 'Elegant chain to keep your glasses secure and accessible',
      price: 18.99,
      image: '/placeholder.svg',
      category: 'chain',
      rating: 4.5,
      reviewCount: 78,
      inStock: true,
      features: ['Adjustable length', 'Comfortable fit', 'Stylish design', 'Universal compatibility']
    },
    {
      id: 1006,
      name: 'Travel Cleaning Kit',
      description: 'Complete cleaning kit for on-the-go maintenance',
      price: 29.99,
      image: '/placeholder.svg',
      category: 'cleaner',
      rating: 4.8,
      reviewCount: 145,
      inStock: true,
      features: ['Portable case', 'Multiple tools', 'Travel-friendly', 'All-in-one solution']
    }
  ]);

  const handleAddToCart = (accessory: Accessory) => {
    // Convert accessory to Product type for cart compatibility
    const productData: Product = {
      id: accessory.id,
      name: accessory.name,
      description: accessory.description,
      price: accessory.price,
      images: [accessory.image],
      category: 'accessories',
      frameType: 'accessory',
      frameMaterial: '',
      color: '',
      recommendedFaceShapes: [],
      recommendedVisionProblems: [],
      ratings: accessory.rating,
      reviewCount: accessory.reviewCount,
      inStock: accessory.inStock,
      features: accessory.features
    };

    addToCart(productData);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'case': return '🥽';
      case 'cleaner': return '🧽';
      case 'spray': return '💨';
      case 'cloth': return '🧻';
      case 'chain': return '⛓️';
      default: return '📦';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'case': return 'Cases';
      case 'cleaner': return 'Cleaners';
      case 'spray': return 'Sprays';
      case 'cloth': return 'Cloths';
      case 'chain': return 'Chains & Straps';
      default: return 'Accessories';
    }
  };

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Eyewear Accessories</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Complete your eyewear experience with our premium accessories. From cleaning solutions to protective cases, 
          we have everything you need to keep your glasses in perfect condition.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accessories.map((accessory) => (
          <Card key={accessory.id} className="group hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="relative">
                <img 
                  src={accessory.image} 
                  alt={accessory.name}
                  className="w-full h-48 object-cover rounded-md bg-gray-100"
                />
                <Badge className="absolute top-2 right-2">
                  {getCategoryIcon(accessory.category)} {getCategoryName(accessory.category)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <CardTitle className="text-lg mb-2">{accessory.name}</CardTitle>
                <p className="text-sm text-muted-foreground mb-3">{accessory.description}</p>
              </div>

              <div className="flex items-center mb-3">
                <div className="flex text-yellow-500 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(accessory.rating) ? "fill-yellow-500" : "fill-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {accessory.rating} ({accessory.reviewCount} reviews)
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Features:</h4>
                <div className="flex flex-wrap gap-1">
                  {accessory.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {accessory.features.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{accessory.features.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-xl font-bold">${accessory.price.toFixed(2)}</div>
                <Button 
                  onClick={() => handleAddToCart(accessory)}
                  disabled={!accessory.inStock}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>

              {!accessory.inStock && (
                <div className="text-center">
                  <Badge variant="destructive">Out of Stock</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Add Banner */}
      {/* <div className="mt-12 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold mb-2">Complete Care Package</h3>
        <p className="text-muted-foreground mb-4">
          Get everything you need to maintain your eyewear with our complete care package
        </p>
        <Button size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Add Care Package ($79.99 - Save $15!)
        </Button>
      </div> */}
    </div>
  );
};

export default AccessoriesSection;
