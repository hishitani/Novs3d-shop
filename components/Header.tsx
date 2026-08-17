import React from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  Box, 
  Layers,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { Category } from '../types';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  onToggleFilters?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  cartCount,
  cartTotal,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  isAdminOpen,
  setIsAdminOpen,
  onToggleFilters
}) => {
  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: 'Все товары' },
    { id: 'headphones', label: 'Наушники' },
    { id: 'smartphones', label: 'Смартфоны' },
    { id: 'wearables', label: 'Смарт-часы' },
    { id: 'smart-home', label: 'Умный дом' },
    { id: 'accessories', label: 'Гаджеты & 3D' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl transition-all">
      {/* Top Banner Announcement */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-slate-900 text-slate-300 text-xs py-1.5 px-4 text-center border-b border-indigo-500/20 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
        <span>Новая коллекция 2026 с 3D-просмотром! Промокод <strong className="text-indigo-300 font-mono">NOVA2026</strong> — скидка 15%</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsAdminOpen(false)}>
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Box className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                  NOVA<span className="text-indigo-400">3D</span>
                </span>
                <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                  STORE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Магазин электроники & 3D моделей</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию, 3D гаджетам, категориям..."
                className="w-full bg-slate-900/90 hover:bg-slate-900 border border-slate-800 focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 text-sm text-slate-100 placeholder-slate-500 rounded-xl pl-10 pr-9 py-2 transition-all outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Filter toggle mobile */}
            {onToggleFilters && (
              <button
                onClick={onToggleFilters}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white md:hidden"
                title="Фильтры"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            )}

            {/* Admin Toggle */}
            <button
              onClick={() => setIsAdminOpen(!isAdminOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isAdminOpen
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">
                {isAdminOpen ? 'Выход из админки' : 'Админ-панель'}
              </span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-pink-400 hover:border-slate-700 transition-all"
              title="Избранное"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-pink-600 text-white text-[10px] font-bold flex items-center justify-center animate-bounce shadow-md">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white text-indigo-950 text-[10px] font-extrabold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-none">
                <span className="text-[10px] text-indigo-200 uppercase font-semibold">Корзина</span>
                <span className="text-xs font-bold text-white">
                  {cartTotal.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по каталогу..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 text-sm text-slate-100 placeholder-slate-500 rounded-xl pl-10 pr-9 py-2 outline-none"
            />
          </div>
        </div>

        {/* Categories Nav Scrollbar */}
        {!isAdminOpen && (
          <nav className="mt-3 pt-2 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};
