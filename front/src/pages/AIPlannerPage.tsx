import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Sun,
  MapPin,
  Sparkles,
  RefreshCcw,
  Send,
  Download,
  User,
  Loader2,
} from "lucide-react";
import { api } from "@/services/api";
import { regions } from "@/data/mockData";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface Activity {
  time: string;
  title: string;
  description: string;
}

interface Day {
  day: number;
  region: string;
  weather: { temp: number; condition: string };
  activities: Activity[];
  accommodation: string;
  estimatedCost: number;
}

interface Trip {
  days: Day[];
  totalCost: number;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/* ─────────────────────────────────────────────
   PDF Download helper (no external library)
───────────────────────────────────────────── */
function downloadPlanAsHTML(trip: Trip) {
  const dayBlocks = trip.days
    .map(
      (day) => `
    <div class="day">
      <div class="day-header">
        <h2>Jour ${day.day} — ${day.region}</h2>
        <span class="weather">☀️ ${day.weather.temp}°C · ${day.weather.condition}</span>
      </div>
      <div class="activities">
        ${day.activities
          .map(
            (a) => `
          <div class="activity">
            <span class="time">${a.time}</span>
            <div>
              <strong>${a.title}</strong>
              <p>${a.description}</p>
            </div>
          </div>`
          )
          .join("")}
      </div>
      <div class="day-footer">
        <span>📍 ${day.accommodation}</span>
        <span class="cost">~${day.estimatedCost} TND</span>
      </div>
    </div>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <title>Mon Itinéraire Tunisie</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: #fdf8f3; color: #1a1a1a; padding: 40px; }
    h1 { font-family: 'Playfair Display', serif; font-size: 2.5rem; text-align: center;
         background: linear-gradient(135deg, #e55d2b, #f5a623); -webkit-background-clip: text;
         -webkit-text-fill-color: transparent; margin-bottom: 8px; }
    .subtitle { text-align: center; color: #888; margin-bottom: 40px; font-size: 0.95rem; }
    .day { background: #fff; border-radius: 16px; padding: 24px; margin-bottom: 24px;
           box-shadow: 0 2px 16px rgba(0,0,0,0.07); page-break-inside: avoid; }
    .day-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .day-header h2 { font-family: 'Playfair Display', serif; font-size: 1.3rem; }
    .weather { font-size: 0.85rem; color: #f5a623; font-weight: 500; }
    .activities { border-left: 3px solid #e55d2b; padding-left: 16px; }
    .activity { display: flex; gap: 12px; margin-bottom: 14px; }
    .time { font-family: monospace; color: #e55d2b; font-weight: 600; min-width: 50px; padding-top: 2px; }
    .activity p { font-size: 0.85rem; color: #666; margin-top: 2px; }
    .day-footer { display: flex; justify-content: space-between; margin-top: 16px;
                  padding-top: 16px; border-top: 1px solid #f0ebe4; font-size: 0.9rem; }
    .cost { font-weight: 700; color: #e55d2b; }
    .total { background: linear-gradient(135deg, #e55d2b, #f5a623); color: white;
             border-radius: 16px; padding: 24px; text-align: center; margin-top: 32px; }
    .total h3 { font-family: 'Playfair Display', serif; font-size: 1.8rem; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>🇹🇳 Mon Itinéraire Tunisie</h1>
  <p class="subtitle">Généré par VisitTunisia AI Planner</p>
  ${dayBlocks}
  <div class="total">
    <h3>Coût total estimé : ${trip.totalCost} TND</h3>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "itineraire-tunisie.html";
  a.click();
  URL.revokeObjectURL(url);
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const AIPlannerPage = () => {
  const [form, setForm] = useState({
    duration: 3,
    budget: "moyen",
    travelType: "couple",
    interests: [] as string[],
    regions: [] as string[],
  });

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(false);

  // Chat state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const interests = [
    "Culture", "Plage", "Désert", "Gastronomie",
    "Artisanat", "Aventure", "Détente", "Histoire",
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
    setChatHistory([]);
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

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !trip) return;

    const userMsg: ChatMessage = { role: "user", content: chatInput };
    const newHistory = [...chatHistory, userMsg];
    setChatHistory(newHistory);
    setChatInput("");
    setChatLoading(true);

    try {
      const result = await api.chatWithPlan({
        plan: trip,
        message: chatInput,
        history: newHistory.map((m) => ({ role: m.role, content: m.content })),
      });

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: result.reply,
      };
      setChatHistory((h) => [...h, assistantMsg]);

      // If the agent returned an updated plan, apply it
      if (result.updatedPlan) {
        setTrip(result.updatedPlan);
      }
    } catch (err) {
      console.error(err);
      setChatHistory((h) => [
        ...h,
        { role: "assistant", content: "Une erreur s'est produite. Veuillez réessayer." },
      ]);
    }

    setChatLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  return (
    <div className="py-16 min-h-screen">
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

        {/* ── FORM ── */}
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
                type="range" min={1} max={14} value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: +e.target.value }))}
                className="w-full accent-primary"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block mb-2">Budget</label>
              <div className="flex gap-3">
                {budgets.map((b) => (
                  <button key={b.v}
                    onClick={() => setForm((f) => ({ ...f, budget: b.v }))}
                    className={`px-4 py-2 rounded-lg ${form.budget === b.v ? "bg-primary text-white" : "bg-muted hover:bg-border"}`}
                  >{b.l}</button>
                ))}
              </div>
            </div>

            {/* Travel type */}
            <div>
              <label className="block mb-2">Type de voyage</label>
              <div className="flex flex-wrap gap-3">
                {travelTypes.map((t) => (
                  <button key={t.v}
                    onClick={() => setForm((f) => ({ ...f, travelType: t.v }))}
                    className={`px-4 py-2 rounded-lg ${form.travelType === t.v ? "bg-primary text-white" : "bg-muted hover:bg-border"}`}
                  >{t.l}</button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="block mb-2">Centres d'intérêt</label>
              <div className="flex flex-wrap gap-2">
                {interests.map((i) => (
                  <button key={i} onClick={() => toggleInterest(i)}
                    className={`px-3 py-1.5 rounded-full text-sm ${form.interests.includes(i) ? "bg-accent text-white" : "bg-muted hover:bg-border"}`}
                  >{i}</button>
                ))}
              </div>
            </div>

            {/* Regions */}
            <div>
              <label className="block mb-2">Régions</label>
              <div className="flex flex-wrap gap-2">
                {regions.map((r) => (
                  <button key={r.id} onClick={() => toggleRegion(r.id)}
                    className={`px-3 py-1.5 rounded-full text-sm ${form.regions.includes(r.id) ? "bg-blue-500 text-white" : "bg-muted hover:bg-border"}`}
                  >{r.name}</button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button onClick={generate}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold flex justify-center items-center gap-2 hover:opacity-90"
            >
              <Sparkles className="h-5 w-5" />
              Générer mon itinéraire
            </button>
          </motion.div>
        )}

        {/* ── LOADING ── */}
        {loading && (
          <div className="text-center py-16">
            <Bot className="mx-auto h-12 w-12 text-primary animate-bounce" />
            <p className="mt-4 text-muted-foreground">Création de votre voyage...</p>
          </div>
        )}

        {/* ── RESULT ── */}
        {trip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto"
          >
            {/* Header row */}
            <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
              <h2 className="text-2xl font-bold">Votre itinéraire ✨</h2>
              <div className="flex items-center gap-3">
                {/* Download button */}
                <button
                  onClick={() => downloadPlanAsHTML(trip)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted text-sm font-medium transition"
                >
                  <Download className="h-4 w-4" />
                  Télécharger
                </button>
                {/* Regenerate button */}
                <button
                  onClick={generate}
                  className="flex items-center gap-2 text-sm text-primary"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Régénérer
                </button>
              </div>
            </div>

            {/* Day cards */}
            <div className="space-y-6">
              {trip.days.map((day) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: day.day * 0.1 }}
                  className="p-6 rounded-2xl border bg-card hover:shadow-xl transition"
                >
                  <div className="flex justify-between mb-4">
                    <h3 className="font-bold">Jour {day.day} — {day.region}</h3>
                    <div className="text-sm flex items-center gap-2">
                      <Sun className="h-4 w-4 text-yellow-500" />
                      {day.weather.temp}°C
                    </div>
                  </div>

                  <div className="border-l-2 border-primary pl-4 space-y-4">
                    {day.activities.map((a, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="text-sm font-mono text-primary w-14">{a.time}</span>
                        <div>
                          <p className="font-medium">{a.title}</p>
                          <p className="text-xs text-muted-foreground">{a.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t flex justify-between text-sm">
                    <span><MapPin className="inline h-4 w-4 mr-1" />{day.accommodation}</span>
                    <span className="font-bold text-primary">~{day.estimatedCost} TND</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Total cost */}
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white text-center">
              <p className="text-xl font-bold">Total estimé : {trip.totalCost} TND</p>
            </div>

            {/* ── CHAT SECTION ── */}
            <div className="mt-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Assistant Voyage</h3>
                  <p className="text-sm text-muted-foreground">
                    Posez vos questions ou modifiez votre itinéraire
                  </p>
                </div>
              </div>

              {/* Chat messages */}
              <div className="rounded-2xl border bg-card overflow-hidden">
                <div className="h-80 overflow-y-auto p-4 space-y-4 scroll-smooth">
                  {chatHistory.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center gap-3 text-muted-foreground">
                      <Bot className="h-10 w-10 opacity-30" />
                      <p className="text-sm">
                        Bonjour ! Je suis votre assistant voyage.<br />
                        Demandez-moi de modifier l'itinéraire, d'ajouter des activités,<br />
                        ou posez toute question sur votre voyage en Tunisie.
                      </p>
                      {/* Suggestion chips */}
                      <div className="flex flex-wrap gap-2 justify-center mt-2">
                        {[
                          "Ajoute une journée à Djerba",
                          "Quels restaurants recommandes-tu ?",
                          "Réduis le budget du jour 2",
                        ].map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => setChatInput(suggestion)}
                            className="px-3 py-1.5 rounded-full text-xs bg-muted hover:bg-border transition"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <AnimatePresence initial={false}>
                    {chatHistory.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        {/* Avatar */}
                        <div className={`h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold
                          ${msg.role === "user"
                            ? "bg-gradient-to-br from-orange-400 to-pink-500"
                            : "bg-gradient-to-br from-blue-600 to-cyan-500"}`}
                        >
                          {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>

                        {/* Bubble */}
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed
                          ${msg.role === "user"
                            ? "bg-primary text-white rounded-tr-sm"
                            : "bg-muted text-foreground rounded-tl-sm"}`}
                        >
                          {msg.content}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Loading indicator */}
                  {chatLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3"
                    >
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <span key={i}
                            className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Input area */}
                <div className="border-t p-3 flex gap-2 bg-background">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ex: Ajoute une activité de surf à Hammamet..."
                    rows={1}
                    className="flex-1 resize-none rounded-xl border bg-card px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition"
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={!chatInput.trim() || chatLoading}
                    className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition flex-shrink-0"
                  >
                    {chatLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-3">
                Appuyez sur Entrée pour envoyer · Maj+Entrée pour un saut de ligne
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AIPlannerPage;