import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, Heart, User, Search, Globe, Sprout, ChevronDown } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { lang, setLang, t } = useI18n();
  const { itemCount } = useCart();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setLearnOpen(false);
    setShopOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const learnLinks = [
    { to: '/plants', label: t.nav.plants },
    { to: '/home-gardening', label: t.nav.homeGardening },
    { to: '/school-gardening', label: t.nav.schoolGardening },
    { to: '/natural-farming', label: t.nav.naturalFarming },
    { to: '/fertilizers', label: t.nav.fertilizers },
    { to: '/pest-management', label: t.nav.pestManagement },
    { to: '/smart-agriculture', label: t.nav.smartAgri },
    { to: '/innovation-lab', label: t.nav.innovationLab },
    { to: '/academy', label: t.nav.academy },
    { to: '/articles', label: t.nav.articles },
  ];

  const shopLinks = [
    { to: '/store', label: t.store.title },
    { to: '/store?category=seeds', label: lang === 'ar' ? 'بذور' : 'Seeds' },
    { to: '/store?category=plants', label: lang === 'ar' ? 'نباتات' : 'Plants' },
    { to: '/store?category=soil', label: lang === 'ar' ? 'تربة عضوية' : 'Organic Soil' },
    { to: '/store?category=compost', label: lang === 'ar' ? 'سماد' : 'Compost' },
    { to: '/store?category=fertilizers', label: lang === 'ar' ? 'أسمدة' : 'Fertilizers' },
    { to: '/store?category=tools', label: lang === 'ar' ? 'أدوات' : 'Tools' },
    { to: '/store?category=care', label: lang === 'ar' ? 'العناية' : 'Plant Care' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-[#2d5a27] flex items-center justify-center">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-[#2d5a27]">Zer3aty</span>
                <span className="text-xs text-gray-500 block leading-none">{t.brandTagline}</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <NavLink to="/" className={({isActive}) => `px-3 py-2 rounded-lg font-medium text-sm transition-colors ${isActive ? 'text-[#2d5a27] bg-green-50' : 'text-gray-700 hover:text-[#2d5a27] hover:bg-green-50'}`}>
                {t.nav.home}
              </NavLink>

              {/* Learn dropdown */}
              <div className="relative group" onMouseEnter={() => setLearnOpen(true)} onMouseLeave={() => setLearnOpen(false)}>
                <button className="px-3 py-2 rounded-lg font-medium text-sm text-gray-700 hover:text-[#2d5a27] hover:bg-green-50 transition-colors flex items-center gap-1">
                  {t.nav.learn}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {learnOpen && (
                  <div className="absolute top-full left-0 pt-1 w-56">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-scale-in">
                      {learnLinks.map(link => (
                        <Link key={link.to} to={link.to} className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-[#2d5a27] transition-colors">
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Shop dropdown */}
              <div className="relative group" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
                <button className="px-3 py-2 rounded-lg font-medium text-sm text-gray-700 hover:text-[#2d5a27] hover:bg-green-50 transition-colors flex items-center gap-1">
                  {t.nav.shop}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {shopOpen && (
                  <div className="absolute top-full left-0 pt-1 w-56">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-scale-in">
                      {shopLinks.map(link => (
                        <Link key={link.to} to={link.to} className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-[#2d5a27] transition-colors">
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <NavLink to="/about" className={({isActive}) => `px-3 py-2 rounded-lg font-medium text-sm transition-colors ${isActive ? 'text-[#2d5a27] bg-green-50' : 'text-gray-700 hover:text-[#2d5a27] hover:bg-green-50'}`}>
                {t.nav.about}
              </NavLink>
              <NavLink to="/contact" className={({isActive}) => `px-3 py-2 rounded-lg font-medium text-sm transition-colors ${isActive ? 'text-[#2d5a27] bg-green-50' : 'text-gray-700 hover:text-[#2d5a27] hover:bg-green-50'}`}>
                {t.nav.contact}
              </NavLink>
              <NavLink to="/faq" className={({isActive}) => `px-3 py-2 rounded-lg font-medium text-sm transition-colors ${isActive ? 'text-[#2d5a27] bg-green-50' : 'text-gray-700 hover:text-[#2d5a27] hover:bg-green-50'}`}>
                {t.nav.faq}
              </NavLink>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-lg text-gray-700 hover:bg-green-50 transition-colors" aria-label="Search">
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                className="flex items-center gap-1 px-2 sm:px-3 py-2 rounded-lg text-gray-700 hover:bg-green-50 transition-colors text-sm font-medium"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{lang === 'en' ? 'عربي' : 'EN'}</span>
              </button>

              <Link to="/cart" className="relative p-2 rounded-lg text-gray-700 hover:bg-green-50 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#e8a838] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {user ? (
                <Link to="/dashboard" className="p-2 rounded-lg text-gray-700 hover:bg-green-50 transition-colors">
                  <User className="w-5 h-5" />
                </Link>
              ) : (
                <Link to="/login" className="hidden sm:flex btn-primary !py-2 !px-4 text-sm">
                  {t.auth.login}
                </Link>
              )}

              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-green-50 transition-colors">
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-3 animate-slide-up">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t.search.placeholder}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d5a27]"
                  autoFocus
                />
              </form>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 max-h-[80vh] overflow-y-auto animate-slide-up">
            <nav className="px-4 py-3 space-y-1">
              <Link to="/" className="block px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-green-50">{t.nav.home}</Link>
              <div className="px-3 py-1 text-xs font-bold text-gray-400 uppercase">{t.nav.learn}</div>
              {learnLinks.map(link => (
                <Link key={link.to} to={link.to} className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-green-50">{link.label}</Link>
              ))}
              <div className="px-3 py-1 text-xs font-bold text-gray-400 uppercase">{t.nav.shop}</div>
              {shopLinks.map(link => (
                <Link key={link.to} to={link.to} className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-green-50">{link.label}</Link>
              ))}
              <Link to="/about" className="block px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-green-50">{t.nav.about}</Link>
              <Link to="/contact" className="block px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-green-50">{t.nav.contact}</Link>
              <Link to="/faq" className="block px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-green-50">{t.nav.faq}</Link>
              {!user && (
                <Link to="/login" className="block px-3 py-2 rounded-lg font-medium text-[#2d5a27] bg-green-50">{t.auth.login}</Link>
              )}
            </nav>
          </div>
        )}
      </header>
      <div className="h-16 lg:h-20" />
    </>
  );
}
