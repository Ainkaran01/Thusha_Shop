import { apiClient } from "@/lib/api-clients";

export interface Appointment {
  id: number;
  patient_name: string;
  date: string;
  time: string;
  status: string;
  doctor_name: string;
  patient_email :string;
  reason: string;
  phone: string;
  created_at: string;
  doctor_details: {
    id: number;
    name: string;
    email: string;
    specialization: string;
    availability: string[];
  };
}

const endpoint = "api/appointments/";

export const fetchAppointments = async (): Promise<Appointment[]> => {
  const res = await apiClient.get(endpoint) ;
  return res.data;
  
};


export const deleteAppointment = async (id: number): Promise<void> => {
  const res = await apiClient.delete(`${endpoint}${id}/`);
  if (res.status !== 204 && res.status !== 200) {
    throw new Error("Failed to delete appointment");
  }
};
