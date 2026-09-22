import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Sprout, ShoppingBag, BookOpen, GraduationCap } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { supabase } from '@/lib/supabase';

interface SearchResult {
  type: 'plant' | 'product' | 'article' | 'course';
  slug: string;
  title_en: string;
  title_ar: string;
  image_url: string;
  desc_en: string;
  desc_ar: string;
}

export default function Search() {
  const { t, lang } = useI18n();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) { setLoading(false); return; }
    setLoading(true);
    const q = query.toLowerCase();
    Promise.all([
      supabase.from('plants').select('slug, name_en, name_ar, image_url, description_en, description_ar').ilike('name_en', `%${q}%`),
      supabase.from('products').select('slug, name_en, name_ar, image_url, description_en, description_ar').ilike('name_en', `%${q}%`),
      supabase.from('articles').select('slug, title_en, title_ar, image_url, excerpt_en, excerpt_ar').ilike('title_en', `%${q}%`),
      supabase.from('courses').select('slug, title_en, title_ar, image_url, description_en, description_ar').ilike('title_en', `%${q}%`),
    ]).then(([p, pr, a, c]) => {
      const all: SearchResult[] = [
        ...(p.data ?? []).map((x: any) => ({ type: 'plant' as const, slug: x.slug, title_en: x.name_en, title_ar: x.name_ar, image_url: x.image_url, desc_en: x.description_en, desc_ar: x.description_ar })),
        ...(pr.data ?? []).map((x: any) => ({ type: 'product' as const, slug: x.slug, title_en: x.name_en, title_ar: x.name_ar, image_url: x.image_url, desc_en: x.description_en, desc_ar: x.description_ar })),
        ...(a.data ?? []).map((x: any) => ({ type: 'article' as const, slug: x.slug, title_en: x.title_en, title_ar: x.title_ar, image_url: x.image_url, desc_en: x.excerpt_en, desc_ar: x.excerpt_ar })),
        ...(c.data ?? []).map((x: any) => ({ type: 'course' as const, slug: x.slug, title_en: x.title_en, title_ar: x.title_ar, image_url: x.image_url, desc_en: x.description_en, desc_ar: x.description_ar })),
      ];
      setResults(all);
      setLoading(false);
    });
  }, [query]);

  const typeIcons = { plant: Sprout, product: ShoppingBag, article: BookOpen, course: GraduationCap };
  const typeLabels = { plant: t.search.plants, product: t.search.products, article: t.search.articles, course: t.search.courses };
  const typeLinks = { plant: '/plants/', product: '/store/', article: '/articles/', course: '/academy/' };

  return (
    <div className="section-padding py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <SearchIcon className="w-8 h-8 text-[#2d5a27]" />
          <div>
            <h1 className="text-2xl font-bold text-[#1a3d1a]">{t.search.title}</h1>
            <p className="text-gray-500">{results.length} {t.search.results} "{query}"</p>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-20">{t.common.loading}</p>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-700">{t.search.noResults} "{query}"</p>
            <p className="text-gray-500 mt-2">{t.search.noResultsDesc}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((r, i) => {
              const Icon = typeIcons[r.type];
              return (
                <Link key={i} to={`${typeLinks[r.type]}${r.slug}`} className="card p-4 flex items-center gap-4 group">
                  <img src={r.image_url} alt="" className="w-16 h-16 rounded-xl object-cover bg-gray-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-[#2d5a27]" />
                      <span className="text-xs font-semibold text-[#e8a838] uppercase">{typeLabels[r.type]}</span>
                    </div>
                    <h3 className="font-bold text-[#1a3d1a] group-hover:text-[#2d5a27] transition-colors">{lang === 'ar' ? r.title_ar : r.title_en}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{lang === 'ar' ? r.desc_ar : r.desc_en}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
