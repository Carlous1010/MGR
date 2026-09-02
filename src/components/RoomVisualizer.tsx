import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, IdeaBoard, IdeaBoardItem } from '../types';
import { 
  Layers, 
  ShoppingBag, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  FlipHorizontal, 
  Trash2, 
  Plus, 
  Save, 
  Sparkles, 
  Share2, 
  Palette, 
  Eye, 
  Info,
  Check,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

const WALL_COLORS = [
  { name: 'Warm Linen', hex: '#F9F7F2' },
  { name: 'Japandi Sand', hex: '#EFEAE1' },
  { name: 'Sage Mist', hex: '#DFE5DA' },
  { name: 'Clay Ash', hex: '#DED9D0' },
  { name: 'Forest Olive', hex: '#3D4238' }
];

const FLOOR_STYLES = [
  { name: 'Natural Oak Hardwood', color: '#DCC8B0', texture: 'linear-gradient(90deg, #DCC8B0 0%, #D4BF9F 50%, #DCC8B0 100%)' },
  { name: 'Smoked Walnut Parquet', color: '#664A35', texture: 'linear-gradient(90deg, #664A35 0%, #593E2B 50%, #664A35 100%)' },
  { name: 'Roman Travertine Stone', color: '#EAE3D5', texture: 'radial-gradient(circle, #EAE3D5 0%, #DDD3C1 100%)' },
  { name: 'Polished Concrete', color: '#C8C4BE', texture: 'linear-gradient(135deg, #C8C4BE 0%, #B8B3AC 100%)' }
];

export const RoomVisualizer: React.FC = () => {
  const { 
    products, 
    ideaBoards, 
    activeBoard, 
    setActiveBoard, 
    createIdeaBoard, 
    saveIdeaBoard, 
    deleteIdeaBoard, 
    updateBoardItem, 
    removeBoardItem, 
    addAllBoardItemsToCart,
    addToCart,
    formatPrice,
    showToast,
    setIsAiStylistOpen
  } = useStore();

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'catalog' | 'boards' | 'room-settings'>('catalog');
  const [catalogFilter, setCatalogFilter] = useState<string>('all');
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedItem = activeBoard?.items.find(i => i.id === selectedItemId);

  // Filter products to add
  const filteredProducts = catalogFilter === 'all' 
    ? products 
    : products.filter(p => p.category === catalogFilter || p.roomType === catalogFilter);

  // Add product to canvas
  const handleAddProductToCanvas = (product: Product) => {
    if (!activeBoard) return;
    const newItem: IdeaBoardItem = {
      id: `item-${Date.now()}`,
      productId: product.id,
      product,
      xPercent: 35 + (Math.random() * 20 - 10),
      yPercent: 40 + (Math.random() * 20 - 10),
      scale: 1.0,
      rotation: 0,
      zIndex: activeBoard.items.length + 1
    };

    const updatedBoard: IdeaBoard = {
      ...activeBoard,
      items: [...activeBoard.items, newItem],
      totalBudget: activeBoard.totalBudget + product.price,
      updatedAt: new Date().toISOString()
    };

    saveIdeaBoard(updatedBoard);
    setSelectedItemId(newItem.id);
    showToast(`Added '${product.name}' to staging canvas`, 'success');
  };

  // Canvas item transform controls
  const handleScale = (delta: number) => {
    if (!selectedItem) return;
    const newScale = Math.min(Math.max(0.4, Number((selectedItem.scale + delta).toFixed(2))), 2.2);
    updateBoardItem(selectedItem.id, { scale: newScale });
  };

  const handleRotate = (degDelta: number) => {
    if (!selectedItem) return;
    const newRotation = (selectedItem.rotation + degDelta) % 360;
    updateBoardItem(selectedItem.id, { rotation: newRotation });
  };

  const handleFlip = () => {
    if (!selectedItem) return;
    updateBoardItem(selectedItem.id, { flipped: !selectedItem.flipped });
  };

  const handleLayer = (direction: 'up' | 'down') => {
    if (!selectedItem || !activeBoard) return;
    const currentZ = selectedItem.zIndex;
    const newZ = direction === 'up' ? currentZ + 1 : Math.max(1, currentZ - 1);
    updateBoardItem(selectedItem.id, { zIndex: newZ });
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setSelectedItemId(null);
    }
  };

  // Handle Dragging
  const handleDrag = (itemId: string, info: any) => {
    if (!canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const item = activeBoard?.items.find(i => i.id === itemId);
    if (!item) return;

    // Convert pixel offset to percentages
    const deltaXPercent = (info.offset.x / canvasRect.width) * 100;
    const deltaYPercent = (info.offset.y / canvasRect.height) * 100;

    const newX = Math.min(Math.max(5, item.xPercent + deltaXPercent), 90);
    const newY = Math.min(Math.max(5, item.yPercent + deltaYPercent), 85);

    updateBoardItem(itemId, {
      xPercent: Number(newX.toFixed(1)),
      yPercent: Number(newY.toFixed(1))
    });
  };

  const handleSaveBoardClick = () => {
    if (activeBoard) {
      saveIdeaBoard(activeBoard);
    }
  };

  const handleCreateNewBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;
    await createIdeaBoard(newBoardTitle.trim(), 'living');
    setNewBoardTitle('');
    setIsCreatingBoard(false);
  };

  return (
    <div id="room-visualizer-page" className="py-8 bg-[#F9F7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E5E1D8]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#4A5043]">
              <Layers className="w-3.5 h-3.5 text-[#7D8471]" />
              <span>Interactive Staging Studio</span>
            </div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#2C2C2C] mt-1">
              Personalized 2D Room Stager & Idea Boards
            </h1>
            <p className="text-xs text-[#7A756D] mt-0.5">
              Drag, arrange, and style heirloom furniture pieces against customizable natural wall paints and hardwood floors.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center flex-wrap gap-2.5">
            <button
              id="visualizer-ai-assist-btn"
              onClick={() => setIsAiStylistOpen(true)}
              className="px-4 py-2 bg-white text-[#2C2C2C] border border-[#E5E1D8] rounded-full text-xs font-bold hover:bg-[#F2EFE9] flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#7D8471]" />
              <span>AI Decor Advisor</span>
            </button>

            {activeBoard && (
              <button
                id="visualizer-add-all-cart-btn"
                onClick={() => addAllBoardItemsToCart(activeBoard)}
                disabled={activeBoard.items.length === 0}
                className="px-5 py-2 bg-[#7D8471] text-white rounded-full text-xs font-bold hover:bg-[#6C7361] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md transition-all active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Buy Complete Room ({formatPrice(activeBoard.totalBudget)})</span>
              </button>
            )}
          </div>
        </div>

        {/* Studio Grid: Left Main Canvas & Right Side Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Visualizer Stage (Left 8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Active Board Bar */}
            <div className="bg-white rounded-2xl p-3.5 border border-[#E5E1D8] flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#4A5043] uppercase tracking-wider">Active Board:</span>
                <span className="font-serif-luxury font-bold text-sm text-[#2C2C2C]">
                  {activeBoard?.title || 'Untitled Board'}
                </span>
                <span className="px-2 py-0.5 bg-[#F2EFE9] text-[10px] font-bold rounded-full text-[#4A5043]">
                  {activeBoard?.items.length || 0} Pieces
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  id="visualizer-save-board-btn"
                  onClick={handleSaveBoardClick}
                  className="px-3.5 py-1.5 bg-[#F2EFE9] hover:bg-[#EBE7DF] text-[#2C2C2C] rounded-full text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Save className="w-3 h-3" />
                  <span>Save Board</span>
                </button>
              </div>
            </div>

            {/* Interactive 2D Virtual Room Canvas */}
            <div
              id="room-staging-canvas"
              ref={canvasRef}
              onClick={handleCanvasClick}
              style={{
                backgroundColor: activeBoard?.wallColorHex || '#F9F7F2'
              }}
              className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border-2 border-[#DED9D0] shadow-2xl select-none flex flex-col justify-between"
            >
              {/* Virtual Room Horizon / Baseboard & Floor */}
              <div className="absolute inset-x-0 bottom-0 h-[38%] pointer-events-none border-t-4 border-[#3D4238]/20"
                style={{
                  background: activeBoard?.floorColorHex 
                    ? FLOOR_STYLES.find(f => f.color === activeBoard.floorColorHex)?.texture || activeBoard.floorColorHex
                    : 'linear-gradient(90deg, #DCC8B0 0%, #D4BF9F 50%, #DCC8B0 100%)'
                }}
              >
                {/* Floor perspective shadow */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent"></div>
              </div>

              {/* Architectural Wall Sconce / Window subtle light beam */}
              <div className="absolute top-0 right-1/4 w-1/3 h-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none transform -skew-x-12"></div>

              {/* Items Staged on Canvas */}
              {activeBoard?.items.map((item) => {
                const isSelected = item.id === selectedItemId;
                return (
                  <motion.div
                    key={item.id}
                    id={`staged-item-${item.id}`}
                    drag
                    dragMomentum={false}
                    onDragEnd={(_, info) => handleDrag(item.id, info)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItemId(item.id);
                    }}
                    style={{
                      position: 'absolute',
                      left: `${item.xPercent}%`,
                      top: `${item.yPercent}%`,
                      zIndex: item.zIndex,
                      transform: `translate(-50%, -50%) scale(${item.scale}) rotate(${item.rotation}deg) scaleX(${item.flipped ? -1 : 1})`,
                      cursor: 'grab'
                    }}
                    className={`group touch-none ${
                      isSelected ? 'ring-2 ring-[#7D8471] ring-offset-2 ring-offset-transparent rounded-lg' : ''
                    }`}
                  >
                    {/* Cutout Furniture Item */}
                    <div className="relative">
                      <img
                        src={item.product.cutoutImage || item.product.images[0]}
                        alt={item.product.name}
                        className="max-w-[140px] sm:max-w-[200px] h-auto object-contain drop-shadow-2xl pointer-events-none select-none"
                      />
                      
                      {/* Floating Item Label on hover or selected */}
                      {isSelected && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-[#3D4238]/95 backdrop-blur-sm text-white text-[10px] font-bold rounded-full shadow-lg whitespace-nowrap z-50 pointer-events-none flex items-center gap-1">
                          <span>{item.product.name}</span>
                          <span className="text-[#EBE7DF]">({formatPrice(item.product.price)})</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* Empty Stage Help Guide */}
              {(!activeBoard || activeBoard.items.length === 0) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
                  <div className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#4A5043] shadow-md mb-3">
                    <Layers className="w-7 h-7 text-[#7D8471]" />
                  </div>
                  <h3 className="font-serif-luxury font-bold text-lg text-[#2C2C2C]">
                    Your Room Canvas is Empty
                  </h3>
                  <p className="text-xs text-[#7A756D] max-w-sm mt-1">
                    Select handcrafted sofas, coffee tables, lamps, and artwork from the right catalogue panel to stage your room.
                  </p>
                </div>
              )}

              {/* Quick Canvas Overlay Controls Bar */}
              {selectedItem && (
                <div 
                  id="canvas-transform-toolbar"
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-[#E5E1D8] rounded-full px-4 py-2 shadow-2xl flex items-center gap-3 z-50 text-xs text-[#2C2C2C]"
                >
                  <span className="font-bold text-[11px] text-[#4A5043] max-w-[100px] truncate">
                    {selectedItem.product.name}
                  </span>

                  <div className="h-4 w-[1px] bg-[#E5E1D8]"></div>

                  {/* Zoom Scale */}
                  <button 
                    onClick={() => handleScale(-0.1)} 
                    className="p-1 rounded-full hover:bg-[#F2EFE9] text-[#4A5043]" 
                    title="Scale Down"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-bold">{Math.round(selectedItem.scale * 100)}%</span>
                  <button 
                    onClick={() => handleScale(0.1)} 
                    className="p-1 rounded-full hover:bg-[#F2EFE9] text-[#4A5043]" 
                    title="Scale Up"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>

                  <div className="h-4 w-[1px] bg-[#E5E1D8]"></div>

                  {/* Rotate */}
                  <button 
                    onClick={() => handleRotate(15)} 
                    className="p-1 rounded-full hover:bg-[#F2EFE9] text-[#4A5043]" 
                    title="Rotate 15°"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  {/* Flip */}
                  <button 
                    onClick={handleFlip} 
                    className="p-1 rounded-full hover:bg-[#F2EFE9] text-[#4A5043]" 
                    title="Flip Horizontally"
                  >
                    <FlipHorizontal className="w-4 h-4" />
                  </button>

                  <div className="h-4 w-[1px] bg-[#E5E1D8]"></div>

                  {/* Delete Item */}
                  <button 
                    onClick={() => {
                      removeBoardItem(selectedItem.id);
                      setSelectedItemId(null);
                    }} 
                    className="p-1 rounded-full hover:bg-red-50 text-red-600" 
                    title="Remove from Room"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Room Budget & Pieces Summary Bar */}
            <div className="bg-white rounded-2xl p-4 border border-[#E5E1D8] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div>
                <span className="text-xs text-[#7A756D]">Estimated Room Staging Budget:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-[#2C2C2C]">
                    {formatPrice(activeBoard?.totalBudget || 0)}
                  </span>
                  <span className="text-xs text-[#4A5043] font-medium">
                    ({activeBoard?.items.length || 0} Pieces Selected)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="canvas-buy-room-btn"
                  onClick={() => {
                    if (activeBoard) addAllBoardItemsToCart(activeBoard);
                  }}
                  disabled={!activeBoard || activeBoard.items.length === 0}
                  className="px-6 py-2.5 bg-[#3D4238] text-white rounded-full text-xs font-bold hover:bg-[#4A5043] disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#EBE7DF]" />
                  <span>Add Room to Cart</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Control & Furniture Catalogue Panel (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Panel Tabs Header */}
            <div className="bg-white rounded-2xl border border-[#E5E1D8] p-1.5 flex items-center justify-between shadow-sm">
              <button
                id="visualizer-tab-catalog"
                onClick={() => setActiveTab('catalog')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'catalog'
                    ? 'bg-[#3D4238] text-white shadow-sm'
                    : 'text-[#7A756D] hover:bg-[#F2EFE9]'
                }`}
              >
                Furniture Pieces
              </button>
              <button
                id="visualizer-tab-room"
                onClick={() => setActiveTab('room-settings')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'room-settings'
                    ? 'bg-[#3D4238] text-white shadow-sm'
                    : 'text-[#7A756D] hover:bg-[#F2EFE9]'
                }`}
              >
                Wall & Floor
              </button>
              <button
                id="visualizer-tab-boards"
                onClick={() => setActiveTab('boards')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'boards'
                    ? 'bg-[#3D4238] text-white shadow-sm'
                    : 'text-[#7A756D] hover:bg-[#F2EFE9]'
                }`}
              >
                Saved Boards
              </button>
            </div>

            {/* TAB 1: FURNITURE CATALOGUE PICKER */}
            {activeTab === 'catalog' && (
              <div className="bg-white rounded-2xl border border-[#E5E1D8] p-4 flex flex-col gap-3 shadow-sm h-[580px]">
                
                {/* Category filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {['all', 'living-room', 'bedroom', 'dining', 'office', 'decor'].map((cat) => (
                    <button
                      key={cat}
                      id={`vis-cat-${cat}`}
                      onClick={() => setCatalogFilter(cat)}
                      className={`px-3 py-1.5 rounded-full whitespace-nowrap text-[11px] font-bold transition-all ${
                        catalogFilter === cat
                          ? 'bg-[#7D8471] text-white'
                          : 'bg-[#F2EFE9] text-[#4A5043] hover:bg-[#EBE7DF]'
                      }`}
                    >
                      {cat === 'all' ? 'All Pieces' : cat.replace('-', ' ')}
                    </button>
                  ))}
                </div>

                <p className="text-[11px] text-[#7A756D]">
                  Click <span className="font-bold text-[#4A5043]">+ Stage</span> to place items on your room canvas.
                </p>

                {/* Products List */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      id={`vis-prod-${p.id}`}
                      className="p-2.5 rounded-2xl border border-[#E5E1D8] hover:border-[#7D8471] bg-[#F9F7F2] transition-all flex items-center justify-between gap-3 group"
                    >
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-14 h-14 rounded-xl object-cover bg-white border border-[#E5E1D8] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif-luxury font-bold text-xs text-[#2C2C2C] truncate group-hover:text-[#4A5043]">
                          {p.name}
                        </h4>
                        <p className="text-[10px] text-[#7A756D] truncate">{p.materials.split(',')[0]}</p>
                        <p className="text-xs font-bold text-[#2C2C2C] mt-0.5">{formatPrice(p.price)}</p>
                      </div>
                      <button
                        id={`vis-add-${p.id}`}
                        onClick={() => handleAddProductToCanvas(p)}
                        className="px-3.5 py-1.5 bg-[#3D4238] text-white rounded-full text-[11px] font-bold hover:bg-[#7D8471] transition-colors flex items-center gap-1 shrink-0 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Stage</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: ROOM PAINT & FLOOR CUSTOMIZER */}
            {activeTab === 'room-settings' && (
              <div className="bg-white rounded-2xl border border-[#E5E1D8] p-5 space-y-6 shadow-sm h-[580px] overflow-y-auto">
                {/* Wall Color Selection */}
                <div>
                  <h4 className="font-serif-luxury font-bold text-sm text-[#2C2C2C] mb-2 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[#7D8471]" />
                    <span>Wall Paint Finish</span>
                  </h4>
                  <p className="text-xs text-[#7A756D] mb-3">
                    Choose artisanal lime-wash and natural matte paint tones.
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {WALL_COLORS.map((w) => (
                      <button
                        key={w.name}
                        id={`wall-paint-${w.name.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => {
                          if (activeBoard) {
                            saveIdeaBoard({ ...activeBoard, wallColorHex: w.hex });
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                          activeBoard?.wallColorHex === w.hex 
                            ? 'border-[#7D8471] ring-2 ring-[#7D8471]/20 bg-[#F2EFE9]' 
                            : 'border-[#E5E1D8] hover:border-[#DED9D0]'
                        }`}
                      >
                        <div 
                          className="w-6 h-6 rounded-full border border-black/10 shadow-inner"
                          style={{ backgroundColor: w.hex }}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-[#2C2C2C] block truncate">{w.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Floor Material Selection */}
                <div className="pt-4 border-t border-[#E5E1D8]">
                  <h4 className="font-serif-luxury font-bold text-sm text-[#2C2C2C] mb-2">
                    Hardwood & Stone Flooring
                  </h4>
                  <p className="text-xs text-[#7A756D] mb-3">
                    Select authentic textures for the floor plane.
                  </p>
                  <div className="space-y-2">
                    {FLOOR_STYLES.map((f) => (
                      <button
                        key={f.name}
                        id={`floor-style-${f.name.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => {
                          if (activeBoard) {
                            saveIdeaBoard({ ...activeBoard, floorColorHex: f.color });
                          }
                        }}
                        className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                          activeBoard?.floorColorHex === f.color 
                            ? 'border-[#7D8471] ring-2 ring-[#7D8471]/20 bg-[#F2EFE9]' 
                            : 'border-[#E5E1D8] hover:border-[#DED9D0]'
                        }`}
                      >
                        <div 
                          className="w-8 h-8 rounded-lg border border-black/10 shadow-inner shrink-0"
                          style={{ background: f.texture }}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-[#2C2C2C] block">{f.name}</span>
                        </div>
                        {activeBoard?.floorColorHex === f.color && (
                          <Check className="w-4 h-4 text-[#7D8471]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SAVED IDEA BOARDS */}
            {activeTab === 'boards' && (
              <div className="bg-white rounded-2xl border border-[#E5E1D8] p-4 flex flex-col gap-4 shadow-sm h-[580px]">
                
                {/* Create New Board Form */}
                {isCreatingBoard ? (
                  <form onSubmit={handleCreateNewBoard} className="p-3 bg-[#F2EFE9] rounded-2xl border border-[#E5E1D8] space-y-2">
                    <h5 className="text-xs font-bold text-[#2C2C2C]">New Personalized Idea Board</h5>
                    <input
                      id="new-board-title-input"
                      type="text"
                      required
                      value={newBoardTitle}
                      onChange={(e) => setNewBoardTitle(e.target.value)}
                      placeholder="e.g. Master Bedroom Sanctuary"
                      className="w-full bg-white border border-[#E5E1D8] rounded-xl px-3 py-1.5 text-xs text-[#2C2C2C] focus:outline-none focus:border-[#7D8471]"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#7D8471] text-white rounded-full text-xs font-bold hover:bg-[#6C7361]"
                      >
                        Create
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCreatingBoard(false)}
                        className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    id="create-board-btn"
                    onClick={() => setIsCreatingBoard(true)}
                    className="w-full py-2.5 bg-[#F2EFE9] border border-dashed border-[#7D8471] text-[#4A5043] rounded-full text-xs font-bold hover:bg-[#EBE7DF] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Idea Board</span>
                  </button>
                )}

                {/* Boards list */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {ideaBoards.map((b) => (
                    <div
                      key={b.id}
                      id={`board-card-${b.id}`}
                      onClick={() => setActiveBoard(b)}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                        activeBoard?.id === b.id 
                          ? 'border-[#7D8471] bg-[#F2EFE9] shadow-sm' 
                          : 'border-[#E5E1D8] bg-[#F9F7F2] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-serif-luxury font-bold text-xs text-[#2C2C2C]">
                            {b.title}
                          </h4>
                          <p className="text-[11px] text-[#7A756D] mt-0.5 line-clamp-1">{b.description || 'Personalized curation'}</p>
                        </div>
                        {activeBoard?.id === b.id && (
                          <span className="px-2.5 py-0.5 bg-[#7D8471] text-white text-[9px] font-bold rounded-full">
                            Active
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between text-[11px] text-[#4A5043] pt-2 border-t border-[#E5E1D8]">
                        <span>{b.items.length} Furniture Pieces</span>
                        <span className="font-bold text-[#2C2C2C]">{formatPrice(b.totalBudget)}</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
