
import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";

interface ShopIconsProps {
  handleWishlistNavigation: (e: React.MouseEvent) => void;
  handleCartNavigation: (e: React.MouseEvent) => void;
}

const ShopIcons: React.FC<ShopIconsProps> = ({
  handleWishlistNavigation,
  handleCartNavigation,
}) => {
  const { getItemCount } = useCart();
  const { isAuthenticated } = useUser();

  return (
    <>
      <Button variant="ghost" size="icon" asChild className="relative group">
        <Link to="/wishlist" onClick={handleWishlistNavigation}>
          <Heart className="h-5 w-5 transition-colors group-hover:text-destructive group-hover:fill-destructive" />
        </Link>
      </Button>

      <Button variant="ghost" size="icon" asChild className="relative">
        <Link to="/cart" onClick={handleCartNavigation}>
          <ShoppingCart className="h-5 w-5" />
          {getItemCount() > 0 && isAuthenticated && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs"
            >
              {getItemCount()}
            </Badge>
          )}
        </Link>
      </Button>
    </>
  );
};

export default ShopIcons;
