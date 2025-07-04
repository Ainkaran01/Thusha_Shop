import type React from "react"
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"

interface ProductTableHeaderProps {
  onAddProduct: () => void
  searchTerm: string
  onSearchChange: (value: string) => void
}

const ProductTableHeader: React.FC<ProductTableHeaderProps> = ({ onAddProduct, searchTerm, onSearchChange }) => {
  return (
    <CardHeader className="flex flex-col space-y-4 pb-4">
      <div className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Product List</CardTitle>
          <CardDescription className="mt-1">Manage and search through your product inventory</CardDescription>
        </div>
        <Button onClick={onAddProduct} className="flex items-center gap-2 bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search Section */}
      <div className="flex items-center space-x-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search products by name, category..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 border border-input bg-background focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
        {searchTerm && (
          <Button variant="outline" size="sm" onClick={() => onSearchChange("")} className="px-3">
            Clear
          </Button>
        )}
      </div>
    </CardHeader>
  )
}

export default ProductTableHeader
