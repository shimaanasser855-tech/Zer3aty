import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, BarChart3, ArrowRight, CheckCircle } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import PageHeader from '@/components/PageHeader';

interface Course {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  difficulty: string;
  duration_en: string;
  duration_ar: string;
  lessons_count: number;
  image_url: string;
}

export default function Academy() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('courses').select('*').then(({ data }) => {
      setCourses(data ?? []);
      setLoading(false);
    });
    if (user) {
      supabase.from('course_progress').select('course_id, completed').eq('user_id', user.id).then(({ data }) => {
        if (data) {
          const map: Record<string, number> = {};
          data.forEach(p => {
            map[p.course_id] = (map[p.course_id] ?? 0) + (p.completed ? 1 : 0);
          });
          setProgress(map);
        }
      });
    }
  }, [user]);

  const difficultyLabel = (d: string) => d === 'beginner' ? t.academy.beginner : d === 'intermediate' ? t.academy.intermediate : t.academy.advanced;

  return (
    <div>
      <PageHeader title={t.academy.title} subtitle={t.academy.subtitle} image="https://images.pexels.com/photos/5561356/pexels-photo-5561356.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" />
      <div className="section-padding py-12">
        <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-12">{t.academy.intro}</p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="aspect-[4/3] bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => {
              const completed = progress[course.id] ?? 0;
              const pct = course.lessons_count > 0 ? Math.round((completed / course.lessons_count) * 100) : 0;
              return (
                <Link key={course.id} to={`/academy/${course.slug}`} className="card group">
                  <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
                    <img src={course.image_url} alt={lang === 'ar' ? course.title_ar : course.title_en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className={`badge badge-${course.difficulty} absolute top-3 right-3`}>{difficultyLabel(course.difficulty)}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-[#1a3d1a] group-hover:text-[#2d5a27] transition-colors mb-2">{lang === 'ar' ? course.title_ar : course.title_en}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{lang === 'ar' ? course.description_ar : course.description_en}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {course.lessons_count} {t.academy.lessons}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lang === 'ar' ? course.duration_ar : course.duration_en}</span>
                    </div>
                    {pct > 0 && (
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">{t.academy.progress}</span>
                          <span className="font-medium text-[#2d5a27]">{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#2d5a27] rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-[#2d5a27] font-semibold text-sm">
                      {pct > 0 ? t.academy.continueCourse : t.academy.startCourse}
                      <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
