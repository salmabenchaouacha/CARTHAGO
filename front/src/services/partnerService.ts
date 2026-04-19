import api from "./api";
import { type PartnerList, type Partner } from "@/types";

export const getPartners = (params?: {
  region?: string;
  activity_type?: string;
  q?: string;
}): Promise<PartnerList[]> => api.get("/partners/", { params }).then(r => r.data);

export const getPartnerDetail = (id: number): Promise<Partner> =>
  api.get(`/partners/${id}/`).then(r => r.data);