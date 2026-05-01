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
  Star,
  UtensilsCrossed,
  ShoppingBag,
  Lightbulb,
  ShoppingCart,
  Info,
  Thermometer,
  Clock,
  DollarSign,
  Package,
} from "lucide-react";

import { apiService } from "@/services/api";
import { regions } from "@/data/mockData";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import html2pdf from "html2pdf.js";

/* ─────────────────────────────────────────────
   Types (enriched)
───────────────────────────────────────────── */
interface Sponsor {
  type: "restaurant" | "artisan" | "guest_house" | "experience" | "product";
  name: string;
  highlight: string;
  address?: string;
  booking_tip?: string;
}

interface Activity {
  time: string;
  title: string;
  description: string;
  insider_tip?: string;
  duration_minutes?: number;
  cost_per_person?: number;
  category?: string;
  sponsor?: Sponsor | null;
}

interface ShoppingRecommendation {
  name: string;
  shop: string;
  address: string;
  price_range: string;
  why_buy: string;
  availability: "in-store" | "both" | "marketplace";
  sponsored: boolean;
}

interface MarketplacePick {
  product: string;
  price: string;
  url_slug: string;
  pitch: string;
}

interface TravelTip {
  category: string;
  tip: string;
}

interface Accommodation {
  name: string;
  type: "hotel" | "guest_house" | "riad";
  description: string;
  unique_character?: string;
  is_sponsor: boolean;
  price_per_night: number;
  address?: string;
  booking_tip?: string;
}

interface Weather {
  temp: number;
  condition: string;
  advice?: string;
}

interface SponsorSummaryItem {
  name: string;
  type: string;
  day: number;
  region?: string;
}

interface TripSummary {
  title?: string;
  tagline?: string;
  traveler_profile?: string;
  budget_level?: string;
  season?: string;
  regions?: string[];
  total_days?: number;
  highlights?: string[];
}

interface Day {
  day: number;
  region: string;
  daily_narrative?: string;
  weather: Weather;
  activities: Activity[];
  shopping_recommendations?: ShoppingRecommendation[];
  accommodation: Accommodation | string;
  estimatedCost: number;
  sponsor_highlight?: string | null;
}

interface Trip {
  trip_summary?: TripSummary;
  days: Day[];
  totalCost: number;
  estimated_shopping_budget?: number;
  carthago_marketplace_picks?: MarketplacePick[];
  travel_tips?: TravelTip[];
  sponsors_summary?: SponsorSummaryItem[];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function getAccommodationName(acc: Accommodation | string): string {
  if (!acc) return "";
  if (typeof acc === "string") return acc;
  return acc.name;
}
function getAccommodationDescription(acc: Accommodation | string): string {
  if (!acc || typeof acc === "string") return "";
  return acc.description ?? "";
}
function getAccommodationUniqueChar(acc: Accommodation | string): string {
  if (!acc || typeof acc === "string") return "";
  return (acc as Accommodation).unique_character ?? "";
}
function getAccommodationAddress(acc: Accommodation | string): string {
  if (!acc || typeof acc === "string") return "";
  return (acc as Accommodation).address ?? "";
}
function getAccommodationBookingTip(acc: Accommodation | string): string {
  if (!acc || typeof acc === "string") return "";
  return (acc as Accommodation).booking_tip ?? "";
}
function isAccommodationSponsor(acc: Accommodation | string): boolean {
  if (!acc || typeof acc === "string") return false;
  return (acc as Accommodation).is_sponsor ?? false;
}

const SPONSOR_TYPE_ICON: Record<string, React.ReactNode> = {
  restaurant: <UtensilsCrossed className="h-3 w-3" />,
  artisan: <ShoppingBag className="h-3 w-3" />,
  guest_house: <MapPin className="h-3 w-3" />,
  experience: <Star className="h-3 w-3" />,
  product: <Package className="h-3 w-3" />,
};

const SPONSOR_TYPE_COLOR: Record<string, string> = {
  restaurant: "bg-orange-100 text-orange-700 border-orange-200",
  artisan: "bg-purple-100 text-purple-700 border-purple-200",
  guest_house: "bg-blue-100 text-blue-700 border-blue-200",
  experience: "bg-green-100 text-green-700 border-green-200",
  product: "bg-pink-100 text-pink-700 border-pink-200",
};

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  culture: <Star className="h-3 w-3" />,
  restaurant: <UtensilsCrossed className="h-3 w-3" />,
  artisan_experience: <ShoppingBag className="h-3 w-3" />,
  scenic: <Sun className="h-3 w-3" />,
  shopping: <ShoppingCart className="h-3 w-3" />,
};

const TIP_CATEGORY_ICON: Record<string, string> = {
  transport: "🚌",
  culture: "🕌",
  food: "🍽️",
  safety: "🛡️",
  money: "💰",
  health: "💊",
};

/* ─────────────────────────────────────────────
   PDF Download (enriched)
───────────────────────────────────────────── */
function downloadPlanAsPDF(trip: Trip) {
  const summary = trip.trip_summary;
  const dayBlocks = trip.days
    .map((day) => {
      const accName = getAccommodationName(day.accommodation);
      const accDesc = getAccommodationDescription(day.accommodation);
      const accChar = getAccommodationUniqueChar(day.accommodation);
      const shoppingBlock = day.shopping_recommendations?.length
        ? `<div class="shopping-block">
            <h4>🛍️ Shopping du jour</h4>
            ${day.shopping_recommendations
              .map(
                (s) => `<div class="shop-item">
              <strong>${s.name}</strong> — ${s.shop}${s.sponsored ? ' <span class="badge">Carthago</span>' : ""}
              <p>${s.why_buy}</p>
              <span class="price">${s.price_range} TND · ${s.availability === "both" ? "En boutique & Marketplace" : s.availability}</span>
            </div>`
              )
              .join("")}
          </div>`
        : "";

      return `
    <div class="day">
      <div class="day-header">
        <h2>Jour ${day.day} — ${day.region}</h2>
        <span class="weather">☀️ ${day.weather.temp}°C · ${day.weather.condition}${day.weather.advice ? ` · ${day.weather.advice}` : ""}</span>
      </div>
      ${day.daily_narrative ? `<p class="narrative">${day.daily_narrative}</p>` : ""}
      <div class="activities">
        ${day.activities
          .map(
            (a) => `
          <div class="activity">
            <span class="time">${a.time}</span>
            <div>
              <strong>${a.title}</strong>
              ${a.duration_minutes ? `<span class="duration">${a.duration_minutes} min</span>` : ""}
              <p>${a.description}</p>
              ${a.insider_tip ? `<p class="tip">💡 ${a.insider_tip}</p>` : ""}
              ${a.sponsor ? `<span class="sponsor-badge">⭐ ${a.sponsor.name} — ${a.sponsor.highlight}</span>` : ""}
            </div>
          </div>`
          )
          .join("")}
      </div>
      ${shoppingBlock}
      <div class="day-footer">
        <div>
          <span>📍 ${accName}</span>
          ${accChar ? `<p class="acc-char">${accChar}</p>` : ""}
          ${accDesc ? `<p class="acc-desc">${accDesc}</p>` : ""}
        </div>
        <span class="cost">~${day.estimatedCost} TND</span>
      </div>
    </div>`;
    })
    .join("");

  const marketplaceBlock = trip.carthago_marketplace_picks?.length
    ? `<div class="marketplace">
        <h3>🛒 Carthago Marketplace — Coups de cœur</h3>
        ${trip.carthago_marketplace_picks
          .map((p) => `<div class="mp-item"><strong>${p.product}</strong> — ${p.price}<br/><em>${p.pitch}</em></div>`)
          .join("")}
      </div>`
    : "";

  const tipsBlock = trip.travel_tips?.length
    ? `<div class="tips">
        <h3>✈️ Conseils pratiques</h3>
        ${trip.travel_tips.map((t) => `<p>${TIP_CATEGORY_ICON[t.category] ?? "ℹ️"} ${t.tip}</p>`).join("")}
      </div>`
    : "";

  const elementHTML = `
    <div style="width: 790px; padding: 20px; background: #fdf8f3; box-sizing: border-box;">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; color: #1a1a1a; }
        h1 { font-family: 'Playfair Display', serif; font-size: 2.2rem; text-align: center; color: #e55d2b; margin-bottom: 4px; }
        .tagline { text-align: center; color: #555; margin-bottom: 6px; font-style: italic; font-size: 0.95rem; }
        .subtitle { text-align: center; color: #aaa; margin-bottom: 36px; font-size: 0.8rem; }
        .day { background: #fff; border-radius: 16px; padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 16px rgba(0,0,0,0.07); page-break-inside: avoid; }
        .day-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
        .day-header h2 { font-family: 'Playfair Display', serif; font-size: 1.2rem; }
        .weather { font-size: 0.8rem; color: #f5a623; font-weight: 500; max-width: 220px; text-align: right; }
        .narrative { font-size: 0.87rem; color: #444; font-style: italic; border-left: 3px solid #e55d2b; padding-left: 12px; margin-bottom: 14px; line-height: 1.5; }
        .activities { border-left: 2px solid #e55d2b; padding-left: 16px; }
        .activity { display: flex; gap: 12px; margin-bottom: 14px; }
        .time { font-family: monospace; color: #e55d2b; font-weight: 600; min-width: 50px; font-size: 0.85rem; }
        .duration { font-size: 0.72rem; color: #aaa; margin-left: 8px; }
        .activity p { font-size: 0.82rem; color: #555; margin-top: 2px; }
        .tip { color: #2563eb !important; font-size: 0.78rem !important; }
        .sponsor-badge { display: inline-block; margin-top: 4px; font-size: 0.72rem; color: #e55d2b; background: #fff5f0; padding: 2px 8px; border-radius: 99px; border: 1px solid #fdd0bb; }
        .shopping-block { margin-top: 14px; padding: 12px; background: #f9f5ff; border-radius: 10px; border: 1px solid #e9d8ff; }
        .shopping-block h4 { font-size: 0.85rem; margin-bottom: 8px; color: #6d28d9; }
        .shop-item { margin-bottom: 8px; font-size: 0.8rem; }
        .shop-item p { color: #555; font-size: 0.75rem; margin: 2px 0; }
        .price { font-size: 0.72rem; color: #888; }
        .badge { background: #e55d2b; color: white; padding: 1px 6px; border-radius: 99px; font-size: 0.68rem; }
        .day-footer { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 16px; padding-top: 14px; border-top: 1px solid #f0ebe4; font-size: 0.85rem; }
        .acc-char { font-size: 0.75rem; color: #888; font-style: italic; margin-top: 3px; }
        .acc-desc { font-size: 0.75rem; color: #aaa; margin-top: 2px; }
        .cost { font-weight: 700; color: #e55d2b; flex-shrink: 0; }
        .marketplace { background: #fff7f0; border-radius: 14px; padding: 20px; margin-top: 24px; border: 1px solid #fdd0bb; }
        .marketplace h3 { font-family: 'Playfair Display', serif; color: #e55d2b; margin-bottom: 12px; }
        .mp-item { margin-bottom: 10px; font-size: 0.82rem; }
        .mp-item em { color: #777; }
        .tips { background: #f0f9ff; border-radius: 14px; padding: 20px; margin-top: 16px; border: 1px solid #bae6fd; }
        .tips h3 { color: #0284c7; margin-bottom: 12px; font-family: 'Playfair Display', serif; }
        .tips p { font-size: 0.82rem; color: #444; margin-bottom: 6px; line-height: 1.5; }
        .total { background: linear-gradient(135deg, #e55d2b, #f97316); color: white; border-radius: 16px; padding: 24px; text-align: center; margin-top: 32px; }
        .total h3 { font-family: 'Playfair Display', serif; font-size: 1.6rem; }
        .total p { font-size: 0.85rem; opacity: 0.85; margin-top: 4px; }
      </style>
      <h1>🇹🇳 ${summary?.title ?? "Mon Itinéraire Tunisie"}</h1>
      ${summary?.tagline ? `<p class="tagline">${summary.tagline}</p>` : ""}
      <p class="subtitle">Généré par Carthago AI Planner</p>
      ${dayBlocks}
      ${marketplaceBlock}
      ${tipsBlock}
      <div class="total">
        <h3>Coût estimé : ${trip.totalCost} TND</h3>
        ${trip.estimated_shopping_budget ? `<p>Budget shopping recommandé : ~${trip.estimated_shopping_budget} TND</p>` : ""}
      </div>
    </div>`;

  const options = {
    margin: [10, 0] as const,
    filename: `itineraire-carthago.pdf`,
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true, scrollY: 0 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };
  html2pdf().set(options).from(elementHTML).save();
}

/* ─────────────────────────────────────────────
   SponsorBadge
───────────────────────────────────────────── */
const SponsorBadge: React.FC<{ sponsor: Sponsor }> = ({ sponsor }) => (
  <div className="mt-1.5 space-y-0.5">
    <span
      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium
      ${SPONSOR_TYPE_COLOR[sponsor.type] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}
    >
      {SPONSOR_TYPE_ICON[sponsor.type]}
      {sponsor.name}
      <span className="font-normal opacity-70">· {sponsor.highlight}</span>
    </span>
    {sponsor.address && (
      <p className="text-xs text-muted-foreground flex items-center gap-1 ml-1">
        <MapPin className="h-2.5 w-2.5" /> {sponsor.address}
      </p>
    )}
    {sponsor.booking_tip && (
      <p className="text-xs text-blue-500 ml-1">💡 {sponsor.booking_tip}</p>
    )}
  </div>
);

/* ─────────────────────────────────────────────
   InsiderTip
───────────────────────────────────────────── */
const InsiderTip: React.FC<{ tip: string }> = ({ tip }) => (
  <div className="mt-1.5 flex items-start gap-1.5 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5">
    <Lightbulb className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
    <p className="text-xs text-amber-700 leading-snug">{tip}</p>
  </div>
);

/* ─────────────────────────────────────────────
   ShoppingCard
───────────────────────────────────────────── */
const ShoppingCard: React.FC<{ rec: ShoppingRecommendation }> = ({ rec }) => (
  <div className={`rounded-xl border p-3 text-xs space-y-1 ${rec.sponsored ? "border-orange-200 bg-orange-50" : "border-border bg-muted/40"}`}>
    <div className="flex justify-between items-start gap-2">
      <span className="font-semibold text-sm leading-tight">{rec.name}</span>
      {rec.sponsored && (
        <span className="inline-flex items-center gap-1 text-[10px] bg-orange-100 text-orange-700 border border-orange-200 px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">
          <Star className="h-2.5 w-2.5" /> Carthago
        </span>
      )}
    </div>
    <p className="text-muted-foreground italic">{rec.why_buy}</p>
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-muted-foreground">
      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{rec.shop}</span>
      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{rec.price_range} TND</span>
      <span className="flex items-center gap-1">
        <ShoppingCart className="h-3 w-3" />
        {rec.availability === "both" ? "Boutique & Marketplace" : rec.availability === "marketplace" ? "Carthago Marketplace" : "En boutique"}
      </span>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   TripSummaryBanner
───────────────────────────────────────────── */
const TripSummaryBanner: React.FC<{ summary: TripSummary }> = ({ summary }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-8 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 p-6"
  >
    {summary.title && (
      <h2 className="text-xl font-bold text-orange-800 mb-1">{summary.title}</h2>
    )}
    {summary.tagline && (
      <p className="text-sm text-orange-600 italic mb-4">{summary.tagline}</p>
    )}
    <div className="flex flex-wrap gap-2 mb-4">
      {summary.traveler_profile && (
        <span className="px-3 py-1 rounded-full text-xs bg-white border border-orange-200 text-orange-700 font-medium">
          👤 {summary.traveler_profile}
        </span>
      )}
      {summary.budget_level && (
        <span className="px-3 py-1 rounded-full text-xs bg-white border border-orange-200 text-orange-700 font-medium">
          💰 {summary.budget_level}
        </span>
      )}
      {summary.season && (
        <span className="px-3 py-1 rounded-full text-xs bg-white border border-orange-200 text-orange-700 font-medium">
          🌤 {summary.season}
        </span>
      )}
      {summary.total_days && (
        <span className="px-3 py-1 rounded-full text-xs bg-white border border-orange-200 text-orange-700 font-medium">
          📅 {summary.total_days} jours
        </span>
      )}
    </div>
    {summary.highlights?.length && (
      <div>
        <p className="text-xs font-semibold text-orange-700 mb-2 uppercase tracking-wide">Points forts</p>
        <ul className="space-y-1">
          {summary.highlights.map((h, i) => (
            <li key={i} className="text-sm text-orange-800 flex items-start gap-2">
              <span className="text-orange-400 mt-0.5">✦</span> {h}
            </li>
          ))}
        </ul>
      </div>
    )}
  </motion.div>
);

/* ─────────────────────────────────────────────
   MarketplaceStrip
───────────────────────────────────────────── */
const MarketplaceStrip: React.FC<{ picks: MarketplacePick[] }> = ({ picks }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="mt-8 rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-5"
  >
    <p className="text-sm font-bold text-purple-700 mb-3 flex items-center gap-2">
      <ShoppingCart className="h-4 w-4" /> Carthago Marketplace — Coups de cœur du voyage
    </p>
    <div className="grid gap-3 sm:grid-cols-2">
      {picks.map((p, i) => (
        <div key={i} className="rounded-xl bg-white border border-purple-100 p-3 text-xs">
          <p className="font-semibold text-purple-800 mb-0.5">{p.product}</p>
          <p className="text-purple-500 font-bold mb-1">{p.price}</p>
          <p className="text-muted-foreground italic">{p.pitch}</p>
        </div>
      ))}
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────
   TravelTipsStrip
───────────────────────────────────────────── */
const TravelTipsStrip: React.FC<{ tips: TravelTip[] }> = ({ tips }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5"
  >
    <p className="text-sm font-bold text-blue-700 mb-3 flex items-center gap-2">
      <Info className="h-4 w-4" /> Conseils pratiques
    </p>
    <div className="space-y-2">
      {tips.map((t, i) => (
        <div key={i} className="flex items-start gap-2 text-xs text-blue-800">
          <span className="flex-shrink-0">{TIP_CATEGORY_ICON[t.category] ?? "ℹ️"}</span>
          <p>{t.tip}</p>
        </div>
      ))}
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────
   DayCard (enriched)
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
  const [showShopping, setShowShopping] = useState(false);

  useEffect(() => { setEditData(structuredClone(day)); }, [day]);

  const accName = getAccommodationName(day.accommodation);
  const accDesc = getAccommodationDescription(day.accommodation);
  const accChar = getAccommodationUniqueChar(day.accommodation);
  const accAddress = getAccommodationAddress(day.accommodation);
  const accBookingTip = getAccommodationBookingTip(day.accommodation);
  const isSponsorAcc = isAccommodationSponsor(day.accommodation);
  const sponsorCount = day.activities.filter((a) => a.sponsor).length + (isSponsorAcc ? 1 : 0);
  const hasShoppingRecs = (day.shopping_recommendations?.length ?? 0) > 0;

  const handleSave = () => { onUpdate(dayIndex, editData); setIsEditing(false); };
  const handleCancel = () => { setEditData(structuredClone(day)); setIsEditing(false); };

  const updateActivity = (actIdx: number, field: keyof Activity, value: string | number) => {
    setEditData((prev) => {
      const updated = structuredClone(prev);
      (updated.activities[actIdx] as any)[field] = value;
      return updated;
    });
  };
  const removeActivity = (actIdx: number) => {
    setEditData((prev) => { const u = structuredClone(prev); u.activities.splice(actIdx, 1); return u; });
  };
  const addActivity = () => {
    setEditData((prev) => {
      const u = structuredClone(prev);
      u.activities.push({ time: "12:00", title: "Nouvelle activité", description: "Description...", sponsor: null });
      return u;
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
      {/* ── Header ── */}
      <div className="flex justify-between items-start mb-3 gap-2">
        <div className="flex-1">
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <input
                className="font-bold text-base rounded-lg border px-2 py-1 w-full outline-none focus:ring-2 focus:ring-primary/30"
                value={`Jour ${dayIndex + 1} — ${editData.region}`}
                onChange={(e) => {
                  const parts = e.target.value.split("—");
                  const newRegion = parts[1]?.trim() ?? editData.region;
                  setEditData((prev) => ({ ...prev, region: newRegion }));
                }}
              />
              <div className="flex gap-2 items-center text-sm">
                <Sun className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                <input type="number" className="w-16 rounded border px-2 py-1 outline-none focus:ring-2 focus:ring-primary/30"
                  value={editData.weather.temp}
                  onChange={(e) => setEditData((prev) => ({ ...prev, weather: { ...prev.weather, temp: +e.target.value } }))} />
                <span>°C</span>
                <input className="flex-1 rounded border px-2 py-1 outline-none focus:ring-2 focus:ring-primary/30"
                  value={editData.weather.condition}
                  onChange={(e) => setEditData((prev) => ({ ...prev, weather: { ...prev.weather, condition: e.target.value } }))} />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base">Jour {dayIndex + 1} — {day.region}</h3>
                {sponsorCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                    <Star className="h-3 w-3" /> {sponsorCount} partenaire{sponsorCount > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <div className="text-sm flex items-center gap-1 text-muted-foreground">
                  <Thermometer className="h-3.5 w-3.5 text-yellow-500" />
                  {day.weather.temp}°C · {day.weather.condition}
                </div>
                {day.weather.advice && (
                  <div className="text-xs text-blue-500 flex items-center gap-1">
                    <Info className="h-3 w-3" /> {day.weather.advice}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Action buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="h-8 w-8 rounded-lg bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition">
                <Check className="h-4 w-4" />
              </button>
              <button onClick={handleCancel} className="h-8 w-8 rounded-lg bg-muted hover:bg-border text-muted-foreground flex items-center justify-center transition">
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} className="h-8 w-8 rounded-lg bg-muted hover:bg-blue-100 hover:text-blue-600 text-muted-foreground flex items-center justify-center transition">
                <Pencil className="h-4 w-4" />
              </button>
              {confirmRemove ? (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-red-500 font-medium">Supprimer ?</span>
                  <button onClick={() => onRemove(dayIndex)} className="h-7 px-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition">Oui</button>
                  <button onClick={() => setConfirmRemove(false)} className="h-7 px-2 rounded-lg bg-muted hover:bg-border text-xs transition">Non</button>
                </div>
              ) : (
                <button onClick={() => setConfirmRemove(true)} className="h-8 w-8 rounded-lg bg-muted hover:bg-red-100 hover:text-red-500 text-muted-foreground flex items-center justify-center transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Daily Narrative ── */}
      {!isEditing && day.daily_narrative && (
        <p className="text-sm text-muted-foreground italic border-l-2 border-orange-200 pl-3 mb-4 leading-relaxed">
          {day.daily_narrative}
        </p>
      )}

      {/* ── Activities ── */}
      <div className="border-l-2 border-primary pl-4 space-y-4">
        {(isEditing ? editData : day).activities.map((a, i) => (
          <div key={i} className="flex gap-3 items-start">
            {isEditing ? (
              <>
                <input className="font-mono text-sm text-primary w-16 rounded border px-1.5 py-1 outline-none focus:ring-2 focus:ring-primary/30 flex-shrink-0"
                  value={editData.activities[i].time}
                  onChange={(e) => updateActivity(i, "time", e.target.value)} />
                <div className="flex-1 space-y-1">
                  <input className="w-full font-medium text-sm rounded border px-2 py-1 outline-none focus:ring-2 focus:ring-primary/30"
                    value={editData.activities[i].title}
                    onChange={(e) => updateActivity(i, "title", e.target.value)} />
                  <textarea rows={2} className="w-full text-xs text-muted-foreground rounded border px-2 py-1 resize-none outline-none focus:ring-2 focus:ring-primary/30"
                    value={editData.activities[i].description}
                    onChange={(e) => updateActivity(i, "description", e.target.value)} />
                </div>
                <button onClick={() => removeActivity(i)} className="h-7 w-7 rounded-lg bg-muted hover:bg-red-100 hover:text-red-500 flex items-center justify-center transition flex-shrink-0 mt-0.5">
                  <X className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <>
                <span className="text-sm font-mono text-primary w-14 flex-shrink-0 pt-0.5">{a.time}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm">{a.title}</p>
                    {a.duration_minutes && (
                      <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                        <Clock className="h-3 w-3" /> {a.duration_minutes} min
                      </span>
                    )}
                    {a.cost_per_person !== undefined && a.cost_per_person > 0 && (
                      <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                        <DollarSign className="h-3 w-3" /> {a.cost_per_person} TND/pers.
                      </span>
                    )}
                    {a.category && CATEGORY_ICON[a.category] && (
                      <span className="text-xs text-muted-foreground">{CATEGORY_ICON[a.category]}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{a.description}</p>
                  {a.insider_tip && <InsiderTip tip={a.insider_tip} />}
                  {a.sponsor && <SponsorBadge sponsor={a.sponsor} />}
                </div>
              </>
            )}
          </div>
        ))}
        {isEditing && (
          <button onClick={addActivity} className="text-xs text-primary hover:underline mt-1">+ Ajouter une activité</button>
        )}
      </div>

      {/* ── Shopping Recommendations ── */}
      {!isEditing && hasShoppingRecs && (
        <div className="mt-4">
          <button
            onClick={() => setShowShopping((s) => !s)}
            className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition mb-2"
          >
            <ShoppingBag className="h-4 w-4" />
            {showShopping ? "Masquer" : "Voir"} les shopping picks du jour ({day.shopping_recommendations!.length})
          </button>
          <AnimatePresence>
            {showShopping && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid gap-2 sm:grid-cols-2 overflow-hidden"
              >
                {day.shopping_recommendations!.map((rec, i) => (
                  <ShoppingCard key={i} rec={rec} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── Accommodation ── */}
      <div className="mt-4 pt-4 border-t">
        {isEditing ? (
          <div className="flex gap-2">
            <input className="flex-1 rounded border px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              value={getAccommodationName(editData.accommodation)}
              onChange={(e) => setEditData((prev) => {
                const acc = prev.accommodation;
                if (typeof acc === "string") return { ...prev, accommodation: e.target.value };
                return { ...prev, accommodation: { ...acc, name: e.target.value } };
              })}
              placeholder="Hébergement" />
            <div className="flex items-center gap-1 flex-shrink-0">
              <input type="number" className="w-24 rounded border px-2 py-1 text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-primary/30"
                value={editData.estimatedCost}
                onChange={(e) => setEditData((prev) => ({ ...prev, estimatedCost: +e.target.value }))} />
              <span className="text-primary font-bold text-sm">TND</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-between w-full items-start gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <MapPin className="inline h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm font-medium">{accName}</span>
                {isSponsorAcc && (
                  <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium">
                    <Star className="h-3 w-3" /> Partenaire
                  </span>
                )}
              </div>
              {accChar && <p className="text-xs text-orange-600 italic mt-1 ml-5">{accChar}</p>}
              {accDesc && <p className="text-xs text-muted-foreground mt-0.5 ml-5">{accDesc}</p>}
              {accAddress && (
                <p className="text-xs text-muted-foreground mt-0.5 ml-5 flex items-center gap-1">
                  <MapPin className="h-2.5 w-2.5" /> {accAddress}
                </p>
              )}
              {accBookingTip && <p className="text-xs text-blue-500 mt-0.5 ml-5">💡 {accBookingTip}</p>}
            </div>
            <span className="font-bold text-primary flex-shrink-0 text-sm">~{day.estimatedCost} TND</span>
          </div>
        )}
      </div>

      {/* ── Sponsor highlight ── */}
      {!isEditing && day.sponsor_highlight && (
        <p className="mt-3 text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
          ⭐ {day.sponsor_highlight}
        </p>
      )}
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
    season: "summer",
    specialRequests: "",
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
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory, chatLoading]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") { e.preventDefault(); undo(); }
      if ((e.metaKey || e.ctrlKey) && e.key === "y") { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [historyIndex, history]);

  const interests = ["Culture", "Plage", "Désert", "Gastronomie", "Artisanat", "Aventure", "Détente", "Histoire"];
  const budgets = [
    { v: "budget", l: "Budget" },
    { v: "moyen", l: "Moyen" },
    { v: "premium", l: "Luxe" },
  ];
  const travelTypes = [
    { v: "solo", l: "Solo" },
    { v: "couple", l: "Couple" },
    { v: "famille", l: "Famille" },
    { v: "amis", l: "Amis" },
    { v: "business", l: "Business" },
  ];
  const seasons = [
    { v: "spring", l: "🌸 Printemps" },
    { v: "summer", l: "☀️ Été" },
    { v: "autumn", l: "🍂 Automne" },
    { v: "winter", l: "❄️ Hiver" },
  ];

  const toggleInterest = (i: string) =>
    setForm((f) => ({ ...f, interests: f.interests.includes(i) ? f.interests.filter((x) => x !== i) : [...f.interests, i] }));
  const toggleRegion = (r: string) =>
    setForm((f) => ({ ...f, regions: f.regions.includes(r) ? f.regions.filter((x) => x !== r) : [...f.regions, r] }));

  const generate = async () => {
    setLoading(true);
    setHistory([]);
    setHistoryIndex(-1);
    setChatHistory([]);
    try {
      const result = await apiService.generateTrip({
        duration: form.duration,
        traveler_profile: form.travelType,
        interests: form.interests,
        regions: form.regions,
        budget_level: form.budget,
        season: form.season,
        specialRequests: form.specialRequests,
      });
      pushHistory(result);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleRemoveDay = (dayIndex: number) => {
    if (!trip) return;
    const updated = structuredClone(trip);
    updated.days.splice(dayIndex, 1);
    updated.days = updated.days.map((d, idx) => ({ ...d, day: idx + 1 }));
    updated.totalCost = updated.days.reduce((sum, d) => sum + d.estimatedCost, 0);
    pushHistory(updated);
  };

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
      const result = await apiService.chatWithPlan({
        plan: trip,
        message: chatInput,
        history: newHistory.map((m) => ({ role: m.role, content: m.content })),
      });
      setChatHistory((h) => [...h, { role: "assistant", content: result.reply }]);
      if (result.updatedPlan) pushHistory(result.updatedPlan);
    } catch (err) {
      console.error(err);
      setChatHistory((h) => [...h, { role: "assistant", content: "Une erreur s'est produite. Veuillez réessayer." }]);
    }
    setChatLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChatMessage(); }
  };

  const REGION_COORDS: Record<string, [number, number]> = {
    Tunis: [36.8, 10.18], Djerba: [33.8, 10.85], Tozeur: [33.9, 8.13],
    Hammamet: [36.4, 10.6], Sousse: [35.8, 10.6], Sfax: [34.7, 10.76],
  };

  const renderSponsorsSummary = (t: Trip) => {
    if (!t.sponsors_summary?.length) return null;
    const unique = Array.from(new Map(t.sponsors_summary.map((s) => [s.name, s])).values());
    return (
      <div className="mt-4 p-4 rounded-xl border bg-amber-50 border-amber-200">
        <p className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1">
          <Star className="h-3.5 w-3.5" /> Partenaires Carthago dans cet itinéraire
        </p>
        <div className="flex flex-wrap gap-2">
          {unique.map((s) => (
            <span key={s.name} className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${SPONSOR_TYPE_COLOR[s.type] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
              {SPONSOR_TYPE_ICON[s.type]} {s.name}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="py-16 min-h-screen">
      <div className="container mx-auto px-4">
        {/* HERO */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Planifiez votre voyage en Tunisie 🇹🇳
          </h1>
          <p className="text-muted-foreground mt-3">Une expérience sur mesure, propulsée par l'IA</p>
        </div>

        {/* ── FORM ── */}
        {!trip && !loading && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-8">
            <div>
              <label className="block font-medium mb-2">Durée ({form.duration} jours)</label>
              <input type="range" min={1} max={14} value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: +e.target.value }))}
                className="w-full accent-primary" />
            </div>
            <div>
              <label className="block mb-2">Budget</label>
              <div className="flex gap-3 flex-wrap">
                {budgets.map((b) => (
                  <button key={b.v} onClick={() => setForm((f) => ({ ...f, budget: b.v }))}
                    className={`px-4 py-2 rounded-lg ${form.budget === b.v ? "bg-primary text-white" : "bg-muted hover:bg-border"}`}>
                    {b.l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-2">Type de voyage</label>
              <div className="flex flex-wrap gap-3">
                {travelTypes.map((t) => (
                  <button key={t.v} onClick={() => setForm((f) => ({ ...f, travelType: t.v }))}
                    className={`px-4 py-2 rounded-lg ${form.travelType === t.v ? "bg-primary text-white" : "bg-muted hover:bg-border"}`}>
                    {t.l}
                  </button>
                ))}
              </div>
            </div>
            {/* NEW: Season */}
            <div>
              <label className="block mb-2">Saison de voyage</label>
              <div className="flex flex-wrap gap-3">
                {seasons.map((s) => (
                  <button key={s.v} onClick={() => setForm((f) => ({ ...f, season: s.v }))}
                    className={`px-4 py-2 rounded-lg ${form.season === s.v ? "bg-primary text-white" : "bg-muted hover:bg-border"}`}>
                    {s.l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-2">Centres d'intérêt</label>
              <div className="flex flex-wrap gap-2">
                {interests.map((i) => (
                  <button key={i} onClick={() => toggleInterest(i)}
                    className={`px-3 py-1.5 rounded-full text-sm ${form.interests.includes(i) ? "bg-accent text-white" : "bg-muted hover:bg-border"}`}>
                    {i}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-2">Régions</label>
              <div className="flex flex-wrap gap-2">
                {regions.map((r) => (
                  <button key={r.id} onClick={() => toggleRegion(r.id)}
                    className={`px-3 py-1.5 rounded-full text-sm ${form.regions.includes(r.id) ? "bg-blue-500 text-white" : "bg-muted hover:bg-border"}`}>
                    {r.name}
                  </button>
                ))}
              </div>
            </div>
            {/* NEW: Special Requests */}
            <div>
              <label className="block mb-2 font-medium">Demandes spéciales <span className="text-muted-foreground font-normal text-sm">(optionnel)</span></label>
              <textarea
                value={form.specialRequests}
                onChange={(e) => setForm((f) => ({ ...f, specialRequests: e.target.value }))}
                placeholder="Ex : Nous célébrons notre anniversaire de mariage. Végétariens. Pas de trek long."
                rows={2}
                className="w-full rounded-xl border bg-card px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition resize-none"
              />
            </div>
            <button onClick={generate}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold flex justify-center items-center gap-2 hover:opacity-90">
              <Sparkles className="h-5 w-5" />
              Générer mon itinéraire
            </button>
          </motion.div>
        )}

        {/* ── LOADING ── */}
        {loading && (
          <div className="text-center py-16">
            <Bot className="mx-auto h-12 w-12 text-primary animate-bounce" />
            <p className="mt-4 text-muted-foreground">Création de votre voyage personnalisé...</p>
          </div>
        )}

        {/* ── RESULT ── */}
        {trip && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
            {/* Header row */}
            <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
              <h2 className="text-2xl font-bold">Votre itinéraire ✨</h2>
              <div className="flex items-center gap-3">
                <button onClick={() => downloadPlanAsPDF(trip)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted text-sm font-medium transition">
                  <Download className="h-4 w-4" /> PDF
                </button>
                <div className="flex items-center gap-1">
                  <button onClick={undo} disabled={historyIndex <= 0} title="Ctrl+Z"
                    className="px-2 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-muted disabled:opacity-30 transition">↩</button>
                  <button onClick={redo} disabled={historyIndex >= history.length - 1} title="Ctrl+Y"
                    className="px-2 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-muted disabled:opacity-30 transition">↪</button>
                </div>
                <button onClick={generate} className="flex items-center gap-2 text-sm text-primary hover:opacity-80 transition">
                  <RefreshCcw className="h-4 w-4" /> Régénérer
                </button>
              </div>
            </div>

            {/* Trip Summary Banner */}
            {trip.trip_summary && <TripSummaryBanner summary={trip.trip_summary} />}

            {/* Sponsors summary */}
            {renderSponsorsSummary(trip)}

            {/* Day cards */}
            <div className="space-y-6 mt-6">
              <AnimatePresence mode="popLayout">
                {trip.days.map((day, idx) => (
                  <DayCard key={`day-${day.day}-${idx}`} day={day} dayIndex={idx}
                    onRemove={handleRemoveDay} onUpdate={handleUpdateDay} />
                ))}
              </AnimatePresence>
            </div>

            {/* Total cost */}
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white text-center">
              <p className="text-xl font-bold">Total estimé : {trip.totalCost} TND</p>
              {trip.estimated_shopping_budget && (
                <p className="text-sm opacity-85 mt-1">+ ~{trip.estimated_shopping_budget} TND budget shopping recommandé</p>
              )}
            </div>

            {/* Marketplace picks */}
            {trip.carthago_marketplace_picks?.length ? (
              <MarketplaceStrip picks={trip.carthago_marketplace_picks} />
            ) : null}

            {/* Travel tips */}
            {trip.travel_tips?.length ? <TravelTipsStrip tips={trip.travel_tips} /> : null}

            {/* ── CHAT ── */}
            <div className="mt-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Assistant Voyage</h3>
                  <p className="text-sm text-muted-foreground">Modifiez, ajoutez, ou posez vos questions</p>
                </div>
              </div>

              {/* Map */}
              <div className="mt-2 rounded-2xl overflow-hidden border h-72">
                <MapContainer center={[33.8, 9.5]} zoom={6} className="h-full w-full">
                  <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}" attribution="Tiles &copy; Esri" />
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
                      <p className="text-sm">Bonjour ! Modifiez l'itinéraire, demandez des produits à acheter, ou posez vos questions.</p>
                      <div className="flex flex-wrap gap-2 justify-center mt-2">
                        {[
                          "Ajoute une journée à Djerba",
                          "Quels produits acheter au jour 1 ?",
                          "Réduis le budget du jour 2",
                          "Ajoute une expérience romantique",
                        ].map((suggestion) => (
                          <button key={suggestion} onClick={() => setChatInput(suggestion)}
                            className="px-3 py-1.5 rounded-full text-xs bg-muted hover:bg-border transition">
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <AnimatePresence initial={false}>
                    {chatHistory.map((msg, idx) => (
                      <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                        <div className={`h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold
                          ${msg.role === "user" ? "bg-gradient-to-br from-orange-400 to-pink-500" : "bg-gradient-to-br from-blue-600 to-cyan-500"}`}>
                          {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed
                          ${msg.role === "user" ? "bg-primary text-white rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm"}`}>
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
                          <span key={i} className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="border-t p-3 flex gap-2 bg-background">
                  <textarea value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={handleKeyDown}
                    placeholder="Ex: Quels souvenirs acheter à Sousse ? Ajoute une activité de surf..."
                    rows={1}
                    className="flex-1 resize-none rounded-xl border bg-card px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition" />
                  <button onClick={sendChatMessage} disabled={!chatInput.trim() || chatLoading}
                    className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition flex-shrink-0">
                    {chatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3">Entrée pour envoyer · Maj+Entrée pour saut de ligne</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AIPlannerPage;