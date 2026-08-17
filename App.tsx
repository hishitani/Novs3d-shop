import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Sparkles, 
  Filter, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Plus
} from 'lucide-react';
import { Category, CartItem, Order, OrderStatus, Product, PromoCode } from './types';
import { INITIAL_PRODUCTS, INITIAL_PROMO_CODES } from './data/initialProducts';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistModal } from './components/WishlistModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { ThreeHeroCanvas } from './components/ThreeHeroCanvas';

export default function App() {
  // Products & Storage State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('nova3d_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('nova3d_products', JSON.stringify(products));
  }, [products]);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('nova3d_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('nova3d_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Wishlist State
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('nova3d_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('nova3d_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('nova3d_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'ord-8812',
        date: '09.08.2026',
        items: [{ product: INITIAL_PRODUCTS[0], quantity: 1 }],
        totalAmount: 18990,
        discountAmount: 0,
        shippingFee: 0,
        finalAmount: 18990,
        status: 'paid',
        paymentMethod: 'sbp',
        deliveryMethod: 'courier',
        customer: {
          name: 'Иван Сергеев',
          phone: '+7 (903) 555-12-34',
          email: 'ivan@example.com',
          city: 'Москва',
          address: 'Ленинский проспект, д. 45, кв. 102'
        },
        trackingNumber: 'NV-998231'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('nova3d_orders', JSON.stringify(orders));
  }, [orders]);

  // Promo Codes
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => {
    const saved = localStorage.getItem('nova3d_promos');
    return saved ? JSON.parse(saved) : INITIAL_PROMO_CODES;
  });

  useEffect(() => {
    localStorage.setItem('nova3d_promos', JSON.stringify(promoCodes));
  }, [promoCodes]);

  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);

  // UI Modals State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalInitialTab, setModalInitialTab] = useState<'3d' | 'details' | 'specs' | 'reviews'>('details');

  // Cart Operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleApplyPromo = (code: string): boolean => {
    const promo = promoCodes.find(p => p.code.toUpperCase() === code.toUpperCase());
    if (promo) {
      setAppliedPromo(promo);
      return true;
    }
    return false;
  };

  // Wishlist Operations
  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  // Admin Actions
  const handleAddProduct = (newProd: Product) => {
    setProducts(prev => [newProd, ...prev]);
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleAddPromoCode = (promo: PromoCode) => {
    setPromoCodes(prev => [...prev, promo]);
  };

  const handleDeletePromoCode = (code: string) => {
    setPromoCodes(prev => prev.filter(p => p.code !== code));
  };

  const handleResetData = () => {
    setProducts(INITIAL_PRODUCTS);
    setPromoCodes(INITIAL_PROMO_CODES);
    setOrders([]);
    localStorage.removeItem('nova3d_products');
    localStorage.removeItem('nova3d_promos');
    localStorage.removeItem('nova3d_orders');
  };

  // Filter & Sort catalog items
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = p.price <= maxPrice;
    const matchesStock = !showOnlyInStock || p.inStock > 0;

    return matchesCategory && matchesSearch && matchesPrice && matchesStock;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
  });

  const cartTotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Header Navigation */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        cartTotal={cartTotal}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        isAdminOpen={isAdminOpen}
        setIsAdminOpen={setIsAdminOpen}
      />

      {/* Main View Area */}
      {isAdminOpen ? (
        <AdminPanel
          products={products}
          orders={orders}
          promoCodes={promoCodes}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onAddPromoCode={handleAddPromoCode}
          onDeletePromoCode={handleDeletePromoCode}
          onResetData={handleResetData}
        />
      ) : (
        <main className="flex-1">
          
          {/* HERO BANNER WITH 3D CANVAS */}
          <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-8 pb-16 border-b border-slate-800/60">
            <ThreeHeroCanvas />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                
                {/* Hero Text */}
                <div className="space-y-6 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                    <Sparkles className="w-4 h-4 animate-pulse text-indigo-400" />
                    <span>Технологии 2026 с интерактивной 3D моделью</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                    Электроника с <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">3D-просмотром</span> и СБП оплатой
                  </h1>

                  <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                    Вращайте модели гаджетов на 360°, проверяйте характеристики, добавляйте в корзину и оплачивайте в 1 клик с помощью карты, СБП или SberPay.
                  </p>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                    <button
                      onClick={() => {
                        const elem = document.getElementById('catalog');
                        elem?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
                    >
                      Смотреть каталог →
                    </button>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Гарантия 12 месяцев</span>
                    </div>
                  </div>
                </div>

                {/* Hero 3D Interactive Card Preview */}
                <div className="relative max-w-md mx-auto w-full">
                  <div className="p-2 rounded-3xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-cyan-500/20 border border-indigo-500/30 shadow-2xl backdrop-blur-md">
                    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Флагман недели</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">3D WebGL</span>
                      </div>

                      <img
                        src={INITIAL_PRODUCTS[0].image}
                        alt="Hero product"
                        referrerPolicy="no-referrer"
                        className="w-full h-48 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                      />

                      <div className="space-y-1">
                        <h3 className="font-bold text-white text-base">{INITIAL_PRODUCTS[0].title}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2">{INITIAL_PRODUCTS[0].description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                        <span className="text-lg font-extrabold text-white">{INITIAL_PRODUCTS[0].price.toLocaleString('ru-RU')} ₽</span>
                        <button
                          onClick={() => {
                            setSelectedProduct(INITIAL_PRODUCTS[0]);
                            setModalInitialTab('3d');
                          }}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                        >
                          <Box className="w-4 h-4" />
                          <span>3D Обзор</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* CATALOG SECTION */}
          <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            
            {/* Catalog Filter Controls Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                <span>Каталог товаров ({filteredProducts.length})</span>
              </div>

              {/* Filters / Sort */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                {/* Max Price Range Slider */}
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
                  <span className="text-slate-400">До:</span>
                  <input
                    type="range"
                    min={10000}
                    max={150000}
                    step={5000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-20 accent-indigo-500"
                  />
                  <span className="font-bold text-indigo-300">{maxPrice.toLocaleString('ru-RU')} ₽</span>
                </div>

                {/* Sort selector */}
                <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-slate-200 font-medium outline-none cursor-pointer"
                  >
                    <option value="popular">По популярности</option>
                    <option value="price-asc">Сначала дешевле</option>
                    <option value="price-desc">Сначала дороже</option>
                    <option value="rating">По рейтингу</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
                <Box className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-200">Товары не найдены</h3>
                <p className="text-xs text-slate-400">Попробуйте изменить поисковый запрос или сбросить фильтры цены.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setMaxPrice(150000);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlist.some(p => p.id === product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onAddToCart={handleAddToCart}
                    onOpenQuickView={(p) => {
                      setSelectedProduct(p);
                      setModalInitialTab('details');
                    }}
                    onOpen3DViewer={(p) => {
                      setSelectedProduct(p);
                      setModalInitialTab('3d');
                    }}
                  />
                ))}
              </div>
            )}

          </section>

        </main>
      )}

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        initialTab={modalInitialTab}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={() => setAppliedPromo(null)}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        appliedPromo={appliedPromo}
        onOrderSuccess={(newOrder) => {
          setOrders(prev => [newOrder, ...prev]);
          setCartItems([]);
          setAppliedPromo(null);
        }}
      />

    </div>
  );
}
