export interface Category {
  id: number;
  name: string;
}


export interface Accessory {
  id: number;
  name: string;
  description: string;
  category: Category;
  stock: number;
  price:number;
  sold:number;
  size: string;
  images: string[]; 
  weight: number;
  manufacturer: number; 
  created_at: string; 
}

export interface ApiAccessory {
  id: number;
  name: string;
  price: number;
  description: string;
  category: { id: number; name: string } | null;
  size: string;
  weight: number;
  stock: number;
  images: string[];
  manufacturer: number;
  created_at: string;
  sold:number;
}

export function normalizeAccessory(apiAccessory: ApiAccessory): Accessory {
  return {
    ...apiAccessory,
    category: typeof apiAccessory.category === 'string'
      ? { id: 0, name: apiAccessory.category } // Create category object from string
      : apiAccessory.category
  };
}