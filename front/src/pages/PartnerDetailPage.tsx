import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  MapPin,
  Clock,
  Phone,
  ArrowLeft,
  Check,
  Loader2,
  MessageSquare,
  BadgeCheck,
} from 'lucide-react';
import api from '@/services/api';
import BookingModal from '@/components/BookingModal'; // ← ajustez le chemin

// ─── Types ────────────────────────────────────────────────────────────────────

interface Partner {
  id: number;
  business_name: string;
  activity_type: string;
  description: string;
  image?: string | null;
  address: string;
  hours?: string | null;
  phone?: string | null;
  price_range?: string | null;
  rating?: number;
  review_count?: number;
  services?: string[];
  is_verified?: boolean;
  user: {
    username: string;
    full_name: string;
  };
  region?: {
    name: string | null;
    slug: string | null;
  };
}

interface Review {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  date: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  restaurant:  'Restaurant',
  guest_house: "Maison d'hôte",
  artisan:     'Artisan',
  guide:       'Guide',
  tourism:     'Prestataire touristique',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-3.5 w-3.5 ${
          i < rating ? 'text-gold fill-gold' : 'text-muted-foreground/25 fill-transparent'
        }`}
      />
    ))}
  </div>
);

const InfoRow = ({
  icon: Icon,
  children,
  align = 'center',
}: {
  icon: React.ElementType;
  children: React.ReactNode;
  align?: 'center' | 'start';
}) => (
  <p className={`flex items-${align} gap-2.5 text-sm text-muted-foreground`}>
    <Icon className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
    <span>{children}</span>
  </p>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const PartnerDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const [partner,        setPartner]        = useState<Partner | null>(null);
  const [reviews,        setReviews]        = useState<Review[]>([]);
  const [loadingPartner, setLoadingPartner] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [errorPartner,   setErrorPartner]   = useState(false);
  const [bookingOpen,    setBookingOpen]    = useState(false); // ← nouveau

  useEffect(() => {
    if (!id) return;

    setLoadingPartner(true);
    api
      .get<Partner>(`/partners/${id}/`)
      .then((res) => {
        setPartner(res.data);
        setErrorPartner(false);
      })
      .catch(() => setErrorPartner(true))
      .finally(() => setLoadingPartner(false));

    setLoadingReviews(true);
    api
      .get<Review[]>(`/partners/${id}/reviews/`)
      .then((res) => setReviews(res.data))
      .catch(() => setReviews([]))
      .finally(() => setLoadingReviews(false));
  }, [id]);

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loadingPartner) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────

  if (errorPartner || !partner) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground text-lg mb-4">
          Ce partenaire est introuvable.
        </p>
        <Link
          to="/partenaires"
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux partenaires
        </Link>
      </div>
    );
  }

  // ── Computed ───────────────────────────────────────────────────────────────

  const avgRating =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) * 10
        ) / 10
      : partner.rating ?? 0;

  const reviewCount = reviews.length || partner.review_count || 0;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div>

      {/* ── BOOKING MODAL ── */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        partner={partner}
      />

      {/* ── HERO ── */}
      <section className="relative h-[45vh] min-h-[320px]">
        <img
          src={partner.image ?? '/placeholder.jpg'}
          alt={partner.business_name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/20 to-transparent" />

        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-between py-6">

          <div>
            <Link
              to="/partenaires"
              className="inline-flex items-center gap-1.5 text-primary-foreground/80 text-sm hover:text-primary-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux partenaires
            </Link>
          </div>

          <div>
            <span className="block text-sm text-gold font-semibold mb-2 tracking-wide uppercase">
              {TYPE_LABELS[partner.activity_type] ?? partner.activity_type}
            </span>

            <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-3 leading-tight">
              {partner.business_name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-primary-foreground/80 text-sm">
              {reviewCount > 0 && (
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-gold fill-gold" />
                  <span className="font-medium text-primary-foreground">{avgRating}</span>
                  <span>({reviewCount} avis)</span>
                </span>
              )}

              {partner.address && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {partner.address}
                </span>
              )}

              {partner.region?.name && (
                <span className="px-2 py-0.5 rounded-full bg-white/15 text-xs font-medium">
                  {partner.region.name}
                </span>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ── CONTENT ── */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-10">

            {partner.description && (
              <section>
                <h2 className="font-display text-2xl font-bold mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {partner.description}
                </p>
              </section>
            )}

            {partner.services && partner.services.length > 0 && (
              <section>
                <h2 className="font-display text-2xl font-bold mb-4">Services</h2>
                <div className="flex flex-wrap gap-2">
                  {partner.services.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-mediterranean-light text-primary text-sm font-medium"
                    >
                      <Check className="h-3.5 w-3.5" />
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="font-display text-2xl font-bold mb-1">
                Avis
                {!loadingReviews && reviewCount > 0 && (
                  <span className="ml-2 text-base font-normal text-muted-foreground">
                    ({reviewCount})
                  </span>
                )}
              </h2>

              {!loadingReviews && reviewCount > 0 && (
                <div className="flex items-center gap-2 mb-5">
                  <StarRating rating={Math.round(avgRating)} />
                  <span className="text-sm text-muted-foreground">{avgRating} / 5</span>
                </div>
              )}

              {loadingReviews ? (
                <div className="flex items-center gap-2 text-muted-foreground text-sm py-6">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Chargement des avis…
                </div>
              ) : reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3 rounded-xl bg-muted/40 border border-dashed">
                  <MessageSquare className="h-8 w-8 opacity-25" />
                  <p className="text-sm">Aucun avis pour ce partenaire pour le moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r.id} className="p-4 rounded-xl bg-muted">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-semibold text-foreground text-sm">
                          {r.user_name}
                        </span>
                        <StarRating rating={r.rating} />
                        <span className="text-xs text-muted-foreground ml-auto">
                          {r.date}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {r.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div>
            <div className="p-6 rounded-xl bg-card border sticky top-6 space-y-5">

              <h3 className="font-display text-lg font-bold">Informations</h3>

              <div className="space-y-3">
                {partner.hours && (
                  <InfoRow icon={Clock}>{partner.hours}</InfoRow>
                )}
                {partner.phone && (
                  <InfoRow icon={Phone}>
                    <a
                      href={`tel:${partner.phone}`}
                      className="hover:text-primary transition-colors"
                    >
                      {partner.phone}
                    </a>
                  </InfoRow>
                )}
                {partner.address && (
                  <InfoRow icon={MapPin} align="start">
                    {partner.address}
                  </InfoRow>
                )}
              </div>

              {partner.price_range && (
                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">
                    Fourchette de prix
                  </p>
                  <p className="text-lg font-bold text-accent">{partner.price_range}</p>
                </div>
              )}

              {/* ← CTA ouvre le modal */}
              <button
                onClick={() => setBookingOpen(true)}
                className="w-full py-3 rounded-xl gradient-mediterranean text-primary-foreground font-semibold hover:opacity-90 active:scale-[.98] transition-all"
              >
                Réserver / Contacter
              </button>

              {partner.is_verified && (
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <BadgeCheck size={17} />
                  Partenaire vérifié
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PartnerDetailPage;