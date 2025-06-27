// src/services/apiService.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Order endpoints
export const createOrder = async (orderData: any) => {
  try {
    const response = await api.post('/orders/create/', orderData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create order');
  }
};

export const updateOrderStatus = async (orderNumber: string, statusData: { status: string }) => {
  try {
    const response = await api.patch(`/orders/${orderNumber}/status/`, statusData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update order status');
  }
};

export const getOrderDetails = async (orderNumber: string) => {
  try {
    const response = await api.get(`/orders/${orderNumber}/`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch order details');
  }
};

export const getUserOrders = async () => {
  try {
    const response = await api.get('/orders/list/');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user orders');
  }
};