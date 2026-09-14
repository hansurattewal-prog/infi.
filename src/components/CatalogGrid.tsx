import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, RotateCcw, Sparkles } from 'lucide-react';
import { Dress, CurrencyCode } from '../types';
import { ProductCard } from './ProductCard';

interface CatalogGridProps {
  dresses: Dress[];
  currency: CurrencyCode;
  wishlistIds: string[];
  onToggleWishlist: (dress: Dress) => void;
  onQuickView: (dress: Dress) => void;
  onSelectDress: (dress: Dress) => void;
  onCustomize: (dress: Dress) => void;
  onOpenQuiz: () => void;
  initialCategory?: string;
}

export const CatalogGrid: React.FC<CatalogGridProps> = ({
  dresses,
  currency,
  wishlistIds,
  onToggleWishlist,
  onQuickView,
  onSelectDress,
  onCustomize,
  onOpenQuiz,
  initialCategory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('All');
  const [selectedSilhouette, setSelectedSilhouette] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Extract distinct lists
  const categories = ['All', 'Evening Gowns', 'Cocktail & Reception', 'Bridal & Gala', 'Silk Slip'];
  const occasions = ['All', 'Gala', 'Black Tie', 'Cocktail', 'Red Carpet', 'Wedding Guest'];
  const silhouettes = ['All', 'Column / Sheath', 'Mermaid', 'A-Line', 'Bias Cut', 'Ball Gown'];
  const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Filtered Dresses
  const filteredDresses = useMemo(() => {
    return dresses
      .filter((d) => {
        if (selectedCategory !== 'All' && d.category !== selectedCategory) return false;
        if (selectedOccasion !== 'All' && d.occasion !== selectedOccasion) return false;
        if (selectedSilhouette !== 'All' && d.silhouette !== selectedSilhouette) return false;
        if (selectedSize !== 'All' && !d.sizes.includes(selectedSize)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceINR - b.priceINR;
        if (sortBy === 'price-desc') return b.priceINR - a.priceINR;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured
      });
  }, [dresses, selectedCategory, selectedOccasion, selectedSilhouette, selectedSize, sortBy]);

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedOccasion !== 'All' ||
    selectedSilhouette !== 'All' ||
    selectedSize !== 'All';

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedOccasion('All');
    setSelectedSilhouette('All');
    setSelectedSize('All');
    setSortBy('featured');
  };

  return (
    <section className="py-12 sm:py-16 bg-[#FDFBF7]" id="catalog-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#E8E2D9] gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#8C8275] mb-2 font-sans font-medium">
              <span>Haute Formalwear Gallery</span>
              <span>•</span>
              <span>{filteredDresses.length} Creations</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#121212] font-normal tracking-tight">
              The Evening Collection
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Style Quiz Prompt Banner */}
            <button
              id="catalog-quiz-prompt-btn"
              onClick={onOpenQuiz}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#F4EFEB] hover:bg-[#ECE5DC] text-[#121212] text-xs uppercase font-sans tracking-widest font-medium border border-[#D9D2C7] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Take Dress Quiz</span>
            </button>

            {/* Mobile Filter Toggle */}
            <button
              id="toggle-mobile-filters-btn"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#D9D2C7] text-xs uppercase font-sans tracking-widest text-[#121212]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Filter Navigation Bar (Desktop & Expanded Mobile) */}
        <div className={`space-y-4 mb-8 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-sans text-[#8C8275] mr-2">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                id={`filter-cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-sans tracking-wider uppercase transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#121212] text-white font-medium shadow-xs'
                    : 'bg-white text-neutral-700 hover:bg-[#F4EFEB] border border-[#E8E2D9]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sub-Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs font-sans text-neutral-700">
            <div className="flex flex-wrap items-center gap-3">
              {/* Occasion */}
              <div className="flex items-center gap-1.5 bg-white border border-[#E8E2D9] px-3 py-1.5">
                <span className="text-[#8C8275] uppercase text-[10px] tracking-wider">Occasion:</span>
                <select
                  id="filter-occasion-select"
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                  className="bg-transparent text-xs font-medium text-[#121212] focus:outline-none cursor-pointer"
                >
                  {occasions.map((occ) => (
                    <option key={occ} value={occ}>
                      {occ}
                    </option>
                  ))}
                </select>
              </div>

              {/* Silhouette */}
              <div className="flex items-center gap-1.5 bg-white border border-[#E8E2D9] px-3 py-1.5">
                <span className="text-[#8C8275] uppercase text-[10px] tracking-wider">Silhouette:</span>
                <select
                  id="filter-silhouette-select"
                  value={selectedSilhouette}
                  onChange={(e) => setSelectedSilhouette(e.target.value)}
                  className="bg-transparent text-xs font-medium text-[#121212] focus:outline-none cursor-pointer"
                >
                  {silhouettes.map((sil) => (
                    <option key={sil} value={sil}>
                      {sil}
                    </option>
                  ))}
                </select>
              </div>

              {/* Size */}
              <div className="flex items-center gap-1.5 bg-white border border-[#E8E2D9] px-3 py-1.5">
                <span className="text-[#8C8275] uppercase text-[10px] tracking-wider">Size:</span>
                <select
                  id="filter-size-select"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="bg-transparent text-xs font-medium text-[#121212] focus:outline-none cursor-pointer"
                >
                  {sizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  id="reset-filters-btn"
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-[11px] text-[#C5A059] hover:text-[#997A35] underline tracking-wider cursor-pointer ml-2"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-[#8C8275] uppercase text-[10px] tracking-wider">Sort By:</span>
              <select
                id="sort-by-select"
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-white border border-[#E8E2D9] px-3 py-1.5 text-xs font-medium text-[#121212] focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured Atelier Curation</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredDresses.length === 0 ? (
          <div className="py-20 text-center bg-white border border-dashed border-[#D9D2C7] p-8">
            <Filter className="w-8 h-8 text-[#8C8275] mx-auto mb-3" />
            <h3 className="font-serif text-2xl text-[#121212] mb-2">No Gowns Match Your Specific Selection</h3>
            <p className="text-xs text-[#736B60] font-sans max-w-md mx-auto mb-6">
              Our master atelier also crafts 100% custom silhouettes to your preferred measurements and fabric specifications.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 bg-[#121212] text-white text-xs uppercase font-sans tracking-widest"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredDresses.map((dress) => (
              <ProductCard
                key={dress.id}
                dress={dress}
                currency={currency}
                isWishlisted={wishlistIds.includes(dress.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickView={onQuickView}
                onSelectDress={onSelectDress}
                onCustomize={onCustomize}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
