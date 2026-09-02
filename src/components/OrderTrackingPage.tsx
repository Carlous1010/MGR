import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Truck, 
  Search, 
  CheckCircle2, 
  Clock, 
  Package, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Layers,
  ArrowRight
} from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { orders, selectedTrackingOrder, setSelectedTrackingOrder, formatPrice } = useStore();
  const [searchOrderNumber, setSearchOrderNumber] = useState(selectedTrackingOrder?.orderNumber || 'MGR-20260902-8841');
  const [activeOrder, setActiveOrder] = useState<any>(selectedTrackingOrder || orders[0] || null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(o => o.orderNumber.toLowerCase() === searchOrderNumber.trim().toLowerCase());
    if (found) {
      setActiveOrder(found);
      setSelectedTrackingOrder(found);
    }
  };

  const stages = [
    { key: 'placed', label: 'Order Confirmed', desc: 'Artisan order acknowledged & hardwood timber allotted' },
    { key: 'processing', label: 'Handcrafted & QC Checked', desc: 'Joinery completed, sanded, finished, and passed 12-point inspection' },
    { key: 'shipped', label: 'Dispatched in Air-Suspension Fleet', desc: 'Securely packaged and in transit to local fulfillment hub' },
    { key: 'out_for_delivery', label: 'Out for In-Home Staging', desc: '2 White-Glove technicians en route with assembly tools' },
    { key: 'delivered', label: 'Delivered & Assembled', desc: 'In-home placement complete and inspected with homeowner' }
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'placed': return 0;
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      default: return 1;
    }
  };

  const currentIdx = activeOrder ? getStageIndex(activeOrder.status) : 1;

  return (
    <div id="order-tracking-page" className="py-8 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C5D33]">
            White-Glove Logistics
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#1F1D1A] mt-1">
            Track Your Furniture Delivery
          </h1>
          <p className="text-xs text-[#7A7167] mt-2">
            Real-time fulfillment tracking for handcrafted pieces and scheduled assembly technicians.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-[#E8E1D7] shadow-sm mb-8">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8C8378] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchOrderNumber}
                onChange={(e) => setSearchOrderNumber(e.target.value)}
                placeholder="Enter Order Reference (e.g. MGR-20260902-8841)"
                className="w-full bg-[#FAF8F5] border border-[#D8CABE] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1F1D1A] focus:outline-none focus:border-[#8C5D33]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#24211E] text-white rounded-xl text-xs font-bold hover:bg-[#3E3833] transition-colors shadow-sm"
            >
              Track Order
            </button>
          </form>
        </div>

        {/* Active Order Details View */}
        {activeOrder ? (
          <div className="space-y-6">
            
            {/* Status Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E1D7] shadow-md space-y-8">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0EAE1]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5D33]">
                    Order Reference
                  </span>
                  <h3 className="font-mono text-xl font-bold text-[#1F1D1A]">
                    {activeOrder.orderNumber}
                  </h3>
                  <span className="text-xs text-[#7A7167]">
                    Placed on {new Date(activeOrder.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <div className="flex flex-col sm:items-end">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5D33]">
                    Estimated Arrival & Assembly
                  </span>
                  <span className="font-serif-luxury text-base font-bold text-[#1F1D1A]">
                    {activeOrder.deliverySlot.date}
                  </span>
                  <span className="text-xs text-[#7A7167]">
                    {activeOrder.deliverySlot.timeWindow}
                  </span>
                </div>
              </div>

              {/* 5-Step Visual Timeline */}
              <div className="relative">
                <div className="space-y-8">
                  {stages.map((stg, idx) => {
                    const isCompleted = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div key={stg.key} className="flex items-start gap-4 relative">
                        {/* Connecting Line */}
                        {idx < stages.length - 1 && (
                          <div 
                            className={`absolute left-4 top-8 w-0.5 h-12 transition-colors ${
                              idx < currentIdx ? 'bg-emerald-600' : 'bg-[#E8E1D7]'
                            }`}
                          ></div>
                        )}

                        {/* Step Icon */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all shadow-sm ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#F2ECE3] text-[#8C8378] border border-[#D8CABE]'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>

                        {/* Step Text */}
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-center gap-2">
                            <h4 className={`text-sm font-bold ${isCurrent ? 'text-[#8C5D33]' : isCompleted ? 'text-[#1F1D1A]' : 'text-[#8C8378]'}`}>
                              {stg.label}
                            </h4>
                            {isCurrent && (
                              <span className="px-2 py-0.5 bg-[#FAF0E4] text-[#8C5D33] text-[9px] font-bold uppercase tracking-wider rounded-md animate-pulse">
                                In Progress
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#7A7167] mt-0.5">{stg.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Shipment Items List & Driver Contact Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Items in this Order */}
              <div className="bg-white rounded-3xl p-6 border border-[#E8E1D7] shadow-sm space-y-4">
                <h4 className="font-serif-luxury font-bold text-base text-[#1F1D1A] pb-3 border-b border-[#F0EAE1]">
                  Furniture In Shipment ({activeOrder.items.length})
                </h4>
                <div className="space-y-3">
                  {activeOrder.items.map((i: any) => (
                    <div key={i.id} className="flex items-center gap-3">
                      <img
                        src={i.productImage}
                        alt={i.productName}
                        className="w-12 h-12 rounded-lg object-cover bg-[#F7F4EF] border border-[#E8E1D7] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-xs text-[#1F1D1A] truncate">{i.productName}</h5>
                        <span className="text-[11px] text-[#7A7167]">Qty: {i.quantity} {i.selectedColor ? `• ${i.selectedColor}` : ''}</span>
                      </div>
                      <span className="text-xs font-bold text-[#1F1D1A]">{formatPrice(i.price * i.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* White Glove Technician Support */}
              <div className="bg-white rounded-3xl p-6 border border-[#E8E1D7] shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif-luxury font-bold text-base text-[#1F1D1A] pb-3 border-b border-[#F0EAE1]">
                    Installation Technicians
                  </h4>
                  <div className="mt-3 space-y-2 text-xs text-[#544C42]">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#8C5D33]" />
                      <span>Dedicated Fleet Lead: Ramesh & Team (+91 98451 99220)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#8C5D33]" />
                      <span>Dispatch Hub: Indiranagar Express Center</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#8C5D33]" />
                      <span>12-Point Structural Assembly Check Included</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#E8DEC8] text-[11px] text-[#7A7167]">
                  Need to reschedule your time slot? Call concierge at +91 (080) 4122-8900 24hrs before delivery.
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E1D7] shadow-sm">
            <p className="text-xs text-[#7A7167]">Order reference not found. Try searching for sample order: <span className="font-mono font-bold text-[#1F1D1A]">MGR-20260902-8841</span></p>
          </div>
        )}

      </div>
    </div>
  );
};
