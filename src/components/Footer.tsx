import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Layers, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setSelectedCategory, setIsAiStylistOpen, showToast } = useStore();

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Thank you for subscribing to M.G.R Interior Gazette. Look out for design inspiration in your inbox.', 'success');
  };

  return (
    <footer id="main-footer" className="bg-[#242622] text-[#EDE7DE] pt-16 pb-12 border-t border-[#3D4238]">
      {/* Brand Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#3D4238]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="flex items-start gap-3.5 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-[#33372F] flex items-center justify-center text-[#7D8471] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">10-Year Craft Warranty</h4>
              <p className="text-xs text-[#A8A29A] mt-0.5">Seasoned solid hardwoods & structural frame integrity guaranteed.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-[#33372F] flex items-center justify-center text-[#7D8471] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">White-Glove Delivery</h4>
              <p className="text-xs text-[#A8A29A] mt-0.5">In-home placement, assembly by expert technicians, debris removal.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-[#33372F] flex items-center justify-center text-[#7D8471] shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">2D Room Stager & AR</h4>
              <p className="text-xs text-[#A8A29A] mt-0.5">Visualize furniture scale and layout on personal idea boards before purchasing.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-[#33372F] flex items-center justify-center text-[#7D8471] shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Bespoke Design Services</h4>
              <p className="text-xs text-[#A8A29A] mt-0.5">Consult with Senior Interior Architects for complete home transformations.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#33372F] flex items-center justify-center text-[#7D8471] border border-[#4A5043]">
                <span className="font-serif-luxury text-lg font-bold">M</span>
              </div>
              <div>
                <span className="font-serif-luxury text-xl font-bold text-white tracking-wider">M.G.R</span>
                <span className="block text-[9px] uppercase font-bold tracking-[0.2em] text-[#A8A29A]">Furniture & Interior Design</span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-[#C5BDB2] max-w-sm">
              Crafting heirloom-quality furniture and tailored interior architecture. We blend timeless Scandinavian & Japandi sensibilities with seasoned Indian hardwoods and artisanal Italian fabrics.
            </p>

            <div className="pt-2 text-xs text-[#A8A29A] space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#7D8471]" />
                <span>Flagship Studio: 100ft Road, Indiranagar, Bengaluru, KA 560038</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-[#7D8471]" />
                <span>Concierge: +91 (080) 4122-8900 / +91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#7D8471]" />
                <span>consult@mgrfurniture.com</span>
              </div>
            </div>
          </div>

          {/* Furniture Categories */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Furniture Collections</h5>
            <ul className="space-y-2 text-xs text-[#C5BDB2]">
              <li><button onClick={() => handleCategoryClick('living-room')} className="hover:text-white transition-colors">Living Room Sofas & Tables</button></li>
              <li><button onClick={() => handleCategoryClick('bedroom')} className="hover:text-white transition-colors">Solid Sheesham Beds</button></li>
              <li><button onClick={() => handleCategoryClick('dining')} className="hover:text-white transition-colors">Oak Extendable Dining</button></li>
              <li><button onClick={() => handleCategoryClick('office')} className="hover:text-white transition-colors">Executive Desks & Ergonomics</button></li>
              <li><button onClick={() => handleCategoryClick('storage')} className="hover:text-white transition-colors">Fluted Wood Credenzas</button></li>
              <li><button onClick={() => handleCategoryClick('decor')} className="hover:text-white transition-colors">Sculptural Lighting & Vases</button></li>
            </ul>
          </div>

          {/* Design & Services */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Design & Services</h5>
            <ul className="space-y-2 text-xs text-[#C5BDB2]">
              <li>
                <button 
                  onClick={() => { setCurrentView('visualizer'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <Layers className="w-3 h-3 text-[#7D8471]" />
                  <span>2D Room Stager</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentView('trends'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  2026 Interior Trends
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentView('interior-design'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Book In-Home Consultation
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsAiStylistOpen(true)}
                  className="hover:text-white flex items-center gap-1 transition-colors text-[#7D8471]"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>AI Design Assistant</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentView('tracking'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Track Existing Order
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentView('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Admin Operations
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">The Interior Gazette</h5>
            <p className="text-xs text-[#C5BDB2] leading-relaxed">
              Receive curated seasonal lookbooks, new hardwood releases, and private interior showcase invitations.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="Enter your email..."
                  className="w-full bg-[#2E332A] border border-[#4A5043] rounded-full px-3.5 py-2 text-xs text-white placeholder-[#877D72] focus:outline-none focus:border-[#7D8471]"
                />
                <button
                  id="newsletter-submit-btn"
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3.5 bg-[#7D8471] text-white rounded-full text-xs font-bold flex items-center justify-center hover:bg-[#6C7361] transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-[#A8A29A]">No spam. Unsubscribe at any time.</p>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright & Legal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#3D4238] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#A8A29A]">
        <p>© 2026 M.G.R FURNITURE & INTERIOR DESIGN. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer">Terms of Service</span>
          <span className="hover:text-white cursor-pointer">Warranty Certificate</span>
          <span className="hover:text-white cursor-pointer">Sustainability Commitment</span>
        </div>
      </div>
    </footer>
  );
};
