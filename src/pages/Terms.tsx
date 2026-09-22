import { useI18n } from '@/contexts/I18nContext';
import PageHeader from '@/components/PageHeader';
import { FileText } from 'lucide-react';

export default function Terms() {
  const { t } = useI18n();
  return (
    <div>
      <PageHeader title={t.terms.title} subtitle={t.terms.subtitle} />
      <div className="section-padding py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-gray-500 mb-8">{t.terms.lastUpdated}</p>
          <div className="space-y-6">
            {t.terms.sections.map((section, i) => (
              <div key={i} className="card p-6">
                <h2 className="text-lg font-bold text-[#1a3d1a] mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#2d5a27]" />
                  {section.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
