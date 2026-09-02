export type ProductCategory = 
  | 'living-room'
  | 'bedroom'
  | 'dining'
  | 'office'
  | 'storage'
  | 'decor';

export type ProductMaterial = 
  | 'Solid Sheesham Wood'
  | 'Teak Wood'
  | 'Engineered Oak'
  | 'Italian Bouclé'
  | 'Premium Velvet'
  | 'Genuine Leather'
  | 'Brushed Brass & Glass'
  | 'Italian Carrara Marble'
  | 'Belgian Linen'
  | 'Handmade Ceramic'
  | 'Jute & Wool';

export type RoomStyle = 
  | 'Japandi Minimalist'
  | 'Modern Contemporary'
  | 'Mid-Century Modern'
  | 'Scandinavian Warm'
  | 'Industrial Chic'
  | 'Art Deco Luxury';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  categoryName: string;
  subcategory: string;
  brand: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  stock: number;
  rating: number;
  reviewCount: number;
  images: string[];
  cutoutImage?: string; // Cutout / transparent image for 2D staging
  isBestSeller?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  salesCount: number;
  description: string;
  shortDescription: string;
  materials: string;
  dimensions: {
    widthCm: number;
    depthCm: number;
    heightCm: number;
    formatted: string;
  };
  weightKg: number;
  color: string;
  finish: string;
  availableColors: { name: string; hex: string; image?: string }[];
  assembly: string;
  warranty: string;
  careInstructions: string;
  deliveryDays: number;
  roomType: 'living' | 'bedroom' | 'dining' | 'office' | 'decor';
  style: RoomStyle;
  tags: string[];
}

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  itemCount: number;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  doorNo: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  type: 'home' | 'work' | 'other';
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  savedAddresses: Address[];
}

export type OrderStatus = 
  | 'ORDER_PLACED'
  | 'PAYMENT_CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'DISPATCHED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface TrackingEvent {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  location: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: {
    productId: string;
    productName: string;
    productImage: string;
    unitPrice: number;
    quantity: number;
    selectedColor?: string;
  }[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  deliveryCharge: number;
  grandTotal: number;
  deliveryAddress: Address;
  deliveryDate: string;
  deliverySlot: string;
  paymentMethod: 'razorpay_upi' | 'razorpay_card' | 'razorpay_netbanking' | 'cod';
  paymentId?: string;
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  orderStatus: OrderStatus;
  trackingNumber: string;
  trackingEvents: TrackingEvent[];
  createdAt: string;
}

export interface IdeaBoardItem {
  id: string;
  productId: string;
  product: Product;
  xPercent: number; // 0 to 100% on staging canvas
  yPercent: number; // 0 to 100% on staging canvas
  scale: number; // 0.5 to 2.0
  rotation: number; // -180 to 180 deg
  zIndex: number;
  flipped?: boolean;
}

export interface IdeaBoard {
  id: string;
  userId: string;
  title: string;
  roomType: 'living' | 'bedroom' | 'dining' | 'office' | 'custom';
  backgroundStyle: 'warm-neutral' | 'modern-loft' | 'scandi-sunlit' | 'terracotta-accent' | 'charcoal-luxe' | 'custom';
  wallColorHex: string;
  floorColorHex: string;
  description?: string;
  items: IdeaBoardItem[];
  createdAt: string;
  updatedAt: string;
  isPublic?: boolean;
  totalBudget: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  date: string;
  helpfulCount: number;
  roomStyle?: string;
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  discountPercent: number;
  maxDiscount: number;
  minOrder: number;
  validUntil: string;
  active: boolean;
}

export interface ConsultationRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  propertyType: '1BHK/2BHK Apartment' | '3BHK/4BHK Luxury Apartment' | 'Villa / Independent House' | 'Commercial / Home Office' | 'Single Room Redesign';
  roomTypes: string[];
  approxBudget: '₹1.5 Lakh - ₹3 Lakh' | '₹3 Lakh - ₹6 Lakh' | '₹6 Lakh - ₹12 Lakh' | '₹12 Lakh+ Luxury Bespoke';
  preferredDate: string;
  notes?: string;
  status: 'PENDING' | 'CONTACTED' | 'PROPOSAL_SENT' | 'COMPLETED';
  createdAt: string;
}

export interface DesignTrend {
  id: string;
  title: string;
  subtitle: string;
  style: RoomStyle;
  tag: string;
  heroImage: string;
  description: string;
  keyElements: string[];
  colorPalette: { name: string; hex: string }[];
  featuredProductIds: string[];
}
