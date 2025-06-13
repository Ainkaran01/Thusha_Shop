
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  frameType: string;
  frameMaterial: string;
  color: string;
  recommendedFaceShapes: string[];
  recommendedVisionProblems: string[];
  ratings: number;
  reviewCount: number;
  inStock: boolean;
  features: string[];
  quantity?: number;  // Optional property for cart functionality
  selectedLens?: any; // Optional property for lens selection
  category?: string;  // Added category property
  weight?: string;    // Added weight property - e.g. "18g"
  size?: string;      // Added size property - e.g. "52-18-145"
}

export interface Review {
  id: number;
  productId: number;
  userName: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  images?: string[];
}

export interface Order {
  id: string;
  userId: string;
  items: {
    productId: number;
    quantity: number;
    price: number;
    frameDetails?: {
      name: string;
      color: string;
      material: string;
      size?: string;
    };
    lensDetails?: {
      type: "standard" | "prescription";
      option?: string;
      prescription?: {
        rightEye: { sphere: number; cylinder: number; axis: number };
        leftEye: { sphere: number; cylinder: number; axis: number };
      };
    };
  }[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery: string;
  trackingNumber?: string;
  assignedDeliveryPerson?: string;
  manufacturerNotes?: string;
  adminNotes?: string;
}

export type OrderStatus = 
  | "pending" 
  | "processing" 
  | "ready_to_deliver"
  | "shipped" 
  | "delivered" 
  | "cancelled";

export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}
