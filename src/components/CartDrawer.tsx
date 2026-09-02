import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Tag, 
  Check 
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    cartSubtotal, 
    cartTax, 
    cartDiscount, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon, 
    cartTotal, 
    setCurrentView, 
    formatPrice 
  } = useStore();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setIsApplyingCoupon(true);
    await applyCoupon(couponCodeInput.trim());
    setCouponCodeInput('');
    setIsApplyingCoupon(false);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const freeDeliveryThreshold = 50000;
  const progressToFreeDelivery = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));
  const amountNeeded = Math.max(0, freeDeliveryThreshold - cartSubtotal);

  return (
    <div id="cart-drawer-backdrop" className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        id="cart-drawer"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#E8E1D7] animate-in slide-in-from-right duration-300"
      >
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E8E1D7] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#8C5D33]" />
            <h3 className="font-serif-luxury font-bold text-lg text-[#1F1D1A]">
              Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>
          <button
            id="close-cart-btn"
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full bg-white border border-[#E0D7CB] flex items-center justify-center text-[#554C42] hover:bg-[#F2ECE3] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-3 bg-[#FAF6F0] border-b border-[#E8DEC8]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#52493F]">
              {amountNeeded > 0 ? (
                <>Add <span className="font-bold text-[#8C5D33]">{formatPrice(amountNeeded)}</span> for Free White-Glove Installation</>
              ) : (
                <span className="font-bold text-emerald-800 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Unlocked: Complimentary White-Glove Assembly!
                </span>
              )}
            </span>
            <span className="font-bold text-xs text-[#1F1D1A]">{progressToFreeDelivery}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#E8DEC8] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#8C5D33] rounded-full transition-all duration-500"
              style={{ width: `${progressToFreeDelivery}%` }}
            ></div>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-[#F0EAE1]">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={`${item.productId}-${item.selectedColor}`} className="pt-4 first:pt-0 flex gap-4 group">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-xl object-cover bg-[#F7F4EF] border border-[#E8E1D7] shrink-0"
                />
                
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif-luxury font-bold text-sm text-[#1F1D1A] truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-[#7A7167]">
                      {item.selectedColor ? `Finish: ${item.selectedColor}` : item.product.materials.split(',')[0]}
                    </p>
                    <p className="text-xs font-bold text-[#1F1D1A] mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-[#D8CABE] rounded-md bg-[#FAF8F5]">
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                        className="px-2.5 py-0.5 text-xs font-bold text-[#4A4239] hover:bg-[#EFE8DE]"
                      >
                        -
                      </button>
                      <span className="px-3 py-0.5 text-xs font-bold text-[#1F1D1A]">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                        className="px-2.5 py-0.5 text-xs font-bold text-[#4A4239] hover:bg-[#EFE8DE]"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-500 hover:text-red-700 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#8C5D33] mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h4 className="font-serif-luxury font-bold text-base text-[#1F1D1A]">Your cart is empty</h4>
              <p className="text-xs text-[#7A7167] max-w-xs mx-auto">
                Explore our handcrafted living room, bedroom, and dining collections.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCurrentView('shop');
                }}
                className="mt-2 px-5 py-2 bg-[#24211E] text-white rounded-lg text-xs font-bold"
              >
                Browse Catalogue
              </button>
            </div>
          )}
        </div>

        {/* Footer & Checkout Area */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#E8E1D7] bg-[#FAF8F5] space-y-4">
            
            {/* Coupon Code Input */}
            {appliedCoupon ? (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                  <Tag className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{appliedCoupon.code} applied ({appliedCoupon.discountPercentage}% Off)</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-emerald-800 hover:underline text-[11px] font-bold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value)}
                  placeholder="Coupon (e.g. MGR2026, LUXE15)"
                  className="flex-1 bg-white border border-[#D8CABE] rounded-lg px-3 py-1.5 text-xs text-[#1F1D1A] uppercase focus:outline-none focus:border-[#8C5D33]"
                />
                <button
                  type="submit"
                  disabled={isApplyingCoupon}
                  className="px-3.5 py-1.5 bg-[#8C5D33] text-white rounded-lg text-xs font-bold hover:bg-[#6E4420] transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#6B6156]">
                <span>Subtotal</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Special Discount</span>
                  <span>- {formatPrice(cartDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#6B6156]">
                <span>Estimated GST (18%)</span>
                <span>{formatPrice(cartTax)}</span>
              </div>

              <div className="flex justify-between text-[#6B6156]">
                <span>White-Glove Delivery & Staging</span>
                <span className="text-emerald-700 font-bold">FREE</span>
              </div>

              <div className="pt-2 border-t border-[#E8DEC8] flex justify-between text-sm font-bold text-[#1F1D1A]">
                <span>Total Amount</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              id="drawer-checkout-btn"
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 bg-[#24211E] text-white rounded-xl text-xs font-bold hover:bg-[#3E3833] hover:text-[#D4A373] transition-all flex items-center justify-center gap-2 shadow-md active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
