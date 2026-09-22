import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface Product { id: string; slug: string; name_en: string; name_ar: string; price: number; image_url: string; }

export default function Wishlist() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    supabase.from('wishlist').select('product_id').eq('user_id', user.id).then(async ({ data }) => {
      if (data && data.length > 0) {
        const ids = data.map(d => d.product_id);
        const { data: prods } = await supabase.from('products').select('id, slug, name_en, name_ar, price, image_url').in('id', ids);
        setProducts(prods ?? []);
      }
    });
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="section-padding py-12">
      <h1 className="text-3xl font-bold text-[#1a3d1a] mb-8">{t.dashboard.wishlist}</h1>
      {products.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-700 mb-2">{t.dashboard.noWishlist}</p>
          <Link to="/store" className="btn-primary mt-4">
            <ShoppingBag className="w-4 h-4" />
            {t.cart.browseStore}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map(p => (
            <Link key={p.id} to={`/store/${p.slug}`} className="card group">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img src={p.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm text-[#1a3d1a] line-clamp-1">{lang === 'ar' ? p.name_ar : p.name_en}</h3>
                <span className="font-bold text-[#2d5a27]">{t.common.currency} {p.price}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
