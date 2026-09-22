import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, BookOpen, ShoppingBag, Users, Cpu, Leaf, ArrowRight, Sun, Droplets, Mountain, Recycle, Bug, Globe, School, ChevronDown, Star, Quote } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { supabase } from '@/lib/supabase';

interface FeaturedPlant {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  image_url: string;
  difficulty: string;
  planting_season_en: string;
  planting_season_ar: string;
}

interface FeaturedProduct {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  price: number;
  old_price: number | null;
  image_url: string;
  rating: number;
  stock: number;
}

const iconMap: Record<string, typeof Sprout> = {
  Sprout, BookOpen, ShoppingBag, Users, Cpu, Leaf,
};

export default function Home() {
  const { t, lang } = useI18n();
  const [plants, setPlants] = useState<FeaturedPlant[]>([]);
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('plants').select('id, slug, name_en, name_ar, image_url, difficulty, planting_season_en, planting_season_ar').eq('featured', true).limit(6),
      supabase.from('products').select('id, slug, name_en, name_ar, price, old_price, image_url, rating, stock').eq('featured', true).limit(8),
    ]).then(([p, pr]) => {
      setPlants(p.data ?? []);
      setProducts(pr.data ?? []);
      setLoading(false);
    });
  }, []);

  const stats = [
    { value: '15+', label: t.stats.plants },
    { value: '30+', label: t.stats.products },
    { value: '10+', label: t.stats.articles },
    { value: '8', label: t.stats.courses },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero min-h-[600px] lg:min-h-[700px] flex items-center">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.pexels.com/photos/3889959/pexels-photo-3889959.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a3d1a]/60 to-[#1a3d1a]/80" />
        <div className="relative section-padding py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-800/50 text-green-200 text-sm font-medium mb-6 animate-slide-up">
              <Leaf className="w-4 h-4" />
              {t.brandTagline}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white text-balance leading-tight animate-slide-up">
              {t.hero.title}
            </h1>
            <p className="mt-6 text-lg text-green-100 max-w-2xl mx-auto text-balance animate-slide-up">
              {t.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 animate-slide-up">
              <Link to="/home-gardening" className="btn-accent text-base !px-8 !py-4">
                {t.hero.startGrowing}
                <ArrowRight className={lang === 'ar' ? 'w-5 h-5 rotate-180' : 'w-5 h-5'} />
              </Link>
              <Link to="/plants" className="btn-secondary !bg-white/10 !text-white !border-white/30 hover:!bg-white/20">
                {t.hero.discoverPlants}
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4">
          <ChevronDown className="w-8 h-8 text-white/50 animate-bounce" />
        </div>
      </section>

      {/* Why Zer3aty */}
      <section className="py-16 lg:py-24 section-padding">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1a3d1a]">{t.whyZer3aty.title}</h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">{t.whyZer3aty.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.whyZer3aty.items.map((item, i) => {
            const Icon = iconMap[item.icon] ?? Sprout;
            return (
              <div key={i} className="card p-6 hover:-translate-y-1 group">
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-4 group-hover:bg-[#2d5a27] transition-colors duration-300">
                  <Icon className="w-7 h-7 text-[#2d5a27] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold text-[#1a3d1a] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 lg:py-24 gradient-beige">
        <div className="section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1a3d1a]">{t.howItWorks.title}</h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">{t.howItWorks.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.howItWorks.steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="card p-6 text-center h-full">
                  <div className="w-12 h-12 rounded-full bg-[#e8a838] text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
                    {i + 1}
                  </div>
                  <h3 className="font-bold text-[#1a3d1a] mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 z-10">
                    <ArrowRight className={`w-6 h-6 text-[#e8a838] ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Plants */}
      <section className="py-16 lg:py-24 section-padding">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1a3d1a]">{t.featuredPlants.title}</h2>
            <p className="mt-2 text-gray-600">{t.featuredPlants.subtitle}</p>
          </div>
          <Link to="/plants" className="hidden sm:flex items-center gap-1 text-[#2d5a27] font-semibold hover:gap-2 transition-all">
            {t.featuredPlants.viewAll}
            <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="aspect-[4/3] bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {plants.map(plant => (
              <Link key={plant.id} to={`/plants/${plant.slug}`} className="card group">
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img src={plant.image_url} alt={lang === 'ar' ? plant.name_ar : plant.name_en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#1a3d1a] group-hover:text-[#2d5a27] transition-colors">{lang === 'ar' ? plant.name_ar : plant.name_en}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`badge badge-${plant.difficulty}`}>{plant.difficulty === 'beginner' ? t.plants.beginner : plant.difficulty === 'intermediate' ? t.plants.intermediate : t.plants.advanced}</span>
                    <span className="text-xs text-gray-500">{lang === 'ar' ? plant.planting_season_ar : plant.planting_season_en}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="sm:hidden mt-6 text-center">
          <Link to="/plants" className="btn-secondary">{t.featuredPlants.viewAll}</Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 gradient-beige">
        <div className="section-padding">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1a3d1a]">{t.featuredProducts.title}</h2>
              <p className="mt-2 text-gray-600">{t.featuredProducts.subtitle}</p>
            </div>
            <Link to="/store" className="hidden sm:flex items-center gap-1 text-[#2d5a27] font-semibold hover:gap-2 transition-all">
              {t.featuredProducts.viewAll}
              <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <div key={i} className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {products.slice(0, 4).map(product => (
                <Link key={product.id} to={`/store/${product.slug}`} className="card group">
                  <div className="aspect-square overflow-hidden bg-gray-100 relative">
                    <img src={product.image_url} alt={lang === 'ar' ? product.name_ar : product.name_en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {product.old_price && (
                      <span className="absolute top-2 right-2 bg-[#e8a838] text-white text-xs font-bold px-2 py-1 rounded-lg">
                        -{Math.round((1 - product.price / product.old_price) * 100)}%
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-[#1a3d1a] group-hover:text-[#2d5a27] line-clamp-1">{lang === 'ar' ? product.name_ar : product.name_en}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-[#e8a838] text-[#e8a838]" />
                      <span className="text-xs text-gray-500">{product.rating}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-bold text-[#2d5a27]">{t.common.currency} {product.price}</span>
                      {product.old_price && <span className="text-xs text-gray-400 line-through">{t.common.currency} {product.old_price}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Home Gardening + School Gardening */}
      <section className="py-16 lg:py-24 section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card overflow-hidden group">
            <div className="aspect-[16/10] overflow-hidden">
              <img src="https://images.pexels.com/photos/7728371/pexels-photo-7728371.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-[#1a3d1a] mb-2">{t.homeGardeningSection.title}</h3>
              <p className="text-gray-600 mb-4">{t.homeGardeningSection.desc}</p>
              <Link to="/home-gardening" className="btn-primary">{t.homeGardeningSection.learnMore}</Link>
            </div>
          </div>
          <div className="card overflow-hidden group">
            <div className="aspect-[16/10] overflow-hidden">
              <img src="https://images.pexels.com/photos/16850898/pexels-photo-16850898.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-[#1a3d1a] mb-2">{t.schoolGardeningSection.title}</h3>
              <p className="text-gray-600 mb-4">{t.schoolGardeningSection.desc}</p>
              <Link to="/school-gardening" className="btn-primary">{t.schoolGardeningSection.learnMore}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Natural Farming + Sustainable */}
      <section className="py-16 lg:py-24 bg-[#1a3d1a] text-white">
        <div className="section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t.naturalFarmingSection.title}</h2>
              <p className="text-green-100 mb-6">{t.naturalFarmingSection.desc}</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { icon: Recycle, label: t.naturalFarming.topics.composting },
                  { icon: Mountain, label: t.naturalFarming.topics.soilHealth },
                  { icon: Droplets, label: t.naturalFarming.topics.waterConservation },
                  { icon: Bug, label: t.naturalFarming.topics.ipm },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-green-200">
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
              <Link to="/natural-farming" className="btn-accent">{t.naturalFarmingSection.learnMore}</Link>
            </div>
            <div className="relative">
              <img src="https://images.pexels.com/photos/27177514/pexels-photo-27177514.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="" className="rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Academy + Innovation */}
      <section className="py-16 lg:py-24 section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card p-8 gradient-beige">
            <BookOpen className="w-12 h-12 text-[#2d5a27] mb-4" />
            <h3 className="text-2xl font-bold text-[#1a3d1a] mb-2">{t.academySection.title}</h3>
            <p className="text-gray-600 mb-6">{t.academySection.desc}</p>
            <Link to="/academy" className="btn-primary">{t.academySection.exploreCourses}</Link>
          </div>
          <div className="card p-8 bg-[#1a3d1a] text-white">
            <Cpu className="w-12 h-12 text-[#e8a838] mb-4" />
            <h3 className="text-2xl font-bold mb-2">{t.innovationSection.title}</h3>
            <p className="text-green-100 mb-6">{t.innovationSection.desc}</p>
            <Link to="/innovation-lab" className="btn-accent">{t.innovationSection.learnMore}</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 gradient-beige">
        <div className="section-padding">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#1a3d1a]">{t.stats.title}</h2>
            <p className="mt-2 text-sm text-gray-500">{t.stats.subtitle}</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-[#2d5a27]">{stat.value}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 section-padding">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1a3d1a]">{t.testimonials.title}</h2>
          <p className="mt-2 text-sm text-gray-500">{t.testimonials.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.testimonials.items.map((item, i) => (
            <div key={i} className="card p-6">
              <Quote className="w-8 h-8 text-[#e8a838]/30 mb-3" />
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">"{item.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-[#2d5a27] font-bold">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-sm text-[#1a3d1a]">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 gradient-hero text-white">
        <div className="section-padding text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t.cta.title}</h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">{t.cta.subtitle}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/register" className="btn-accent text-base !px-8 !py-4">{t.cta.register}</Link>
            <Link to="/plants" className="btn-secondary !bg-white/10 !text-white !border-white/30 hover:!bg-white/20">{t.cta.browse}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
