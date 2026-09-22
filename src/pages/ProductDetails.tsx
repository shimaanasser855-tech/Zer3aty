import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, ArrowLeft, Minus, Plus, Check } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/contexts/ToastContext';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  price: number;
  old_price: number | null;
  stock: number;
  rating: number;
  sku: string;
  image_url: string;
}

interface Category {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
}

export default function ProductDetails() {
  const { slug } = useParams();
  const { t, lang } = useI18n();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    supabase.from('products').select('*').eq('slug', slug).maybeSingle().then(async ({ data }) => {
      setProduct(data);
      if (data) {
        const cat = await supabase.from('product_categories').select('*').eq('id', data.category_id).maybeSingle();
        setCategory(cat.data);
        const rel = await supabase.from('products').select('*').neq('id', data.id).eq('category_id', data.category_id).limit(4);
        setRelated(rel.data ?? []);
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <div className="section-padding py-20 text-center text-gray-500">{t.common.loading}</div>;
  if (!product) return (
    <div className="section-padding py-20 text-center">
      <p className="text-xl text-gray-700">{t.common.error}</p>
      <Link to="/store" className="btn-primary mt-4">{t.store.title}</Link>
    </div>
  );

  const tr = (en: string | null, ar: string | null): string | undefined => lang === 'ar' ? (ar ?? undefined) : (en ?? undefined);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      name_en: product.name_en,
      name_ar: product.name_ar,
      price: product.price,
      image_url: product.image_url,
    }, quantity);
    showToast(t.store.addedToCart, 'success');
  };

  const handleWishlist = async () => {
    await toggleWishlist(product.id);
    showToast(isInWishlist(product.id) ? t.store.removedFromWishlist : t.store.addedToWishlist, 'success');
  };

  return (
    <div>
      <div className="section-padding py-8">
        <Link to="/store" className="inline-flex items-center gap-1 text-gray-500 hover:text-[#2d5a27] mb-6 text-sm">
          <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          {t.store.title}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="card overflow-hidden">
            <img src={product.image_url} alt={tr(product.name_en, product.name_ar)} className="w-full aspect-square object-cover" />
          </div>

          {/* Info */}
          <div>
            {category && <span className="text-sm font-semibold text-[#e8a838] uppercase tracking-wide">{tr(category.name_en, category.name_ar)}</span>}
            <h1 className="text-2xl lg:text-3xl font-bold text-[#1a3d1a] mt-1 mb-3">{tr(product.name_en, product.name_ar)}</h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-[#e8a838] text-[#e8a838]' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-sm text-gray-500">{product.rating} {t.store.reviews}</span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-[#2d5a27]">{t.common.currency} {product.price}</span>
              {product.old_price && <span className="text-lg text-gray-400 line-through">{t.common.currency} {product.old_price}</span>}
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">{tr(product.description_en, product.description_ar)}</p>

            <div className="space-y-2 text-sm mb-6">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{t.store.sku}:</span>
                <span className="font-medium text-[#1a3d1a]">{product.sku}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{t.store.category}:</span>
                <span className="font-medium text-[#1a3d1a]">{category ? tr(category.name_en, category.name_ar) : '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{t.store.inStock}:</span>
                <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} ${t.store.inStock}` : t.store.outOfStock}
                </span>
              </div>
            </div>

            {/* Quantity + actions */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-gray-200 rounded-xl">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-50 rounded-l-xl">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-semibold">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-3 hover:bg-gray-50 rounded-r-xl">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button onClick={handleAddToCart} className="btn-primary flex-1">
                  <ShoppingCart className="w-5 h-5" />
                  {t.store.addToCart}
                </button>
                <button onClick={handleWishlist} className="p-3 rounded-xl border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-colors">
                  <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-100">
              <div className="text-center">
                <Check className="w-5 h-5 text-[#2d5a27] mx-auto mb-1" />
                <span className="text-xs text-gray-500">{lang === 'ar' ? 'جودة مضمونة' : 'Quality assured'}</span>
              </div>
              <div className="text-center">
                <Check className="w-5 h-5 text-[#2d5a27] mx-auto mb-1" />
                <span className="text-xs text-gray-500">{lang === 'ar' ? 'دفع عند الاستلام' : 'Cash on delivery'}</span>
              </div>
              <div className="text-center">
                <Check className="w-5 h-5 text-[#2d5a27] mx-auto mb-1" />
                <span className="text-xs text-gray-500">{lang === 'ar' ? 'منتجات طبيعية' : 'Natural products'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-[#1a3d1a] mb-6">{t.store.relatedProducts}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map(p => (
                <Link key={p.id} to={`/store/${p.slug}`} className="card group">
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img src={p.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-[#1a3d1a] line-clamp-1">{tr(p.name_en, p.name_ar)}</h3>
                    <span className="font-bold text-[#2d5a27]">{t.common.currency} {p.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
