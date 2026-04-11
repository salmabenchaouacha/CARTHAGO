import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SectionTitle from '@/components/SectionTitle';
import heroImg from '@/assets/hero-tunisia.jpg';
import artisanatImg from '@/assets/artisanat.jpg';
import gastronomieImg from '@/assets/gastronomie.jpg';
import desertImg from '@/assets/desert.jpg';
import patrimoineImg from '@/assets/patrimoine.jpg';
import maisonHoteImg from '@/assets/maison-hote.jpg';

const sections = [
  { title: 'Patrimoine & Culture', desc: 'Carthage, Dougga, El Jem... Des sites classés UNESCO qui racontent des millénaires d\'histoire.', image: patrimoineImg, link: '/regions' },
  { title: 'Gastronomie', desc: 'Du couscous traditionnel au poisson grillé méditerranéen, une cuisine riche et savoureuse.', image: gastronomieImg, link: '/partenaires?type=restaurant' },
  { title: 'Artisanat', desc: 'Céramique de Nabeul, tapis de Kairouan, chéchia, cuivre ciselé — un savoir-faire ancestral.', image: artisanatImg, link: '/marketplace' },
  { title: 'Désert & Oasis', desc: 'Sahara tunisien, oasis de montagne, Chott el Jérid — des paysages à couper le souffle.', image: desertImg, link: '/regions/tozeur' },
  { title: 'Mer & Plages', desc: 'Des plages de sable fin, eaux turquoise et îles paradisiaques le long de la côte méditerranéenne.', image: heroImg, link: '/regions/djerba' },
  { title: 'Médina & Architecture', desc: 'Ruelles labyrinthiques, portes cloutées, riads et dars — l\'âme vivante des villes tunisiennes.', image: maisonHoteImg, link: '/regions/tunis' },
];

const DiscoverPage = () => (
  <div>
    <section className="relative h-[50vh] flex items-center justify-center">
      <img src={heroImg} alt="Découvrir la Tunisie" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-foreground/50" />
      <div className="relative z-10 text-center px-4">
        <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-4">Découvrir la Tunisie</h1>
        <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto">Un pays aux mille facettes, entre mer et désert, tradition et modernité.</p>
      </div>
    </section>

    <section className="py-20">
      <div className="container mx-auto px-4">
        <SectionTitle title="Ce qui rend la Tunisie unique" subtitle="Explorez les différentes facettes de ce joyau méditerranéen" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Link to={s.link} className="group block rounded-xl overflow-hidden bg-card hover-lift border">
                <div className="h-56 overflow-hidden">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-sm">{s.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default DiscoverPage;
