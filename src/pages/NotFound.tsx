import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Sprout } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

export default function NotFound() {
  const { t, lang } = useI18n();
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center section-padding">
      <div className="text-center max-w-md">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-2xl bg-green-50 flex items-center justify-center mx-auto">
            <Sprout className="w-12 h-12 text-[#2d5a27]" />
          </div>
          <div className="absolute -top-2 -right-2 bg-[#e8a838] text-white text-sm font-bold px-3 py-1 rounded-full">
            404
          </div>
        </div>
        <h1 className="text-3xl font-bold text-[#1a3d1a] mb-3">{t.notFound.title}</h1>
        <p className="text-gray-600 mb-8">{t.notFound.subtitle}</p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/" className="btn-primary">
            <Home className="w-4 h-4" />
            {t.notFound.goHome}
          </Link>
          <button onClick={() => window.history.back()} className="btn-secondary">
            <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            {t.notFound.goBack}
          </button>
        </div>
      </div>
    </div>
  );
}
