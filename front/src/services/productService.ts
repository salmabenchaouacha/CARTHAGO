import api from "./api";
import { type Product } from "@/types";

export const getProducts = (params?: {
  region?: string;
  category?: string;
  q?: string;
}): Promise<Product[]> => api.get("/products/", { params }).then(r => r.data);

export const getProductDetail = (id: number): Promise<Product> =>
  api.get(`/products/${id}/`).then(r => r.data);