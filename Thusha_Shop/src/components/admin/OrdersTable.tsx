
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { OrderStatus } from "@/types";
import { Truck, User } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: OrderStatus;
  date: string;
  items: number;
  updatedAt?: string;
  updatedBy?: string;
  assignedDeliveryPerson?: string;
}

interface OrdersTableProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
  onAssignDelivery: (orderId: string, deliveryPerson: string) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ 
  orders, 
  onUpdateOrderStatus, 
  onDeleteOrder,
  onAssignDelivery 
}) => {
  const [selectedOrder, setSelectedOrder] = useState<string>("");
  const [deliveryPerson, setDeliveryPerson] = useState<string>("");

  // Mock delivery personnel list
  const deliveryPersonnel = [
    "John Smith - Area North",
    "Maria Garcia - Area South", 
    "David Wilson - Area East",
    "Sarah Johnson - Area West"
  ];

  // Function to get badge variant based on order status
  const getOrderBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case "delivered": return "default";
      case "shipped": return "secondary";
      case "ready_to_deliver": return "outline";
      case "processing": return "outline";
      case "cancelled": return "destructive";
      default: return "secondary";
    }
  };

  const handleAssignDelivery = () => {
    if (selectedOrder && deliveryPerson) {
      onAssignDelivery(selectedOrder, deliveryPerson);
      onUpdateOrderStatus(selectedOrder, "shipped");
      setSelectedOrder("");
      setDeliveryPerson("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
        <CardDescription>View and manage all customer orders - Assign delivery personnel</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
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
                {orders.map((order, index) => (
                  <TableRow key={`${order.id}-${index}`}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>${order.amount}</TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell>
                      <Badge variant={getOrderBadgeVariant(order.status)}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.assignedDeliveryPerson ? (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span className="text-sm">{order.assignedDeliveryPerson}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not assigned</span>
                      )}
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {order.status === "ready_to_deliver" && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" onClick={() => setSelectedOrder(order.id)}>
                                <Truck className="h-4 w-4 mr-1" />
                                Assign Delivery
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Assign Delivery Person</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Order ID: {order.id}</Label>
                                  <p className="text-sm text-muted-foreground">Customer: {order.customer}</p>
                                </div>
                                <div>
                                  <Label htmlFor="delivery-person">Select Delivery Person</Label>
                                  <Select value={deliveryPerson} onValueChange={setDeliveryPerson}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Choose delivery person" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {deliveryPersonnel.map((person) => (
                                        <SelectItem key={person} value={person}>
                                          {person}
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
                        <Select 
                          value={order.status} 
                          onValueChange={(value) => onUpdateOrderStatus(order.id, value as OrderStatus)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="ready_to_deliver">Ready to Deliver</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersTable;
