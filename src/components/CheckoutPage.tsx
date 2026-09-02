import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle, 
  ArrowLeft, 
  ShoppingBag, 
  Lock 
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    cartTax, 
    cartDiscount, 
    cartTotal, 
    placeOrder, 
    setCurrentView, 
    formatPrice,
    appliedCoupon 
  } = useStore();

  const [step, setStep] = useState<'address' | 'delivery' | 'payment'>('address');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: 'Arjun Nambiar',
    phone: '+91 98450 12345',
    addressLine1: '402, Renaissance Exotica, 15th Main',
    addressLine2: 'Indiranagar Phase 2',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    country: 'India'
  });

  const [deliverySlot, setDeliverySlot] = useState({
    date: 'Fri, Sep 5, 2026',
    timeWindow: '10:00 AM - 01:00 PM (Morning Slot)',
    instructions: 'Ring bell 402. Service elevator available on West Wing.'
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | 'emi'>('upi');
  const [upiId, setUpiId] = useState('arjun@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8910');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('•••');
  const [isProcessing, setIsProcessing] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center bg-[#FAF8F5] min-h-screen">
        <h2 className="font-serif-luxury text-2xl font-bold text-[#1F1D1A]">Your checkout bag is empty</h2>
        <p className="text-xs text-[#7A7167] mt-1">Add items to your cart before proceeding to checkout.</p>
        <button
          onClick={() => setCurrentView('shop')}
          className="mt-4 px-6 py-2.5 bg-[#24211E] text-white rounded-xl text-xs font-bold"
        >
          Return to Catalogue
        </button>
      </div>
    );
  }

  const handleCompleteOrder = async () => {
    setIsProcessing(true);
    await placeOrder({
      shippingAddress,
      paymentMethod,
      deliverySlot
    });
    setIsProcessing(false);
  };

  return (
    <div id="checkout-page" className="py-8 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E8E1D7]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('shop')}
              className="p-2 rounded-full bg-white border border-[#E0D7CB] text-[#4A4239] hover:bg-[#F4EFEA]"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F1D1A]">
                Secure Luxury Checkout
              </h1>
              <span className="text-xs text-[#7A7167]">White-Glove In-Home Delivery & Installation</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Form Modules (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* STEP 1: SHIPPING ADDRESS */}
            <div className={`bg-white rounded-3xl p-6 border transition-all ${
              step === 'address' ? 'border-[#8C5D33] shadow-md ring-2 ring-[#8C5D33]/15' : 'border-[#E8E1D7]'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#24211E] text-[#D4A373] flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <h3 className="font-serif-luxury font-bold text-base text-[#1F1D1A]">
                    Delivery & Installation Address
                  </h3>
                </div>
                {step !== 'address' && (
                  <button
                    onClick={() => setStep('address')}
                    className="text-xs font-bold text-[#8C5D33] hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              {step === 'address' ? (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#1F1D1A] block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={shippingAddress.fullName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                        className="w-full bg-[#FAF8F5] border border-[#D8CABE] rounded-lg px-3 py-2 text-xs text-[#1F1D1A]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#1F1D1A] block mb-1">Phone Number (For Delivery Driver)</label>
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        className="w-full bg-[#FAF8F5] border border-[#D8CABE] rounded-lg px-3 py-2 text-xs text-[#1F1D1A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#1F1D1A] block mb-1">Apartment / Villa & Street Address</label>
                    <input
                      type="text"
                      value={shippingAddress.addressLine1}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#D8CABE] rounded-lg px-3 py-2 text-xs text-[#1F1D1A]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#1F1D1A] block mb-1">City</label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        className="w-full bg-[#FAF8F5] border border-[#D8CABE] rounded-lg px-3 py-2 text-xs text-[#1F1D1A]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#1F1D1A] block mb-1">State</label>
                      <input
                        type="text"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        className="w-full bg-[#FAF8F5] border border-[#D8CABE] rounded-lg px-3 py-2 text-xs text-[#1F1D1A]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#1F1D1A] block mb-1">PIN Code</label>
                      <input
                        type="text"
                        value={shippingAddress.pincode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                        className="w-full bg-[#FAF8F5] border border-[#D8CABE] rounded-lg px-3 py-2 text-xs text-[#1F1D1A]"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('delivery')}
                    className="mt-2 px-6 py-2.5 bg-[#24211E] text-white rounded-xl text-xs font-bold hover:bg-[#3E3833]"
                  >
                    Continue to Delivery Time Slot
                  </button>
                </div>
              ) : (
                <p className="text-xs text-[#6B6156]">
                  {shippingAddress.fullName} • {shippingAddress.phone} <br />
                  {shippingAddress.addressLine1}, {shippingAddress.city}, {shippingAddress.pincode}
                </p>
              )}
            </div>

            {/* STEP 2: DELIVERY SLOT & STAGING INSTRUCTIONS */}
            <div className={`bg-white rounded-3xl p-6 border transition-all ${
              step === 'delivery' ? 'border-[#8C5D33] shadow-md ring-2 ring-[#8C5D33]/15' : 'border-[#E8E1D7]'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#24211E] text-[#D4A373] flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <h3 className="font-serif-luxury font-bold text-base text-[#1F1D1A]">
                    White-Glove Appointment Slot
                  </h3>
                </div>
                {step !== 'delivery' && (
                  <button
                    onClick={() => setStep('delivery')}
                    className="text-xs font-bold text-[#8C5D33] hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              {step === 'delivery' ? (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#1F1D1A] block mb-1">Preferred Date</label>
                      <select
                        value={deliverySlot.date}
                        onChange={(e) => setDeliverySlot({ ...deliverySlot, date: e.target.value })}
                        className="w-full bg-[#FAF8F5] border border-[#D8CABE] rounded-lg px-3 py-2 text-xs text-[#1F1D1A]"
                      >
                        <option value="Fri, Sep 5, 2026">Fri, Sep 5, 2026 (Earliest Slot)</option>
                        <option value="Sat, Sep 6, 2026">Sat, Sep 6, 2026 (Weekend Slot)</option>
                        <option value="Sun, Sep 7, 2026">Sun, Sep 7, 2026 (Weekend Slot)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#1F1D1A] block mb-1">Time Window</label>
                      <select
                        value={deliverySlot.timeWindow}
                        onChange={(e) => setDeliverySlot({ ...deliverySlot, timeWindow: e.target.value })}
                        className="w-full bg-[#FAF8F5] border border-[#D8CABE] rounded-lg px-3 py-2 text-xs text-[#1F1D1A]"
                      >
                        <option value="10:00 AM - 01:00 PM (Morning Slot)">10:00 AM - 01:00 PM (Morning Slot)</option>
                        <option value="02:00 PM - 05:00 PM (Afternoon Slot)">02:00 PM - 05:00 PM (Afternoon Slot)</option>
                        <option value="05:00 PM - 08:00 PM (Evening Slot)">05:00 PM - 08:00 PM (Evening Slot)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#1F1D1A] block mb-1">Special Room Placement Notes</label>
                    <textarea
                      rows={2}
                      value={deliverySlot.instructions}
                      onChange={(e) => setDeliverySlot({ ...deliverySlot, instructions: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#D8CABE] rounded-lg p-2.5 text-xs text-[#1F1D1A]"
                    ></textarea>
                  </div>

                  <button
                    onClick={() => setStep('payment')}
                    className="mt-2 px-6 py-2.5 bg-[#24211E] text-white rounded-xl text-xs font-bold hover:bg-[#3E3833]"
                  >
                    Proceed to Payment Method
                  </button>
                </div>
              ) : (
                <p className="text-xs text-[#6B6156]">
                  {deliverySlot.date} • {deliverySlot.timeWindow}
                </p>
              )}
            </div>

            {/* STEP 3: PAYMENT METHOD */}
            <div className={`bg-white rounded-3xl p-6 border transition-all ${
              step === 'payment' ? 'border-[#8C5D33] shadow-md ring-2 ring-[#8C5D33]/15' : 'border-[#E8E1D7]'
            }`}>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-full bg-[#24211E] text-[#D4A373] flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <h3 className="font-serif-luxury font-bold text-base text-[#1F1D1A]">
                  Payment Method
                </h3>
              </div>

              {step === 'payment' && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                        paymentMethod === 'upi' ? 'border-[#8C5D33] bg-[#FAF6F0] text-[#8C5D33]' : 'border-[#E8E1D7] text-[#52493F]'
                      }`}
                    >
                      Instant UPI
                    </button>
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                        paymentMethod === 'card' ? 'border-[#8C5D33] bg-[#FAF6F0] text-[#8C5D33]' : 'border-[#E8E1D7] text-[#52493F]'
                      }`}
                    >
                      Credit / Debit Card
                    </button>
                    <button
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                        paymentMethod === 'netbanking' ? 'border-[#8C5D33] bg-[#FAF6F0] text-[#8C5D33]' : 'border-[#E8E1D7] text-[#52493F]'
                      }`}
                    >
                      Net Banking
                    </button>
                    <button
                      onClick={() => setPaymentMethod('emi')}
                      className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                        paymentMethod === 'emi' ? 'border-[#8C5D33] bg-[#FAF6F0] text-[#8C5D33]' : 'border-[#E8E1D7] text-[#52493F]'
                      }`}
                    >
                      No-Cost EMI
                    </button>
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E1D7]">
                      <label className="text-xs font-bold text-[#1F1D1A] block mb-1">UPI ID / VPA</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@okhdfcbank"
                        className="w-full bg-white border border-[#D8CABE] rounded-lg px-3 py-2 text-xs text-[#1F1D1A]"
                      />
                      <p className="text-[10px] text-[#7A7167] mt-1">
                        A payment request will be triggered to your Google Pay / PhonePe / CRED app.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E1D7] space-y-3">
                      <div>
                        <label className="text-xs font-bold text-[#1F1D1A] block mb-1">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-white border border-[#D8CABE] rounded-lg px-3 py-2 text-xs text-[#1F1D1A]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-[#1F1D1A] block mb-1">Expiry Date</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full bg-white border border-[#D8CABE] rounded-lg px-3 py-2 text-xs text-[#1F1D1A]"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-[#1F1D1A] block mb-1">CVV</label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full bg-white border border-[#D8CABE] rounded-lg px-3 py-2 text-xs text-[#1F1D1A]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    id="place-order-submit-btn"
                    onClick={handleCompleteOrder}
                    disabled={isProcessing}
                    className="w-full py-4 bg-[#24211E] text-[#FAF8F5] rounded-xl font-bold text-sm hover:bg-[#3E3833] hover:text-[#D4A373] transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-5 h-5 text-[#D4A373]" />
                    <span>{isProcessing ? 'Authorizing Payment...' : `Authorize & Place Order (${formatPrice(cartTotal)})`}</span>
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Right Summary Area (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-[#E8E1D7] shadow-sm space-y-4">
              <h3 className="font-serif-luxury font-bold text-base text-[#1F1D1A] pb-3 border-b border-[#F0EAE1]">
                Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-[#F0EAE1]">
                {cart.map((i) => (
                  <div key={`${i.productId}-${i.selectedColor}`} className="pt-2.5 first:pt-0 flex items-center gap-3">
                    <img
                      src={i.product.images[0]}
                      alt={i.product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-[#F7F4EF] border border-[#E8E1D7] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-xs text-[#1F1D1A] truncate">{i.product.name}</h5>
                      <span className="text-[11px] text-[#7A7167]">Qty: {i.quantity}</span>
                    </div>
                    <span className="text-xs font-bold text-[#1F1D1A]">{formatPrice(i.price * i.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#F0EAE1] space-y-2 text-xs">
                <div className="flex justify-between text-[#6B6156]">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartSubtotal)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount</span>
                    <span>- {formatPrice(cartDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6B6156]">
                  <span>GST (18%)</span>
                  <span>{formatPrice(cartTax)}</span>
                </div>
                <div className="flex justify-between text-[#6B6156]">
                  <span>White-Glove Delivery</span>
                  <span className="text-emerald-800 font-bold">FREE</span>
                </div>
                <div className="pt-2 border-t border-[#E8DEC8] flex justify-between text-base font-bold text-[#1F1D1A]">
                  <span>Total Payable</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DEC8] text-xs text-[#5C5348] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#1F1D1A]">
                <Truck className="w-4 h-4 text-[#8C5D33]" />
                <span>M.G.R White-Glove Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Includes safe unboxing, professional assembly by factory-trained artisans, level alignment, and complete removal of all packaging materials.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
