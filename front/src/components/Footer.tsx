import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter } from 'lucide-react';
import logoCarthago from "@/assets/carthagooLOGOO.png";

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground">
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
        
  <div className="flex items-center mb-4">
  <img
    src={logoCarthago}
    alt="Carthago"
    className="h-16 w-auto object-contain"
  />

</div>
          <p className="text-primary-foreground/70 text-sm leading-relaxed">
            Découvrez la Tunisie autrement. Tourisme, artisanat, gastronomie et expériences authentiques au cœur de la Méditerranée.
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg font-semibold mb-4">Explorer</h4>
          <div className="flex flex-col gap-2 text-sm text-primary-foreground/70">
            <Link to="/regions" className="hover:text-accent transition-colors">Régions</Link>
            <Link to="/partenaires" className="hover:text-accent transition-colors">Partenaires</Link>
            <Link to="/marketplace" className="hover:text-accent transition-colors">Artisanat</Link>
            <Link to="/planificateur" className="hover:text-accent transition-colors">Assistant IA</Link>
            <Link to="/carte" className="hover:text-accent transition-colors">Carte interactive</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display text-lg font-semibold mb-4">Partenaires</h4>
          <div className="flex flex-col gap-2 text-sm text-primary-foreground/70">
            <Link to="/inscription-partenaire" className="hover:text-accent transition-colors">Devenir partenaire</Link>
            <Link to="/connexion" className="hover:text-accent transition-colors">Espace partenaire</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display text-lg font-semibold mb-4">Contact</h4>
          <div className="flex flex-col gap-3 text-sm text-primary-foreground/70">
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent" /> contact@carthago.com</div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent" /> +216 71 000 000</div>
          </div>
          <div className="flex gap-3 mt-4">
            <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-accent transition-colors"><Facebook className="h-4 w-4" /></a>
            <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-accent transition-colors"><Instagram className="h-4 w-4" /></a>
            <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-accent transition-colors"><Twitter className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-sm text-primary-foreground/50">
        © 2026 CARTHAGO. Tous droits réservés.
      </div>
    </div>
  </footer>
);

export default Footer;
