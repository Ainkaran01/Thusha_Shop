// src/types/order.ts
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentMethod = "card" | "cash";
export type DeliveryOption = "home" | "pickup";

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  lens_0ption?: string;
  prescription_id?: string;
}

export interface Billing {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  orderId:string;
}

export interface Order {
  id: string;
  order_number: string;
  user: string;
  status: OrderStatus;
  items: OrderItem[];
  total_price: number;
  created_at: string;
  payment_method: PaymentMethod;
  deliveryOption: DeliveryOption;
  billing: Billing;

  
}