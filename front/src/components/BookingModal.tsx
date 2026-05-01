import React, { useState } from 'react';
import {
  X,
  CalendarDays,
  Users,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import api from '@/services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: {
    id: number;
    business_name: string;
    activity_type: string;
    services?: string[];
  };
}

type Step = 'form' | 'success' | 'error';

// ─── Component ────────────────────────────────────────────────────────────────

const BookingModal = ({ isOpen, onClose, partner }: BookingModalProps) => {
  const [step, setStep]           = useState<Step>('form');
  const [loading, setLoading]     = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [guests, setGuests]       = useState(1);
  const [serviceId, setServiceId] = useState<string>('');
  const [errorMsg, setErrorMsg]   = useState('');

  const today = new Date().toISOString().split('T')[0];

  const reset = () => {
    setStep('form');
    setBookingDate('');
    setGuests(1);
    setServiceId('');
    setErrorMsg('');
    setLoading(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!bookingDate) {
      setErrorMsg('Veuillez sélectionner une date.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await api.post('/bookings/', {
        // Si votre partenaire est directement lié à un service, utilisez partner.id
        // Sinon adaptez service_id selon votre logique métier
        service_id: serviceId || partner.id,
        booking_date: bookingDate,
        guests,
      });
      setStep('success');
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        'Une erreur est survenue. Veuillez réessayer.';
      setErrorMsg(msg);
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-md bg-card rounded-2xl shadow-2xl border overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-6 py-5 border-b">
            <div>
              <h2 className="font-display text-xl font-bold leading-tight">
                Réserver / Contacter
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5 truncate max-w-[260px]">
                {partner.business_name}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ── Body ── */}
          <div className="px-6 py-6">

            {/* ── FORM STEP ── */}
            {step === 'form' && (
              <div className="space-y-5">

                {/* Date */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    Date souhaitée <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={bookingDate}
                    onChange={(e) => {
                      setBookingDate(e.target.value);
                      setErrorMsg('');
                    }}
                    className="w-full h-11 px-3 rounded-xl border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>

                {/* Guests */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Nombre de personnes
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="h-10 w-10 rounded-xl border bg-muted/30 font-bold text-lg hover:bg-muted transition-colors flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-lg font-semibold">
                      {guests}
                    </span>
                    <button
                      onClick={() => setGuests((g) => Math.min(20, g + 1))}
                      className="h-10 w-10 rounded-xl border bg-muted/30 font-bold text-lg hover:bg-muted transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Service (optionnel si partenaire a des services) */}
                {partner.services && partner.services.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">
                      Service souhaité (optionnel)
                    </label>
                    <select
                      value={serviceId}
                      onChange={(e) => setServiceId(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    >
                      <option value="">-- Sélectionner un service --</option>
                      {partner.services.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Error */}
                {errorMsg && (
                  <div className="flex items-start gap-2 text-destructive text-sm bg-destructive/10 rounded-xl px-3 py-2.5">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    {errorMsg}
                  </div>
                )}

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-3 rounded-xl gradient-mediterranean text-primary-foreground font-semibold hover:opacity-90 active:scale-[.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Envoi en cours…
                    </>
                  ) : (
                    'Confirmer la réservation'
                  )}
                </button>
              </div>
            )}

            {/* ── SUCCESS STEP ── */}
            {step === 'success' && (
              <div className="flex flex-col items-center text-center py-4 gap-4">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold mb-1">
                    Réservation envoyée !
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Votre demande a bien été transmise à{' '}
                    <span className="font-medium text-foreground">
                      {partner.business_name}
                    </span>
                    . Vous serez contacté pour la confirmation.
                  </p>
                </div>
                <div className="w-full pt-2 space-y-2">
                  <div className="text-xs text-muted-foreground bg-muted rounded-xl px-4 py-3 text-left space-y-1">
                    <p>
                      <span className="font-medium">Date :</span>{' '}
                      {new Date(bookingDate).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p>
                      <span className="font-medium">Personnes :</span> {guests}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            )}

            {/* ── ERROR STEP ── */}
            {step === 'error' && (
              <div className="flex flex-col items-center text-center py-4 gap-4">
                <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold mb-1">
                    Échec de la réservation
                  </h3>
                  <p className="text-sm text-muted-foreground">{errorMsg}</p>
                </div>
                <div className="w-full flex gap-2 pt-2">
                  <button
                    onClick={handleClose}
                    className="flex-1 py-3 rounded-xl border font-semibold hover:bg-muted transition-all text-sm"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      setStep('form');
                      setErrorMsg('');
                    }}
                    className="flex-1 py-3 rounded-xl gradient-mediterranean text-primary-foreground font-semibold hover:opacity-90 transition-all text-sm"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingModal;