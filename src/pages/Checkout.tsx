import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function Checkout() {
  const { t, lang } = useI18n();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNum, setOrderNum] = useState('');
  const [form, setForm] = useState({
    full_name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    country: '',
    notes: '',
    payment: 'cod',
  });

  const shipping = subtotal > 50 ? 0 : 5;
  const total = subtotal + shipping;

  if (items.length === 0 && !success) {
    return (
      <div className="section-padding py-20 text-center">
        <p className="text-xl text-gray-700">{t.cart.empty}</p>
        <Link to="/store" className="btn-primary mt-4">{t.cart.browseStore}</Link>
      </div>
    );
  }

  const placeOrder = async () => {
    if (!user) return;
    setPlacing(true);
    const num = `ZER-${Date.now().toString().slice(-8)}`;
    setOrderNum(num);

    const { data: order } = await supabase.from('orders').insert({
      user_id: user.id,
      order_number: num,
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      country: form.country,
      notes: form.notes,
      payment_method: form.payment,
      subtotal,
      shipping,
      total,
    }).select('id').single();

    if (order) {
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name_en: item.name_en,
        product_name_ar: item.name_ar,
        product_image: item.image_url,
        price: item.price,
        quantity: item.quantity,
      }));
      await supabase.from('order_items').insert(orderItems);
      clearCart();
    }

    setPlacing(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="section-padding py-20 text-center max-w-lg mx-auto">
        <CheckCircle className="w-20 h-20 text-[#2d5a27] mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#1a3d1a] mb-2">{t.checkout.orderSuccess}</h1>
        <p className="text-gray-600 mb-4">{t.checkout.orderSuccessDesc}</p>
        <div className="card p-4 mb-6">
          <div className="text-sm text-gray-500">{t.checkout.orderNumber}</div>
          <div className="text-xl font-bold text-[#2d5a27]">{orderNum}</div>
        </div>
        <Link to="/store" className="btn-primary">{t.checkout.backToStore}</Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="section-padding py-20 text-center">
        <p className="text-xl text-gray-700 mb-4">{t.checkout.mustLogin}</p>
        <Link to="/login" className="btn-primary">{t.checkout.login}</Link>
      </div>
    );
  }

  return (
    <div className="section-padding py-12">
      <h1 className="text-3xl font-bold text-[#1a3d1a] mb-8">{t.checkout.title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="font-bold text-[#1a3d1a] mb-4">{t.checkout.shippingInfo}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.checkout.fullName} *</label>
                <input type="text" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.checkout.email} *</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.checkout.phone} *</label>
                <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.checkout.city} *</label>
                <input type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="input-field" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.checkout.address} *</label>
                <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.checkout.country} *</label>
                <input type="text" value={form.country} onChange={e => setForm({...form, country: e.target.value})} className="input-field" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.checkout.notes}</label>
                <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3} className="input-field resize-none" />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="card p-6">
            <h2 className="font-bold text-[#1a3d1a] mb-4">{t.checkout.paymentMethod}</h2>
            <div className="space-y-3">
              <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${form.payment === 'cod' ? 'border-[#2d5a27] bg-green-50' : 'border-gray-200'}`}>
                <input type="radio" name="payment" value="cod" checked={form.payment === 'cod'} onChange={() => setForm({...form, payment: 'cod'})} className="accent-[#2d5a27]" />
                <Truck className="w-5 h-5 text-[#2d5a27]" />
                <div>
                  <div className="font-semibold text-[#1a3d1a]">{t.checkout.cod}</div>
                  <div className="text-xs text-gray-500">{t.checkout.codDesc}</div>
                </div>
              </label>
              <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${form.payment === 'card' ? 'border-[#2d5a27] bg-green-50' : 'border-gray-200'}`}>
                <input type="radio" name="payment" value="card" checked={form.payment === 'card'} onChange={() => setForm({...form, payment: 'card'})} className="accent-[#2d5a27]" />
                <CreditCard className="w-5 h-5 text-[#2d5a27]" />
                <div>
                  <div className="font-semibold text-[#1a3d1a]">{t.checkout.demoCard}</div>
                  <div className="text-xs text-gray-500">{t.checkout.demoCardDesc}</div>
                </div>
              </label>
            </div>
            <div className="mt-4 flex items-start gap-2 bg-amber-50 rounded-xl p-3">
              <ShieldCheck className="w-4 h-4 text-[#e8a838] shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600">{t.checkout.demoPaymentNote}</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit sticky top-24">
          <h2 className="font-bold text-[#1a3d1a] mb-4">{t.checkout.orderSummary}</h2>
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto scrollbar-hide">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-2 text-sm">
                <img src={item.image_url ?? ''} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[#1a3d1a] truncate">{lang === 'ar' ? item.name_ar : item.name_en}</div>
                  <div className="text-xs text-gray-500">x{item.quantity}</div>
                </div>
                <div className="font-semibold">{t.common.currency} {(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
            <div className="flex justify-between"><span className="text-gray-500">{t.cart.subtotal}</span><span className="font-semibold">{t.common.currency} {subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">{t.cart.shipping}</span><span className="font-semibold">{shipping === 0 ? t.cart.free : `${t.common.currency} ${shipping.toFixed(2)}`}</span></div>
            <div className="flex justify-between border-t border-gray-100 pt-2"><span className="font-bold text-[#1a3d1a]">{t.cart.total}</span><span className="font-bold text-xl text-[#2d5a27]">{t.common.currency} {total.toFixed(2)}</span></div>
          </div>
          <button
            onClick={placeOrder}
            disabled={placing || !form.full_name || !form.email || !form.phone || !form.address || !form.city || !form.country}
            className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {placing ? t.checkout.placingOrder : t.checkout.placeOrder}
            {!placing && <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />}
          </button>
        </div>
      </div>
    </div>
  );
}
