import React, { useEffect } from 'react';
import { useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroBanner } from './components/HeroBanner';
import { FeaturedCollections } from './components/FeaturedCollections';
import { LatestArrivalsSection } from './components/LatestArrivalsSection';
import { BestSellersSection } from './components/BestSellersSection';
import { ShopPage } from './components/ShopPage';
import { ProductDetailsPage } from './components/ProductDetailsPage';
import { RoomVisualizer } from './components/RoomVisualizer';
import { TrendsSection } from './components/TrendsSection';
import { InteriorDesignPage } from './components/InteriorDesignPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderConfirmationPage } from './components/OrderConfirmationPage';
import { OrderTrackingPage } from './components/OrderTrackingPage';
import { WishlistPage } from './components/WishlistPage';
import { AdminDashboard } from './components/AdminDashboard';
import { CartDrawer } from './components/CartDrawer';
import { AiStylistModal } from './components/AiStylistModal';
import { QuickViewModal } from './components/QuickViewModal';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/ToastContainer';
import { Sparkles, Layers, ArrowRight } from 'lucide-react';

export const App: React.FC = () => {
  const { currentView, setCurrentView, setIsAiStylistOpen } = useStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F2] text-[#2C2C2C] font-sans antialiased selection:bg-[#7D8471] selection:text-white">
      {/* Universal Luxury Navigation Header */}
      <Header />

      {/* Main Routed Content */}
      <main className="flex-1">
        {currentView === 'home' && (
          <div className="space-y-0">
            {/* Top Editorial Hero Banner with Category Pills */}
            <HeroBanner />

            {/* 4-Card Featured Collections Row matching reference image */}
            <FeaturedCollections />

            {/* Walnut / Espresso Latest Arrivals Banner with 3 featured pieces */}
            <LatestArrivalsSection />

            {/* Sales-Ranked Best Sellers Section with Filter Tabs */}
            <BestSellersSection />

            {/* 2D Room Stager Promotion Banner */}
            <section className="py-12 bg-[#F9F7F2]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-r from-[#3D4238] to-[#4A5043] rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-[#5A6252]">
                  <div className="space-y-3 max-w-xl">
                    <span className="px-3 py-1 rounded-full bg-white/15 text-[#E5E1D8] text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#DED9D0]" />
                      <span>Interactive Staging Studio</span>
                    </span>
                    <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold">
                      Visualize Scale & Proportion Before You Buy
                    </h2>
                    <p className="text-xs sm:text-sm text-[#DED9D0] leading-relaxed">
                      Custom paint your walls in natural lime-washes, select herringbone oak or travertine floor textures, and drag authentic 2D furniture cutouts to calculate exact staging budgets.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button
                      id="home-cta-visualizer"
                      onClick={() => {
                        setCurrentView('visualizer');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-6 py-3.5 bg-[#7D8471] text-white rounded-full font-bold text-xs hover:bg-[#6C7361] transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Layers className="w-4 h-4" />
                      <span>Open 2D Room Visualizer</span>
                    </button>
                    <button
                      id="home-cta-ai"
                      onClick={() => setIsAiStylistOpen(true)}
                      className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold text-xs border border-white/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-[#DED9D0]" />
                      <span>Ask AI Decor Advisor</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentView === 'shop' && <ShopPage />}
        {currentView === 'product-details' && <ProductDetailsPage />}
        {currentView === 'visualizer' && <RoomVisualizer />}
        {currentView === 'trends' && <TrendsSection />}
        {currentView === 'interior-design' && <InteriorDesignPage />}
        {currentView === 'checkout' && <CheckoutPage />}
        {currentView === 'order-confirmation' && <OrderConfirmationPage />}
        {currentView === 'tracking' && <OrderTrackingPage />}
        {currentView === 'wishlist' && <WishlistPage />}
        {currentView === 'admin' && <AdminDashboard />}
      </main>

      {/* Luxury Footer */}
      <Footer />

      {/* Global Drawers & Modals */}
      <CartDrawer />
      <AiStylistModal />
      <QuickViewModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};
export default App;
