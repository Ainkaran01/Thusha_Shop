
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext"
import { Product } from "@/types/product";

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
              <span className="text-foreground font-bold">LKR {product.price}</span>
            </div>
            <div className="flex items-center mb-3">
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
