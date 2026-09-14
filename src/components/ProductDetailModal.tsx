import React, { useState } from 'react';
import { X, Heart, Sparkles, Scissors, ShieldCheck, Truck, RefreshCw, Check, ArrowRight, Ruler } from 'lucide-react';
import { Dress, CurrencyCode, AccessoryItem, UserBehaviorProfile } from '../types';
import { formatPrice } from '../utils/currency';
import { getProductPageRecommendations } from '../services/recommendationEngine';

interface ProductDetailModalProps {
  dress: Dress | null;
  currency: CurrencyCode;
  isWishlisted: boolean;
  onClose: () => void;
  onAddToCart: (dress: Dress, size: string, color: string, selectedAccessories: AccessoryItem[]) => void;
  onCustomize: (dress: Dress) => void;
  onToggleWishlist: (dress: Dress) => void;
  onOpenSizeAdvisor: (dress: Dress) => void;
  onSelectRelatedDress: (dress: Dress) => void;
  allDresses: Dress[];
  userProfile?: UserBehaviorProfile;
  allAccessories?: AccessoryItem[];
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  dress,
  currency,
  isWishlisted,
  onClose,
  onAddToCart,
  onCustomize,
  onToggleWishlist,
  onOpenSizeAdvisor,
  onSelectRelatedDress,
  allDresses,
  userProfile,
  allAccessories = [],
}) => {
  if (!dress) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(dress.sizes[1] || dress.sizes[0]);
  const [selectedColor, setSelectedColor] = useState<string>(dress.colors[0]?.name || '');
  const [selectedAccessories, setSelectedAccessories] = useState<AccessoryItem[]>([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'fabric' | 'shipping'>('details');
  const [addedAnimation, setAddedAnimation] = useState(false);

  // AI-Powered Product Page Recommendations
  const effectiveProfile: UserBehaviorProfile = userProfile || {
    browsingHistory: [],
    cartDressIds: [],
    wishlistDressIds: [],
    pastPurchases: [],
  };
  const aiRecs = getProductPageRecommendations(dress, effectiveProfile, allDresses, allAccessories);

  // Toggle accessory in Complete The Look
  const toggleAccessory = (acc: AccessoryItem) => {
    setSelectedAccessories((prev) =>
      prev.some((item) => item.id === acc.id)
        ? prev.filter((item) => item.id !== acc.id)
        : [...prev, acc]
    );
  };

  const handleAdd = () => {
    onAddToCart(dress, selectedSize, selectedColor, selectedAccessories);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  // Bundle calculations (10% styling discount when accessories bundled)
  const accessoriesTotal = selectedAccessories.reduce((acc, item) => acc + item.priceINR, 0);
  const bundleDiscount = selectedAccessories.length > 0 ? Math.round((dress.priceINR + accessoriesTotal) * 0.1) : 0;
  const bundleTotal = dress.priceINR + accessoriesTotal - bundleDiscount;

  // "You May Also Like" recommendations
  const relatedDresses = allDresses
    .filter((d) => d.id !== dress.id && (d.category === dress.category || d.occasion === dress.occasion))
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-6xl bg-[#FDFBF7] text-[#121212] shadow-2xl border border-[#D9D2C7] my-auto overflow-hidden">
        {/* Close Button */}
        <button
          id="product-modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center transition-all shadow-md"
          aria-label="Close detail modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[92vh] overflow-y-auto">
          {/* Left: High-Resolution Visual Gallery (Dior Style) */}
          <div className="lg:col-span-7 bg-[#F4EFEB] p-4 sm:p-8 flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-[#E8E2D9]">
            {/* Main Stage Image with Zoom Indicator */}
            <div
              className={`relative w-full aspect-[3/4] max-h-[600px] overflow-hidden cursor-zoom-in bg-white shadow-sm flex items-center justify-center ${
                isZoomed ? 'scale-125 transition-transform duration-300' : ''
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
              title="Click to zoom haute fabric detail"
            >
              <img
                src={dress.images[activeImageIndex] || dress.images[0]}
                alt={dress.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-sans px-2 py-1 uppercase tracking-widest pointer-events-none">
                {isZoomed ? 'Click to minimize' : 'Click to inspect drape'}
              </div>
            </div>

            {/* Thumbnail Carousel */}
            <div className="flex items-center gap-3 mt-4 overflow-x-auto py-2 w-full justify-center">
              {dress.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setIsZoomed(false);
                  }}
                  className={`w-16 h-20 overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx ? 'border-[#121212] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${dress.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Haute Craftsmanship Guarantee Banner */}
            <div className="w-full mt-4 p-3 bg-white border border-[#E8E2D9] flex items-center justify-between text-[11px] font-sans text-neutral-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>100% Verified Haute Fabrics & Internal Boning</span>
              </span>
              <span className="text-[#C5A059] font-medium uppercase tracking-wider">Atelier Inspected</span>
            </div>
          </div>

          {/* Right: Product Details, Sizing, Complete The Look */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs uppercase font-sans tracking-[0.2em] text-[#8C8275] mb-2">
                <span>{dress.category} • {dress.occasion}</span>
                <span className="text-[#C5A059] font-medium">★ {dress.rating} ({dress.reviewsCount} reviews)</span>
              </div>

              {/* Title & Subtitle */}
              <h1 className="font-serif text-3xl sm:text-4xl text-[#121212] font-normal leading-tight mb-2">
                {dress.name}
              </h1>
              <p className="text-xs text-[#736B60] font-sans font-light leading-relaxed mb-4">
                {dress.subtitle}
              </p>

              {/* Pricing & Installments */}
              <div className="mb-6 pb-4 border-b border-[#E8E2D9]">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-2xl font-sans font-semibold text-[#121212]">
                    {formatPrice(dress.priceINR, currency)}
                  </span>
                  {dress.originalPriceINR && (
                    <span className="text-sm font-sans text-neutral-400 line-through">
                      {formatPrice(dress.originalPriceINR, currency)}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#8C8275] font-sans">
                  Tax included. Or 3 interest-free payments of {formatPrice(Math.round(dress.priceINR / 3), currency)} via UPI & Cards.
                </p>
              </div>

              {/* Color Selection */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs font-sans uppercase tracking-wider mb-2">
                  <span className="text-neutral-500">Color:</span>
                  <span className="font-medium text-[#121212]">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-3">
                  {dress.colors.map((c, idx) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setSelectedColor(c.name);
                        if (idx < dress.images.length) setActiveImageIndex(idx);
                      }}
                      className={`group flex items-center gap-2 px-3 py-1.5 border text-xs font-sans transition-all ${
                        selectedColor === c.name
                          ? 'border-[#121212] bg-[#F4EFEB] font-medium'
                          : 'border-[#E8E2D9] bg-white hover:border-neutral-400'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection & AI Size Tool */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-sans uppercase tracking-wider mb-2">
                  <span className="text-neutral-500">Select Standard Size:</span>
                  <button
                    id="trigger-truefit-size-btn"
                    onClick={() => onOpenSizeAdvisor(dress)}
                    className="flex items-center gap-1 text-[#C5A059] hover:text-[#997A35] font-medium underline"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>TrueFit AI Size Advisor</span>
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {dress.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-2 text-xs font-sans tracking-wider uppercase border transition-all ${
                        selectedSize === s
                          ? 'border-[#121212] bg-[#121212] text-white font-semibold'
                          : 'border-[#E8E2D9] bg-white text-neutral-800 hover:border-black'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Actions: Add to Bag & Custom Tailoring */}
              <div className="space-y-3 mb-6">
                <button
                  id="modal-add-to-cart-btn"
                  onClick={handleAdd}
                  className="w-full py-4 bg-[#121212] hover:bg-[#2A2825] text-white text-xs font-sans uppercase tracking-[0.22em] font-medium flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 text-[#C5A059]" />
                      <span>Added to Shopping Bag</span>
                    </>
                  ) : (
                    <span>
                      Add to Bag • {formatPrice(selectedAccessories.length > 0 ? bundleTotal : dress.priceINR, currency)}
                    </span>
                  )}
                </button>

                {/* Bespoke Customization Button */}
                <button
                  id="modal-customize-dress-btn"
                  onClick={() => onCustomize(dress)}
                  className="w-full py-3.5 bg-transparent border border-[#C5A059] text-[#997A35] hover:bg-[#C5A059]/10 text-xs font-sans uppercase tracking-[0.22em] font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Scissors className="w-4 h-4 text-[#C5A059]" />
                  <span>Customize Measurements (Made-to-Order)</span>
                </button>

                {/* Wishlist button */}
                <button
                  id="modal-wishlist-toggle-btn"
                  onClick={() => onToggleWishlist(dress)}
                  className="w-full py-2.5 text-neutral-600 hover:text-black text-xs font-sans uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#C5A059] text-[#C5A059]' : ''}`} />
                  <span>{isWishlisted ? 'Saved in Your Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>

              {/* FENDI-INSPIRED "COMPLETE THE LOOK" CAROUSEL */}
              {dress.completeTheLook && dress.completeTheLook.length > 0 && (
                <div className="mb-6 p-4 bg-[#F4EFEB] border border-[#E8E2D9]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span className="text-xs uppercase font-sans font-semibold tracking-wider text-[#121212]">
                        Complete the Look
                      </span>
                    </div>
                    {selectedAccessories.length > 0 && (
                      <span className="text-[10px] uppercase font-sans font-semibold tracking-wider text-[#C5A059] bg-white px-2 py-0.5 rounded-xs">
                        10% Styling Bundle Applied
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#736B60] font-sans mb-3">
                    Curated by Infi senior stylists to complement {dress.name}.
                  </p>

                  <div className="space-y-2.5">
                    {dress.completeTheLook.map((item) => {
                      const isSelected = selectedAccessories.some((a) => a.id === item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleAccessory(item)}
                          className={`flex items-center justify-between p-2 rounded-xs bg-white border cursor-pointer transition-all ${
                            isSelected ? 'border-[#C5A059] ring-1 ring-[#C5A059]' : 'border-[#E8E2D9] hover:border-neutral-400'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xs" />
                            <div>
                              <p className="text-xs font-serif font-medium text-[#121212]">{item.name}</p>
                              <p className="text-[11px] font-sans text-[#8C8275]">
                                {formatPrice(item.priceINR, currency)}
                              </p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected ? 'bg-[#C5A059] border-[#C5A059] text-white' : 'border-neutral-300'
                          }`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Informational Accordion Tabs */}
              <div className="border-t border-[#E8E2D9] pt-4 mb-6">
                <div className="flex border-b border-[#E8E2D9] text-xs font-sans uppercase tracking-wider mb-3">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-2 mr-4 border-b-2 transition-all ${
                      activeTab === 'details' ? 'border-[#121212] font-semibold text-[#121212]' : 'border-transparent text-neutral-400'
                    }`}
                  >
                    Details & Drape
                  </button>
                  <button
                    onClick={() => setActiveTab('fabric')}
                    className={`pb-2 mr-4 border-b-2 transition-all ${
                      activeTab === 'fabric' ? 'border-[#121212] font-semibold text-[#121212]' : 'border-transparent text-neutral-400'
                    }`}
                  >
                    Fabrics & Care
                  </button>
                  <button
                    onClick={() => setActiveTab('shipping')}
                    className={`pb-2 border-b-2 transition-all ${
                      activeTab === 'shipping' ? 'border-[#121212] font-semibold text-[#121212]' : 'border-transparent text-neutral-400'
                    }`}
                  >
                    30-Day Returns
                  </button>
                </div>

                <div className="text-xs font-sans text-[#59534A] leading-relaxed">
                  {activeTab === 'details' && (
                    <div className="space-y-2">
                      <p>{dress.description}</p>
                      <p className="italic text-[#8C8275] border-l-2 border-[#C5A059] pl-3 py-1 font-serif">
                        {dress.designerNote}
                      </p>
                    </div>
                  )}
                  {activeTab === 'fabric' && (
                    <div className="space-y-1.5">
                      <p><strong>Primary Fabric:</strong> {dress.fabric}</p>
                      <p><strong>Lining:</strong> {dress.lining}</p>
                      <p><strong>Care:</strong> {dress.careInstructions}</p>
                    </div>
                  )}
                  {activeTab === 'shipping' && (
                    <div className="space-y-1.5">
                      <p className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>White-glove express courier: 3-5 business days.</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Complimentary 30-day returns on all unworn items with tags.</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* AI-POWERED "YOU MAY ALSO LIKE" ROW */}
              {aiRecs.dresses.length > 0 && (
                <div className="border-t border-[#E8E2D9] pt-5 mt-2">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                      <h4 className="text-xs font-sans uppercase tracking-[0.2em] font-semibold text-[#121212]">
                        You May Also Like
                      </h4>
                    </div>
                    <span className="text-[10px] text-[#8C8275] font-sans">
                      AI Curated for Your Profile
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {aiRecs.dresses.map((item) => (
                      <div
                        key={item.dress.id}
                        onClick={() => onSelectRelatedDress(item.dress)}
                        className="cursor-pointer group"
                      >
                        <div className="aspect-[3/4] overflow-hidden bg-[#F4EFEB] mb-1.5 relative">
                          <img
                            src={item.dress.images[0]}
                            alt={item.dress.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-1.5 left-1.5 bg-black/80 text-white text-[9px] font-sans px-1.5 py-0.5 uppercase tracking-wider">
                            {item.matchScore}%
                          </div>
                        </div>
                        <p className="text-[11px] font-serif font-medium text-[#121212] line-clamp-1 group-hover:text-[#C5A059] transition-colors">
                          {item.dress.name}
                        </p>
                        <p className="text-[10px] font-sans text-neutral-500">
                          {formatPrice(item.dress.priceINR, currency)}
                        </p>
                        <p className="text-[9px] text-[#8C8275] font-sans line-clamp-1 mt-0.5">
                          {item.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
