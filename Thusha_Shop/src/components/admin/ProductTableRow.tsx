import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertTriangle, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash } from "lucide-react";
import EditProductForm from "./EditProductForm";
import { Product } from "@/types/product";

// Adjusted type to fix category error

interface ProductTableRowProps {
  product: Product;
  index: number;
  onUpdateStock: (productId: number, newStock: number) => Promise<void> | void;
  onDeleteProduct: (productId: number) => Promise<void> | void;
  onUpdateProduct: (id: number, productData: FormData) => Promise<Product>;
}

const ProductTableRow: React.FC<ProductTableRowProps> = ({
  product,
  index,
  onUpdateStock,
  onDeleteProduct,
  onUpdateProduct,
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const MEDIA_URL = "http://localhost:8000/media/";
  const handleDelete = () => {
    toast({
      title: "Confirm Deletion",
      description: "Are you sure you want to delete this product?",
      variant: "destructive",
      action: (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            onDeleteProduct(product.id);
            toast({
              title: "Product Deleted",
              description: "The product has been removed.",
            });
          }}
        >
          Confirm
        </Button>
      ),
    });
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Product updated successfully",
    });
  };

  if (isEditing) {
    return (
      <TableRow>
        <TableCell colSpan={9}>
          <EditProductForm
            product={product}
            onCancel={() => setIsEditing(false)}
            onSuccess={handleEditSuccess}
          />
        </TableCell>
      </TableRow>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  console.log("Full product data:", product);
  console.log("Images array:", product.images);
  return (
    <TableRow key={product.id}>
      <TableCell className="font-medium">{index + 1}</TableCell>
      <TableCell className="whitespace-nowrap">{product.name}</TableCell>

      <TableCell className="whitespace-nowrap">
        <div className="flex items-center space-x-3">
          {product.images?.length > 0 && (
            <img
              src={
                product.images[0].startsWith("http")
                  ? product.images[0]
                  : `${MEDIA_URL}${product.images[0]}`
              }
              alt={product.name}
              className="w-10 h-10 object-cover rounded"
            />
          )}
        </div>
      </TableCell>
      <TableCell>{product.category?.name}</TableCell>
      <TableCell>{formatPrice(product.price)}</TableCell>
      <TableCell>
        <div className="flex items-center">
          <span
            className={product.stock < 10 ? "text-destructive font-medium" : ""}
          >
            {product.stock}
          </span>
          {product.stock < 10 && (
            <AlertTriangle className="h-4 w-4 text-destructive ml-2" />
          )}
        </div>
      </TableCell>
      <TableCell>0{product.sold}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateStock(product.id, product.stock + 10)}
            disabled={product.stock >= 1000}
          >
            Add Stock
          </Button>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <div className="flex justify-end space-x-2 ">
            <Button
              size="sm"
              onClick={() => setIsEditing(true)}
              className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
            >
              <Pencil className="w-3 h-4" />
              Edit
            </Button>

            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash className="w-2 h-4 " />
              Delete
            </Button>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ProductTableRow;
