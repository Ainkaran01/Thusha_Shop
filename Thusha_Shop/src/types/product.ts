export interface ApiProduct {
  id: number;
  name: string;
  price: number;
  description: string;
  category: { id: number; name: string } | null;
  frame_type: { id: number; name: string } | null;
  size: string;
  weight: number;
  stock: number;
  manufacturer: number;
  created_at: string;
  colors:string;
  features: string[];
  face_shapes: string[];
  vision_problems: string[];
  sold:number;
  images: string[];
  frame_material?: string;

}

export interface Category {
  id: number;
  name: string;
}

export interface FrameType {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  size: string;
  weight: number;
  sold:number;

  category: Category;
  frame_type: FrameType;
  images: string[];

  frame_material?: string;
  colors?: string;
  features?: string[];
  face_shapes?: string[];
  vision_problems?: string[];
  
  created_at?: string;
  manufacturer_id?: number;
}

export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  price: string;
  stock: string;
  frameType: string;
  frameMaterial: string;
  colors: string;
  size: string;
  weight: string;
  features: string[];
  face_shapes: string[];
  vision_problems: string[];
}




export function normalizeProduct(apiProduct: ApiProduct): Product {
  
  return {
    ...apiProduct,
      images: apiProduct.images.map((img) => {
  const cleanPath = img.startsWith("/media/") ? img : `/media/${img}`;
  return `http://localhost:8000${cleanPath}`;
}),

    category: apiProduct.category 
      ? (typeof apiProduct.category === 'string'
        ? { id: 0, name: apiProduct.category }
        : apiProduct.category)
      : null,
    frame_type: apiProduct.frame_type
      ? (typeof apiProduct.frame_type === 'string'
        ? { id: 0, name: apiProduct.frame_type }
        : apiProduct.frame_type)
      : null,

    frame_material: apiProduct.frame_material || "Unknown",
    colors: apiProduct.colors || "No colors",
    features: apiProduct.features || [],
    face_shapes: apiProduct.face_shapes || [],
    vision_problems: apiProduct.vision_problems || [],
  };
}