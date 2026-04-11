import React, { useState } from 'react';
import { ProductCard } from '@/components/Cards';
import SectionTitle from '@/components/SectionTitle';
import { products, regions } from '@/data/mockData';
import { useCart } from '@/context/CartContext';

const MarketplacePage = () => {
  const { addToCart } = useCart();
  const [category, setCategory] = useState('');
  const [region, setRegion] = useState('');
  const [search, setSearch] = useState('');

  const cats = [...new Set(products.map(p => p.category))];
  const filtered = products.filter(p => {
    if (category && p.category !== category) return false;
    if (region && p.region !== region) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <SectionTitle title="Marketplace artisanale" subtitle="Découvrez et achetez des produits artisanaux authentiques de toute la Tunisie" />
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input type="text" placeholder="Rechercher un produit..." value={search} onChange={e => setSearch(e.target.value)} className="px-4 py-2.5 rounded-lg border bg-card text-foreground text-sm flex-1" />
          <select value={category} onChange={e => setCategory(e.target.value)} className="px-4 py-2.5 rounded-lg border bg-card text-foreground text-sm">
            <option value="">Toutes catégories</option>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={region} onChange={e => setRegion(e.target.value)} className="px-4 py-2.5 rounded-lg border bg-card text-foreground text-sm">
            <option value="">Toutes régions</option>
            {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => <ProductCard key={p.id} product={p} onAddToCart={() => addToCart(p)} index={i} />)}
        </div>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-20">Aucun produit trouvé.</p>}
      </div>
    </div>
  );
};

export default MarketplacePage;
