import React, { useEffect, useState } from 'react';
import { ProductCard } from '@/components/Cards';
import SectionTitle from '@/components/SectionTitle';
import { getProducts } from '@/services/productService';
import { useCart } from '@/context/CartContext';

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  image: string | null;
  is_active: boolean;
  partner__business_name: string;
  category__name: string;
  category__slug: string;
  region__name: string;
  region__slug: string;
};

const MarketplacePage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [region, setRegion] = useState('');
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Charger tous les produits une fois pour extraire les catégories
    getProducts().then(data => {
      const cats = [...new Set(data.map((p: Product) => p.category__name))] as string[];
      setCategories(cats);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts({
      category: category || undefined,
      region: region || undefined,
      q: search || undefined,
    })
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [category, region, search]);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Marketplace artisanale"
          subtitle="Découvrez et achetez des produits artisanaux authentiques de toute la Tunisie"
        />

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-4 py-2.5 rounded-lg border bg-card text-foreground text-sm flex-1"
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-4 py-2.5 rounded-lg border bg-card text-foreground text-sm"
          >
            <option value="">Toutes catégories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Chargement...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={() => addToCart(p)}
                  index={i}
                />
              ))}
            </div>
            {products.length === 0 && (
              <p className="text-center text-muted-foreground py-20">Aucun produit trouvé.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;