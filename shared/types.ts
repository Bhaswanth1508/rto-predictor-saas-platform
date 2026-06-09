export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type RtoRisk = 'low' | 'medium' | 'high';
export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled' | 'rto';
export interface User {
  id: string;
  name: string;
  email?: string;
}
export interface Brand {
  id: string;
  name: string;
  planId: string;
  status: 'active' | 'suspended';
  createdAt: string;
}
export interface Customer {
  id: string;
  name: string;
  email: string;
  brandId: string;
  orderCount: number;
  rtoCount: number;
  trustScore: number; // 0-100
}
export interface Order {
  id: string;
  orderNumber: string;
  amount: number;
  customerId: string;
  brandId: string;
  status: OrderStatus;
  rtoRisk: RtoRisk;
  recommendation: string;
  createdAt: string;
  pincode: string;
}
export interface Pincode {
  id: string;
  code: string;
  city: string;
  state: string;
  rtoRate: number;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}