
import React from 'react';
import { ShieldCheck, ArrowRight, Lock, UserCheck, Share2, Info, Cookie, Baby } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy: React.FC<{ standalone?: boolean }> = ({ standalone }) => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. المعلومات التي نقوم بجمعها",
      icon: Info,
      content: [
        "الاسم أو اسم المستخدم",
        "البريد الإلكتروني أو رقم الهاتف",
        "معلومات تسجيل الدخول",
        "رصيد النقاط والأنشطة داخل التطبيق",
        "عنوان IP ونوع الجهاز ونظام التشغيل"
      ]
    },
    {
      title: "2. كيفية استخدام المعلومات",
      icon: UserCheck,
      content: [
        "إنشاء وإدارة حساب المستخدم",
        "تقديم خدمات التطبيق (النقاط، الطلبات، المهام)",
        "تحسين أداء التطبيق وتجربة المستخدم",
        "التواصل مع المستخدمين عبر الإشعارات",
        "الحماية من الاحتيال أو إساءة الاستخدام"
      ]
    },
    {
      title: "3. مشاركة المعلومات",
      icon: Share2,
      content: [
        "نحن لا نقوم ببيع أو تأجير بياناتك الشخصية لأي طرف ثالث.",
        "قد نشارك بعض المعلومات فقط في الحالات التالية:",
        "الامتثال للقوانين أو الطلبات القانونية",
        "حماية حقوق التطبيق أو المستخدمين",
        "تشغيل خدمات ضرورية للتطبيق (مثل الإشعارات)"
      ]
    },
    {
      title: "4. حماية المعلومات",
      icon: Lock,
      content: [
        "نستخدم إجراءات أمنية مناسبة لحماية بياناتك، بما في ذلك:",
        "تشفير كلمات المرور",
        "حماية السيرفرات",
        "تقييد الوصول إلى البيانات",
        "ومع ذلك، لا توجد طريقة نقل عبر الإنترنت آمنة 100%."
      ]
    },
    {
      title: "5. حقوق المستخدم",
      icon: ShieldCheck,
      content: [
        "للمستخدم الحق في:",
        "الوصول إلى بياناته الشخصية",
        "تعديل أو تحديث معلوماته",
        "حذف الحساب (عند التواصل مع الدعم)"
      ]
    },
    {
      title: "6. ملفات تعريف الارتباط (Cookies)",
      icon: Cookie,
      content: [
        "قد يستخدم التطبيق تقنيات مشابهة لتحسين الأداء وتجربة المستخدم."
      ]
    },
    {
      title: "7. خصوصية الأطفال",
      icon: Baby,
      content: [
        "تطبيق فالو عراق غير مخصص للأطفال دون سن 13 عامًا، ولا نقوم بجمع بياناتهم عن قصد."
      ]
    }
  ];

  return (
    <div className={`max-w-4xl mx-auto p-6 ${standalone ? 'min-h-screen bg-slate-50 dark:bg-slate-950 py-12' : 'pb-24 lg:pb-12'}`}>
      <div className="bg-white dark:bg-slate-900 rounded-[50px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden relative">
        {/* Header Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 dark:bg-emerald-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        
        <div className="relative p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-3xl flex items-center justify-center">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-black">سياسة الخصوصية</h1>
                <p className="text-slate-500 mt-1">كيفية تعامل "فالو عراق" مع بياناتك</p>
              </div>
            </div>
            
            {standalone && (
              <button 
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 text-emerald-600 font-bold hover:underline"
              >
                العودة لتسجيل الدخول <ArrowRight size={20} className="rotate-180" />
              </button>
            )}
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none mb-10">
            <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              مرحبًا بك في تطبيق فالو عراق. نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية المعلومات عند استخدامك للتطبيق.
            </p>
          </div>

          <div className="grid gap-10">
            {sections.map((section, idx) => (
              <div key={idx} className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                    <section.icon size={20} />
                  </div>
                  <h2 className="text-xl font-bold">{section.title}</h2>
                </div>
                <div className="pr-11">
                  <ul className="space-y-2">
                    {section.content.map((item, i) => (
                      <li key={i} className="text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-500">آخر تحديث: {new Date().toLocaleDateString('ar-IQ')}</p>
            <p className="text-xs text-slate-400 mt-2">© فالو عراق - جميع الحقوق محفوظة</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
