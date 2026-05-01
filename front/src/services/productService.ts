import api from "./api";
import { type ProductList, type Product } from "@/types";

export const getProducts = (params?: {
  region?: string;
  category?: string;
  q?: string;
}): Promise<ProductList[]> => api.get("/products/", { params }).then(r => r.data);

export const getProductDetail = (id: number): Promise<Product> =>
  api.get(`/products/${id}/`).then(r => {
    const data = r.data;
    const baseURL = api.defaults.baseURL?.replace('/api', '') ?? '';
    if (data.image && !data.image.startsWith('http')) {
      data.image = `${baseURL}${data.image}`;
    }
    return data;
  });
export const getMyProducts = (): Promise<ProductList[]> =>
  api.get("/products/", { params: { mine: true } }).then(r => r.data);

export const createProduct = (payload: {
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  region_id?: number;
}) => api.post("/products/", payload).then(r => r.data);

export const updateProduct = (id: number, payload: Partial<{
  name: string;
  description: string;
  price: number;
  stock: number;
  is_active: boolean;
}>) => api.patch(`/products/${id}/`, payload).then(r => r.data);

export const deleteProduct = (id: number) =>
  api.delete(`/products/${id}/`);