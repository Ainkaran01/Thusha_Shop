
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import CartItem from "./CartItem";
import { CartItem as CartItemType } from "@/types/cart";

interface CartItemListProps {
  cartItems: CartItemType[];
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
}

const CartItemList: React.FC<CartItemListProps> = ({
  cartItems,
  onQuantityChange,
  onRemoveItem,
  onClearCart,
}) => {
  return (
    <div className="bg-background rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClearCart}>
            <Trash2 className="h-4 w-4 mr-1" /> Clear Cart
          </Button>
        </div>

        {/* Cart items table header */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 mb-2 border-b pb-2">
          <div className="md:col-span-6 font-medium">Product</div>
          <div className="md:col-span-2 font-medium text-center">Price</div>
          <div className="md:col-span-2 font-medium text-center">Quantity</div>
          <div className="md:col-span-2 font-medium text-right">Total</div>
        </div>

        <div className="space-y-4">
          {cartItems.map((item) => (
            <CartItem
              key={item.product.id}
              item={item}
              onQuantityChange={onQuantityChange}
              onRemoveItem={onRemoveItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartItemList;
