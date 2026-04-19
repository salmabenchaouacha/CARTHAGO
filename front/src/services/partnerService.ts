import api from "./api";
import { type Partner } from "@/types";

export const getPartners = (params?: {
  region?: string;
  activity_type?: string;
  q?: string;
}): Promise<Partner[]> => api.get("/partners/", { params }).then(r => r.data);

export const getPartnerDetail = (id: number): Promise<Partner> =>
  api.get(`/partners/${id}/`).then(r => r.data);