import React, { useEffect, useState } from 'react';
import { Heart, Calendar, ShoppingBag, Bot } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getMyBookings } from '@/services/bookingService';
import { getMyOrders } from '@/services/orderService';
import { type Booking, type Order } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_BOOKING: Record<string, { label: string; color: string }> = {
  pending:   { label: 'En attente', color: 'bg-secondary text-secondary-foreground' },
  confirmed: { label: 'Confirmée',  color: 'bg-olive text-white' },
  cancelled: { label: 'Annulée',    color: 'bg-destructive text-destructive-foreground' },
};

const STATUS_ORDER: Record<string, { label: string; color: string }> = {
  pending:   { label: 'En attente', color: 'bg-secondary text-secondary-foreground' },
  paid:      { label: 'Payée',      color: 'bg-mediterranean-light text-primary' },
  shipped:   { label: 'Expédiée',   color: 'bg-olive text-white' },
  delivered: { label: 'Livrée',     color: 'bg-teal-500 text-white' },
  cancelled: { label: 'Annulée',    color: 'bg-destructive text-destructive-foreground' },
};

const StatsCard = ({ icon, label, value, color }: {
  icon: React.ReactNode; label: string; value: string | number; color: string;
}) => (
  <div className="p-6 rounded-xl bg-card border">
    <div className={`inline-flex p-3 rounded-lg mb-3 ${color}`}>{icon}</div>
    <p className="text-2xl font-bold text-foreground">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

// ─── UserDashboard ─────────────────────────────────────────────────────────────

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders]     = useState<Order[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([getMyBookings(), getMyOrders()])
      .then(([b, o]) => { setBookings(b); setOrders(o); })
      .finally(() => setLoading(false));
  }, []);

  const recentActivity = [
    ...bookings.slice(0, 2).map(b => ({
      key: `b-${b.id}`,
      icon: '📅',
      text: `Réservation ${STATUS_BOOKING[b.status]?.label ?? b.status} — ${b.service__title}`,
      date: new Date(b.created_at).toLocaleDateString('fr-FR'),
    })),
    ...orders.slice(0, 2).map(o => ({
      key: `o-${o.id}`,
      icon: '🛒',
      text: `Commande ${STATUS_ORDER[o.status]?.label ?? o.status} — ${Number(o.total_amount).toFixed(2)} TND`,
      date: new Date(o.created_at).toLocaleDateString('fr-FR'),
    })),
  ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">
        Bonjour, {user?.full_name} 👋
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={<Heart className="h-5 w-5 text-primary" />}    label="Favoris"       value="—"               color="bg-mediterranean-light" />
        <StatsCard icon={<Calendar className="h-5 w-5 text-accent" />}  label="Réservations"  value={loading ? '…' : bookings.length} color="bg-secondary" />
        <StatsCard icon={<ShoppingBag className="h-5 w-5 text-olive" />} label="Commandes"    value={loading ? '…' : orders.length}   color="bg-muted" />
        <StatsCard icon={<Bot className="h-5 w-5 text-gold" />}         label="Itinéraires IA" value="—"              color="bg-secondary" />
      </div>

      <div className="p-6 rounded-xl bg-card border">
        <h2 className="font-display text-lg font-bold mb-4">Activité récente</h2>
        {loading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : recentActivity.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune activité pour l'instant.</p>
        ) : (
          <div className="space-y-3 text-sm text-muted-foreground">
            {recentActivity.map(a => (
              <p key={a.key}>{a.icon} {a.text} <span className="text-xs">· {a.date}</span></p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── UserProfile ───────────────────────────────────────────────────────────────

export const UserProfile = () => {
  const { user, refreshMe } = useAuth();
  const [form, setForm]       = useState({ full_name: user?.full_name ?? '', phone: user?.phone ?? '' });
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await import('@/services/api').then(m =>
        m.default.patch('/auth/me/', form)
      );
      await refreshMe();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-bold mb-6">Mon profil</h1>
      <div className="p-6 rounded-xl bg-card border space-y-4">

        <div>
          <label className="text-sm text-muted-foreground block mb-1">Nom complet</label>
          <input
            value={form.full_name}
            onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border bg-background text-foreground text-sm"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground block mb-1">Email</label>
          <p className="font-medium text-sm text-muted-foreground">{user?.email}</p>
        </div>

        <div>
          <label className="text-sm text-muted-foreground block mb-1">Téléphone</label>
          <input
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border bg-background text-foreground text-sm"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground block mb-1">Rôle</label>
          <p className="font-medium capitalize text-sm">{user?.role}</p>
        </div>

        {success && (
          <p className="text-sm text-teal-500 font-medium">✓ Profil mis à jour</p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
};

// ─── UserReservations ──────────────────────────────────────────────────────────

export const UserReservations = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getMyBookings()
      .then(setBookings)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Mes réservations</h1>

      {loading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : bookings.length === 0 ? (
        <p className="text-muted-foreground">Aucune réservation pour l'instant.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map(b => {
            const s = STATUS_BOOKING[b.status] ?? { label: b.status, color: 'bg-secondary text-secondary-foreground' };
            return (
              <div key={b.id} className="p-4 rounded-xl bg-card border flex items-center gap-4">
                <Calendar className="h-8 w-8 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{b.service__title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(b.booking_date).toLocaleDateString('fr-FR')} · {b.guests} personne{b.guests > 1 ? 's' : ''}
                  </p>
                </div>
                <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${s.color}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── UserOrders ────────────────────────────────────────────────────────────────

export const UserOrders = () => {
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Mes commandes</h1>

      {loading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : orders.length === 0 ? (
        <p className="text-muted-foreground">Aucune commande pour l'instant.</p>
      ) : (
        <div className="space-y-3">
          {orders.map(o => {
            const s = STATUS_ORDER[o.status] ?? { label: o.status, color: 'bg-secondary text-secondary-foreground' };
            return (
              <div key={o.id} className="p-4 rounded-xl bg-card border flex items-center gap-4">
                <ShoppingBag className="h-8 w-8 text-accent shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium">Commande #{o.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(o.created_at).toLocaleDateString('fr-FR')} · {Number(o.total_amount).toFixed(2)} TND
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{o.shipping_address}</p>
                </div>
                <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${s.color}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── UserFavorites ─────────────────────────────────────────────────────────────

export const UserFavorites = () => (
  <div>
    <h1 className="font-display text-2xl font-bold mb-6">Mes favoris</h1>
    <p className="text-muted-foreground">Les favoris arrivent bientôt.</p>
  </div>
);

export default UserDashboard;