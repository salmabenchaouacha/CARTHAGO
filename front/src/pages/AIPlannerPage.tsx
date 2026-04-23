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
  Trash2,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { api } from "@/services/api";
import { regions } from "@/data/mockData";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import html2pdf from "html2pdf.js";

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
   PDF Download helper
───────────────────────────────────────────── */


function downloadPlanAsPDF(trip: Trip) {
  // 1. Generate the dynamic day blocks (Exactly like your HTML version)
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

  // 2. Combine your exact CSS + HTML into one string
  // Note: We wrap everything in a div with a fixed width (e.g., 790px for A4)
  const elementHTML = `
    <div style="width: 790px; padding: 20px; background: #fdf8f3; box-sizing: border-box;">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; color: #1a1a1a; }
        h1 { font-family: 'Playfair Display', serif; font-size: 2.5rem; text-align: center;
             color: #e55d2b; margin-bottom: 8px; }
        .subtitle { text-align: center; color: #888; margin-bottom: 40px; font-size: 0.95rem; }
        .day { background: #fff; border-radius: 16px; padding: 24px; margin-bottom: 24px;
               box-shadow: 0 2px 16px rgba(0,0,0,0.07); page-break-inside: avoid; }
        .day-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .day-header h2 { font-family: 'Playfair Display', serif; font-size: 1.3rem; }
        .weather { font-size: 0.85rem; color: #f5a623; font-weight: 500; }
        .activities { border-left: 3px solid #e55d2b; padding-left: 16px; }
        .activity { display: flex; gap: 12px; margin-bottom: 14px; }
        .time { font-family: monospace; color: #e55d2b; font-weight: 600; min-width: 50px; }
        .activity p { font-size: 0.85rem; color: #666; margin-top: 2px; }
        .day-footer { display: flex; justify-content: space-between; margin-top: 16px;
                      padding-top: 16px; border-top: 1px solid #f0ebe4; font-size: 0.9rem; }
        .cost { font-weight: 700; color: #e55d2b; }
        .total { background: #e55d2b; color: white; border-radius: 16px; padding: 24px; text-align: center; margin-top: 32px; }
        .total h3 { font-family: 'Playfair Display', serif; font-size: 1.8rem; }
      </style>
      
      <h1>🇹🇳 Mon Itinéraire Tunisie</h1>
      <p class="subtitle">Généré par VisitTunisia AI Planner</p>
      
      ${dayBlocks}
      
      <div class="total">
        <h3>Coût total estimé : ${trip.totalCost} TND</h3>
      </div>
    </div>
  `;

  // 3. Execution with corrected Options
  const options = {
    margin: [10, 0] as const, // Fixed vertical margin, 0 horizontal to rely on container padding
    filename: `itineraire-${'carthago'}.pdf`,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { 
      scale: 2, 
      useCORS: true, 
      letterRendering: true,
      scrollY: 0 
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Run the conversion
  html2pdf().set(options).from(elementHTML).save();
}

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
  <title>Tunisie Plan by Carthago</title>
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
   DayCard Component
───────────────────────────────────────────── */
interface DayCardProps {
  day: Day;
  dayIndex: number;
  onRemove: (dayIndex: number) => void;
  onUpdate: (dayIndex: number, updated: Day) => void;
}

const DayCard: React.FC<DayCardProps> = ({ day, dayIndex, onRemove, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Day>(() => structuredClone(day));
  const [confirmRemove, setConfirmRemove] = useState(false);

  // Keep editData in sync when day prop changes externally (e.g. via chat)
  useEffect(() => {
    setEditData(structuredClone(day));
  }, [day]);

  const handleSave = () => {
    // Recalculate totalCost for this day (keep estimatedCost as-is, user may have changed it)
    onUpdate(dayIndex, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(structuredClone(day));
    setIsEditing(false);
  };

  const updateActivity = (actIdx: number, field: keyof Activity, value: string) => {
    setEditData((prev) => {
      const updated = structuredClone(prev);
      updated.activities[actIdx][field] = value;
      return updated;
    });
  };

  const removeActivity = (actIdx: number) => {
    setEditData((prev) => {
      const updated = structuredClone(prev);
      updated.activities.splice(actIdx, 1);
      return updated;
    });
  };

  const addActivity = () => {
    setEditData((prev) => {
      const updated = structuredClone(prev);
      updated.activities.push({ time: "12:00", title: "Nouvelle activité", description: "Description..." });
      return updated;
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`p-6 rounded-2xl border bg-card hover:shadow-xl transition ${isEditing ? "ring-2 ring-primary/40" : ""}`}
    >
      {/* ── Card Header ── */}
      <div className="flex justify-between items-start mb-4 gap-2">
        <div className="flex-1">
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <input
                className="font-bold text-base rounded-lg border px-2 py-1 w-full outline-none focus:ring-2 focus:ring-primary/30"
                value={`Jour ${dayIndex + 1} — ${editData.region}`}
                onChange={(e) => {
                  // Allow editing region name after the dash
                  const parts = e.target.value.split("—");
                  const newRegion = parts[1]?.trim() ?? editData.region;
                  setEditData((prev) => ({ ...prev, region: newRegion }));
                }}
              />
              <div className="flex gap-2 items-center text-sm">
                <Sun className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                <input
                  type="number"
                  className="w-16 rounded border px-2 py-1 outline-none focus:ring-2 focus:ring-primary/30"
                  value={editData.weather.temp}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      weather: { ...prev.weather, temp: +e.target.value },
                    }))
                  }
                />
                <span>°C</span>
                <input
                  className="flex-1 rounded border px-2 py-1 outline-none focus:ring-2 focus:ring-primary/30"
                  value={editData.weather.condition}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      weather: { ...prev.weather, condition: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-bold text-base">Jour {dayIndex + 1} — {day.region}</h3>
              <div className="text-sm flex items-center gap-1 mt-0.5 text-muted-foreground">
                <Sun className="h-3.5 w-3.5 text-yellow-500" />
                {day.weather.temp}°C · {day.weather.condition}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                title="Sauvegarder"
                className="h-8 w-8 rounded-lg bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={handleCancel}
                title="Annuler"
                className="h-8 w-8 rounded-lg bg-muted hover:bg-border text-muted-foreground flex items-center justify-center transition"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                title="Modifier ce jour"
                className="h-8 w-8 rounded-lg bg-muted hover:bg-blue-100 hover:text-blue-600 text-muted-foreground flex items-center justify-center transition"
              >
                <Pencil className="h-4 w-4" />
              </button>
              {confirmRemove ? (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-red-500 font-medium">Supprimer ?</span>
                  <button
                    onClick={() => onRemove(dayIndex)}
                    className="h-7 px-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition"
                  >
                    Oui
                  </button>
                  <button
                    onClick={() => setConfirmRemove(false)}
                    className="h-7 px-2 rounded-lg bg-muted hover:bg-border text-xs transition"
                  >
                    Non
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmRemove(true)}
                  title="Supprimer ce jour"
                  className="h-8 w-8 rounded-lg bg-muted hover:bg-red-100 hover:text-red-500 text-muted-foreground flex items-center justify-center transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Activities ── */}
      <div className="border-l-2 border-primary pl-4 space-y-4">
        {(isEditing ? editData : day).activities.map((a, i) => (
          <div key={i} className="flex gap-3 items-start">
            {isEditing ? (
              <>
                <input
                  className="font-mono text-sm text-primary w-16 rounded border px-1.5 py-1 outline-none focus:ring-2 focus:ring-primary/30 flex-shrink-0"
                  value={editData.activities[i].time}
                  onChange={(e) => updateActivity(i, "time", e.target.value)}
                />
                <div className="flex-1 space-y-1">
                  <input
                    className="w-full font-medium text-sm rounded border px-2 py-1 outline-none focus:ring-2 focus:ring-primary/30"
                    value={editData.activities[i].title}
                    onChange={(e) => updateActivity(i, "title", e.target.value)}
                  />
                  <textarea
                    rows={2}
                    className="w-full text-xs text-muted-foreground rounded border px-2 py-1 resize-none outline-none focus:ring-2 focus:ring-primary/30"
                    value={editData.activities[i].description}
                    onChange={(e) => updateActivity(i, "description", e.target.value)}
                  />
                </div>
                <button
                  onClick={() => removeActivity(i)}
                  className="h-7 w-7 rounded-lg bg-muted hover:bg-red-100 hover:text-red-500 flex items-center justify-center transition flex-shrink-0 mt-0.5"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <>
                <span className="text-sm font-mono text-primary w-14 flex-shrink-0">{a.time}</span>
                <div>
                  <p className="font-medium text-sm">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.description}</p>
                </div>
              </>
            )}
          </div>
        ))}

        {isEditing && (
          <button
            onClick={addActivity}
            className="text-xs text-primary hover:underline mt-1"
          >
            + Ajouter une activité
          </button>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="mt-4 pt-4 border-t flex justify-between text-sm gap-2">
        {isEditing ? (
          <>
            <input
              className="flex-1 rounded border px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              value={editData.accommodation}
              onChange={(e) => setEditData((prev) => ({ ...prev, accommodation: e.target.value }))}
              placeholder="Hébergement"
            />
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-muted-foreground">~</span>
              <input
                type="number"
                className="w-24 rounded border px-2 py-1 text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-primary/30"
                value={editData.estimatedCost}
                onChange={(e) => setEditData((prev) => ({ ...prev, estimatedCost: +e.target.value }))}
              />
              <span className="text-primary font-bold">TND</span>
            </div>
          </>
        ) : (
          <>
            <span><MapPin className="inline h-4 w-4 mr-1" />{day.accommodation}</span>
            <span className="font-bold text-primary">~{day.estimatedCost} TND</span>
          </>
        )}
      </div>
    </motion.div>
  );
};

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

  const [history, setHistory] = useState<Trip[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const trip = historyIndex >= 0 ? history[historyIndex] : null;

  const pushHistory = (newTrip: Trip) => {
    const next = history.slice(0, historyIndex + 1);
    setHistory([...next, newTrip]);
    setHistoryIndex(next.length);
  };

  const undo = () => historyIndex > 0 && setHistoryIndex((i) => i - 1);
  const redo = () => historyIndex < history.length - 1 && setHistoryIndex((i) => i + 1);

  const [loading, setLoading] = useState(false);

  // Chat state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, chatLoading]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") { e.preventDefault(); undo(); }
      if ((e.metaKey || e.ctrlKey) && e.key === "y") { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [historyIndex, history]);

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
    setHistory([]); setHistoryIndex(-1);
    setChatHistory([]);
    try {
      const result = await api.generateTrip({
        duration: form.duration,
        travelType: form.travelType,
        interests: form.interests,
        regions: form.regions,
        budget: form.budget,
      });
      pushHistory(result);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  /* ── Remove a day card manually ── */
  const handleRemoveDay = (dayIndex: number) => {
    if (!trip) return;
    const updated = structuredClone(trip);
    updated.days.splice(dayIndex, 1);
    // Re-number days
    updated.days = updated.days.map((d, idx) => ({ ...d, day: idx + 1 }));
    updated.totalCost = updated.days.reduce((sum, d) => sum + d.estimatedCost, 0);
    pushHistory(updated);
  };

  /* ── Update a day card manually ── */
  const handleUpdateDay = (dayIndex: number, updatedDay: Day) => {
    if (!trip) return;
    const updated = structuredClone(trip);
    updated.days[dayIndex] = { ...updatedDay, day: dayIndex + 1 };
    updated.totalCost = updated.days.reduce((sum, d) => sum + d.estimatedCost, 0);
    pushHistory(updated);
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

      if (result.updatedPlan) {
        pushHistory(result.updatedPlan);
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

  const REGION_COORDS: Record<string, [number, number]> = {
    "Tunis": [36.8, 10.18],
    "Djerba": [33.8, 10.85],
    "Tozeur": [33.9, 8.13],
    "Hammamet": [36.4, 10.6],
    "Sousse": [35.8, 10.6],
    "Sfax": [34.7, 10.76],
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
                <button
                  // hedhii onClick={() => downloadPlanAsHTML(trip)}
                  onClick={()=>downloadPlanAsPDF(trip)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted text-sm font-medium transition"
                >
                  <Download className="h-4 w-4" />
                  Télécharger
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={undo}
                    disabled={historyIndex <= 0}
                    title="Annuler (Ctrl+Z)"
                    className="px-2 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-muted disabled:opacity-30 transition"
                  >↩</button>
                  <button
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                    title="Rétablir (Ctrl+Y)"
                    className="px-2 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-muted disabled:opacity-30 transition"
                  >↪</button>
                </div>
                <button
                  onClick={generate}
                  className="flex items-center gap-2 text-sm text-primary hover:opacity-80 transition"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Régénérer
                </button>
              </div>
            </div>

            {/* Day cards — now using DayCard with remove/edit */}
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {trip.days.map((day, idx) => (
                  <DayCard
                    key={`day-${day.day}-${idx}`}
                    day={day}
                    dayIndex={idx}
                    onRemove={handleRemoveDay}
                    onUpdate={handleUpdateDay}
                  />
                ))}
              </AnimatePresence>
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

              {/* Interactive map */}
              {/* <div className="mt-8 rounded-2xl overflow-hidden border h-72">
                <MapContainer center={[33.8, 9.5]} zoom={6} className="h-full w-full">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  
                  {trip.days.map((day) => {
                    const coords = REGION_COORDS[day.region];
                    if (!coords) return null;
                    return (
                      <Marker key={day.day} position={coords}>
                        <Popup>Jour {day.day} — {day.region}</Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div> */}
                {/* Interactive map */}
                <div className="mt-8 rounded-2xl overflow-hidden border h-72">
                  <MapContainer center={[33.8, 9.5]} zoom={6} className="h-full w-full">
                    
                    {/* This is the correct React way to swap to English labels */}
                    <TileLayer 
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}" 
                      attribution='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, Google, and the GIS User Community'
                    />

                    {trip.days.map((day) => {
                      const coords = REGION_COORDS[day.region];
                      if (!coords) return null;
                      return (
                        <Marker key={day.day} position={coords}>
                          <Popup>Jour {day.day} — {day.region}</Popup>
                        </Marker>
                      );
                    })}
                  </MapContainer>
                </div>
              {/* Chat messages */}
              <div className="rounded-2xl border bg-card overflow-hidden mt-6">
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
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
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