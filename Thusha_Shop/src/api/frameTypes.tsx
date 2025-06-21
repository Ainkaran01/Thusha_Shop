import { apiClient } from "@/lib/api-clients";

export interface FrameType {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

const endpoint = "/api/products/frame-types/";

export const getFrameTypes = async (): Promise<FrameType[]> => {
  const res = await apiClient.get(endpoint);
  return res.data;
};

export const createFrameType = async (name: string,description :string): Promise<FrameType> => {
  const res = await apiClient.post(endpoint, { name , description });
  return res.data;
};

export const updateFrameType = async (id: number, name: string ,description: string): Promise<FrameType> => {
  const res = await apiClient.put(`${endpoint}${id}/`, { name  ,description});
  return res.data;
};

export const deleteFrameType = async (id: number): Promise<void> => {
  await apiClient.delete(`${endpoint}${id}/`);
};