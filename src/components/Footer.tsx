import { Link } from 'react-router-dom';
import { Sprout, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

export default function Footer() {
  const { t, lang } = useI18n();

  const learnLinks = [
    { to: '/plants', label: t.nav.plants },
    { to: '/home-gardening', label: t.nav.homeGardening },
    { to: '/school-gardening', label: t.nav.schoolGardening },
    { to: '/natural-farming', label: t.nav.naturalFarming },
    { to: '/academy', label: t.nav.academy },
    { to: '/articles', label: t.nav.articles },
  ];

  const shopLinks = [
    { to: '/store', label: t.store.title },
    { to: '/store?category=seeds', label: lang === 'ar' ? 'بذور' : 'Seeds' },
    { to: '/store?category=tools', label: lang === 'ar' ? 'أدوات' : 'Tools' },
    { to: '/store?category=fertilizers', label: lang === 'ar' ? 'أسمدة' : 'Fertilizers' },
    { to: '/cart', label: t.cart.title },
  ];

  const supportLinks = [
    { to: '/contact', label: t.footer.contact },
    { to: '/faq', label: t.footer.faq },
    { to: '/privacy', label: t.footer.privacy },
    { to: '/terms', label: t.footer.terms },
  ];

  return (
    <footer className="bg-[#1a3d1a] text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#2d5a27] flex items-center justify-center border border-green-600">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">Zer3aty</span>
                <span className="text-xs text-green-400 block leading-none">{lang === 'ar' ? 'زرعتي' : ''}</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">{t.footer.aboutDesc}</p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-green-800/50 flex items-center justify-center hover:bg-[#e8a838] transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Learn */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">{t.footer.learn}</h3>
            <ul className="space-y-2">
              {learnLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-[#e8a838] transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">{t.footer.shop}</h3>
            <ul className="space-y-2">
              {shopLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-[#e8a838] transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support + Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">{t.footer.support}</h3>
            <ul className="space-y-2 mb-4">
              {supportLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-[#e8a838] transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
            <div className="space-y-1 text-sm text-gray-400">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@zer3aty.com</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> +20 100 000 0000</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {t.contact.address}</div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-green-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} Zer3aty. {t.footer.rights}</p>
          <p className="text-sm text-gray-500">{t.footer.madeWith}</p>
        </div>
      </div>
    </footer>
  );
}
