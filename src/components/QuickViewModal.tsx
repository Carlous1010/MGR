import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  ShoppingBag, 
  Heart, 
  Layers, 
  Star, 
  ArrowRight, 
  Truck, 
  Check 
} from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const { 
    quickViewProduct, 
    closeQuickView, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    addItemToBoard, 
    setSelectedProduct, 
    setCurrentView, 
    formatPrice 
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(quickViewProduct?.availableColors[0]?.name || quickViewProduct?.color || '');

  if (!quickViewProduct) return null;

  const isWishlisted = isInWishlist(quickViewProduct.id);

  const handleFullDetails = () => {
    setSelectedProduct(quickViewProduct);
    closeQuickView();
    setCurrentView('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, selectedColor);
    closeQuickView();
  };

  const handleStageInRoom = () => {
    addItemToBoard(quickViewProduct);
    closeQuickView();
    setCurrentView('visualizer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="quickview-modal-backdrop" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="quickview-modal"
        className="bg-white w-full max-w-3xl rounded-3xl border border-[#E8E1D7] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200"
      >
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-[#E0D7CB] flex items-center justify-center text-[#554C42] hover:bg-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto bg-[#F7F4EF] p-4 flex items-center justify-center">
            <img
              src={quickViewProduct.images[0]}
              alt={quickViewProduct.name}
              className="w-full h-full object-cover rounded-2xl"
            />
            {quickViewProduct.isBestSeller && (
              <span className="absolute top-6 left-6 px-3 py-1 bg-[#24211E] text-[#D4A373] text-[10px] font-bold uppercase tracking-wider rounded-md">
                Bestseller
              </span>
            )}
          </div>

          {/* Info */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-[#8C5D33] font-bold uppercase tracking-wider">
                <span>{quickViewProduct.categoryName}</span>
                <div className="flex items-center gap-1 text-[#3E3833]">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{quickViewProduct.rating}</span>
                </div>
              </div>

              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1F1D1A] mt-1.5">
                {quickViewProduct.name}
              </h2>

              <p className="text-xs text-[#6B6156] mt-2 line-clamp-2">
                {quickViewProduct.shortDescription}
              </p>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-xl font-bold text-[#1F1D1A]">
                  {formatPrice(quickViewProduct.price)}
                </span>
                {quickViewProduct.originalPrice > quickViewProduct.price && (
                  <span className="text-xs text-[#8C8378] line-through">
                    {formatPrice(quickViewProduct.originalPrice)}
                  </span>
                )}
              </div>

              {/* Specs & Dimensions */}
              <div className="mt-4 pt-3 border-t border-[#F0EAE1] space-y-1 text-xs text-[#52493F]">
                <p><strong>Hardwood:</strong> {quickViewProduct.materials}</p>
                <p><strong>Dimensions:</strong> {quickViewProduct.dimensions.formatted}</p>
                <p><strong>Assembly:</strong> {quickViewProduct.assembly}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 bg-[#24211E] text-white rounded-xl text-xs font-bold hover:bg-[#3E3833] hover:text-[#D4A373] transition-colors flex items-center justify-center gap-1.5 shadow-md"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4A373]" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleStageInRoom}
                  className="p-3 bg-[#FAF6F0] text-[#8C5D33] border border-[#E8DEC8] rounded-xl hover:bg-[#F4ECE0]"
                  title="Stage in 2D Visualizer"
                >
                  <Layers className="w-4 h-4" />
                </button>

                <button
                  onClick={() => toggleWishlist(quickViewProduct)}
                  className={`p-3 rounded-xl border ${isWishlisted ? 'bg-[#B85D43] text-white border-[#B85D43]' : 'border-[#D8CABE] text-[#4A4239]'}`}
                  title="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleFullDetails}
                className="w-full text-center text-xs font-bold text-[#8C5D33] hover:underline flex items-center justify-center gap-1"
              >
                <span>View Full Specifications & Reviews</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
