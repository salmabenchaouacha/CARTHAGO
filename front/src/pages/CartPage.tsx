import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="font-display text-2xl font-bold mb-2">Votre panier est vide</h2>
        <p className="text-muted-foreground mb-6">Explorez notre marketplace pour trouver des produits artisanaux uniques.</p>
        <Link to="/marketplace" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium">
          Voir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <Link to="/marketplace" className="inline-flex items-center gap-1 text-muted-foreground text-sm mb-6 hover:text-foreground"><ArrowLeft className="h-4 w-4" />Continuer les achats</Link>
        <h1 className="font-display text-3xl font-bold mb-8">Mon panier</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-4 p-4 rounded-xl bg-card border">
                <img src={product.image} alt={product.name} className="w-24 h-24 rounded-lg object-cover" loading="lazy" />
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.sellerName}</p>
                  <p className="text-accent font-bold mt-1">{product.price} TND</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeFromCart(product.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(product.id, quantity - 1)} className="p-1 rounded-md bg-muted hover:bg-border transition-colors"><Minus className="h-4 w-4" /></button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <button onClick={() => updateQuantity(product.id, quantity + 1)} className="p-1 rounded-md bg-muted hover:bg-border transition-colors"><Plus className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 rounded-xl bg-card border h-fit">
            <h3 className="font-display text-lg font-bold mb-4">Récapitulatif</h3>
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Sous-total</span><span>{total} TND</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Livraison</span><span className="text-olive">Gratuite</span></div>
            </div>
            <div className="border-t pt-4 flex justify-between items-center mb-6">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg text-accent">{total} TND</span>
            </div>
            <button className="w-full py-3 rounded-xl gradient-mediterranean text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
              Commander
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
