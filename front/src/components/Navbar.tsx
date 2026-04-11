import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, MapPin, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import logoCarthago from "@/assets/carthagooLOGOO.png";
const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/decouvrir', label: 'Découvrir' },
    { to: '/regions', label: 'Régions' },
    { to: '/partenaires', label: 'Partenaires' },
    { to: '/marketplace', label: 'Artisanat' },
    { to: '/planificateur', label: 'Assistant IA' },
    { to: '/carte', label: 'Carte' },
  ];

  const getDashboardLink = () => {
    if (!user) return '/connexion';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'partner') return '/partenaire';
    return '/utilisateur';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
   <Link to="/" className="flex items-center">
  <img
    src={logoCarthago}
    alt="Carthago"
    className="h-16 w-auto object-contain"
  />
</Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? 'text-primary bg-mediterranean-light'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/panier" className="relative p-2 hover:bg-muted rounded-full transition-colors">
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to={getDashboardLink()} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                <User className="h-4 w-4" />
                {user?.name}
              </Link>
              <button onClick={logout} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Déconnexion
              </button>
            </div>
          ) : (
            <Link to="/connexion" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              Connexion
            </Link>
          )}

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t bg-card">
          <nav className="container mx-auto py-4 px-4 flex flex-col gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-primary font-medium">
                  Mon espace
                </Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="px-4 py-3 rounded-lg text-left text-muted-foreground">
                  Déconnexion
                </button>
              </>
            ) : (
              <Link to="/connexion" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg bg-primary text-primary-foreground text-center font-medium mt-2">
                Connexion
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
