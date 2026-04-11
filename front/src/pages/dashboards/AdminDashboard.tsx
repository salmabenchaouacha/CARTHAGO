import React from 'react';
import { Users, Handshake, ShoppingBag, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';

const AdminDashboard = () => (
  <div>
    <h1 className="font-display text-2xl font-bold mb-6">Administration</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div className="p-6 rounded-xl bg-card border"><div className="inline-flex p-3 rounded-lg bg-mediterranean-light mb-3"><Users className="h-5 w-5 text-primary" /></div><p className="text-2xl font-bold">1,248</p><p className="text-sm text-muted-foreground">Utilisateurs</p></div>
      <div className="p-6 rounded-xl bg-card border"><div className="inline-flex p-3 rounded-lg bg-secondary mb-3"><Handshake className="h-5 w-5 text-accent" /></div><p className="text-2xl font-bold">86</p><p className="text-sm text-muted-foreground">Partenaires</p></div>
      <div className="p-6 rounded-xl bg-card border"><div className="inline-flex p-3 rounded-lg bg-muted mb-3"><ShoppingBag className="h-5 w-5 text-olive" /></div><p className="text-2xl font-bold">342</p><p className="text-sm text-muted-foreground">Commandes</p></div>
      <div className="p-6 rounded-xl bg-card border"><div className="inline-flex p-3 rounded-lg bg-secondary mb-3"><DollarSign className="h-5 w-5 text-gold" /></div><p className="text-2xl font-bold">45,600 TND</p><p className="text-sm text-muted-foreground">Revenus</p></div>
      <div className="p-6 rounded-xl bg-card border"><div className="inline-flex p-3 rounded-lg bg-mediterranean-light mb-3"><TrendingUp className="h-5 w-5 text-primary" /></div><p className="text-2xl font-bold">+23%</p><p className="text-sm text-muted-foreground">Croissance</p></div>
      <div className="p-6 rounded-xl bg-card border"><div className="inline-flex p-3 rounded-lg bg-muted mb-3"><BarChart3 className="h-5 w-5 text-accent" /></div><p className="text-2xl font-bold">567</p><p className="text-sm text-muted-foreground">Réservations</p></div>
    </div>
    <div className="p-6 rounded-xl bg-card border">
      <h2 className="font-display text-lg font-bold mb-4">Activité récente</h2>
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>👤 Nouveau partenaire inscrit : Restaurant Le Golfe</p>
        <p>⚠️ Avis signalé — Dar El Medina (en attente de modération)</p>
        <p>✅ Partenaire vérifié : Atelier Céramique Nabeul</p>
        <p>🛒 Nouvelle commande #1247 — 120 TND</p>
      </div>
    </div>
  </div>
);

export const AdminUsers = () => (
  <div>
    <h1 className="font-display text-2xl font-bold mb-6">Gestion des utilisateurs</h1>
    <div className="rounded-xl bg-card border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted"><tr><th className="text-left p-3 font-medium">Nom</th><th className="text-left p-3 font-medium">Email</th><th className="text-left p-3 font-medium">Rôle</th><th className="text-left p-3 font-medium">Actions</th></tr></thead>
        <tbody>
          <tr className="border-t"><td className="p-3">Sophie Martin</td><td className="p-3 text-muted-foreground">sophie@example.com</td><td className="p-3"><span className="px-2 py-0.5 rounded-full bg-mediterranean-light text-primary text-xs">Utilisateur</span></td><td className="p-3"><button className="text-xs text-primary">Modifier</button></td></tr>
          <tr className="border-t"><td className="p-3">Pierre Dupont</td><td className="p-3 text-muted-foreground">pierre@example.com</td><td className="p-3"><span className="px-2 py-0.5 rounded-full bg-mediterranean-light text-primary text-xs">Utilisateur</span></td><td className="p-3"><button className="text-xs text-primary">Modifier</button></td></tr>
        </tbody>
      </table>
    </div>
  </div>
);

export const AdminPartners = () => (
  <div>
    <h1 className="font-display text-2xl font-bold mb-6">Gestion des partenaires</h1>
    <div className="rounded-xl bg-card border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted"><tr><th className="text-left p-3 font-medium">Nom</th><th className="text-left p-3 font-medium">Type</th><th className="text-left p-3 font-medium">Région</th><th className="text-left p-3 font-medium">Statut</th></tr></thead>
        <tbody>
          <tr className="border-t"><td className="p-3">Dar El Medina</td><td className="p-3 text-muted-foreground">Maison d'hôte</td><td className="p-3">Tunis</td><td className="p-3"><span className="px-2 py-0.5 rounded-full bg-olive text-olive-foreground text-xs">Vérifié</span></td></tr>
          <tr className="border-t"><td className="p-3">Restaurant Le Golfe</td><td className="p-3 text-muted-foreground">Restaurant</td><td className="p-3">Sousse</td><td className="p-3"><span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs">En attente</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>
);

export const AdminProducts = () => (
  <div>
    <h1 className="font-display text-2xl font-bold mb-6">Gestion des produits</h1>
    <p className="text-muted-foreground">Liste de tous les produits de la marketplace avec modération.</p>
  </div>
);

export default AdminDashboard;
