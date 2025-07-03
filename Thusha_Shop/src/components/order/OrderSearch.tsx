
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { orders } from "@/data/products";
import { Order, OrderStatus } from "@/types/order";

interface OrderSearchProps {
  onOrderFound: (order: Order) => void;
}

const OrderSearch: React.FC<OrderSearchProps> = ({ onOrderFound }) => {
  const { toast } = useToast();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleTrackingSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      toast({
        title: "Tracking number required",
        description: "Please enter a tracking or order number",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    
    // Simulate a search delay
    setTimeout(() => {
      // Find order by id or tracking number
      const order = orders.find(
        o => o.id === trackingNumber || o.trackingNumber === trackingNumber
      );
      
      if (order) {
        // Ensure order.status is treated as OrderStatus
        const typedOrder: Order = {
          ...order,
          status: order.status as OrderStatus
        };
        
        onOrderFound(typedOrder);
        toast({
          title: "Order Found",
          description: `Order #${order.id} has been found`,
        });
      } else {
        toast({
          title: "Order Not Found",
          description: "We couldn't find an order with that tracking number. Please check and try again.",
          variant: "destructive",
        });
      }
      
      setIsSearching(false);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Track Your Order</CardTitle>
        <CardDescription>
          Enter your order number or tracking number to check the status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleTrackingSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Order ID or Tracking Number (try ord-12345)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full pr-10"
            />
          </div>
          <Button type="submit" disabled={isSearching}>
            {isSearching ? "Searching..." : "Track"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default OrderSearch;
