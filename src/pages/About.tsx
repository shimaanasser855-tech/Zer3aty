import { Link } from 'react-router-dom';
import { Target, Lightbulb, Users, TrendingUp, Eye, Leaf, ArrowRight, Check } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import PageHeader from '@/components/PageHeader';

export default function About() {
  const { t, lang } = useI18n();

  return (
    <div>
      <PageHeader title={t.about.title} subtitle={t.about.subtitle} image="https://images.pexels.com/photos/27177514/pexels-photo-27177514.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" />
      <div className="section-padding py-12">
        {/* Mission */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-[#2d5a27]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1a3d1a] mb-3">{t.about.mission}</h2>
          <p className="text-gray-600 leading-relaxed">{t.about.missionDesc}</p>
        </div>

        {/* Problem + Solution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="card p-8">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-[#1a3d1a] mb-3">{t.about.problem}</h3>
            <p className="text-gray-600 leading-relaxed">{t.about.problemDesc}</p>
          </div>
          <div className="card p-8 gradient-beige">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4">
              <Lightbulb className="w-6 h-6 text-[#2d5a27]" />
            </div>
            <h3 className="text-xl font-bold text-[#1a3d1a] mb-3">{t.about.solution}</h3>
            <p className="text-gray-600 leading-relaxed">{t.about.solutionDesc}</p>
          </div>
        </div>

        {/* Target users */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-6 h-6 text-[#2d5a27]" />
            <h2 className="text-2xl font-bold text-[#1a3d1a]">{t.about.targetUsers}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.about.targetUsersList.map((user, i) => (
              <div key={i} className="flex items-center gap-2 card p-4">
                <Check className="w-5 h-5 text-[#2d5a27] shrink-0" />
                <span className="text-sm text-gray-700">{user}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Value prop + Business model */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="card p-8">
            <h3 className="text-xl font-bold text-[#1a3d1a] mb-3">{t.about.valueProp}</h3>
            <p className="text-gray-600 leading-relaxed">{t.about.valuePropDesc}</p>
          </div>
          <div className="card p-8">
            <h3 className="text-xl font-bold text-[#1a3d1a] mb-3">{t.about.businessModel}</h3>
            <p className="text-gray-600 leading-relaxed">{t.about.businessModelDesc}</p>
          </div>
        </div>

        {/* Future vision */}
        <div className="card p-8 mb-16 bg-[#1a3d1a] text-white text-center">
          <Eye className="w-12 h-12 text-[#e8a838] mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-3">{t.about.futureVision}</h3>
          <p className="text-green-100 max-w-2xl mx-auto">{t.about.futureVisionDesc}</p>
        </div>

        {/* Values */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Leaf className="w-6 h-6 text-[#2d5a27]" />
            <h2 className="text-2xl font-bold text-[#1a3d1a]">{t.about.values}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.about.valuesList.map((value, i) => (
              <div key={i} className="card p-6">
                <h3 className="font-bold text-[#1a3d1a] mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Impact & Vision */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#1a3d1a] text-center mb-2">{t.impact.title}</h2>
          <p className="text-gray-500 text-center mb-8">{t.impact.subtitle}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.impact.steps.map((step, i) => (
              <div key={i} className="card p-6 text-center">
                <div className="w-10 h-10 rounded-full bg-[#e8a838] text-white font-bold flex items-center justify-center mx-auto mb-3">
                  {i + 1}
                </div>
                <h3 className="font-bold text-[#1a3d1a] mb-1">{step.title}</h3>
                <p className="text-xs text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/register" className="btn-primary text-base !px-8 !py-4">
            {t.cta.register}
            <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </div>
    </div>
  );
}
