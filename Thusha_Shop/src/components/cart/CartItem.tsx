
import React from "react";
import { Link } from "react-router-dom";
import { Trash2, Check, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CartItem as CartItemType } from "@/types/cart";

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ 
  item, 
  onQuantityChange, 
  onRemoveItem 
}) => {
  return (
    <motion.div
      key={item.product.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-12 gap-4 border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
    >
      {/* Product */}
      <div className="md:col-span-6">
        <div className="flex items-start">
          <div className="w-20 h-20 mr-4 flex-shrink-0">
            <img
              src={item.product.images[0]}
              alt={item.product.name}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          <div className="flex-1">
            <Link
              to={`/product/${item.product.id}`}
              className="font-medium hover:underline mb-1 block"
            >
              {item.product.name}
            </Link>
            <p className="text-sm text-muted-foreground mb-2">
              {item.product.frameType}, {item.product.frameMaterial},{" "}
              {item.product.color}
            </p>
            
            {/* Prescription lens option */}
           {item.lensOption && (
              <div className="mb-2 space-y-1">
              <div className="flex items-center text-sm text-primary">
                 <Check className="h-3 w-3 mr-1" />

         {item.lensOption.type === "prescription" 
        ? "Prescription Lens" 
        : "Standard Lens"}: {item.lensOption.option}
                 </div>

             {item.lensOption.type === "prescription" && item.lensOption.prescriptionId && (
                   <div className="text-xs text-muted-foreground pl-5">
        Prescription ID: <span className="font-medium">{item.lensOption.prescriptionId}</span>
                    </div>
                )} 
                  </div>
                 )}


            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveItem(item.product.id)}
              className="text-destructive hover:text-destructive/90 p-0 h-auto text-xs flex items-center"
            >
              <Trash2 className="h-3 w-3 mr-1" /> Remove
            </Button>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="md:col-span-2 flex justify-between md:block">
        <span className="md:hidden text-sm text-muted-foreground">Price:</span>
        <span className="text-center block w-full">
  LKR {Number(item.product.price).toFixed(2)}
</span>
      </div>

      {/* Quantity */}
      <div className="md:col-span-2 flex justify-between items-center md:justify-center">
        <span className="md:hidden text-sm text-muted-foreground">Quantity:</span>
        <div className="flex items-center border border-input rounded-md">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onQuantityChange(item.product.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="h-8 w-8 p-0"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onQuantityChange(item.product.id, item.quantity + 1)}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Total */}
      <div className="md:col-span-2 flex justify-between md:block">
        <span className="md:hidden text-sm text-muted-foreground">Total:</span>
        <div className="text-right font-semibold block w-full">
         LKR {(item.product.price * item.quantity).toFixed(2)}
          {item.lensOption && (
            <div className="text-xs text-muted-foreground">
              + LKR{(item.lensOption.price * item.quantity).toFixed(2)} (lens)
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
