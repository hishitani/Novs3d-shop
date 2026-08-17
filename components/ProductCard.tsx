import React, { useState } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Box, 
  Eye, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { Product } from '../types';
import { Card3DTilt } from './Card3DTilt';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpenQuickView: (product: Product) => void;
  onOpen3DViewer: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onOpenQuickView,
  onOpen3DViewer
}) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const discountPercent = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : 0;

  return (
    <Card3DTilt className="h-full">
      <div 
        onClick={() => onOpenQuickView(product)}
        className="group relative h-full flex flex-col justify-between bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/80 hover:border-indigo-500/50 rounded-2xl p-4 shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer overflow-hidden"
      >
        {/* Background glow effect on hover */}
        <div className="absolute -inset-px bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-cyan-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/10 group-hover:to-cyan-500/10 rounded-2xl transition-all duration-500 pointer-events-none" />

        <div>
          {/* Top Badges & Wishlist Button */}
          <div className="flex items-center justify-between mb-3 z-10 relative">
            <div className="flex flex-wrap gap-1.5">
              {product.isNew && (
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  NEW
                </span>
              )}
              {product.isPopular && (
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> ХИТ
                </span>
              )}
              {discountPercent > 0 && (
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  -{discountPercent}%
                </span>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product);
              }}
              className={`p-2 rounded-xl transition-all ${
                isWishlisted
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
              title={isWishlisted ? 'Убрать из избранного' : 'Добавить в избранное'}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-400' : ''}`} />
            </button>
          </div>

          {/* Product Image Container */}
          <div className="relative w-full aspect-square rounded-xl bg-slate-950/60 border border-slate-800/60 overflow-hidden mb-4 flex items-center justify-center p-3 group-hover:border-slate-700/80 transition-all">
            <img
              src={product.image}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
            />

            {/* Hover Action Overlays */}
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen3DViewer(product);
                }}
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all hover:scale-105"
              >
                <Box className="w-4 h-4 animate-bounce" />
                <span>3D Обзор</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenQuickView(product);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all hover:scale-105"
                title="Быстрый просмотр"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Title & Category */}
          <span className="text-[11px] font-medium text-indigo-400 uppercase tracking-wider block mb-1">
            {product.categoryLabel}
          </span>
          <h3 className="font-semibold text-slate-100 text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-indigo-200 transition-colors mb-2">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3 text-xs">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="ml-1 font-bold text-slate-200">{product.rating}</span>
            </div>
            <span className="text-slate-500">({product.reviewCount} отзывов)</span>
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto z-10 relative">
          <div>
            {product.oldPrice && (
              <span className="text-xs text-slate-500 line-through block leading-none">
                {product.oldPrice.toLocaleString('ru-RU')} ₽
              </span>
            )}
            <span className="text-base sm:text-lg font-extrabold text-white tracking-tight">
              {product.price.toLocaleString('ru-RU')} ₽
            </span>
          </div>

          <button
            onClick={handleAdd}
            className={`px-3 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-md ${
              isAdded
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>В корзине</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Купить</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Card3DTilt>
  );
};
