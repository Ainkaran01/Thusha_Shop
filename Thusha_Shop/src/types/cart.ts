
import { Product } from "../types";

export type CartItem = {
  product: Product;
  quantity: number;
  lensOption?: {
    type: "standard" | "prescription";
    option: string;
    price: number;
    prescriptionId?: string;
  };
  addedAt?: Date; 
  notes?: string;
  giftWrapping?: boolean;
  prescriptionId?: string;
  prescriptionVerified?: boolean;
};

export type CartSummary = {
  subtotal: number;
  lensTotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
};
