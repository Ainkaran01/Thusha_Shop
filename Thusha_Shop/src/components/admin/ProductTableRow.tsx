
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  stock: number;
  sold: number;
  category: string;
  price: number;
}

interface ProductTableRowProps {
  product: Product;
  onUpdateStock: (productId: number, newStock: number) => void;
  onDeleteProduct: (productId: number) => void;
}

const ProductTableRow: React.FC<ProductTableRowProps> = ({ 
  product, 
  onUpdateStock, 
  onDeleteProduct 
}) => {
  const { toast } = useToast();

  return (
    <TableRow key={product.id}>
      <TableCell>{product.id}</TableCell>
      <TableCell>{product.name}</TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell>${product.price}</TableCell>
      <TableCell>
        <div className="flex items-center">
          <span className={product.stock < 10 ? 'text-destructive' : ''}>{product.stock}</span>
          {product.stock < 10 && (
            <AlertTriangle className="h-4 w-4 text-destructive ml-2" />
          )}
        </div>
      </TableCell>
      <TableCell>{product.sold}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onUpdateStock(product.id, product.stock + 10)}
          >
            Add Stock
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">More</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                toast({
                  title: "Edit Product",
                  description: "Product editor would open here",
                });
              }}>
                Edit Product
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDeleteProduct(product.id)} className="text-destructive">
                Delete Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ProductTableRow;
