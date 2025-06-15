
import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ProductCard from "./ProductCard";
import { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  hasActiveFilters,
  onClearFilters,
}) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-2xl font-bold mb-2">No products found</h3>
        <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms</p>
        <Button onClick={onClearFilters}>Clear Filters</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-muted-foreground">
          Showing {products.length} results
        </p>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={onClearFilters} className="flex items-center gap-1">
            <X className="h-4 w-4" /> Clear Filters
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
