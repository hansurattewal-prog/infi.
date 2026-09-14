import React from 'react';
import { X, Trash2, Scissors, Sparkles, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { CartItem, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotalINR = items.reduce((sum, item) => sum + item.priceINR * item.quantity, 0);
  const freeShippingThresholdINR = 15000;
  const progressPercent = Math.min(100, (subtotalINR / freeShippingThresholdINR) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/65 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-[#FDFBF7] text-[#121212] h-full shadow-2xl flex flex-col justify-between border-l border-[#D9D2C7]">
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#E8E2D9]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#121212]" />
              <h2 className="font-serif text-2xl font-light text-[#121212]">Your Shopping Bag</h2>
            </div>
            <button
              id="cart-drawer-close-btn"
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-black transition-colors"
              aria-label="Close Shopping Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Shipping Progress */}
          <div className="bg-white p-3 border border-[#E8E2D9] text-xs font-sans">
            <div className="flex justify-between text-[11px] mb-1.5 text-neutral-600">
              {subtotalINR >= freeShippingThresholdINR ? (
                <span className="text-[#C5A059] font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Complimentary White-Glove Shipping Unlocked</span>
                </span>
              ) : (
                <span>
                  Add {formatPrice(freeShippingThresholdINR - subtotalINR, currency)} for complimentary shipping
                </span>
              )}
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#E8E2D9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#121212] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="py-20 text-center text-neutral-500 font-sans">
              <ShoppingBag className="w-12 h-12 stroke-1 text-neutral-300 mx-auto mb-3" />
              <p className="font-serif text-xl text-[#121212] mb-1">Your bag is currently empty</p>
              <p className="text-xs text-neutral-500 mb-6">Discover our curated evening collections or bespoke tailoring.</p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#121212] text-white text-xs uppercase font-sans tracking-widest"
              >
                Explore Gowns
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 bg-white border border-[#E8E2D9] shadow-2xs"
              >
                {/* Thumbnail */}
                <div className="w-20 h-24 bg-[#F4EFEB] overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-serif text-base font-medium text-[#121212] line-clamp-1">{item.name}</h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-neutral-400 hover:text-red-700 p-0.5 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] font-sans text-[#736B60] space-y-0.5 mt-0.5">
                      {item.isCustom ? (
                        <div className="flex items-center gap-1 text-[#C5A059] font-medium">
                          <Scissors className="w-3 h-3" />
                          <span>Bespoke Made-to-Measure</span>
                        </div>
                      ) : (
                        <p>Size: {item.size} • Color: {item.color}</p>
                      )}
                      {item.bespokeDetails && (
                        <p className="text-[10px] text-neutral-500">
                          {item.bespokeDetails.measurements.bust}"B • {item.bespokeDetails.measurements.waist}"W • {item.bespokeDetails.measurements.hips}"H
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#F0ECE5]">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-[#E8E2D9] text-xs font-sans">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-2 py-0.5 hover:bg-[#F4EFEB]"
                      >
                        -
                      </button>
                      <span className="px-2 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 hover:bg-[#F4EFEB]"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-sans text-xs font-semibold text-[#121212]">
                      {formatPrice(item.priceINR * item.quantity, currency)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#E8E2D9] bg-white space-y-4">
            <div className="space-y-1.5 text-xs font-sans">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal</span>
                <span className="text-[#121212] font-medium">{formatPrice(subtotalINR, currency)}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>White-Glove Courier</span>
                <span className="text-[#C5A059] font-medium">
                  {subtotalINR >= freeShippingThresholdINR ? 'Complimentary' : formatPrice(1500, currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#121212] pt-2 border-t border-[#F0ECE5]">
                <span>Estimated Total</span>
                <span>{formatPrice(subtotalINR >= freeShippingThresholdINR ? subtotalINR : subtotalINR + 1500, currency)}</span>
              </div>
            </div>

            <button
              id="cart-drawer-checkout-btn"
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-4 bg-[#121212] hover:bg-[#2A2825] text-white text-xs font-sans uppercase tracking-[0.22em] font-semibold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400 font-sans">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Complimentary Garment Bag & 30-Day Returns</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
