import React from 'react';
import { Heart, Calendar, ShoppingBag, MapPin, Bot } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const StatsCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) => (
  <div className="p-6 rounded-xl bg-card border">
    <div className={`inline-flex p-3 rounded-lg mb-3 ${color}`}>{icon}</div>
    <p className="text-2xl font-bold text-foreground">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

const UserDashboard = () => {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Bonjour, {user?.name} 👋</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={<Heart className="h-5 w-5 text-primary" />} label="Favoris" value="5" color="bg-mediterranean-light" />
        <StatsCard icon={<Calendar className="h-5 w-5 text-accent" />} label="Réservations" value="2" color="bg-secondary" />
        <StatsCard icon={<ShoppingBag className="h-5 w-5 text-olive" />} label="Commandes" value="3" color="bg-muted" />
        <StatsCard icon={<Bot className="h-5 w-5 text-gold" />} label="Itinéraires IA" value="1" color="bg-secondary" />
      </div>
      <div className="p-6 rounded-xl bg-card border">
        <h2 className="font-display text-lg font-bold mb-4">Activité récente</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>📅 Réservation confirmée — Dar El Medina (15 mai 2026)</p>
          <p>🛒 Commande expédiée — Assiette Céramique Bleue</p>
          <p>❤️ Ajouté aux favoris — Restaurant Le Golfe</p>
          <p>🤖 Itinéraire IA généré — 5 jours Tunis-Sousse-Djerba</p>
        </div>
      </div>
    </div>
  );
};

export const UserProfile = () => {
  const { user } = useAuth();
  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-bold mb-6">Mon profil</h1>
      <div className="p-6 rounded-xl bg-card border space-y-4">
        <div><label className="text-sm text-muted-foreground">Nom</label><p className="font-medium">{user?.name}</p></div>
        <div><label className="text-sm text-muted-foreground">Email</label><p className="font-medium">{user?.email}</p></div>
        <div><label className="text-sm text-muted-foreground">Rôle</label><p className="font-medium capitalize">{user?.role}</p></div>
        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Modifier le profil</button>
      </div>
    </div>
  );
};

export const UserFavorites = () => (
  <div><h1 className="font-display text-2xl font-bold mb-6">Mes favoris</h1><p className="text-muted-foreground">Vous n'avez pas encore de favoris.</p></div>
);

export const UserReservations = () => (
  <div>
    <h1 className="font-display text-2xl font-bold mb-6">Mes réservations</h1>
    <div className="p-4 rounded-xl bg-card border flex items-center gap-4">
      <Calendar className="h-8 w-8 text-primary" />
      <div><p className="font-medium">Dar El Medina — 2 nuits</p><p className="text-sm text-muted-foreground">15-17 mai 2026 · 240 TND</p></div>
      <span className="ml-auto px-3 py-1 rounded-full bg-olive text-olive-foreground text-xs font-medium">Confirmée</span>
    </div>
  </div>
);

export const UserOrders = () => (
  <div>
    <h1 className="font-display text-2xl font-bold mb-6">Mes commandes</h1>
    <div className="p-4 rounded-xl bg-card border flex items-center gap-4">
      <ShoppingBag className="h-8 w-8 text-accent" />
      <div><p className="font-medium">Assiette Céramique Bleue</p><p className="text-sm text-muted-foreground">Commandé le 10 mars 2026 · 45 TND</p></div>
      <span className="ml-auto px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">Expédiée</span>
    </div>
  </div>
);

export default UserDashboard;
