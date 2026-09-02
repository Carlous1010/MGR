import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight, Layers, Eye, CheckCircle } from 'lucide-react';
import { ProductCard } from './ProductCard';

export const TrendsSection: React.FC = () => {
  const { trends, products, setCurrentView, setSelectedProduct, addItemToBoard, formatPrice } = useStore();
  const [selectedTrendId, setSelectedTrendId] = useState(trends[0]?.id || 'trend-japandi');

  const activeTrend = trends.find(t => t.id === selectedTrendId) || trends[0];

  const trendProducts = products.filter(p => activeTrend?.featuredProductIds.includes(p.id));

  return (
    <div id="trends-page" className="py-8 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF0E4] border border-[#E8DEC8] text-[#8C5D33] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>2026 Editorial Design Forecast</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#1F1D1A]">
            Latest Trends & Curated Lookbooks
          </h1>
          <p className="text-xs sm:text-sm text-[#7A7167] mt-3 leading-relaxed">
            Discover intentional color palettes, architectural styling guidelines, and handpicked furniture ensembles designed by M.G.R Interior Architects.
          </p>
        </div>

        {/* Trend Selection Cards Tab */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {trends.map((t) => (
            <div
              key={t.id}
              id={`trend-tab-${t.id}`}
              onClick={() => setSelectedTrendId(t.id)}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 shadow-md flex flex-col ${
                selectedTrendId === t.id 
                  ? 'border-[#8C5D33] ring-4 ring-[#8C5D33]/15' 
                  : 'border-[#E8E1D7] hover:border-[#C8BEB0]'
              }`}
            >
              <div className="aspect-[16/10] overflow-hidden bg-[#24211E] relative">
                <img
                  src={t.coverImage}
                  alt={t.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4A373]">
                    {t.category}
                  </span>
                  <h3 className="font-serif-luxury text-lg font-bold leading-snug text-white">
                    {t.title}
                  </h3>
                </div>
              </div>

              <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                <p className="text-xs text-[#6B6156] line-clamp-2 leading-relaxed">
                  {t.subtitle}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs font-bold text-[#8C5D33] pt-2 border-t border-[#F2ECE3]">
                  <span>{selectedTrendId === t.id ? 'Viewing Lookbook' : 'Explore Concept'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Active Trend Detailed Editorial Section */}
        {activeTrend && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E1D7] shadow-lg mb-12 space-y-8">
            
            {/* Trend Info & Palette */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-8 border-b border-[#E8E1D7]">
              
              <div className="lg:col-span-7 space-y-4">
                <span className="px-3 py-1 bg-[#F4EFEA] text-[#8C5D33] text-xs font-bold uppercase tracking-wider rounded-md">
                  {activeTrend.season} Trend Focus
                </span>
                <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#1F1D1A]">
                  {activeTrend.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#5A5146] leading-relaxed">
                  {activeTrend.fullDescription}
                </p>

                {/* Styling Rules Checklist */}
                <div className="pt-2 space-y-2">
                  <span className="text-xs font-bold text-[#1F1D1A] uppercase tracking-wider block">
                    Architectural Styling Rules:
                  </span>
                  {activeTrend.stylingTips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#52493F]">
                      <CheckCircle className="w-4 h-4 text-[#8C5D33] shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Swatches Palette Card */}
              <div className="lg:col-span-5 bg-[#FAF8F5] p-6 rounded-2xl border border-[#EAE2D7]">
                <h4 className="font-serif-luxury font-bold text-sm text-[#1F1D1A] mb-1">
                  Signature Palette Tones
                </h4>
                <p className="text-[11px] text-[#7A7167] mb-4">
                  Harmonious wall, upholstery, and hardwood tone balances.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {activeTrend.colorPalette.map((col, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white border border-[#E5DDD2] flex items-center gap-3 shadow-sm">
                      <div 
                        className="w-8 h-8 rounded-lg border border-black/10 shadow-inner shrink-0" 
                        style={{ backgroundColor: col.hex }}
                      ></div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-[#1F1D1A] block truncate">{col.name}</span>
                        <span className="text-[10px] text-[#8C8378]">{col.hex}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  id="trend-stage-room-btn"
                  onClick={() => {
                    setCurrentView('visualizer');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="mt-5 w-full py-3 bg-[#24211E] text-[#FAF8F5] rounded-xl text-xs font-bold hover:bg-[#3E3833] hover:text-[#D4A373] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Layers className="w-4 h-4" />
                  <span>Stage {activeTrend.title} in 2D Visualizer</span>
                </button>
              </div>

            </div>

            {/* Matching Trend Pieces Showcase */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-serif-luxury text-2xl font-bold text-[#1F1D1A]">
                    Curated Pieces in this Lookbook
                  </h3>
                  <p className="text-xs text-[#7A7167]">
                    Handcrafted furniture items tailored for the {activeTrend.title} aesthetic.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {trendProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
