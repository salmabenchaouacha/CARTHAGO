import React, { useState } from 'react';
import { X, MapPin, Package, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface CheckoutModalProps {
  onClose: () => void;
  onProceedToPayment: (shippingAddress: string) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose, onProceedToPayment }) => {
  const { items, total } = useCart();
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!address.trim()) {
      setError("L'adresse de livraison est obligatoire.");
      return;
    }
    onProceedToPayment(address.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-card border shadow-2xl overflow-hidden"
        style={{ animation: 'modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-mediterranean flex items-center justify-center">
              <Package className="h-4 w-4 text-white" />
            </div>
            <h2 className="font-display text-xl font-bold">Récapitulatif commande</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items list */}
        <div className="px-6 py-4 max-h-56 overflow-y-auto space-y-3">
          {items.map(({ product, quantity }) => {
            const partnerName =
              'partner__business_name' in product
                ? product.partner__business_name
                : product.partner?.business_name;
            return (
              <div key={product.id} className="flex items-center gap-3">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-lg flex-shrink-0">
                    🛍️
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{partnerName}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-accent">
                    {(Number(product.price) * quantity).toFixed(2)} TND
                  </p>
                  <p className="text-xs text-muted-foreground">x{quantity}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total */}
        <div className="mx-6 py-3 border-t border-b flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="font-bold text-lg text-accent">{Number(total).toFixed(2)} TND</span>
        </div>

        {/* Address input */}
        <div className="px-6 pt-4 pb-2">
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <MapPin className="h-4 w-4 text-accent" />
            Adresse de livraison
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => { setAddress(e.target.value); setError(''); }}
            placeholder="Ex: 12 Rue de la Médina, Tunis 1000"
            className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
          />
          {error && <p className="text-destructive text-xs mt-1">{error}</p>}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 pt-3 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl gradient-mediterranean text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            Procéder au paiement <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CheckoutModal;