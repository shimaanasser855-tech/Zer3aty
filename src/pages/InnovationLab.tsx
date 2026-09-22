import { Check, Clock, Cpu, FlaskConical, ArrowRight, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import PageHeader from '@/components/PageHeader';

export default function InnovationLab() {
  const { t, lang } = useI18n();

  return (
    <div>
      <PageHeader title={t.innovationLab.title} subtitle={t.innovationLab.subtitle} image="https://images.pexels.com/photos/6792187/pexels-photo-6792187.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" />
      <div className="section-padding py-12">
        <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-12">{t.innovationLab.intro}</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Current */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <Check className="w-5 h-5 text-[#2d5a27]" />
              </div>
              <h2 className="text-xl font-bold text-[#1a3d1a]">{t.innovationLab.current}</h2>
            </div>
            <ul className="space-y-3">
              {t.innovationLab.currentItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-[#2d5a27] shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Future */}
          <div className="card p-6 bg-[#1a3d1a] text-white">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-800 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#e8a838]" />
              </div>
              <h2 className="text-xl font-bold">{t.innovationLab.future}</h2>
            </div>
            <ul className="space-y-3">
              {t.innovationLab.futureItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-green-100">
                  <Clock className="w-4 h-4 text-[#e8a838] shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Vision */}
        <div className="card p-8 gradient-beige text-center mb-8">
          <Lightbulb className="w-12 h-12 text-[#e8a838] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1a3d1a] mb-3">{t.innovationLab.vision}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t.innovationLab.visionDesc}</p>
        </div>

        <div className="text-center">
          <Link to="/smart-agriculture" className="btn-primary">
            <Cpu className="w-5 h-5" />
            {t.smartAgri.title}
            <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </div>
    </div>
  );
}
