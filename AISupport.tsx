
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, BrainCircuit, Sparkles, User, Bot, AlertTriangle } from 'lucide-react';

const AISupport: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'أهلاً بك! أنا مساعد فالو عراق الذكي. كيف يمكنني مساعدتك في تطوير حساباتك اليوم؟' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMessage = prompt;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setPrompt('');
    setLoading(true);

    try {
      // الحماية من أخطاء عدم توفر مفتاح الـ API
      const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
      
      if (!apiKey) {
        setMessages(prev => [...prev, { role: 'ai', text: 'عذراً، محرك الذكاء الاصطناعي غير مفعل حالياً. يرجى مراجعة الإعدادات.' }]);
        setLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey: apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `أنت خبير تسويق إلكتروني وتواصل اجتماعي عراقي لمنصة "فالو عراق". 
          ساعد المستخدمين في استراتيجيات زيادة المتابعين والتفاعل. 
          اجعل إجاباتك باللهجة العراقية المهذبة أو العربية الفصحى البسيطة. 
          ركز على النصائح العملية في إنستغرام وتيك توك وفيسبوك.`,
        }
      });

      setMessages(prev => [...prev, { role: 'ai', text: response.text || 'عذراً، لم أستطع فهم ذلك.' }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: 'حدث خطأ في الاتصال بالسيرفر، يرجى المحاولة لاحقاً.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-200px)] flex flex-col pb-24 lg:pb-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
          <BrainCircuit size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold">مستشارك الذكي</h2>
          <p className="text-xs text-slate-500">خبير نمو الحسابات المدعوم بالذكاء الاصطناعي</p>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-6 overflow-y-auto space-y-4 mb-4">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
              m.role === 'user' 
                ? 'bg-slate-100 dark:bg-slate-800 rounded-tr-none' 
                : 'bg-indigo-600 text-white rounded-tl-none'
            }`}>
              <div className="flex items-center gap-2 mb-1 opacity-70 text-[10px] font-bold">
                {m.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                {m.role === 'user' ? 'أنت' : 'فالو AI'}
              </div>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-end">
            <div className="bg-indigo-600/10 p-4 rounded-3xl flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="اسأل الخبير عن أي شيء..."
          className="w-full bg-white dark:bg-slate-900 border-none rounded-3xl p-5 pr-6 pl-20 shadow-xl focus:ring-2 focus:ring-indigo-600 outline-none"
        />
        <button 
          onClick={handleSend}
          disabled={loading || !prompt.trim()}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default AISupport;
