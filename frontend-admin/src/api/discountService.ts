import apiClient from './apiClient';

export interface DiscountCode {
  id: number;
  code: string;
  percentage: number;
  expiryDate?: string;
  isActive: boolean;
}

export interface DiscountCodeDTO {
  code: string;
  percentage: number;
  expiryDate?: string;
  isActive: boolean;
}

const discountService = {
  getDiscounts: () => apiClient.get<DiscountCode[]>('/Discount'),
  getDiscount: (id: number) => apiClient.get<DiscountCode>(`/Discount/${id}`),
  createDiscount: (data: DiscountCodeDTO) => apiClient.post<DiscountCode>('/Discount', data),
  updateDiscount: (id: number, data: DiscountCodeDTO) => apiClient.put<DiscountCode>(`/Discount/${id}`, data),
  deleteDiscount: (id: number) => apiClient.delete(`/Discount/${id}`),
};

export default discountService;
