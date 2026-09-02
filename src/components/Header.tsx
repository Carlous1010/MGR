import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Menu, 
  X, 
  Truck, 
  Compass, 
  User as UserIcon,
  ChevronDown,
  Clock
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    setSelectedCategory, 
    cartCount, 
    wishlist, 
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    products,
    setSelectedProduct,
    user,
    setUser,
    setIsAiStylistOpen,
    activeBoard
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Search quick suggestions
  const searchSuggestions = searchQuery.trim().length > 1 
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.materials.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleNavClick = (view: any, category?: string) => {
    setCurrentView(view);
    if (category) {
      setSelectedCategory(category);
    }
    setIsMobileMenuOpen(false);
  };

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
    setCurrentView('product-details');
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#F9F7F2]/95 backdrop-blur-md border-b border-[#E5E1D8] transition-all">
      {/* Top Announcement Bar */}
      <div id="announcement-bar" className="bg-[#3D4238] text-[#EBE7DF] px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#7D8471] animate-pulse"></span>
            <p className="font-medium tracking-wide">
              M.G.R Studio: Complimentary White-Glove In-Home Assembly on Orders Above ₹15,000
            </p>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs text-[#DED9D0]">
            <button 
              id="header-track-order-top"
              onClick={() => handleNavClick('tracking')} 
              className="hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Truck className="w-3.5 h-3.5 text-[#7D8471]" />
              <span>Track Order</span>
            </button>
            <span className="text-[#5A6352]">|</span>
            <button 
              id="header-ai-stylist-top"
              onClick={() => setIsAiStylistOpen(true)}
              className="hover:text-white flex items-center gap-1 transition-colors text-[#F9F7F2] font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#7D8471]" />
              <span>AI Interior Stylist</span>
            </button>
            <span className="text-[#5A6352]">|</span>
            <span className="text-xs">Pan-India Delivery</span>
          </div>
        </div>
      </div>

      {/* Main Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          
          {/* Brand Logo Concept */}
          <div className="flex items-center gap-3">
            <button
              id="header-mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-md lg:hidden text-[#2C2C2C] hover:bg-[#F2EFE9]"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              id="header-brand-logo"
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 text-left group"
            >
              {/* Distinctive M.G.R Emblem Icon */}
              <div className="w-10 h-10 rounded-xl bg-[#3D4238] flex items-center justify-center text-[#F9F7F2] shadow-md border border-[#525A4B] transition-transform duration-300 group-hover:scale-105">
                <span className="font-serif-luxury text-xl font-bold tracking-tighter">M</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif-luxury text-xl md:text-2xl font-bold tracking-wider text-[#2C2C2C] leading-tight group-hover:text-[#4A5043] transition-colors">
                  M.G.R
                </span>
                <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-[0.22em] text-[#7A756D] -mt-0.5">
                  Furniture & Interior Design
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Search Bar with Live Suggestions */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <div className="relative w-full">
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Search walnut sofas, travertine tables, lamps..."
                className="w-full bg-[#F2EFE9] border border-[#E5E1D8] rounded-full pl-10 pr-4 py-2 text-sm text-[#2C2C2C] placeholder-[#7A756D] focus:outline-none focus:border-[#7D8471] focus:bg-white transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-[#7A756D] absolute left-3.5 top-3" />
            </div>

            {/* Quick search popup */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div 
                id="header-search-suggestions"
                className="absolute left-0 right-0 top-12 bg-white rounded-2xl shadow-2xl border border-[#E5E1D8] py-2 z-50 overflow-hidden"
              >
                <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#7A756D] border-b border-[#F2EFE9]">
                  Suggested Products ({searchSuggestions.length})
                </div>
                {searchSuggestions.map((item) => (
                  <button
                    key={item.id}
                    id={`search-item-${item.id}`}
                    onMouseDown={() => handleSelectProduct(item)}
                    className="w-full px-3 py-2 text-left flex items-center gap-3 hover:bg-[#F9F7F2] transition-colors"
                  >
                    <img 
                      src={item.images[0]} 
                      alt={item.name} 
                      className="w-10 h-10 object-cover rounded-xl border border-[#E5E1D8]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#2C2C2C] truncate">{item.name}</p>
                      <p className="text-[11px] text-[#7A756D]">{item.categoryName} • ₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Visualizer & Idea Boards Link */}
            <button
              id="header-visualizer-btn"
              onClick={() => handleNavClick('visualizer')}
              className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                currentView === 'visualizer'
                  ? 'bg-[#3D4238] text-white border-[#3D4238]'
                  : 'bg-[#F2EFE9] text-[#4A5043] border-[#E5E1D8] hover:bg-[#EBE7DF]'
              }`}
              title="Open 2D Room Stager & Idea Boards"
            >
              <Layers className="w-3.5 h-3.5 text-[#7D8471]" />
              <span>Room Stager</span>
              {activeBoard?.items && activeBoard.items.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#7D8471]"></span>
              )}
            </button>

            {/* Wishlist Icon */}
            <button
              id="header-wishlist-btn"
              onClick={() => {
                setSelectedCategory('all');
                setCurrentView('shop');
              }}
              className="relative p-2 rounded-full text-[#2C2C2C] hover:bg-[#F2EFE9] transition-colors"
              title="Saved Idea Wishlist"
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-[#9E5A44] fill-[#9E5A44]/20' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#9E5A44] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Icon & Drawer Trigger */}
            <button
              id="header-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full text-[#2C2C2C] hover:bg-[#F2EFE9] transition-colors"
              title="Shopping Cart"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#3D4238] text-[#F9F7F2] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Admin Switcher Dropdown */}
            <div className="relative">
              <button
                id="header-user-menu-btn"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-[#F2EFE9] text-[#2C2C2C] transition-colors text-xs font-medium"
              >
                <div className="w-7 h-7 rounded-full bg-[#7D8471]/20 border border-[#7D8471]/40 flex items-center justify-center text-[#4A5043] font-semibold text-xs">
                  {user ? user.name[0].toUpperCase() : 'U'}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#7A756D]" />
              </button>

              {isUserDropdownOpen && (
                <div 
                  id="header-user-dropdown"
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-[#E5E1D8] py-2 z-50 text-sm"
                >
                  <div className="px-4 py-2 border-b border-[#F2EFE9]">
                    <p className="font-bold text-[#2C2C2C] truncate">{user?.name || 'Customer'}</p>
                    <p className="text-xs text-[#7A756D] truncate">{user?.email}</p>
                    <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-[#4A5043]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Role: {user?.role === 'admin' ? 'Store Administrator' : 'Verified Buyer'}</span>
                    </div>
                  </div>

                  <button
                    id="header-user-admin-toggle"
                    onClick={() => {
                      if (user) {
                        setUser({
                          ...user,
                          role: user.role === 'admin' ? 'customer' : 'admin'
                        });
                      }
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-[#F9F7F2] flex items-center justify-between text-xs text-[#4A5043]"
                  >
                    <span>Switch Role</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#F2EFE9] text-[10px] font-bold uppercase">
                      {user?.role === 'admin' ? 'To Customer' : 'To Admin'}
                    </span>
                  </button>

                  <button
                    id="header-user-admin-view"
                    onClick={() => {
                      handleNavClick('admin');
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-[#F9F7F2] text-xs font-semibold text-[#2C2C2C]"
                  >
                    Admin Dashboard & Analytics
                  </button>

                  <button
                    id="header-user-tracking-btn"
                    onClick={() => {
                      handleNavClick('tracking');
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-[#F9F7F2] text-xs text-[#4A5043]"
                  >
                    My Orders & Tracking
                  </button>

                  <button
                    id="header-user-visualizer-btn"
                    onClick={() => {
                      handleNavClick('visualizer');
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-[#F9F7F2] text-xs text-[#4A5043]"
                  >
                    Saved Idea Boards
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Category Navigation Bar */}
      <nav id="primary-nav-bar" className="hidden lg:block border-t border-[#E5E1D8] bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-between py-2.5 text-xs font-medium tracking-wider uppercase text-[#4A5043]">
            <li>
              <button
                id="nav-home"
                onClick={() => handleNavClick('home')}
                className={`transition-colors hover:text-[#2C2C2C] ${currentView === 'home' ? 'text-[#2C2C2C] font-bold' : ''}`}
              >
                Home
              </button>
            </li>
            <li>
              <button
                id="nav-shop"
                onClick={() => handleNavClick('shop', 'all')}
                className={`transition-colors hover:text-[#2C2C2C] ${currentView === 'shop' ? 'text-[#2C2C2C] font-bold' : ''}`}
              >
                All Furniture
              </button>
            </li>
            <li>
              <button
                id="nav-living-room"
                onClick={() => handleNavClick('shop', 'living-room')}
                className="transition-colors hover:text-[#2C2C2C]"
              >
                Living Room
              </button>
            </li>
            <li>
              <button
                id="nav-bedroom"
                onClick={() => handleNavClick('shop', 'bedroom')}
                className="transition-colors hover:text-[#2C2C2C]"
              >
                Bedroom
              </button>
            </li>
            <li>
              <button
                id="nav-dining"
                onClick={() => handleNavClick('shop', 'dining')}
                className="transition-colors hover:text-[#2C2C2C]"
              >
                Dining
              </button>
            </li>
            <li>
              <button
                id="nav-office"
                onClick={() => handleNavClick('shop', 'office')}
                className="transition-colors hover:text-[#2C2C2C]"
              >
                Home Office
              </button>
            </li>
            <li>
              <button
                id="nav-decor"
                onClick={() => handleNavClick('shop', 'decor')}
                className="transition-colors hover:text-[#2C2C2C]"
              >
                Decor & Lighting
              </button>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#DED9D0]"></span>
            </li>
            <li>
              <button
                id="nav-visualizer"
                onClick={() => handleNavClick('visualizer')}
                className={`flex items-center gap-1 text-[#4A5043] font-semibold transition-colors hover:text-[#2C2C2C] ${
                  currentView === 'visualizer' ? 'underline underline-offset-4 font-bold text-[#2C2C2C]' : ''
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#7D8471]" />
                <span>2D Room Stager</span>
              </button>
            </li>
            <li>
              <button
                id="nav-trends"
                onClick={() => handleNavClick('trends')}
                className={`transition-colors hover:text-[#2C2C2C] ${currentView === 'trends' ? 'text-[#2C2C2C] font-bold' : ''}`}
              >
                Trends & Ideas
              </button>
            </li>
            <li>
              <button
                id="nav-interior-design"
                onClick={() => handleNavClick('interior-design')}
                className={`transition-colors hover:text-[#2C2C2C] ${currentView === 'interior-design' ? 'text-[#2C2C2C] font-bold' : ''}`}
              >
                Interior Design Consultation
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div id="mobile-menu-drawer" className="lg:hidden border-t border-[#E5E1D8] bg-[#F9F7F2] px-4 py-4 space-y-3">
          <div className="relative mb-3">
            <input
              id="mobile-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search furniture & decor..."
              className="w-full bg-[#F2EFE9] border border-[#E5E1D8] rounded-full pl-9 pr-3 py-2 text-sm text-[#2C2C2C]"
            />
            <Search className="w-4 h-4 text-[#7A756D] absolute left-3 top-3" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <button
              id="mobile-nav-home"
              onClick={() => handleNavClick('home')}
              className="p-2.5 rounded-xl text-left bg-white border border-[#E5E1D8] font-medium"
            >
              Home
            </button>
            <button
              id="mobile-nav-shop"
              onClick={() => handleNavClick('shop', 'all')}
              className="p-2.5 rounded-xl text-left bg-white border border-[#E5E1D8] font-medium"
            >
              All Furniture
            </button>
            <button
              id="mobile-nav-living"
              onClick={() => handleNavClick('shop', 'living-room')}
              className="p-2.5 rounded-xl text-left bg-white border border-[#E5E1D8]"
            >
              Living Room
            </button>
            <button
              id="mobile-nav-bedroom"
              onClick={() => handleNavClick('shop', 'bedroom')}
              className="p-2.5 rounded-xl text-left bg-white border border-[#E5E1D8]"
            >
              Bedroom
            </button>
            <button
              id="mobile-nav-dining"
              onClick={() => handleNavClick('shop', 'dining')}
              className="p-2.5 rounded-xl text-left bg-white border border-[#E5E1D8]"
            >
              Dining Room
            </button>
            <button
              id="mobile-nav-office"
              onClick={() => handleNavClick('shop', 'office')}
              className="p-2.5 rounded-xl text-left bg-white border border-[#E5E1D8]"
            >
              Home Office
            </button>
            <button
              id="mobile-nav-decor"
              onClick={() => handleNavClick('shop', 'decor')}
              className="p-2.5 rounded-xl text-left bg-white border border-[#E5E1D8]"
            >
              Decor & Lighting
            </button>
            <button
              id="mobile-nav-visualizer"
              onClick={() => handleNavClick('visualizer')}
              className="p-2.5 rounded-xl text-left bg-[#3D4238] text-white font-medium flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-[#EBE7DF]" />
              <span>Room Stager</span>
            </button>
            <button
              id="mobile-nav-trends"
              onClick={() => handleNavClick('trends')}
              className="p-2.5 rounded-xl text-left bg-white border border-[#E5E1D8]"
            >
              Trends & Ideas
            </button>
            <button
              id="mobile-nav-interior"
              onClick={() => handleNavClick('interior-design')}
              className="p-2.5 rounded-xl text-left bg-white border border-[#E5E1D8]"
            >
              Interior Design
            </button>
            <button
              id="mobile-nav-tracking"
              onClick={() => handleNavClick('tracking')}
              className="p-2.5 rounded-xl text-left bg-white border border-[#E5E1D8] flex items-center gap-1 text-[#4A5043]"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </button>
            <button
              id="mobile-nav-admin"
              onClick={() => handleNavClick('admin')}
              className="p-2.5 rounded-xl text-left bg-white border border-[#E5E1D8] flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
