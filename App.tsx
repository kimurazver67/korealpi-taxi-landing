
import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Car,
  Fuel,
  ShieldCheck,
  Timer,
  PhoneCall,
  TrendingDown,
  ArrowRight,
  MessageSquare,
  Zap,
  ShieldAlert,
  Calendar,
  Layers,
  Sparkles,
  Play,
  Gauge,
  Menu,
  X
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

// --- Types ---
interface CarModel {
  id: string;
  name: string;
  year: string;
  price: string;
  image: string;
  category: string;
  specs: string[];
  power: string;
  fuel: string;
}

// --- Constants ---
const MODELS: CarModel[] = [
  {
    id: 'sonata-dn8',
    name: 'Hyundai Sonata DN8',
    category: 'Комфорт+',
    year: '2019-2022',
    price: 'от 2.1 млн ₽',
    image: 'https://s.auto.drom.ru/i24274/c/photos/fullsize/hyundai/sonata/hyundai_sonata_1096478.jpg',
    specs: ['2.0 LPI (146 л.с.)', 'АКПП 6-ст', 'Smart Sense'],
    power: '146 л.с.',
    fuel: 'LPI Gas'
  },
  {
    id: 'k5-dl3',
    name: 'Kia K5 DL3',
    category: 'Комфорт+',
    year: '2020-2023',
    price: 'от 2.35 млн ₽',
    image: 'https://s.auto.drom.ru/i24248/c/photos/fullsize/kia/k5/kia_k5_965421.jpg',
    specs: ['2.0 LPI (150 л.с.)', 'LED Matrix', 'Digital Cockpit'],
    power: '150 л.с.',
    fuel: 'LPI Gas'
  }
];

const FUEL_DATA = [
  { name: 'Бензин', cost: 55000, color: '#64748b' },
  { name: 'Электро', cost: 28000, color: '#06b6d4' },
  { name: 'LPI Газ', cost: 21000, color: '#ff6b35' },
];

// AmoCRM Webhook URL - ЗАМЕНИТЕ НА СВОЙ URL
const AMOCRM_WEBHOOK_URL = 'https://YOUR_AMOCRM_WEBHOOK_URL';

// Функция отправки заявки в AmoCRM
const sendToAmoCRM = async (data: { name: string; phone: string; telegram: string; source?: string }) => {
  try {
    await fetch(AMOCRM_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        phone: data.phone,
        telegram: data.telegram,
        source: data.source || 'ZMA-AUTO Landing',
        timestamp: new Date().toISOString(),
      }),
    });
    return true;
  } catch (error) {
    console.error('Error sending to AmoCRM:', error);
    return false;
  }
};

// --- Particle Background Component (simplified for mobile) ---
const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();

    // Reduce particles on mobile
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 20 : 40;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 107, 53, ${p.opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-50" />;
};

// --- Components ---

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'py-1' : 'py-2 md:py-3'}`}>
      <div className="max-w-7xl mx-auto px-3 md:px-6">
        <div className={`glass-strong rounded-xl md:rounded-2xl px-3 md:px-6 h-12 md:h-14 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'shadow-xl shadow-black/30' : ''}`}>
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] rounded-lg flex items-center justify-center shadow-lg shadow-[#ff6b35]/20">
              <Car className="text-white w-4 h-4 md:w-5 md:h-5" />
            </div>
            <span className="text-white font-black text-lg md:text-xl tracking-tight">
              ZMA-<span className="text-gradient-fire">AUTO</span>
            </span>
          </div>

          <div className="hidden lg:flex gap-6 text-sm font-semibold text-slate-400">
            {['Дедлайн', 'Преимущества', 'Каталог', 'Процесс'].map((item, i) => (
              <a
                key={i}
                href={`#${['why', 'benefits', 'catalog', 'steps'][i]}`}
                className="hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button className="hidden sm:block bg-white text-slate-950 px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#ff6b35] hover:text-white transition-all">
              Консультация
            </button>
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden glass-strong mt-2 rounded-xl p-4 animate-scale-in">
            <div className="flex flex-col gap-3">
              {['Дедлайн', 'Преимущества', 'Каталог', 'Процесс'].map((item, i) => (
                <a
                  key={i}
                  href={`#${['why', 'benefits', 'catalog', 'steps'][i]}`}
                  className="text-white font-semibold py-2 px-3 rounded-lg hover:bg-white/10 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button className="sm:hidden bg-[#ff6b35] text-white py-3 rounded-lg font-bold mt-2">
                Консультация
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const Hero: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', telegram: '' });

  useEffect(() => {
    setIsVisible(true);
    const deadline = new Date('2026-01-15T23:59:59');
    const timer = setInterval(() => {
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();
      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60),
        secs: Math.floor((diff / 1000) % 60)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] md:min-h-screen pt-20 md:pt-28 pb-12 md:pb-20 flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#ff6b35]/15 rounded-full blur-[100px] md:blur-[150px]" />
        <div className="absolute bottom-[20%] right-[5%] w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-[#00f5ff]/10 rounded-full blur-[80px] md:blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
        {/* Badge */}
        <div className={`inline-flex items-center gap-2 bg-slate-900/60 backdrop-blur-md border border-white/10 px-3 py-1.5 md:px-5 md:py-2 rounded-full mb-6 md:mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs md:text-sm font-bold tracking-wide text-white/90">
            Прием заказов до 15 января
          </span>
        </div>

        {/* Main Heading */}
        <h1 className={`text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 leading-[1.1] tracking-tight transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <span className="text-white">ЛЬГОТНОЕ АВТО</span>{' '}
          <br className="hidden sm:block" />
          <span className="text-gradient-fire">НА ГАЗУ</span>{' '}
          <span className="text-[#ff6b35]">ДЛЯ ТАКСИ</span>
        </h1>

        <p className={`text-sm md:text-lg text-slate-400 mb-8 md:mb-12 max-w-xl mx-auto leading-relaxed px-2 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          Успейте заказать <span className="text-white font-medium">"миллионник"</span> на заводском газу по льготной ставке до закрытия окна
        </p>

        {/* Countdown - Compact for mobile */}
        <div className={`flex justify-center gap-2 md:gap-4 mb-8 md:mb-14 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          {[
            { label: 'Дн', val: timeLeft.days },
            { label: 'Ч', val: timeLeft.hours },
            { label: 'М', val: timeLeft.mins },
            { label: 'С', val: timeLeft.secs }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="glass-strong w-14 h-16 sm:w-16 sm:h-20 md:w-20 md:h-24 rounded-xl md:rounded-2xl flex items-center justify-center">
                <span className="font-mono text-2xl sm:text-3xl md:text-4xl font-black text-white">
                  {String(item.val).padStart(2, '0')}
                </span>
              </div>
              <div className="mt-1.5 md:mt-2 text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-500">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-xl shadow-[#ff6b35]/30 flex items-center justify-center gap-2"
          >
            ПОЛУЧИТЬ РАСЧЕТ
            <ArrowRight size={18} />
          </button>

          <a href="#catalog" className="flex items-center gap-3 text-white font-semibold text-sm md:text-base py-2">
            <div className="w-10 h-10 md:w-12 md:h-12 glass-strong rounded-xl flex items-center justify-center">
              <Play size={16} className="text-[#ff6b35] ml-0.5" />
            </div>
            Каталог
          </a>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div
            className="glass-strong w-full max-w-md rounded-2xl p-6 md:p-8 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {formSubmitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Спасибо за заявку!</h3>
                <p className="text-slate-400 text-sm mb-6">Наш менеджер свяжется с вами в течение 1 часа</p>
                <button
                  onClick={() => { setShowModal(false); setFormSubmitted(false); setFormData({ name: '', phone: '', telegram: '' }); }}
                  className="glass px-6 py-2.5 rounded-xl text-white font-semibold text-sm"
                >
                  Закрыть
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl md:text-2xl font-bold text-white">Получить расчет</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <p className="text-slate-400 text-sm mb-6">
                  Оставьте контакты и мы подберём лучший вариант под ваш бюджет
                </p>

                <form onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSubmitting(true);
                    await sendToAmoCRM({ ...formData, source: 'Hero - Получить расчет' });
                    setIsSubmitting(false);
                    setFormSubmitted(true);
                  }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Имя</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white placeholder:text-slate-500 focus:border-[#ff6b35] outline-none transition-colors"
                      placeholder="Ваше имя"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Телефон</label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white placeholder:text-slate-500 focus:border-[#ff6b35] outline-none transition-colors"
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Telegram ID</label>
                    <input
                      required
                      type="text"
                      value={formData.telegram}
                      onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white placeholder:text-slate-500 focus:border-[#ff6b35] outline-none transition-colors"
                      placeholder="@username"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] text-white py-3.5 rounded-xl font-bold text-base shadow-lg shadow-[#ff6b35]/20 flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                    {!isSubmitting && <ArrowRight size={18} />}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

const ProblemBento: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="why" className="py-12 md:py-24 relative" ref={sectionRef}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-12 gap-6 md:gap-8">

          <div className={`lg:col-span-7 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center gap-2 text-[#ff6b35] font-bold text-xs md:text-sm uppercase tracking-wider mb-4">
              <div className="w-6 h-0.5 bg-[#ff6b35]" />
              Важно
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-4 md:mb-6 leading-tight">
              ОКНО ЗАКРЫВАЕТСЯ
              <br />
              <span className="text-slate-500">ПОЧЕМУ ЭТО ВАЖНО?</span>
            </h2>
            <p className="text-sm md:text-lg text-slate-400 mb-6 md:mb-10 max-w-xl">
              С 1 марта машины без российского VIN-кода не смогут получить лицензию такси.
            </p>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {[
                { icon: <ShieldAlert size={20} />, title: 'Конец лицензиям', color: '#ff6b35' },
                { icon: <TrendingDown size={20} />, title: 'Утильсбор x2', color: '#00f5ff' }
              ].map((item, i) => (
                <div
                  key={i}
                  className="glass-strong p-4 md:p-6 rounded-2xl border-l-2"
                  style={{ borderLeftColor: item.color }}
                >
                  <div
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  >
                    {item.icon}
                  </div>
                  <h4 className="text-sm md:text-lg font-bold text-white">{item.title}</h4>
                </div>
              ))}
            </div>
          </div>

          <div className={`lg:col-span-5 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="glass-strong p-5 md:p-8 rounded-2xl md:rounded-3xl relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <AlertTriangle size={80} />
              </div>

              <div className="relative z-10">
                <div className="text-red-500 font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  Предупреждение
                </div>
                <h3 className="text-xl md:text-2xl font-black mb-4 md:mb-6 text-white">Рынок заполнится "одноразовыми" машинами</h3>
                <ul className="space-y-2.5 md:space-y-3 text-sm">
                  {[
                    'Кредиты под 30%',
                    'Проблемы с запчастями',
                    'Потеря 50% стоимости за 2 года'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-400">
                      <span className="text-red-500">✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10">
                <div className="text-green-400 font-bold text-sm mb-2 flex items-center gap-2">
                  <Sparkles size={16} />
                  РЕШЕНИЕ:
                </div>
                <p className="text-white text-sm md:text-base font-medium">
                  Заказать корейский LPI сейчас — инвестиция на десятилетие.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const BenefitsScroll: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="benefits" className="py-12 md:py-24 relative" ref={sectionRef}>
      <div className="container mx-auto px-4 md:px-6">
        <div className={`mb-8 md:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center gap-2 text-[#ff6b35] font-bold text-xs md:text-sm uppercase tracking-wider mb-3">
            <Zap size={14} />
            Технологии
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black">
            LPI — ЧИСТАЯ
            <span className="text-slate-500"> ВЫГОДА</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {[
            { icon: <Fuel size={24} />, title: 'Экономия 60%', text: 'До 550 000 ₽ экономии в год' },
            { icon: <ShieldCheck size={24} />, title: 'Миллионник', text: 'Заводская поршневая под газ' },
            { icon: <Layers size={24} />, title: 'Заводской Сбор', text: 'Идеальная работа всех систем' }
          ].map((item, i) => (
            <div
              key={i}
              className={`glass-strong p-5 md:p-8 rounded-2xl transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#ff6b35]/10 rounded-xl flex items-center justify-center mb-4 text-[#ff6b35]">
                {item.icon}
              </div>
              <h4 className="text-lg md:text-xl font-bold mb-2 text-white">{item.title}</h4>
              <p className="text-slate-400 text-sm">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Chart Section - Simplified for mobile */}
        <div className={`mt-8 md:mt-16 glass-strong p-5 md:p-8 rounded-2xl transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-col lg:flex-row gap-6 md:gap-10 items-center">
            <div className="lg:w-1/3 w-full">
              <h4 className="text-xl md:text-2xl font-bold mb-2 text-white">Сравнение расходов</h4>
              <p className="text-slate-400 text-sm mb-4">
                При пробеге 8 000 км/мес
              </p>
              <div className="flex items-center gap-2 text-[#ff6b35] font-bold">
                <Zap size={18} />
                <span>Экономия: 34 000 ₽/мес</span>
              </div>
            </div>
            <div className="lg:w-2/3 w-full h-[200px] md:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FUEL_DATA} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={55}
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#12121a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [`${value.toLocaleString()} ₽`, '']}
                  />
                  <Bar dataKey="cost" radius={[0, 8, 8, 0]} barSize={28}>
                    {FUEL_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CatalogSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', telegram: '' });
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="catalog" className="py-12 md:py-24 relative" ref={sectionRef}>
      <div className="container mx-auto px-4 md:px-6">
        <div className={`text-center mb-8 md:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-center gap-2 text-[#ff6b35] font-bold text-xs md:text-sm uppercase tracking-wider mb-3">
            <Car size={14} />
            Каталог
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black">
            АКТУАЛЬНЫЕ <span className="text-gradient-fire">МОДЕЛИ</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          {MODELS.map((car, index) => (
            <div
              key={car.id}
              className={`group glass-strong rounded-2xl overflow-hidden transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />

                {/* Tags */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="bg-[#ff6b35] text-white px-2.5 py-1 rounded-lg text-[10px] md:text-xs font-bold">
                    LPI
                  </span>
                  <span className="bg-white/10 backdrop-blur text-white px-2.5 py-1 rounded-lg text-[10px] md:text-xs font-medium">
                    {car.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 md:p-6">
                <div className="mb-3">
                  <h4 className="text-lg md:text-xl font-bold text-white mb-0.5">{car.name}</h4>
                  <div className="text-slate-500 text-xs font-medium">{car.year}</div>
                </div>

                {/* Stats */}
                <div className="flex gap-3 mb-4 text-xs md:text-sm">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Gauge size={14} className="text-[#ff6b35]" />
                    {car.power}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Fuel size={14} className="text-[#00f5ff]" />
                    {car.fuel}
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div>
                    <div className="text-[10px] text-slate-500 font-medium uppercase">Цена под ключ</div>
                    <div className="text-xl md:text-2xl font-black text-white">{car.price}</div>
                  </div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="w-10 h-10 md:w-12 md:h-12 bg-white text-slate-950 rounded-xl flex items-center justify-center hover:bg-[#ff6b35] hover:text-white transition-colors"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-8 text-center transition-all duration-700 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <a
            href="https://t.me/zma_manager?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%20%D1%85%D0%BE%D1%87%D1%83%20%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D1%82%D1%8C%20%D0%B0%D0%B2%D1%82%D0%BE%20%D0%BD%D0%B0%20%D0%B3%D0%B0%D0%B7%D1%83%20%D0%B8%D0%B7%20%D0%9A%D0%BE%D1%80%D0%B5%D0%B8!"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-strong px-6 py-3 rounded-xl text-sm font-semibold text-white inline-flex items-center gap-2"
          >
            Полный каталог в Telegram
            <ArrowRight size={16} />
          </a>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div
            className="glass-strong w-full max-w-md rounded-2xl p-6 md:p-8 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {formSubmitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Спасибо за заявку!</h3>
                <p className="text-slate-400 text-sm mb-6">Наш менеджер свяжется с вами в течение 1 часа</p>
                <button
                  onClick={() => { setShowModal(false); setFormSubmitted(false); setFormData({ name: '', phone: '', telegram: '' }); }}
                  className="glass px-6 py-2.5 rounded-xl text-white font-semibold text-sm"
                >
                  Закрыть
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl md:text-2xl font-bold text-white">Получить расчет</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <p className="text-slate-400 text-sm mb-6">
                  Оставьте контакты и мы подберём лучший вариант под ваш бюджет
                </p>

                <form onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSubmitting(true);
                    await sendToAmoCRM({ ...formData, source: 'Каталог - Карточка авто' });
                    setIsSubmitting(false);
                    setFormSubmitted(true);
                  }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Имя</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white placeholder:text-slate-500 focus:border-[#ff6b35] outline-none transition-colors"
                      placeholder="Ваше имя"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Телефон</label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white placeholder:text-slate-500 focus:border-[#ff6b35] outline-none transition-colors"
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Telegram ID</label>
                    <input
                      required
                      type="text"
                      value={formData.telegram}
                      onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white placeholder:text-slate-500 focus:border-[#ff6b35] outline-none transition-colors"
                      placeholder="@username"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] text-white py-3.5 rounded-xl font-bold text-base shadow-lg shadow-[#ff6b35]/20 flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                    {!isSubmitting && <ArrowRight size={18} />}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

const StepsTimeline: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', telegram: '' });
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const steps = [
    { step: '01', title: 'Договор', icon: <Calendar size={20} />, desc: 'Фиксация параметров за 48ч' },
    { step: '02', title: 'Доставка', icon: <Clock size={20} />, desc: 'Морем за 4 дня' },
    { step: '03', title: 'Таможня', icon: <ShieldCheck size={20} />, desc: 'ЭПТС + СБКТС за наш счет' },
    { step: '04', title: 'Выдача', icon: <CheckCircle2 size={20} />, desc: 'Получение в вашем городе' }
  ];

  return (
    <section id="steps" className="py-12 md:py-24 relative" ref={sectionRef}>
      <div className="container mx-auto px-4 md:px-6">
        <div className={`text-center mb-8 md:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-center gap-2 text-[#ff6b35] font-bold text-xs md:text-sm uppercase tracking-wider mb-3">
            <Timer size={14} />
            Процесс
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black">
            ЭТАПЫ <span className="text-[#ff6b35]">УСПЕХА</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className={`glass-strong p-4 md:p-6 rounded-2xl relative transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="absolute -top-2 -right-2 w-8 h-8 md:w-10 md:h-10 bg-[#ff6b35] rounded-lg flex items-center justify-center font-mono text-xs md:text-sm font-bold text-white">
                {item.step}
              </div>

              <div className="w-10 h-10 md:w-12 md:h-12 glass rounded-xl flex items-center justify-center mb-3 text-[#ff6b35]">
                {item.icon}
              </div>

              <h4 className="text-sm md:text-base font-bold text-white mb-1">{item.title}</h4>
              <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Guarantee Banner */}
        <div className={`mt-8 md:mt-16 glass-strong p-6 md:p-10 rounded-2xl text-center transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-full mb-4">
            <ShieldCheck className="text-green-400" size={16} />
            <span className="text-green-400 font-bold text-xs uppercase">Гарантия</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black mb-3 text-white">СТРАХОВКА ДЕДЛАЙНА</h3>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto mb-6">
            Не успели до 1 марта по нашей вине? <span className="text-white font-medium">Полный возврат комиссии и доставки.</span>
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-slate-950 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-sm md:text-base hover:bg-[#ff6b35] hover:text-white transition-colors"
          >
            ЗАБРОНИРОВАТЬ
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div
            className="glass-strong w-full max-w-md rounded-2xl p-6 md:p-8 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {formSubmitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Спасибо за заявку!</h3>
                <p className="text-slate-400 text-sm mb-6">Наш менеджер свяжется с вами в течение 1 часа</p>
                <button
                  onClick={() => { setShowModal(false); setFormSubmitted(false); setFormData({ name: '', phone: '', telegram: '' }); }}
                  className="glass px-6 py-2.5 rounded-xl text-white font-semibold text-sm"
                >
                  Закрыть
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl md:text-2xl font-bold text-white">Забронировать авто</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <p className="text-slate-400 text-sm mb-6">
                  Оставьте контакты и мы подберём лучший вариант под ваш бюджет
                </p>

                <form onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSubmitting(true);
                    await sendToAmoCRM({ ...formData, source: 'Этапы - Забронировать' });
                    setIsSubmitting(false);
                    setFormSubmitted(true);
                  }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Имя</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white placeholder:text-slate-500 focus:border-[#ff6b35] outline-none transition-colors"
                      placeholder="Ваше имя"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Телефон</label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white placeholder:text-slate-500 focus:border-[#ff6b35] outline-none transition-colors"
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Telegram ID</label>
                    <input
                      required
                      type="text"
                      value={formData.telegram}
                      onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white placeholder:text-slate-500 focus:border-[#ff6b35] outline-none transition-colors"
                      placeholder="@username"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] text-white py-3.5 rounded-xl font-bold text-base shadow-lg shadow-[#ff6b35]/20 flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                    {!isSubmitting && <ArrowRight size={18} />}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

const ModernLeadForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', model: 'Sonata DN8' });
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-12 md:py-24" ref={sectionRef}>
      <div className="container mx-auto px-4 md:px-6">
        <div className={`glass-strong rounded-2xl overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-col lg:flex-row">
            {/* Left Side */}
            <div className="lg:w-[40%] p-6 md:p-10 bg-gradient-to-br from-slate-900/80 to-slate-900/40">
              <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight">
                ГОТОВЫ К
                <span className="text-gradient-fire"> МАСШТАБИРОВАНИЮ?</span>
              </h2>
              <div className="space-y-3 text-sm">
                {[
                  'Подбор под бюджет',
                  'Видео-отчет из Кореи',
                  'Фиксация стоимости'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-white">
                    <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:w-[60%] p-6 md:p-10">
              {submitted ? (
                <div className="text-center py-8 animate-scale-in">
                  <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">Спасибо за заявку!</h3>
                  <p className="text-slate-400 text-sm">Наш менеджер свяжется с вами в течение 1 часа</p>
                </div>
              ) : (
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSubmitting(true);
                    await sendToAmoCRM({
                      name: formData.name,
                      phone: formData.phone,
                      telegram: formData.model,
                      source: 'Форма внизу - Получить расчет'
                    });
                    setIsSubmitting(false);
                    setSubmitted(true);
                  }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm text-white placeholder:text-slate-500 focus:border-[#ff6b35] outline-none"
                      placeholder="Имя"
                    />
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm text-white placeholder:text-slate-500 focus:border-[#ff6b35] outline-none"
                      placeholder="Телефон"
                    />
                  </div>
                  <select
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm text-white focus:border-[#ff6b35] outline-none"
                  >
                    <option className="bg-slate-900" value="Sonata DN8">Sonata DN8</option>
                    <option className="bg-slate-900" value="Kia K5">Kia K5</option>
                    <option className="bg-slate-900" value="Консультация">Консультация</option>
                  </select>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] text-white py-3.5 rounded-xl font-bold text-base shadow-lg shadow-[#ff6b35]/20 disabled:opacity-50"
                  >
                    {isSubmitting ? 'ОТПРАВКА...' : 'ПОЛУЧИТЬ РАСЧЕТ'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FloatingIsland: React.FC = () => {
  const [active, setActive] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] flex flex-col items-end">
      {active && (
        <div className="glass-strong w-[280px] md:w-[300px] rounded-2xl mb-3 p-5 shadow-2xl animate-scale-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#ff6b35] rounded-xl flex items-center justify-center">
              <MessageSquare size={18} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Юрий Котов</div>
              <div className="text-xs text-slate-400">Online</div>
            </div>
          </div>
          <p className="text-slate-300 text-xs mb-4">
            Осталось 3 квоты до 1 марта. Какую модель рассчитаем?
          </p>
          <div className="space-y-2">
            <button className="w-full bg-white text-slate-950 py-2.5 rounded-lg text-xs font-bold hover:bg-[#ff6b35] hover:text-white transition-colors">
              Спецификации LPI
            </button>
            <button className="w-full glass py-2.5 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-2">
              <PhoneCall size={14} />
              WhatsApp
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setActive(!active)}
        className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-xl transition-all ${active ? 'bg-[#ff6b35]' : 'bg-white'}`}
      >
        <MessageSquare size={20} className={active ? 'text-white' : 'text-slate-950'} />
        {!active && <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#ff6b35] rounded-full animate-pulse" />}
      </button>
    </div>
  );
};

const Footer: React.FC = () => (
  <footer className="py-8 md:py-12 border-t border-white/5">
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#ff6b35] rounded-lg flex items-center justify-center">
            <Car className="text-white w-4 h-4" />
          </div>
          <span className="text-white font-bold text-lg">
            ZMA-<span className="text-[#ff6b35]">AUTO</span>
          </span>
        </div>

        <div className="flex gap-6 text-xs text-slate-500">
          {['Политика', 'Оферта', 'Контакты'].map((item, i) => (
            <a key={i} href="#" className="hover:text-white transition-colors">{item}</a>
          ))}
        </div>

        <div className="text-slate-600 text-xs text-center md:text-right">
          © 2024-2025 ZMA-AUTO
        </div>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
    <div className="min-h-screen selection:bg-[#ff6b35] selection:text-white bg-mesh">
      <ParticleBackground />
      <Navbar />
      <Hero />
      <ProblemBento />
      <BenefitsScroll />
      <CatalogSection />
      <StepsTimeline />
      <ModernLeadForm />
      <Footer />
      <FloatingIsland />
    </div>
  );
};

export default App;
