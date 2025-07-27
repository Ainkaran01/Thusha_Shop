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
  status_updated_at: string | null;
  assigned_delivery_person:  {
    id: number;
    name: string;
    email: string;
  } | null;
  delivery?: {
    assigned_at: string;
  };
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
  lens_option: string[] | null;
  prescription: Prescription | null;
  product: {
    id: number;
    name: string;
    price: string;
    description: string;
    size: string;
    weight: number;
    stock: number;
    frame_material: string;
    images: string[];
    colors: string[];
    frame_type: {
      id: number;
      name: string;
      description: string;
    } | null;
    category: {
      id: number;
      name: string;
      description: string;
    } | null;
  };
}

export interface Prescription {
  id: number;
  prescription_id: string;
  right_sphere: number;
  right_cylinder: number;
  right_axis: number;
  left_sphere: number;
  left_cylinder: number;
  left_axis: number;
  pupillary_distance: number;
  additional_notes?: string;
  date_issued: string;
  expiry_date: string;
  status: string;
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

export interface SalesDataPoint {
  month: string;
  online: number;
  pos: number;
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


export const fetchTotalSales = async (): Promise<{ total_sales: number; last_month_sales: number }> => {
  const res = await apiClient.get(`${endpoint}total-sales/`);
  return res.data;
};

export const fetchMonthlyRevenue = async (): Promise<{ monthly_revenue: number; last_month_revenue: number }> => {
  const res = await apiClient.get(`${endpoint}monthly-revenue/`);
  return res.data;
};


export const fetchSalesOverview = async (): Promise<SalesDataPoint[]> => {
  const res = await apiClient.get(`${endpoint}sales-overview/`);
  return res.data;
};