import { apiClient } from "@/lib/api-clients";
import { User } from "@/types/user";

export interface AdminProfile {
  id: number;
  user: User;
  phone_number: string | null;
  customer_support_phone: string | null;
  shop_status: 'open' | 'closed';
  address: string | null;
  image: string | null; 
  created_at: string;
  updated_at: string;
}

const endpoint = "/api/adminprofile/profile/";

export const fetchAdminProfile = async (): Promise<AdminProfile> => {
  const res = await apiClient.get(endpoint);
  return res.data;
};

export const updateAdminProfile = async (profileData: FormData): Promise<AdminProfile> => {
  const res = await apiClient.patch(endpoint, profileData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};