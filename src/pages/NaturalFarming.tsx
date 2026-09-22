import { Recycle, Mountain, Droplets, Sprout, Bug, Globe, Leaf, Sun } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import PageHeader from '@/components/PageHeader';

export default function NaturalFarming() {
  const { t } = useI18n();

  const topics = [
    { icon: Globe, title: t.naturalFarming.topics.sustainableAgri, desc: t.naturalFarming.topics.sustainableAgriDesc },
    { icon: Leaf, title: t.naturalFarming.topics.organicMatter, desc: t.naturalFarming.topics.organicMatterDesc },
    { icon: Recycle, title: t.naturalFarming.topics.composting, desc: t.naturalFarming.topics.compostingDesc },
    { icon: Mountain, title: t.naturalFarming.topics.soilHealth, desc: t.naturalFarming.topics.soilHealthDesc },
    { icon: Droplets, title: t.naturalFarming.topics.waterConservation, desc: t.naturalFarming.topics.waterConservationDesc },
    { icon: Sprout, title: t.naturalFarming.topics.cropRotation, desc: t.naturalFarming.topics.cropRotationDesc },
    { icon: Bug, title: t.naturalFarming.topics.ipm, desc: t.naturalFarming.topics.ipmDesc },
    { icon: Sun, title: t.naturalFarming.topics.beneficialOrganisms, desc: t.naturalFarming.topics.beneficialOrganismsDesc },
  ];

  return (
    <div>
      <PageHeader title={t.naturalFarming.title} subtitle={t.naturalFarming.subtitle} image="https://images.pexels.com/photos/27177514/pexels-photo-27177514.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" />
      <div className="section-padding py-12">
        <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-12">{t.naturalFarming.intro}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topics.map((topic, i) => (
            <div key={i} className="card p-6 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                <topic.icon className="w-6 h-6 text-[#2d5a27]" />
              </div>
              <h3 className="font-bold text-[#1a3d1a] mb-2">{topic.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{topic.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
