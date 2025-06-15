
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const EmptyCart: React.FC = () => {
  return (
    <div className="text-center py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">
          Looks like you haven't added any frames to your cart yet.
        </p>
      </motion.div>
      <Button asChild size="lg">
        <Link to="/catalog">Start Shopping</Link>
      </Button>
    </div>
  );
};

export default EmptyCart;
