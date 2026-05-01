import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, UtensilsCrossed, Home, Palette, Compass, Sparkles, Landmark, Star, ArrowRight, Bot } from 'lucide-react';
import heroImg from '@/assets/hero-tunisia.jpg';
import artisanatImg from '@/assets/artisanat.jpg';
import gastronomieImg from '@/assets/gastronomie.jpg';
import maisonHoteImg from '@/assets/maison-hote.jpg';
import desertImg from '@/assets/desert.jpg';
import patrimoineImg from '@/assets/patrimoine.jpg';
import SectionTitle from '@/components/SectionTitle';
import { RegionCard, PartnerCard, ProductCard } from '@/components/Cards';
import { regions, partners, products, categories } from '@/data/mockData';
import { useCart } from '@/context/CartContext';

const iconMap: Record<string, React.ReactNode> = {
  UtensilsCrossed: <UtensilsCrossed className="h-6 w-6" />,
  Home: <Home className="h-6 w-6" />,
  Palette: <Palette className="h-6 w-6" />,
  Compass: <Compass className="h-6 w-6" />,
  Sparkles: <Sparkles className="h-6 w-6" />,
  Landmark: <Landmark className="h-6 w-6" />,
};

const HomePage = () => {
  const { addToCart } = useCart();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <img src={heroImg} alt="Tunisie" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/30 to-foreground/70" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight"
          >
            Découvrez la Tunisie{' '}
            <span className="text-gold">autrement</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-primary-foreground/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto"
          >
            Explorez, réservez, dégustez, vivez. Une plateforme intelligente pour voyager au cœur de la Méditerranée.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher une région, un restaurant, un artisan..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-card/95 backdrop-blur-sm text-foreground text-sm border-0 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <Link to="/decouvrir" className="px-6 py-4 rounded-xl gradient-mediterranean text-primary-foreground font-semibold hover:opacity-90 transition-opacity whitespace-nowrap">
              Explorer
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 gradient-sand">
        <div className="container mx-auto px-4">
          <SectionTitle title="Explorez par catégorie" subtitle="Restaurants, hébergements, artisanat, expériences et bien plus" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <Link to={`/partenaires?type=${cat.id}`} className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card hover-lift border text-center">
                  <div className="p-3 rounded-full bg-mediterranean-light text-primary">
                    {iconMap[cat.icon]}
                  </div>
                  <span className="font-medium text-sm text-foreground">{cat.name}</span>
                  <span className="text-xs text-muted-foreground">{cat.count} lieux</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Regions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionTitle title="Régions à découvrir" subtitle="Du nord méditerranéen au grand sud saharien" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regions.slice(0, 6).map((region, i) => (
              <RegionCard key={region.id} region={region} index={i} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/regions" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-primary text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
              Voir toutes les régions <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Partners */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <SectionTitle title="Partenaires populaires" subtitle="Maisons d'hôtes, restaurants et artisans recommandés" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.slice(0, 6).map((p, i) => (
              <PartnerCard key={p.id} partner={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Artisanal Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionTitle title="Artisanat tunisien" subtitle="Soutenez les artisans locaux en achetant des pièces uniques" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 6).map((p, i) => (
              <ProductCard key={p.id} product={p} onAddToCart={() => addToCart(p)} index={i} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/marketplace" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-warm text-accent-foreground font-medium hover:opacity-90 transition-opacity">
              Voir la boutique <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* AI Trip Planner CTA */}
      <section className="py-20 gradient-mediterranean">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Bot className="h-16 w-16 mx-auto mb-6 text-primary-foreground/80" />
            <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              Planifiez votre voyage avec l'IA
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
              Notre assistant intelligent crée un itinéraire personnalisé selon votre budget, vos envies et la météo. Un voyage unique, rien que pour vous.
            </p>
            <Link to="/planificateur" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-card text-foreground font-semibold hover:bg-card/90 transition-colors text-lg">
              <Sparkles className="h-5 w-5 text-accent" />
              Créer mon itinéraire
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Map teaser */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <SectionTitle title="Carte interactive" subtitle="Trouvez les meilleurs lieux à proximité sur notre carte dynamique" />
          <Link to="/carte" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
            <MapPin className="h-5 w-5" /> Ouvrir la carte
          </Link>
        </div>
      </section>

      {/* Partner CTA */}
      <section className="py-20 gradient-warm">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-accent-foreground mb-4">
            Vous êtes artisan, restaurateur ou hébergeur ?
          </h2>
          <p className="text-accent-foreground/80 text-lg max-w-xl mx-auto mb-8">
            Rejoignez notre réseau de partenaires et développez votre activité grâce à la plateforme Explore Tunisia.
          </p>
          <Link to="/inscription-partenaire" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-card text-foreground font-semibold hover:bg-card/90 transition-colors">
            Devenir partenaire <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
