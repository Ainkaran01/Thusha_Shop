
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";

type FeaturedProductsProps = {
  products: Product[];
};

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  const { addToWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          className="bg-background rounded-lg shadow-md overflow-hidden hover-scale"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <Link to={`/product/${product.id}`} className="block relative group">
            <div className="relative h-64 overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
            </div>
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-white text-foreground hover:bg-white/90"
                onClick={(e) => {
                  e.preventDefault();
                  addToWishlist(product);
                }}
              >
                <Heart
                  className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""}`}
                />
              </Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-sm font-medium">Click to view details</p>
            </div>
          </Link>
          <div className="p-4">
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">{product.name}</h3>
              <span className="text-foreground font-bold">${product.price.toFixed(2)}</span>
            </div>
            <div className="flex items-center mb-3">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ${
                      i < Math.floor(product.ratings) ? "fill-current" : "fill-gray-300"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount})
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <Button
                size="sm"
                variant="outline"
                onClick={() => addToCart(product)}
                className="w-full"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FeaturedProducts;
