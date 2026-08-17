import { Product, PromoCode } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Беспроводные наушники Nova Pulse 3D Pro',
    category: 'headphones',
    categoryLabel: 'Наушники & Звук',
    price: 18990,
    oldPrice: 24990,
    rating: 4.9,
    reviewCount: 142,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    description: 'Флагманские полноразмерные наушники с активным шумоподавлением нового поколения (ANC Pro), пространственным 3D-звуком Hi-Res Audio и автономностью до 45 часов. Мягкие амбушюры из эффектом памяти.',
    specs: [
      { name: 'Тип подключения', value: 'Bluetooth 5.3 + Type-C / 3.5мм' },
      { name: 'Время работы', value: 'До 45 часов без зарядки' },
      { name: 'Шумоподавление', value: 'Активное Hybrid ANC (-42 дБ)' },
      { name: 'Драйверы', value: '40-мм титановые диафрагмы' },
      { name: 'Вес', value: '250 г' }
    ],
    reviews: [
      { id: 'r1', author: 'Алексей М.', rating: 5, date: '04.08.2026', comment: 'Звук просто невероятный! Пространственное 3D позиционирование в играх и фильмах шикарное.', verified: true },
      { id: 'r2', author: 'Елена К.', rating: 5, date: '01.08.2026', comment: 'Очень легкие, уши не устают после 8 часов работы.', verified: true }
    ],
    shapePreset: 'headphones',
    primaryColor: '#6366f1',
    accentColor: '#a855f7',
    inStock: 24,
    isPopular: true,
    isFeatured: true,
    tags: ['3D Аудио', 'ANC', 'Беспроводные', 'Hi-Res']
  },
  {
    id: 'prod-2',
    title: 'Флагманский смартфон CyberX Phone 15 Pro Ultra',
    category: 'smartphones',
    categoryLabel: 'Смартфоны',
    price: 119990,
    oldPrice: 134990,
    rating: 4.95,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800&auto=format&fit=crop',
    description: 'Инновационный смартфон в титановом корпусе с изогнутым 3D-экраном AMOLED 144 Гц, процессором Snapdragon 8 Gen 3 и перископической камерой 200 МП с 10x оптическим зумом.',
    specs: [
      { name: 'Дисплей', value: '6.8" LTPO AMOLED 144Hz 3D Edge' },
      { name: 'Процессор', value: 'Snapdragon 8 Gen 3 Ultra' },
      { name: 'Память', value: '16 ГБ / 512 ГБ NVMe' },
      { name: 'Камера', value: '200 МП + 50 МП + 50 МП (10x Оптика)' },
      { name: 'Аккумулятор', value: '5500 мАч + Зарядка 120W' }
    ],
    reviews: [
      { id: 'r3', author: 'Дмитрий В.', rating: 5, date: '08.08.2026', comment: 'Экран без рамок за счет 3D изогнутых граней выглядит фантастически!', verified: true }
    ],
    shapePreset: 'cube',
    primaryColor: '#3b82f6',
    accentColor: '#06b6d4',
    inStock: 12,
    isPopular: true,
    isNew: true,
    tags: ['5G', 'Тяжелый гейминг', '200 МП', 'Титан']
  },
  {
    id: 'prod-3',
    title: 'Умные часы Chrono Sphere3D Titanium Edition',
    category: 'wearables',
    categoryLabel: 'Смарт-часы & Фитнес',
    price: 29990,
    oldPrice: 35990,
    rating: 4.8,
    reviewCount: 64,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
    description: 'Премиальные умные часы с круглым сапфировым 3D-стеклом, датчиком ЭКГ, измерением кислорода в крови O2, GPS-навигатором и влагозащитой 10 ATM для дайвинга.',
    specs: [
      { name: 'Корпус', value: 'Титановый сплав + Сапфировое 3D стекло' },
      { name: 'Автономность', value: 'До 14 дней в стандартном режиме' },
      { name: 'Датчики', value: 'ЭКГ, SpO2, Пульс, Стресс, GPS L1+L5' },
      { name: 'Защита', value: '10 ATM (Погружение до 100м)' }
    ],
    reviews: [
      { id: 'r4', author: 'Сергей П.', rating: 5, date: '02.08.2026', comment: 'Корпус выглядит надежно, дисплей читается даже под ярким солнцем.', verified: true }
    ],
    shapePreset: 'smartwatch',
    primaryColor: '#10b981',
    accentColor: '#14b8a6',
    inStock: 18,
    isFeatured: true,
    tags: ['ЭКГ', 'Сапфир', 'GPS', '10 ATM']
  },
  {
    id: 'prod-4',
    title: 'Умная колонка AuraSound 3D Ambient Hub',
    category: 'smart-home',
    categoryLabel: 'Умный дом',
    price: 14990,
    oldPrice: 17990,
    rating: 4.75,
    reviewCount: 51,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800&auto=format&fit=crop',
    description: 'Умный центр управления домом с голографической 3D-подсветкой, голосовым ассистентом, звуком на 360 градусов и встроенным хабом Zigbee / Matter.',
    specs: [
      { name: 'Мощность', value: '60 Вт Hi-Fi 360°' },
      { name: 'Протоколы', value: 'Wi-Fi 6, Bluetooth 5.3, Zigbee 3.0, Matter' },
      { name: 'Подсветка', value: '3D RGB LED с синхронизацией музыки' },
      { name: 'Микрофоны', value: '4 студийных микрофона с дальномерной матрицей' }
    ],
    reviews: [
      { id: 'r5', author: 'Мария Т.', rating: 5, date: '06.08.2026', comment: 'Подсветка переливается волшебно! Связала с ней все лампы и датчики в квартире.', verified: true }
    ],
    shapePreset: 'cylinder',
    primaryColor: '#ec4899',
    accentColor: '#f43f5e',
    inStock: 30,
    isPopular: false,
    isNew: true,
    tags: ['Умный дом', 'Zigbee', 'RGB 3D', '360° Звук']
  },
  {
    id: 'prod-5',
    title: 'Компактный 4K Аэросъемка Дрон SkyHawk 3D VR',
    category: 'accessories',
    categoryLabel: 'Гаджеты & Аксессуары',
    price: 64990,
    oldPrice: 72990,
    rating: 4.88,
    reviewCount: 38,
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=800&auto=format&fit=crop',
    description: 'Складной квадрокоптер с 3-осевым 3D-гиростабилизатором, кадрами 4K HDR 60fps, сенсорами обхода препятствий во всех направлениях и VR-очками в комплекте.',
    specs: [
      { name: 'Дальность полёта', value: 'До 12 км (OcuSync 4.0)' },
      { name: 'Время полёта', value: '38 минут на одном аккумуляторе' },
      { name: 'Камера', value: '1/1.3" CMOS 48 МП 4K/60fps' },
      { name: 'Дальномеры', value: 'Всенаправленная 3D система датчиков' }
    ],
    reviews: [
      { id: 'r6', author: 'Игорь С.', rating: 5, date: '05.08.2026', comment: 'Картинка идеальная, дальность держит стабильно.', verified: true }
    ],
    shapePreset: 'drone',
    primaryColor: '#f59e0b',
    accentColor: '#d97706',
    inStock: 8,
    isFeatured: true,
    tags: ['4K VR', '3D Обход', '38 Мин', 'Дрон']
  },
  {
    id: 'prod-6',
    title: 'Игровые VR Очки Vision Glass3D Spatial Pro',
    category: 'accessories',
    categoryLabel: 'Гаджеты & Аксессуары',
    price: 89990,
    oldPrice: 99990,
    rating: 4.9,
    reviewCount: 47,
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?q=80&w=800&auto=format&fit=crop',
    description: 'Очки виртуальной и дополненной реальности с двойными OLED 4K экранами на глаз, трекингом глаз и рук без контроллеров и виртуальным пространственным рабочим столом.',
    specs: [
      { name: 'Разрешение', value: '4K на каждый глаз (Micro-OLED)' },
      { name: 'Частота обновления', value: '120 Гц' },
      { name: 'Отслеживание', value: '6 DoF + Eye-tracking + Hand-gesture' },
      { name: 'Процессор', value: 'Dual-Engine M2 Vision' }
    ],
    reviews: [],
    shapePreset: 'glasses',
    primaryColor: '#8b5cf6',
    accentColor: '#c084fc',
    inStock: 15,
    isNew: true,
    tags: ['AR/VR', 'Spatial 3D', 'Micro-OLED', '4K']
  },
  {
    id: 'prod-7',
    title: 'Беспроводные вкладыши SonicAir TWS 3D',
    category: 'headphones',
    categoryLabel: 'Наушники & Звук',
    price: 8990,
    oldPrice: 11990,
    rating: 4.65,
    reviewCount: 110,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop',
    description: 'Компактные вакуумные TWS-наушники с кейсом беспроводной зарядки, гибридным ENC процессором шумоподавления во время вызовов и сенсорным управлением.',
    specs: [
      { name: 'Автономность', value: '8 ч + 32 ч от кейса' },
      { name: 'Влагозащита', value: 'IPX7' },
      { name: 'Кодеки', value: 'LDAC, AAC, SBC' }
    ],
    reviews: [],
    shapePreset: 'earbuds',
    primaryColor: '#0ea5e9',
    accentColor: '#38bdf8',
    inStock: 45,
    isPopular: true,
    tags: ['TWS', 'IPX7', 'LDAC', 'Зарядный кейс']
  },
  {
    id: 'prod-8',
    title: 'Умный термостат ThermoCube 3D Climate Control',
    category: 'smart-home',
    categoryLabel: 'Умный дом',
    price: 7490,
    oldPrice: 8990,
    rating: 4.7,
    reviewCount: 29,
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop',
    description: 'Интеллектуальный контроллер микроклимата с цветным OLED дисплеем, датчиками CO2, влажности, температуры и управлением со смартфона.',
    specs: [
      { name: 'Связь', value: 'Wi-Fi 2.4 GHz + Matter' },
      { name: 'Датчики', value: 'Температура, Влажность, CO2, VOC' }
    ],
    reviews: [],
    shapePreset: 'cube',
    primaryColor: '#f43f5e',
    accentColor: '#fb7185',
    inStock: 22,
    tags: ['Климат', 'CO2', 'Matter', 'Умный дом']
  }
];

export const INITIAL_PROMO_CODES: PromoCode[] = [
  { code: 'NOVA2026', discountPercent: 15, description: 'Скидка 15% на всё' },
  { code: '3DSTART', discountPercent: 10, description: 'Скидка 10% для новых покупателей' },
  { code: 'VIP20', discountPercent: 20, minAmount: 30000, description: 'Скидка 20% при заказе от 30 000 ₽' }
];
