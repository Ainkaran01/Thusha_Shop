import { apiClient } from "@/lib/api-clients";

export interface Category {
  id: number;
  name: string;
  created_at: string;
  description?: string;
}

const endpoint = "/api/products/categories/";

export const getCategories = async (): Promise<Category[]> => {
  const res = await apiClient.get(endpoint);
  return res.data;
};

export const createCategory = async (name: string,description: string): Promise<Category> => {
  const res = await apiClient.post(endpoint, { name , description });
  return res.data;
};

export const updateCategory = async (id: number, name: string,description: string): Promise<Category> => {
  const res = await apiClient.put(`${endpoint}${id}/`, { name , description});
  return res.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await apiClient.delete(`${endpoint}${id}/`);
};
