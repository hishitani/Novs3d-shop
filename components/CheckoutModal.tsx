import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  CreditCard, 
  QrCode, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  Download, 
  Sparkles, 
  Lock,
  ArrowLeft,
  Smartphone,
  Copy,
  Check
} from 'lucide-react';
import { CartItem, CustomerInfo, DeliveryMethod, Order, PaymentDetails, PaymentMethod, PromoCode } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedPromo: PromoCode | null;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedPromo,
  onOrderSuccess
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details');

  // Customer State
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: 'Александр Смирнов',
    phone: '+7 (999) 123-45-67',
    email: 'alex.smirnov@example.com',
    city: 'Москва',
    address: 'ул. Тверская, д. 12, кв. 45',
    comment: 'Позвонить за 30 минут до приезда'
  });

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('courier');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  // Payment Details State
  const [card, setCard] = useState<PaymentDetails>({
    cardNumber: '2202 2000 1234 5678',
    cardHolder: 'ALEXANDER SMIRNOV',
    expiryDate: '12/28',
    cvv: '777'
  });

  // Success Order State
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Totals
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = appliedPromo 
    ? Math.round((subtotal * appliedPromo.discountPercent) / 100) 
    : 0;
  const shippingFee = subtotal >= 30000 || items.length === 0 ? 0 : 490;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const fillDemoData = () => {
    setCustomer({
      name: 'Екатерина Васильева',
      phone: '+7 (916) 789-01-23',
      email: 'ekaterina.v@example.com',
      city: 'Санкт-Петербург',
      address: 'Невский проспект, д. 88, кв. 14',
      comment: 'Оставить у двери при отсутствии'
    });
    setCard({
      cardNumber: '2200 7012 3456 7890',
      cardHolder: 'EKATERINA VASILIEVA',
      expiryDate: '08/29',
      cvv: '321'
    });
  };

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');

    // Simulate payment gateway delay
    setTimeout(() => {
      const trackingCode = `NV-${Math.floor(100000 + Math.random() * 900000)}`;
      
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        items: [...items],
        totalAmount: subtotal,
        discountAmount,
        shippingFee,
        finalAmount: grandTotal,
        status: 'paid',
        paymentMethod,
        deliveryMethod,
        customer,
        trackingNumber: trackingCode
      };

      setCompletedOrder(newOrder);
      onOrderSuccess(newOrder);
      setStep('success');

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log('Confetti error:', err);
      }
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-lg flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">
              {step === 'success' ? 'Заказ успешно оплачен!' : 'Безопасное оформление заказа'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {step === 'details' && (
              <button
                type="button"
                onClick={fillDemoData}
                className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-[11px] font-semibold border border-indigo-500/30"
              >
                Тестовое заполнение
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STEP 1: CUSTOMER & DELIVERY DETAILS */}
        {step === 'details' && (
          <form onSubmit={() => setStep('payment')} className="p-4 sm:p-6 space-y-6">
            
            {/* Delivery Method Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase">Способ доставки</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('courier')}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    deliveryMethod === 'courier'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500/40'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Truck className="w-5 h-5 text-indigo-400" />
                  <span>Курьер (до двери)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    deliveryMethod === 'pickup'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500/40'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Пункт СДЭК / Я.Маркет</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('post')}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    deliveryMethod === 'post'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500/40'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Почта России</span>
                </button>
              </div>
            </div>

            {/* Address fields */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase">Данные получателя</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="ФИО получателя"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                />
                <input
                  type="tel"
                  required
                  placeholder="Телефон (+7...)"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="email"
                  required
                  placeholder="Email для чека"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  required
                  placeholder="Город"
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  required
                  placeholder="Улица, дом, квартира"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Total Summary Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">К оплате:</span>
                <span className="text-xl font-extrabold text-white">{grandTotal.toLocaleString('ru-RU')} ₽</span>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
              >
                Далее к выбору оплаты →
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: PAYMENT METHOD SELECTION & GATEWAY */}
        {step === 'payment' && (
          <form onSubmit={handleStartPayment} className="p-4 sm:p-6 space-y-6">
            
            {/* Back Button */}
            <button
              type="button"
              onClick={() => setStep('details')}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Назад к доставке</span>
            </button>

            {/* Payment Systems selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase">Выберите платежную систему</label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500/40'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-indigo-400" />
                  <span>Банковская карта</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('sbp')}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'sbp'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500/40'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-400" />
                  <span>СБП (QR-код)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('sberpay')}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'sberpay'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500/40'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-emerald-500" />
                  <span>SberPay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'cash'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500/40'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Truck className="w-5 h-5 text-amber-400" />
                  <span>При получении</span>
                </button>
              </div>
            </div>

            {/* IF PAYMENT METHOD: CARD */}
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                {/* 3D Credit Card Preview */}
                <div className="w-full h-44 rounded-2xl bg-gradient-to-tr from-indigo-900 via-purple-900 to-slate-900 border border-indigo-500/30 p-5 shadow-2xl flex flex-col justify-between text-white relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-7 rounded bg-amber-400/80 border border-amber-300 flex items-center justify-center text-[8px] font-mono font-bold text-slate-950">
                      CHIP
                    </div>
                    <span className="text-xs font-extrabold tracking-widest text-indigo-300">
                      МИР / VISA
                    </span>
                  </div>

                  <div className="font-mono text-lg tracking-widest font-bold">
                    {card.cardNumber || '•••• •••• •••• ••••'}
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Держатель</span>
                      <span className="font-semibold">{card.cardHolder || 'NAME SURNAME'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Срок</span>
                      <span className="font-semibold">{card.expiryDate || 'MM/YY'}</span>
                    </div>
                  </div>
                </div>

                {/* Card input fields */}
                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    maxLength={19}
                    placeholder="Номер карты (2202...)"
                    value={card.cardNumber}
                    onChange={(e) => setCard({ ...card, cardNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-indigo-500"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Имя на карте"
                      value={card.cardHolder}
                      onChange={(e) => setCard({ ...card, cardHolder: e.target.value.toUpperCase() })}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        maxLength={5}
                        placeholder="MM/YY"
                        value={card.expiryDate}
                        onChange={(e) => setCard({ ...card, expiryDate: e.target.value })}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white text-center outline-none focus:border-indigo-500"
                      />
                      <input
                        type="password"
                        required
                        maxLength={3}
                        placeholder="CVC/CVV"
                        value={card.cvv}
                        onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white text-center outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* IF PAYMENT METHOD: SBP (QR Code) */}
            {paymentMethod === 'sbp' && (
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
                <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center">
                  {/* Simulated QR Code Canvas */}
                  <div className="w-full h-full border-4 border-slate-900 rounded-xl p-2 grid grid-cols-6 gap-1 bg-slate-950">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-xs ${
                          (i * 7) % 3 === 0 ? 'bg-indigo-500' : (i * 3) % 2 === 0 ? 'bg-white' : 'bg-slate-900'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Сканируйте QR-код в приложении вашего банка</h4>
                  <p className="text-xs text-slate-400">СберБанк, Т-Банк, ВТБ, Альфа-Банк или Райффайзен</p>
                </div>
              </div>
            )}

            {/* IF PAYMENT METHOD: SBERPAY / CASH */}
            {(paymentMethod === 'sberpay' || paymentMethod === 'tpay') && (
              <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-center space-y-3">
                <Smartphone className="w-10 h-10 text-emerald-400 mx-auto animate-pulse" />
                <h4 className="text-sm font-bold text-emerald-300">Быстрая оплата через мобильный банк</h4>
                <p className="text-xs text-slate-300">После нажатия "Оплатить" вам откроется пуш-уведомление банка.</p>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-center space-y-3">
                <Truck className="w-10 h-10 text-amber-400 mx-auto" />
                <h4 className="text-sm font-bold text-amber-300">Оплата при вручении курьеру</h4>
                <p className="text-xs text-slate-300">Вы сможете проверить товар при курьере и оплатить наличными или картой.</p>
              </div>
            )}

            {/* Pay Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Lock className="w-4 h-4" />
              <span>Оплатить {grandTotal.toLocaleString('ru-RU')} ₽</span>
            </button>
          </form>
        )}

        {/* STEP 3: PROCESSING SIMULATION */}
        {step === 'processing' && (
          <div className="p-12 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-indigo-400 animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Обработка платежа в шлюзе...</h3>
              <p className="text-xs text-slate-400">Проверяем статус и формируем кассовый чек</p>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS RECEIPT */}
        {step === 'success' && completedOrder && (
          <div className="p-6 space-y-6">
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-white">Спасибо за покупку!</h3>
              <p className="text-xs text-slate-400">
                Номер вашего трек-кода: <strong className="text-indigo-300 font-mono">{completedOrder.trackingNumber}</strong>
              </p>
            </div>

            {/* Electronic Invoice Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-3 font-mono">
              <div className="flex justify-between pb-2 border-b border-slate-800 text-slate-400">
                <span>Чек № {completedOrder.id}</span>
                <span>{completedOrder.date}</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 block">Состав заказа:</span>
                {completedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-200">
                    <span className="line-clamp-1 flex-1">{item.product.title} x{item.quantity}</span>
                    <span>{(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between text-white font-bold text-sm">
                <span>Итого оплачено:</span>
                <span className="text-emerald-400">{completedOrder.finalAmount.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg"
            >
              Вернуться в магазин
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
