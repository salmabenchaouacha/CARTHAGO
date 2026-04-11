import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { type Region } from '@/data/mockData';

export const RegionCard = ({ region, index = 0 }: { region: Region; index?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.4 }}
    viewport={{ once: true }}
  >
    <Link to={`/regions/${region.id}`} className="group block rounded-xl overflow-hidden bg-card hover-lift border">
      <div className="relative h-52 overflow-hidden">
        <img src={region.image} alt={region.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h3 className="font-display text-xl font-bold text-primary-foreground">{region.name}</h3>
          <p className="text-primary-foreground/80 text-sm flex items-center gap-1"><MapPin className="h-3 w-3" />{region.activities.length} activités</p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-muted-foreground text-sm line-clamp-2">{region.description}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {region.specialties.slice(0, 3).map(s => (
            <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{s}</span>
          ))}
        </div>
      </div>
    </Link>
  </motion.div>
);

export const PartnerCard = ({ partner, index = 0 }: { partner: any; index?: number }) => {
  const typeLabels: Record<string, string> = {
    restaurant: 'Restaurant', guesthouse: 'Maison d\'hôte', artisan: 'Artisan', guide: 'Guide', experience: 'Expérience'
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      viewport={{ once: true }}
    >
      <Link to={`/partenaires/${partner.id}`} className="group block rounded-xl overflow-hidden bg-card hover-lift border">
        <div className="relative h-48 overflow-hidden">
          <img src={partner.image} alt={partner.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
            {typeLabels[partner.type] || partner.type}
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-display text-lg font-semibold text-foreground mb-1">{partner.name}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{partner.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-gold fill-gold" />
              <span className="text-sm font-medium text-foreground">{partner.rating}</span>
              <span className="text-xs text-muted-foreground">({partner.reviewCount})</span>
            </div>
            <span className="text-sm text-accent font-medium">{partner.priceRange}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const ProductCard = ({ product, onAddToCart, index = 0 }: { product: any; onAddToCart?: () => void; index?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.4 }}
    viewport={{ once: true }}
    className="rounded-xl overflow-hidden bg-card hover-lift border"
  >
    <Link to={`/marketplace/${product.id}`} className="block">
      <div className="relative h-48 overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold">{product.price} TND</span>
      </div>
    </Link>
    <div className="p-4">
      <Link to={`/marketplace/${product.id}`}>
        <h3 className="font-display text-base font-semibold text-foreground mb-1 line-clamp-1">{product.name}</h3>
      </Link>
      <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{product.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 text-gold fill-gold" />
          <span className="text-sm font-medium">{product.rating}</span>
        </div>
        {onAddToCart && (
          <button onClick={(e) => { e.preventDefault(); onAddToCart(); }} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
            Ajouter au panier
          </button>
        )}
      </div>
    </div>
  </motion.div>
);
