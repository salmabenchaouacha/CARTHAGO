import api from "./api";
import { type Booking } from "@/types";

export const getMyBookings = (): Promise<Booking[]> =>
  api.get("/bookings/").then(r => r.data);