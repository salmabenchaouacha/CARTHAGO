import React, { useEffect, useState } from 'react';
import {
  Users, Handshake, ShoppingBag, DollarSign, Calendar, BarChart3,
  BadgeCheck, Trash2, ToggleLeft, ToggleRight
} from 'lucide-react';
import {
  getAdminUsers, getAdminPartners, verifyPartner,
  getAdminProducts, toggleProduct, deleteAdminProduct,
  getAdminOrders, updateOrderStatus,
  getAdminBookings, updateBookingStatus,
} from '@/services/adminService';
import {
  type AdminUser, type AdminPartner, type AdminProduct,
  type AdminOrder, type AdminBooking,
} from '@/types';

// ─── Helpers ───────────────────────────────────────────────────────────────────

const ROLE_COLORS: Record<string, string> = {
  user:    'bg-mediterranean-light text-primary',
  partner: 'bg-secondary text-secondary-foreground',
  admin:   'bg-destructive/10 text-destructive',
};

const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
const BOOKING_STATUSES = ['pending', 'confirmed', 'cancelled'];

const Badge = ({ label, color }: { label: string; color: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{label}</span>
);

// ─── AdminDashboard ────────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0, partners: 0, products: 0, orders: 0, bookings: 0,
  });
  const [recentOrders, setRecentOrders]   = useState<AdminOrder[]>([]);
  const [recentBookings, setRecentBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAdminUsers(),
      getAdminPartners(),
      getAdminProducts(),
      getAdminOrders(),
      getAdminBookings(),
    ]).then(([users, partners, products, orders, bookings]) => {
      setStats({
        users: users.length,
        partners: partners.length,
        products: products.length,
        orders: orders.length,
        bookings: bookings.length,
      });
      setRecentOrders(orders.slice(0, 3));
      setRecentBookings(bookings.slice(0, 3));
    }).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { icon: <Users className="h-5 w-5 text-primary" />,     color: 'bg-mediterranean-light', value: stats.users,    label: 'Utilisateurs' },
    { icon: <Handshake className="h-5 w-5 text-accent" />,  color: 'bg-secondary',            value: stats.partners, label: 'Partenaires' },
    { icon: <ShoppingBag className="h-5 w-5 text-olive" />, color: 'bg-muted',                value: stats.products, label: 'Produits' },
    { icon: <DollarSign className="h-5 w-5 text-gold" />,   color: 'bg-secondary',            value: stats.orders,   label: 'Commandes' },
    { icon: <Calendar className="h-5 w-5 text-primary" />,  color: 'bg-mediterranean-light',  value: stats.bookings, label: 'Réservations' },
    { icon: <BarChart3 className="h-5 w-5 text-accent" />,  color: 'bg-muted',                value: '—',            label: 'Revenus' },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Administration</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((s, i) => (
          <div key={i} className="p-6 rounded-xl bg-card border">
            <div className={`inline-flex p-3 rounded-lg mb-3 ${s.color}`}>{s.icon}</div>
            <p className="text-2xl font-bold">{loading ? '…' : s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dernières commandes */}
        <div className="p-6 rounded-xl bg-card border">
          <h2 className="font-display text-lg font-bold mb-4">Dernières commandes</h2>
          {loading ? <p className="text-sm text-muted-foreground">Chargement...</p> : (
            <div className="space-y-3">
              {recentOrders.map(o => (
                <div key={o.id} className="flex items-center gap-3 text-sm">
                  <span className="flex-1 font-medium">#{o.id} — {o.user__full_name}</span>
                  <span className="text-muted-foreground">{Number(o.total_amount).toFixed(2)} TND</span>
                  <Badge label={o.status} color="bg-secondary text-secondary-foreground" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dernières réservations */}
        <div className="p-6 rounded-xl bg-card border">
          <h2 className="font-display text-lg font-bold mb-4">Dernières réservations</h2>
          {loading ? <p className="text-sm text-muted-foreground">Chargement...</p> : (
            <div className="space-y-3">
              {recentBookings.map(b => (
                <div key={b.id} className="flex items-center gap-3 text-sm">
                  <span className="flex-1 font-medium">{b.service__title}</span>
                  <span className="text-muted-foreground">{b.user__full_name}</span>
                  <Badge label={b.status} color="bg-secondary text-secondary-foreground" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── AdminUsers ────────────────────────────────────────────────────────────────

export const AdminUsers = () => {
  const [users, setUsers]     = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  useEffect(() => {
    getAdminUsers().then(setUsers).finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Gestion des utilisateurs</h1>
      <input
        type="text"
        placeholder="Rechercher..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-sm px-3 py-2 rounded-lg border bg-card text-foreground text-sm mb-4"
      />
      {loading ? <p className="text-muted-foreground">Chargement...</p> : (
        <div className="rounded-xl bg-card border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Nom</th>
                <th className="text-left p-3 font-medium">Email</th>
                <th className="text-left p-3 font-medium">Username</th>
                <th className="text-left p-3 font-medium">Rôle</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-t hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{u.full_name || '—'}</td>
                  <td className="p-3 text-muted-foreground">{u.email}</td>
                  <td className="p-3 text-muted-foreground">@{u.username}</td>
                  <td className="p-3">
                    <Badge label={u.role} color={ROLE_COLORS[u.role] ?? 'bg-muted text-muted-foreground'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8 text-sm">Aucun utilisateur trouvé.</p>
          )}
        </div>
      )}
    </div>
  );
};

// ─── AdminPartners ─────────────────────────────────────────────────────────────

export const AdminPartners = () => {
  const [partners, setPartners] = useState<AdminPartner[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');

  const load = () => {
    setLoading(true);
    getAdminPartners().then(setPartners).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleVerify = async (id: number, current: boolean) => {
    await verifyPartner(id, !current);
    load();
  };

  const filtered = partners.filter(p =>
    p.business_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.region__name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Gestion des partenaires</h1>
      <input
        type="text"
        placeholder="Rechercher..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-sm px-3 py-2 rounded-lg border bg-card text-foreground text-sm mb-4"
      />
      {loading ? <p className="text-muted-foreground">Chargement...</p> : (
        <div className="rounded-xl bg-card border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Nom</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-left p-3 font-medium">Région</th>
                <th className="text-left p-3 font-medium">Statut</th>
                <th className="text-left p-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-t hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{p.business_name}</td>
                  <td className="p-3 text-muted-foreground">{p.activity_type}</td>
                  <td className="p-3 text-muted-foreground">{p.region__name || '—'}</td>
                  <td className="p-3">
                    <Badge
                      label={p.is_verified ? 'Vérifié' : 'En attente'}
                      color={p.is_verified ? 'bg-teal-100 text-teal-700' : 'bg-secondary text-secondary-foreground'}
                    />
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleVerify(p.id, p.is_verified)}
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition-colors ${
                        p.is_verified
                          ? 'text-destructive border-destructive/30 hover:bg-destructive/10'
                          : 'text-teal-600 border-teal-300 hover:bg-teal-50'
                      }`}
                    >
                      <BadgeCheck className="h-3.5 w-3.5" />
                      {p.is_verified ? 'Retirer' : 'Vérifier'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8 text-sm">Aucun partenaire trouvé.</p>
          )}
        </div>
      )}
    </div>
  );
};

// ─── AdminProducts ─────────────────────────────────────────────────────────────

export const AdminProducts = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');

  const load = () => {
    setLoading(true);
    getAdminProducts().then(setProducts).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleToggle = async (id: number, current: boolean) => {
    await toggleProduct(id, !current);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce produit définitivement ?')) return;
    await deleteAdminProduct(id);
    load();
  };

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.partner__business_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Gestion des produits</h1>
      <input
        type="text"
        placeholder="Rechercher..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-sm px-3 py-2 rounded-lg border bg-card text-foreground text-sm mb-4"
      />
      {loading ? <p className="text-muted-foreground">Chargement...</p> : (
        <div className="rounded-xl bg-card border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Produit</th>
                <th className="text-left p-3 font-medium">Partenaire</th>
                <th className="text-left p-3 font-medium">Prix</th>
                <th className="text-left p-3 font-medium">Stock</th>
                <th className="text-left p-3 font-medium">Statut</th>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-t hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-muted-foreground">{p.partner__business_name}</td>
                  <td className="p-3 text-accent font-medium">{Number(p.price).toFixed(2)} TND</td>
                  <td className="p-3 text-muted-foreground">{p.stock}</td>
                  <td className="p-3">
                    <Badge
                      label={p.is_active ? 'Actif' : 'Inactif'}
                      color={p.is_active ? 'bg-teal-100 text-teal-700' : 'bg-muted text-muted-foreground'}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggle(p.id, p.is_active)}
                        title={p.is_active ? 'Désactiver' : 'Activer'}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {p.is_active
                          ? <ToggleRight className="h-5 w-5 text-teal-500" />
                          : <ToggleLeft className="h-5 w-5" />
                        }
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8 text-sm">Aucun produit trouvé.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;