import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Heart, 
  ShoppingBag, 
  Layers, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  MapPin, 
  Sparkles,
  ArrowLeft,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { ProductCard } from './ProductCard';

export const ProductDetailsPage: React.FC = () => {
  const { 
    selectedProduct, 
    setCurrentView, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    addItemToBoard,
    products, 
    formatPrice,
    showToast,
    setIsCartOpen
  } = useStore();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>(selectedProduct?.availableColors[0]?.name || selectedProduct?.color || '');
  const [quantity, setQuantity] = useState(1);
  const [pincodeInput, setPincodeInput] = useState('560066');
  const [pincodeResult, setPincodeResult] = useState<any>({
    serviceable: true,
    estimatedDays: 3,
    estimatedDeliveryDate: 'Fri, Sep 5',
    hubName: 'Bengaluru Express Fulfillment Hub'
  });
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'dimensions' | 'care' | 'reviews'>('specs');
  
  // Review submission state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [localReviews, setLocalReviews] = useState<any[]>([
    {
      id: 'r1',
      userName: 'Vikram Malhotra',
      rating: 5,
      title: 'Exceeded our expectations in craftsmanship!',
      comment: 'The solid walnut base and bouclé texture are even more gorgeous in person. The cushions have the perfect balance of cloud-like softness and lumbar support.',
      date: 'Aug 20, 2026',
      verified: true
    },
    {
      id: 'r2',
      userName: 'Ananya Deshmukh',
      rating: 5,
      title: 'Flawless white-glove delivery',
      comment: 'Delivered exactly on our chosen time slot. The technicians assembled the legs and positioned it in our living room with zero mess.',
      date: 'Aug 24, 2026',
      verified: true
    }
  ]);

  if (!selectedProduct) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-[#7A7167]">No product selected.</p>
        <button
          onClick={() => setCurrentView('shop')}
          className="mt-4 px-6 py-2 bg-[#24211E] text-white rounded-lg text-xs font-bold"
        >
          Return to Catalogue
        </button>
      </div>
    );
  }

  const isWishlisted = isInWishlist(selectedProduct.id);
  const relatedProducts = products
    .filter(p => p.id !== selectedProduct.id && (p.category === selectedProduct.category || p.style === selectedProduct.style))
    .slice(0, 4);

  const handlePincodeCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincodeInput) return;
    setIsCheckingPincode(true);
    try {
      const res = await fetch('/api/pincode/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pincode: pincodeInput })
      });
      const data = await res.json();
      if (data.success) {
        setPincodeResult(data);
        showToast(`Delivery available for PIN ${pincodeInput}!`, 'success');
      } else {
        setPincodeResult(null);
        showToast(data.message || 'Pincode not serviceable', 'error');
      }
    } catch {
      showToast('Error checking pincode', 'error');
    } finally {
      setIsCheckingPincode(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, selectedColor);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity, selectedColor);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStageInRoom = () => {
    addItemToBoard(selectedProduct);
    setCurrentView('visualizer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${selectedProduct.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: reviewName,
          rating: reviewRating,
          comment: reviewComment,
          title: 'Verified Homeowner Feedback'
        })
      });
      const data = await res.json();
      if (data.success && data.review) {
        setLocalReviews([data.review, ...localReviews]);
        setReviewName('');
        setReviewComment('');
        showToast('Thank you! Your verified review has been published.', 'success');
      }
    } catch {
      showToast('Error submitting review', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div id="product-details-page" className="py-8 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#7A7167] mb-6">
          <button 
            onClick={() => setCurrentView('home')} 
            className="hover:text-[#1F1D1A] transition-colors"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button 
            onClick={() => setCurrentView('shop')} 
            className="hover:text-[#1F1D1A] transition-colors"
          >
            Catalogue
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#8C5D33] font-semibold">{selectedProduct.categoryName}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#1F1D1A] font-medium truncate max-w-xs">{selectedProduct.name}</span>
        </div>

        {/* Product Main Showcase Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E1D7] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Image Gallery (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Thumbnails list */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[540px]">
              {selectedProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  id={`gallery-thumb-${idx}`}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIdx === idx 
                      ? 'border-[#8C5D33] ring-2 ring-[#8C5D33]/20 shadow-md' 
                      : 'border-[#EAE2D7] opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${selectedProduct.name} view ${idx+1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Active Image with Zoom Area */}
            <div className="flex-1 relative aspect-square sm:aspect-auto sm:min-h-[500px] rounded-2xl overflow-hidden bg-[#F6F2EB] border border-[#EAE2D7]">
              <img
                src={selectedProduct.images[activeImageIdx] || selectedProduct.images[0]}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {selectedProduct.isBestSeller && (
                  <span className="px-3 py-1 bg-[#24211E] text-[#D4A373] text-xs font-bold uppercase tracking-wider rounded-md shadow-md">
                    Bestseller
                  </span>
                )}
                {selectedProduct.discountPercentage > 0 && (
                  <span className="px-3 py-1 bg-[#B85D43] text-white text-xs font-bold rounded-md shadow-md">
                    {selectedProduct.discountPercentage}% Off
                  </span>
                )}
              </div>

              {/* Stage in Room Floating Trigger */}
              <button
                id="details-stage-in-room-btn"
                onClick={handleStageInRoom}
                className="absolute bottom-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-md text-[#24211E] border border-[#D8CABE] rounded-xl text-xs font-bold shadow-lg hover:bg-white flex items-center gap-2 transition-all hover:scale-105"
              >
                <Layers className="w-4 h-4 text-[#D4A373]" />
                <span>Stage in 2D Room Stager</span>
              </button>
            </div>

          </div>

          {/* Right Column: Product Config & Purchase Options (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              {/* Category, Style & Rating */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-[#8C5D33] font-bold uppercase tracking-wider">
                  {selectedProduct.categoryName} • {selectedProduct.style}
                </span>
                <div className="flex items-center gap-1.5 text-[#3A332B] font-bold">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{selectedProduct.rating}</span>
                  <span className="text-[#8C8378] font-normal">({selectedProduct.reviewCount} Verified Reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F1D1A] mt-2 leading-tight">
                {selectedProduct.name}
              </h1>

              {/* Short Description */}
              <p className="text-xs text-[#6E6459] mt-2.5 leading-relaxed">
                {selectedProduct.shortDescription}
              </p>

              {/* Price & Tax Row */}
              <div className="mt-4 pt-4 border-t border-[#F0EAE1]">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-bold text-[#1F1D1A]">
                    {formatPrice(selectedProduct.price)}
                  </span>
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <span className="text-base text-[#8C8378] line-through">
                      {formatPrice(selectedProduct.originalPrice)}
                    </span>
                  )}
                  {selectedProduct.discountPercentage > 0 && (
                    <span className="text-xs font-bold text-[#B85D43]">
                      Save {formatPrice(selectedProduct.originalPrice - selectedProduct.price)} ({selectedProduct.discountPercentage}% Off)
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#8C8378] mt-1">
                  Inclusive of all taxes (18% GST). Complimentary White-Glove in-home installation included.
                </p>
              </div>

              {/* Color Swatches */}
              {selectedProduct.availableColors && selectedProduct.availableColors.length > 0 && (
                <div className="mt-5">
                  <span className="text-xs font-bold text-[#1F1D1A] block mb-2">
                    Select Finish / Fabric: <span className="text-[#8C5D33] font-normal">{selectedColor}</span>
                  </span>
                  <div className="flex items-center gap-2.5">
                    {selectedProduct.availableColors.map((color) => (
                      <button
                        key={color.name}
                        id={`color-swatch-${color.name.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => setSelectedColor(color.name)}
                        className={`group relative p-1 rounded-full border-2 transition-all ${
                          selectedColor === color.name ? 'border-[#8C5D33] ring-2 ring-[#8C5D33]/20' : 'border-transparent'
                        }`}
                        title={color.name}
                      >
                        <div
                          className="w-6 h-6 rounded-full border border-black/10 shadow-sm"
                          style={{ backgroundColor: color.hex }}
                        ></div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Stock */}
              <div className="mt-5 flex items-center gap-4">
                <div>
                  <span className="text-xs font-bold text-[#1F1D1A] block mb-1.5">Quantity</span>
                  <div className="flex items-center border border-[#D8CABE] rounded-lg bg-[#FAF8F5]">
                    <button
                      id="qty-decrease-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-sm font-bold text-[#4A4239] hover:bg-[#EFE8DE] transition-colors rounded-l-lg"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-bold text-[#1F1D1A]">{quantity}</span>
                    <button
                      id="qty-increase-btn"
                      onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                      className="px-3 py-1.5 text-sm font-bold text-[#4A4239] hover:bg-[#EFE8DE] transition-colors rounded-r-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  <span className="text-xs text-[#7A7167] block">Availability</span>
                  {selectedProduct.stock > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 mt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      In Stock ({selectedProduct.stock} Available in Bangalore Central)
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-red-600">Made to Order (2-3 Weeks)</span>
                  )}
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                <button
                  id="details-add-cart-btn"
                  onClick={handleAddToCart}
                  className="w-full sm:flex-1 py-3.5 bg-[#24211E] text-white rounded-xl font-bold text-xs hover:bg-[#3E3833] hover:text-[#D4A373] transition-all flex items-center justify-center gap-2 shadow-md active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4A373]" />
                  <span>Add to Shopping Cart</span>
                </button>

                <button
                  id="details-buy-now-btn"
                  onClick={handleBuyNow}
                  className="w-full sm:flex-1 py-3.5 bg-[#D4A373] text-[#1F1D1A] rounded-xl font-bold text-xs hover:bg-[#C28F5E] transition-all flex items-center justify-center gap-2 shadow-md active:scale-98"
                >
                  <span>Instant Checkout</span>
                </button>

                <button
                  id="details-wishlist-toggle"
                  onClick={() => toggleWishlist(selectedProduct)}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isWishlisted 
                      ? 'bg-[#B85D43] text-white border-[#B85D43]' 
                      : 'border-[#D8CABE] bg-white text-[#4A4239] hover:text-[#B85D43]'
                  }`}
                  title="Save to Idea Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                </button>
              </div>

              {/* Indian Pincode Delivery Availability Checker */}
              <div className="mt-6 p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DEC8]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1F1D1A] mb-2">
                  <Truck className="w-4 h-4 text-[#8C5D33]" />
                  <span>Check Delivery Date & In-Home Assembly</span>
                </div>

                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <input
                    id="details-pincode-input"
                    type="text"
                    maxLength={6}
                    value={pincodeInput}
                    onChange={(e) => setPincodeInput(e.target.value)}
                    placeholder="Enter 6-digit Pincode"
                    className="flex-1 bg-white border border-[#D8CABE] rounded-lg px-3 py-1.5 text-xs text-[#1F1D1A] focus:outline-none focus:border-[#8C5D33]"
                  />
                  <button
                    id="details-pincode-check-btn"
                    type="submit"
                    disabled={isCheckingPincode}
                    className="px-4 py-1.5 bg-[#8C5D33] text-white rounded-lg text-xs font-bold hover:bg-[#6E4420] transition-colors"
                  >
                    {isCheckingPincode ? 'Checking...' : 'Check'}
                  </button>
                </form>

                {pincodeResult && pincodeResult.serviceable && (
                  <div className="mt-3 text-xs text-[#52493F] space-y-1">
                    <p className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Delivery Available: Expected by {pincodeResult.estimatedDeliveryDate}</span>
                    </p>
                    <p className="text-[11px] text-[#7A7167]">
                      Dispatches from {pincodeResult.hubName}. Free white-glove assembly by 2 technicians included.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* Detailed Tabs (Specifications, Dimensions, Care, Reviews) */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E1D7] shadow-sm">
          <div className="flex items-center gap-6 border-b border-[#E8E1D7] pb-4 text-xs font-bold uppercase tracking-wider overflow-x-auto">
            <button
              id="tab-specs"
              onClick={() => setActiveTab('specs')}
              className={`pb-2 transition-colors whitespace-nowrap ${activeTab === 'specs' ? 'text-[#8C5D33] border-b-2 border-[#8C5D33]' : 'text-[#7A7167] hover:text-[#1F1D1A]'}`}
            >
              Specifications & Craftsmanship
            </button>
            <button
              id="tab-dimensions"
              onClick={() => setActiveTab('dimensions')}
              className={`pb-2 transition-colors whitespace-nowrap ${activeTab === 'dimensions' ? 'text-[#8C5D33] border-b-2 border-[#8C5D33]' : 'text-[#7A7167] hover:text-[#1F1D1A]'}`}
            >
              Dimensions & Weight
            </button>
            <button
              id="tab-care"
              onClick={() => setActiveTab('care')}
              className={`pb-2 transition-colors whitespace-nowrap ${activeTab === 'care' ? 'text-[#8C5D33] border-b-2 border-[#8C5D33]' : 'text-[#7A7167] hover:text-[#1F1D1A]'}`}
            >
              Warranty & Care Instructions
            </button>
            <button
              id="tab-reviews"
              onClick={() => setActiveTab('reviews')}
              className={`pb-2 transition-colors whitespace-nowrap ${activeTab === 'reviews' ? 'text-[#8C5D33] border-b-2 border-[#8C5D33]' : 'text-[#7A7167] hover:text-[#1F1D1A]'}`}
            >
              Verified Homeowner Reviews ({localReviews.length})
            </button>
          </div>

          {/* TAB 1: SPECIFICATIONS */}
          {activeTab === 'specs' && (
            <div className="pt-6 space-y-4">
              <p className="text-xs text-[#52493F] leading-relaxed max-w-3xl">
                {selectedProduct.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE2D7]">
                  <span className="text-[11px] font-bold text-[#8C5D33] uppercase">Primary Hardwoods & Upholstery</span>
                  <p className="text-xs font-bold text-[#1F1D1A] mt-1">{selectedProduct.materials}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE2D7]">
                  <span className="text-[11px] font-bold text-[#8C5D33] uppercase">Finish Technique</span>
                  <p className="text-xs font-bold text-[#1F1D1A] mt-1">{selectedProduct.finish}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE2D7]">
                  <span className="text-[11px] font-bold text-[#8C5D33] uppercase">Assembly Status</span>
                  <p className="text-xs font-bold text-[#1F1D1A] mt-1">{selectedProduct.assembly}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DIMENSIONS */}
          {activeTab === 'dimensions' && (
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-serif-luxury font-bold text-base text-[#1F1D1A]">Metric Dimensions</h4>
                <div className="divide-y divide-[#F0EAE1] text-xs">
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#7A7167]">Width (cm):</span>
                    <span className="font-bold text-[#1F1D1A]">{selectedProduct.dimensions.widthCm} cm</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#7A7167]">Depth / Length (cm):</span>
                    <span className="font-bold text-[#1F1D1A]">{selectedProduct.dimensions.depthCm} cm</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#7A7167]">Height (cm):</span>
                    <span className="font-bold text-[#1F1D1A]">{selectedProduct.dimensions.heightCm} cm</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#7A7167]">Net Item Weight:</span>
                    <span className="font-bold text-[#1F1D1A]">{selectedProduct.weightKg} kg</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D7] flex flex-col justify-center text-center">
                <span className="text-xs font-bold text-[#8C5D33] uppercase tracking-wider">Blueprint Format</span>
                <p className="font-serif-luxury text-2xl font-bold text-[#1F1D1A] mt-2">
                  {selectedProduct.dimensions.formatted}
                </p>
                <p className="text-xs text-[#7A7167] mt-1">
                  Ensure doorway clearance exceeds {selectedProduct.dimensions.depthCm} cm for seamless delivery.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: CARE & WARRANTY */}
          {activeTab === 'care' && (
            <div className="pt-6 space-y-6">
              <div>
                <h4 className="font-serif-luxury font-bold text-sm text-[#1F1D1A] mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#8C5D33]" />
                  <span>M.G.R Comprehensive Warranty</span>
                </h4>
                <p className="text-xs text-[#52493F] leading-relaxed">
                  {selectedProduct.warranty}. Covers frame joinery, seasonal wood stability, and internal foam resilience.
                </p>
              </div>

              <div>
                <h4 className="font-serif-luxury font-bold text-sm text-[#1F1D1A] mb-2">
                  Maintenance & Preservation
                </h4>
                <p className="text-xs text-[#52493F] leading-relaxed">
                  {selectedProduct.careInstructions}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: VERIFIED REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="pt-6 space-y-8">
              {/* Existing Reviews List */}
              <div className="space-y-4">
                {localReviews.map((rev) => (
                  <div key={rev.id} className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D7] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#1F1D1A]">{rev.userName}</span>
                        {rev.verified && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Verified Homeowner
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#8C8378]">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>

                    <h5 className="font-serif-luxury font-bold text-sm text-[#1F1D1A]">{rev.title}</h5>
                    <p className="text-xs text-[#635A50] leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>

              {/* Write a Review Form */}
              <div className="p-6 rounded-2xl bg-[#FAF6F0] border border-[#E8DEC8]">
                <h4 className="font-serif-luxury font-bold text-base text-[#1F1D1A] mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#8C5D33]" />
                  <span>Write a Verified Customer Review</span>
                </h4>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#1F1D1A] block mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className="w-full bg-white border border-[#D8CABE] rounded-lg px-3 py-2 text-xs text-[#1F1D1A]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#1F1D1A] block mb-1">Star Rating</label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="w-full bg-white border border-[#D8CABE] rounded-lg px-3 py-2 text-xs text-[#1F1D1A]"
                      >
                        <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                        <option value={4}>★★★★☆ (4 Stars - Great)</option>
                        <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#1F1D1A] block mb-1">Review & Feedback</label>
                    <textarea
                      rows={3}
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience with the wood grain, comfort, dimensions, and delivery..."
                      className="w-full bg-white border border-[#D8CABE] rounded-lg p-3 text-xs text-[#1F1D1A]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-6 py-2.5 bg-[#24211E] text-white rounded-xl text-xs font-bold hover:bg-[#3E3833] transition-colors shadow-sm"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Related Pieces Showcase */}
        <div className="mt-16">
          <div className="mb-6 pb-2 border-b border-[#E8E1D7]">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C5D33]">
              Curated Pairing
            </span>
            <h3 className="font-serif-luxury text-2xl font-bold text-[#1F1D1A] mt-1">
              Pieces That Style Effortlessly With This
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
