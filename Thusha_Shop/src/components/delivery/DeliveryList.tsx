import React from "react";
import { Edit, Trash, Eye, Truck, CheckCircle } from "lucide-react";
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
import type { Order, OrderStatus } from "@/api/orders";

interface DeliveryListProps {
  deliveries: Order[];
  filteredDeliveries: Order[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onViewDetails: (delivery: Order) => void;
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
  updatingStatus: string | null;
}

const DeliveryList: React.FC<DeliveryListProps> = ({ 
  filteredDeliveries, 
  activeTab, 
  setActiveTab, 
  onViewDetails,
  onStatusUpdate,
  updatingStatus, 
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
              <TableHead>Payment Method</TableHead>
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
                  <TableCell className="font-medium">{delivery.order_number}</TableCell>
                  <TableCell><p>{delivery.billing.name}</p> <p>{delivery.billing.address1}</p></TableCell>
                  <TableCell>{new Date(delivery.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(delivery.status as OrderStatus)}</TableCell>
                  <TableCell>{delivery.payment_method}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {delivery.status === "shipped" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onStatusUpdate(delivery.order_number, "delivered")}
                          disabled={updatingStatus === delivery.order_number}
                        >
                          {updatingStatus === delivery.order_number ? (
                            <>
                              <span className="animate-pulse">Updating...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Delivered
                            </>
                          )}
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onViewDetails(delivery)}
                      >
                        <Eye className="h-4 w-4" />
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