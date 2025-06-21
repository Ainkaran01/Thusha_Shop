import { apiClient } from "@/lib/api-clients";
import { Accessory } from "@/types/accessory"; 

const endpoint = "/api/products/accessories/";

export const fetchAccessories = async (): Promise<Accessory[]> => {
  const res = await apiClient.get(endpoint);
  return res.data;
};

export const addAccessory = async (accessoryData: FormData): Promise<Accessory> => {
  const res = await apiClient.post(endpoint, accessoryData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

export const updateAccessory = async (id: number, accessoryData: FormData): Promise<Accessory> => {
  const res = await apiClient.put(`${endpoint}${id}/`, accessoryData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

export const deleteAccessory = async (id: number): Promise<void> => {
  await apiClient.delete(`${endpoint}${id}/`);
};

export const updateAccessoryStock = async (id: number, newStock: number): Promise<void> => {
  await apiClient.patch(`${endpoint}${id}/update-stock/`, {
    stock: newStock,
  });
};
