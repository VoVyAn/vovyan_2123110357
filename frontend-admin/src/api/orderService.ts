import apiClient from './apiClient';

export interface POSOrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface POSOrderRequest {
  tableId: number | null;
  items: POSOrderItem[];
  totalAmount: number;
  userId: number | null;
  discountCode: string | null;
}

const createPOSOrder = (orderData: POSOrderRequest) => {
  return apiClient.post('/orders/pos', orderData);
};

const validatePin = (pin: string) => {
  return apiClient.get(`/orders/validate-pin/${pin}`);
};

export default {
  createPOSOrder,
  validatePin
};
