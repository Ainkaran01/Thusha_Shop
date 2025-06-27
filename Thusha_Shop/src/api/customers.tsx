import { apiClient } from "@/lib/api-clients";

const endpoint = "api/core/users/";

export interface Customer {
  id: number;
  name: string;
  email: string;
  role:string;
  is_active: boolean;
}

export const fetchActiveCustomers = async (): Promise<Customer[]> => {
  const res = await apiClient.get(endpoint);
  return res.data;
};

export const deactivateCustomer = async (id: number): Promise<void> => {
  await apiClient.patch(`${endpoint}${id}/deactivate/`);
};

export const activateCustomer = async (id: number): Promise<void> => {
  await apiClient.patch(`${endpoint}${id}/activate/`);
};