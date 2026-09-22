import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Building, TreePine, Flower, Sun, Droplets, Sprout, ArrowRight, Info } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { supabase } from '@/lib/supabase';
import PageHeader from '@/components/PageHeader';

interface Plant {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  image_url: string;
  difficulty: string;
  is_indoor: boolean;
  is_outdoor: boolean;
}

export default function HomeGardening() {
  const { t, lang } = useI18n();
  const [space, setSpace] = useState('');
  const [experience, setExperience] = useState('');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [recommendations, setRecommendations] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('plants').select('id, slug, name_en, name_ar, image_url, difficulty, is_indoor, is_outdoor').then(({ data }) => {
      setPlants(data ?? []);
      setLoading(false);
    });
  }, []);

  const getRecommendations = () => {
    if (!space || !experience) return;
    let filtered = [...plants];
    if (space === 'balcony') filtered = filtered.filter(p => p.is_indoor || p.is_outdoor);
    if (space === 'rooftop') filtered = filtered.filter(p => p.is_outdoor);
    if (space === 'garden') filtered = filtered.filter(p => p.is_outdoor);
    if (space === 'indoor') filtered = filtered.filter(p => p.is_indoor);
    if (experience === 'beginner') filtered = filtered.filter(p => p.difficulty === 'beginner');
    if (experience === 'intermediate') filtered = filtered.filter(p => p.difficulty !== 'advanced');
    setRecommendations(filtered.slice(0, 6));
  };

  const spaceIcons: Record<string, typeof Home> = { balcony: Building, rooftop: Home, garden: TreePine, indoor: Flower };

  return (
    <div>
      <PageHeader title={t.homeGardening.title} subtitle={t.homeGardening.subtitle} image="https://images.pexels.com/photos/7728371/pexels-photo-7728371.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" />
      <div className="section-padding py-12">
        <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-12">{t.homeGardening.intro}</p>

        {/* Interactive guide */}
        <div className="max-w-4xl mx-auto">
          <div className="card p-6 lg:p-8 mb-8">
            <h3 className="text-xl font-bold text-[#1a3d1a] mb-6">{t.homeGardening.chooseSpace}</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
              {Object.entries(t.homeGardening.spaceOptions).map(([key, label]) => {
                const Icon = spaceIcons[key] ?? Home;
                return (
                  <button
                    key={key}
                    onClick={() => setSpace(key)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${space === key ? 'border-[#2d5a27] bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${space === key ? 'text-[#2d5a27]' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${space === key ? 'text-[#2d5a27]' : 'text-gray-600'}`}>{label}</span>
                  </button>
                );
              })}
            </div>

            <h3 className="text-xl font-bold text-[#1a3d1a] mb-6">{t.homeGardening.chooseExperience}</h3>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {Object.entries(t.homeGardening.experienceOptions).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setExperience(key)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${experience === key ? 'border-[#2d5a27] bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
                >
                  <span className={`text-sm font-medium ${experience === key ? 'text-[#2d5a27]' : 'text-gray-600'}`}>{label}</span>
                </button>
              ))}
            </div>

            <button onClick={getRecommendations} disabled={!space || !experience} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
              {t.homeGardening.getRecommendations}
              <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Tips */}
          {space && (
            <div className="card p-6 mb-8 bg-amber-50 border-amber-200">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[#e8a838] shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">{t.homeGardening.tips[space as keyof typeof t.homeGardening.tips]}</p>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-[#1a3d1a] mb-2">{t.homeGardening.recommendations}</h3>
              <p className="text-gray-500 text-sm mb-6">{t.homeGardening.recommendationsDesc}</p>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map(plant => (
                  <Link key={plant.id} to={`/plants/${plant.slug}`} className="card group">
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <img src={plant.image_url} alt={lang === 'ar' ? plant.name_ar : plant.name_en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-3">
                      <h4 className="font-bold text-sm text-[#1a3d1a]">{lang === 'ar' ? plant.name_ar : plant.name_en}</h4>
                      <span className={`badge badge-${plant.difficulty} mt-2`}>
                        {plant.difficulty === 'beginner' ? t.plants.beginner : plant.difficulty === 'intermediate' ? t.plants.intermediate : t.plants.advanced}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {loading && <p className="text-center text-gray-500">{t.common.loading}</p>}
        </div>
      </div>
    </div>
  );
}
