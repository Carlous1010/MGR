import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Sparkles, 
  X, 
  Send, 
  Layers, 
  ShoppingBag, 
  RotateCcw, 
  MessageSquare,
  Bot,
  User,
  Check
} from 'lucide-react';

export const AiStylistModal: React.FC = () => {
  const { 
    isAiStylistOpen, 
    setIsAiStylistOpen, 
    products, 
    addItemToBoard, 
    addToCart, 
    formatPrice,
    setCurrentView 
  } = useStore();

  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; recommendedProducts?: string[]; palette?: string[] }>>([
    {
      sender: 'ai',
      text: 'Hello! I am your M.G.R Interior Design & Styling Concierge. Whether you need color palette recommendations, furniture pairings for a compact living room, or ideas to style solid Sheesham with Japandi lighting, how can I assist you today?',
      recommendedProducts: ['mgr-liv-01', 'mgr-liv-02'],
      palette: ['#F6F3ED', '#EDE3D2', '#8C5D33', '#2B2825']
    }
  ]);

  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAiStylistOpen) return null;

  const quickPrompts = [
    'How do I style the Kyoto Low Profile Bed in a minimalist bedroom?',
    'Recommend living room furniture under ₹1,50,000 for a warm Japandi look',
    'Which dining table pairs best with Scandinavian teak chairs?',
    'Suggest lighting and wall paint for an executive study'
  ];

  const handleSend = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const newMsgs = [...messages, { sender: 'user' as const, text: userText }];
    setMessages(newMsgs);
    setPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/stylist/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setMessages([
          ...newMsgs,
          {
            sender: 'ai',
            text: data.data.advice || data.data.message || 'Here are my curated styling recommendations for your space.',
            recommendedProducts: data.data.recommendedProductIds || [],
            palette: data.data.suggestedColorPalette || []
          }
        ]);
      } else {
        setMessages([
          ...newMsgs,
          {
            sender: 'ai',
            text: 'I recommend pairing our Kyoto Low Profile Bed with warm linen textiles and the Lumina Alabaster Lamp to create an authentic wabi-sabi atmosphere.',
            recommendedProducts: ['mgr-bed-01', 'mgr-dec-03'],
            palette: ['#FAF8F5', '#E4DDD3', '#8C5D33']
          }
        ]);
      }
    } catch {
      setMessages([
        ...newMsgs,
        {
          sender: 'ai',
          text: 'Here is an artisanal pairing: Combine solid Sheesham wood with textured bouclé upholstery and fluted oak credenzas for natural warmth and timeless balance.',
          recommendedProducts: ['mgr-liv-01', 'mgr-sto-01'],
          palette: ['#F6F3ED', '#8C5D33']
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ai-stylist-modal-backdrop" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="ai-stylist-modal"
        className="bg-white w-full max-w-2xl rounded-3xl border border-[#E8E1D7] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E8E1D7] bg-[#24211E] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#38332E] border border-[#52493F] flex items-center justify-center text-[#D4A373]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury font-bold text-base text-white">
                M.G.R AI Interior Design Advisor
              </h3>
              <span className="text-[11px] text-[#C8BEB2]">Smart furniture pairing & architectural styling</span>
            </div>
          </div>
          <button
            onClick={() => setIsAiStylistOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FAF8F5]">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-[#24211E] text-[#D4A373] flex items-center justify-center shrink-0 text-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-2xl p-4 text-xs space-y-3 ${
                m.sender === 'user' 
                  ? 'bg-[#24211E] text-white rounded-tr-none' 
                  : 'bg-white text-[#2C2926] border border-[#E8E1D7] shadow-sm rounded-tl-none'
              }`}>
                <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>

                {/* Color Palette Preview */}
                {m.palette && m.palette.length > 0 && (
                  <div className="pt-2 border-t border-[#F0EAE1]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5D33] block mb-1.5">
                      Suggested Palette Tones
                    </span>
                    <div className="flex items-center gap-2">
                      {m.palette.map((c, i) => (
                        <div key={i} className="flex items-center gap-1 bg-[#FAF8F5] border border-[#E0D7CB] rounded-md px-1.5 py-0.5">
                          <div className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: c }}></div>
                          <span className="text-[10px] font-mono text-[#52493F]">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Product Cards in response */}
                {m.recommendedProducts && m.recommendedProducts.length > 0 && (
                  <div className="pt-2 border-t border-[#F0EAE1] space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5D33] block">
                      Recommended M.G.R Pieces
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {m.recommendedProducts.map((pId) => {
                        const product = products.find(p => p.id === pId);
                        if (!product) return null;
                        return (
                          <div key={pId} className="p-2 bg-[#FAF8F5] rounded-xl border border-[#E8DEC8] flex items-center justify-between gap-2">
                            <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-md object-cover bg-white shrink-0" />
                            <div className="flex-1 min-w-0">
                              <span className="font-bold text-[11px] text-[#1F1D1A] block truncate">{product.name}</span>
                              <span className="text-[10px] text-[#8C5D33] font-bold">{formatPrice(product.price)}</span>
                            </div>
                            <button
                              onClick={() => {
                                addItemToBoard(product);
                                setIsAiStylistOpen(false);
                                setCurrentView('visualizer');
                              }}
                              className="p-1.5 bg-[#24211E] text-[#D4A373] rounded-md hover:bg-[#3E3833]"
                              title="Stage in Room Visualizer"
                            >
                              <Layers className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-[#7A7167]">
              <div className="w-8 h-8 rounded-full bg-[#24211E] text-[#D4A373] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <span className="bg-white px-3 py-2 rounded-2xl border border-[#E8E1D7] shadow-sm">
                Stylist is analyzing hardwood balances and color theory...
              </span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-5 py-2.5 bg-[#FAF6F0] border-t border-[#E8DEC8] flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-[#8C5D33] font-bold whitespace-nowrap">Try asking:</span>
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              className="px-2.5 py-1 bg-white border border-[#D8CABE] rounded-full text-[#4A4239] hover:bg-[#EAE2D5] whitespace-nowrap"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Prompt Input Form */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(prompt);
          }} 
          className="p-4 bg-white border-t border-[#E8E1D7] flex gap-2"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask anything about interior styling, lighting, dimensions, or color palettes..."
            className="flex-1 bg-[#FAF8F5] border border-[#D8CABE] rounded-xl px-4 py-2.5 text-xs text-[#1F1D1A] focus:outline-none focus:border-[#8C5D33]"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="px-5 py-2.5 bg-[#24211E] text-white rounded-xl text-xs font-bold hover:bg-[#3E3833] disabled:opacity-50 transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Consult</span>
          </button>
        </form>

      </div>
    </div>
  );
};
