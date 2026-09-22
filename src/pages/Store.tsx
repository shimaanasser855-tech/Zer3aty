import { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Star, ShoppingCart, Heart } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/contexts/ToastContext';
import { supabase } from '@/lib/supabase';
import PageHeader from '@/components/PageHeader';

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
  category_id: string;
}

interface Category {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
}

export default function Store() {
  const { t, lang } = useI18n();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');

  const categoryParam = searchParams.get('category') || 'all';

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('*'),
      supabase.from('product_categories').select('*'),
    ]).then(([p, c]) => {
      setProducts(p.data ?? []);
      setCategories(c.data ?? []);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name_en.toLowerCase().includes(q) || p.name_ar.includes(search));
    }
    if (categoryParam !== 'all') {
      const cat = categories.find(c => c.slug === categoryParam);
      if (cat) result = result.filter(p => p.category_id === cat.id);
    }
    if (sort === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') result.sort((a, b) => b.price - a.price);
    if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [products, categories, categoryParam, search, sort]);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      slug: product.slug,
      name_en: product.name_en,
      name_ar: product.name_ar,
      price: product.price,
      image_url: product.image_url,
    });
    showToast(t.store.addedToCart, 'success');
  };

  const handleWishlist = async (productId: string) => {
    await toggleWishlist(productId);
    showToast(isInWishlist(productId) ? t.store.removedFromWishlist : t.store.addedToWishlist, 'success');
  };

  return (
    <div>
      <PageHeader title={t.store.title} subtitle={t.store.subtitle} image="https://images.pexels.com/photos/7782153/pexels-photo-7782153.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" />
      <div className="section-padding py-12">
        {/* Search + sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.store.searchPlaceholder}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d5a27]"
            />
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]">
            <option value="newest">{t.store.newest}</option>
            <option value="price-low">{t.store.priceLowHigh}</option>
            <option value="price-high">{t.store.priceHighLow}</option>
            <option value="rating">{t.store.rating}</option>
          </select>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setSearchParams({})} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${categoryParam === 'all' ? 'bg-[#2d5a27] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {t.store.allCategories}
          </button>
          {categories.map(c => (
            <button key={c.id} onClick={() => setSearchParams({ category: c.slug })} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${categoryParam === c.slug ? 'bg-[#2d5a27] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {lang === 'ar' ? c.name_ar : c.name_en}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-500 mb-4">{filtered.length} {t.store.results}</p>

        {/* Products */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl font-semibold text-gray-700">{t.store.noProducts}</p>
            <p className="text-gray-500 mt-2">{t.store.noProductsDesc}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {filtered.map(product => (
              <div key={product.id} className="card group">
                <Link to={`/store/${product.slug}`}>
                  <div className="aspect-square overflow-hidden bg-gray-100 relative">
                    <img src={product.image_url} alt={lang === 'ar' ? product.name_ar : product.name_en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {product.old_price && (
                      <span className="absolute top-2 right-2 bg-[#e8a838] text-white text-xs font-bold px-2 py-1 rounded-lg">
                        -{Math.round((1 - product.price / product.old_price) * 100)}%
                      </span>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{t.store.outOfStock}</span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-3">
                  <Link to={`/store/${product.slug}`}>
                    <h3 className="font-semibold text-sm text-[#1a3d1a] group-hover:text-[#2d5a27] line-clamp-1">{lang === 'ar' ? product.name_ar : product.name_en}</h3>
                  </Link>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-[#e8a838] text-[#e8a838]" />
                    <span className="text-xs text-gray-500">{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-[#2d5a27]">{t.common.currency} {product.price}</span>
                    {product.old_price && <span className="text-xs text-gray-400 line-through">{product.old_price}</span>}
                  </div>
                  <div className="flex items-center gap-1 mt-3">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="flex-1 btn-primary !py-2 !px-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      {t.store.addToCart}
                    </button>
                    <button onClick={() => handleWishlist(product.id)} className="p-2 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-colors">
                      <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
