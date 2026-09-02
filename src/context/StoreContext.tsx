import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Product, 
  CategoryInfo, 
  CartItem, 
  Address, 
  Order, 
  IdeaBoard, 
  IdeaBoardItem,
  Coupon, 
  User, 
  DesignTrend 
} from '../types';
import { PRODUCTS, CATEGORIES, DESIGN_TRENDS, PRESET_IDEA_BOARDS } from '../data/seedData';

export type ViewType = 
  | 'home'
  | 'shop'
  | 'product-details'
  | 'visualizer'
  | 'trends'
  | 'interior-design'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'tracking'
  | 'account'
  | 'admin';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface StoreContextType {
  // Navigation & View
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Data
  products: Product[];
  categories: CategoryInfo[];
  trends: DesignTrend[];
  refreshProducts: () => Promise<void>;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  appliedCoupon: Coupon | null;
  applyCouponCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  cartDiscount: number;
  cartTax: number;
  cartGrandTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Idea Boards & 2D Visualizer
  ideaBoards: IdeaBoard[];
  activeBoard: IdeaBoard | null;
  setActiveBoard: (board: IdeaBoard | null) => void;
  createIdeaBoard: (title: string, roomType: IdeaBoard['roomType']) => Promise<IdeaBoard>;
  saveIdeaBoard: (board: IdeaBoard) => Promise<void>;
  deleteIdeaBoard: (id: string) => Promise<void>;
  addItemToBoard: (product: Product) => void;
  updateBoardItem: (itemId: string, updates: Partial<IdeaBoardItem>) => void;
  removeBoardItem: (itemId: string) => void;
  addAllBoardItemsToCart: (board: IdeaBoard) => void;
  
  // User & Address
  user: User | null;
  setUser: (user: User | null) => void;
  selectedAddress: Address | null;
  setSelectedAddress: (addr: Address | null) => void;
  addAddress: (addr: Omit<Address, 'id'>) => void;
  
  // Checkout & Orders
  selectedDeliveryDate: string;
  setSelectedDeliveryDate: (d: string) => void;
  selectedDeliverySlot: string;
  setSelectedDeliverySlot: (s: string) => void;
  orders: Order[];
  latestOrder: Order | null;
  setLatestOrder: (o: Order | null) => void;
  placeOrder: (paymentMethod: Order['paymentMethod'], paymentId?: string) => Promise<Order | null>;
  trackOrderNumber: string;
  setTrackOrderNumber: (num: string) => void;
  
  // Modals & UI
  isQuickViewOpen: boolean;
  setIsQuickViewOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  openQuickView: (p: Product) => void;
  isAiStylistOpen: boolean;
  setIsAiStylistOpen: (open: boolean) => void;
  
  // Toast notifications
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  
  // Helpers
  formatPrice: (amount: number) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories] = useState<CategoryInfo[]>(CATEGORIES);
  const [trends] = useState<DesignTrend[]>(DESIGN_TRENDS);

  // Cart State (Persisted in localStorage for convenience)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mgr_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist State
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('mgr_wishlist');
      return saved ? JSON.parse(saved) : [PRODUCTS[0], PRODUCTS[3], PRODUCTS[10]];
    } catch {
      return [PRODUCTS[0], PRODUCTS[3], PRODUCTS[10]];
    }
  });

  // Idea Boards State
  const [ideaBoards, setIdeaBoards] = useState<IdeaBoard[]>(PRESET_IDEA_BOARDS);
  const [activeBoard, setActiveBoard] = useState<IdeaBoard | null>(PRESET_IDEA_BOARDS[0]);

  // User & Auth State
  const [user, setUser] = useState<User | null>({
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
  });

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    user?.savedAddresses[0] || null
  );

  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().slice(0, 10);
  });
  const [selectedDeliverySlot, setSelectedDeliverySlot] = useState<string>('12:00 PM – 03:00 PM');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [trackOrderNumber, setTrackOrderNumber] = useState<string>('');

  // Modals
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isAiStylistOpen, setIsAiStylistOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('mgr_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('mgr_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Fetch initial products and orders from server
  const refreshProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to fetch products from backend:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
        if (data.orders.length > 0 && !latestOrder) {
          setLatestOrder(data.orders[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  useEffect(() => {
    refreshProducts();
    fetchOrders();
  }, []);

  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cart Operations
  const addToCart = (product: Product, quantity = 1, selectedColor?: string) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.productId === product.id);
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }
      return [...prev, {
        productId: product.id,
        product,
        quantity,
        selectedColor: selectedColor || product.color
      }];
    });
    showToast(`Added '${product.name}' to your shopping cart`, 'success');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.productId === productId ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find(i => i.productId === productId);
    setCart(prev => prev.filter(i => i.productId !== productId));
    if (item) {
      showToast(`Removed '${item.product.name}' from cart`, 'info');
    }
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const applyCouponCode = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartSubtotal })
      });
      const data = await res.json();
      if (data.success && data.coupon) {
        setAppliedCoupon(data.coupon);
        showToast(data.message, 'success');
        return { success: true, message: data.message };
      } else {
        showToast(data.message || 'Invalid coupon', 'error');
        return { success: false, message: data.message || 'Invalid coupon' };
      }
    } catch {
      showToast('Error validating coupon', 'error');
      return { success: false, message: 'Server error' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const cartDiscount = appliedCoupon 
    ? Math.min((cartSubtotal * appliedCoupon.discountPercent) / 100, appliedCoupon.maxDiscount)
    : 0;

  const taxableAmount = Math.max(0, cartSubtotal - cartDiscount);
  const cartTax = Math.round(taxableAmount * 0.18); // 18% GST
  const cartGrandTotal = Math.round(taxableAmount + cartTax);

  // Wishlist Operations
  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        showToast(`Removed from Idea Wishlist`, 'info');
        return prev.filter(p => p.id !== product.id);
      } else {
        showToast(`Saved '${product.name}' to Wishlist`, 'success');
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId);
  };

  // Idea Board Operations
  const createIdeaBoard = async (title: string, roomType: IdeaBoard['roomType']) => {
    const newBoard: IdeaBoard = {
      id: `board-${Date.now()}`,
      userId: user?.id || 'user-default-1',
      title: title || 'New Custom Idea Board',
      roomType,
      backgroundStyle: 'warm-neutral',
      wallColorHex: '#F6F3ED',
      floorColorHex: '#E2D4C3',
      description: 'Personalized room furniture arrangement',
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: true,
      totalBudget: 0
    };

    setIdeaBoards(prev => [newBoard, ...prev]);
    setActiveBoard(newBoard);
    showToast(`Created new idea board: "${title}"`, 'success');
    return newBoard;
  };

  const saveIdeaBoard = async (board: IdeaBoard) => {
    setIdeaBoards(prev => prev.map(b => b.id === board.id ? board : b));
    setActiveBoard(board);
    showToast('Idea Board layout saved!', 'success');
  };

  const deleteIdeaBoard = async (id: string) => {
    setIdeaBoards(prev => prev.filter(b => b.id !== id));
    if (activeBoard?.id === id) {
      setActiveBoard(ideaBoards.find(b => b.id !== id) || null);
    }
    showToast('Idea board removed', 'info');
  };

  const addItemToBoard = (product: Product) => {
    if (!activeBoard) {
      showToast('Please select or create an Idea Board first', 'warning');
      return;
    }

    const newItem: IdeaBoardItem = {
      id: `item-${Date.now()}`,
      productId: product.id,
      product,
      xPercent: 30 + Math.random() * 30,
      yPercent: 35 + Math.random() * 20,
      scale: 1.0,
      rotation: 0,
      zIndex: activeBoard.items.length + 1
    };

    const updatedBoard: IdeaBoard = {
      ...activeBoard,
      items: [...activeBoard.items, newItem],
      totalBudget: activeBoard.totalBudget + product.price,
      updatedAt: new Date().toISOString()
    };

    saveIdeaBoard(updatedBoard);
    showToast(`Added '${product.name}' to "${activeBoard.title}"`, 'success');
  };

  const updateBoardItem = (itemId: string, updates: Partial<IdeaBoardItem>) => {
    if (!activeBoard) return;
    const updatedItems = activeBoard.items.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    );
    const updatedBoard = {
      ...activeBoard,
      items: updatedItems,
      updatedAt: new Date().toISOString()
    };
    setActiveBoard(updatedBoard);
    setIdeaBoards(prev => prev.map(b => b.id === activeBoard.id ? updatedBoard : b));
  };

  const removeBoardItem = (itemId: string) => {
    if (!activeBoard) return;
    const itemToRemove = activeBoard.items.find(i => i.id === itemId);
    const updatedItems = activeBoard.items.filter(i => i.id !== itemId);
    const updatedBoard = {
      ...activeBoard,
      items: updatedItems,
      totalBudget: Math.max(0, activeBoard.totalBudget - (itemToRemove?.product.price || 0)),
      updatedAt: new Date().toISOString()
    };
    saveIdeaBoard(updatedBoard);
  };

  const addAllBoardItemsToCart = (board: IdeaBoard) => {
    if (!board.items.length) {
      showToast('Your board is currently empty', 'warning');
      return;
    }
    board.items.forEach(item => {
      addToCart(item.product, 1);
    });
    showToast(`Added all ${board.items.length} pieces from "${board.title}" to cart!`, 'success');
    setIsCartOpen(true);
  };

  // Address
  const addAddress = (newAddrData: Omit<Address, 'id'>) => {
    const newAddr: Address = {
      ...newAddrData,
      id: `addr-${Date.now()}`
    };
    if (user) {
      const updatedUser = {
        ...user,
        savedAddresses: [...user.savedAddresses, newAddr]
      };
      setUser(updatedUser);
      setSelectedAddress(newAddr);
      showToast('Delivery address saved', 'success');
    }
  };

  // Place Order Flow
  const placeOrder = async (paymentMethod: Order['paymentMethod'], paymentId?: string): Promise<Order | null> => {
    if (!selectedAddress) {
      showToast('Please select a delivery address', 'error');
      return null;
    }

    try {
      const payload = {
        items: cart.map(item => ({
          productId: item.productId,
          productName: item.product.name,
          productImage: item.product.images[0],
          unitPrice: item.product.price,
          quantity: item.quantity,
          selectedColor: item.selectedColor
        })),
        deliveryAddress: selectedAddress,
        deliveryDate: selectedDeliveryDate,
        deliverySlot: selectedDeliverySlot,
        paymentMethod,
        paymentId: paymentId || `pay_sim_${Date.now()}`,
        couponCode: appliedCoupon?.code
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success && data.order) {
        setLatestOrder(data.order);
        setOrders(prev => [data.order, ...prev]);
        clearCart();
        refreshProducts(); // update inventory
        setCurrentView('order-confirmation');
        showToast('Order confirmed successfully!', 'success');
        return data.order;
      } else {
        showToast(data.message || 'Failed to place order', 'error');
        return null;
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to communicate with order server', 'error');
      return null;
    }
  };

  const openQuickView = (p: Product) => {
    setQuickViewProduct(p);
    setIsQuickViewOpen(true);
  };

  const formatPrice = (amount: number) => {
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProduct,
        setSelectedProduct,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        products,
        categories,
        trends,
        refreshProducts,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        cartDiscount,
        cartTax,
        cartGrandTotal,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        ideaBoards,
        activeBoard,
        setActiveBoard,
        createIdeaBoard,
        saveIdeaBoard,
        deleteIdeaBoard,
        addItemToBoard,
        updateBoardItem,
        removeBoardItem,
        addAllBoardItemsToCart,
        user,
        setUser,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        selectedDeliveryDate,
        setSelectedDeliveryDate,
        selectedDeliverySlot,
        setSelectedDeliverySlot,
        orders,
        latestOrder,
        setLatestOrder,
        placeOrder,
        trackOrderNumber,
        setTrackOrderNumber,
        isQuickViewOpen,
        setIsQuickViewOpen,
        quickViewProduct,
        openQuickView,
        isAiStylistOpen,
        setIsAiStylistOpen,
        toasts,
        showToast,
        removeToast,
        formatPrice
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
