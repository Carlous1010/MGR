import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Layers,
  ArrowRight
} from 'lucide-react';

export const InteriorDesignPage: React.FC = () => {
  const { showToast } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Bengaluru',
    roomType: 'living',
    budgetRange: '₹2,00,000 - ₹5,00,000',
    preferredDate: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [consultationId, setConsultationId] = useState('');

  const packages = [
    {
      id: 'pkg-room',
      title: 'Single Room Transformation',
      price: '₹9,999',
      duration: '7 Days Turnaround',
      features: [
        'Dedicated Senior Interior Architect',
        '2D Scaled Floor Plan & 3D Visual Moodboard',
        'Complete M.G.R Furniture Spec & Material Swatches',
        '100% Consultation Fee Reimbursed on Furniture Orders > ₹1L'
      ]
    },
    {
      id: 'pkg-home',
      title: 'Complete Home Interior Architecture',
      price: '₹24,999',
      duration: '14 Days Turnaround',
      popular: true,
      features: [
        'End-to-End Living, Bedroom & Dining Blueprint',
        'On-site Physical Laser Measurement & Lighting Audit',
        'Custom Hardwood Joinery Drawings & Fabric Swatches',
        'Dedicated Project Lead & White-Glove Staging Supervision'
      ]
    },
    {
      id: 'pkg-bespoke',
      title: 'Bespoke Architectural Customization',
      price: 'Custom Estimate',
      duration: 'Tailored Scope',
      features: [
        'Solid Wood Custom Built-ins (Fluted Panels, Storage, Bars)',
        'Direct Millwork Consultation with Master Craftsmen',
        'Exotic Italian Marble & Seasoned Teak Selection',
        'Full Turnkey Execution & Lifetime Warranty'
      ]
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setIsSubmitted(true);
        setConsultationId(data.consultation.id);
        showToast('Consultation request booked successfully!', 'success');
      } else {
        showToast(data.message || 'Failed to book consultation', 'error');
      }
    } catch {
      showToast('Error booking consultation', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="interior-design-page" className="py-8 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Hero */}
        <div className="relative rounded-3xl overflow-hidden bg-[#24211E] text-white p-8 sm:p-14 mb-12 shadow-2xl border border-[#3E3833]">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80"
              alt="M.G.R Interior Architecture"
              className="w-full h-full object-cover opacity-25"
            />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5]/15 backdrop-blur-md text-[#D4A373] text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tailored Architectural Services</span>
            </div>
            <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Bespoke Interior Design & Home Staging
            </h1>
            <p className="mt-4 text-xs sm:text-sm text-[#D8CFC4] font-light leading-relaxed">
              Work one-on-one with senior interior designers to transform your residence into a serene sanctuary of seasoned wood, tactile natural fabrics, and architectural lighting.
            </p>
          </div>
        </div>

        {/* 3 Packages Cards */}
        <div className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C5D33]">
              Consultation Services
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F1D1A] mt-1">
              Select Your Design Scope
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                id={`pkg-card-${pkg.id}`}
                className={`relative bg-white rounded-3xl p-6 sm:p-8 border flex flex-col justify-between shadow-sm transition-all duration-300 hover:shadow-xl ${
                  pkg.popular 
                    ? 'border-[#8C5D33] ring-2 ring-[#8C5D33]/20' 
                    : 'border-[#E8E1D7]'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#8C5D33] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="font-serif-luxury text-xl font-bold text-[#1F1D1A]">
                    {pkg.title}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#1F1D1A]">{pkg.price}</span>
                    <span className="text-xs text-[#7A7167]">/ {pkg.duration}</span>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-[#52493F]">
                        <CheckCircle2 className="w-4 h-4 text-[#8C5D33] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="#consultation-booking-form"
                  className="mt-8 w-full py-3 bg-[#24211E] text-white rounded-xl text-xs font-bold text-center hover:bg-[#3E3833] hover:text-[#D4A373] transition-colors"
                >
                  Book This Package
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Form Section */}
        <div id="consultation-booking-form" className="bg-white rounded-3xl p-6 sm:p-12 border border-[#E8E1D7] shadow-lg max-w-3xl mx-auto">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif-luxury text-2xl font-bold text-[#1F1D1A]">
                Consultation Request Received!
              </h3>
              <p className="text-xs text-[#635A50] max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-bold">{formData.name}</span>. Reference code <span className="font-bold text-[#8C5D33]">{consultationId}</span>. Our Senior Design Architect will contact you on <span className="font-bold">{formData.phone}</span> within 2 business hours to confirm your appointment.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 px-6 py-2.5 bg-[#24211E] text-white rounded-xl text-xs font-bold hover:bg-[#3E3833]"
              >
                Book Another Consultation
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-6 pb-4 border-b border-[#E8E1D7]">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C5D33]">
                  Personalized In-Home or Virtual Session
                </span>
                <h3 className="font-serif-luxury text-2xl font-bold text-[#1F1D1A] mt-1">
                  Schedule Your Consultation
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#1F1D1A] block mb-1">Full Name</label>
                    <input
                      id="consult-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Aryan Sehgal"
                      className="w-full bg-[#FAF8F5] border border-[#D8CABE] rounded-lg px-3 py-2 text-xs text-[#1F1D1A] focus:outline-none focus:border-[#8C5D33]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#1F1D1A] block mb-1">Phone Number</label>
                    <input
                      id="consult-phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-[#FAF8F5] border border-[#D8CABE] rounded-lg px-3 py-2 text-xs text-[#1F1D1A] focus:outline-none focus:border-[#8C5D33]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#1F1D1A] block mb-1">Email Address</label>
                    <input
                      id="consult-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. aryan@example.com"
                      className="w-full bg-[#FAF8F5] border border-[#D8CABE] rounded-lg px-3 py-2 text-xs text-[#1F1D1A] focus:outline-none focus:border-[#8C5D33]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#1F1D1A] block mb-1">City / Location</label>
                    <input
                      id="consult-city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Bengaluru, Mumbai, Delhi NCR, Hyderabad"
                      className="w-full bg-[#FAF8F5] border border-[#D8CABE] rounded-lg px-3 py-2 text-xs text-[#1F1D1A] focus:outline-none focus:border-[#8C5D33]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#1F1D1A] block mb-1">Primary Room Focus</label>
                    <select
                      id="consult-room"
                      value={formData.roomType}
                      onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#D8CABE] rounded-lg px-3 py-2 text-xs text-[#1F1D1A] focus:outline-none focus:border-[#8C5D33]"
                    >
                      <option value="living">Living Room Lounge & Entertainment</option>
                      <option value="master-bedroom">Master Bedroom Sanctuary</option>
                      <option value="dining">Dining & Bar Area</option>
                      <option value="study">Executive Home Office</option>
                      <option value="full-home">Complete 3BHK / 4BHK Villa</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#1F1D1A] block mb-1">Estimated Budget</label>
                    <select
                      id="consult-budget"
                      value={formData.budgetRange}
                      onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#D8CABE] rounded-lg px-3 py-2 text-xs text-[#1F1D1A] focus:outline-none focus:border-[#8C5D33]"
                    >
                      <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000</option>
                      <option value="₹2,50,000 - ₹5,00,000">₹2,50,000 - ₹5,00,000</option>
                      <option value="₹5,00,000 - ₹10,00,000">₹5,00,000 - ₹10,00,000</option>
                      <option value="₹10,00,000+">₹10,00,000+ (Luxury Turnkey)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1F1D1A] block mb-1">Special Preferences or Floor Plan Notes</label>
                  <textarea
                    id="consult-notes"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Tell us about your home vibe (e.g. Japandi minimalist, warm teak woods, need child-friendly fabrics, pet-safe rug recommendations)..."
                    className="w-full bg-[#FAF8F5] border border-[#D8CABE] rounded-lg p-3 text-xs text-[#1F1D1A] focus:outline-none focus:border-[#8C5D33]"
                  ></textarea>
                </div>

                <button
                  id="consult-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#24211E] text-white rounded-xl text-xs font-bold hover:bg-[#3E3833] hover:text-[#D4A373] transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-[#D4A373]" />
                  <span>{isSubmitting ? 'Scheduling Session...' : 'Confirm Consultation Booking'}</span>
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
