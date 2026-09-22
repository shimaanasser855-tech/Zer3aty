import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
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
  planting_season_en: string;
  planting_season_ar: string;
  is_indoor: boolean;
  is_outdoor: boolean;
  category_id: string;
}

interface Category {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
}

export default function Plants() {
  const { t, lang } = useI18n();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [location, setLocation] = useState('all');

  useEffect(() => {
    Promise.all([
      supabase.from('plants').select('id, slug, name_en, name_ar, image_url, difficulty, planting_season_en, planting_season_ar, is_indoor, is_outdoor, category_id'),
      supabase.from('plant_categories').select('id, slug, name_en, name_ar'),
    ]).then(([p, c]) => {
      setPlants(p.data ?? []);
      setCategories(c.data ?? []);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    return plants.filter(p => {
      if (search) {
        const q = search.toLowerCase();
        if (!p.name_en.toLowerCase().includes(q) && !p.name_ar.includes(search)) return false;
      }
      if (category !== 'all' && p.category_id !== category) return false;
      if (difficulty !== 'all' && p.difficulty !== difficulty) return false;
      if (location === 'indoor' && !p.is_indoor) return false;
      if (location === 'outdoor' && !p.is_outdoor) return false;
      return true;
    });
  }, [plants, search, category, difficulty, location]);

  const difficultyLabel = (d: string) => {
    if (d === 'beginner') return t.plants.beginner;
    if (d === 'intermediate') return t.plants.intermediate;
    return t.plants.advanced;
  };

  return (
    <div>
      <PageHeader title={t.plants.title} subtitle={t.plants.subtitle} />
      <div className="section-padding py-12">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.plants.searchPlaceholder}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d5a27]"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select value={category} onChange={e => setCategory(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]">
              <option value="all">{t.plants.allCategories}</option>
              {categories.map(c => <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>)}
            </select>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]">
              <option value="all">{t.plants.allDifficulties}</option>
              <option value="beginner">{t.plants.beginner}</option>
              <option value="intermediate">{t.plants.intermediate}</option>
              <option value="advanced">{t.plants.advanced}</option>
            </select>
            <select value={location} onChange={e => setLocation(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]">
              <option value="all">{t.plants.allLocations}</option>
              <option value="indoor">{t.plants.indoor}</option>
              <option value="outdoor">{t.plants.outdoor}</option>
            </select>
            <div className="flex items-center gap-1 text-sm text-gray-500 ml-auto">
              <SlidersHorizontal className="w-4 h-4" />
              {filtered.length} {t.plants.results}
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(8)].map((_, i) => <div key={i} className="aspect-[4/5] bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl font-semibold text-gray-700">{t.plants.noResults}</p>
            <p className="text-gray-500 mt-2">{t.plants.noResultsDesc}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {filtered.map(plant => (
              <Link key={plant.id} to={`/plants/${plant.slug}`} className="card group">
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img src={plant.image_url} alt={lang === 'ar' ? plant.name_ar : plant.name_en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-[#1a3d1a] group-hover:text-[#2d5a27] transition-colors">{lang === 'ar' ? plant.name_ar : plant.name_en}</h3>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`badge badge-${plant.difficulty}`}>{difficultyLabel(plant.difficulty)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{lang === 'ar' ? plant.planting_season_ar : plant.planting_season_en}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
