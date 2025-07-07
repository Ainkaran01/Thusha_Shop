import { Product } from "../types/product";
import { CartItem } from "../types/cart";

export type LensOption = {
  type: "standard" | "prescription";
  option: string;
  price: number;
  prescriptionId?: string | null;
  prescription?: string | null;
};

export type CartAction = 
  | { type: 'ADD_ITEM'; product: Product; quantity?: number }
  | { type: 'REMOVE_ITEM'; productId: number }
  | { type: 'UPDATE_QUANTITY'; productId: number; quantity: number }
  | { type: 'UPDATE_LENS_OPTION'; productId: number; lensOption: LensOption | null }
  | { type: 'UPDATE_ITEM_NOTES'; productId: number; notes: string }
  | { type: 'TOGGLE_GIFT_WRAPPING'; productId: number; giftWrapping: boolean }
  | { type: 'CLEAR_CART' }
  | { type: 'REVERT_LENS_UPDATE'; productId: number; previousLensOption: LensOption | null };

export type CartState = {
  cartItems: CartItem[];
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
        // Safely handle products with missing category
        const isEyeglass = product.category?.name === "Eyeglasses";
        
        const newItem: CartItem = { 
          product, 
          quantity,
          addedAt: new Date(),
          ...(isEyeglass && {
            lensOption: {
              type: "standard",
              option: "Basic",
              price: 0,
              prescriptionId: null,
              
            }
          })
        };
        
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
            ? { 
                ...item, 
                lensOption: action.lensOption 
                  ? { 
                      ...item.lensOption, 
                      ...action.lensOption 
                    } 
                  : null 
              } 
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
    
    case 'REVERT_LENS_UPDATE':
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.product.id === action.productId
            ? { ...item, lensOption: action.previousLensOption }
            : item
        )
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