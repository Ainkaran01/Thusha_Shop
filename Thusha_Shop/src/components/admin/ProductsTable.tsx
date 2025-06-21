import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import AddProductForm from "./AddProductForm";
import ProductTableHeader from "./ProductTableHeader";
import ProductTableRow from "./ProductTableRow";
import CategoryTable from "./CategoryTable";
import FrameTypesTable from "./FrameTypeTable";
import AccessoryTable from "./AccessoryTable";
import { Product } from "@/types/product";
import { Accessory } from "@/types/accessory";



interface ProductsTableProps {
  products: Product[];
  onUpdateStock: (productId: number, newStock: number) => void;
  onDeleteProduct: (productId: number) => void;
  onAddProduct: (productData: FormData) => Promise<Product>;
  onUpdateProduct: (id: number, productData: FormData) => Promise<Product>;

  accessories: Accessory[];
  onUpdateAccessoryStock: (accessoryId: number, newStock: number) => void;
  onDeleteAccessory: (accessoryId: number) => void;
  onAddAccessory: (accessoryData: FormData) => Promise<Accessory>;
  onUpdateAccessory: (id: number, accessoryData: FormData) => Promise<Accessory>;

}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  onUpdateStock,
  onDeleteProduct,
  onAddProduct,
  onUpdateProduct,

  accessories,
  onUpdateAccessoryStock,
  onDeleteAccessory,
  onAddAccessory,
  onUpdateAccessory
}) => {
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);

  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Product Management</CardTitle>
        <CardDescription>
          Manage your product inventory, categories, and pricing
        </CardDescription>
      </CardHeader>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="frames">Frames</TabsTrigger>
           <TabsTrigger value="accessories">Accessories</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          {showAddForm ? (
           <AddProductForm onCancel={() => setShowAddForm(false)} />

          ) : (
            <>
              <ProductTableHeader onAddProduct={() => setShowAddForm(true)} />
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left">ID</th>
                          <th className="px-4 py-2 text-left">Product</th>
                          <th className="px-4 py-2 text-left">Image</th>
                          <th className="px-4 py-2 text-left">Category</th>
                          <th className="px-4 py-2 text-left">Price</th>
                          <th className="px-4 py-2 text-left">Stock</th>
                          <th className="px-4 py-2 text-left">Sold</th>
                          <th className="px-4 py-2 text-left"></th>
                          <th className="px-4 py-2 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product,index) => (
                        <ProductTableRow
                          key={product.id}
                          product={product}
                          index={index}
                          onUpdateStock={onUpdateStock}
                          onDeleteProduct={onDeleteProduct}
                          onUpdateProduct={onUpdateProduct}
                        />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </TabsContent>

        <TabsContent value="categories">
          <CategoryTable />
        </TabsContent>

        <TabsContent value="frames">
          <FrameTypesTable />
        </TabsContent>

        <TabsContent value="accessories">
          <AccessoryTable 
            accessories={accessories}
            onUpdateStock={onUpdateAccessoryStock}
            onDeleteAccessory={onDeleteAccessory}
            onAddAccessory={onAddAccessory}
            onUpdateAccessory={onUpdateAccessory}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ProductsTable;
