import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Box, 
  Check, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  MessageSquare,
  List
} from 'lucide-react';
import { Product } from '../types';
import { ThreeProductViewer } from './ThreeProductViewer';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  initialTab?: '3d' | 'details' | 'specs' | 'reviews';
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  initialTab = 'details'
}) => {
  if (!product) return null;

  const [activeTab, setActiveTab] = useState<'3d' | 'details' | 'specs' | 'reviews'>(initialTab);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // New review form state
  const [newComment, setNewComment] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [reviewsList, setReviewsList] = useState(product.reviews || []);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !newAuthor.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      author: newAuthor,
      rating: newRating,
      date: new Date().toLocaleDateString('ru-RU'),
      comment: newComment,
      verified: true
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewComment('');
    setNewAuthor('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-950/60">
          <div>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block">
              {product.categoryLabel}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white line-clamp-1">
              {product.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-950/80 border-b border-slate-800 overflow-x-auto no-scrollbar px-4 sm:px-6">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'details' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Обзор товара</span>
          </button>

          <button
            onClick={() => setActiveTab('3d')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === '3d' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Box className="w-4 h-4 text-indigo-300 animate-pulse" />
            <span>3D Модель (WebGL)</span>
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'specs' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-4 h-4" />
            <span>Характеристики</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'reviews' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Отзывы ({reviewsList.length})</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: 3D MODEL VIEWER */}
          {activeTab === '3d' && (
            <div className="space-y-4">
              <ThreeProductViewer
                shapePreset={product.shapePreset}
                primaryColor={product.primaryColor}
                accentColor={product.accentColor}
                productName={product.title}
                height="h-96"
              />
              <p className="text-xs text-slate-400 text-center">
                Используйте мышь или сенсорный экран, чтобы изучить модель со всех сторон.
              </p>
            </div>
          )}

          {/* TAB 2: DETAILS */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="max-h-72 object-contain drop-shadow-2xl"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-slate-500">({product.reviewCount} отзывов)</span>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    В наличии ({product.inStock} шт.)
                  </span>
                </div>

                <div className="text-2xl font-extrabold text-white flex items-baseline gap-3">
                  <span>{product.price.toLocaleString('ru-RU')} ₽</span>
                  {product.oldPrice && (
                    <span className="text-sm text-slate-500 line-through font-normal">
                      {product.oldPrice.toLocaleString('ru-RU')} ₽
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {product.description}
                </p>

                {/* Micro guarantees */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <Truck className="w-4 h-4 text-indigo-400" />
                    <span>Быстрая доставка СДЭК / Я.Маркет</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Гарантия 12 месяцев</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SPECS */}
          {activeTab === 'specs' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white mb-2">Технические характеристики</h3>
              <div className="divide-y divide-slate-800 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
                {product.specs.map((spec, i) => (
                  <div key={i} className="grid grid-cols-2 p-3 text-xs">
                    <span className="text-slate-400 font-medium">{spec.name}</span>
                    <span className="text-slate-200 font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Add review form */}
              <form onSubmit={handleAddReview} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase">Оставить отзыв о товаре</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Ваше имя"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
                    <span className="text-xs text-slate-400 mr-2">Оценка:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        onClick={() => setNewRating(star)}
                        className={`w-4 h-4 cursor-pointer ${
                          star <= newRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <textarea
                  required
                  rows={2}
                  placeholder="Напишите ваш отзыв..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
                >
                  Опубликовать отзыв
                </button>
              </form>

              {/* Reviews list */}
              <div className="space-y-3">
                {reviewsList.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">
                    Пока нет отзывов. Будьте первым!
                  </p>
                ) : (
                  reviewsList.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{rev.author}</span>
                          {rev.verified && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                              Проверенная покупка
                            </span>
                          )}
                        </div>
                        <span className="text-slate-500">{rev.date}</span>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400' : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Checkout Bar */}
        <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold flex items-center justify-center hover:bg-slate-700"
            >
              -
            </button>
            <span className="w-8 text-center text-sm font-bold text-white">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold flex items-center justify-center hover:bg-slate-700"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex-1 py-3 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl active:scale-98 ${
              isAdded
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-5 h-5" />
                <span>Добавлено в корзину ({quantity} шт.)</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                <span>Добавить в корзину — {(product.price * quantity).toLocaleString('ru-RU')} ₽</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
