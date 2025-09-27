import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  Eye,
  Clock,
  CheckCircle,
  X,
  Search,
  Filter,
  Settings,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Order,
  OrderStatus,
  fetchOrders,
  updateOrderStatus,
  fetchPrescriptionDetails,
  Prescription,
} from "@/api/orders";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import PasswordChangeForm from "@/components/account/PasswordChangeForm";

const ManufacturerDashboard = () => {
  const { toast } = useToast();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [orderToMarkReady, setOrderToMarkReady] = useState<Order | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [prescriptionDetails, setPrescriptionDetails] = useState<
    Record<number, Prescription>
  >({});
  const [loadingPrescriptions, setLoadingPrescriptions] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch orders",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  // Function to load prescription details
  const loadPrescriptionDetails = async (prescriptionId: number) => {
    if (
      prescriptionDetails[prescriptionId] ||
      loadingPrescriptions[prescriptionId]
    ) {
      return; // Already loaded or loading
    }

    setLoadingPrescriptions((prev) => ({ ...prev, [prescriptionId]: true }));

    try {
      const prescription = await fetchPrescriptionDetails(prescriptionId);
      setPrescriptionDetails((prev) => ({
        ...prev,
        [prescriptionId]: prescription,
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch prescription details",
        variant: "destructive",
      });
    } finally {
      setLoadingPrescriptions((prev) => ({ ...prev, [prescriptionId]: false }));
    }
  };

  // Load prescription details when an order is selected
  useEffect(() => {
    if (selectedOrder) {
      selectedOrder.items.forEach((item) => {
        if (item.prescription && !prescriptionDetails[item.prescription]) {
          loadPrescriptionDetails(item.prescription);
        }
      });
    }
  }, [selectedOrder, prescriptionDetails]);

  const handleUpdateOrderStatus = async (
    orderNumber: string,
    newStatus: OrderStatus
  ) => {
    setUpdatingOrderId(orderNumber);
    try {
      if (newStatus !== "processing" && newStatus !== "pending") {
        toast({
          title: "Action Not Allowed",
          description:
            "Manufacturers can only mark orders as Processing or Ready to Deliver",
          variant: "destructive",
        });
        return;
      }
      const updatedOrder = await updateOrderStatus(orderNumber, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order.order_number === orderNumber
            ? { ...order, status: newStatus }
            : order
        )
      );

      toast({
        title: "Order Updated",
        description: `Order ${orderNumber} status updated to ${newStatus.replace(
          "_",
          " "
        )}`,
      });
      if (selectedOrder?.order_number === orderNumber) {
        setSelectedOrder(updatedOrder);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter and search logic
  const filteredOrders = orders.filter((order) => {
    // Status filter
    const statusMatch = statusFilter === "all" || order.status === statusFilter;
    // Date filter
    let dateMatch = true;
    if (dateFilter !== "all" && order.created_at) {
      const orderDate = new Date(order.created_at);
      const today = new Date();
      if (dateFilter === "today") {
        dateMatch = orderDate.toDateString() === today.toDateString();
      } else if (dateFilter === "week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);
        dateMatch = orderDate >= oneWeekAgo;
      } else if (dateFilter === "month") {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);
        dateMatch = orderDate >= oneMonthAgo;
      }
    }
    // Search term
    const searchMatch =
      searchTerm === "" ||
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.billing?.name &&
        order.billing.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.billing?.email &&
        order.billing.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.items?.some(
        (item) =>
          item.product_name &&
          item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return statusMatch && dateMatch && searchMatch;
  });

  // Filter active orders that manufacturers should see (not delivered/cancelled)
  const activeOrders = filteredOrders.filter(
    (order) => order && ["pending", "processing"].includes(order.status)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-lg font-medium text-muted-foreground">
                Loading orders...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleMarkReadyClick = (order: Order) => {
    setOrderToMarkReady(order);
  };

  const handleConfirmMarkReady = async () => {
    if (orderToMarkReady) {
      await handleUpdateOrderStatus(
        orderToMarkReady.order_number,
        "processing"
      );
      setOrderToMarkReady(null);
      if (selectedOrder?.order_number === orderToMarkReady.order_number) {
        setSelectedOrder(null);
      }
    }
  };

  const handleCancelMarkReady = () => {
    setOrderToMarkReady(null);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header Section */}
        <div className="bg-white relative rounded-xl border shadow-sm p-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-3">
              Manufacturer Dashboard
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Manage eyeglass production and prepare orders for delivery with
              precision and efficiency
            </p>
          </div>

          <button
            onClick={() => setShowPasswordModal(true)}
            className="absolute top-4 right-4 text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <Settings className="h-4 w-4" />
            Change Password
          </button>
        </div>

        {showPasswordModal && (
          <div className="fixed inset-x-0 top-16 bottom-0 z-50 bg-white/100 backdrop-blur-sm overflow-y-auto">
            <div className="container mx-auto px-6 py-8">
              {/* Close Button */}
              <div className="flex justify-end mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex items-center gap-2 text-muted-foreground bg-yellow-100 hover:bg-yellow-500"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>

              {/* Password Change Form Card */}
              <Card className="w-full max-w-2xl mx-auto shadow-xl border border-gray-200">
                <CardHeader className="border-b px-6 py-4 flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg font-semibold">
                    Security Settings
                  </CardTitle>
                </CardHeader>

                <div className="p-6">
                  <PasswordChangeForm />
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100/50">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-yellow-700 uppercase tracking-wide">
                    Pending Orders
                  </p>
                  <p className="text-3xl font-bold text-yellow-900">
                    {orders.filter((o) => o?.status === "pending").length}
                  </p>
                  <p className="text-xs text-yellow-600">Awaiting production</p>
                </div>
                <div className="bg-yellow-200/50 p-4 rounded-xl">
                  <Clock className="h-8 w-8 text-yellow-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
                    Ready to Deliver
                  </p>
                  <p className="text-3xl font-bold text-blue-900">
                    {orders.filter((o) => o?.status === "processing").length}
                  </p>
                  <p className="text-xs text-blue-600">Production complete</p>
                </div>
                <div className="bg-blue-200/50 p-4 rounded-xl">
                  <Package className="h-8 w-8 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100/50">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Total Orders
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {orders.length}
                  </p>
                  <p className="text-xs text-gray-600">All time</p>
                </div>
                <div className="bg-gray-200/50 p-4 rounded-xl">
                  <CheckCircle className="h-8 w-8 text-gray-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters Section */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders, customers, products..."
                  className="pl-10 h-11 border-gray-200 focus:border-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value: OrderStatus | "all") =>
                  setStatusFilter(value)
                }
              >
                <SelectTrigger className="h-11 border-gray-200">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={dateFilter}
                onValueChange={(value: string) => setDateFilter(value)}
              >
                <SelectTrigger className="h-11 border-gray-200">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Filter by date" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="h-11 border-gray-300 text-red-600 bg-transparent hover:bg-red-100 hover:text-red-700 active:bg-red-200 active:text-red-800 transition-colors"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setDateFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="bg-gray-50/50 border-b px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Production Queue
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage and track your manufacturing orders
                </p>
              </div>
              <div className="text-sm font-medium text-muted-foreground bg-white px-3 py-1.5 rounded-lg border">
                Showing {activeOrders.length} of {orders.length} orders
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {activeOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-8">
                <div className="bg-gray-100 p-6 rounded-full mb-6">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No orders found
                </h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Try adjusting your search or filter criteria to find the
                  orders you're looking for
                </p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">
                        Order ID
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4">
                        Customer
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4">
                        Product Details
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4">
                        Lens Type
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4">
                        Status
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <TableCell className="font-mono font-medium text-gray-900 py-6 px-6">
                          {order.order_number}
                        </TableCell>
                        <TableCell className="py-6">
                          <div className="space-y-1">
                            <p className="font-medium text-gray-900">
                              {order.billing?.name || "N/A"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.billing?.email || "N/A"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="py-6">
                          <div className="space-y-2">
                            {order.items?.map((item, index) => {
                              const isAccessory = item.product?.category?.name
                                ?.toLowerCase()
                                .includes("accessor");
                              return (
                                <div
                                  key={`${order.id}-item-${index}`}
                                  className="space-y-1"
                                >
                                  <p className="font-medium text-gray-900">
                                    {item.product_name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {item.product?.colors?.[0] || "N/A"}{" "}
                                    {!isAccessory &&
                                      item.product?.frame_type?.name && (
                                        <span className="text-blue-600">
                                          {item.product.frame_type.name}
                                        </span>
                                      )}
                                  </p>
                                  {item.product?.size && (
                                    <p className="text-xs text-muted-foreground">
                                      Size: {item.product.size}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="py-6">
                          <div className="space-y-2">
                            {order.items?.map((item, index) => {
                              const isAccessory = item.product?.category?.name
                                ?.toLowerCase()
                                .includes("accessor");
                              return (
                                <div
                                  key={`${order.id}-lens-${index}`}
                                  className="space-y-1"
                                >
                                  {isAccessory ? (
                                    <p className="text-sm text-muted-foreground italic">
                                      N/A for accessories
                                    </p>
                                  ) : (
                                    <>
                                      <Badge
                                        variant="outline"
                                        className="font-medium"
                                      >
                                        {item.prescription
                                          ? "Prescription"
                                          : "Standard"}
                                      </Badge>
                                      {item.lens_option &&
                                        Array.isArray(item.lens_option) && (
                                          <p className="text-xs text-muted-foreground">
                                            {item.lens_option.join(", ")}
                                          </p>
                                        )}
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="py-6">
                          <Badge
                            className={`${getStatusColor(
                              order.status as OrderStatus
                            )} font-medium`}
                          >
                            {getStatusIcon(order.status as OrderStatus)}
                            <span className="ml-2 capitalize">
                              {order.status.replace("_", " ")}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="py-6 px-6">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 px-3 bg-transparent"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4 mr-1.5" />
                              View
                            </Button>
                            {order.status === "pending" && (
                              <Button
                                size="sm"
                                className="h-9 px-3"
                                onClick={() => handleMarkReadyClick(order)}
                                disabled={
                                  updatingOrderId === order.order_number
                                }
                              >
                                {updatingOrderId === order.order_number ? (
                                  <div className="flex items-center gap-2">
                                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                    Processing...
                                  </div>
                                ) : (
                                  "Mark Ready"
                                )}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <AlertDialog
          open={!!orderToMarkReady}
          onOpenChange={() => setOrderToMarkReady(null)}
        >
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader className="space-y-4">
              <AlertDialogTitle className="text-xl font-semibold">
                Confirm Order Ready
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base leading-relaxed">
                Are you sure you want to mark order{" "}
                <span className="font-mono font-medium text-gray-900">
                  {orderToMarkReady?.order_number}
                </span>{" "}
                as ready for delivery? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3 pt-6">
              <AlertDialogCancel
                onClick={handleCancelMarkReady}
                className="h-10 px-6"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmMarkReady}
                className="h-10 px-6"
                disabled={!!updatingOrderId}
              >
                {updatingOrderId ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Updating...
                  </div>
                ) : (
                  "Confirm"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-5 p-4">
            <Card className="w-full max-w-4xl bg-white max-h-[85vh] overflow-hidden shadow-2xl">
              <CardHeader className="bg-gray-50/50 border-b px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Manufacturing Details
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      {selectedOrder.order_number}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => setSelectedOrder(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-base font-semibold text-gray-900 border-b pb-1">
                        Customer Information
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs font-medium text-gray-500">
                            Name
                          </span>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedOrder.billing?.name || "N/A"}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs font-medium text-gray-500">
                            Email
                          </span>
                          <p className="text-sm text-gray-900">
                            {selectedOrder.billing?.email || "N/A"}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs font-medium text-gray-500">
                            Order Date
                          </span>
                          <p className="text-sm text-gray-900">
                            {selectedOrder.created_at
                              ? new Date(
                                  selectedOrder.created_at
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "N/A"}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs font-medium text-gray-500">
                            Total Amount
                          </span>
                          <p className="text-base font-semibold text-gray-900">
                            ${selectedOrder.total_price || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-base font-semibold text-gray-900 border-b pb-1">
                        Production Status
                      </h4>
                      <div>
                        <Badge
                          className={`${getStatusColor(
                            selectedOrder.status as OrderStatus
                          )} text-sm px-3 py-1`}
                        >
                          {getStatusIcon(selectedOrder.status as OrderStatus)}
                          <span className="ml-1 capitalize font-medium">
                            {selectedOrder.status.replace("_", " ")}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-base font-semibold text-gray-900 border-b pb-1">
                      Product Specifications
                    </h4>
                    <div className="grid gap-4">
                      {selectedOrder.items?.map((item, index) => {
                        const isAccessory = item.product?.category?.name
                          ?.toLowerCase()
                          .includes("accessor");

                        return (
                          <div
                            key={`${selectedOrder.id}-frame-${index}`}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3"
                          >
                            <div className="flex items-start justify-between">
                              <h5 className="font-medium text-gray-900 text-sm">
                                {item.product_name || "N/A"}
                              </h5>
                              <Badge
                                variant="outline"
                                className="text-xs font-medium"
                              >
                                Qty: {item.quantity || "N/A"}
                              </Badge>
                            </div>

                            {item.product ? (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                <div>
                                  <span className="text-gray-500">Color</span>
                                  <p className="font-medium text-gray-900">
                                    {item.product.colors?.[0] || "N/A"}
                                  </p>
                                </div>

                                <div>
                                  <span className="text-gray-500">Size</span>
                                  <p className="font-medium text-gray-900">
                                    {item.product.size || "N/A"}
                                  </p>
                                </div>

                                {!isAccessory && (
                                  <div>
                                    <span className="text-gray-500">
                                      Material
                                    </span>
                                    <p className="font-medium text-gray-900">
                                      {item.product.frame_material || "N/A"}
                                    </p>
                                  </div>
                                )}
                                {!isAccessory && (
                                  <div>
                                    <span className="text-gray-500">
                                      Frame Type
                                    </span>
                                    <p className="font-medium text-gray-900">
                                      {item.product.frame_type?.name || "N/A"}
                                    </p>
                                  </div>
                                )}
                                <div>
                                  <span className="text-gray-500">Weight</span>
                                  <p className="font-medium text-gray-900">
                                    {item.product.weight || "N/A"}g
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-red-50 border border-red-200 rounded p-2">
                                <p className="text-red-700 text-xs font-medium">
                                  ⚠ Product data unavailable
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Lens Section */}
                  <div className="space-y-4">
                    <h4 className="text-base font-semibold text-gray-900 border-b pb-1">
                      Lens Specifications
                    </h4>
                    <div className="grid gap-4">
                      {selectedOrder.items?.map((item, index) => {
                        const isAccessory = item.product?.category?.name
                          ?.toLowerCase()
                          .includes("accessor");

                        return (
                          <div
                            key={`${selectedOrder.id}-lens-${index}`}
                            className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3"
                          >
                            {isAccessory ? (
                              <p className="italic text-muted-foreground text-xs">
                                Not applicable for accessories
                              </p>
                            ) : (
                              <>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    className={
                                      item.prescription
                                        ? "bg-blue-100 text-blue-800 text-xs"
                                        : "bg-gray-100 text-gray-800 text-xs"
                                    }
                                  >
                                    {item.prescription
                                      ? "Prescription"
                                      : "Standard"}
                                  </Badge>

                                  {item.lens_option?.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {item.lens_option.map(
                                        (option, optIndex) => (
                                          <Badge
                                            key={optIndex}
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            {option}
                                          </Badge>
                                        )
                                      )}
                                    </div>
                                  )}
                                </div>

                                {item.prescription && (
                                  <div className="space-y-3">
                                    {loadingPrescriptions[item.prescription] ? (
                                      <div className="flex items-center justify-center py-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                        <span className="ml-2 text-gray-600 text-xs">
                                          Loading prescription details...
                                        </span>
                                      </div>
                                    ) : prescriptionDetails[
                                        item.prescription
                                      ] ? (
                                      <>
                                        <h6 className="font-medium text-gray-900 text-sm">
                                          Prescription Details
                                        </h6>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <h6 className="text-xs font-medium text-gray-700">
                                              Right Eye
                                            </h6>
                                            <div className="grid grid-cols-3 gap-2 text-xs">
                                              <div>
                                                <span className="text-gray-500">
                                                  SPH
                                                </span>
                                                <p className="font-medium">
                                                  {prescriptionDetails[
                                                    item.prescription
                                                  ].right_sphere || "N/A"}
                                                </p>
                                              </div>
                                              <div>
                                                <span className="text-gray-500">
                                                  CYL
                                                </span>
                                                <p className="font-medium">
                                                  {prescriptionDetails[
                                                    item.prescription
                                                  ].right_cylinder || "N/A"}
                                                </p>
                                              </div>
                                              <div>
                                                <span className="text-gray-500">
                                                  AXIS
                                                </span>
                                                <p className="font-medium">
                                                  {prescriptionDetails[
                                                    item.prescription
                                                  ].right_axis || "N/A"}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="space-y-2">
                                            <h6 className="text-xs font-medium text-gray-700">
                                              Left Eye
                                            </h6>
                                            <div className="grid grid-cols-3 gap-2 text-xs">
                                              <div>
                                                <span className="text-gray-500">
                                                  SPH
                                                </span>
                                                <p className="font-medium">
                                                  {prescriptionDetails[
                                                    item.prescription
                                                  ].left_sphere || "N/A"}
                                                </p>
                                              </div>
                                              <div>
                                                <span className="text-gray-500">
                                                  CYL
                                                </span>
                                                <p className="font-medium">
                                                  {prescriptionDetails[
                                                    item.prescription
                                                  ].left_cylinder || "N/A"}
                                                </p>
                                              </div>
                                              <div>
                                                <span className="text-gray-500">
                                                  AXIS
                                                </span>
                                                <p className="font-medium">
                                                  {prescriptionDetails[
                                                    item.prescription
                                                  ].left_axis || "N/A"}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="pt-1">
                                          <span className="text-xs font-medium text-gray-500">
                                            Pupillary Distance
                                          </span>
                                          <p className="text-sm font-medium text-gray-900">
                                            {prescriptionDetails[
                                              item.prescription
                                            ].pupillary_distance || "N/A"}{" "}
                                            mm
                                          </p>
                                        </div>
                                        {prescriptionDetails[item.prescription]
                                          .additional_notes && (
                                          <div className="pt-1">
                                            <span className="text-xs font-medium text-gray-500">
                                              Additional Notes
                                            </span>
                                            <p className="text-sm text-gray-900 bg-white p-2 rounded border mt-1">
                                              {
                                                prescriptionDetails[
                                                  item.prescription
                                                ].additional_notes
                                              }
                                            </p>
                                          </div>
                                        )}
                                      </>
                                    ) : (
                                      <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                                        <p className="text-yellow-700 text-xs font-medium">
                                          ⚠ Prescription details not available
                                          (ID: {item.prescription})
                                        </p>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="mt-1 h-7 text-xs"
                                          onClick={() =>
                                            loadPrescriptionDetails(
                                              item.prescription
                                            )
                                          }
                                        >
                                          Retry Loading
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {selectedOrder.status === "pending" && (
                    <div className="flex justify-end pt-4 border-t">
                      <Button
                        onClick={() => handleMarkReadyClick(selectedOrder)}
                        className="h-9 px-6 text-sm"
                      >
                        Mark as Ready to Deliver
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
