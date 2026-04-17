import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Sun,
  MapPin,
  Clock,
  Sparkles,
  RefreshCcw,
} from "lucide-react";
import { api } from "@/services/api";
import { regions } from "@/data/mockData";
import SectionTitle from "@/components/SectionTitle";

const AIPlannerPage = () => {
  const [form, setForm] = useState({
    duration: 3,
    budget: "moyen",
    travelType: "couple",
    interests: [] as string[],
    regions: [] as string[],
  });

  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const interests = [
    "Culture",
    "Plage",
    "Désert",
    "Gastronomie",
    "Artisanat",
    "Aventure",
    "Détente",
    "Histoire",
  ];

  const budgets = [
    { v: "economique", l: "Économique" },
    { v: "moyen", l: "Moyen" },
    { v: "premium", l: "Premium" },
  ];

  const travelTypes = [
    { v: "solo", l: "Solo" },
    { v: "couple", l: "Couple" },
    { v: "famille", l: "Famille" },
    { v: "amis", l: "Amis" },
  ];

  const toggleInterest = (i: string) =>
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(i)
        ? f.interests.filter((x) => x !== i)
        : [...f.interests, i],
    }));

  const toggleRegion = (r: string) =>
    setForm((f) => ({
      ...f,
      regions: f.regions.includes(r)
        ? f.regions.filter((x) => x !== r)
        : [...f.regions, r],
    }));

  const generate = async () => {
    setLoading(true);
    setTrip(null);

    try {
      const result = await api.generateTrip({
        duration: form.duration,
        travelType: form.travelType,
        interests: form.interests,
        regions: form.regions,
        budget: form.budget,
      });

      setTrip(result);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* HERO */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Planifiez votre voyage en Tunisie 🇹🇳
          </h1>
          <p className="text-muted-foreground mt-3">
            Une expérience sur mesure, propulsée par l'IA
          </p>
        </div>

        {!trip && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto space-y-8"
          >
            {/* Duration */}
            <div>
              <label className="block font-medium mb-2">
                Durée ({form.duration} jours)
              </label>
              <input
                type="range"
                min={1}
                max={14}
                value={form.duration}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    duration: +e.target.value,
                  }))
                }
                className="w-full accent-primary"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block mb-2">Budget</label>
              <div className="flex gap-3">
                {budgets.map((b) => (
                  <button
                    key={b.v}
                    onClick={() =>
                      setForm((f) => ({ ...f, budget: b.v }))
                    }
                    className={`px-4 py-2 rounded-lg ${
                      form.budget === b.v
                        ? "bg-primary text-white"
                        : "bg-muted hover:bg-border"
                    }`}
                  >
                    {b.l}
                  </button>
                ))}
              </div>
            </div>

            {/* Travel type */}
            <div>
              <label className="block mb-2">Type de voyage</label>
              <div className="flex flex-wrap gap-3">
                {travelTypes.map((t) => (
                  <button
                    key={t.v}
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        travelType: t.v,
                      }))
                    }
                    className={`px-4 py-2 rounded-lg ${
                      form.travelType === t.v
                        ? "bg-primary text-white"
                        : "bg-muted hover:bg-border"
                    }`}
                  >
                    {t.l}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="block mb-2">Centres d'intérêt</label>
              <div className="flex flex-wrap gap-2">
                {interests.map((i) => (
                  <button
                    key={i}
                    onClick={() => toggleInterest(i)}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      form.interests.includes(i)
                        ? "bg-accent text-white"
                        : "bg-muted hover:bg-border"
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            {/* Regions */}
            <div>
              <label className="block mb-2">Régions</label>
              <div className="flex flex-wrap gap-2">
                {regions.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => toggleRegion(r.id)}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      form.regions.includes(r.id)
                        ? "bg-blue-500 text-white"
                        : "bg-muted hover:bg-border"
                    }`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={generate}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold flex justify-center items-center gap-2 hover:opacity-90"
            >
              <Sparkles className="h-5 w-5" />
              Générer mon itinéraire
            </button>
          </motion.div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="text-center py-16">
            <Bot className="mx-auto h-12 w-12 text-primary animate-bounce" />
            <p className="mt-4 text-muted-foreground">
              Création de votre voyage...
            </p>
          </div>
        )}

        {/* RESULT */}
        {trip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto"
          >
            <div className="flex justify-between mb-8">
              <h2 className="text-2xl font-bold">
                Votre itinéraire ✨
              </h2>

              <button
                onClick={generate}
                className="flex items-center gap-2 text-sm text-primary"
              >
                <RefreshCcw className="h-4 w-4" />
                Régénérer
              </button>
            </div>

            <div className="space-y-6">
              {trip.days.map((day: any) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: day.day * 0.15 }}
                  className="p-6 rounded-2xl border bg-card hover:shadow-xl transition"
                >
                  <div className="flex justify-between mb-4">
                    <h3 className="font-bold">
                      Jour {day.day} — {day.region}
                    </h3>

                    <div className="text-sm flex items-center gap-2">
                      <Sun className="h-4 w-4 text-yellow-500" />
                      {day.weather.temp}°C
                    </div>
                  </div>

                  <div className="border-l-2 border-primary pl-4 space-y-4">
                    {day.activities.map((a: any, i: number) => (
                      <div key={i} className="flex gap-3">
                        <span className="text-sm font-mono text-primary w-14">
                          {a.time}
                        </span>

                        <div>
                          <p className="font-medium">{a.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {a.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t flex justify-between text-sm">
                    <span>
                      <MapPin className="inline h-4 w-4 mr-1" />
                      {day.accommodation}
                    </span>

                    <span className="font-bold text-primary">
                      ~{day.estimatedCost} TND
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white text-center">
              <p className="text-xl font-bold">
                Total estimé : {trip.totalCost} TND
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AIPlannerPage;