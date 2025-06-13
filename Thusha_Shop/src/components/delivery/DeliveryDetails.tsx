
import React from "react";
import { Package, MapPin, Calendar, Edit, CheckCircle, XCircle } from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import type { Order, OrderStatus } from "@/types";

interface DeliveryDetailsProps {
  delivery: Order;
  onBack: () => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
  onEdit: () => void;
  isEditing: boolean;
}

const DeliveryDetails: React.FC<DeliveryDetailsProps> = ({ 
  delivery, 
  onBack, 
  onStatusChange, 
  onEdit,
  isEditing 
}) => {
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
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
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onBack}
        className="mb-4"
      >
        &larr; Back to Delivery List
      </Button>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">Order #{delivery.id}</CardTitle>
              <CardDescription>
                Created: {formatDate(delivery.createdAt)}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              {getStatusBadge(delivery.status)}
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onEdit}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold flex items-center">
              <Package className="h-4 w-4 mr-2" /> Order Items
            </h3>
            <Table>
              <TableBody>
                {delivery.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>Product #{item.productId}</TableCell>
                    <TableCell>Qty: {item.quantity}</TableCell>
                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} className="font-medium">Total</TableCell>
                  <TableCell className="text-right font-medium">${delivery.totalAmount.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold flex items-center">
              <MapPin className="h-4 w-4 mr-2" /> Shipping Address
            </h3>
            <div className="mt-2 space-y-1 text-sm">
              <p className="font-medium">{delivery.shippingAddress.fullName}</p>
              <p>{delivery.shippingAddress.street}</p>
              <p>
                {delivery.shippingAddress.city}, {delivery.shippingAddress.state} {delivery.shippingAddress.zipCode}
              </p>
              <p>{delivery.shippingAddress.country}</p>
              <p className="mt-2">
                <span className="font-medium">Phone:</span> {delivery.shippingAddress.phone}
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold flex items-center">
              <Calendar className="h-4 w-4 mr-2" /> Delivery Information
            </h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tracking Number</p>
                <p className="font-mono">{delivery.trackingNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                <p>{new Date(delivery.estimatedDelivery).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => onStatusChange(delivery.id, "delivered")}
          >
            <CheckCircle className="h-4 w-4 mr-2" /> Mark as Delivered
          </Button>
          <Button 
            variant="outline" 
            className="border-red-200 text-red-600 hover:bg-red-50"
            onClick={() => onStatusChange(delivery.id, "cancelled")}
          >
            <XCircle className="h-4 w-4 mr-2" /> Cancel Delivery
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default DeliveryDetails;
