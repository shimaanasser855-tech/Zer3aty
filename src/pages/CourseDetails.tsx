import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, BookOpen, CheckCircle, ArrowLeft, ArrowRight, PlayCircle } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Lesson {
  id: string;
  order_index: number;
  title_en: string;
  title_ar: string;
  content_en: string;
  content_ar: string;
  duration_min: number;
}

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

export default function CourseDetails() {
  const { slug } = useParams();
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: courseData } = await supabase.from('courses').select('*').eq('slug', slug).maybeSingle();
      setCourse(courseData);
      if (courseData) {
        const { data: lessonData } = await supabase.from('lessons').select('*').eq('course_id', courseData.id).order('order_index');
        setLessons(lessonData ?? []);
        if (lessonData && lessonData.length > 0) setCurrentLesson(lessonData[0]);
      }
      setLoading(false);
    })();
  }, [slug]);

  useEffect(() => {
    if (user && course) {
      supabase.from('course_progress').select('lesson_id, completed').eq('user_id', user.id).eq('course_id', course.id).eq('completed', true).then(({ data }) => {
        if (data) setCompletedLessons(new Set(data.map(d => d.lesson_id)));
      });
    }
  }, [user, course]);

  const markComplete = async () => {
    if (!user || !course || !currentLesson) return;
    await supabase.from('course_progress').upsert({
      user_id: user.id,
      course_id: course.id,
      lesson_id: currentLesson.id,
      completed: true,
      completed_at: new Date().toISOString(),
    });
    setCompletedLessons(prev => new Set([...prev, currentLesson.id]));
  };

  if (loading) return <div className="section-padding py-20 text-center text-gray-500">{t.common.loading}</div>;
  if (!course) return (
    <div className="section-padding py-20 text-center">
      <p className="text-xl text-gray-700">{t.common.error}</p>
      <Link to="/academy" className="btn-primary mt-4">{t.academy.title}</Link>
    </div>
  );

  const tr = (en: string | null, ar: string | null) => lang === 'ar' ? ar : en;
  const progress = lessons.length > 0 ? Math.round((completedLessons.size / lessons.length) * 100) : 0;
  const currentIndex = lessons.findIndex(l => l.id === currentLesson?.id);

  return (
    <div>
      <div className="relative h-[300px] overflow-hidden">
        <img src={course.image_url} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a3d1a]/90 to-[#1a3d1a]/40" />
        <div className="absolute bottom-0 left-0 right-0 section-padding pb-6">
          <Link to="/academy" className="inline-flex items-center gap-1 text-green-200 hover:text-white mb-2 text-sm">
            <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            {t.academy.title}
          </Link>
          <h1 className="text-2xl lg:text-4xl font-bold text-white">{tr(course.title_en, course.title_ar)}</h1>
          <div className="flex items-center gap-4 mt-3 text-sm text-green-200">
            <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {course.lessons_count} {t.academy.lessons}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {tr(course.duration_en, course.duration_ar)}</span>
          </div>
        </div>
      </div>

      <div className="section-padding py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lesson content */}
          <div className="lg:col-span-2">
            {currentLesson && (
              <div className="card p-6 lg:p-8">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <span className="font-medium">{t.academy.lesson} {currentIndex + 1} / {lessons.length}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {currentLesson.duration_min} min</span>
                </div>
                <h2 className="text-2xl font-bold text-[#1a3d1a] mb-4">{tr(currentLesson.title_en, currentLesson.title_ar)}</h2>
                <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                  {tr(currentLesson.content_en, currentLesson.content_ar)}
                </div>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => currentIndex > 0 && setCurrentLesson(lessons[currentIndex - 1])}
                    disabled={currentIndex === 0}
                    className="btn-secondary disabled:opacity-50"
                  >
                    <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                    {t.academy.previous}
                  </button>
                  {user ? (
                    <button
                      onClick={markComplete}
                      disabled={completedLessons.has(currentLesson.id)}
                      className="btn-primary disabled:opacity-50 disabled:cursor-default"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {completedLessons.has(currentLesson.id) ? t.academy.completed2 : t.academy.markComplete}
                    </button>
                  ) : (
                    <Link to="/login" className="text-sm text-[#2d5a27] font-medium">{t.academy.loginToTrack}</Link>
                  )}
                  <button
                    onClick={() => currentIndex < lessons.length - 1 && setCurrentLesson(lessons[currentIndex + 1])}
                    disabled={currentIndex === lessons.length - 1}
                    className="btn-secondary disabled:opacity-50"
                  >
                    {t.academy.next}
                    <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="card p-6 sticky top-24">
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-500">{t.academy.progress}</span>
                  <span className="font-bold text-[#2d5a27]">{progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#2d5a27] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs text-gray-500 mt-1">{completedLessons.size} / {lessons.length} {t.academy.lessonsCompleted}</p>
              </div>

              <h3 className="font-bold text-[#1a3d1a] mb-3">{t.academy.courseContent}</h3>
              <div className="space-y-1 max-h-[400px] overflow-y-auto scrollbar-hide">
                {lessons.map((lesson, i) => (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLesson(lesson)}
                    className={`w-full text-left p-3 rounded-lg transition-colors flex items-start gap-2 ${currentLesson?.id === lesson.id ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                  >
                    {completedLessons.has(lesson.id) ? (
                      <CheckCircle className="w-5 h-5 text-[#2d5a27] shrink-0 mt-0.5" />
                    ) : (
                      <PlayCircle className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${currentLesson?.id === lesson.id ? 'text-[#2d5a27]' : 'text-gray-700'}`}>
                        {i + 1}. {tr(lesson.title_en, lesson.title_ar)}
                      </div>
                      <div className="text-xs text-gray-400">{lesson.duration_min} min</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
