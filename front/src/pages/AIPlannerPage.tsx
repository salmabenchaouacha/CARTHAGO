import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sun, Cloud, MapPin, Clock, DollarSign, Sparkles } from 'lucide-react';
import { api } from '@/services/api';
import { regions } from '@/data/mockData';
import SectionTitle from '@/components/SectionTitle';

const AIPlannerPage = () => {
  const [form, setForm] = useState({ duration: 3, budget: 'moyen', travelType: 'couple', interests: [] as string[], regions: [] as string[], period: 'printemps' });
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const interests = ['Culture', 'Plage', 'Désert', 'Gastronomie', 'Artisanat', 'Aventure', 'Détente', 'Histoire'];
  const budgets = [{ v: 'economique', l: 'Économique' }, { v: 'moyen', l: 'Moyen' }, { v: 'premium', l: 'Premium' }];
  const travelTypes = [{ v: 'solo', l: 'Solo' }, { v: 'couple', l: 'Couple' }, { v: 'famille', l: 'Famille' }, { v: 'amis', l: 'Amis' }];

  const toggleInterest = (i: string) => setForm(f => ({ ...f, interests: f.interests.includes(i) ? f.interests.filter(x => x !== i) : [...f.interests, i] }));
  const toggleRegion = (r: string) => setForm(f => ({ ...f, regions: f.regions.includes(r) ? f.regions.filter(x => x !== r) : [...f.regions, r] }));

  const generate = async () => {
    setLoading(true);
    const result = await api.generateTrip(form);
    setTrip(result);
    setLoading(false);
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <SectionTitle title="Assistant Voyage IA" subtitle="Créez un itinéraire personnalisé selon vos envies, votre budget et la météo" />

        {!trip ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-8">
            <div>
              <label className="block font-medium mb-2 text-foreground">Durée du séjour (jours)</label>
              <input type="range" min={1} max={14} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: +e.target.value }))} className="w-full accent-primary" />
              <span className="text-accent font-bold text-lg">{form.duration} jours</span>
            </div>

            <div>
              <label className="block font-medium mb-2 text-foreground">Budget</label>
              <div className="flex gap-3">
                {budgets.map(b => (
                  <button key={b.v} onClick={() => setForm(f => ({ ...f, budget: b.v }))} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${form.budget === b.v ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-border'}`}>
                    {b.l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2 text-foreground">Type de voyage</label>
              <div className="flex flex-wrap gap-3">
                {travelTypes.map(t => (
                  <button key={t.v} onClick={() => setForm(f => ({ ...f, travelType: t.v }))} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${form.travelType === t.v ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-border'}`}>
                    {t.l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2 text-foreground">Centres d'intérêt</label>
              <div className="flex flex-wrap gap-2">
                {interests.map(i => (
                  <button key={i} onClick={() => toggleInterest(i)} className={`px-3 py-1.5 rounded-full text-sm transition-colors ${form.interests.includes(i) ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-border'}`}>
                    {i}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2 text-foreground">Régions souhaitées</label>
              <div className="flex flex-wrap gap-2">
                {regions.map(r => (
                  <button key={r.id} onClick={() => toggleRegion(r.id)} className={`px-3 py-1.5 rounded-full text-sm transition-colors ${form.regions.includes(r.id) ? 'bg-mediterranean text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-border'}`}>
                    {r.name}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={generate} disabled={loading} className="w-full py-4 rounded-xl gradient-mediterranean text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? (
                <span className="animate-spin h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
              ) : (
                <><Sparkles className="h-5 w-5" />Générer mon itinéraire</>
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl font-bold">Votre itinéraire</h2>
              <button onClick={() => setTrip(null)} className="text-sm text-primary hover:underline">Modifier</button>
            </div>

            <div className="space-y-6">
              {trip.days.map((day: any) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: day.day * 0.1 }}
                  className="p-6 rounded-xl bg-card border"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg font-bold text-foreground">Jour {day.day} — {day.region}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Sun className="h-4 w-4 text-gold" />
                      {day.weather.temp}°C · {day.weather.condition}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {day.activities.map((a: any, i: number) => (
                      <div key={i} className="flex gap-3">
                        <span className="text-sm font-mono text-accent font-bold w-14 shrink-0">{a.time}</span>
                        <div>
                          <p className="font-medium text-foreground text-sm">{a.title}</p>
                          <p className="text-xs text-muted-foreground">{a.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
                    <span className="text-muted-foreground"><MapPin className="h-3.5 w-3.5 inline mr-1" />Hébergement : {day.accommodation}</span>
                    <span className="text-accent font-bold">~{day.estimatedCost} TND</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-xl gradient-warm text-center">
              <p className="text-accent-foreground font-display text-xl font-bold">Coût estimé total : {trip.totalCost} TND</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AIPlannerPage;
