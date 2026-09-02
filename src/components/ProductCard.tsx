import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Eye, Layers, Star, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, featured = false }) => {
  const { 
    setSelectedProduct, 
    setCurrentView, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    openQuickView, 
    addItemToBoard,
    formatPrice 
  } = useStore();

  const [isHovered, setIsHovered] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  const handleCardClick = () => {
    setSelectedProduct(product);
    setCurrentView('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    openQuickView(product);
  };

  const handleAddToBoard = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItemToBoard(product);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      className={`group relative bg-white rounded-2xl border border-[#E5E1D8] overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#7D8471] cursor-pointer flex flex-col ${
        featured ? 'md:col-span-2 md:flex-row' : ''
      }`}
    >
      {/* Product Image Area */}
      <div className={`relative overflow-hidden bg-[#F2EFE9] ${featured ? 'md:w-1/2 aspect-square md:aspect-auto' : 'aspect-square'}`}>
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="px-2.5 py-1 bg-[#3D4238] text-[#EBE7DF] text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">
              Bestseller
            </span>
          )}
          {product.discountPercentage > 0 && (
            <span className="px-2.5 py-1 bg-[#9E5A44] text-white text-[10px] font-bold tracking-wider rounded-md shadow-sm">
              {product.discountPercentage}% Off
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2.5 py-1 bg-[#4A5043] text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">
              New Arrival
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          id={`product-wishlist-${product.id}`}
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
            isWishlisted 
              ? 'bg-[#9E5A44] text-white shadow-md' 
              : 'bg-white/90 backdrop-blur-sm text-[#4A5043] hover:bg-white hover:text-[#9E5A44] shadow-sm'
          }`}
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Quick Actions Hover Bar */}
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            id={`product-quickview-${product.id}`}
            onClick={handleQuickView}
            className="flex-1 py-2 px-2 bg-white/95 backdrop-blur-sm text-[#2C2C2C] rounded-lg text-xs font-semibold shadow-md hover:bg-white hover:text-[#4A5043] transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
          <button
            id={`product-add-board-${product.id}`}
            onClick={handleAddToBoard}
            className="p-2 bg-[#3D4238] text-[#EBE7DF] rounded-lg shadow-md hover:bg-[#4A5043] transition-colors"
            title="Stage in 2D Room Visualizer"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Details Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category and Rating */}
          <div className="flex items-center justify-between gap-2 mb-1.5 text-xs">
            <span className="text-[#4A5043] font-bold tracking-wider uppercase text-[10px]">
              {product.categoryName}
            </span>
            <div className="flex items-center gap-1 text-[#4A5043]">
              <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
              <span className="font-bold text-xs">{product.rating}</span>
              <span className="text-[#7A756D] text-[11px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-serif-luxury text-base font-semibold text-[#2C2C2C] group-hover:text-[#4A5043] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Materials & Dimensions Tag */}
          <p className="text-xs text-[#7A756D] mt-1 line-clamp-1">
            {product.materials.split(',')[0]} • {product.dimensions.formatted.split('(')[0]}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-[#F2EFE9] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-[#2C2C2C]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-[#A8A29A] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {product.stock <= 4 && product.stock > 0 && (
              <span className="text-[10px] text-amber-800 font-medium">
                Only {product.stock} left in stock
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            id={`product-add-cart-${product.id}`}
            onClick={handleAddToCart}
            className="px-3.5 py-2 bg-[#3D4238] text-white rounded-full text-xs font-semibold hover:bg-[#4A5043] transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
