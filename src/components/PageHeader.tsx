import { ReactNode } from 'react';
import { useI18n } from '@/contexts/I18nContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  image?: string;
  children?: ReactNode;
}

export default function PageHeader({ title, subtitle, image, children }: PageHeaderProps) {
  const { t } = useI18n();
  return (
    <div className="relative overflow-hidden">
      {image && (
        <div className="absolute inset-0">
          <img src={image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a3d1a]/80 to-[#1a3d1a]/60" />
        </div>
      )}
      {!image && <div className="absolute inset-0 gradient-hero" />}
      <div className="relative section-padding py-16 lg:py-24 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-balance animate-slide-up">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-lg text-green-100 max-w-2xl mx-auto text-balance animate-slide-up">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
