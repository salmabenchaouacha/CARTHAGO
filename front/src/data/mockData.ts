import heroImg from '@/assets/hero-tunisia.jpg';
import artisanatImg from '@/assets/artisanat.jpg';
import gastronomieImg from '@/assets/gastronomie.jpg';
import maisonHoteImg from '@/assets/maison-hote.jpg';
import desertImg from '@/assets/desert.jpg';
import patrimoineImg from '@/assets/patrimoine.jpg';

export interface Region {
  id: string;
  name: string;
  description: string;
  image: string;
  specialties: string[];
  activities: string[];
  lat: number;
  lng: number;
}

export interface Partner {
  id: string;
  name: string;
  type: 'restaurant' | 'guesthouse' | 'artisan' | 'guide' | 'experience';
  description: string;
  image: string;
  region: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  services: string[];
  hours: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  region: string;
  sellerId: string;
  sellerName: string;
  stock: number;
  rating: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  targetId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'partner' | 'admin';
  avatar?: string;
}

export const regions: Region[] = [
  {
    id: 'tunis',
    name: 'Tunis',
    description: 'La capitale, entre médina millénaire et modernité vibrante. Découvrez le Bardo, la Médina classée UNESCO et Carthage.',
    image: heroImg,
    specialties: ['Fricassé', 'Bambalouni', 'Lablabi'],
    activities: ['Visite Médina', 'Musée du Bardo', 'Carthage', 'Sidi Bou Saïd'],
    lat: 36.8065,
    lng: 10.1815,
  },
  {
    id: 'sousse',
    name: 'Sousse',
    description: 'La perle du Sahel, entre plages dorées, médina historique et vie nocturne animée.',
    image: maisonHoteImg,
    specialties: ['Poisson grillé', 'Ojja', 'Makroudh'],
    activities: ['Ribat', 'Port El Kantaoui', 'Plages', 'Médina'],
    lat: 35.8256,
    lng: 10.6369,
  },
  {
    id: 'djerba',
    name: 'Djerba',
    description: "L'île des rêves, plages paradisiaques, synagogue de la Ghriba et villages pittoresques.",
    image: gastronomieImg,
    specialties: ['Couscous au poisson', 'Brik', 'Mloukhia'],
    activities: ['Houmt Souk', 'La Ghriba', 'Plages', 'Crocodile Farm'],
    lat: 33.8076,
    lng: 10.8451,
  },
  {
    id: 'tozeur',
    name: 'Tozeur',
    description: 'Porte du désert, oasis enchanteresses, architecture en briques et paysages lunaires.',
    image: desertImg,
    specialties: ['Dattes Deglet Nour', 'Thé à la menthe', 'Mechoui'],
    activities: ['Chott el Jérid', 'Oasis', 'Ong Jmal', 'Quad désert'],
    lat: 33.9197,
    lng: 8.1335,
  },
  {
    id: 'kairouan',
    name: 'Kairouan',
    description: 'Quatrième ville sainte de l\'Islam, patrimoine spirituel et artisanat du tapis.',
    image: patrimoineImg,
    specialties: ['Makroudh', 'Couscous', 'Méchoui'],
    activities: ['Grande Mosquée', 'Médina', 'Bassins des Aghlabides', 'Souks'],
    lat: 35.6781,
    lng: 10.0963,
  },
  {
    id: 'tabarka',
    name: 'Tabarka',
    description: 'Côte de corail, forêts de chêne-liège et festivals de jazz au bord de la Méditerranée.',
    image: heroImg,
    specialties: ['Fruits de mer', 'Fromage de chèvre', 'Miel'],
    activities: ['Plongée', 'Les Aiguilles', 'Forêt de Kroumirie', 'Festival Jazz'],
    lat: 36.9544,
    lng: 8.758,
  },
];

export const partners: Partner[] = [
  {
    id: 'p1',
    name: 'Dar El Medina',
    type: 'guesthouse',
    description: 'Maison d\'hôte de charme au cœur de la Médina de Tunis. Architecture traditionnelle restaurée avec goût, patio intérieur et terrasse panoramique.',
    image: maisonHoteImg,
    region: 'tunis',
    rating: 4.8,
    reviewCount: 124,
    priceRange: '120-250 TND/nuit',
    address: '14 Rue Sidi Ben Arous, Médina de Tunis',
    phone: '+216 71 123 456',
    lat: 36.7985,
    lng: 10.1700,
    services: ['Wi-Fi', 'Petit-déjeuner', 'Terrasse', 'Climatisation', 'Parking'],
    hours: 'Check-in: 14h - Check-out: 11h',
  },
  {
    id: 'p2',
    name: 'Restaurant Le Golfe',
    type: 'restaurant',
    description: 'Restaurant gastronomique avec vue mer, spécialisé dans les fruits de mer frais et la cuisine tunisienne raffinée.',
    image: gastronomieImg,
    region: 'sousse',
    rating: 4.6,
    reviewCount: 89,
    priceRange: '30-80 TND/personne',
    address: 'Port El Kantaoui, Sousse',
    phone: '+216 73 456 789',
    lat: 35.8900,
    lng: 10.5900,
    services: ['Terrasse vue mer', 'Menu enfant', 'Réservation en ligne', 'Parking'],
    hours: '12h00 - 23h00',
  },
  {
    id: 'p3',
    name: 'Atelier Céramique Nabeul',
    type: 'artisan',
    description: 'Atelier familial de céramique traditionnelle. Démonstrations en direct et vente de pièces uniques peintes à la main.',
    image: artisanatImg,
    region: 'tunis',
    rating: 4.9,
    reviewCount: 67,
    priceRange: '15-200 TND',
    address: 'Souk des Potiers, Nabeul',
    phone: '+216 72 789 012',
    lat: 36.4513,
    lng: 10.7352,
    services: ['Atelier visite', 'Vente directe', 'Expédition', 'Cours poterie'],
    hours: '09h00 - 18h00',
  },
  {
    id: 'p4',
    name: 'Sahara Experience',
    type: 'guide',
    description: 'Excursions guidées dans le désert tunisien. Bivouac sous les étoiles, randonnée chamelière et découverte des oasis.',
    image: desertImg,
    region: 'tozeur',
    rating: 4.7,
    reviewCount: 156,
    priceRange: '150-500 TND/personne',
    address: 'Centre-ville, Tozeur',
    phone: '+216 76 345 678',
    lat: 33.9197,
    lng: 8.1335,
    services: ['Guide bilingue', 'Transport', 'Repas inclus', 'Bivouac', 'Quad'],
    hours: 'Départs quotidiens à 8h et 15h',
  },
  {
    id: 'p5',
    name: 'Dar Dhiafa',
    type: 'guesthouse',
    description: 'Houch traditionnel djerbien converti en maison d\'hôte de luxe. Piscine, jardin d\'oliviers et cuisine locale authentique.',
    image: maisonHoteImg,
    region: 'djerba',
    rating: 4.9,
    reviewCount: 203,
    priceRange: '180-350 TND/nuit',
    address: 'Erriadh, Djerba',
    phone: '+216 75 678 901',
    lat: 33.8200,
    lng: 10.8600,
    services: ['Piscine', 'Spa', 'Restaurant', 'Wi-Fi', 'Transfert aéroport'],
    hours: 'Check-in: 15h - Check-out: 12h',
  },
  {
    id: 'p6',
    name: 'La Table de Kairouan',
    type: 'restaurant',
    description: 'Cuisine kairouanaise authentique dans un cadre historique. Spécialités de makroudh et couscous fait maison.',
    image: gastronomieImg,
    region: 'kairouan',
    rating: 4.5,
    reviewCount: 78,
    priceRange: '20-50 TND/personne',
    address: 'Médina, Kairouan',
    phone: '+216 77 234 567',
    lat: 35.6781,
    lng: 10.0963,
    services: ['Terrasse', 'Groupe', 'Wifi', 'Menu végétarien'],
    hours: '11h00 - 22h00',
  },
];

export const products: Product[] = [
  {
    id: 'prod1',
    name: 'Assiette Céramique Bleue de Nabeul',
    description: 'Magnifique assiette décorative en céramique peinte à la main. Motifs floraux traditionnels bleu et blanc.',
    price: 45,
    image: artisanatImg,
    category: 'Céramique',
    region: 'tunis',
    sellerId: 'p3',
    sellerName: 'Atelier Céramique Nabeul',
    stock: 15,
    rating: 4.8,
  },
  {
    id: 'prod2',
    name: 'Tapis Berbère de Kairouan',
    description: 'Tapis tissé à la main par des artisanes de Kairouan. Laine naturelle, motifs géométriques traditionnels.',
    price: 350,
    image: artisanatImg,
    category: 'Tapis',
    region: 'kairouan',
    sellerId: 'p3',
    sellerName: 'Atelier Tapis Kairouan',
    stock: 5,
    rating: 4.9,
  },
  {
    id: 'prod3',
    name: 'Coffret Dattes Deglet Nour',
    description: 'Coffret premium de dattes Deglet Nour de Tozeur. Sélection des meilleures variétés, emballage cadeau.',
    price: 60,
    image: gastronomieImg,
    category: 'Gastronomie',
    region: 'tozeur',
    sellerId: 'p4',
    sellerName: 'Palmeraie de Tozeur',
    stock: 30,
    rating: 4.7,
  },
  {
    id: 'prod4',
    name: 'Huile d\'Olive Bio Première Pression',
    description: 'Huile d\'olive extra vierge biologique du nord de la Tunisie. Première pression à froid, arôme fruité.',
    price: 35,
    image: gastronomieImg,
    category: 'Gastronomie',
    region: 'tabarka',
    sellerId: 'p3',
    sellerName: 'Domaine Oléicole du Nord',
    stock: 50,
    rating: 4.6,
  },
  {
    id: 'prod5',
    name: 'Lanterne en Cuivre Ciselé',
    description: 'Lanterne artisanale en cuivre finement ciselé. Éclairage d\'ambiance orientale, travail traditionnel tunisien.',
    price: 120,
    image: artisanatImg,
    category: 'Décoration',
    region: 'tunis',
    sellerId: 'p3',
    sellerName: 'Souk du Cuivre Tunis',
    stock: 8,
    rating: 4.8,
  },
  {
    id: 'prod6',
    name: 'Chéchia Traditionnelle',
    description: 'Chéchia rouge traditionnelle tunisienne, confectionnée à la main dans les ateliers de la Médina de Tunis.',
    price: 25,
    image: artisanatImg,
    category: 'Textile',
    region: 'tunis',
    sellerId: 'p3',
    sellerName: 'Chéchia El Medina',
    stock: 20,
    rating: 4.5,
  },
];

export const reviews: Review[] = [
  { id: 'r1', userId: 'u1', userName: 'Sophie Martin', targetId: 'p1', rating: 5, comment: 'Un séjour magique dans cette maison d\'hôte. L\'accueil est exceptionnel et la terrasse offre une vue magnifique sur la Médina.', date: '2025-12-15' },
  { id: 'r2', userId: 'u2', userName: 'Pierre Dupont', targetId: 'p2', rating: 4, comment: 'Excellents fruits de mer, service attentionné. La vue sur le port est superbe au coucher du soleil.', date: '2025-11-20' },
  { id: 'r3', userId: 'u3', userName: 'Marie Leblanc', targetId: 'p4', rating: 5, comment: 'Expérience inoubliable dans le désert ! Le guide était passionné et le bivouac sous les étoiles était magique.', date: '2026-01-10' },
  { id: 'r4', userId: 'u1', userName: 'Sophie Martin', targetId: 'p5', rating: 5, comment: 'Le plus bel hébergement de notre voyage. Le jardin et la piscine sont paradisiaques.', date: '2026-02-05' },
  { id: 'r5', userId: 'u4', userName: 'Ahmed Ben Ali', targetId: 'p3', rating: 5, comment: 'Des pièces magnifiques et une démonstration fascinante. On a pu peindre notre propre assiette !', date: '2026-03-01' },
];

export const categories = [
  { id: 'restaurants', name: 'Restaurants', icon: 'UtensilsCrossed', count: 45 },
  { id: 'guesthouses', name: 'Maisons d\'hôtes', icon: 'Home', count: 32 },
  { id: 'artisans', name: 'Artisans', icon: 'Palette', count: 28 },
  { id: 'guides', name: 'Guides locaux', icon: 'Compass', count: 15 },
  { id: 'experiences', name: 'Expériences', icon: 'Sparkles', count: 22 },
  { id: 'culture', name: 'Culture', icon: 'Landmark', count: 18 },
];

export const mockUsers: User[] = [
  { id: 'u1', name: 'Sophie Martin', email: 'sophie@example.com', role: 'user' },
  { id: 'u2', name: 'Pierre Dupont', email: 'pierre@example.com', role: 'user' },
  { id: 'partner1', name: 'Dar El Medina', email: 'dar@example.com', role: 'partner' },
  { id: 'admin1', name: 'Admin Tunisia', email: 'admin@exploretunisia.com', role: 'admin' },
];
