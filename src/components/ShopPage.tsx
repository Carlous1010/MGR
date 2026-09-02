import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { 
  Filter, 
  SlidersHorizontal, 
  Search, 
  X, 
  Check, 
  ChevronDown,
  RotateCcw
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    categories, 
    searchQuery, 
    setSearchQuery,
    formatPrice 
  } = useStore();

  const [sortOption, setSortOption] = useState<string>('bestselling');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(140000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  const materialsList = [
    'all',
    'Sheesham',
    'Oak',
    'Teak',
    'Walnut',
    'Bouclé',
    'Leather',
    'Marble',
    'Travertine',
    'Brass',
    'Ceramic',
    'Linen'
  ];

  const stylesList = [
    'all',
    'Japandi Minimalist',
    'Modern Contemporary',
    'Mid-Century Modern',
    'Scandinavian Warm'
  ];

  // Client-side filtering matching the backend filter capabilities
  let filtered = [...products];

  if (selectedCategory && selectedCategory !== 'all') {
    filtered = filtered.filter(p => p.category === selectedCategory);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q) ||
      p.materials.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (selectedMaterial !== 'all') {
    filtered = filtered.filter(p => p.materials.toLowerCase().includes(selectedMaterial.toLowerCase()));
  }

  if (selectedStyle !== 'all') {
    filtered = filtered.filter(p => p.style.toLowerCase().includes(selectedStyle.toLowerCase()));
  }

  filtered = filtered.filter(p => p.price <= maxPrice);

  if (onlyInStock) {
    filtered = filtered.filter(p => p.stock > 0);
  }

  if (onlyDiscounted) {
    filtered = filtered.filter(p => p.discountPercentage > 0);
  }

  // Sorting
  switch (sortOption) {
    case 'bestselling':
      filtered.sort((a, b) => b.salesCount - a.salesCount);
      break;
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      filtered.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
      break;
    default:
      filtered.sort((a, b) => b.salesCount - a.salesCount);
  }

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedMaterial('all');
    setSelectedStyle('all');
    setMaxPrice(140000);
    setOnlyInStock(false);
    setOnlyDiscounted(false);
    setSearchQuery('');
  };

  const activeCategoryInfo = categories.find(c => c.id === selectedCategory);

  return (
    <div id="shop-catalog-page" className="py-8 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Catalog Banner / Header */}
        <div className="bg-[#24211E] text-white rounded-3xl p-8 sm:p-12 mb-8 shadow-xl relative overflow-hidden border border-[#3E3833]">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A373]">
              {activeCategoryInfo ? activeCategoryInfo.name : 'The Complete Catalogue'}
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
              {activeCategoryInfo ? activeCategoryInfo.tagline : 'Crafted for Timeless Spaces'}
            </h1>
            <p className="text-xs sm:text-sm text-[#D8CFC4] font-light mt-2 leading-relaxed">
              {activeCategoryInfo 
                ? activeCategoryInfo.description 
                : 'Explore our complete collection of bespoke hardwood sofas, extendable dining tables, solid wood platform beds, and sculptural lighting.'}
            </p>
          </div>
        </div>

        {/* Filters Top Bar */}
        <div className="bg-white rounded-2xl p-4 border border-[#E8E1D7] mb-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              id="mobile-filter-toggle-btn"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden px-4 py-2 bg-[#F2ECE3] text-[#38332E] rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#8C5D33]" />
              <span>Filters</span>
            </button>
            <p className="text-xs font-semibold text-[#544C42]">
              Showing <span className="font-bold text-[#1F1D1A]">{filtered.length}</span> pieces
            </p>
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <span className="text-xs text-[#7A7167] font-medium hidden sm:inline">Sort by:</span>
            <select
              id="catalog-sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-[#F8F5F0] border border-[#E0D7CB] rounded-xl px-3.5 py-2 text-xs font-bold text-[#2C2926] focus:outline-none focus:border-[#24211E]"
            >
              <option value="bestselling">★ Best Selling Ranking</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>
        </div>

        {/* Main 2-Column Catalog Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar Filters (Desktop) */}
          <div className={`lg:block ${isMobileFilterOpen ? 'block' : 'hidden'} space-y-6`}>
            <div className="bg-white rounded-2xl p-5 border border-[#E8E1D7] shadow-sm space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
                <h3 className="font-serif-luxury font-bold text-sm text-[#1F1D1A] flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#8C5D33]" />
                  <span>Filter Catalogue</span>
                </h3>
                <button
                  id="reset-filters-btn"
                  onClick={resetFilters}
                  className="text-[11px] font-semibold text-[#8C5D33] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Categories Filter */}
              <div>
                <h4 className="text-xs font-bold text-[#1F1D1A] uppercase tracking-wider mb-2.5">
                  Category
                </h4>
                <div className="space-y-1.5">
                  <button
                    id="filter-cat-all"
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === 'all' 
                        ? 'bg-[#24211E] text-[#D4A373] font-bold' 
                        : 'text-[#5A5147] hover:bg-[#FAF6F0]'
                    }`}
                  >
                    All Categories ({products.length})
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      id={`filter-cat-${cat.id}`}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedCategory === cat.id 
                          ? 'bg-[#24211E] text-[#D4A373] font-bold' 
                          : 'text-[#5A5147] hover:bg-[#FAF6F0]'
                      }`}
                    >
                      {cat.name} ({products.filter(p => p.category === cat.id).length})
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="pt-4 border-t border-[#F0EAE1]">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-[#1F1D1A] uppercase tracking-wider">
                    Max Price
                  </h4>
                  <span className="text-xs font-bold text-[#8C5D33]">
                    {formatPrice(maxPrice)}
                  </span>
                </div>
                <input
                  id="price-range-slider"
                  type="range"
                  min="5000"
                  max="140000"
                  step="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#8C5D33] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#8C8378] mt-1">
                  <span>₹5,000</span>
                  <span>₹1,40,000</span>
                </div>
              </div>

              {/* Material Filter */}
              <div className="pt-4 border-t border-[#F0EAE1]">
                <h4 className="text-xs font-bold text-[#1F1D1A] uppercase tracking-wider mb-2">
                  Hardwood & Material
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {materialsList.map((mat) => (
                    <button
                      key={mat}
                      id={`filter-mat-${mat.toLowerCase()}`}
                      onClick={() => setSelectedMaterial(mat)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        selectedMaterial === mat
                          ? 'bg-[#8C5D33] text-white'
                          : 'bg-[#F4EFEA] text-[#4A4239] hover:bg-[#EAE2D7]'
                      }`}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Design Style Filter */}
              <div className="pt-4 border-t border-[#F0EAE1]">
                <h4 className="text-xs font-bold text-[#1F1D1A] uppercase tracking-wider mb-2">
                  Interior Style
                </h4>
                <div className="space-y-1">
                  {stylesList.map((st) => (
                    <button
                      key={st}
                      id={`filter-style-${st.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setSelectedStyle(st)}
                      className={`w-full text-left px-2.5 py-1 rounded text-xs transition-colors ${
                        selectedStyle === st
                          ? 'font-bold text-[#8C5D33] bg-[#FAF6F0]'
                          : 'text-[#5A5147] hover:text-[#1F1D1A]'
                      }`}
                    >
                      {st === 'all' ? 'All Styles' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-4 border-t border-[#F0EAE1] space-y-2.5">
                <label className="flex items-center gap-2 text-xs font-medium text-[#4A4239] cursor-pointer">
                  <input
                    id="filter-in-stock-checkbox"
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="rounded text-[#8C5D33] focus:ring-0"
                  />
                  <span>In Stock Only</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-[#4A4239] cursor-pointer">
                  <input
                    id="filter-discount-checkbox"
                    type="checkbox"
                    checked={onlyDiscounted}
                    onChange={(e) => setOnlyDiscounted(e.target.checked)}
                    className="rounded text-[#8C5D33] focus:ring-0"
                  />
                  <span>Special Offers & Discounts</span>
                </label>
              </div>

            </div>
          </div>

          {/* Right Product Grid (3 Cols) */}
          <div className="lg:col-span-3">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* Empty Search / Filter State */
              <div className="bg-white rounded-2xl p-12 text-center border border-[#E8E1D7] shadow-sm">
                <div className="w-16 h-16 rounded-full bg-[#F4EFEA] flex items-center justify-center text-[#8C5D33] mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-serif-luxury font-bold text-xl text-[#1F1D1A]">
                  No matching furniture pieces found
                </h3>
                <p className="text-xs text-[#7A7167] max-w-md mx-auto mt-2 leading-relaxed">
                  We couldn't find any products matching your specific filter criteria. Try adjusting the price slider or resetting filters.
                </p>
                <button
                  id="empty-reset-filters-btn"
                  onClick={resetFilters}
                  className="mt-6 px-6 py-2.5 bg-[#24211E] text-white rounded-xl text-xs font-bold hover:bg-[#3E3833] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
