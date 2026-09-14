import React from 'react';
import { X, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Dress, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistedDresses: Dress[];
  currency: CurrencyCode;
  onRemoveWishlist: (dress: Dress) => void;
  onSelectDress: (dress: Dress) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistedDresses,
  currency,
  onRemoveWishlist,
  onSelectDress,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/65 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-[#FDFBF7] text-[#121212] h-full shadow-2xl flex flex-col justify-between border-l border-[#D9D2C7]">
        {/* Header */}
        <div className="p-6 border-b border-[#E8E2D9] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#C5A059] fill-[#C5A059]" />
            <h2 className="font-serif text-2xl font-light text-[#121212]">Your Saved Silhouettes</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-500 hover:text-black transition-colors"
            aria-label="Close Wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {wishlistedDresses.length === 0 ? (
            <div className="py-20 text-center text-neutral-500 font-sans">
              <Heart className="w-12 h-12 stroke-1 text-neutral-300 mx-auto mb-3" />
              <p className="font-serif text-xl text-[#121212] mb-1">Your wishlist is empty</p>
              <p className="text-xs text-neutral-500 mb-6">
                Click the heart icon on any gown in our collection to curate your personal dream wardrobe.
              </p>
            </div>
          ) : (
            wishlistedDresses.map((dress) => (
              <div
                key={dress.id}
                className="flex gap-4 p-3 bg-white border border-[#E8E2D9] shadow-2xs"
              >
                <div
                  onClick={() => {
                    onSelectDress(dress);
                    onClose();
                  }}
                  className="w-20 h-24 bg-[#F4EFEB] overflow-hidden shrink-0 cursor-pointer"
                >
                  <img src={dress.images[0]} alt={dress.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] uppercase font-sans tracking-widest text-[#C5A059]">
                        {dress.silhouette}
                      </span>
                      <button
                        onClick={() => onRemoveWishlist(dress)}
                        className="text-neutral-400 hover:text-red-700 text-xs p-1"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4
                      onClick={() => {
                        onSelectDress(dress);
                        onClose();
                      }}
                      className="font-serif text-base font-medium text-[#121212] hover:text-[#C5A059] cursor-pointer"
                    >
                      {dress.name}
                    </h4>
                    <p className="text-xs text-neutral-500 font-sans mt-0.5">{dress.fabric}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#F0ECE5]">
                    <span className="text-xs font-semibold font-sans">{formatPrice(dress.priceINR, currency)}</span>
                    <button
                      onClick={() => {
                        onSelectDress(dress);
                        onClose();
                      }}
                      className="flex items-center gap-1 text-[11px] uppercase font-sans font-semibold text-[#121212] hover:text-[#C5A059]"
                    >
                      <span>View Gown</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlistedDresses.length > 0 && (
          <div className="p-6 border-t border-[#E8E2D9] bg-white">
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#121212] text-white text-xs uppercase font-sans tracking-widest font-medium"
            >
              Back to Browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
