import type React from "react";
import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import AddProductForm from "./AddProductForm";
import ProductTableHeader from "./ProductTableHeader";
import ProductTableRow from "./ProductTableRow";
import CategoryTable from "./CategoryTable";
import FrameTypesTable from "./FrameTypeTable";
import type { Product } from "@/types/product";
import { Package } from "lucide-react";
interface ProductsTableProps {
  products: Product[];
  onUpdateStock: (productId: number, newStock: number) => void;
  onDeleteProduct: (productId: number) => void;
  onAddProduct: (productData: FormData) => Promise<Product>;
  onUpdateProduct: (id: number, productData: FormData) => Promise<Product>;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  onUpdateStock,
  onDeleteProduct,
  onAddProduct,
  onUpdateProduct,
}) => {
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return products;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    return products.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(searchLower);
      const categoryMatch = product.category?.name
        ?.toLowerCase()
        .includes(searchLower);
      const idMatch = product.id.toString().includes(searchLower);

      return nameMatch || categoryMatch || idMatch;
    });
  }, [products, searchTerm]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent flex items-center gap-2">
          <Package className="h-7 w-7 text-yellow-600" />
          Product Management
        </CardTitle>

        <CardDescription className="text-gray-600 mt-1">
          Manage your product inventory, categories, and pricing
        </CardDescription>
      </CardHeader>
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="mx-4 mt-2 grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="products" className="text-sm font-medium">
            Products
          </TabsTrigger>
          <TabsTrigger value="categories" className="text-sm font-medium">
            Categories
          </TabsTrigger>
          <TabsTrigger value="frames" className="text-sm font-medium">
            Frames
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-0">
          {showAddForm ? (
            <div className="p-4">
              <AddProductForm onCancel={() => setShowAddForm(false)} />
            </div>
          ) : (
            <>
              <ProductTableHeader
                onAddProduct={() => setShowAddForm(true)}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
              />
              <CardContent className="pt-0">
                {/* Search Results Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-sm">
                      {filteredProducts.length} of {products.length} products
                    </Badge>
                    {searchTerm && (
                      <Badge variant="outline" className="text-sm">
                        Filtered by: "{searchTerm}"
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-border overflow-hidden bg-card">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white">
                        <tr className="border-b border-border">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground text-white">
                            ID
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground text-white">
                            Product
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground text-white">
                            Image
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground text-white">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground text-white">
                            Price
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground text-white">
                            Stock
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground text-white">
                            Stock Actions
                          </th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-muted-foreground text-white">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product, index) => (
                            <ProductTableRow
                              key={product.id}
                              product={product}
                              index={index}
                              onUpdateStock={onUpdateStock}
                              onDeleteProduct={onDeleteProduct}
                              onUpdateProduct={onUpdateProduct}
                            />
                          ))
                        ) : (
                          <tr>
                            <td colSpan={9} className="px-4 py-8 text-center">
                              <div className="flex flex-col items-center space-y-2">
                                <div className="text-muted-foreground text-sm">
                                  {searchTerm ? (
                                    <>
                                      No products found matching "{searchTerm}"
                                      <br />
                                      <button
                                        onClick={() => setSearchTerm("")}
                                        className="text-primary hover:underline mt-1"
                                      >
                                        Clear search to see all products
                                      </button>
                                    </>
                                  ) : (
                                    "No products available"
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
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
      </Tabs>
    </Card>
  );
};

export default ProductsTable;
