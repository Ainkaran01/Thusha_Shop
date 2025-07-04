import { apiClient } from "@/lib/api-clients";

export interface Order {
  id: number;
  order_number: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
  status: string;
  payment_method: string;
  delivery_option: string;
  total_price: string;
  created_at: string;
  items: OrderItem[];
  billing: BillingInfo;
  assigned_delivery_person?: string;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";


export interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: string;
  lens_option: any;
  prescription: any;
}

export interface BillingInfo {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

const endpoint = "api/orders/role/";

export const fetchOrders = async (): Promise<Order[]> => {
  const res = await apiClient.get(`${endpoint}orders/`);
  return res.data;
};

export const updateOrderStatus = async (orderNumber: string,status: string ): Promise<Order> => {
  const res = await apiClient.patch(`${endpoint}${orderNumber}/status/`, {
    status,
  });
  return res.data;
};

export const assignDelivery = async ( orderId: number , deliveryPersonId: number): Promise<any> => {
  const res = await apiClient.post(`${endpoint}assign-delivery/`, {
    order_id: orderId,
    delivery_person: deliveryPersonId,
  });
  return res.data;
};

export const fetchDeliveryPersons = async (): Promise<{ id: number; name: string; email: string }[]> => {
  const res = await apiClient.get(`${endpoint}delivery-persons/`);
  return res.data;
};

export const fetchPendingOrderCount = async (): Promise<number> => {
  const res = await apiClient.get(`${endpoint}pending-order-count/`);
  return res.data.pending_orders;
};

