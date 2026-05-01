import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, MapPin } from 'lucide-react';
import { getProductDetail, getProducts } from '@/services/productService';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/components/Cards';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProductDetail(Number(id))
      .then(data => {
        setProduct(data);
        // Charger produits similaires par catégorie
        return getProducts({ category: data.category?.slug });
      })
      .then(data => setSimilar(data.filter((p: any) => p.id !== Number(id)).slice(0, 3)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Chargement...</div>;
  if (!product) return <div className="container mx-auto px-4 py-20 text-center"><h2 className="text-2xl font-display">Produit non trouvé</h2></div>;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <Link to="/marketplace" className="inline-flex items-center gap-1 text-muted-foreground text-sm mb-6 hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />Retour à la boutique
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="rounded-xl overflow-hidden">
            {product.image
              ? <img src={product.image} alt={product.name} className="w-full h-96 object-cover" />
              : <div className="w-full h-96 bg-muted flex items-center justify-center text-muted-foreground">Pas d'image</div>
            }
          </div>
          <div>
            <span className="text-sm text-accent font-medium">{product.category?.name}</span>
            <h1 className="font-display text-3xl font-bold text-foreground mt-1 mb-4">{product.name}</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-1 mb-4">
              <MapPin className="h-3.5 w-3.5" />{product.region?.name}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-accent">{product.price} TND</span>
              <span className="text-sm text-muted-foreground">
                {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Vendu par <strong className="text-foreground">{product.partner?.business_name}</strong>
            </p>
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className="flex items-center gap-2 px-8 py-3 rounded-xl gradient-mediterranean text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <ShoppingCart className="h-5 w-5" /> Ajouter au panier
            </button>
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold mb-6">Produits similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map((p, i) => (
                <ProductCard key={p.id} product={p} onAddToCart={() => addToCart(p)} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;