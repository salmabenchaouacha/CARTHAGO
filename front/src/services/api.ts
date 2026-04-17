import { regions, partners, products, reviews, type Region, type Partner, type Product, type Review } from '@/data/mockData';
import axios from "axios"; 
// Simulated API delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Regions
  async getRegions(): Promise<Region[]> {
    await delay();
    return regions;
  },
  async getRegion(id: string): Promise<Region | undefined> {
    await delay();
    return regions.find(r => r.id === id);
  },

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

  //AI Trip Planner
  async generateTrip(params: {
  duration: number;
  budget: string;
  travelType: string;
  interests: string[];
  regions: string[];
}) {
  const res = await axios.post(
    "http://localhost:8000/api/ai/generate-plan/",
    {
      duration: params.duration,
      travel_type: params.travelType,
      interests: params.interests,
      regions: params.regions,
      budget: params.budget,
    }
  );

  return res.data.plan; // 👈 VERY IMPORTANT
}
};
