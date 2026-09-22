import { useState, useRef } from 'react';
import { Upload, ImageIcon, Stethoscope, AlertCircle, CheckCircle, Lightbulb, Footprints, X } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { supabase } from '@/lib/supabase';
import PageHeader from '@/components/PageHeader';

export default function AIDoctor() {
  const { t, lang } = useI18n();
  const [image, setImage] = useState<string | null>(null);
  const [plantType, setPlantType] = useState('');
  const [problem, setProblem] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(false);
  const [plants, setPlants] = useState<{id: string; name_en: string; name_ar: string}[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useState(() => {
    supabase.from('plants').select('id, name_en, name_ar').then(({ data }) => {
      if (data) setPlants(data);
    });
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const analyze = () => {
    const errs: string[] = [];
    if (!image) errs.push(t.aiDoctor.selectImage);
    if (!plantType) errs.push(t.aiDoctor.selectPlantType);
    if (!problem) errs.push(t.aiDoctor.describeIssue);
    setErrors(errs);
    if (errs.length > 0) return;

    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResult(true);
    }, 2000);
  };

  const reset = () => {
    setImage(null);
    setPlantType('');
    setProblem('');
    setResult(false);
    setErrors([]);
  };

  return (
    <div>
      <PageHeader title={t.aiDoctor.title} subtitle={t.aiDoctor.subtitle} image="https://images.pexels.com/photos/5230957/pexels-photo-5230957.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" />
      <div className="section-padding py-12">
        <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-8">{t.aiDoctor.intro}</p>

        {/* Disclaimer */}
        <div className="card p-4 mb-8 bg-amber-50 border-amber-200 max-w-3xl mx-auto">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#e8a838] shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">{t.aiDoctor.disclaimer}</p>
          </div>
        </div>

        {!result ? (
          <div className="max-w-2xl mx-auto">
            <div className="card p-6 lg:p-8 space-y-6">
              {/* Upload */}
              <div>
                <label className="block font-semibold text-[#1a3d1a] mb-2">{t.aiDoctor.upload}</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#2d5a27] transition-colors"
                >
                  {image ? (
                    <div className="relative">
                      <img src={image} alt="" className="max-h-48 mx-auto rounded-lg" />
                      <button onClick={(e) => { e.stopPropagation(); setImage(null); }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">{t.aiDoctor.uploadDesc}</p>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </div>

              {/* Plant select */}
              <div>
                <label className="block font-semibold text-[#1a3d1a] mb-2">{t.aiDoctor.selectPlant}</label>
                <select value={plantType} onChange={e => setPlantType(e.target.value)} className="input-field">
                  <option value="">--</option>
                  {plants.map(p => <option key={p.id} value={p.id}>{lang === 'ar' ? p.name_ar : p.name_en}</option>)}
                </select>
              </div>

              {/* Problem description */}
              <div>
                <label className="block font-semibold text-[#1a3d1a] mb-2">{t.aiDoctor.describeProblem}</label>
                <textarea
                  value={problem}
                  onChange={e => setProblem(e.target.value)}
                  placeholder={t.aiDoctor.describePlaceholder}
                  rows={4}
                  className="input-field resize-none"
                />
              </div>

              {/* Errors */}
              {errors.length > 0 && (
                <div className="bg-red-50 rounded-xl p-4 space-y-1">
                  {errors.map((e, i) => <p key={i} className="text-sm text-red-600">{e}</p>)}
                </div>
              )}

              <button onClick={analyze} disabled={analyzing} className="btn-primary w-full disabled:opacity-50">
                <Stethoscope className="w-5 h-5" />
                {analyzing ? t.aiDoctor.analyzing : t.aiDoctor.analyze}
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="card p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-[#2d5a27]" />
                </div>
                <h2 className="text-xl font-bold text-[#1a3d1a]">{t.aiDoctor.result}</h2>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-[#1a3d1a] mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[#e8a838]" />
                  {t.aiDoctor.possibleIssue}
                </h3>
                <p className="text-sm text-gray-600">{problem}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-[#1a3d1a] mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-[#e8a838]" />
                  {t.aiDoctor.careSuggestions}
                </h3>
                <ul className="space-y-2">
                  {t.aiDoctor.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2d5a27] shrink-0 mt-2" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-[#1a3d1a] mb-3 flex items-center gap-2">
                  <Footprints className="w-5 h-5 text-[#2d5a27]" />
                  {t.aiDoctor.nextSteps}
                </h3>
                <ol className="space-y-2">
                  {t.aiDoctor.steps.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-5 h-5 rounded-full bg-green-50 text-[#2d5a27] text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-700 font-medium">{t.aiDoctor.consultSpecialist}</p>
              </div>

              <button onClick={reset} className="btn-secondary w-full">{t.common.back}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
