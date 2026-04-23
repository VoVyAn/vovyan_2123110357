import apiClient from './apiClient';

export interface DashboardData {
  revenueToday: number;
  orderCountToday: number;
  tableStatus: {
    empty: number;
    serving: number;
    reserved: number;
  };
  bestSellers: Array<{ productName: string; sold: number }>;
}

export interface OrderItem {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface PagedResult<T> {
  page: number;
  pageSize: number;
  totalItems: number;
  items: T[];
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
  code: string;
  password?: string;
}

export interface Banner {
  id: number;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  isActive: boolean;
  order: number;
}

export interface OrderDetailItem {
  productName: string;
  quantity: number;
  price: number;
}

export interface AdminOrderDetail {
  id: number;
  userId: number | null;
  staffName: string | null;
  customerName: string;
  tableId: number | null;
  tableCode: string | null;
  totalAmount: number;
  status: string;
  discountCode: string | null;
  discountAmount: number;
  paymentMethod: string | null;
  vat: number;
  serviceFee: number;
  createdAt: string;
  items: OrderDetailItem[];
}

export interface Reservation {
  id: number;
  customerName: string;
  phone: string;
  email: string;
  reservationDate: string;
  numberOfGuests: number;
  storeName: string | null;
  note: string | null;
  status: string;
  createdAt: string;
}

const adminService = {
  getDashboard: () => apiClient.get<DashboardData>('/admin/dashboard'),
  getOrders: (params?: { status?: string; q?: string; page?: number; pageSize?: number }) => 
    apiClient.get<PagedResult<OrderItem>>('/admin/orders', { params }),
  getOrderById: (id: number) => apiClient.get<AdminOrderDetail>(`/admin/orders/detail/${id}`),
  updateOrderStatus: (id: number, status: string) => 
    apiClient.put(`/admin/orders/${id}/status`, null, { params: { status } }),
  getUsers: () => apiClient.get<User[]>('/admin/users'),
  createUser: (data: Partial<User>) => apiClient.post<User>('/admin/users', data),
  updateUser: (id: number, data: Partial<User>) => apiClient.put<User>(`/admin/users/${id}`, data),
  deleteUser: (id: number) => apiClient.delete(`/admin/users/${id}`),
  getBanners: () => apiClient.get<Banner[]>('/banners'),
  createBanner: (data: Partial<Banner>) => apiClient.post<Banner>('/banners', data),
  updateBanner: (id: number, data: Partial<Banner>) => apiClient.put<Banner>(`/banners/${id}`, data),
  deleteBanner: (id: number) => apiClient.delete(`/banners/${id}`),
  getSettings: () => apiClient.get<any>('/admin/settings'),
  getReservations: () => apiClient.get<Reservation[]>('/Reservations'),
  createReservation: (data: Partial<Reservation>) => apiClient.post<Reservation>('/Reservations', data),
  updateReservation: (id: number, data: Partial<Reservation>) => apiClient.put(`/Reservations/${id}`, data),
  deleteReservation: (id: number) => apiClient.delete(`/Reservations/${id}`),
};

export default adminService;
