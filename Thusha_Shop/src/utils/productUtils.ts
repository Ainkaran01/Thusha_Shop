
import { Product } from "@/types";

export const sortProducts = (products: Product[], sortBy: string): Product[] => {
  const sorted = [...products];
  
  switch (sortBy) {
    case "price-low-high":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-high-low":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.ratings - a.ratings);
    case "name-a-z":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name-z-a":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return sorted;
  }
};

export const getProductsByCategory = (products: Product[], category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getRelatedProducts = (currentProduct: Product, allProducts: Product[], limit: number = 4): Product[] => {
  return allProducts
    .filter(product => 
      product.id !== currentProduct.id && 
      (product.category === currentProduct.category ||
       product.frameType === currentProduct.frameType ||
       product.frameMaterial === currentProduct.frameMaterial)
    )
    .slice(0, limit);
};

export const filterProductsByFaceShape = (products: Product[], faceShape: string): Product[] => {
  return products.filter(product => 
    product.recommendedFaceShapes.includes(faceShape)
  );
};

export const filterProductsByPriceRange = (products: Product[], min: number, max: number): Product[] => {
  return products.filter(product => 
    product.price >= min && product.price <= max
  );
};
