export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string | null;
  is_active: boolean;
  partner: { id: number; business_name: string };
  category: { name: string; slug: string };
  region: { name: string; slug: string };
};

export type Partner = {
  id: number;
  business_name: string;
  activity_type: string;
  description: string;
  address: string;
  is_verified: boolean;
  latitude: string | null;
  longitude: string | null;
  user__full_name: string;
  region__name: string;
  region__slug: string;
};

export type Region = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
};