import { Link } from 'react-router-dom';
import { Users, Sprout, MapPin, Calendar, TrendingUp, GraduationCap, Leaf, ClipboardList, ArrowRight } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import PageHeader from '@/components/PageHeader';

export default function SchoolGardening() {
  const { t, lang } = useI18n();

  const features = [
    { icon: Sprout, title: t.schoolGardening.features.createGarden, desc: t.schoolGardening.features.createGardenDesc },
    { icon: GraduationCap, title: t.schoolGardening.features.teachStudents, desc: t.schoolGardening.features.teachStudentsDesc },
    { icon: TrendingUp, title: t.schoolGardening.features.trackPlants, desc: t.schoolGardening.features.trackPlantsDesc },
    { icon: Leaf, title: t.schoolGardening.features.learnSustainability, desc: t.schoolGardening.features.learnSustainabilityDesc },
    { icon: ClipboardList, title: t.schoolGardening.features.recordActivities, desc: t.schoolGardening.features.recordActivitiesDesc },
    { icon: Users, title: t.schoolGardening.features.organizeStudents, desc: t.schoolGardening.features.organizeStudentsDesc },
  ];

  const sampleStudents = [
    { name: 'Ahmed', grade: 'Grade 5', plants: 3, progress: 75 },
    { name: 'Sara', grade: 'Grade 6', plants: 2, progress: 60 },
    { name: 'Omar', grade: 'Grade 4', plants: 4, progress: 90 },
    { name: 'Layla', grade: 'Grade 5', plants: 2, progress: 45 },
  ];

  const sampleAreas = [
    { name: 'Garden A - Vegetables', plants: 8, status: 'Active' },
    { name: 'Garden B - Herbs', plants: 12, status: 'Active' },
    { name: 'Garden C - Compost', plants: 0, status: 'Maintenance' },
  ];

  return (
    <div>
      <PageHeader title={t.schoolGardening.title} subtitle={t.schoolGardening.subtitle} image="https://images.pexels.com/photos/16850898/pexels-photo-16850898.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" />
      <div className="section-padding py-12">
        <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-12">{t.schoolGardening.intro}</p>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((f, i) => (
            <div key={i} className="card p-6">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-[#2d5a27]" />
              </div>
              <h3 className="font-bold text-[#1a3d1a] mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Sample dashboard */}
        <div className="mb-16">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#1a3d1a]">{t.schoolGardening.dashboardTitle}</h2>
            <p className="text-sm text-gray-500 mt-1">{t.schoolGardening.dashboardDesc}</p>
            <p className="text-xs text-gray-400 mt-1">{t.schoolGardening.sampleData}</p>
          </div>
          <div className="card p-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { icon: Users, label: t.schoolGardening.students, value: '24' },
                { icon: Sprout, label: t.schoolGardening.plants, value: '20' },
                { icon: MapPin, label: t.schoolGardening.gardenAreas, value: '3' },
                { icon: Calendar, label: t.schoolGardening.activities, value: '15' },
              ].map((s, i) => (
                <div key={i} className="bg-green-50 rounded-xl p-4 text-center">
                  <s.icon className="w-6 h-6 text-[#2d5a27] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#1a3d1a]">{s.value}</div>
                  <div className="text-xs text-gray-600">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Students table */}
            <h3 className="font-bold text-[#1a3d1a] mb-3">{t.schoolGardening.students}</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="py-2">{t.dashboard.profile}</th>
                    <th className="py-2 hidden sm:table-cell">{t.schoolGardening.plants}</th>
                    <th className="py-2">{t.schoolGardening.progress}</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleStudents.map((s, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="py-3">
                        <div className="font-medium text-[#1a3d1a]">{s.name}</div>
                        <div className="text-xs text-gray-500">{s.grade}</div>
                      </td>
                      <td className="py-3 hidden sm:table-cell">{s.plants}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[100px] h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#2d5a27] rounded-full" style={{ width: `${s.progress}%` }} />
                          </div>
                          <span className="text-xs font-medium">{s.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Garden areas */}
            <h3 className="font-bold text-[#1a3d1a] mb-3">{t.schoolGardening.gardenAreas}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {sampleAreas.map((a, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4">
                  <div className="font-medium text-[#1a3d1a] text-sm">{a.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{a.plants} {t.schoolGardening.plants}</div>
                  <span className={`badge mt-2 ${a.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{a.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="card p-8 text-center gradient-beige">
          <h2 className="text-2xl font-bold text-[#1a3d1a] mb-3">{t.schoolGardening.joinProgram}</h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">{t.schoolGardening.joinProgramDesc}</p>
          <Link to="/contact" className="btn-primary">
            {t.schoolGardening.joinProgram}
            <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </div>
    </div>
  );
}
