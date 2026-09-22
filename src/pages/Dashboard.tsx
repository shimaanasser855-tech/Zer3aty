import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Heart, BookOpen, LogOut, Edit2, Save } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { supabase } from '@/lib/supabase';

interface Profile { full_name: string; phone: string; address: string; city: string; country: string; }
interface Order { id: string; order_number: string; created_at: string; status: string; total: number; }
interface WishlistItem { id: string; product_id: string; }
interface Product { id: string; slug: string; name_en: string; name_ar: string; price: number; image_url: string; }
interface CourseProgress { course_id: string; completed: boolean; }
interface Course { id: string; title_en: string; title_ar: string; slug: string; }

export default function Dashboard() {
  const { t, lang } = useI18n();
  const { user, signOut } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState<Profile>({ full_name: '', phone: '', address: '', city: '', country: '' });
  const [editing, setEditing] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    supabase.from('profiles').select('full_name, phone, address, city, country').eq('id', user.id).maybeSingle().then(({ data }) => {
      if (data) setProfile(data);
      else setProfile({ full_name: user.user_metadata?.full_name || '', phone: '', address: '', city: '', country: '' });
    });
    supabase.from('orders').select('id, order_number, created_at, status, total').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => setOrders(data ?? []));
    supabase.from('wishlist').select('id, product_id').eq('user_id', user.id).then(({ data }) => {
      setWishlistItems(data ?? []);
      if (data && data.length > 0) {
        supabase.from('products').select('id, slug, name_en, name_ar, price, image_url').in('id', data.map(d => d.product_id)).then(({ data: prods }) => setWishlistProducts(prods ?? []));
      }
    });
    supabase.from('course_progress').select('course_id, completed').eq('user_id', user.id).then(({ data }) => setCourseProgress(data ?? []));
    supabase.from('courses').select('id, title_en, title_ar, slug').then(({ data }) => setCourses(data ?? []));
  }, [user, navigate]);

  const saveProfile = async () => {
    if (!user) return;
    await supabase.from('profiles').upsert({ id: user.id, ...profile });
    setEditing(false);
    showToast(t.dashboard.saved, 'success');
  };

  const statusLabel = (s: string) => {
    const map: Record<string, string> = { pending: t.dashboard.statusPending, processing: t.dashboard.statusProcessing, shipped: t.dashboard.statusShipped, delivered: t.dashboard.statusDelivered, cancelled: t.dashboard.statusCancelled };
    return map[s] ?? s;
  };

  const tabs = [
    { id: 'profile', label: t.dashboard.profile, icon: User },
    { id: 'orders', label: t.dashboard.orders, icon: Package },
    { id: 'wishlist', label: t.dashboard.wishlist, icon: Heart },
    { id: 'learning', label: t.dashboard.learning, icon: BookOpen },
  ];

  return (
    <div className="section-padding py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1a3d1a]">{t.dashboard.title}</h1>
          <p className="text-gray-500">{t.dashboard.welcome}, {profile.full_name || user?.email}</p>
        </div>
        <button onClick={() => { signOut(); navigate('/'); }} className="btn-secondary !py-2">
          <LogOut className="w-4 h-4" />
          {t.auth.logout}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <div className="card p-2 space-y-1">
            {tabs.map(tabItem => (
              <button
                key={tabItem.id}
                onClick={() => setTab(tabItem.id)}
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${tab === tabItem.id ? 'bg-[#2d5a27] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <tabItem.icon className="w-4 h-4" />
                {tabItem.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {tab === 'profile' && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1a3d1a]">{t.dashboard.profile}</h2>
                {!editing ? (
                  <button onClick={() => setEditing(true)} className="text-sm text-[#2d5a27] font-medium flex items-center gap-1">
                    <Edit2 className="w-4 h-4" /> {t.dashboard.editProfile}
                  </button>
                ) : (
                  <button onClick={saveProfile} className="btn-primary !py-2 text-sm">
                    <Save className="w-4 h-4" /> {t.dashboard.save}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'full_name', label: t.auth.fullName },
                  { key: 'phone', label: t.auth.phone },
                  { key: 'address', label: t.checkout.address },
                  { key: 'city', label: t.checkout.city },
                  { key: 'country', label: t.checkout.country },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-sm text-gray-500 mb-1">{field.label}</label>
                    <input
                      type="text"
                      value={profile[field.key as keyof Profile] || ''}
                      onChange={e => setProfile({...profile, [field.key]: e.target.value})}
                      disabled={!editing}
                      className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm text-gray-500 mb-1">{t.auth.email}</label>
                  <input type="text" value={user?.email || ''} disabled className="input-field disabled:bg-gray-50 disabled:text-gray-500" />
                </div>
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-[#1a3d1a] mb-4">{t.dashboard.orders}</h2>
              {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">{t.dashboard.noOrders}</p>
              ) : (
                <div className="space-y-3">
                  {orders.map(order => (
                    <div key={order.id} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-[#1a3d1a]">{t.dashboard.orderNumber}{order.order_number}</div>
                        <div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#2d5a27]">{t.common.currency} {order.total}</div>
                        <span className={`badge mt-1 ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {statusLabel(order.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'wishlist' && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-[#1a3d1a] mb-4">{t.dashboard.wishlist}</h2>
              {wishlistProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">{t.dashboard.noWishlist}</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {wishlistProducts.map(p => (
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
          )}

          {tab === 'learning' && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-[#1a3d1a] mb-4">{t.dashboard.learning}</h2>
              {courseProgress.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">{t.dashboard.noProgress}</p>
                  <Link to="/academy" className="btn-primary">{t.academy.title}</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {courses.filter(c => courseProgress.some(cp => cp.course_id === c.id)).map(course => {
                    const completed = courseProgress.filter(cp => cp.course_id === course.id && cp.completed).length;
                    return (
                      <Link key={course.id} to={`/academy/${course.slug}`} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="font-medium text-[#1a3d1a]">{lang === 'ar' ? course.title_ar : course.title_en}</div>
                        <span className="text-sm text-[#2d5a27] font-semibold">{completed} {t.dashboard.lessonsCompleted}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
