import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Heart, ShoppingBag, ArrowRight, Layers } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, setCurrentView, addToCart, formatPrice } = useStore();

  return (
    <div id="wishlist-page" className="py-8 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E8E1D7]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8C5D33]">
              <Heart className="w-3.5 h-3.5 text-[#B85D43] fill-[#B85D43]" />
              <span>Saved Design Favorites</span>
            </div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F1D1A] mt-1">
              Your Idea Wishlist ({wishlist.length})
            </h1>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={() => {
                wishlist.forEach(p => addToCart(p, 1));
              }}
              className="px-5 py-2.5 bg-[#24211E] text-white rounded-xl text-xs font-bold hover:bg-[#3E3833] hover:text-[#D4A373] transition-all flex items-center gap-2 shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add All to Shopping Cart</span>
            </button>
          )}
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-[#E8E1D7] shadow-sm max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF0E4] flex items-center justify-center text-[#B85D43] mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-serif-luxury font-bold text-xl text-[#1F1D1A]">
              Your wishlist is currently empty
            </h3>
            <p className="text-xs text-[#7A7167] leading-relaxed">
              Click the heart icon on any sofa, extendable table, platform bed, or lamp to save favorites to your personalized moodboards.
            </p>
            <button
              onClick={() => setCurrentView('shop')}
              className="mt-2 px-6 py-2.5 bg-[#24211E] text-white rounded-xl text-xs font-bold hover:bg-[#3E3833]"
            >
              Browse Catalogue
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
