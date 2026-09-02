import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Package, 
  Truck, 
  Users, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Search, 
  RefreshCw,
  Plus
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { products, orders, updateOrderStatus, formatPrice, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'leads'>('inventory');
  const [inventorySearch, setInventorySearch] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Sample consultation leads for studio
  const [leads, setLeads] = useState<any[]>([
    {
      id: 'lead-1',
      name: 'Dr. Vikram Malhotra',
      phone: '+91 98450 99882',
      email: 'vikram@apollohospitals.org',
      city: 'Bengaluru (Koramangala)',
      roomType: 'Master Bedroom & Walk-in Wardrobe',
      budgetRange: '₹5,00,000 - ₹10,00,000',
      status: 'Consultation Scheduled'
    },
    {
      id: 'lead-2',
      name: 'Rhea & Siddharth Roy',
      phone: '+91 97110 33441',
      email: 'rhea.roy@gmail.com',
      city: 'Bengaluru (Whitefield Villa)',
      roomType: 'Complete 4BHK Villa Interior',
      budgetRange: '₹10,00,000+',
      status: 'Site Measurement Pending'
    }
  ]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    p.categoryName.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const handleStatusChange = async (orderId: string, newStatus: any) => {
    await updateOrderStatus(orderId, newStatus);
  };

  return (
    <div id="admin-dashboard-page" className="py-8 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E8E1D7]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8C5D33]">
              <Package className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Studio Administration & Logistics Control</span>
            </div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F1D1A] mt-1">
              Operations & Inventory Manager
            </h1>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-xl border border-[#E8E1D7] shadow-sm">
              <span className="text-[10px] text-[#7A7167] block uppercase font-bold">Total Sales</span>
              <span className="text-sm font-bold text-[#1F1D1A]">{formatPrice(totalRevenue)}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl border border-[#E8E1D7] shadow-sm">
              <span className="text-[10px] text-[#7A7167] block uppercase font-bold">Live Orders</span>
              <span className="text-sm font-bold text-[#8C5D33]">{orders.length} Active</span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-3 mb-6 bg-white p-1.5 rounded-2xl border border-[#E8E1D7] shadow-sm w-fit">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'inventory' ? 'bg-[#24211E] text-[#D4A373] shadow-sm' : 'text-[#52493F] hover:bg-[#FAF8F5]'
            }`}
          >
            Inventory & Timber Stocks ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders' ? 'bg-[#24211E] text-[#D4A373] shadow-sm' : 'text-[#52493F] hover:bg-[#FAF8F5]'
            }`}
          >
            Fulfillment & Deliveries ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'leads' ? 'bg-[#24211E] text-[#D4A373] shadow-sm' : 'text-[#52493F] hover:bg-[#FAF8F5]'
            }`}
          >
            Interior Design Leads ({leads.length})
          </button>
        </div>

        {/* TAB 1: INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl p-6 border border-[#E8E1D7] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EAE1]">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-[#8C8378] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  placeholder="Filter stock by name or category..."
                  className="w-full bg-[#FAF8F5] border border-[#D8CABE] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1F1D1A]"
                />
              </div>

              <div className="text-xs text-[#7A7167]">
                Showing {filteredProducts.length} pieces in production and warehouse
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#F0EAE1] text-[#7A7167] uppercase font-bold text-[10px]">
                    <th className="pb-3">Product Piece</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Retail Price</th>
                    <th className="pb-3">Hardwood Material</th>
                    <th className="pb-3">Stock Units</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EAE1]">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-3 flex items-center gap-3">
                        <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-[#F7F4EF] border border-[#E8E1D7]" />
                        <span className="font-bold text-[#1F1D1A] line-clamp-1">{p.name}</span>
                      </td>
                      <td className="py-3 text-[#52493F]">{p.categoryName}</td>
                      <td className="py-3 font-bold text-[#1F1D1A]">{formatPrice(p.price)}</td>
                      <td className="py-3 text-[#52493F]">{p.materials.split(',')[0]}</td>
                      <td className="py-3 font-bold">
                        <span className={`px-2 py-0.5 rounded ${p.stock <= 4 ? 'bg-amber-100 text-amber-900' : 'bg-emerald-50 text-emerald-900'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3">
                        {p.stock > 0 ? (
                          <span className="text-emerald-700 font-bold">Ready to Dispatch</span>
                        ) : (
                          <span className="text-amber-700 font-bold">Made to Order</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ORDER FULFILLMENT & LOGISTICS CONTROL */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 border border-[#E8E1D7] shadow-sm space-y-6">
            <h3 className="font-serif-luxury font-bold text-lg text-[#1F1D1A] pb-4 border-b border-[#F0EAE1]">
              Live Orders & White-Glove Scheduling
            </h3>

            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D7] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8DEC8]">
                    <div>
                      <span className="font-mono font-bold text-sm text-[#1F1D1A]">{o.orderNumber}</span>
                      <span className="text-xs text-[#7A7167] ml-2">({o.items.length} items • {formatPrice(o.totalAmount)})</span>
                    </div>
                    
                    {/* Status Changer Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#7A7167]">Logistics Stage:</span>
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className="bg-white border border-[#D8CABE] rounded-lg px-2.5 py-1 text-xs font-bold text-[#1F1D1A]"
                      >
                        <option value="placed">1. Placed & Timber Allotted</option>
                        <option value="processing">2. Processing & QC Checked</option>
                        <option value="shipped">3. Dispatched in Fleet</option>
                        <option value="out_for_delivery">4. Out for Delivery & Staging</option>
                        <option value="delivered">5. Delivered & Assembled</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#52493F]">
                    <div>
                      <span className="font-bold text-[#1F1D1A] block">Customer & Destination</span>
                      <p>{o.shippingAddress.fullName} ({o.shippingAddress.phone})</p>
                      <p className="text-[#7A7167]">{o.shippingAddress.addressLine1}, {o.shippingAddress.city} - {o.shippingAddress.pincode}</p>
                    </div>
                    <div>
                      <span className="font-bold text-[#1F1D1A] block">Requested Time Slot</span>
                      <p>{o.deliverySlot.date} • {o.deliverySlot.timeWindow}</p>
                      <p className="text-[#7A7167]">{o.deliverySlot.instructions}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: INTERIOR DESIGN LEADS */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-3xl p-6 border border-[#E8E1D7] shadow-sm space-y-4">
            <h3 className="font-serif-luxury font-bold text-lg text-[#1F1D1A] pb-4 border-b border-[#F0EAE1]">
              Interior Consultation Inquiries
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {leads.map((lead) => (
                <div key={lead.id} className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D7] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-[#1F1D1A]">{lead.name}</h4>
                    <span className="px-2.5 py-0.5 bg-[#FAF0E4] text-[#8C5D33] font-bold rounded-full text-[10px]">
                      {lead.status}
                    </span>
                  </div>
                  <p className="text-[#52493F]">{lead.phone} • {lead.email}</p>
                  <p className="text-[#52493F]">{lead.city}</p>
                  <div className="pt-2 border-t border-[#E8DEC8] flex justify-between text-[#7A7167]">
                    <span>Scope: <strong className="text-[#1F1D1A]">{lead.roomType}</strong></span>
                    <span>Budget: <strong className="text-[#1F1D1A]">{lead.budgetRange}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
