import React, { useState } from 'react';
import { Heart, Eye, Sparkles, Scissors } from 'lucide-react';
import { Dress, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';

interface ProductCardProps {
  dress: Dress;
  currency: CurrencyCode;
  isWishlisted: boolean;
  onToggleWishlist: (dress: Dress) => void;
  onQuickView: (dress: Dress) => void;
  onSelectDress: (dress: Dress) => void;
  onCustomize: (dress: Dress) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  dress,
  currency,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onSelectDress,
  onCustomize,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  return (
    <div className="group flex flex-col bg-white border border-[#ECE7DF] hover:border-[#D5CBC0] transition-all duration-300">
      {/* Visual Presentation & Hover Swap */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F4EFEB] cursor-pointer" onClick={() => onSelectDress(dress)}>
        <img
          src={dress.images[currentImageIndex] || dress.images[0]}
          alt={dress.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {dress.isNew && (
            <span className="bg-[#121212] text-white text-[10px] uppercase font-sans tracking-widest px-2.5 py-1 font-medium">
              New Season
            </span>
          )}
          {dress.isBestseller && (
            <span className="bg-[#C5A059] text-white text-[10px] uppercase font-sans tracking-widest px-2.5 py-1 font-medium">
              Iconic
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          id={`wishlist-btn-${dress.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(dress);
          }}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-neutral-800 flex items-center justify-center backdrop-blur-xs transition-all shadow-xs"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted ? 'fill-[#C5A059] text-[#C5A059]' : 'text-neutral-700'
            }`}
          />
        </button>

        {/* Hover Quick View & Customize Bar */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/75 via-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between gap-2 z-10">
          <button
            id={`quick-view-btn-${dress.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(dress);
            }}
            className="flex-1 py-2 px-3 bg-white/95 hover:bg-white text-neutral-900 text-[10px] uppercase font-sans tracking-widest font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>

          <button
            id={`card-customize-btn-${dress.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onCustomize(dress);
            }}
            className="py-2 px-3 bg-[#121212]/90 hover:bg-[#121212] text-[#FDFBF7] text-[10px] uppercase font-sans tracking-widest font-medium flex items-center gap-1 shadow-sm transition-colors"
            title="Customize this dress in Bespoke Studio"
          >
            <Scissors className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="hidden sm:inline">Customize</span>
          </button>
        </div>

        {/* Image Indicators */}
        {dress.images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            {dress.images.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  currentImageIndex === i ? 'bg-white scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Meta & Typography */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow bg-white">
        <div className="flex items-center justify-between text-[11px] text-[#8C8275] uppercase tracking-wider mb-1 font-sans">
          <span>{dress.category}</span>
          <span className="text-[#C5A059] font-medium">{dress.occasion}</span>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => onSelectDress(dress)}
          className="font-serif text-lg sm:text-xl font-medium text-[#121212] hover:text-[#C5A059] transition-colors cursor-pointer mb-1 line-clamp-1"
        >
          {dress.name}
        </h3>

        <p className="text-xs text-[#736B60] font-sans font-light line-clamp-1 mb-3">
          {dress.subtitle}
        </p>

        {/* Color Swatches */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] uppercase font-sans text-neutral-400 tracking-wider">
            {dress.colors[selectedColorIndex]?.name}
          </span>
          <div className="flex items-center gap-1.5 ml-auto">
            {dress.colors.map((c, idx) => (
              <button
                key={c.name}
                onClick={() => {
                  setSelectedColorIndex(idx);
                  if (idx < dress.images.length) setCurrentImageIndex(idx);
                }}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  selectedColorIndex === idx
                    ? 'ring-1 ring-[#121212] ring-offset-1 scale-110'
                    : 'border-black/15'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
                aria-label={`Select color ${c.name}`}
              />
            ))}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-auto pt-3 border-t border-[#F0ECE5] flex items-center justify-between">
          <div>
            <span className="text-sm font-sans font-semibold text-[#121212]">
              {formatPrice(dress.priceINR, currency)}
            </span>
            {dress.originalPriceINR && (
              <span className="text-xs font-sans text-neutral-400 line-through ml-2">
                {formatPrice(dress.originalPriceINR, currency)}
              </span>
            )}
          </div>

          <button
            onClick={() => onSelectDress(dress)}
            className="text-[11px] uppercase font-sans tracking-[0.16em] font-medium text-[#121212] hover:text-[#C5A059] transition-colors"
          >
            Details →
          </button>
        </div>
      </div>
    </div>
  );
};
