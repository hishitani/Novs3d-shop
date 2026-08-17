export type Category = 
  | 'all'
  | 'smartphones'
  | 'headphones'
  | 'smart-home'
  | 'wearables'
  | 'laptops'
  | 'accessories';

export type Shape3DPreset = 
  | 'headphones' 
  | 'smartwatch' 
  | 'sphere' 
  | 'cube' 
  | 'cylinder' 
  | 'earbuds' 
  | 'speaker' 
  | 'drone' 
  | 'glasses' 
  | 'bottle';

export interface ProductSpec {
  name: string;
  value: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  title: string;
  category: Category;
  categoryLabel: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  specs: ProductSpec[];
  reviews: Review[];
  shapePreset: Shape3DPreset;
  primaryColor: string;
  accentColor: string;
  inStock: number;
  isPopular?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  minAmount?: number;
  description: string;
}

export type PaymentMethod = 'card' | 'sbp' | 'sberpay' | 'tpay' | 'cash';
export type DeliveryMethod = 'courier' | 'pickup' | 'post';

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  comment?: string;
}

export interface PaymentDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export type OrderStatus = 'processing' | 'paid' | 'shipping' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  finalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  customer: CustomerInfo;
  trackingNumber: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  averageCheck: number;
  popularProduct: string;
}
