
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
import type { Order, OrderStatus } from "@/api/orders";

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
                Created: {formatDate(delivery.created_at)}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              {getStatusBadge(delivery.status as OrderStatus)}
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
                    <TableCell>Product :- {item.product_name}</TableCell>
                    <TableCell>Qty: {item.quantity}</TableCell>
                    <TableCell className="text-right">LKR {parseFloat(item.price).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} className="font-medium">Total</TableCell>
                  <TableCell className="text-right font-medium">LKR {parseFloat(delivery.total_price).toFixed(2)}</TableCell>
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
             <p>{delivery.billing.address1}</p>
              {delivery.billing.address2 && <p>{delivery.billing.address2}</p>}
              <p>
                {delivery.billing.city}, {delivery.billing.state}{" "}
                {delivery.billing.zip_code}
              </p>
              <p>{delivery.billing.country}</p>
              <p className="mt-2">
                <strong>Phone:</strong> {delivery.billing.phone}
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
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-mono">{delivery.payment_method}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                <p>{new Date(delivery.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          {delivery.status === "shipped" && (
            <Button
              onClick={() =>
                onStatusChange(delivery.order_number, "delivered")
              }
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Delivered
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default DeliveryDetails;
