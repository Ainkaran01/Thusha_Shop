
import { Product } from "../types/product";

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

};

export type CartSummary = {
  subtotal: number;
  lensTotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
};
