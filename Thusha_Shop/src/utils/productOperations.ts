
import { Product } from "@/types";

export const calculateProductStats = (products: Product[]) => {
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.inStock).length;
  const outOfStockProducts = totalProducts - inStockProducts;
  const averagePrice = products.reduce((sum, p) => sum + p.price, 0) / totalProducts;
  
  return {
    totalProducts,
    inStockProducts,
    outOfStockProducts,
    averagePrice: parseFloat(averagePrice.toFixed(2))
  };
};

export const getProductsByCategory = (products: Product[], category: string) => {
  return products.filter(product => product.category === category);
};

export const searchProducts = (products: Product[], searchTerm: string) => {
  const term = searchTerm.toLowerCase();
  return products.filter(product =>
    product.name.toLowerCase().includes(term) ||
    product.description.toLowerCase().includes(term) ||
    product.category?.toLowerCase().includes(term)
  );
};

export const getLowStockProducts = (products: any[], threshold: number = 10) => {
  return products.filter(product => product.stock < threshold);
};
