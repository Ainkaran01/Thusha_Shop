
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  stock: number;
  sold: number;
  category: string;
  price: number;
}

interface ProductInventoryProps {
  products: Product[];
  onManageInventory: () => void;
}

const ProductInventory: React.FC<ProductInventoryProps> = ({ products, onManageInventory }) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Product Inventory</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.slice(0, 5).map((product) => (
            <div key={product.id} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">{product.sold} sold</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{product.stock} in stock</p>
                <p className={`text-sm ${product.stock < 10 ? 'text-destructive' : 'text-primary'}`}>
                  {product.stock < 10 ? 'Low stock' : 'In stock'}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4" onClick={onManageInventory}>Manage Inventory</Button>
      </CardContent>
    </Card>
  );
};

export default ProductInventory;
