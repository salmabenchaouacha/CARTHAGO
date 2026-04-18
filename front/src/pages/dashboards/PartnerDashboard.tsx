import React from 'react';
import { ShoppingBag, Star, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const PartnerDashboard = () => {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Espace Partenaire — {user?.full_name}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-6 rounded-xl bg-card border"><div className="inline-flex p-3 rounded-lg bg-mediterranean-light mb-3"><ShoppingBag className="h-5 w-5 text-primary" /></div><p className="text-2xl font-bold">12</p><p className="text-sm text-muted-foreground">Produits</p></div>
        <div className="p-6 rounded-xl bg-card border"><div className="inline-flex p-3 rounded-lg bg-secondary mb-3"><Calendar className="h-5 w-5 text-accent" /></div><p className="text-2xl font-bold">8</p><p className="text-sm text-muted-foreground">Réservations</p></div>
        <div className="p-6 rounded-xl bg-card border"><div className="inline-flex p-3 rounded-lg bg-muted mb-3"><Star className="h-5 w-5 text-gold" /></div><p className="text-2xl font-bold">4.8</p><p className="text-sm text-muted-foreground">Note moyenne</p></div>
        <div className="p-6 rounded-xl bg-card border"><div className="inline-flex p-3 rounded-lg bg-secondary mb-3"><TrendingUp className="h-5 w-5 text-olive" /></div><p className="text-2xl font-bold">2,400 TND</p><p className="text-sm text-muted-foreground">Revenus du mois</p></div>
      </div>
      <div className="p-6 rounded-xl bg-card border">
        <h2 className="font-display text-lg font-bold mb-4">Dernières réservations</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>📅 Sophie Martin — 2 nuits (15-17 mai)</p>
          <p>📅 Pierre Dupont — 1 nuit (22 mai)</p>
          <p>📅 Marie Leblanc — 3 nuits (1-4 juin)</p>
        </div>
      </div>
    </div>
  );
};

export const PartnerProfile = () => {
  const { user } = useAuth();
  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-bold mb-6">Mon profil partenaire</h1>
      <div className="p-6 rounded-xl bg-card border space-y-4">
        <div><label className="text-sm text-muted-foreground">Nom</label><p className="font-medium">{user?.full_name}</p></div>
        <div><label className="text-sm text-muted-foreground">Email</label><p className="font-medium">{user?.email}</p></div>
        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Modifier</button>
      </div>
    </div>
  );
};

export const PartnerServices = () => (
  <div><h1 className="font-display text-2xl font-bold mb-6">Mes services</h1><p className="text-muted-foreground">Gérez vos services et offres ici.</p><button className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Ajouter un service</button></div>
);

export const PartnerProducts = () => (
  <div><h1 className="font-display text-2xl font-bold mb-6">Mes produits</h1><p className="text-muted-foreground">Gérez vos produits artisanaux ici.</p><button className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Ajouter un produit</button></div>
);

export default PartnerDashboard;