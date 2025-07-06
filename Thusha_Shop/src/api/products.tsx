import { apiClient } from "@/lib/api-clients";
import { Product } from "@/types/product";

const endpoint = "/api/products/products/";

export const fetchProducts = async (): Promise<Product[]> => {
  const res = await apiClient.get(endpoint);
  return res.data;
};

export const addProduct = async (productData: FormData): Promise<Product> => {
  const res = await apiClient.post(endpoint, productData, {
     headers: { "Content-Type": "multipart/form-data" ,
     }
     
  });
  return res.data;
};

export const updateProduct = async (id: number, productData: FormData): Promise<Product> => {
  const res = await apiClient.put(`${endpoint}${id}/`, productData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await apiClient.delete(`${endpoint}${id}/`);
};


export const updateStock = async (id: number, newStock: number): Promise<void> => {
  await apiClient.patch(`/api/products/products/${id}/update-stock/`, {
    stock: newStock,
  });
};

export const deleteProductImage = async (productId: number, imageId: number): Promise<void> => {
  await apiClient.delete(`${endpoint}${productId}/images/${imageId}/`);
};

export const setPrimaryImage = async (productId: number, imageId: number): Promise<void> => {
  await apiClient.patch(`${endpoint}${productId}/images/${imageId}/set-primary/`);
};

export const fetchProductCategoryCounts = async (): Promise<{ id: string; value: number }[]> => {
  const res = await apiClient.get("/api/products/category-counts/");
  return res.data.map((item: any) => ({
    id: item.category,
    value: item.count,
  }));
};