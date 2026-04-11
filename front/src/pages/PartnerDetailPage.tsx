import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, Phone, ArrowLeft, Check } from 'lucide-react';
import { partners, reviews } from '@/data/mockData';

const PartnerDetailPage = () => {
  const { id } = useParams();
  const partner = partners.find(p => p.id === id);
  const partnerReviews = reviews.filter(r => r.targetId === id);

  if (!partner) return <div className="container mx-auto px-4 py-20 text-center"><h2 className="text-2xl font-display">Partenaire non trouvé</h2></div>;

  const typeLabels: Record<string, string> = {
    restaurant: 'Restaurant', guesthouse: 'Maison d\'hôte', artisan: 'Artisan', guide: 'Guide', experience: 'Expérience'
  };

  return (
    <div>
      <section className="relative h-[45vh]">
        <img src={partner.image} alt={partner.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-10">
          <div>
            <Link to="/partenaires" className="inline-flex items-center gap-1 text-primary-foreground/80 text-sm mb-4 hover:text-primary-foreground"><ArrowLeft className="h-4 w-4" />Retour</Link>
            <span className="block text-sm text-gold font-medium mb-2">{typeLabels[partner.type]}</span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-2">{partner.name}</h1>
            <div className="flex items-center gap-4 text-primary-foreground/80 text-sm">
              <span className="flex items-center gap-1"><Star className="h-4 w-4 text-gold fill-gold" />{partner.rating} ({partner.reviewCount} avis)</span>
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{partner.address}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-display text-2xl font-bold mb-4">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{partner.description}</p>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold mb-4">Services</h2>
              <div className="flex flex-wrap gap-2">
                {partner.services.map(s => (
                  <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-mediterranean-light text-primary text-sm">
                    <Check className="h-3.5 w-3.5" />{s}
                  </span>
                ))}
              </div>
            </div>
            {partnerReviews.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-bold mb-4">Avis</h2>
                <div className="space-y-4">
                  {partnerReviews.map(r => (
                    <div key={r.id} className="p-4 rounded-xl bg-muted">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-foreground">{r.userName}</span>
                        <div className="flex">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 text-gold fill-gold" />)}</div>
                        <span className="text-xs text-muted-foreground">{r.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-card border">
              <h3 className="font-display text-lg font-bold mb-4">Informations</h3>
              <div className="space-y-3 text-sm">
                <p className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4 text-primary" />{partner.hours}</p>
                <p className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4 text-primary" />{partner.phone}</p>
                <p className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4 text-primary" />{partner.address}</p>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-lg font-bold text-accent">{partner.priceRange}</p>
              </div>
              <button className="w-full mt-4 py-3 rounded-xl gradient-mediterranean text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                Réserver / Contacter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDetailPage;
