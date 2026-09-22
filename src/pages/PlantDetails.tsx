import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sun, Droplets, Mountain, Clock, MapPin, Calendar, Sprout, AlertTriangle, Bug, ShieldCheck, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { supabase } from '@/lib/supabase';

interface Plant {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  image_url: string;
  description_en: string;
  description_ar: string;
  difficulty: string;
  sunlight_en: string;
  sunlight_ar: string;
  water_en: string;
  water_ar: string;
  soil_en: string;
  soil_ar: string;
  growing_period_en: string;
  growing_period_ar: string;
  suitable_location_en: string;
  suitable_location_ar: string;
  planting_season_en: string;
  planting_season_ar: string;
  care_instructions_en: string;
  care_instructions_ar: string;
  harvest_info_en: string;
  harvest_info_ar: string;
  is_indoor: boolean;
  is_outdoor: boolean;
  category_id: string;
}

export default function PlantDetails() {
  const { slug } = useParams();
  const { t, lang } = useI18n();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('plants').select('*').eq('slug', slug).maybeSingle().then(({ data }) => {
      setPlant(data);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return <div className="section-padding py-20 text-center text-gray-500">{t.common.loading}</div>;
  }

  if (!plant) {
    return (
      <div className="section-padding py-20 text-center">
        <p className="text-xl text-gray-700">{t.common.error}</p>
        <Link to="/plants" className="btn-primary mt-4">{t.plants.title}</Link>
      </div>
    );
  }

  const tr = (en: string | null, ar: string | null): string | undefined => lang === 'ar' ? (ar ?? undefined) : (en ?? undefined);

  const requirements = [
    { icon: Sun, label: t.plants.details.sunlight, value: tr(plant.sunlight_en, plant.sunlight_ar) },
    { icon: Droplets, label: t.plants.details.water, value: tr(plant.water_en, plant.water_ar) },
    { icon: Mountain, label: t.plants.details.soil, value: tr(plant.soil_en, plant.soil_ar) },
    { icon: Clock, label: t.plants.details.growingPeriod, value: tr(plant.growing_period_en, plant.growing_period_ar) },
    { icon: MapPin, label: t.plants.details.suitableLocation, value: tr(plant.suitable_location_en, plant.suitable_location_ar) },
    { icon: Calendar, label: t.plants.details.plantingSeason, value: tr(plant.planting_season_en, plant.planting_season_ar) },
  ];

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[400px] overflow-hidden">
        <img src={plant.image_url} alt={tr(plant.name_en, plant.name_ar)} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a3d1a]/90 via-[#1a3d1a]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 section-padding pb-8">
          <Link to="/plants" className="inline-flex items-center gap-1 text-green-200 hover:text-white mb-3 text-sm">
            <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            {t.plants.title}
          </Link>
          <h1 className="text-3xl lg:text-5xl font-bold text-white">{tr(plant.name_en, plant.name_ar)}</h1>
          <div className="flex items-center gap-3 mt-3">
            <span className={`badge badge-${plant.difficulty}`}>
              {plant.difficulty === 'beginner' ? t.plants.beginner : plant.difficulty === 'intermediate' ? t.plants.intermediate : t.plants.advanced}
            </span>
            <span className="text-green-200 text-sm">{plant.is_indoor && t.plants.indoor}{plant.is_indoor && plant.is_outdoor && ' / '}{plant.is_outdoor && t.plants.outdoor}</span>
          </div>
        </div>
      </div>

      <div className="section-padding py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <section>
              <h2 className="text-2xl font-bold text-[#1a3d1a] mb-3">{t.plants.details.overview}</h2>
              <p className="text-gray-600 leading-relaxed">{tr(plant.description_en, plant.description_ar)}</p>
            </section>

            {/* Requirements */}
            <section>
              <h2 className="text-2xl font-bold text-[#1a3d1a] mb-4">{t.plants.details.growingRequirements}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {requirements.map((req, i) => (
                  <div key={i} className="card p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                      <req.icon className="w-5 h-5 text-[#2d5a27]" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">{req.label}</div>
                      <div className="text-sm text-[#1a3d1a] font-semibold">{req.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Care instructions */}
            <section>
              <h2 className="text-2xl font-bold text-[#1a3d1a] mb-3">{t.plants.details.careInstructions}</h2>
              <p className="text-gray-600 leading-relaxed">{tr(plant.care_instructions_en, plant.care_instructions_ar)}</p>
            </section>

            {/* Harvest */}
            <section>
              <h2 className="text-2xl font-bold text-[#1a3d1a] mb-3">{t.plants.details.harvestInfo}</h2>
              <p className="text-gray-600 leading-relaxed">{tr(plant.harvest_info_en, plant.harvest_info_ar)}</p>
            </section>

            {/* Common problems */}
            <section>
              <h2 className="text-2xl font-bold text-[#1a3d1a] mb-3 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-[#e8a838]" />
                {t.plants.details.commonProblems}
              </h2>
              <p className="text-gray-600 leading-relaxed">{t.plants.details.commonProblemsContent}</p>
            </section>

            {/* IPM */}
            <section>
              <h2 className="text-2xl font-bold text-[#1a3d1a] mb-3 flex items-center gap-2">
                <Bug className="w-6 h-6 text-[#2d5a27]" />
                {t.plants.details.ipm}
              </h2>
              <p className="text-gray-600 leading-relaxed">{t.plants.details.ipmContent}</p>
            </section>

            {/* Safety */}
            <section>
              <h2 className="text-2xl font-bold text-[#1a3d1a] mb-3 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#2d5a27]" />
                {t.plants.details.safetyNotes}
              </h2>
              <p className="text-gray-600 leading-relaxed">{t.plants.details.safetyContent}</p>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card p-6 sticky top-24">
              <img src={plant.image_url} alt="" className="w-full aspect-square object-cover rounded-xl mb-4" />
              <h3 className="font-bold text-[#1a3d1a] mb-3">{tr(plant.name_en, plant.name_ar)}</h3>
              <div className="space-y-2 text-sm mb-6">
                <div className="flex justify-between"><span className="text-gray-500">{t.plants.details.difficulty}</span><span className="font-semibold">{plant.difficulty === 'beginner' ? t.plants.beginner : plant.difficulty === 'intermediate' ? t.plants.intermediate : t.plants.advanced}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">{t.plants.indoor}</span><span className="font-semibold">{plant.is_indoor ? t.common.yes : t.common.no}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">{t.plants.outdoor}</span><span className="font-semibold">{plant.is_outdoor ? t.common.yes : t.common.no}</span></div>
              </div>
              <Link to="/store?category=seeds" className="btn-primary w-full">
                <ShoppingCart className="w-4 h-4" />
                {t.plants.details.buySeeds}
              </Link>
              <Link to="/home-gardening" className="btn-secondary w-full mt-2">
                <Sprout className="w-4 h-4" />
                {t.plants.details.startGrowing}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
