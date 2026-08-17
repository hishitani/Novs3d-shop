import React, { useState } from 'react';
import { 
  Box, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Headphones, 
  Send, 
  CheckCircle2 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs mt-16">
      
      {/* Advantages Banner */}
      <div className="border-b border-slate-800/60 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200 text-sm">Быстрая доставка</h4>
              <p className="text-slate-400 text-[11px]">По всей России СДЭК и Я.Маркет</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200 text-sm">Гарантия качества</h4>
              <p className="text-slate-400 text-[11px]">12 месяцев на все гаджеты</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200 text-sm">Легкий возврат</h4>
              <p className="text-slate-400 text-[11px]">14 дней на обмен без проблем</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200 text-sm">Поддержка 24/7</h4>
              <p className="text-slate-400 text-[11px]">Консультация экспертов</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Col 1: Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Box className="w-6 h-6 text-indigo-400" />
            <span className="font-extrabold text-lg text-white">NOVA<span className="text-indigo-400">3D</span> STORE</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Интернет-магазин электроники с интерактивным 3D-просмотром товаров, удобной корзиной и моментальной оплатой через СБП, SberPay и банковские карты.
          </p>
        </div>

        {/* Col 2: Navigation */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-200 uppercase text-[11px] tracking-wider mb-3">Каталог</h4>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Беспроводные наушники</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Флагманские смартфоны</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Умные часы и фитнес</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Устройства Умного Дома</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">VR Очки & Дроны</a></li>
          </ul>
        </div>

        {/* Col 3: Customer Care */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-200 uppercase text-[11px] tracking-wider mb-3">Покупателям</h4>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Способы оплаты и СБП</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Условия доставки СДЭК</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Отслеживание заказа</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Гарантия и сервисный центр</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Панель управления для админа</a></li>
          </ul>
        </div>

        {/* Col 4: Newsletter */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-200 uppercase text-[11px] tracking-wider">Подписка на акции</h4>
          <p className="text-slate-400 text-[11px]">Получите скидку 10% на первый заказ и эксклюзивные 3D-новинки!</p>
          
          <form onSubmit={handleSubscribe} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Ваш Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 flex-1"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            {subscribed && (
              <p className="text-emerald-400 text-[11px] flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Вы успешно подписаны!
              </p>
            )}
          </form>
        </div>

      </div>

      {/* Copyright & Payment Badges */}
      <div className="border-t border-slate-900 bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 Nova3D Store. Все права защищены.</p>

          <div className="flex items-center gap-3 font-mono font-bold text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">МИР</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400">СБП</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">VISA</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-300">SberPay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
