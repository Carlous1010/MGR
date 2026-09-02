import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Trophy, ArrowRight, Sparkles } from 'lucide-react';

export const BestSellersSection: React.FC = () => {
  const { products, setCurrentView, setSelectedCategory } = useStore();
  const [activeTab, setActiveTab] = useState<'bestseller' | 'trending' | 'living' | 'decor'>('bestseller');

  let displayProducts = [...products];

  if (activeTab === 'bestseller') {
    displayProducts = displayProducts.sort((a, b) => b.salesCount - a.salesCount).slice(0, 8);
  } else if (activeTab === 'trending') {
    displayProducts = displayProducts.filter(p => p.isTrending || p.rating >= 4.8).slice(0, 8);
  } else if (activeTab === 'living') {
    displayProducts = displayProducts.filter(p => p.category === 'living-room').slice(0, 8);
  } else if (activeTab === 'decor') {
    displayProducts = displayProducts.filter(p => p.category === 'decor').slice(0, 8);
  }

  return (
    <section id="bestsellers-section" className="py-12 bg-[#F9F7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#E5E1D8] gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#4A5043]">
              <Trophy className="w-3.5 h-3.5 text-[#7D8471]" />
              <span>Verified Customer Favorites</span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#2C2C2C] mt-1">
              Best Selling Furniture & Decor
            </h2>
          </div>

          {/* Navigation Filter Tabs */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              id="tab-bestsellers"
              onClick={() => setActiveTab('bestseller')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'bestseller'
                  ? 'bg-[#3D4238] text-white shadow-md'
                  : 'bg-white text-[#4A5043] border border-[#E5E1D8] hover:bg-[#F2EFE9]'
              }`}
            >
              ★ Top Sales Ranking
            </button>
            <button
              id="tab-trending"
              onClick={() => setActiveTab('trending')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'trending'
                  ? 'bg-[#3D4238] text-white shadow-md'
                  : 'bg-white text-[#4A5043] border border-[#E5E1D8] hover:bg-[#F2EFE9]'
              }`}
            >
              Trending 2026
            </button>
            <button
              id="tab-living"
              onClick={() => setActiveTab('living')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'living'
                  ? 'bg-[#3D4238] text-white shadow-md'
                  : 'bg-white text-[#4A5043] border border-[#E5E1D8] hover:bg-[#F2EFE9]'
              }`}
            >
              Living Room
            </button>
            <button
              id="tab-decor"
              onClick={() => setActiveTab('decor')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'decor'
                  ? 'bg-[#3D4238] text-white shadow-md'
                  : 'bg-white text-[#4A5043] border border-[#E5E1D8] hover:bg-[#F2EFE9]'
              }`}
            >
              Lighting & Accents
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA to full shop */}
        <div className="mt-12 text-center">
          <button
            id="bestsellers-view-all-btn"
            onClick={() => {
              setSelectedCategory('all');
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#3D4238] text-white rounded-full text-xs font-bold hover:bg-[#4A5043] transition-all shadow-md active:scale-95"
          >
            <span>Explore Complete M.G.R Catalogue ({products.length} Products)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
