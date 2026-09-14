import React, { useState } from 'react';
import { ArrowRight, Sparkles, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { LookbookTheme, Dress, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';

interface LookbookViewProps {
  lookbooks: LookbookTheme[];
  dresses: Dress[];
  currency: CurrencyCode;
  onSelectDress: (dress: Dress) => void;
  onExploreCatalog: () => void;
}

export const LookbookView: React.FC<LookbookViewProps> = ({
  lookbooks,
  dresses,
  currency,
  onSelectDress,
  onExploreCatalog,
}) => {
  const [activeThemeIndex, setActiveThemeIndex] = useState(0);
  const activeTheme = lookbooks[activeThemeIndex] || lookbooks[0];

  const themeDresses = dresses.filter((d) => activeTheme.dressIds.includes(d.id));

  return (
    <div className="py-12 sm:py-16 bg-[#FDFBF7]" id="lookbook-view">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.3em] text-[#C5A059] font-sans font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Seasonal Edits</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#121212] mb-3">
            Atelier Stories & Lookbook
          </h1>
          <p className="text-xs sm:text-sm text-[#59534A] font-sans font-light leading-relaxed">
            Styled narratives and trend studies curated by Infi creative directorship. Explore by thematic occasion.
          </p>
        </div>

        {/* Theme Navigation Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 overflow-x-auto pb-2">
          {lookbooks.map((theme, idx) => (
            <button
              key={theme.id}
              onClick={() => setActiveThemeIndex(idx)}
              className={`px-4 sm:px-6 py-2 text-xs uppercase font-sans tracking-widest transition-all cursor-pointer whitespace-nowrap ${
                activeThemeIndex === idx
                  ? 'bg-[#121212] text-white font-semibold shadow-sm'
                  : 'bg-white text-neutral-600 border border-[#E8E2D9] hover:border-black'
              }`}
            >
              {theme.title}
            </button>
          ))}
        </div>

        {/* Active Theme Hero Billboard */}
        <div className="bg-white border border-[#E8E2D9] p-6 sm:p-10 shadow-xs mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Editorial Imagery Carousel */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-[#F4EFEB] shadow-md">
                <img
                  src={activeTheme.coverImage}
                  alt={activeTheme.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#121212] text-white text-[10px] uppercase font-sans tracking-widest px-3 py-1 font-medium">
                  {activeTheme.occasion}
                </div>
              </div>

              {/* Gallery Thumbnails */}
              <div className="grid grid-cols-3 gap-3">
                {activeTheme.galleryImages.map((img, i) => (
                  <div key={i} className="aspect-[3/2] overflow-hidden border border-[#E8E2D9]">
                    <img src={img} alt={`Lookbook mood ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Editorial Story Text & Curator Note */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <span className="text-xs uppercase font-sans tracking-[0.25em] text-[#C5A059] font-medium block mb-2">
                Editorial Edit
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl text-[#121212] font-normal leading-tight mb-3">
                {activeTheme.title}
              </h2>

              <p className="text-sm text-[#8C8275] font-serif italic mb-4">
                {activeTheme.tagline}
              </p>

              <p className="text-xs sm:text-sm text-[#59534A] font-sans font-light leading-relaxed mb-6">
                {activeTheme.description}
              </p>

              {/* Quote from Curator */}
              <div className="bg-[#FDFBF7] border-l-2 border-[#C5A059] p-4 mb-6">
                <Quote className="w-4 h-4 text-[#C5A059] mb-1 opacity-75" />
                <p className="text-xs font-serif italic text-[#121212] leading-relaxed mb-2">
                  {activeTheme.editorialQuote}
                </p>
                <span className="text-[10px] uppercase font-sans tracking-wider text-[#8C8275]">
                  — {activeTheme.curator}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onExploreCatalog}
                  className="inline-flex items-center gap-2 text-xs uppercase font-sans tracking-widest font-semibold text-[#121212] border-b border-[#121212] pb-1 hover:text-[#C5A059] hover:border-[#C5A059] transition-all"
                >
                  <span>Explore Full Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Gowns in this Story */}
        <div className="border-t border-[#E8E2D9] pt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs uppercase font-sans tracking-widest text-[#8C8275]">Styled Pieces</span>
              <h3 className="font-serif text-2xl text-[#121212]">Featured in {activeTheme.title}</h3>
            </div>
            <span className="text-xs font-sans text-neutral-500">{themeDresses.length} creations</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {themeDresses.map((dress) => (
              <div
                key={dress.id}
                onClick={() => onSelectDress(dress)}
                className="group bg-white border border-[#E8E2D9] p-4 cursor-pointer hover:border-black transition-all"
              >
                <div className="aspect-[3/4] overflow-hidden bg-[#F4EFEB] mb-3">
                  <img
                    src={dress.images[0]}
                    alt={dress.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="text-[10px] uppercase font-sans text-[#8C8275] tracking-wider block mb-1">
                  {dress.silhouette}
                </span>
                <h4 className="font-serif text-base font-medium text-[#121212] group-hover:text-[#C5A059] transition-colors mb-1">
                  {dress.name}
                </h4>
                <div className="flex items-center justify-between text-xs font-sans mt-2">
                  <span className="font-semibold text-[#121212]">{formatPrice(dress.priceINR, currency)}</span>
                  <span className="text-[#121212] group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
