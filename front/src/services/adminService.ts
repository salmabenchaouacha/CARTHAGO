import api from "./api";
import {
  type AdminUser,
  type AdminPartner,
  type AdminProduct,
  type AdminOrder,
  type AdminBooking,
} from "@/types";

// ── Users ──────────────────────────────────────────────────────────────────────
export const getAdminUsers = (): Promise<AdminUser[]> =>
  api.get("/admin/users/").then(r => r.data);

// ── Partners ───────────────────────────────────────────────────────────────────
export const getAdminPartners = (): Promise<AdminPartner[]> =>
  api.get("/admin/partners/").then(r => r.data);

export const verifyPartner = (id: number, is_verified: boolean) =>
  api.patch(`/admin/partners/${id}/verify/`, { is_verified }).then(r => r.data);

// ── Products ───────────────────────────────────────────────────────────────────
export const getAdminProducts = (): Promise<AdminProduct[]> =>
  api.get("/admin/products/").then(r => r.data);

export const toggleProduct = (id: number, is_active: boolean) =>
  api.patch(`/admin/products/${id}/toggle/`, { is_active }).then(r => r.data);

export const deleteAdminProduct = (id: number) =>
  api.delete(`/admin/products/${id}/delete/`);

// ── Orders ─────────────────────────────────────────────────────────────────────
export const getAdminOrders = (): Promise<AdminOrder[]> =>
  api.get("/admin/orders/").then(r => r.data);

export const updateOrderStatus = (id: number, status: string) =>
  api.patch(`/admin/orders/${id}/status/`, { status }).then(r => r.data);

// ── Bookings ───────────────────────────────────────────────────────────────────
export const getAdminBookings = (): Promise<AdminBooking[]> =>
  api.get("/admin/bookings/").then(r => r.data);

export const updateBookingStatus = (id: number, status: string) =>
  api.patch(`/admin/bookings/${id}/status/`, { status }).then(r => r.data);