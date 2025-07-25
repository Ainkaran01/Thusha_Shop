import { apiClient } from "@/lib/api-clients"
import { useState, useEffect, useRef, forwardRef } from "react"
import { Search, ShoppingCart, User, CreditCard, Banknote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/types/product"
import { fetchProducts } from "@/api/products"
import { useToast } from "@/hooks/use-toast"

interface CartItem extends Product {
  quantity: number
}

interface PointOfSaleProps {
  products: Product[]
}

const BillToPrint = forwardRef<any, any>(
  ({ cart, customerName, phoneNumber, email, paymentMethod, subtotal, tax, total }, ref) => {
    const currentDate = new Date().toLocaleDateString()
    const currentTime = new Date().toLocaleTimeString()
    const billNumber = `BILL-${Date.now()}`

    const styles = {
      container: {
        padding: "16px",
        width: "80mm",
        color: "#000",
        backgroundColor: "#fff",
        fontFamily: "monospace",
        fontSize: "12px",
        lineHeight: "1.2",
        margin: "0",
      },
      header: {
        textAlign: "center" as const,
        borderBottom: "2px dashed #666",
        paddingBottom: "12px",
        marginBottom: "12px",
      },
      title: {
        fontSize: "16px",
        fontWeight: "bold",
        margin: "0 0 4px 0",
      },
      subtitle: {
        fontSize: "10px",
        margin: "2px 0",
      },
      billInfo: {
        marginBottom: "12px",
        fontSize: "10px",
      },
      row: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "2px",
      },
      customerSection: {
        borderBottom: "1px dashed #666",
        paddingBottom: "8px",
        marginBottom: "12px",
      },
      sectionTitle: {
        fontWeight: "bold",
        fontSize: "10px",
        marginBottom: "4px",
      },
      itemsHeader: {
        borderBottom: "1px solid #666",
        paddingBottom: "4px",
        marginBottom: "8px",
      },
      itemsHeaderRow: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "10px",
        fontWeight: "bold",
      },
      itemRow: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "10px",
        marginBottom: "4px",
        alignItems: "flex-start",
      },
      itemName: {
        width: "50%",
        paddingRight: "4px",
        wordBreak: "break-word" as const,
      },
      itemQty: {
        width: "16.66%",
        textAlign: "center" as const,
      },
      itemRate: {
        width: "16.66%",
        textAlign: "center" as const,
      },
      itemAmount: {
        width: "16.66%",
        textAlign: "right" as const,
        fontWeight: "bold",
      },
      totalsSection: {
        borderTop: "2px dashed #666",
        paddingTop: "8px",
        marginTop: "12px",
      },
      totalRow: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "10px",
        marginBottom: "4px",
      },
      grandTotal: {
        borderTop: "1px solid #666",
        paddingTop: "4px",
        marginTop: "4px",
      },
      grandTotalRow: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "12px",
        fontWeight: "bold",
      },
      footer: {
        textAlign: "center" as const,
        marginTop: "16px",
        paddingTop: "12px",
        borderTop: "1px dashed #666",
      },
      footerText: {
        fontSize: "10px",
        margin: "2px 0",
      },
      footerBold: {
        fontSize: "10px",
        fontWeight: "bold",
        margin: "4px 0",
      },
      barcode: {
        textAlign: "center" as const,
        marginTop: "12px",
      },
      barcodeLines: {
        display: "inline-flex",
        gap: "1px",
      },
      barcodeLine: {
        width: "1px",
        backgroundColor: "#000",
      },
      barcodeText: {
        fontSize: "10px",
        marginTop: "4px",
      },
    }

    return (
      <div ref={ref} style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>THUSHA OPTICALS</h1>
          <p style={styles.subtitle}>544 Hospital Rd, Jaffna</p>
          <p style={styles.subtitle}>Phone: +94 21 222 3461</p>
          <p style={styles.subtitle}>Email: info@thushaoptical.com</p>
        </div>

        {/* Bill Info */}
        <div style={styles.billInfo}>
          <div style={styles.row}>
            <span>Bill No:</span>
            <span style={{ fontWeight: "bold" }}>{billNumber}</span>
          </div>
          <div style={styles.row}>
            <span>Date:</span>
            <span>{currentDate}</span>
          </div>
          <div style={styles.row}>
            <span>Time:</span>
            <span>{currentTime}</span>
          </div>
        </div>

        {/* Customer Info */}
        <div style={styles.customerSection}>
          <p style={styles.sectionTitle}>CUSTOMER DETAILS:</p>
          <p style={styles.subtitle}>Name: {customerName}</p>
          <p style={styles.subtitle}>Phone: {phoneNumber}</p>
          {email && <p style={styles.subtitle}>Email: {email}</p>}
          <p style={styles.subtitle}>Payment: {paymentMethod.toUpperCase()}</p>
        </div>

        {/* Items Header */}
        <div style={styles.itemsHeader}>
          <div style={styles.itemsHeaderRow}>
            <span style={{ width: "50%" }}>ITEM</span>
            <span style={{ width: "16.66%", textAlign: "center" }}>QTY</span>
            <span style={{ width: "16.66%", textAlign: "center" }}>RATE</span>
            <span style={{ width: "16.66%", textAlign: "right" }}>AMOUNT</span>
          </div>
        </div>

        {/* Items */}
        <div style={{ marginBottom: "12px" }}>
          {cart.map((item: CartItem) => (
            <div key={item.id} style={styles.itemRow}>
              <span style={styles.itemName}>
                {item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name}
              </span>
              <span style={styles.itemQty}>{item.quantity}</span>
              <span style={styles.itemRate}>{item.price}</span>
              <span style={styles.itemAmount}>{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div style={styles.totalsSection}>
          <div style={styles.totalRow}>
            <span>Sub Total:</span>
            <span style={{ fontWeight: "bold" }}>Rs. {subtotal.toFixed(2)}</span>
          </div>
          <div style={styles.totalRow}>
            <span>Tax (5%):</span>
            <span style={{ fontWeight: "bold" }}>Rs. {tax.toFixed(2)}</span>
          </div>
          <div style={styles.grandTotal}>
            <div style={styles.grandTotalRow}>
              <span>TOTAL:</span>
              <span>Rs. {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerBold}>THANK YOU FOR YOUR BUSINESS!</p>
          <p style={styles.footerText}>Visit us again!</p>
          <p style={styles.footerText}>*** COMPUTER GENERATED BILL ***</p>
        </div>

        {/* Barcode placeholder */}
        <div style={styles.barcode}>
          <div style={styles.barcodeLines}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                style={{
                  ...styles.barcodeLine,
                  height: Math.random() > 0.5 ? "32px" : "24px",
                }}
              />
            ))}
          </div>
          <p style={styles.barcodeText}>{billNumber}</p>
        </div>
      </div>
    )
  },
)

BillToPrint.displayName = "BillToPrint"

export default function PointOfSale({ products: initialProducts }: PointOfSaleProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [customerName, setCustomerName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const printRef = useRef<HTMLDivElement>(null)
  const [billData, setBillData] = useState<{
    cart: CartItem[]
    customerName: string
    phoneNumber: string
    email: string
    paymentMethod: string
    subtotal: number
    tax: number
    total: number
  } | null>(null)

  const { toast } = useToast()

  const refreshProducts = async () => {
    try {
      const data = await fetchProducts()
      setProducts(data)
    } catch (err) {
      // Optionally handle error
    }
  }

  const addToCart = (product: Product) => {
    if (product.stock === 0) return
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId)
      return
    }
    setCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
    setCustomerName("")
    setPhoneNumber("")
    setEmail("")
  }

  const handleCompleteBilling = async () => {
    if (!customerName || !phoneNumber) {
      toast({
        title: "Missing Customer Info",
        description: "Please enter customer name and phone number.",
        variant: "destructive",
      })
      return
    }

    const hasInvalidQuantity = cart.some((item) => {
      const original = products.find((p) => p.id === item.id)
      return !original || item.quantity > original.stock
    })

    if (hasInvalidQuantity) {
      toast({
        title: "Invalid Quantity",
        description: "One or more items in the cart exceed available stock.",
        variant: "destructive",
      })
      return
    }

    const payload = {
      customer_name: customerName,
      phone_number: phoneNumber,
      email: email,
      payment_method: paymentMethod,
      total_amount: Number(total).toFixed(2),
      items: cart.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        price: Number(item.price).toFixed(2),
      })),
    }

    try {
      const res = await apiClient.post("/api/pointofsales/create/", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      // Update local products state to reflect stock changes
      setProducts((prevProducts) =>
        prevProducts.map((product) => {
          const cartItem = cart.find((item) => item.id === product.id)
          if (cartItem) {
            return {
              ...product,
              stock: product.stock - cartItem.quantity,
            }
          }
          return product
        }),
      )

      setBillData({
        cart,
        customerName,
        phoneNumber,
        email,
        paymentMethod,
        subtotal,
        tax,
        total,
      })

      setTimeout(() => {
        if (printRef.current) {
          const printContent = printRef.current
          const printWindow = window.open("", "_blank")
          if (printWindow) {
            printWindow.document.write(`
              <!DOCTYPE html>
              <html>
                <head>
                  <title>Print Bill - ${billData?.customerName || customerName}</title>
                  <meta charset="UTF-8">
                  <style>
                    * {
                      margin: 0;
                      padding: 0;
                      box-sizing: border-box;
                    }
                    body {
                      font-family: 'Courier New', monospace;
                      font-size: 12px;
                      line-height: 1.2;
                      color: #000;
                      background: #fff;
                    }
                    @media print {
                      body { 
                        margin: 0; 
                        padding: 0;
                      }
                      @page { 
                        margin: 5mm;
                        size: 80mm auto;
                      }
                    }
                    @media screen {
                      body {
                        padding: 20px;
                        background: #f5f5f5;
                      }
                    }
                  </style>
                </head>
                <body>
                  ${printContent.innerHTML}
                </body>
              </html>
            `)
            printWindow.document.close()
            printWindow.focus()

            // Add a small delay before printing to ensure content is loaded
            setTimeout(() => {
              printWindow.print()
              printWindow.onafterprint = () => {
                printWindow.close()
              }
            }, 250)
          }
        }
      }, 500)

      toast({
        title: "Success!",
        description: "Billing completed successfully and bill is being printed.",
      })
      clearCart()
    } catch (err: any) {
      const message = err.response?.data?.detail || err.response?.data?.message || err.message
      toast({
        title: "Billing Failed",
        description: message,
        variant: "destructive",
      })
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const normalizedCategory = product.category?.name.toLowerCase().replace(/\s+/g, "")
    const isEyeGlassCategory = [
      "eyeglass",
      "eyeglasses",
      "eyeglasss",
      "eyeglasse",
      "eyeglasseses",
      "eyeglassess",
      "eyeglass ",
      "eyeglass.",
    ].includes(normalizedCategory || "")
    const isNotEyeGlass = !isEyeGlassCategory
    const matchesCategory =
      selectedCategory === "all" || product.category?.name.toLowerCase() === selectedCategory.toLowerCase()

    return matchesSearch && matchesCategory && isNotEyeGlass
  })

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.05
  const total = subtotal + tax

  // Extract unique categories for filter dropdown
  const categories = Array.from(
    new Set(
      products
        .map((p) => p.category?.name)
        .filter((name): name is string => {
          if (!name) return false
          const normalized = name.toLowerCase().replace(/\s+/g, "")
          return !["eyeglass", "eyeglasses"].includes(normalized)
        }),
    ),
  )

  useEffect(() => {
    refreshProducts()
  }, [])

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900">Point of Sale</h1>
          <p className="text-gray-600">Process sales and manage transactions</p>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Side - Products */}
          <div className="flex-1 p-6 overflow-hidden">
            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category || ""}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Product Grid */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto"
              style={{ height: "calc(100vh - 200px)" }}
            >
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className={`cursor-pointer transition-all hover:shadow-md h-fit ${
                    product.stock === 0 ? "opacity-50" : ""
                  }`}
                  onClick={() => addToCart(product)}
                >
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      {/* Product Image */}
                      {product.images && product.images.length > 0 && (
                        <div className="w-full h-32 overflow-hidden rounded-lg bg-gray-100">
                          <img
                            src={product.images[0] || "/placeholder.svg?height=128&width=200"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      {/* Product Info */}
                      <div className="space-y-1">
                        <h3 className="font-medium text-sm text-gray-900 line-clamp-2 leading-tight">{product.name}</h3>
                        <p className="text-xs text-gray-500 leading-tight">
                          {product.description.split(" ").slice(0, 3).join(" ")}...
                        </p>
                      </div>
                      <div className="flex items-start justify-between pt-1 gap-2">
                      {/* Price */}
                      <div className="text-left leading-tight">
                        <div className="text-xs text-blue-600 font-semibold">Rs.</div>
                        <div className="text-sm text-blue-700 font-bold break-words max-w-[100px]">
                          {product.price}
                        </div>
                      </div>

                      {/* Stock Badge */}
                      <div className="text-right mt-1 flex-shrink-0">
                        {product.stock === 0 ? (
                          <Badge variant="destructive" className="text-xs px-2 py-1 whitespace-nowrap">
                            OUT OF STOCK
                          </Badge>
                        ) : product.stock <= 5 ? (
                          <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 whitespace-nowrap">
                            {product.stock} left
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs px-2 py-1 whitespace-nowrap">
                            {product.stock} in stock
                          </Badge>
                        )}
                      </div>
                    </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Side - Billing */}
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
            {/* Billing Header */}
            <div className="bg-yellow-500 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-medium">Billing Cart</span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">Rs. {total.toFixed(2)}</div>
                  <div className="text-sm opacity-90">Total Amount</div>
                </div>
              </div>
              <div className="text-sm opacity-90 mt-1">{cart.length} items</div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 min-h-0">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Cart is empty</p>
                  <p className="text-gray-400 text-sm">Add products to start billing</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      {item.images && item.images.length > 0 && (
                        <img
                          src={item.images[0] || "/placeholder.svg?height=48&width=48"}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-gray-500">Rs. {item.price}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-6 h-6 p-0 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-6 h-6 p-0 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700 p-0 h-auto"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Customer Details */}
            <div className="p-4 border-t border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-gray-600" />
                <h3 className="font-medium text-gray-900">Customer Details</h3>
              </div>
              <div className="space-y-3">
                <Input
                  placeholder="Customer Name *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <Input
                  placeholder="Phone Number *"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Input placeholder="Email (Optional)" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            {/* Payment Method */}
            <div className="p-4 border-t border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-gray-600" />
                <h3 className="font-medium text-gray-900">Payment Method</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={paymentMethod === "cash" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPaymentMethod("cash")}
                  className="flex items-center gap-2"
                >
                  <Banknote className="w-4 h-4" />
                  Cash
                </Button>
                <Button
                  variant={paymentMethod === "card" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPaymentMethod("card")}
                  className="flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Card
                </Button>
              </div>
            </div>

            {/* Billing Summary */}
            <div className="p-4 border-t border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
                <h3 className="font-medium text-gray-900">Billing Summary</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Items ({cart.length}):</span>
                  <span>Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5%):</span>
                  <span>Rs. {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t">
                  <span>Total Amount:</span>
                  <span>Rs. {total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-gray-200 space-y-3 flex-shrink-0">
              <Button
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                disabled={cart.length === 0}
                onClick={handleCompleteBilling}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Complete Billing - Rs. {total.toFixed(2)}
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={clearCart}>
                Clear Cart & Start New
              </Button>
            </div>
          </div>
        </div>
      </div>

      {billData && (
        <div style={{ display: "none" }}>
          <BillToPrint
            ref={printRef}
            cart={billData.cart}
            customerName={billData.customerName}
            phoneNumber={billData.phoneNumber}
            email={billData.email}
            paymentMethod={billData.paymentMethod}
            subtotal={billData.subtotal}
            tax={billData.tax}
            total={billData.total}
          />
        </div>
      )}
    </>
  )
}
