import api from "./api";
import { type ServiceList } from "@/types";

// Services du partenaire connecté
export const getMyServices = (): Promise<ServiceList[]> =>
  api.get("/services/", { params: { mine: true } }).then(r => r.data);

export const createService = (payload: {
  title: string;
  description: string;
  price: number;
  address: string;
  category_id: number;
  region_id?: number;
}) => api.post("/services/", payload).then(r => r.data);

export const updateService = (id: number, payload: Partial<{
  title: string;
  description: string;
  price: number;
  address: string;
  is_active: boolean;
  category_id: number;
  region_id: number;
}>) => api.patch(`/services/${id}/`, payload).then(r => r.data);

export const deleteService = (id: number) =>
  api.delete(`/services/${id}/`);
export const getCategories = () =>
  api.get("/categories/").then(r => r.data);