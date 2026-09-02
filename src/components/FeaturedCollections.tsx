import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight } from 'lucide-react';

export const FeaturedCollections: React.FC = () => {
  const { setSelectedCategory, setCurrentView } = useStore();

  const collections = [
    {
      id: 'living-room',
      title: 'Living Room',
      description: 'Lounge sofas, travertine coffee tables & credenzas',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
      itemCount: '8 Pieces'
    },
    {
      id: 'office',
      title: 'Home Office',
      description: 'Executive walnut desks & full-grain leather seating',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
      itemCount: '5 Pieces'
    },
    {
      id: 'bedroom',
      title: 'Bedroom',
      description: 'Solid Sheesham platform beds & floating nightstands',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
      itemCount: '6 Pieces'
    },
    {
      id: 'decor',
      title: 'Decor Accessories',
      description: 'Sculptural brass arc lamps, wabi-sabi vases & wool rugs',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      itemCount: '6 Pieces'
    }
  ];

  const handleCollectionClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="featured-collections-section" className="py-12 bg-[#F9F7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E5E1D8]">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#4A5043]">
              Curated Spaces
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#2C2C2C] mt-1">
              Featured Collections
            </h2>
          </div>
          <button
            id="view-all-collections-btn"
            onClick={() => {
              setSelectedCategory('all');
              setCurrentView('shop');
            }}
            className="mt-3 sm:mt-0 text-xs font-bold text-[#4A5043] hover:text-[#3D4238] flex items-center gap-1.5 transition-colors group"
          >
            <span>Explore All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((col) => (
            <div
              key={col.id}
              id={`collection-card-${col.id}`}
              onClick={() => handleCollectionClick(col.id)}
              className="group bg-white rounded-2xl border border-[#E5E1D8] overflow-hidden hover:shadow-xl hover:border-[#7D8471] transition-all duration-300 cursor-pointer flex flex-col"
            >
              {/* Photo Area */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#F2EFE9]">
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold text-[#4A5043] shadow-sm">
                  {col.itemCount}
                </div>
              </div>

              {/* Text Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-[#2C2C2C] group-hover:text-[#4A5043] transition-colors">
                    {col.title}
                  </h3>
                  <p className="text-xs text-[#7A756D] mt-1.5 leading-relaxed">
                    {col.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F2EFE9] flex items-center justify-between text-xs font-bold text-[#4A5043]">
                  <span>View Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
