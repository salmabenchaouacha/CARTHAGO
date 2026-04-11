import { regions, partners, products, reviews, type Region, type Partner, type Product, type Review } from '@/data/mockData';

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

  // AI Trip Planner (simulated)
  async generateTrip(params: {
    duration: number;
    budget: string;
    travelType: string;
    interests: string[];
    regions: string[];
  }) {
    await delay(1000);
    const days = [];
    const allRegions = params.regions.length > 0 ? params.regions : ['tunis', 'sousse', 'djerba'];
    
    for (let i = 0; i < params.duration; i++) {
      const regionId = allRegions[i % allRegions.length];
      const region = regions.find(r => r.id === regionId);
      const regionPartners = partners.filter(p => p.region === regionId);
      const restaurant = regionPartners.find(p => p.type === 'restaurant');
      const accommodation = regionPartners.find(p => p.type === 'guesthouse');
      
      days.push({
        day: i + 1,
        region: region?.name || 'Tunis',
        weather: { temp: Math.floor(Math.random() * 10) + 22, condition: ['Ensoleillé', 'Partiellement nuageux', 'Clair'][Math.floor(Math.random() * 3)] },
        activities: [
          { time: '09:00', title: region?.activities[0] || 'Visite culturelle', description: 'Découverte guidée des sites principaux' },
          { time: '12:30', title: `Déjeuner - ${restaurant?.name || 'Restaurant local'}`, description: 'Cuisine tunisienne authentique' },
          { time: '15:00', title: region?.activities[1] || 'Exploration libre', description: 'Temps libre pour explorer' },
          { time: '19:00', title: 'Dîner et soirée', description: 'Soirée détente et gastronomie locale' },
        ],
        accommodation: accommodation?.name || 'Hôtel local',
        estimatedCost: params.budget === 'economique' ? 80 : params.budget === 'moyen' ? 150 : 300,
      });
    }
    return { days, totalCost: days.reduce((s, d) => s + d.estimatedCost, 0) };
  },
};
