import React, { useState, useRef, useEffect, useReducer, useCallback } from "react";
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
  Undo2,
  Redo2,
  Pencil,
  Check,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
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
   Region → GPS coordinates
───────────────────────────────────────────── */
const REGION_COORDS: Record<string, [number, number]> = {
  Tunis: [36.8065, 10.1815],
  Djerba: [33.8075, 10.845],
  Tozeur: [33.9197, 8.1335],
  Hammamet: [36.4, 10.6],
  Sousse: [35.8256, 10.636],
  Sfax: [34.7406, 10.7603],
  Kairouan: [35.6781, 10.0966],
  Tabarka: [36.954, 8.7576],
  Mahdia: [35.5047, 11.0622],
  Monastir: [35.7643, 10.8113],
  Nabeul: [36.4564, 10.7356],
  Bizerte: [37.2746, 9.8739],
  Gafsa: [34.425, 8.7842],
  Gabes: [33.8833, 10.1],
  Medenine: [33.3549, 10.5055],
  Tataouine: [32.9211, 10.4517],
};

/* ─────────────────────────────────────────────
   Undo / Redo reducer
───────────────────────────────────────────── */
interface HistoryState {
  past: Trip[];
  present: Trip | null;
  future: Trip[];
}

type HistoryAction =
  | { type: "SET"; trip: Trip }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "RESET" };

function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case "SET":
      return {
        past: state.present ? [...state.past, state.present] : state.past,
        present: action.trip,
        future: [],
      };
    case "UNDO":
      if (state.past.length === 0) return state;
      return {
        past: state.past.slice(0, -1),
        present: state.past[state.past.length - 1],
        future: state.present ? [state.present, ...state.future] : state.future,
      };
    case "REDO":
      if (state.future.length === 0) return state;
      return {
        past: state.present ? [...state.past, state.present] : state.past,
        present: state.future[0],
        future: state.future.slice(1),
      };
    case "RESET":
      return { past: [], present: null, future: [] };
    default:
      return state;
  }
}

/* ─────────────────────────────────────────────
   HTML Download helper
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
   Inline editable field component
───────────────────────────────────────────── */
interface EditableFieldProps {
  value: string;
  className?: string;
  onSave: (newValue: string) => void;
}

function EditableField({ value, className = "", onSave }: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      const range = document.createRange();
      range.selectNodeContents(ref.current);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    const newVal = ref.current?.innerText.trim() ?? draft;
    setDraft(newVal);
    onSave(newVal);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); commit(); }
    if (e.key === "Escape") { setEditing(false); if (ref.current) ref.current.innerText = draft; }
  };

  return (
    <span className="group relative inline-flex items-center gap-1">
      <span
        ref={ref}
        contentEditable={editing}
        suppressContentEditableWarning
        onKeyDown={handleKey}
        onBlur={commit}
        className={`${className} ${editing
          ? "outline-none bg-primary/10 rounded px-1 ring-1 ring-primary/30"
          : "cursor-text"
        }`}
      >
        {draft}
      </span>
      {!editing && (
        <button
          onClick={() => setEditing(true)}
          className="opacity-0 group-hover:opacity-60 transition-opacity p-0.5 rounded hover:bg-muted"
        >
          <Pencil className="h-3 w-3" />
        </button>
      )}
      {editing && (
        <button
          onMouseDown={(e) => { e.preventDefault(); commit(); }}
          className="text-primary p-0.5"
        >
          <Check className="h-3 w-3" />
        </button>
      )}
    </span>
  );
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

  // Undo/redo history
  const [historyState, dispatch] = useReducer(historyReducer, {
    past: [],
    present: null,
    future: [],
  });
  const trip = historyState.present;

  const setTrip = useCallback((t: Trip) => dispatch({ type: "SET", trip: t }), []);
  const undo = useCallback(() => dispatch({ type: "UNDO" }), []);
  const redo = useCallback(() => dispatch({ type: "REDO" }), []);
  const canUndo = historyState.past.length > 0;
  const canRedo = historyState.future.length > 0;

  const [loading, setLoading] = useState(false);

  // Chat state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  /* Keyboard shortcuts: Ctrl/Cmd+Z  Ctrl/Cmd+Y */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if (mod && (e.key === "y" || (e.key === "z" && e.shiftKey))) { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

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
      interests: f.interests.includes(i) ? f.interests.filter((x) => x !== i) : [...f.interests, i],
    }));

  const toggleRegion = (r: string) =>
    setForm((f) => ({
      ...f,
      regions: f.regions.includes(r) ? f.regions.filter((x) => x !== r) : [...f.regions, r],
    }));

  /* ── Helpers for inline editing ── */
  const updateActivity = (dayIdx: number, actIdx: number, field: "title" | "description", value: string) => {
    if (!trip) return;
    const updated: Trip = structuredClone(trip);
    updated.days[dayIdx].activities[actIdx][field] = value;
    setTrip(updated);
  };

  const updateAccommodation = (dayIdx: number, value: string) => {
    if (!trip) return;
    const updated: Trip = structuredClone(trip);
    updated.days[dayIdx].accommodation = value;
    setTrip(updated);
  };

  const updateRegion = (dayIdx: number, value: string) => {
    if (!trip) return;
    const updated: Trip = structuredClone(trip);
    updated.days[dayIdx].region = value;
    setTrip(updated);
  };

  /* ── Generate ── */
  const generate = async () => {
    setLoading(true);
    dispatch({ type: "RESET" });
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

  /* ── Chat ── */
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
      setChatHistory((h) => [...h, { role: "assistant", content: result.reply }]);
      if (result.updatedPlan) setTrip(result.updatedPlan);
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
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChatMessage(); }
  };

  /* ── Map center: centroid of used regions ── */
  const mapCenter: [number, number] = React.useMemo(() => {
    if (!trip) return [33.8, 9.5];
    const coords = trip.days
      .map((d) => REGION_COORDS[d.region])
      .filter(Boolean) as [number, number][];
    if (coords.length === 0) return [33.8, 9.5];
    const lat = coords.reduce((s, c) => s + c[0], 0) / coords.length;
    const lng = coords.reduce((s, c) => s + c[1], 0) / coords.length;
    return [lat, lng];
  }, [trip]);

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */
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
              <label className="block font-medium mb-2">Durée ({form.duration} jours)</label>
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
                {/* Undo / Redo */}
                <button
                  onClick={undo}
                  disabled={!canUndo}
                  title="Annuler (Ctrl+Z)"
                  className="p-2 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-30 transition"
                >
                  <Undo2 className="h-4 w-4" />
                </button>
                <button
                  onClick={redo}
                  disabled={!canRedo}
                  title="Rétablir (Ctrl+Y)"
                  className="p-2 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-30 transition"
                >
                  <Redo2 className="h-4 w-4" />
                </button>

                {/* Download */}
                <button
                  onClick={() => downloadPlanAsHTML(trip)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted text-sm font-medium transition"
                >
                  <Download className="h-4 w-4" />
                  Télécharger
                </button>

                {/* Regenerate */}
                <button
                  onClick={generate}
                  className="flex items-center gap-2 text-sm text-primary"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Régénérer
                </button>
              </div>
            </div>

            {/* ── INTERACTIVE MAP ── */}
            <div className="mb-8 rounded-2xl overflow-hidden border h-72 z-0">
              <MapContainer
                center={mapCenter}
                zoom={6}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {trip.days.map((day) => {
                  const coords = REGION_COORDS[day.region];
                  if (!coords) return null;
                  return (
                    <Marker key={`${day.day}-${day.region}`} position={coords}>
                      <Popup>
                        <strong>Jour {day.day}</strong> — {day.region}
                        <br />
                        <span className="text-xs text-gray-500">{day.weather.temp}°C · {day.weather.condition}</span>
                        <br />
                        <span className="text-xs">📍 {day.accommodation}</span>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>

            {/* Day cards */}
            <div className="space-y-6">
              {trip.days.map((day, dayIdx) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: dayIdx * 0.08 }}
                  className="p-6 rounded-2xl border bg-card hover:shadow-xl transition"
                >
                  {/* Day header */}
                  <div className="flex justify-between mb-4">
                    <h3 className="font-bold flex items-center gap-1">
                      Jour {day.day} —{" "}
                      <EditableField
                        value={day.region}
                        className="font-bold"
                        onSave={(v) => updateRegion(dayIdx, v)}
                      />
                    </h3>
                    <div className="text-sm flex items-center gap-2">
                      <Sun className="h-4 w-4 text-yellow-500" />
                      {day.weather.temp}°C
                    </div>
                  </div>

                  {/* Activities */}
                  <div className="border-l-2 border-primary pl-4 space-y-4">
                    {day.activities.map((a, actIdx) => (
                      <div key={actIdx} className="flex gap-3">
                        <span className="text-sm font-mono text-primary w-14 pt-0.5">{a.time}</span>
                        <div className="flex-1 min-w-0">
                          <EditableField
                            value={a.title}
                            className="font-medium text-sm"
                            onSave={(v) => updateActivity(dayIdx, actIdx, "title", v)}
                          />
                          <div className="mt-0.5">
                            <EditableField
                              value={a.description}
                              className="text-xs text-muted-foreground"
                              onSave={(v) => updateActivity(dayIdx, actIdx, "description", v)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Day footer */}
                  <div className="mt-4 pt-4 border-t flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <MapPin className="inline h-4 w-4 mr-1 flex-shrink-0" />
                      <EditableField
                        value={day.accommodation}
                        className="text-sm"
                        onSave={(v) => updateAccommodation(dayIdx, v)}
                      />
                    </span>
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
                        <div className={`h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold
                          ${msg.role === "user"
                            ? "bg-gradient-to-br from-orange-400 to-pink-500"
                            : "bg-gradient-to-br from-blue-600 to-cyan-500"}`}
                        >
                          {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
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