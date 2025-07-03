
import React, { useState, useEffect } from 'react';
import { OrderStatus } from "@/types/order";
import OrderStatusCard from './OrderStatusCard';
import OrderProgressTimeline from './OrderProgressTimeline';
import LiveTrackingCard from './LiveTrackingCard';

interface OrderTrackingStatusProps {
  orderId: string;
  currentStatus: OrderStatus;
  trackingNumber?: string;
  estimatedDelivery: string;
  onStatusUpdate?: (newStatus: OrderStatus) => void;
}

const OrderTrackingStatus: React.FC<OrderTrackingStatusProps> = ({
  orderId,
  currentStatus,
  trackingNumber,
  estimatedDelivery,
  onStatusUpdate
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute for realistic feel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Simulate status updates based on current status
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStatus === "pending") {
        onStatusUpdate?.("processing");
      } else if (currentStatus === "processing") {
        onStatusUpdate?.("shipped");
      } else if (currentStatus === "shipped") {
        onStatusUpdate?.("delivered");
      }
    }, 30000); // Update status every 30 seconds for demo

    return () => clearTimeout(timer);
  }, [currentStatus, onStatusUpdate]);

  return (
    <div className="space-y-6">
      <OrderStatusCard
        orderId={orderId}
        currentStatus={currentStatus}
        trackingNumber={trackingNumber}
        estimatedDelivery={estimatedDelivery}
        currentTime={currentTime}
      />

      <OrderProgressTimeline currentStatus={currentStatus} />

      <LiveTrackingCard currentStatus={currentStatus} />
    </div>
  );
};

export default OrderTrackingStatus;
