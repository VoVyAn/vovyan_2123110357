import apiClient from './apiClient';

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  createdAt: string;
}

export interface ProductDTO {
  categoryId: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface CategoryDTO {
  name: string;
}

const productService = {
  getProducts: () => apiClient.get<Product[]>('/Products'),
  getCategories: () => apiClient.get<Category[]>('/Categories'),
  createProduct: (data: ProductDTO) => apiClient.post<Product>('/Products', data),
  updateProduct: (id: number, data: ProductDTO) => apiClient.put<Product>(`/Products/${id}`, data),
  deleteProduct: (id: number) => apiClient.delete(`/Products/${id}`),
  createCategory: (data: CategoryDTO) => apiClient.post<Category>('/Categories', data),
  updateCategory: (id: number, data: CategoryDTO) => apiClient.put<Category>(`/Categories/${id}`, data),
  deleteCategory: (id: number) => apiClient.delete(`/Categories/${id}`),
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<{ url: string }>('/products/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

export default productService;
