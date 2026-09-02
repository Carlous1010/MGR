import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { 
  Product, 
  Order, 
  IdeaBoard, 
  Coupon, 
  ConsultationRequest, 
  Review, 
  User, 
  OrderStatus, 
  TrackingEvent 
} from './src/types';
import { PRODUCTS, CATEGORIES, COUPONS, PRESET_IDEA_BOARDS, DESIGN_TRENDS } from './src/data/seedData';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database State with persistent runtime updates
let productsDb: Product[] = JSON.parse(JSON.stringify(PRODUCTS));
let couponsDb: Coupon[] = JSON.parse(JSON.stringify(COUPONS));
let ideaBoardsDb: IdeaBoard[] = JSON.parse(JSON.stringify(PRESET_IDEA_BOARDS));
let ordersDb: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'MGR-20260828-49102',
    userId: 'user-default-1',
    customerName: 'Aditya Sharma',
    customerEmail: 'aditya.sharma@example.com',
    customerPhone: '+91 98765 43210',
    items: [
      {
        productId: 'mgr-liv-01',
        productName: 'Aria Walnut 3-Seater Sofa',
        productImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
        unitPrice: 68500,
        quantity: 1,
        selectedColor: 'Oatmeal Beige'
      },
      {
        productId: 'mgr-dec-02',
        productName: 'Wabi-Sabi Handcrafted Ceramic Vases (Set of 3)',
        productImage: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=80',
        unitPrice: 4900,
        quantity: 1,
        selectedColor: 'Earth Trio'
      }
    ],
    subtotal: 73400,
    discount: 7340,
    couponCode: 'WELCOME10',
    tax: 11890,
    deliveryCharge: 0,
    grandTotal: 77950,
    deliveryAddress: {
      id: 'addr-1',
      fullName: 'Aditya Sharma',
      phone: '+91 98765 43210',
      doorNo: 'Flat 402, Tower B',
      street: 'Emerald Heights, Outer Ring Road',
      area: 'Bellandur',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103',
      landmark: 'Near Ecospace Business Park',
      type: 'home',
      isDefault: true
    },
    deliveryDate: '2026-09-04',
    deliverySlot: '12:00 PM – 03:00 PM',
    paymentMethod: 'razorpay_upi',
    paymentId: 'pay_rzp_demo_8392109',
    paymentStatus: 'PAID',
    orderStatus: 'DISPATCHED',
    trackingNumber: 'MGR-LOG-8392109IN',
    createdAt: '2026-08-28T14:30:00.000Z',
    trackingEvents: [
      {
        status: 'ORDER_PLACED',
        title: 'Order Confirmed',
        description: 'Order placed and payment authorized successfully.',
        timestamp: '2026-08-28 14:30',
        location: 'Bengaluru Fulfillment Hub',
        completed: true
      },
      {
        status: 'PAYMENT_CONFIRMED',
        title: 'Payment Verified',
        description: 'Razorpay UPI payment confirmed.',
        timestamp: '2026-08-28 14:32',
        location: 'M.G.R Secure Gateway',
        completed: true
      },
      {
        status: 'PROCESSING',
        title: 'Crafting & Quality Inspection',
        description: 'Furniture piece inspected for wood finish, joinery, and fabric integrity.',
        timestamp: '2026-08-29 11:00',
        location: 'M.G.R Master Workshop, Channapatna',
        completed: true
      },
      {
        status: 'PACKED',
        title: 'White-Glove Export Packaging',
        description: 'Multi-layer bubble wrap, edge guard armor, and moisture barrier sealed.',
        timestamp: '2026-08-30 16:45',
        location: 'M.G.R Logistics Central',
        completed: true
      },
      {
        status: 'DISPATCHED',
        title: 'Dispatched via M.G.R Dedicated Logistics',
        description: 'En route with two-technician white glove delivery vehicle.',
        timestamp: '2026-09-01 09:15',
        location: 'Regional Transit Hub, Bengaluru South',
        completed: true
      },
      {
        status: 'OUT_FOR_DELIVERY',
        title: 'Out for Delivery',
        description: 'Technician team assigned for in-home assembly and placement.',
        timestamp: 'Pending',
        location: 'Local Delivery Center',
        completed: false
      },
      {
        status: 'DELIVERED',
        title: 'Delivered & Assembled',
        description: 'Packaging removed and inspected by customer.',
        timestamp: 'Expected Sep 4',
        location: 'Customer Address',
        completed: false
      }
    ]
  }
];

let consultationsDb: ConsultationRequest[] = [
  {
    id: 'cons-01',
    name: 'Priya Narayanan',
    email: 'priya.n@example.com',
    phone: '+91 98450 11223',
    city: 'Bengaluru',
    propertyType: '3BHK/4BHK Luxury Apartment',
    roomTypes: ['Living Room', 'Dining Space Design', 'Master Bedroom'],
    approxBudget: '₹6 Lakh - ₹12 Lakh',
    preferredDate: '2026-09-10',
    notes: 'Looking for a warm Japandi feel with Sheesham wood accents and ambient brass lighting.',
    status: 'CONTACTED',
    createdAt: '2026-08-30T10:15:00.000Z'
  }
];

let reviewsDb: Review[] = [
  {
    id: 'rev-01',
    productId: 'mgr-liv-01',
    userId: 'user-1',
    userName: 'Vikram Malhotra',
    rating: 5,
    title: 'Exceeded our expectations in craftsmanship!',
    comment: 'The solid walnut base and bouclé texture are even more gorgeous in person. The cushions have the perfect balance of cloud-like softness and lumbar support.',
    verifiedPurchase: true,
    date: 'August 14, 2026',
    helpfulCount: 24,
    roomStyle: 'Japandi Minimalist'
  },
  {
    id: 'rev-02',
    productId: 'mgr-liv-01',
    userId: 'user-2',
    userName: 'Ananya Deshmukh',
    rating: 5,
    title: 'Flawless white-glove delivery',
    comment: 'Delivered exactly on our chosen time slot. The technicians assembled the legs and positioned it in our living room with zero mess. Highly recommend M.G.R!',
    verifiedPurchase: true,
    date: 'August 22, 2026',
    helpfulCount: 18,
    roomStyle: 'Modern Contemporary'
  },
  {
    id: 'rev-03',
    productId: 'mgr-bed-01',
    userId: 'user-3',
    userName: 'Rohan Mehra',
    rating: 5,
    title: 'The solid Sheesham wood is heavy and sturdy',
    comment: 'Zero creaks, beautiful natural wood grain, and the linen headboard is so comfortable to lean against while reading.',
    verifiedPurchase: true,
    date: 'August 19, 2026',
    helpfulCount: 31,
    roomStyle: 'Japandi Minimalist'
  }
];

// Active user sessions (in-memory)
let usersDb: User[] = [
  {
    id: 'user-default-1',
    name: 'Chandru K.',
    email: 'chandru101001@gmail.com',
    phone: '+91 98765 43210',
    role: 'admin',
    savedAddresses: [
      {
        id: 'addr-1',
        fullName: 'Chandru K.',
        phone: '+91 98765 43210',
        doorNo: 'Villa 14, Palm Meadows',
        street: 'Varthur Main Road',
        area: 'Whitefield',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560066',
        landmark: 'Behind Forum Value Mall',
        type: 'home',
        isDefault: true
      },
      {
        id: 'addr-2',
        fullName: 'Chandru K.',
        phone: '+91 98765 43210',
        doorNo: 'Level 5, M.G.R Design Studio',
        street: '100ft Road, Indiranagar',
        area: 'Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
        type: 'work'
      }
    ]
  }
];

// REST API ROUTES
// 1. Products API with Real Sales Ranking, Filter & Search
app.get('/api/products', (req: Request, res: Response) => {
  let results = [...productsDb];
  const { category, search, sort, material, minPrice, maxPrice, roomType, style, inStock, bestseller } = req.query;

  if (category && category !== 'all') {
    results = results.filter(p => p.category === category);
  }

  if (roomType && roomType !== 'all') {
    results = results.filter(p => p.roomType === roomType);
  }

  if (style && style !== 'all') {
    results = results.filter(p => p.style.toLowerCase().includes(String(style).toLowerCase()));
  }

  if (material && material !== 'all') {
    results = results.filter(p => p.materials.toLowerCase().includes(String(material).toLowerCase()));
  }

  if (minPrice) {
    results = results.filter(p => p.price >= Number(minPrice));
  }

  if (maxPrice) {
    results = results.filter(p => p.price <= Number(maxPrice));
  }

  if (inStock === 'true') {
    results = results.filter(p => p.stock > 0);
  }

  if (bestseller === 'true') {
    results = results.filter(p => p.isBestSeller);
  }

  if (search) {
    const q = String(search).toLowerCase().trim();
    results = results.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q) ||
      p.materials.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  // Real backend ranking sorting
  switch (sort) {
    case 'bestselling':
    case 'sales':
      results.sort((a, b) => b.salesCount - a.salesCount);
      break;
    case 'price-low':
      results.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      results.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      results.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      results.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
      break;
    default:
      // Default: bestsellers & featured first, then sales count
      results.sort((a, b) => {
        if (a.isBestSeller && !b.isBestSeller) return -1;
        if (!a.isBestSeller && b.isBestSeller) return 1;
        return b.salesCount - a.salesCount;
      });
  }

  res.json({
    success: true,
    total: results.length,
    products: results
  });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = productsDb.find(p => p.id === req.params.id || p.slug === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const reviews = reviewsDb.filter(r => r.productId === product.id);
  const related = productsDb
    .filter(p => p.id !== product.id && (p.category === product.category || p.style === product.style))
    .slice(0, 4);

  res.json({
    success: true,
    product,
    reviews,
    related
  });
});

app.get('/api/categories', (req: Request, res: Response) => {
  res.json({
    success: true,
    categories: CATEGORIES
  });
});

app.get('/api/trends', (req: Request, res: Response) => {
  res.json({
    success: true,
    trends: DESIGN_TRENDS
  });
});

// 2. Reviews API
app.post('/api/products/:id/reviews', (req: Request, res: Response) => {
  const { userName, rating, title, comment, roomStyle } = req.body;
  if (!userName || !rating || !comment) {
    return res.status(400).json({ success: false, message: 'Please provide rating, name, and comment' });
  }

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    productId: req.params.id,
    userId: 'user-default-1',
    userName: String(userName),
    rating: Number(rating),
    title: title || 'Verified Purchase Feedback',
    comment: String(comment),
    verifiedPurchase: true,
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    helpfulCount: 0,
    roomStyle: roomStyle || 'Modern Contemporary'
  };

  reviewsDb.unshift(newReview);

  // Update product review statistics
  const prod = productsDb.find(p => p.id === req.params.id);
  if (prod) {
    const prodReviews = reviewsDb.filter(r => r.productId === prod.id);
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    prod.rating = Number(avg.toFixed(1));
    prod.reviewCount = prodReviews.length;
  }

  res.json({ success: true, review: newReview });
});

// 3. Idea Boards (Personalized Staging & Moodboards)
app.get('/api/idea-boards', (req: Request, res: Response) => {
  res.json({
    success: true,
    boards: ideaBoardsDb
  });
});

app.post('/api/idea-boards', (req: Request, res: Response) => {
  const { title, roomType, backgroundStyle, wallColorHex, floorColorHex, description, items, totalBudget } = req.body;
  const newBoard: IdeaBoard = {
    id: `board-${Date.now()}`,
    userId: 'user-default-1',
    title: title || 'My Dream Interior Space',
    roomType: roomType || 'living',
    backgroundStyle: backgroundStyle || 'warm-neutral',
    wallColorHex: wallColorHex || '#F6F3ED',
    floorColorHex: floorColorHex || '#E2D4C3',
    description: description || '',
    items: items || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublic: true,
    totalBudget: totalBudget || 0
  };

  ideaBoardsDb.unshift(newBoard);
  res.json({ success: true, board: newBoard });
});

app.put('/api/idea-boards/:id', (req: Request, res: Response) => {
  const index = ideaBoardsDb.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Idea board not found' });
  }

  ideaBoardsDb[index] = {
    ...ideaBoardsDb[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  res.json({ success: true, board: ideaBoardsDb[index] });
});

app.delete('/api/idea-boards/:id', (req: Request, res: Response) => {
  ideaBoardsDb = ideaBoardsDb.filter(b => b.id !== req.params.id);
  res.json({ success: true, message: 'Board deleted' });
});

// 4. Coupons validation
app.post('/api/coupons/validate', (req: Request, res: Response) => {
  const { code, cartSubtotal } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, message: 'Coupon code required' });
  }

  const coupon = couponsDb.find(c => c.code.toUpperCase() === String(code).toUpperCase().trim() && c.active);
  if (!coupon) {
    return res.status(400).json({ success: false, message: 'Invalid or expired coupon code' });
  }

  if (cartSubtotal < coupon.minOrder) {
    return res.status(400).json({
      success: false,
      message: `Coupon '${coupon.code}' requires a minimum cart value of ₹${coupon.minOrder.toLocaleString('en-IN')}`
    });
  }

  const rawDiscount = (cartSubtotal * coupon.discountPercent) / 100;
  const discount = Math.min(rawDiscount, coupon.maxDiscount);

  res.json({
    success: true,
    coupon,
    discountAmount: Math.round(discount),
    message: `Coupon '${coupon.code}' applied! You save ₹${Math.round(discount).toLocaleString('en-IN')}`
  });
});

// 5. Pincode and Delivery Availability
app.post('/api/pincode/check', (req: Request, res: Response) => {
  const { pincode } = req.body;
  const cleanPin = String(pincode).trim();

  if (!/^\d{6}$/.test(cleanPin)) {
    return res.status(400).json({
      success: false,
      serviceable: false,
      message: 'Please enter a valid 6-digit Indian PIN code.'
    });
  }

  // Major cities mapping
  const prefix = cleanPin.substring(0, 2);
  let hubName = 'Regional Metro Hub';
  let days = 5;

  if (prefix === '56' || prefix === '57') {
    hubName = 'Bengaluru Hub (Express 2-3 Days Available)';
    days = 3;
  } else if (prefix === '40' || prefix === '41') {
    hubName = 'Mumbai / Pune Fulfillment Hub';
    days = 4;
  } else if (prefix === '11' || prefix === '12' || prefix === '20') {
    hubName = 'Delhi-NCR Central Logistics';
    days = 4;
  } else if (prefix === '60' || prefix === '61') {
    hubName = 'Chennai Hub';
    days = 4;
  } else if (prefix === '50') {
    hubName = 'Hyderabad Hub';
    days = 4;
  }

  const estDate = new Date();
  estDate.setDate(estDate.getDate() + days);

  res.json({
    success: true,
    serviceable: true,
    pincode: cleanPin,
    hubName,
    estimatedDays: days,
    estimatedDeliveryDate: estDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    freeDelivery: true,
    whiteGloveAssembly: true,
    availableSlots: [
      '09:00 AM – 12:00 PM',
      '12:00 PM – 03:00 PM',
      '03:00 PM – 06:00 PM',
      '06:00 PM – 09:00 PM'
    ]
  });
});

// 6. Payment Order Creation & Verification (Razorpay architecture)
app.post('/api/payments/create-order', (req: Request, res: Response) => {
  const { amount, currency = 'INR', receipt } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid order amount' });
  }

  const razorpayOrderId = `order_rzp_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  res.json({
    success: true,
    razorpayOrderId,
    amount: Math.round(amount * 100), // in paise
    currency,
    receipt: receipt || `receipt_${Date.now()}`,
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mgr_decor_demo'
  });
});

app.post('/api/payments/verify', (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, paymentMethod } = req.body;

  // In test/sandbox mode, verify payload structure
  if (!razorpay_order_id && paymentMethod !== 'cod') {
    return res.status(400).json({ success: false, message: 'Payment verification signature missing' });
  }

  res.json({
    success: true,
    verified: true,
    paymentId: razorpay_payment_id || `pay_${Date.now()}`,
    status: 'PAID',
    message: 'Payment authorized & verified securely.'
  });
});

// 7. Orders Management
app.post('/api/orders', (req: Request, res: Response) => {
  const {
    items,
    deliveryAddress,
    deliveryDate,
    deliverySlot,
    paymentMethod,
    paymentId,
    couponCode
  } = req.body;

  if (!items || !items.length || !deliveryAddress) {
    return res.status(400).json({ success: false, message: 'Invalid order payload' });
  }

  // Authoritative Backend Price & Inventory Validation
  let calculatedSubtotal = 0;
  for (const item of items) {
    const product = productsDb.find(p => p.id === item.productId);
    if (!product) {
      return res.status(400).json({ success: false, message: `Product ${item.productId} not found` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for '${product.name}'. Only ${product.stock} units available.`
      });
    }
    calculatedSubtotal += product.price * item.quantity;
  }

  // Coupon calculation
  let discount = 0;
  if (couponCode) {
    const coupon = couponsDb.find(c => c.code.toUpperCase() === String(couponCode).toUpperCase().trim());
    if (coupon && calculatedSubtotal >= coupon.minOrder) {
      discount = Math.min((calculatedSubtotal * coupon.discountPercent) / 100, coupon.maxDiscount);
    }
  }

  const taxableAmount = Math.max(0, calculatedSubtotal - discount);
  const tax = Math.round(taxableAmount * 0.18); // 18% GST standard on luxury furniture
  const deliveryCharge = 0; // Free white-glove delivery
  const grandTotal = Math.round(taxableAmount + tax + deliveryCharge);

  // Decrement inventory & increment sales count
  for (const item of items) {
    const product = productsDb.find(p => p.id === item.productId);
    if (product) {
      product.stock = Math.max(0, product.stock - item.quantity);
      product.salesCount += item.quantity;
    }
  }

  const orderNumDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const orderNumber = `MGR-${orderNumDate}-${randomSuffix}`;
  const trackingNumber = `MGR-LOG-${randomSuffix}IN`;

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber,
    userId: 'user-default-1',
    customerName: deliveryAddress.fullName,
    customerEmail: 'chandru101001@gmail.com',
    customerPhone: deliveryAddress.phone,
    items,
    subtotal: calculatedSubtotal,
    discount: Math.round(discount),
    couponCode,
    tax,
    deliveryCharge,
    grandTotal,
    deliveryAddress,
    deliveryDate: deliveryDate || new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10),
    deliverySlot: deliverySlot || '12:00 PM – 03:00 PM',
    paymentMethod: paymentMethod || 'razorpay_upi',
    paymentId: paymentId || `pay_${Date.now()}`,
    paymentStatus: paymentMethod === 'cod' ? 'PENDING' : 'PAID',
    orderStatus: paymentMethod === 'cod' ? 'ORDER_PLACED' : 'PAYMENT_CONFIRMED',
    trackingNumber,
    createdAt: new Date().toISOString(),
    trackingEvents: [
      {
        status: 'ORDER_PLACED',
        title: 'Order Confirmed',
        description: 'Your bespoke order has been placed in our manufacturing queue.',
        timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        location: `${deliveryAddress.city} Logistics Fulfillment Hub`,
        completed: true
      },
      {
        status: 'PAYMENT_CONFIRMED',
        title: 'Payment Confirmed',
        description: paymentMethod === 'cod' ? 'Cash on Delivery (Payment on inspection)' : 'Payment verified via secure gateway.',
        timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        location: 'M.G.R Secure Gateway',
        completed: true
      },
      {
        status: 'PROCESSING',
        title: 'Craftsmanship & Assembly Stage',
        description: 'Wood seasoning check, fabric upholstery padding, and hardware alignment.',
        timestamp: 'Scheduled Next',
        location: 'M.G.R Master Workshop',
        completed: false
      },
      {
        status: 'PACKED',
        title: 'White-Glove Export Packaging',
        description: 'Multi-layer impact foam & corner protectors applied.',
        timestamp: 'Pending',
        location: 'M.G.R Logistics Central',
        completed: false
      },
      {
        status: 'DISPATCHED',
        title: 'Dispatched via M.G.R Logistics',
        description: 'Loaded onto dedicated air-ride furniture delivery carrier.',
        timestamp: 'Pending',
        location: 'Regional Transit',
        completed: false
      },
      {
        status: 'OUT_FOR_DELIVERY',
        title: 'Out for Delivery & Installation',
        description: 'Technicians en route with complete assembly toolkit.',
        timestamp: 'Pending',
        location: deliveryAddress.city,
        completed: false
      },
      {
        status: 'DELIVERED',
        title: 'Delivered & Installed',
        description: 'Placed in customer room of choice with debris cleared.',
        timestamp: `Expected ${deliveryDate}`,
        location: deliveryAddress.city,
        completed: false
      }
    ]
  };

  ordersDb.unshift(newOrder);

  res.json({
    success: true,
    order: newOrder,
    message: 'Order created successfully!'
  });
});

app.get('/api/orders', (req: Request, res: Response) => {
  res.json({
    success: true,
    orders: ordersDb
  });
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = ordersDb.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, order });
});

app.get('/api/orders/track/:orderNumber', (req: Request, res: Response) => {
  const order = ordersDb.find(o => 
    o.orderNumber.toUpperCase() === req.params.orderNumber.toUpperCase().trim() ||
    o.trackingNumber.toUpperCase() === req.params.orderNumber.toUpperCase().trim() ||
    o.id === req.params.orderNumber
  );

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order or tracking number not found' });
  }

  res.json({ success: true, order });
});

// Admin update order status
app.put('/api/orders/:id/status', (req: Request, res: Response) => {
  const { status, note, location } = req.body;
  const order = ordersDb.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  order.orderStatus = status as OrderStatus;

  // Update tracking events
  const eventIndex = order.trackingEvents.findIndex(e => e.status === status);
  if (eventIndex !== -1) {
    order.trackingEvents[eventIndex].completed = true;
    order.trackingEvents[eventIndex].timestamp = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    if (location) order.trackingEvents[eventIndex].location = location;
    if (note) order.trackingEvents[eventIndex].description = note;

    // Mark previous events as completed
    for (let i = 0; i <= eventIndex; i++) {
      order.trackingEvents[i].completed = true;
    }
  }

  res.json({ success: true, order });
});

// 8. Interior Design Consultation Request API
app.post('/api/consultations', (req: Request, res: Response) => {
  const { name, email, phone, city, propertyType, roomTypes, approxBudget, preferredDate, notes } = req.body;

  if (!name || !phone || !email || !city) {
    return res.status(400).json({ success: false, message: 'Name, phone, email and city are required' });
  }

  const newLead: ConsultationRequest = {
    id: `cons-${Date.now()}`,
    name,
    email,
    phone,
    city,
    propertyType: propertyType || '3BHK/4BHK Luxury Apartment',
    roomTypes: roomTypes || ['Living Room'],
    approxBudget: approxBudget || '₹3 Lakh - ₹6 Lakh',
    preferredDate: preferredDate || new Date().toISOString().slice(0, 10),
    notes,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };

  consultationsDb.unshift(newLead);

  res.json({
    success: true,
    lead: newLead,
    message: 'Thank you! A Senior M.G.R Interior Architect will connect with you within 24 hours.'
  });
});

app.get('/api/consultations', (req: Request, res: Response) => {
  res.json({
    success: true,
    consultations: consultationsDb
  });
});

// 9. User Authentication & Profile
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = usersDb.find(u => u.email.toLowerCase() === String(email).toLowerCase());
  if (user) {
    return res.json({
      success: true,
      user,
      token: 'jwt_mock_token_mgr_luxury_' + user.id
    });
  }

  // Default instant login or create demo customer
  const newUser: User = {
    id: `user-${Date.now()}`,
    name: email.split('@')[0],
    email,
    role: 'customer',
    savedAddresses: []
  };
  usersDb.push(newUser);

  res.json({
    success: true,
    user: newUser,
    token: 'jwt_mock_token_mgr_luxury_' + newUser.id
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  res.json({
    success: true,
    user: usersDb[0]
  });
});

app.post('/api/auth/addresses', (req: Request, res: Response) => {
  const address = req.body;
  const user = usersDb[0];
  const newAddr = {
    ...address,
    id: `addr-${Date.now()}`
  };
  user.savedAddresses.push(newAddr);
  res.json({ success: true, addresses: user.savedAddresses });
});

// 10. Admin Analytics & Product CRUD
app.get('/api/admin/analytics', (req: Request, res: Response) => {
  const totalRevenue = ordersDb.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalOrders = ordersDb.length;
  const totalProductsSold = ordersDb.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);
  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  
  const lowStockItems = productsDb.filter(p => p.stock <= 5);
  const outOfStockItems = productsDb.filter(p => p.stock === 0);

  res.json({
    success: true,
    analytics: {
      totalRevenue,
      totalOrders,
      totalProductsSold,
      averageOrderValue,
      totalCatalogCount: productsDb.length,
      lowStockCount: lowStockItems.length,
      outOfStockCount: outOfStockItems.length,
      pendingOrdersCount: ordersDb.filter(o => o.orderStatus !== 'DELIVERED').length,
      recentOrders: ordersDb.slice(0, 5),
      lowStockItems,
      consultationsCount: consultationsDb.length
    }
  });
});

app.post('/api/admin/products', (req: Request, res: Response) => {
  const newProduct: Product = {
    ...req.body,
    id: `mgr-custom-${Date.now()}`,
    salesCount: 0,
    rating: 5.0,
    reviewCount: 0
  };
  productsDb.unshift(newProduct);
  res.json({ success: true, product: newProduct });
});

app.put('/api/admin/products/:id', (req: Request, res: Response) => {
  const idx = productsDb.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Product not found' });
  productsDb[idx] = { ...productsDb[idx], ...req.body };
  res.json({ success: true, product: productsDb[idx] });
});

app.delete('/api/admin/products/:id', (req: Request, res: Response) => {
  productsDb = productsDb.filter(p => p.id !== req.params.id);
  res.json({ success: true, message: 'Product deleted' });
});

// 11. AI Room Stylist (Powered by Gemini or Expert Stylist Engine)
app.post('/api/ai/room-stylist', async (req: Request, res: Response) => {
  const { roomType, style, dimensions, budget, existingFurniture, preferences } = req.body;

  try {
    if (process.env.GEMINI_API_KEY) {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are a world-class luxury interior architect and decor stylist for 'M.G.R FURNITURE & INTERIOR DESIGN'.
A homeowner asks for personalized interior advice:
- Room Type: ${roomType || 'Living Room'}
- Desired Style: ${style || 'Japandi Minimalist'}
- Room Size: ${dimensions || '16ft x 14ft'}
- Approximate Budget: ${budget || '₹1.5 Lakh - ₹3 Lakh'}
- Preferences / Notes: ${preferences || 'Clean lines, warm Sheesham wood, ambient lighting'}

Provide:
1. Executive Aesthetic Concept (2-3 sentences)
2. Color Palette & Material Selection
3. Optimal Layout & Zoning Strategy
4. Recommended M.G.R Furniture & Decor Pieces (from: Aria Walnut Sofa, Kyoto Travertine Table, Verona Sheesham Bed, Solis Brass Arc Lamp, Wabi-Sabi Vases, Camden Oak Dining Table, Atlas Leather Chair, Artemis Arched Mirror)
5. Lighting & Accents Pro-Tip.

Format response clearly with elegant headings and bullet points.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      return res.json({
        success: true,
        advice: response.text,
        recommendedProducts: productsDb.slice(0, 4)
      });
    }
  } catch (err) {
    console.error('Gemini call error:', err);
  }

  // Graceful Expert Fallback
  const fallbackAdvice = `### M.G.R Curated Concept: ${style || 'Warm Japandi & Organic Modern'}
For your **${roomType || 'Living Space'}**, we recommend anchoring the room around natural Sheesham hardwoods, textural bouclé fabrics, and low-slung profiles that expand perceived ceiling height.

**1. Color & Materials**:
- Base: Warm Sand Linen & Off-White Wall Tones
- Secondary: Solid Sheesham & American Walnut
- Accents: Brushed Brass and Matte Stoneware Ceramics

**2. Layout Strategy**:
- Position the main 3-seater sofa 18 inches off the main wall to allow natural air and light circulation.
- Layer an 8x10 high-low pure wool rug beneath the front sofa legs and center with the Roman Travertine coffee table.
- Place an arched brass floor lamp in the corner for non-glare ambient reading illumination.

**3. Recommended Pieces**:
- *Aria Walnut 3-Seater Sofa* (Centerpiece Comfort)
- *Kyoto Travertine & Oak Coffee Table* (Sculptural Anchor)
- *Solis Brass Arc Lamp* (Zoned Ambient Lighting)
- *Wabi-Sabi Handcrafted Ceramic Vases* (Organic Finishing Touch)`;

  res.json({
    success: true,
    advice: fallbackAdvice,
    recommendedProducts: productsDb.slice(0, 4)
  });
});

// START SERVER WITH VITE MIDDLEWARE
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`M.G.R Furniture & Interior Design server listening on port ${PORT}`);
  });
}

startServer();
