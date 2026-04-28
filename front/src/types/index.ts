// Format liste (GET /products/ avec .values())
export type ProductList = {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  image: string | null;
  is_active: boolean;
  partner__business_name: string;
  category__name: string;
  category__slug: string;
  region__name: string;
  region__slug: string;
};

// Format détail (GET /products/:id/)
export type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  image: string | null;
  is_active: boolean;
  partner: { id: number; business_name: string };
  category: { name: string; slug: string };
  region: { name: string; slug: string };
};

// Format liste (GET /partners/ avec .values())
export type PartnerList = {
  id: number;
  business_name: string;
  activity_type: string;
  description: string;
  address: string;
  is_verified: boolean;
  latitude: string | null;
  longitude: string | null;
  region__name: string;
  region__slug: string;
  user__full_name: string;
};

// Format détail (GET /partners/:id/)
export type Partner = {
  id: number;
  business_name: string;
  activity_type: string;
  description: string;
  address: string;
  is_verified: boolean;
  latitude: string | null;
  longitude: string | null;
  user: { username: string; full_name: string };
  region: { name: string; slug: string };
};

export type RegionList = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  specialties: string[];
  activities: string[];
};

export type Booking = {
  id: number;
  booking_date: string;
  guests: number;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  service__id: number;
  service__title: string;
};

export type Order = {
  id: number;
  total_amount: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  shipping_address: string;
  created_at: string;
};
export type ServiceList = {
  id: number;
  title: string;
  description: string;
  price: string;
  address: string;
  is_active: boolean;
  created_at: string;
  partner__business_name: string;
  category__name: string;
  category__slug: string;
  region__name: string;
  region__slug: string;
};

export type PartnerDetail = {
  id: number;
  business_name: string;
  activity_type: string;
  description: string;
  address: string;
  is_verified: boolean;
  latitude: string | null;
  longitude: string | null;
  user: { username: string; full_name: string };
  region: { name: string; slug: string };
};

export type AdminUser = {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  is_staff: boolean;
};

export type AdminPartner = {
  id: number;
  business_name: string;
  activity_type: string;
  is_verified: boolean;
  region__name: string;
  user__username: string;
  user__email: string;
  user__full_name: string;
};

export type AdminProduct = {
  id: number;
  name: string;
  price: string;
  stock: number;
  is_active: boolean;
  partner__business_name: string;
  category__name: string;
  region__name: string;
};

export type AdminOrder = {
  id: number;
  total_amount: string;
  status: string;
  created_at: string;
  user__full_name: string;
  user__username: string;
};

export type AdminBooking = {
  id: number;
  booking_date: string;
  status: string;
  guests: number;
  service__title: string;
  user__full_name: string;
};