
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import AddProductForm from "./AddProductForm";
import ProductTableHeader from "./ProductTableHeader";
import ProductTableRow from "./ProductTableRow";

interface Product {
  id: number;
  name: string;
  stock: number;
  sold: number;
  category: string;
  price: number;
}

interface ProductsTableProps {
  products: Product[];
  onUpdateStock: (productId: number, newStock: number) => void;
  onDeleteProduct: (productId: number) => void;
  onAddProduct: (product: Omit<Product, "id" | "sold">) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({ 
  products, 
  onUpdateStock, 
  onDeleteProduct,
  onAddProduct
}) => {
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddProduct = (productData: Omit<Product, "id" | "sold">) => {
    onAddProduct(productData);
    setShowAddForm(false);
    toast({
      title: "Product Added",
      description: "The product has been added successfully.",
    });
  };

  if (showAddForm) {
    return (
      <AddProductForm 
        onAddProduct={handleAddProduct} 
        onCancel={() => setShowAddForm(false)} 
      />
    );
  }

  return (
    <Card>
      <ProductTableHeader onAddProduct={() => setShowAddForm(true)} />
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Sold</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <ProductTableRow
                    key={product.id}
                    product={product}
                    onUpdateStock={onUpdateStock}
                    onDeleteProduct={onDeleteProduct}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductsTable;
