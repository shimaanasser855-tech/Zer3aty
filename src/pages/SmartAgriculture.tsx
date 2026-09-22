import { Cpu, Mountain, Droplets, Eye, BarChart3, Camera, Info } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import PageHeader from '@/components/PageHeader';

export default function SmartAgriculture() {
  const { t } = useI18n();

  const features = [
    { icon: Mountain, title: t.smartAgri.features.sensors, desc: t.smartAgri.features.sensorsDesc },
    { icon: BarChart3, title: t.smartAgri.features.soilMonitoring, desc: t.smartAgri.features.soilMonitoringDesc },
    { icon: Droplets, title: t.smartAgri.features.waterEfficiency, desc: t.smartAgri.features.waterEfficiencyDesc },
    { icon: Eye, title: t.smartAgri.features.plantMonitoring, desc: t.smartAgri.features.plantMonitoringDesc },
    { icon: BarChart3, title: t.smartAgri.features.agriData, desc: t.smartAgri.features.agriDataDesc },
    { icon: Camera, title: t.smartAgri.features.aiObservation, desc: t.smartAgri.features.aiObservationDesc },
  ];

  return (
    <div>
      <PageHeader title={t.smartAgri.title} subtitle={t.smartAgri.subtitle} image="https://images.pexels.com/photos/34182409/pexels-photo-34182409.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" />
      <div className="section-padding py-12">
        <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-12">{t.smartAgri.intro}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((f, i) => (
            <div key={i} className="card p-6 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-[#2d5a27]" />
              </div>
              <h3 className="font-bold text-[#1a3d1a] mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="card p-6 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#e8a838] shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">{t.smartAgri.disclaimer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
