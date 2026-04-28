import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

import PublicLayout from "@/layouts/PublicLayout";

import HomePage from "@/pages/HomePage";
import DiscoverPage from "@/pages/DiscoverPage";
import RegionsPage from "@/pages/RegionsPage";
import RegionDetailPage from "@/pages/RegionDetailPage";
import PartnersPage from "@/pages/PartnersPage";
import PartnerDetailPage from "@/pages/PartnerDetailPage";
import MarketplacePage from "@/pages/MarketplacePage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import MapPage from "@/pages/MapPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/routes/ProtectedRoute";


import UserDashboard, { UserProfile, UserFavorites, UserReservations, UserOrders } from "@/pages/dashboards/UserDashboard";
import PartnerDashboard, { PartnerProfile, PartnerServices, PartnerProducts } from "@/pages/dashboards/PartnerDashboard";

import AdminDashboard, {
  AdminUsers, AdminPartners, AdminProducts,
  AdminOrders,   // ← nouveau
  AdminBookings, // ← nouveau
} from '@/pages/dashboards/AdminDashboard';
import { UserDashboardLayout, PartnerDashboardLayout, AdminDashboardLayout } from "@/layouts/DashboardLayout";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />

            <Routes>
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
                <Route path="/carte" element={<MapPage />} />
              </Route>

              // User dashboard — réservé aux users
              <Route element={
                <ProtectedRoute role="user">
                  <UserDashboardLayout />
                </ProtectedRoute>
              }>
              <Route path="/utilisateur" element={<UserDashboard />} />
              <Route path="/utilisateur/profil" element={<UserProfile />} />
              <Route path="/utilisateur/favoris" element={<UserFavorites />} />
              <Route path="/utilisateur/reservations" element={<UserReservations />} />
              <Route path="/utilisateur/commandes" element={<UserOrders />} />
            </Route>

            // Partner dashboard — réservé aux partners
            <Route element={
              <ProtectedRoute role="partner">
                <PartnerDashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="/partenaire" element={<PartnerDashboard />} />
              <Route path="/partenaire/profil" element={<PartnerProfile />} />
              <Route path="/partenaire/services" element={<PartnerServices />} />
              <Route path="/partenaire/produits" element={<PartnerProducts />} />
            </Route>

            // Admin dashboard — réservé aux admins
            <Route element={
              <ProtectedRoute role="admin">
                <AdminDashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/utilisateurs" element={<AdminUsers />} />
              <Route path="/admin/partenaires" element={<AdminPartners />} />
              <Route path="/admin/produits" element={<AdminProducts />} />
              <Route path="/admin/commandes"    element={<AdminOrders />}   />
              <Route path="/admin/reservations" element={<AdminBookings />} />
            </Route>
              


              <Route path="/connexion" element={<LoginPage />} />
              <Route path="/inscription" element={<RegisterPage />} />
              <Route path="/inscription-partenaire" element={<RegisterPage isPartner />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;