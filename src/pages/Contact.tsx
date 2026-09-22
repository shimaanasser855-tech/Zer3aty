import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useToast } from '@/contexts/ToastContext';
import PageHeader from '@/components/PageHeader';

export default function Contact() {
  const { t } = useI18n();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: string[] = [];
    if (!form.name) errs.push(t.contact.nameRequired);
    if (!form.email) errs.push(t.contact.emailRequired);
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.push(t.contact.emailInvalid);
    if (!form.message) errs.push(t.contact.messageRequired);
    setErrors(errs);
    if (errs.length > 0) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: '', email: '', phone: '', message: '' });
      showToast(t.contact.success, 'success');
    }, 1500);
  };

  return (
    <div>
      <PageHeader title={t.contact.title} subtitle={t.contact.subtitle} />
      <div className="section-padding py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Info */}
          <div>
            <h2 className="text-2xl font-bold text-[#1a3d1a] mb-3">{t.contact.info}</h2>
            <p className="text-gray-600 mb-6">{t.contact.infoDesc}</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#2d5a27]" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">{t.contact.emailLabel}</div>
                  <div className="font-medium text-[#1a3d1a]">info@zer3aty.com</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#2d5a27]" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">{t.contact.phoneLabel}</div>
                  <div className="font-medium text-[#1a3d1a]">+20 100 000 0000</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#2d5a27]" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">{t.contact.addressLabel}</div>
                  <div className="font-medium text-[#1a3d1a]">{t.contact.address}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="card p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.contact.name} *</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder={t.contact.namePlaceholder} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.contact.email} *</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder={t.contact.emailPlaceholder} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.contact.phone}</label>
                <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder={t.contact.phonePlaceholder} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.contact.message} *</label>
                <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder={t.contact.messagePlaceholder} rows={5} className="input-field resize-none" />
              </div>
              {errors.length > 0 && (
                <div className="bg-red-50 rounded-xl p-3 space-y-1">
                  {errors.map((e, i) => <p key={i} className="text-sm text-red-600">{e}</p>)}
                </div>
              )}
              <button type="submit" disabled={sending} className="btn-primary w-full disabled:opacity-50">
                {sending ? t.contact.sending : t.contact.send}
                {!sending && <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
