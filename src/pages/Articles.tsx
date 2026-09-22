import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, Calendar } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { supabase } from '@/lib/supabase';
import PageHeader from '@/components/PageHeader';

interface Article {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  image_url: string;
  category_en: string;
  category_ar: string;
  author: string;
  reading_time_min: number;
  published_at: string;
}

export default function Articles() {
  const { t, lang } = useI18n();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    supabase.from('articles').select('*').order('published_at', { ascending: false }).then(({ data }) => {
      setArticles(data ?? []);
      setLoading(false);
    });
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(articles.map(a => lang === 'ar' ? a.category_ar : a.category_en));
    return Array.from(cats);
  }, [articles, lang]);

  const filtered = useMemo(() => {
    return articles.filter(a => {
      if (search) {
        const q = search.toLowerCase();
        if (!a.title_en.toLowerCase().includes(q) && !a.title_ar.includes(search)) return false;
      }
      if (category !== 'all' && (lang === 'ar' ? a.category_ar : a.category_en) !== category) return false;
      return true;
    });
  }, [articles, search, category, lang]);

  return (
    <div>
      <PageHeader title={t.articles.title} subtitle={t.articles.subtitle} image="https://images.pexels.com/photos/28214180/pexels-photo-28214180.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" />
      <div className="section-padding py-12">
        <div className="mb-8 space-y-4">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.articles.searchPlaceholder}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d5a27]"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <button onClick={() => setCategory('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${category === 'all' ? 'bg-[#2d5a27] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t.articles.allCategories}
            </button>
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${category === c ? 'bg-[#2d5a27] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="aspect-[4/3] bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl font-semibold text-gray-700">{t.articles.noResults}</p>
            <p className="text-gray-500 mt-2">{t.articles.noResultsDesc}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(article => (
              <Link key={article.id} to={`/articles/${article.slug}`} className="card group">
                <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                  <img src={article.image_url} alt={lang === 'ar' ? article.title_ar : article.title_en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold text-[#e8a838] uppercase tracking-wide">{lang === 'ar' ? article.category_ar : article.category_en}</span>
                  <h3 className="font-bold text-[#1a3d1a] group-hover:text-[#2d5a27] transition-colors mt-1 mb-2 line-clamp-2">{lang === 'ar' ? article.title_ar : article.title_en}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{lang === 'ar' ? article.excerpt_ar : article.excerpt_en}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.reading_time_min} {t.articles.readingTime}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(article.published_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
