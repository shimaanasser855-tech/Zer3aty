import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useCart } from '@/contexts/CartContext';

export default function Cart() {
  const { t, lang } = useI18n();
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCart();

  const shipping = subtotal > 50 ? 0 : 5;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="section-padding py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">{t.cart.empty}</h2>
        <p className="text-gray-500 mb-6">{t.cart.emptyDesc}</p>
        <Link to="/store" className="btn-primary">
          {t.cart.browseStore}
          <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
        </Link>
      </div>
    );
  }

  return (
    <div className="section-padding py-12">
      <h1 className="text-3xl font-bold text-[#1a3d1a] mb-8">{t.cart.title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="card p-4 flex items-center gap-4">
              <img src={item.image_url ?? ''} alt="" className="w-20 h-20 rounded-xl object-cover bg-gray-100 shrink-0" />
              <div className="flex-1 min-w-0">
                <Link to={`/store/${item.slug}`} className="font-semibold text-[#1a3d1a] hover:text-[#2d5a27] line-clamp-1">
                  {lang === 'ar' ? item.name_ar : item.name_en}
                </Link>
                <p className="text-sm text-gray-500 mt-1">{t.common.currency} {item.price}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-gray-50 rounded-l-lg">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-gray-50 rounded-r-lg">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-600 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold text-[#2d5a27]">{t.common.currency} {(item.price * item.quantity).toFixed(2)}</div>
              </div>
            </div>
          ))}

          <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 font-medium">
            {t.cart.clearCart}
          </button>
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit sticky top-24">
          <h2 className="font-bold text-[#1a3d1a] mb-4">{t.checkout.orderSummary}</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">{t.cart.subtotal}</span>
              <span className="font-semibold">{t.common.currency} {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{t.cart.shipping}</span>
              <span className="font-semibold">{shipping === 0 ? t.cart.free : `${t.common.currency} ${shipping.toFixed(2)}`}</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between">
              <span className="font-bold text-[#1a3d1a]">{t.cart.total}</span>
              <span className="font-bold text-xl text-[#2d5a27]">{t.common.currency} {total.toFixed(2)}</span>
            </div>
          </div>
          <Link to="/checkout" className="btn-primary w-full mt-6">
            {t.cart.checkout}
            <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          </Link>
          <Link to="/store" className="text-center block mt-3 text-sm text-gray-500 hover:text-[#2d5a27]">
            {t.cart.continueShopping}
          </Link>
        </div>
      </div>
    </div>
  );
}
