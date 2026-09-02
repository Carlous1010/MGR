import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const HeroBanner: React.FC = () => {
  const { setCurrentView, setSelectedCategory, setIsAiStylistOpen } = useStore();

  const handleExploreCategory = (category: string) => {
    setSelectedCategory(category);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="hero-banner" className="relative bg-[#F9F7F2] overflow-hidden pt-4 pb-12 lg:pt-8 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Editorial Hero Card with Authentic High-Res Luxury Interior Photography */}
        <div className="relative rounded-3xl overflow-hidden bg-[#3D4238] text-white shadow-2xl min-h-[560px] lg:min-h-[640px] flex flex-col justify-between border border-[#525A4B]">
          
          {/* Background Image with subtle warm natural tone overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85"
              alt="M.G.R Luxury Dream Living Space"
              className="w-full h-full object-cover object-center filter brightness-90 transform scale-100 hover:scale-102 transition-transform duration-1000 ease-out"
            />
            {/* Cinematic Gradient Vignette in natural olive-forest hues */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#242921]/90 via-[#242921]/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#242921]/90 via-transparent to-[#242921]/30"></div>
          </div>

          {/* Hero Content Area */}
          <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[#F9F7F2] text-xs font-semibold mb-6 tracking-wide"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#EBE7DF]" />
              <span>Architectural Furniture & Curated Interiors</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]"
            >
              Design Your <br />
              <span className="italic font-normal text-[#EBE7DF]">Dream Living Space</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 text-base sm:text-lg text-[#DED9D0] font-light leading-relaxed max-w-lg"
            >
              Stylish furniture and handcrafted decor engineered with seasoned hardwoods and natural linen textiles to elevate your home.
            </motion.p>

            {/* Primary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <button
                id="hero-explore-btn"
                onClick={() => handleExploreCategory('all')}
                className="px-7 py-3.5 bg-[#7D8471] text-white rounded-full font-bold text-sm hover:bg-[#6C7361] shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 active:scale-98"
              >
                <span>Explore More</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-visualizer-btn"
                onClick={() => {
                  setCurrentView('visualizer');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-white/15 backdrop-blur-md text-white border border-white/30 rounded-full font-semibold text-sm hover:bg-white/25 transition-all duration-200 flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-[#EBE7DF]" />
                <span>2D Room Stager</span>
              </button>
            </motion.div>
          </div>

          {/* Floating Category Cards */}
          <div className="relative z-10 p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Card 1: Modern Furniture */}
              <div 
                id="hero-pill-furniture"
                onClick={() => handleExploreCategory('living-room')}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-[#E5E1D8] text-[#2C2C2C] shadow-xl hover:bg-white transition-all duration-300 cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F2EFE9] shrink-0 border border-[#DED9D0]">
                  <img
                    src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=300&q=80"
                    alt="Modern Furniture"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif-luxury font-bold text-sm text-[#2C2C2C] group-hover:text-[#4A5043] transition-colors">
                    Modern Furniture
                  </h4>
                  <p className="text-[11px] text-[#7A756D] line-clamp-1 mt-0.5">
                    Solid wood sofas & credenzas
                  </p>
                  <span className="inline-block mt-1 text-[11px] font-bold text-[#4A5043] group-hover:underline">
                    Shop Now →
                  </span>
                </div>
              </div>

              {/* Card 2: Decor Accents */}
              <div 
                id="hero-pill-decor"
                onClick={() => handleExploreCategory('decor')}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-[#E5E1D8] text-[#2C2C2C] shadow-xl hover:bg-white transition-all duration-300 cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F2EFE9] shrink-0 border border-[#DED9D0]">
                  <img
                    src="https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=300&q=80"
                    alt="Decor Accents"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif-luxury font-bold text-sm text-[#2C2C2C] group-hover:text-[#4A5043] transition-colors">
                    Decor Accents
                  </h4>
                  <p className="text-[11px] text-[#7A756D] line-clamp-1 mt-0.5">
                    Artisan ceramics & brass lamps
                  </p>
                  <span className="inline-block mt-1 text-[11px] font-bold text-[#4A5043] group-hover:underline">
                    Shop Now →
                  </span>
                </div>
              </div>

              {/* Card 3: Inspired Living */}
              <div 
                id="hero-pill-inspired"
                onClick={() => {
                  setCurrentView('trends');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-[#E5E1D8] text-[#2C2C2C] shadow-xl hover:bg-white transition-all duration-300 cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F2EFE9] shrink-0 border border-[#DED9D0]">
                  <img
                    src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=300&q=80"
                    alt="Inspired Living"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif-luxury font-bold text-sm text-[#2C2C2C] group-hover:text-[#4A5043] transition-colors">
                    Inspired Living
                  </h4>
                  <p className="text-[11px] text-[#7A756D] line-clamp-1 mt-0.5">
                    2026 Japandi lookbooks & trends
                  </p>
                  <span className="inline-block mt-1 text-[11px] font-bold text-[#4A5043] group-hover:underline">
                    Explore Trends →
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
