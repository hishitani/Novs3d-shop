import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  Tag, 
  ArrowRight, 
  CheckCircle2, 
  Truck,
  Sparkles 
} from 'lucide-react';
import { CartItem, PromoCode } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  appliedPromo: PromoCode | null;
  onApplyPromo: (code: string) => boolean;
  onRemovePromo: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  appliedPromo,
  onApplyPromo,
  onRemovePromo
}) => {
  if (!isOpen) return null;

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  const discountAmount = appliedPromo 
    ? Math.round((subtotal * appliedPromo.discountPercent) / 100) 
    : 0;

  const freeShippingThreshold = 30000;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingFee = subtotal >= freeShippingThreshold || items.length === 0 ? 0 : 490;

  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    if (!promoInput.trim()) return;

    const success = onApplyPromo(promoInput.trim());
    if (success) {
      setPromoSuccess(`Промокод применен!`);
      setPromoInput('');
    } else {
      setPromoError('Недействительный промокод. Попробуйте NOVA2026 или 3DSTART');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Корзина ({items.reduce((a, b) => a + b.quantity, 0)})</h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping progress */}
          {items.length > 0 && (
            <div className="p-4 bg-slate-950/60 border-b border-slate-800/80 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <Truck className="w-4 h-4 text-indigo-400" />
                  {remainingForFreeShipping === 0 
                    ? 'Вам доступна бесплатная доставка!' 
                    : `До бесплатной доставки: ${remainingForFreeShipping.toLocaleString('ru-RU')} ₽`}
                </span>
                <span className="font-bold text-indigo-400">{progressToFreeShipping}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-3xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-200">Ваша корзина пуста</h3>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Выберите интересные товары из каталога с 3D просмотром!
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Перейти к покупкам
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3 hover:border-slate-700 transition-all"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-contain rounded-xl bg-slate-900 p-1 border border-slate-800"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-slate-100 line-clamp-1">
                      {item.product.title}
                    </h4>
                    <span className="text-xs font-extrabold text-indigo-300 block mt-0.5">
                      {item.product.price.toLocaleString('ru-RU')} ₽
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 text-slate-300 hover:text-white flex items-center justify-center font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 text-slate-300 hover:text-white flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors ml-auto"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 space-y-4">
              
              {/* Promo code form */}
              {appliedPromo ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-xs">
                  <div className="flex items-center gap-2 text-indigo-300">
                    <Tag className="w-4 h-4" />
                    <span className="font-bold">{appliedPromo.code}</span>
                    <span className="text-slate-400">(-{appliedPromo.discountPercent}%)</span>
                  </div>
                  <button
                    onClick={onRemovePromo}
                    className="text-slate-400 hover:text-rose-400 font-semibold"
                  >
                    Сбросить
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCode} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Промокод (например: NOVA2026)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all"
                    >
                      Применить
                    </button>
                  </div>
                  {promoError && <p className="text-[11px] text-rose-400">{promoError}</p>}
                  {promoSuccess && <p className="text-[11px] text-emerald-400">{promoSuccess}</p>}
                </form>
              )}

              {/* Price Calculation Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Сумма товаров:</span>
                  <span>{subtotal.toLocaleString('ru-RU')} ₽</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-indigo-300">
                    <span>Скидка по промокоду:</span>
                    <span>-{discountAmount.toLocaleString('ru-RU')} ₽</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-slate-400">Доставка:</span>
                  <span>{shippingFee === 0 ? 'Бесплатно' : `${shippingFee} ₽`}</span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                  <span>Итого к оплате:</span>
                  <span className="text-indigo-400">{grandTotal.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span>Оформить заказ и оплатить</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
