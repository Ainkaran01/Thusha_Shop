
import React from "react";
import { Edit, Trash } from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Order, OrderStatus } from "@/types";

interface DeliveryListProps {
  deliveries: Order[];
  filteredDeliveries: Order[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onViewDetails: (delivery: Order) => void;
  onDeleteDelivery: (id: string) => void;
}

const DeliveryList: React.FC<DeliveryListProps> = ({ 
  filteredDeliveries, 
  activeTab, 
  setActiveTab, 
  onViewDetails, 
  onDeleteDelivery 
}) => {
  // Get status badge style
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "processing":
        return <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">Processing</Badge>;
      case "shipped":
        return <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">Shipped</Badge>;
      case "delivered":
        return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deliveries</CardTitle>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Delivery Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDeliveries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No deliveries found
                </TableCell>
              </TableRow>
            ) : (
              filteredDeliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell className="font-medium">{delivery.id}</TableCell>
                  <TableCell>{delivery.shippingAddress.fullName}</TableCell>
                  <TableCell>{new Date(delivery.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                  <TableCell>{delivery.estimatedDelivery}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onViewDetails(delivery)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => onDeleteDelivery(delivery.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DeliveryList;
