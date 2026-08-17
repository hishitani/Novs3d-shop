import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Sparkles, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  Tag, 
  RefreshCw, 
  Check, 
  Box, 
  Search, 
  Layers, 
  X, 
  AlertTriangle,
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react';
import { Category, Order, OrderStatus, Product, PromoCode, Shape3DPreset } from '../types';
import { generateProductDescriptionAI } from '../services/aiService';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  promoCodes: PromoCode[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onAddPromoCode: (promo: PromoCode) => void;
  onDeletePromoCode: (code: string) => void;
  onResetData: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  promoCodes,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onAddPromoCode,
  onDeletePromoCode,
  onResetData
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'promos' | 'settings'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Product Edit/Add Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Form State for Product Creation / Edit
  const [formProduct, setFormProduct] = useState<Partial<Product>>({
    title: '',
    category: 'headphones',
    categoryLabel: 'Наушники & Звук',
    price: 9990,
    oldPrice: 12990,
    rating: 5.0,
    reviewCount: 1,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    description: '',
    specs: [{ name: 'Тип', value: '3D Беспроводной' }],
    reviews: [],
    shapePreset: 'headphones',
    primaryColor: '#6366f1',
    accentColor: '#a855f7',
    inStock: 15
  });

  // Promo Code Form
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState(15);
  const [newPromoDesc, setNewPromoDesc] = useState('');

  // Metrics
  const totalRevenue = orders.reduce((acc, ord) => acc + ord.finalAmount, 0);
  const totalOrdersCount = orders.length;
  const avgCheck = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const lowStockProducts = products.filter(p => p.inStock < 10);

  const handleOpenCreateForm = () => {
    setEditingProduct(null);
    setIsCreatingNew(true);
    setFormProduct({
      id: `prod-${Date.now()}`,
      title: 'Новый 3D Гаджет Nova',
      category: 'headphones',
      categoryLabel: 'Наушники & Звук',
      price: 14990,
      oldPrice: 17990,
      rating: 5.0,
      reviewCount: 0,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
      description: 'Описание создается с помощью AI...',
      specs: [{ name: 'Подключение', value: 'Bluetooth 5.3' }],
      reviews: [],
      shapePreset: 'headphones',
      primaryColor: '#6366f1',
      accentColor: '#a855f7',
      inStock: 20
    });
  };

  const handleOpenEditForm = (prod: Product) => {
    setEditingProduct(prod);
    setIsCreatingNew(false);
    setFormProduct({ ...prod });
  };

  const handleGenerateAiDescription = async () => {
    if (!formProduct.title) return;
    setIsAiGenerating(true);
    
    const specsStr = formProduct.specs?.map(s => `${s.name}: ${s.value}`).join(', ') || '';
    const desc = await generateProductDescriptionAI(
      formProduct.title || '',
      formProduct.categoryLabel || 'Электроника',
      specsStr
    );

    setFormProduct(prev => ({ ...prev, description: desc }));
    setIsAiGenerating(false);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProduct.title || !formProduct.price) return;

    if (isCreatingNew) {
      onAddProduct(formProduct as Product);
    } else if (editingProduct) {
      onUpdateProduct(formProduct as Product);
    }

    setIsCreatingNew(false);
    setEditingProduct(null);
  };

  const handleAddPromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;

    onAddPromoCode({
      code: newPromoCode.trim().toUpperCase(),
      discountPercent: newPromoDiscount,
      description: newPromoDesc || `Скидка ${newPromoDiscount}%`
    });

    setNewPromoCode('');
    setNewPromoDesc('');
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Admin Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 uppercase">
              Панель администратора
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Управление интернет-магазином</h1>
          <p className="text-xs text-slate-400">Редактирование каталога, обработка заказов и промокоды</p>
        </div>

        <button
          onClick={handleOpenCreateForm}
          className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить новый товар</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Выручка магазина</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {totalRevenue.toLocaleString('ru-RU')} ₽
          </div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" /> +18.4% за месяц
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Всего заказов</span>
            <ShoppingBag className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {totalOrdersCount} шт.
          </div>
          <span className="text-[11px] text-slate-400">Обработано в системе</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Средний чек</span>
            <Package className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {avgCheck.toLocaleString('ru-RU')} ₽
          </div>
          <span className="text-[11px] text-purple-300">Высокая конверсия</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Малый остаток</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {lowStockProducts.length} позиций
          </div>
          <span className="text-[11px] text-amber-400 font-semibold">Требуется пополнение</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'products' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Box className="w-4 h-4" />
          <span>Товары в каталоге ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Заказы клиентов ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('promos')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'promos' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Промокоды ({promoCodes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Сброс / Данные</span>
        </button>
      </div>

      {/* TAB 1: PRODUCT LIST & MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Фильтр по товарам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-slate-900 border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Товар</th>
                  <th className="p-4">Категория</th>
                  <th className="p-4">3D Пресет</th>
                  <th className="p-4">Цена</th>
                  <th className="p-4">Остаток</th>
                  <th className="p-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-semibold text-white flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt={prod.title}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 object-contain rounded-lg bg-slate-950 p-1 border border-slate-800"
                      />
                      <span className="line-clamp-1 max-w-xs">{prod.title}</span>
                    </td>
                    <td className="p-4 text-slate-400">{prod.categoryLabel}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">
                        {prod.shapePreset}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-white">{prod.price.toLocaleString('ru-RU')} ₽</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        prod.inStock < 10 ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {prod.inStock} шт.
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditForm(prod)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 transition-colors"
                        title="Редактировать"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(prod.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
              Пока нет оформленных заказов. Сделайте тестовый заказ из каталога!
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-800 pb-3">
                    <div>
                      <span className="font-extrabold text-white text-sm">Заказ #{ord.id}</span>
                      <span className="text-slate-400 ml-3">{ord.date}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">Статус:</span>
                      <select
                        value={ord.status}
                        onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-semibold outline-none focus:border-indigo-500"
                      >
                        <option value="processing">В обработке</option>
                        <option value="paid">Оплачен</option>
                        <option value="shipping">Передан в доставку</option>
                        <option value="delivered">Доставлен</option>
                        <option value="cancelled">Отменен</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer info & items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1 text-slate-300">
                      <p><strong>Покупатель:</strong> {ord.customer.name}</p>
                      <p><strong>Телефон:</strong> {ord.customer.phone}</p>
                      <p><strong>Адрес:</strong> {ord.customer.city}, {ord.customer.address}</p>
                      <p><strong>Трек-код:</strong> <span className="font-mono text-indigo-300">{ord.trackingNumber}</span></p>
                    </div>

                    <div className="space-y-1 text-slate-300">
                      <p className="font-bold text-white mb-1">Товары в заказе:</p>
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-slate-400">
                          <span>{it.product.title} x{it.quantity}</span>
                          <span>{(it.product.price * it.quantity).toLocaleString('ru-RU')} ₽</span>
                        </div>
                      ))}
                      <p className="font-extrabold text-indigo-300 pt-2 text-sm border-t border-slate-800/80">
                        Итого: {ord.finalAmount.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PROMO CODES */}
      {activeTab === 'promos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Promo */}
          <form onSubmit={handleAddPromoSubmit} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase">Создать промокод</h3>
            
            <div>
              <label className="text-xs text-slate-400 block mb-1">Код (автоматически верхний регистр)</label>
              <input
                type="text"
                required
                placeholder="например: SUMMER2026"
                value={newPromoCode}
                onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Скидка (%)</label>
              <input
                type="number"
                min={1}
                max={90}
                required
                value={newPromoDiscount}
                onChange={(e) => setNewPromoDiscount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Описание</label>
              <input
                type="text"
                placeholder="Скидка для постоянных покупателей"
                value={newPromoDesc}
                onChange={(e) => setNewPromoDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
            >
              Добавить промокод
            </button>
          </form>

          {/* Existing Promos List */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase">Действующие промокоды</h3>
            <div className="space-y-3">
              {promoCodes.map((pc) => (
                <div key={pc.code} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-indigo-400 text-sm block">{pc.code}</span>
                    <span className="text-xs text-slate-400">{pc.description}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 font-bold text-xs">
                      -{pc.discountPercent}%
                    </span>
                    <button
                      onClick={() => onDeletePromoCode(pc.code)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RESET / DEMO DATA */}
      {activeTab === 'settings' && (
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 max-w-xl space-y-4">
          <h3 className="text-base font-bold text-white">Управление демо-данными</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Если вы хотите сбросить все внесенные изменения и вернуть базовый список из 8 топовых гаджетов с 3D моделями и промокодами, нажмите кнопку ниже.
          </p>
          <button
            onClick={onResetData}
            className="px-5 py-3 rounded-2xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs border border-rose-500/30 transition-all"
          >
            Сбросить каталог к исходному состоянию
          </button>
        </div>
      )}

      {/* EDIT / CREATE PRODUCT MODAL */}
      {(isCreatingNew || editingProduct) && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {isCreatingNew ? 'Создание нового товара' : 'Редактирование товара'}
              </h3>
              <button
                onClick={() => { setIsCreatingNew(false); setEditingProduct(null); }}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Название товара</label>
                <input
                  type="text"
                  required
                  value={formProduct.title}
                  onChange={(e) => setFormProduct({ ...formProduct, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Категория</label>
                  <select
                    value={formProduct.category}
                    onChange={(e) => {
                      const cat = e.target.value as Category;
                      const labels: Record<string, string> = {
                        headphones: 'Наушники & Звук',
                        smartphones: 'Смартфоны',
                        wearables: 'Смарт-часы',
                        'smart-home': 'Умный дом',
                        accessories: 'Гаджеты & 3D'
                      };
                      setFormProduct({ ...formProduct, category: cat, categoryLabel: labels[cat] || 'Электроника' });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white outline-none focus:border-indigo-500"
                  >
                    <option value="headphones">Наушники</option>
                    <option value="smartphones">Смартфоны</option>
                    <option value="wearables">Смарт-часы</option>
                    <option value="smart-home">Умный дом</option>
                    <option value="accessories">Гаджеты & 3D</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">3D Геометрия (Пресет)</label>
                  <select
                    value={formProduct.shapePreset}
                    onChange={(e) => setFormProduct({ ...formProduct, shapePreset: e.target.value as Shape3DPreset })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white outline-none focus:border-indigo-500"
                  >
                    <option value="headphones">Наушники</option>
                    <option value="smartwatch">Смарт-часы</option>
                    <option value="drone">Дрон</option>
                    <option value="glasses">VR Очки</option>
                    <option value="earbuds">TWS Наушники</option>
                    <option value="cylinder">Колонка / Цилиндр</option>
                    <option value="cube">Термостат / Куб</option>
                    <option value="sphere">Сфера</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Цена (₽)</label>
                  <input
                    type="number"
                    required
                    value={formProduct.price}
                    onChange={(e) => setFormProduct({ ...formProduct, price: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Старая цена (₽)</label>
                  <input
                    type="number"
                    value={formProduct.oldPrice || ''}
                    onChange={(e) => setFormProduct({ ...formProduct, oldPrice: Number(e.target.value) || undefined })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">В наличии (шт)</label>
                  <input
                    type="number"
                    required
                    value={formProduct.inStock}
                    onChange={(e) => setFormProduct({ ...formProduct, inStock: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">URL Изображения</label>
                <input
                  type="text"
                  value={formProduct.image}
                  onChange={(e) => setFormProduct({ ...formProduct, image: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>

              {/* Description with AI Assistant button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-400 block">Описание товара</label>
                  <button
                    type="button"
                    onClick={handleGenerateAiDescription}
                    disabled={isAiGenerating}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50 text-[11px] font-bold flex items-center gap-1 border border-indigo-500/40"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                    <span>{isAiGenerating ? 'Генерация AI...' : 'Сгенерировать текст через Gemini AI'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  required
                  value={formProduct.description}
                  onChange={(e) => setFormProduct({ ...formProduct, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setIsCreatingNew(false); setEditingProduct(null); }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  Сохранить товар
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
