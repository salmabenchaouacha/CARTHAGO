import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

import PublicLayout from "@/layouts/PublicLayout";
import { UserDashboardLayout, PartnerDashboardLayout, AdminDashboardLayout } from "@/layouts/DashboardLayout";

import HomePage from "@/pages/HomePage";
import DiscoverPage from "@/pages/DiscoverPage";
import RegionsPage from "@/pages/RegionsPage";
import RegionDetailPage from "@/pages/RegionDetailPage";
import PartnersPage from "@/pages/PartnersPage";
import PartnerDetailPage from "@/pages/PartnerDetailPage";
import MarketplacePage from "@/pages/MarketplacePage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import AIPlannerPage from "@/pages/AIPlannerPage";
import MapPage from "@/pages/MapPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

import UserDashboard, { UserProfile, UserFavorites, UserReservations, UserOrders } from "@/pages/dashboards/UserDashboard";
import PartnerDashboard, { PartnerProfile, PartnerServices, PartnerProducts } from "@/pages/dashboards/PartnerDashboard";
import AdminDashboard, { AdminUsers, AdminPartners, AdminProducts } from "@/pages/dashboards/AdminDashboard";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/decouvrir" element={<DiscoverPage />} />
                <Route path="/regions" element={<RegionsPage />} />
                <Route path="/regions/:id" element={<RegionDetailPage />} />
                <Route path="/partenaires" element={<PartnersPage />} />
                <Route path="/partenaires/:id" element={<PartnerDetailPage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/marketplace/:id" element={<ProductDetailPage />} />
                <Route path="/panier" element={<CartPage />} />
                <Route path="/planificateur" element={<AIPlannerPage />} />
                <Route path="/carte" element={<MapPage />} />
              </Route>

              {/* Auth routes (no layout) */}
              <Route path="/connexion" element={<LoginPage />} />
              <Route path="/inscription" element={<RegisterPage />} />
              <Route path="/inscription-partenaire" element={<RegisterPage isPartner />} />

              {/* User dashboard */}
              <Route element={<UserDashboardLayout />}>
                <Route path="/utilisateur" element={<UserDashboard />} />
                <Route path="/utilisateur/profil" element={<UserProfile />} />
                <Route path="/utilisateur/favoris" element={<UserFavorites />} />
                <Route path="/utilisateur/reservations" element={<UserReservations />} />
                <Route path="/utilisateur/commandes" element={<UserOrders />} />
              </Route>

              {/* Partner dashboard */}
              <Route element={<PartnerDashboardLayout />}>
                <Route path="/partenaire" element={<PartnerDashboard />} />
                <Route path="/partenaire/profil" element={<PartnerProfile />} />
                <Route path="/partenaire/services" element={<PartnerServices />} />
                <Route path="/partenaire/produits" element={<PartnerProducts />} />
              </Route>

              {/* Admin dashboard */}
              <Route element={<AdminDashboardLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/utilisateurs" element={<AdminUsers />} />
                <Route path="/admin/partenaires" element={<AdminPartners />} />
                <Route path="/admin/produits" element={<AdminProducts />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
