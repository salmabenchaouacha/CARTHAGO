import api from "./api";
import { type PartnerList, type Partner } from "@/types";



export const getPartners = async (params?: {
  region?: string;
  activity_type?: string;
  q?: string;
}) => {
  const res = await api.get('/partners/', { params });
  return res.data;
};

export const getPartnerDetail = async (id: number) => {
  const res = await api.get(`/partners/${id}/`);
  return res.data;
};