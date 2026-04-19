import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { type Region } from '@/data/mockData';
import { type Partner, type Product } from '@/types';

// ─── RegionCard — reste sur mockData (pas encore de backend regions) ───────────

export const RegionCard = ({ region, index = 0 }: { region: Region; index?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.4 }}
    viewport={{ once: true }}
  >
    <Link
      to={`/regions/${region.id}`}
      className="group block rounded-xl overflow-hidden bg-card hover-lift border"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={region.image}
          alt={region.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h3 className="font-display text-xl font-bold text-primary-foreground">{region.name}</h3>
          <p className="text-primary-foreground/80 text-sm flex items-center gap-1">
            <MapPin className="h-3 w-3" />{region.activities.length} activités
          </p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-muted-foreground text-sm line-clamp-2">{region.description}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {region.specialties.slice(0, 3).map(s => (
            <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              {s}
            </span>
          ))}
        </div>
      </div>
    </Link>
  </motion.div>
);

// ─── PartnerCard — données Django ──────────────────────────────────────────────

const ACTIVITY_LABELS: Record<string, string> = {
  restaurant: 'Restaurant',
  guesthouse: "Maison d'hôte",
  artisan: 'Artisan',
  guide: 'Guide',
  experience: 'Expérience',
};

export const PartnerCard = ({ partner, index = 0 }: { partner: Partner; index?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.4 }}
    viewport={{ once: true }}
  >
    <Link
      to={`/partenaires/${partner.id}`}
      className="group block rounded-xl overflow-hidden bg-card hover-lift border"
    >
      {/* Pas d'image dans le backend pour l'instant — placeholder */}
      <div className="relative h-48 overflow-hidden bg-muted flex items-center justify-center">
        <span className="text-4xl text-muted-foreground">🏪</span>

        {/* Badge type d'activité */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
          {ACTIVITY_LABELS[partner.activity_type] || partner.activity_type}
        </span>

        {/* Badge vérifié */}
        {partner.is_verified && (
          <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-teal-500/90 text-white text-xs font-medium">
            <BadgeCheck className="h-3 w-3" /> Vérifié
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-foreground mb-1">
          {partner.business_name}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
          {partner.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {partner.region__name}
          </span>
          <span className="text-xs text-muted-foreground">
            {partner.user__full_name}
          </span>
        </div>
      </div>
    </Link>
  </motion.div>
);

// ─── ProductCard — données Django ──────────────────────────────────────────────

export const ProductCard = ({
  product,
  onAddToCart,
  index = 0,
}: {
  product: Product;
  onAddToCart?: () => void;
  index?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.4 }}
    viewport={{ once: true }}
    className="rounded-xl overflow-hidden bg-card hover-lift border"
  >
    <Link to={`/marketplace/${product.id}`} className="block">
      <div className="relative h-48 overflow-hidden bg-muted">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-muted-foreground">
            🛍️
          </div>
        )}
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold">
          {Number(product.price).toFixed(2)} TND
        </span>

        {/* Rupture de stock */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-xs font-medium">
              Rupture de stock
            </span>
          </div>
        )}
      </div>
    </Link>

    <div className="p-4">
      <Link to={`/marketplace/${product.id}`}>
        <h3 className="font-display text-base font-semibold text-foreground mb-1 line-clamp-1">
          {product.name}
        </h3>
      </Link>
      <p className="text-muted-foreground text-xs mb-1 line-clamp-2">{product.description}</p>
      <p className="text-xs text-muted-foreground mb-3">
        Par <span className="text-foreground font-medium">{product.partner?.business_name}</span>
        {product.region?.name && (
          <span> · <MapPin className="h-3 w-3 inline" /> {product.region.name}</span>
        )}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
          {product.category?.name}
        </span>
        {onAddToCart && (
          <button
            onClick={e => { e.preventDefault(); onAddToCart(); }}
            disabled={product.stock === 0}
            className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ajouter au panier
          </button>
        )}
      </div>
    </div>
  </motion.div>
);