import { Link } from 'react-router-dom';
import { Recycle, Mountain, Leaf, Droplets, ShoppingBag, ArrowRight, AlertCircle } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import PageHeader from '@/components/PageHeader';

export default function Fertilizers() {
  const { t, lang } = useI18n();

  const products = [
    { icon: Recycle, title: t.fertilizers.products.compost, desc: t.fertilizers.products.compostDesc },
    { icon: Mountain, title: t.fertilizers.products.organicSoil, desc: t.fertilizers.products.organicSoilDesc },
    { icon: Leaf, title: t.fertilizers.products.compostedMaterial, desc: t.fertilizers.products.compostedMaterialDesc },
    { icon: Droplets, title: t.fertilizers.products.naturalAmendment, desc: t.fertilizers.products.naturalAmendmentDesc },
  ];

  return (
    <div>
      <PageHeader title={t.fertilizers.title} subtitle={t.fertilizers.subtitle} image="https://images.pexels.com/photos/28214180/pexels-photo-28214180.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" />
      <div className="section-padding py-12">
        <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-12">{t.fertilizers.intro}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {products.map((p, i) => (
            <div key={i} className="card p-6 flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                <p.icon className="w-7 h-7 text-[#2d5a27]" />
              </div>
              <div>
                <h3 className="font-bold text-[#1a3d1a] mb-2">{p.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="card p-6 mb-8 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#e8a838] shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">{t.fertilizers.disclaimer}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/store?category=fertilizers" className="btn-primary">
            <ShoppingBag className="w-5 h-5" />
            {t.fertilizers.shopProducts}
            <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </div>
    </div>
  );
}
