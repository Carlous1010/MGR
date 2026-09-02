import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  CheckCircle2, 
  Truck, 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Download, 
  Share2, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { currentOrder, setCurrentView, formatPrice, setSelectedTrackingOrder } = useStore();

  if (!currentOrder) {
    return (
      <div className="py-20 text-center bg-[#FAF8F5] min-h-screen">
        <h2 className="font-serif-luxury text-2xl font-bold text-[#1F1D1A]">No active order details</h2>
        <button
          onClick={() => setCurrentView('shop')}
          className="mt-4 px-6 py-2 bg-[#24211E] text-white rounded-xl text-xs font-bold"
        >
          Explore Catalogue
        </button>
      </div>
    );
  }

  const handleTrackOrder = () => {
    setSelectedTrackingOrder(currentOrder);
    setCurrentView('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="order-confirmation-page" className="py-12 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Celebration Header */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8E1D7] shadow-xl text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-[#FAF0E4] text-[#8C5D33] text-xs font-bold uppercase tracking-wider">
            Order Confirmed & Artisan Queue Assigned
          </span>

          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#1F1D1A]">
            Thank You For Your Order
          </h1>

          <p className="text-xs sm:text-sm text-[#6B6156] max-w-lg mx-auto leading-relaxed">
            Your heirloom furniture pieces have entered our quality finishing and logistics queue. A confirmation email and SMS dispatch updates have been dispatched to your mobile.
          </p>

          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E0D7CB] text-xs">
            <span className="text-[#7A7167]">Order Reference:</span>
            <span className="font-bold font-mono text-[#1F1D1A] text-sm">{currentOrder.orderNumber}</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="confirm-track-btn"
              onClick={handleTrackOrder}
              className="w-full sm:w-auto px-6 py-3 bg-[#24211E] text-[#FAF8F5] rounded-xl text-xs font-bold hover:bg-[#3E3833] hover:text-[#D4A373] transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Delivery Status</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3 bg-white text-[#38332E] border border-[#D8CABE] rounded-xl text-xs font-bold hover:bg-[#FAF8F5] transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Order Details Breakdown */}
        <div className="mt-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E1D7] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE1]">
            <h3 className="font-serif-luxury font-bold text-lg text-[#1F1D1A]">
              Items in this Shipment
            </h3>
            <span className="text-xs font-bold text-[#8C5D33]">
              {currentOrder.items.length} Handcrafted Pieces
            </span>
          </div>

          {/* Items */}
          <div className="divide-y divide-[#F0EAE1]">
            {currentOrder.items.map((item) => (
              <div key={item.id} className="py-3.5 first:pt-0 flex items-center gap-4">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-16 h-16 rounded-xl object-cover bg-[#F7F4EF] border border-[#E8E1D7] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif-luxury font-bold text-sm text-[#1F1D1A] truncate">
                    {item.productName}
                  </h4>
                  <p className="text-[11px] text-[#7A7167]">
                    Qty: {item.quantity} {item.selectedColor ? `• Finish: ${item.selectedColor}` : ''}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#1F1D1A]">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Delivery & Address Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#F0EAE1] text-xs">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D7] space-y-1">
              <span className="font-bold text-[#8C5D33] uppercase text-[10px] block">Shipping Destination</span>
              <p className="font-bold text-[#1F1D1A]">{currentOrder.shippingAddress.fullName}</p>
              <p className="text-[#635A50]">{currentOrder.shippingAddress.addressLine1}</p>
              <p className="text-[#635A50]">{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.pincode}</p>
              <p className="text-[#7A7167] text-[11px]">{currentOrder.shippingAddress.phone}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D7] space-y-1">
              <span className="font-bold text-[#8C5D33] uppercase text-[10px] block">Scheduled Installation</span>
              <p className="font-bold text-[#1F1D1A] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#8C5D33]" />
                <span>{currentOrder.deliverySlot.date}</span>
              </p>
              <p className="text-[#635A50] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#8C5D33]" />
                <span>{currentOrder.deliverySlot.timeWindow}</span>
              </p>
              <p className="text-emerald-800 font-bold text-[11px] pt-1">Complimentary White-Glove In-Home Placement</p>
            </div>
          </div>

          {/* Grand Total */}
          <div className="pt-4 border-t border-[#F0EAE1] flex items-center justify-between text-sm">
            <span className="text-[#6B6156]">Total Paid ({currentOrder.paymentMethod.toUpperCase()})</span>
            <span className="text-xl font-bold text-[#1F1D1A]">{formatPrice(currentOrder.totalAmount)}</span>
          </div>

        </div>

      </div>
    </div>
  );
};
