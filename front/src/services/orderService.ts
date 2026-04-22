import api from "./api";
import { type Order } from "@/types";

export const getMyOrders = (): Promise<Order[]> =>
  api.get("/orders/").then(r => r.data);

export const createOrder = (payload: {
  shipping_address: string;
  items: { product_id: number; quantity: number }[];
}) => api.post("/orders/", payload).then(r => r.data);

