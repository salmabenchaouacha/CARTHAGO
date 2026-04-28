import React from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Heart, Calendar, ShoppingBag, User, MapPin, ArrowLeft } from 'lucide-react';

const DashboardLayout = ({ role, links }: { role: string; links: { to: string; label: string; icon: React.ReactNode }[] }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || user.role !== role) return <Navigate to="/connexion" replace />;

  return (
    <div className="min-h-screen bg-muted">
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b h-14 flex items-center px-4">
        <Link to="/" className="flex items-center gap-2 mr-6">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="font-display text-lg font-bold">Explore Tunisia</span>
        </Link>
        <span className="text-sm text-muted-foreground hidden md:block">Espace {role === 'admin' ? 'Administration' : role === 'partner' ? 'Partenaire' : 'Personnel'}</span>
        <div className="ml-auto flex items-center gap-3">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"><ArrowLeft className="h-4 w-4" />Retour au site</Link>
          <span className="text-sm font-medium">{user.name}</span>
        </div>
      </header>
      <div className="flex pt-14">
        <aside className="hidden md:flex flex-col w-56 fixed left-0 top-14 bottom-0 bg-card border-r p-4 gap-1">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                location.pathname === link.to ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </aside>
        <main className="flex-1 md:ml-56 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const UserDashboardLayout = () => (
  <DashboardLayout
    role="user"
    links={[
      { to: '/utilisateur', label: 'Tableau de bord', icon: <LayoutDashboard className="h-4 w-4" /> },
      { to: '/utilisateur/profil', label: 'Mon profil', icon: <User className="h-4 w-4" /> },
      { to: '/utilisateur/favoris', label: 'Mes favoris', icon: <Heart className="h-4 w-4" /> },
      { to: '/utilisateur/reservations', label: 'Réservations', icon: <Calendar className="h-4 w-4" /> },
      { to: '/utilisateur/commandes', label: 'Commandes', icon: <ShoppingBag className="h-4 w-4" /> },
    ]}
  />
);

export const PartnerDashboardLayout = () => (
  <DashboardLayout
    role="partner"
    links={[
      { to: '/partenaire', label: 'Tableau de bord', icon: <LayoutDashboard className="h-4 w-4" /> },
      { to: '/partenaire/profil', label: 'Mon profil', icon: <User className="h-4 w-4" /> },
      { to: '/partenaire/services', label: 'Mes services', icon: <Calendar className="h-4 w-4" /> },
      { to: '/partenaire/produits', label: 'Mes produits', icon: <ShoppingBag className="h-4 w-4" /> },
    ]}
  />
);

export const AdminDashboardLayout = () => (
  <DashboardLayout
    role="admin"
    links={[
      { to: '/admin', label: 'Tableau de bord', icon: <LayoutDashboard className="h-4 w-4" /> },
      { to: '/admin/utilisateurs', label: 'Utilisateurs', icon: <User className="h-4 w-4" /> },
      { to: '/admin/partenaires', label: 'Partenaires', icon: <Heart className="h-4 w-4" /> },
      { to: '/admin/produits', label: 'Produits', icon: <ShoppingBag className="h-4 w-4" /> },
      { to: '/admin/commandes', label: 'Commandes', icon: <Calendar className="h-4 w-4" /> },
      { to: '/admin/reservations', label: 'Réservations', icon: <Calendar className="h-4 w-4" /> },
    ]}
  />
);
