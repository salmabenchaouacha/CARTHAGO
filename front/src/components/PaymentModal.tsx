import React, { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

type PaymentStep = 'form' | 'processing' | 'success' | 'error';

interface PaymentModalProps {
  total: number;
  shippingAddress: string;
  onClose: () => void;
  onConfirm: (cardData: CardData) => Promise<void>;
}

export interface CardData {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
}

const formatCardNumber = (value: string) =>
  value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
};

const PaymentModal: React.FC<PaymentModalProps> = ({ total, shippingAddress, onClose, onConfirm }) => {
  const [step, setStep] = useState<PaymentStep>('form');
  const [flipped, setFlipped] = useState(false);
  const [form, setForm] = useState<CardData>({ cardNumber: '', cardHolder: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState<Partial<CardData>>({});

  const validate = () => {
    const e: Partial<CardData> = {};
    if (form.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Numéro invalide';
    if (!form.cardHolder.trim()) e.cardHolder = 'Nom requis';
    if (form.expiry.length < 5) e.expiry = 'Date invalide';
    if (form.cvv.length < 3) e.cvv = 'CVV invalide';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = async () => {
    if (!validate()) return;
    setStep('processing');
    try {
      await onConfirm(form);
      setStep('success');
    } catch {
      setStep('error');
    }
  };

  const maskedNumber = form.cardNumber
    ? form.cardNumber.padEnd(19, '•').slice(0, 19)
    : '•••• •••• •••• ••••';

  const cardBrand = form.cardNumber.startsWith('4')
    ? 'VISA'
    : form.cardNumber.startsWith('5')
    ? 'MASTERCARD'
    : '••••';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        className="relative w-full max-w-md rounded-2xl bg-card border shadow-2xl overflow-hidden"
        style={{ animation: 'modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Lock className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold leading-tight">Paiement sécurisé</h2>
              <p className="text-xs text-muted-foreground">Simulation — aucune transaction réelle</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          {step === 'form' && (
            <>
              {/* 3D Card visual */}
              <div className="flex justify-center mb-6">
                <div
                  className="relative w-72 h-44 cursor-pointer"
                  style={{ perspective: '1000px' }}
                  onClick={() => setFlipped(!flipped)}
                >
                  <div
                    className="relative w-full h-full transition-transform duration-700"
                    style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                  >
                    {/* Front */}
                    <div
                      className="absolute inset-0 rounded-2xl p-5 flex flex-col justify-between text-white shadow-xl overflow-hidden"
                      style={{
                        backfaceVisibility: 'hidden',
                        background: 'linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 50%, #1a5276 100%)',
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)',
                        }}
                      />
                      <div className="flex justify-between items-start relative z-10">
                        <div className="w-10 h-7 rounded bg-yellow-400/80 flex items-center justify-center">
                          <div className="grid grid-cols-2 gap-0.5">
                            {[...Array(4)].map((_, i) => (
                              <div key={i} className="w-1.5 h-1.5 rounded-sm bg-yellow-700/60" />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs font-bold tracking-widest opacity-80">{cardBrand}</span>
                      </div>
                      <div className="relative z-10">
                        <p className="text-lg font-mono tracking-widest mb-2">{maskedNumber}</p>
                        <div className="flex justify-between text-xs opacity-80">
                          <div>
                            <p className="uppercase text-[10px] opacity-60 mb-0.5">Titulaire</p>
                            <p className="font-medium truncate max-w-[160px]">
                              {form.cardHolder || 'VOTRE NOM'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="uppercase text-[10px] opacity-60 mb-0.5">Expire</p>
                            <p className="font-medium">{form.expiry || 'MM/YY'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Back */}
                    <div
                      className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        background: 'linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 100%)',
                      }}
                    >
                      <div className="w-full h-10 bg-black/70 mt-6" />
                      <div className="mx-5 mt-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-8 bg-white/20 rounded" />
                          <div className="w-14 h-8 bg-white rounded flex items-center justify-center">
                            <p className="text-black text-sm font-bold font-mono">
                              {form.cvv || '•••'}
                            </p>
                          </div>
                        </div>
                        <p className="text-white/50 text-[10px] mt-1 text-right">CVV</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground mb-5 -mt-2">
                Cliquez sur la carte pour voir le dos
              </p>

              {/* Form */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Numéro de carte</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={form.cardNumber}
                      onChange={e => setForm(f => ({ ...f, cardNumber: formatCardNumber(e.target.value) }))}
                      placeholder="1234 5678 9012 3456"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-mono"
                    />
                  </div>
                  {errors.cardNumber && <p className="text-destructive text-xs mt-1">{errors.cardNumber}</p>}
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Nom du titulaire</label>
                  <input
                    type="text"
                    value={form.cardHolder}
                    onChange={e => setForm(f => ({ ...f, cardHolder: e.target.value.toUpperCase() }))}
                    placeholder="PRÉNOM NOM"
                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all uppercase"
                  />
                  {errors.cardHolder && <p className="text-destructive text-xs mt-1">{errors.cardHolder}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Date d'expiration</label>
                    <input
                      type="text"
                      value={form.expiry}
                      onChange={e => setForm(f => ({ ...f, expiry: formatExpiry(e.target.value) }))}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-mono"
                    />
                    {errors.expiry && <p className="text-destructive text-xs mt-1">{errors.expiry}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">CVV</label>
                    <input
                      type="text"
                      value={form.cvv}
                      onFocus={() => setFlipped(true)}
                      onBlur={() => setFlipped(false)}
                      onChange={e => setForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                      placeholder="•••"
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-mono"
                    />
                    {errors.cvv && <p className="text-destructive text-xs mt-1">{errors.cvv}</p>}
                  </div>
                </div>
              </div>

              {/* Total + Pay button */}
              <div className="mt-5 pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Montant à payer</span>
                  <span className="text-xl font-bold text-accent">{total.toFixed(2)} TND</span>
                </div>
                <button
                  onClick={handlePay}
                  className="w-full py-3.5 rounded-xl gradient-mediterranean text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <Lock className="h-4 w-4" /> Payer {total.toFixed(2)} TND
                </button>
              </div>
            </>
          )}

          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
                <CreditCard className="absolute inset-0 m-auto h-8 w-8 text-accent" />
              </div>
              <p className="font-display text-lg font-bold">Traitement en cours…</p>
              <p className="text-sm text-muted-foreground">Vérification du paiement</p>
              <div className="flex gap-1.5 mt-2">
                {['Sécurisation', 'Vérification', 'Confirmation'].map((label, i) => (
                  <div
                    key={label}
                    className="px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground"
                    style={{ animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite` }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-12 flex flex-col items-center gap-4 text-center">
              <div
                className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center"
                style={{ animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}
              >
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">Paiement confirmé !</h3>
                <p className="text-sm text-muted-foreground mt-1">Votre commande a été créée avec succès.</p>
              </div>
              <div className="w-full bg-muted rounded-xl p-4 text-left text-sm">
                <p className="text-muted-foreground">Livraison à :</p>
                <p className="font-medium mt-0.5">{shippingAddress}</p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl gradient-mediterranean text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Retour à la boutique
              </button>
            </div>
          )}

          {step === 'error' && (
            <div className="py-12 flex flex-col items-center gap-4 text-center">
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-10 w-10 text-destructive" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">Paiement échoué</h3>
                <p className="text-sm text-muted-foreground mt-1">Une erreur est survenue lors de la création de la commande.</p>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setStep('form')}
                  className="flex-1 py-3 rounded-xl gradient-mediterranean text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Réessayer
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes popIn {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default PaymentModal;