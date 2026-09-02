import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Lock, Mail, User, ShieldCheck } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, user, login, logout, showToast } = useStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('arjun.nambiar@example.com');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('Arjun Nambiar');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, name);
    setIsAuthModalOpen(false);
  };

  return (
    <div id="auth-modal-backdrop" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div id="auth-modal" className="bg-white w-full max-w-md rounded-3xl border border-[#E8E1D7] shadow-2xl p-6 sm:p-8 relative">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E0D7CB] flex items-center justify-center text-[#554C42] hover:bg-[#F2ECE3]"
        >
          <X className="w-4 h-4" />
        </button>

        {user ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF0E4] border border-[#E8DEC8] flex items-center justify-center text-[#8C5D33] text-xl font-bold font-serif-luxury mx-auto">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-serif-luxury font-bold text-lg text-[#1F1D1A]">{user.name}</h3>
              <p className="text-xs text-[#7A7167]">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-[#FAF0E4] text-[#8C5D33] text-[10px] font-bold uppercase tracking-wider">
                M.G.R Private Client Member
              </span>
            </div>
            <div className="pt-4 border-t border-[#F0EAE1]">
              <button
                onClick={() => {
                  logout();
                  setIsAuthModalOpen(false);
                }}
                className="w-full py-2.5 bg-[#F4EFEA] hover:bg-red-50 text-red-600 rounded-xl text-xs font-bold transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center pb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C5D33]">
                M.G.R Concierge Access
              </span>
              <h3 className="font-serif-luxury font-bold text-2xl text-[#1F1D1A] mt-1">
                {isSignUp ? 'Create Private Client Account' : 'Welcome Back'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {isSignUp && (
                <div>
                  <label className="text-xs font-bold text-[#1F1D1A] block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D8CABE] rounded-lg px-3 py-2 text-xs text-[#1F1D1A]"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-[#1F1D1A] block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D8CABE] rounded-lg px-3 py-2 text-xs text-[#1F1D1A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1F1D1A] block mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D8CABE] rounded-lg px-3 py-2 text-xs text-[#1F1D1A]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#24211E] text-[#FAF8F5] rounded-xl text-xs font-bold hover:bg-[#3E3833] hover:text-[#D4A373] transition-colors shadow-md mt-2"
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="text-center pt-2 text-xs text-[#7A7167]">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-bold text-[#8C5D33] hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Register Here'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
