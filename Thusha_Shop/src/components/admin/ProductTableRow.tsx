import type React from "react"
import { useState } from "react"
import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Pencil, Trash } from "lucide-react"
import EditProductForm from "./EditProductForm"
import type { Product } from "@/types/product"

interface ProductTableRowProps {
  product: Product
  index: number
  onUpdateStock: (productId: number, newStock: number) => Promise<void> | void
  onDeleteProduct: (productId: number) => Promise<void> | void
  onUpdateProduct: (id: number, productData: FormData) => Promise<Product>
}

const ProductTableRow: React.FC<ProductTableRowProps> = ({
  product,
  index,
  onUpdateStock,
  onDeleteProduct,
  onUpdateProduct,
}) => {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const MEDIA_URL = "http://localhost:8000/media/"

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
            onDeleteProduct(product.id)
            toast({
              title: "Product Deleted",
              description: "The product has been removed.",
            })
          }}
        >
          Confirm
        </Button>
      ),
    })
  }

  const handleEditSuccess = () => {
    setIsEditing(false)
    toast({
      title: "Success",
      description: "Product updated successfully",
    })
  }

  if (isEditing) {
    return (
      <TableRow>
        <TableCell colSpan={9} className="p-0">
          <div className="p-4 bg-muted/20">
            <EditProductForm product={product} onCancel={() => setIsEditing(false)} onSuccess={handleEditSuccess} />
          </div>
        </TableCell>
      </TableRow>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      <TableCell className="font-medium text-sm">#{String(index + 1).padStart(3, "0")}</TableCell>
      <TableCell className="font-medium">
        <div className="max-w-[200px] truncate" title={product.name}>
          {product.name}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          {product.images?.length > 0 ? (
            <div className="relative">
              <img
                src={product.images[0].startsWith("http") ? product.images[0] : `${MEDIA_URL}${product.images[0]}`}
                alt={product.name}
                className="w-12 h-12 object-cover rounded-md border border-border shadow-sm"
              />
              {product.images.length > 1 && (
                <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  +{product.images.length - 1}
                </div>
              )}
            </div>
          ) : (
            <div className="w-12 h-12 bg-muted rounded-md border border-border flex items-center justify-center">
              <span className="text-xs text-muted-foreground">No img</span>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
          {product.category?.name || "Uncategorized"}
        </span>
      </TableCell>
      <TableCell className="font-semibold">{formatPrice(product.price)}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <span
            className={`font-medium ${
              product.stock < 10 ? "text-destructive" : product.stock < 50 ? "text-yellow-600" : "text-green-600"
            }`}
          >
            {product.stock}
          </span>
          {product.stock < 10 && <AlertTriangle className="h-4 w-4 text-destructive" />}
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">{product.sold || 0}</TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdateStock(product.id, product.stock + 10)}
          disabled={product.stock >= 1000}
          className="text-xs"
        >
          +10 Stock
        </Button>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-center space-x-1">
          <Button size="sm" variant="outline" onClick={() => setIsEditing(true)} className="h-8 w-8 p-0">
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent"
          >
            <Trash className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

export default ProductTableRow
