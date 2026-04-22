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