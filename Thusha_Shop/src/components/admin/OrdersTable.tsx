import type React from "react";
import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import type { Order, OrderStatus } from "@/api/orders";
import {
  Truck,
  User,
  Search,
  Eye,
  X,
  Package,
  CheckCircle,
  Filter,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { useAdminDashboard } from "@/context/AdminDashboardContext";
import { useToast } from "@/components/ui/use-toast";

interface OrdersTableProps {
  orders: Order[];
  onUpdateOrderStatus: (
    orderNumber: string,
    newStatus: OrderStatus
  ) => Promise<void>;
  onAssignDelivery: (orderId: number, deliveryPerson: number) => Promise<void>;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders = [],
  onUpdateOrderStatus,
  onAssignDelivery,
}) => {
  const { fetchDeliveryPersons } = useAdminDashboard();
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [deliveryPerson, setDeliveryPerson] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [deliveryPersonnel, setDeliveryPersonnel] = useState<
    { id: number; name: string; email: string }[]
  >([]);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    const loadDeliveryPersonnel = async () => {
      try {
        const data = await fetchDeliveryPersons();
        setDeliveryPersonnel(data);
      } catch (error) {
        console.error("Error fetching delivery persons:", error);
      }
    };
    loadDeliveryPersonnel();
  }, [fetchDeliveryPersons]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.billing?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.billing?.email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.billing?.phone
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.billing?.address1
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

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

  const getOrderBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
        return "default";
      case "shipped":
        return "secondary";
      case "processing":
        return "outline";
      case "cancelled":
        return "destructive";
      case "pending":
        return "outline";
      default:
        return "secondary";
    }
  };

  const handleAssignDelivery = async () => {
    if (selectedOrder && deliveryPerson) {
      try {
        await onAssignDelivery(selectedOrder, parseInt(deliveryPerson));
        setSelectedOrder(null);
        setDeliveryPerson("");
        toast({
          title: "Delivery assigned",
          description: "The delivery person has been assigned successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to assign delivery person.",
          variant: "destructive",
        });
      }
    }
  };

  const handleStatusUpdate = async (
    orderNumber: string,
    newStatus: OrderStatus
  ) => {
    setIsUpdatingStatus(true);
    try {
      await onUpdateOrderStatus(orderNumber, newStatus);
      toast({
        title: "Status updated",
        description: `Order status has been changed to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const countItems = (order: Order) => {
    return order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy HH:mm");
  };

  const formatAddress = (billing: Order["billing"]) => {
    if (!billing) return "No address";
    return `${billing.address1}, ${
      billing.address2 ? billing.address2 + ", " : ""
    }${billing.city}, ${billing.state} ${billing.zip_code}, ${billing.country}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Order Management</CardTitle>
            <CardDescription>
              View and manage all customer orders
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Delivery</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.order_number}>
                      <TableCell>{order.order_number}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="truncate max-w-[150px]">
                            {order.billing?.name || "No name"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="rounded-full bg-purple-100/80 dark:bg-purple-800 px-3 py-1">
                          LKR{order.total_price}
                        </Badge>
                      </TableCell>
                      <TableCell>{countItems(order)}</TableCell>
                      <TableCell>
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
                      <TableCell>
                        {order.assigned_delivery_person ? (
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span className="text-sm truncate max-w-[120px]">
                              {order.assigned_delivery_person}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Not assigned
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          {order.status === "processing" &&
                            order.delivery_option === "home" && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    onClick={() => setSelectedOrder(order.id)}
                                  >
                                    <Truck className="h-4 w-4 mr-1" />
                                    Assign
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Assign Delivery Person
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label>
                                        Order : {order.order_number}
                                      </Label>
                                      <p className="text-sm text-muted-foreground truncate">
                                        Customer:{" "}
                                        {order.billing?.name || "Unknown"}
                                      </p>
                                    </div>
                                    <div>
                                      <Label htmlFor="delivery-person">
                                        Select Delivery Person
                                      </Label>
                                      <Select
                                        value={deliveryPerson}
                                        onValueChange={setDeliveryPerson}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Choose delivery person" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {deliveryPersonnel.map((person) => (
                                            <SelectItem
                                              key={person.id}
                                              value={person.id.toString()}
                                            >
                                              {person.name} ({person.email})
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <Button
                                      onClick={handleAssignDelivery}
                                      disabled={!deliveryPerson}
                                      className="w-full"
                                    >
                                      Assign and Mark as Shipped
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}

                          {order.status === "processing" &&
                            order.delivery_option === "pickup" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    className="bg-blue-600 text-white hover:bg-blue-700"
                                    disabled={isUpdatingStatus}
                                  >
                                    <Package className="h-4 w-4 mr-1" />
                                    {isUpdatingStatus
                                      ? "Updating..."
                                      : "Ready"}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Confirm Ready for Pickup
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to mark this order
                                      as ready for pickup? The customer will be
                                      notified.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleStatusUpdate(
                                          order.order_number,
                                          "shipped"
                                        )
                                      }
                                    >
                                      Confirm
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}

                          {order.status === "shipped" &&
                            order.delivery_option === "pickup" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    className="bg-green-600 text-white hover:bg-green-700"
                                    disabled={isUpdatingStatus}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    {isUpdatingStatus
                                      ? "Updating..."
                                      : "Pick Up"}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Confirm Pickup
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure the customer picked up the
                                      order? This will mark the order as
                                      delivered.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleStatusUpdate(
                                          order.order_number,
                                          "delivered"
                                        )
                                      }
                                    >
                                      Confirm
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setViewOrder(order)}
                            className="p-0"
                          >
                            <Badge className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200 active:bg-green-300 px-2 py-1 rounded-md text-sm font-medium transition-colors">
                              <Eye className="h-4 w-4" />
                              View
                            </Badge>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          No orders found matching your criteria
                        </p>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("all");
                          }}
                        >
                          Clear filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>

      {/* Order Details Dialog */}
      <Dialog
        open={!!viewOrder}
        onOpenChange={(open) => !open && setViewOrder(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex justify-between items-center text-xl font-semibold">
              Order Details - {viewOrder?.order_number}
            </DialogTitle>
          </DialogHeader>

          {viewOrder && (
            <div className="space-y-4">
              {/* Order Status Banner */}
              <div className="bg-muted/30 rounded-lg p-3 border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={getOrderBadgeVariant(
                        viewOrder.status as OrderStatus
                      )}
                      className="text-sm px-3 py-1"
                    >
                      {viewOrder.status.replace("_", " ").toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Order placed on {formatDate(viewOrder.created_at)}
                    </span>
                  </div>
                  <div className="text-right">
                    <Badge className="text-lg font-bold px-3 py-1 rounded-full bg-purple-100/80 dark:bg-purple-800">
                      LKR {viewOrder.total_price}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {countItems(viewOrder)} items
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer & Shipping Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Name
                      </Label>
                      <p className="text-sm font-medium truncate">
                        {viewOrder.billing?.name || "No name provided"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Email
                      </Label>
                      <p className="text-sm truncate">
                        {viewOrder.billing?.email || "No email provided"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Phone
                      </Label>
                      <p className="text-sm">
                        {viewOrder.billing?.phone || "No phone provided"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      {viewOrder.delivery_option === "home"
                        ? "Shipping"
                        : "Pickup"}{" "}
                      Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">
                      {formatAddress(viewOrder.billing)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Order Information */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Order Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Payment Method
                      </Label>
                      <p className="text-sm font-medium capitalize">
                        {viewOrder.payment_method}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Delivery Option
                      </Label>
                      <p className="text-sm font-medium capitalize">
                        {viewOrder.delivery_option}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Order Date
                      </Label>
                      <p className="text-sm">
                        {formatDate(viewOrder.created_at)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Assigned Delivery
                      </Label>
                      <p className="text-sm">
                        {viewOrder.assigned_delivery_person || "Not assigned"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-semibold">
                            Product
                          </TableHead>
                          <TableHead className="font-semibold text-center">
                            Quantity
                          </TableHead>
                          <TableHead className="font-semibold text-right">
                            Unit Price
                          </TableHead>
                          <TableHead className="font-semibold text-right">
                            Total
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {viewOrder.items?.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              {item.product_name}
                            </TableCell>
                            <TableCell className="text-center">
                              {item.quantity}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge className="rounded-full bg-purple-100/80 dark:bg-purple-800 px-3 py-1">
                                LKR{item.price}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge className="rounded-full bg-purple-100/80 dark:bg-purple-800 px-3 py-1">
                                LKR{" "}
                                {(
                                  Number.parseFloat(item.price) * item.quantity
                                ).toFixed(2)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card className="shadow-sm">
                <CardContent className="pt-4">
                  <div className="flex justify-end">
                    <div className="w-full max-w-sm space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <Badge className="rounded-full bg-purple-100/80 dark:bg-purple-800 px-3 py-1">
                          LKR {viewOrder.total_price}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping:</span>
                        <Badge className="rounded-full bg-purple-100/80 dark:bg-purple-800 px-3 py-1">
                          $0.00
                        </Badge>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <Badge className="rounded-full bg-purple-100/80 dark:bg-purple-800 px-3 py-1">
                          LKR {viewOrder.total_price}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status Update Actions */}
              {viewOrder.status === "processing" &&
                viewOrder.delivery_option === "pickup" && (
                  <Card className="shadow-sm border-blue-200 bg-blue-50/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base text-blue-800">
                        Order Ready for Pickup
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() =>
                          handleStatusUpdate(viewOrder.order_number, "shipped")
                        }
                        disabled={isUpdatingStatus}
                        className="w-full"
                      >
                        <Package className="h-4 w-4 mr-2" />
                        {isUpdatingStatus
                          ? "Updating..."
                          : "Mark as Ready for Pickup"}
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        This will notify the customer that their order is ready
                        for pickup.
                      </p>
                    </CardContent>
                  </Card>
                )}

              {viewOrder.status === "shipped" &&
                viewOrder.delivery_option === "pickup" && (
                  <Card className="shadow-sm border-green-200 bg-green-50/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base text-green-800">
                        Order Picked Up
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() =>
                          handleStatusUpdate(
                            viewOrder.order_number,
                            "delivered"
                          )
                        }
                        disabled={isUpdatingStatus}
                        className="w-full"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {isUpdatingStatus ? "Updating..." : "Mark as Picked Up"}
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        Confirm that the customer has picked up their order.
                      </p>
                    </CardContent>
                  </Card>
                )}

              {/* Delivery Assignment (only for home delivery) */}
              {viewOrder.status === "processing" &&
                viewOrder.delivery_option === "home" && (
                  <Card className="shadow-sm border-orange-200 bg-orange-50/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base text-orange-800">
                        Delivery Assignment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                        <div className="flex-1 space-y-2">
                          <Label htmlFor="delivery-assignment">
                            Select Delivery Person
                          </Label>
                          <Select
                            value={deliveryPerson}
                            onValueChange={setDeliveryPerson}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choose delivery person" />
                            </SelectTrigger>
                            <SelectContent>
                              {deliveryPersonnel.map((person) => (
                                <SelectItem
                                  key={person.id}
                                  value={person.id.toString()}
                                >
                                  {person.name} ({person.email})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          onClick={async () => {
                            if (deliveryPerson) {
                              await handleAssignDelivery();
                              setViewOrder(null);
                            }
                          }}
                          disabled={!deliveryPerson}
                          className="w-full sm:w-auto"
                        >
                          <Truck className="h-4 w-4 mr-2" />
                          Assign Delivery
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default OrdersTable;
