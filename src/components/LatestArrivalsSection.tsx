import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight, Eye, ShoppingBag } from 'lucide-react';

export const LatestArrivalsSection: React.FC = () => {
  const { products, setSelectedProduct, setCurrentView, addToCart, formatPrice } = useStore();

  // Pick 3 signature pieces matching the reference image items (Armchair, Ceramic Vases, Lamp)
  const arrivalProducts = [
    products.find(p => p.id === 'mgr-liv-03') || products[2], // Oslo Scandinavian Armchair
    products.find(p => p.id === 'mgr-dec-02') || products[11], // Wabi-Sabi Ceramic Vases
    products.find(p => p.id === 'mgr-dec-03') || products[12]  // Lumina Table Lamp
  ];

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setCurrentView('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="latest-arrivals-section" className="py-12 bg-[#F9F7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Rich Walnut / Olive Wood Banner Container */}
        <div className="relative rounded-3xl overflow-hidden bg-[#3D4238] text-white p-6 sm:p-10 lg:p-12 shadow-2xl border border-[#525A4B]">
          
          {/* Subtle woodgrain / botanical background atmosphere */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#7D8471_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
            
            {/* Left Headline Area */}
            <div className="lg:col-span-1 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[#EBE7DF] text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#EBE7DF]" />
                <span>New In Store</span>
              </div>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Latest <br className="hidden sm:inline" />Arrivals
              </h2>
              <p className="text-xs text-[#DED9D0] leading-relaxed">
                Freshly released handcrafted studio pieces designed with organic stone, seasoned teak, and mouth-blown glass.
              </p>
              <button
                id="arrivals-get-inspired-btn"
                onClick={() => {
                  setCurrentView('trends');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-2 px-6 py-3 bg-[#7D8471] text-white rounded-full font-bold text-xs hover:bg-[#6C7361] shadow-md transition-all flex items-center gap-2 active:scale-95"
              >
                <span>Get Inspired</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right 3 Product Cards */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {arrivalProducts.map((prod) => (
                <div
                  key={prod.id}
                  id={`arrival-card-${prod.id}`}
                  className="bg-white rounded-2xl p-4 text-[#2C2C2C] shadow-xl border border-[#E5E1D8] flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image */}
                  <div 
                    onClick={() => handleProductClick(prod)}
                    className="aspect-square rounded-xl overflow-hidden bg-[#F2EFE9] relative cursor-pointer"
                  >
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#3D4238]/90 text-[#F9F7F2] text-[10px] font-bold rounded-md">
                      New
                    </div>
                  </div>

                  {/* Info */}
                  <div className="mt-4 text-center">
                    <h4 
                      onClick={() => handleProductClick(prod)}
                      className="font-serif-luxury font-bold text-sm text-[#2C2C2C] group-hover:text-[#4A5043] transition-colors cursor-pointer line-clamp-1"
                    >
                      {prod.name}
                    </h4>
                    <p className="text-[11px] text-[#7A756D] mt-1 line-clamp-1">
                      {prod.materials.split(',')[0]}
                    </p>
                    <p className="text-sm font-bold text-[#2C2C2C] mt-1">
                      {formatPrice(prod.price)}
                    </p>
                  </div>

                  {/* View Product CTA */}
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      id={`arrival-view-btn-${prod.id}`}
                      onClick={() => handleProductClick(prod)}
                      className="flex-1 py-2.5 bg-[#7D8471] text-white text-xs font-bold rounded-full hover:bg-[#6C7361] transition-colors shadow-sm"
                    >
                      View Product
                    </button>
                    <button
                      id={`arrival-add-btn-${prod.id}`}
                      onClick={() => addToCart(prod, 1)}
                      className="p-2.5 bg-[#2C2C2C] text-white rounded-full hover:bg-[#3D4238] transition-colors"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#F9F7F2]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
