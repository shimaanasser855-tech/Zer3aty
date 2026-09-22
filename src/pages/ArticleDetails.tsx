import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Calendar, User, ArrowLeft } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { supabase } from '@/lib/supabase';

interface Article {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  content_en: string;
  content_ar: string;
  image_url: string;
  category_en: string;
  category_ar: string;
  author: string;
  reading_time_min: number;
  published_at: string;
}

export default function ArticleDetails() {
  const { slug } = useParams();
  const { t, lang } = useI18n();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('articles').select('*').eq('slug', slug).maybeSingle().then(({ data }) => {
      setArticle(data);
      if (data) {
        supabase.from('articles').select('*').neq('id', data.id).limit(3).then(({ data: r }) => {
          setRelated(r ?? []);
        });
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <div className="section-padding py-20 text-center text-gray-500">{t.common.loading}</div>;
  if (!article) return (
    <div className="section-padding py-20 text-center">
      <p className="text-xl text-gray-700">{t.common.error}</p>
      <Link to="/articles" className="btn-primary mt-4">{t.articles.title}</Link>
    </div>
  );

  const tr = (en: string | null, ar: string | null) => lang === 'ar' ? ar : en;

  return (
    <div>
      <div className="relative h-[400px] overflow-hidden">
        <img src={article.image_url} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a3d1a]/90 via-[#1a3d1a]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 section-padding pb-8">
          <Link to="/articles" className="inline-flex items-center gap-1 text-green-200 hover:text-white mb-3 text-sm">
            <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            {t.articles.backToArticles}
          </Link>
          <span className="text-xs font-semibold text-[#e8a838] uppercase tracking-wide">{tr(article.category_en, article.category_ar)}</span>
          <h1 className="text-2xl lg:text-4xl font-bold text-white mt-1 max-w-3xl">{tr(article.title_en, article.title_ar)}</h1>
          <div className="flex items-center gap-4 mt-3 text-sm text-green-200">
            <span className="flex items-center gap-1"><User className="w-4 h-4" /> {article.author}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(article.published_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {article.reading_time_min} {t.articles.readingTime}</span>
          </div>
        </div>
      </div>

      <div className="section-padding py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-gray-600 mb-6 font-medium">{tr(article.excerpt_en, article.excerpt_ar)}</p>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
            {tr(article.content_en, article.content_ar)}
          </div>
        </div>

        {related.length > 0 && (
          <div className="max-w-5xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-[#1a3d1a] mb-6">{t.articles.relatedArticles}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map(a => (
                <Link key={a.id} to={`/articles/${a.slug}`} className="card group">
                  <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                    <img src={a.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-[#1a3d1a] group-hover:text-[#2d5a27] line-clamp-2">{tr(a.title_en, a.title_ar)}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
