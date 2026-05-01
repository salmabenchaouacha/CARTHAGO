import axios from "axios";
import {
  regions,
  partners,
  products,
  reviews,
  type Partner,
  type Product,
  type Review
} from "@/data/mockData";

// Simulated API delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// ✅ instance axios
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// ✅ interceptor JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// =========================
// 🔐 AUTH (IMPORTANT)
// =========================
export const authService = {
  login: async (data: any) => {
    const res = await api.post("/auth/login/", data);
    return res.data;
  },

  register: async (data: any) => {
    const res = await api.post("/auth/register/", data);
    return res.data;
  },
};


// =========================
// 📦 DATA SERVICES
// =========================
export const apiService = {
  // Partners
  async getPartners(filters?: { type?: string; region?: string }): Promise<Partner[]> {
    await delay();
    let result = partners;
    if (filters?.type) result = result.filter(p => p.type === filters.type);
    if (filters?.region) result = result.filter(p => p.region === filters.region);
    return result;
  },

  async getPartner(id: string): Promise<Partner | undefined> {
    await delay();
    return partners.find(p => p.id === id);
  },

  // Products
  async getProducts(filters?: { category?: string; region?: string }): Promise<Product[]> {
    await delay();
    let result = products;
    if (filters?.category) result = result.filter(p => p.category === filters.category);
    if (filters?.region) result = result.filter(p => p.region === filters.region);
    return result;
  },

  async getProduct(id: string): Promise<Product | undefined> {
    await delay();
    return products.find(p => p.id === id);
  },

  // Reviews
  async getReviews(targetId: string): Promise<Review[]> {
    await delay();
    return reviews.filter(r => r.targetId === targetId);
  },

  // 🤖 AI Trip Planner
  async generateTrip(params: {
    duration: number;
    budget: string;
    travelType: string;
    interests: string[];
    regions: string[];
  }) {
    const res = await api.post("/ai/generate-plan/", {
      duration: params.duration,
      travel_type: params.travelType,
      interests: params.interests,
      regions: params.regions,
      budget: params.budget,
    });

    return res.data.plan;
  },

  async chatWithPlan(params: {
    plan: any;
    message: string;
    history: { role: string; content: string }[];
  }) {
    const res = await api.post("/ai/chat-plan/", {
      plan: params.plan,
      message: params.message,
      history: params.history,
    });

    return res.data;
  }
};


// =========================
// ✅ EXPORT PRINCIPAL
// =========================
export default api;