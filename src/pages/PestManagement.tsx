import { Shield, Eye, Search, Sprout, Wrench, Bug, Hand, AlertTriangle, Info } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import PageHeader from '@/components/PageHeader';

export default function PestManagement() {
  const { t } = useI18n();

  const steps = [
    { icon: Shield, title: t.pestManagement.steps.prevention, desc: t.pestManagement.steps.preventionDesc },
    { icon: Eye, title: t.pestManagement.steps.monitoring, desc: t.pestManagement.steps.monitoringDesc },
    { icon: Search, title: t.pestManagement.steps.identification, desc: t.pestManagement.steps.identificationDesc },
    { icon: Sprout, title: t.pestManagement.steps.cultural, desc: t.pestManagement.steps.culturalDesc },
    { icon: Wrench, title: t.pestManagement.steps.mechanical, desc: t.pestManagement.steps.mechanicalDesc },
    { icon: Bug, title: t.pestManagement.steps.biological, desc: t.pestManagement.steps.biologicalDesc },
    { icon: Hand, title: t.pestManagement.steps.intervention, desc: t.pestManagement.steps.interventionDesc },
  ];

  const insects = [
    { name: t.pestManagement.beneficialInsects.ladyBeetles, desc: t.pestManagement.beneficialInsects.ladyBeetlesDesc, image: 'https://images.pexels.com/photos/32961847/pexels-photo-32961847.jpeg?auto=compress&cs=tinysrgb&h=400&w=600' },
    { name: t.pestManagement.beneficialInsects.lacewings, desc: t.pestManagement.beneficialInsects.lacewingsDesc, image: 'https://images.pexels.com/photos/11035193/pexels-photo-11035193.jpeg?auto=compress&cs=tinysrgb&h=400&w=600' },
    { name: t.pestManagement.beneficialInsects.pollinators, desc: t.pestManagement.beneficialInsects.pollinatorsDesc, image: 'https://images.pexels.com/photos/18373132/pexels-photo-18373132.jpeg?auto=compress&cs=tinysrgb&h=400&w=600' },
  ];

  return (
    <div>
      <PageHeader title={t.pestManagement.title} subtitle={t.pestManagement.subtitle} image="https://images.pexels.com/photos/32961847/pexels-photo-32961847.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" />
      <div className="section-padding py-12">
        <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-12">{t.pestManagement.intro}</p>

        {/* Steps */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={i} className="card p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#2d5a27] text-white font-bold flex items-center justify-center shrink-0">
                  <step.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1a3d1a] mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Beneficial insects */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#1a3d1a] mb-2">{t.pestManagement.beneficialInsects.title}</h2>
          <p className="text-gray-600 mb-6">{t.pestManagement.beneficialInsects.desc}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {insects.map((insect, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="aspect-[3/2] overflow-hidden">
                  <img src={insect.image} alt={insect.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#1a3d1a] mb-2">{insect.name}</h3>
                  <p className="text-sm text-gray-600">{insect.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="card p-6 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#e8a838] shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">{t.pestManagement.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
