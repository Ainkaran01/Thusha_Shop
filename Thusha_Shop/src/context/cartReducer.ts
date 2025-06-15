
import { Product } from "../types";
import { CartItem } from "../types/cart";

export type CartAction = 
  | { type: 'ADD_ITEM'; product: Product; quantity?: number }
  | { type: 'REMOVE_ITEM'; productId: number }
  | { type: 'UPDATE_QUANTITY'; productId: number; quantity: number }
  | { type: 'UPDATE_LENS_OPTION'; productId: number; lensOption: { type: "standard" | "prescription"; option: string; price: number } }
  | { type: 'UPDATE_ITEM_NOTES'; productId: number; notes: string }
  | { type: 'TOGGLE_GIFT_WRAPPING'; productId: number; giftWrapping: boolean }
  | { type: 'SET_PRESCRIPTION_ID'; productId: number; prescriptionId: string }
  | { type: 'SET_PRESCRIPTION_VERIFIED'; productId?: number; verified: boolean }
  | { type: 'CLEAR_CART' };

export type CartState = {
  cartItems: CartItem[];
  prescriptionVerified: boolean;
};

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1 } = action;
      const existingItem = state.cartItems.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        };
      } else {
        // For eyeglasses, automatically add with standard lens option
        const newItem: CartItem = { 
          product, 
          quantity,
          addedAt: new Date()
        };
        
        // If it's eyeglasses, add a default standard lens option
        if (product.category === 'eyeglasses') {
          newItem.lensOption = {
            type: 'standard',
            option: 'Basic',
            price: 50 // Default price for basic standard lenses
          };
        }
        
        return {
          ...state,
          cartItems: [...state.cartItems, newItem]
        };
      }
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.product.id !== action.productId)
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.product.id === action.productId 
            ? { ...item, quantity: action.quantity } 
            : item
        )
      };
    
    case 'UPDATE_LENS_OPTION':
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.product.id === action.productId 
            ? { ...item, lensOption: action.lensOption } 
            : item
        )
      };
    
    case 'UPDATE_ITEM_NOTES':
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.product.id === action.productId 
            ? { ...item, notes: action.notes } 
            : item
        )
      };
    
    case 'TOGGLE_GIFT_WRAPPING':
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.product.id === action.productId 
            ? { ...item, giftWrapping: action.giftWrapping } 
            : item
        )
      };
    
    case 'SET_PRESCRIPTION_ID':
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.product.id === action.productId 
            ? { ...item, prescriptionId: action.prescriptionId } 
            : item
        )
      };
    
    case 'SET_PRESCRIPTION_VERIFIED':
      if (action.productId) {
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item.product.id === action.productId 
              ? { ...item, prescriptionVerified: action.verified } 
              : item
          )
        };
      }
      
      return {
        ...state,
        prescriptionVerified: action.verified
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: []
      };
    
    default:
      return state;
  }
};
