import api from "./api";
import { type RegionList } from "@/types";

export const getRegions = (): Promise<RegionList[]> =>
  api.get("/regions/").then(r => r.data);

export const getRegionDetail = (id: number): Promise<RegionList> =>
  api.get(`/regions/${id}/`).then(r => r.data);