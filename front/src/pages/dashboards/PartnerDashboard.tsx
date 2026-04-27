import React, { useEffect, useState, Fragment } from 'react';
import { ShoppingBag, Star, Calendar, TrendingUp, Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getMyServices, createService, updateService, deleteService } from '@/services/catalogService';
import { getMyProducts, createProduct, updateProduct, deleteProduct } from '@/services/productService';
import { getMyBookings } from '@/services/bookingService';
import { type ServiceList, type ProductList, type Booking } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_BOOKING: Record<string, { label: string; color: string }> = {
  pending:   { label: 'En attente', color: 'bg-secondary text-secondary-foreground' },
  confirmed: { label: 'Confirmée',  color: 'bg-olive text-white' },
  cancelled: { label: 'Annulée',    color: 'bg-destructive text-destructive-foreground' },
};

// ─── Modal générique ───────────────────────────────────────────────────────────

const Modal = ({ title, onClose, children }: {
  title: string; onClose: () => void; children: React.ReactNode;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
    <div className="bg-card rounded-2xl border w-full max-w-lg shadow-xl">
      <div className="flex items-center justify-between p-5 border-b">
        <h3 className="font-display text-lg font-bold">{title}</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="text-sm text-muted-foreground block mb-1">{label}</label>
    {children}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full px-3 py-2 rounded-lg border bg-background text-foreground text-sm" />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} rows={3} className="w-full px-3 py-2 rounded-lg border bg-background text-foreground text-sm resize-none" />
);

// ─── PartnerDashboard ──────────────────────────────────────────────────────────

const PartnerDashboard = () => {
  const { user } = useAuth();
  const [services, setServices]   = useState<ServiceList[]>([]);
  const [products, setProducts]   = useState<ProductList[]>([]);
  const [bookings, setBookings]   = useState<Booking[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([getMyServices(), getMyProducts(), getMyBookings()])
      .then(([s, p, b]) => { setServices(s); setProducts(p); setBookings(b); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">
        Espace Partenaire — {user?.full_name}
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <ShoppingBag className="h-5 w-5 text-primary" />,  color: 'bg-mediterranean-light', value: loading ? '…' : products.length, label: 'Produits' },
          { icon: <Calendar className="h-5 w-5 text-accent" />,      color: 'bg-secondary',            value: loading ? '…' : bookings.length, label: 'Réservations' },
          { icon: <Star className="h-5 w-5 text-gold" />,            color: 'bg-muted',                value: loading ? '…' : services.length, label: 'Services' },
          { icon: <TrendingUp className="h-5 w-5 text-olive" />,     color: 'bg-secondary',            value: '—',                             label: 'Revenus du mois' },
        ].map((s, i) => (
          <div key={i} className="p-6 rounded-xl bg-card border">
            <div className={`inline-flex p-3 rounded-lg mb-3 ${s.color}`}>{s.icon}</div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Dernières réservations */}
      <div className="p-6 rounded-xl bg-card border">
        <h2 className="font-display text-lg font-bold mb-4">Dernières réservations</h2>
        {loading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : bookings.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune réservation pour l'instant.</p>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 5).map(b => {
              const s = STATUS_BOOKING[b.status] ?? { label: b.status, color: 'bg-secondary text-secondary-foreground' };
              return (
                <div key={b.id} className="flex items-center gap-3 text-sm">
                  <span>📅</span>
                  <span className="flex-1 font-medium">{b.service__title}</span>
                  <span className="text-muted-foreground">{new Date(b.booking_date).toLocaleDateString('fr-FR')}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.color}`}>{s.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── PartnerProfile ────────────────────────────────────────────────────────────

export const PartnerProfile = () => {
  const { user, refreshMe } = useAuth();
  const [form, setForm]       = useState({ full_name: user?.full_name ?? '', phone: user?.phone ?? '' });
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await import('@/services/api').then(m => m.default.patch('/auth/me/', form));
      await refreshMe();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-bold mb-6">Mon profil partenaire</h1>
      <div className="p-6 rounded-xl bg-card border space-y-4">
        <Field label="Nom complet">
          <Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
        </Field>
        <Field label="Email">
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </Field>
        <Field label="Téléphone">
          <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        </Field>
        {success && <p className="text-sm text-teal-500 font-medium">✓ Profil mis à jour</p>}
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

// ─── PartnerServices ───────────────────────────────────────────────────────────

export const PartnerServices = () => {
  const [services, setServices]   = useState<ServiceList[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState<ServiceList | null>(null);
  const [saving, setSaving]       = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', price: '', address: '', category_id: '',
  });

  const load = () => {
    setLoading(true);
    getMyServices().then(setServices).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', description: '', price: '', address: '', category_id: '' });
    setShowModal(true);
  };

  const openEdit = (s: ServiceList) => {
    setEditing(s);
    setForm({
      title: s.title,
      description: s.description,
      price: s.price,
      address: s.address,
      category_id: '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        address: form.address,
        ...(form.category_id ? { category_id: Number(form.category_id) } : {}),
      };
      if (editing) {
        await updateService(editing.id, payload);
      } else {
        await createService({ ...payload, category_id: Number(form.category_id) });
      }
      setShowModal(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce service ?')) return;
    await deleteService(id);
    load();
  };

  const handleToggle = async (s: ServiceList) => {
    await updateService(s.id, { is_active: !s.is_active });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Mes services</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : services.length === 0 ? (
        <p className="text-muted-foreground">Aucun service pour l'instant.</p>
      ) : (
        <div className="space-y-3">
          {services.map(s => (
            <div key={s.id} className="p-4 rounded-xl bg-card border flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium truncate">{s.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.is_active ? 'bg-teal-100 text-teal-700' : 'bg-muted text-muted-foreground'}`}>
                    {s.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{s.address}</p>
                <p className="text-sm font-medium text-accent">{Number(s.price).toFixed(2)} TND</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggle(s)}
                  title={s.is_active ? 'Désactiver' : 'Activer'}
                  className="p-2 rounded-lg bg-muted hover:bg-border transition-colors"
                >
                  <Check className={`h-4 w-4 ${s.is_active ? 'text-teal-500' : 'text-muted-foreground'}`} />
                </button>
                <button
                  onClick={() => openEdit(s)}
                  className="p-2 rounded-lg bg-muted hover:bg-border transition-colors"
                >
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-2 rounded-lg bg-muted hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal
          title={editing ? 'Modifier le service' : 'Nouveau service'}
          onClose={() => setShowModal(false)}
        >
          <div className="space-y-4">
            <Field label="Titre">
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </Field>
            <Field label="Description">
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </Field>
            <Field label="Prix (TND)">
              <Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
            </Field>
            <Field label="Adresse">
              <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
            </Field>
            {!editing && (
              <Field label="ID Catégorie">
                <Input type="number" placeholder="ex: 1" value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} />
              </Field>
            )}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"
              >
                {saving ? 'Enregistrement...' : editing ? 'Modifier' : 'Créer'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border text-sm text-muted-foreground hover:text-foreground"
              >
                Annuler
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── PartnerProducts ───────────────────────────────────────────────────────────

export const PartnerProducts = () => {
  const [products, setProducts]   = useState<ProductList[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState<ProductList | null>(null);
  const [saving, setSaving]       = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '', category_id: '',
  });

  const load = () => {
    setLoading(true);
    getMyProducts().then(setProducts).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', price: '', stock: '', category_id: '' });
    setShowModal(true);
  };

  const openEdit = (p: ProductList) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      stock: String(p.stock),
      category_id: '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        ...(form.category_id ? { category_id: Number(form.category_id) } : {}),
      };
      if (editing) {
        await updateProduct(editing.id, payload);
      } else {
        await createProduct({ ...payload, category_id: Number(form.category_id) });
      }
      setShowModal(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await deleteProduct(id);
    load();
  };

  const handleToggle = async (p: ProductList) => {
    await updateProduct(p.id, { is_active: !p.is_active });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Mes produits</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : products.length === 0 ? (
        <p className="text-muted-foreground">Aucun produit pour l'instant.</p>
      ) : (
        <div className="space-y-3">
          {products.map(p => (
            <div key={p.id} className="p-4 rounded-xl bg-card border flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium truncate">{p.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.is_active ? 'bg-teal-100 text-teal-700' : 'bg-muted text-muted-foreground'}`}>
                    {p.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Stock : {p.stock}</p>
                <p className="text-sm font-medium text-accent">{Number(p.price).toFixed(2)} TND</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggle(p)}
                  title={p.is_active ? 'Désactiver' : 'Activer'}
                  className="p-2 rounded-lg bg-muted hover:bg-border transition-colors"
                >
                  <Check className={`h-4 w-4 ${p.is_active ? 'text-teal-500' : 'text-muted-foreground'}`} />
                </button>
                <button
                  onClick={() => openEdit(p)}
                  className="p-2 rounded-lg bg-muted hover:bg-border transition-colors"
                >
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-2 rounded-lg bg-muted hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal
          title={editing ? 'Modifier le produit' : 'Nouveau produit'}
          onClose={() => setShowModal(false)}
        >
          <div className="space-y-4">
            <Field label="Nom">
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </Field>
            <Field label="Description">
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Prix (TND)">
                <Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
              </Field>
              <Field label="Stock">
                <Input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
              </Field>
            </div>
            {!editing && (
              <Field label="ID Catégorie">
                <Input type="number" placeholder="ex: 1" value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} />
              </Field>
            )}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"
              >
                {saving ? 'Enregistrement...' : editing ? 'Modifier' : 'Créer'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border text-sm text-muted-foreground hover:text-foreground"
              >
                Annuler
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PartnerDashboard;