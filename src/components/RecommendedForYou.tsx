import React from 'react';
import { Sparkles, ArrowRight, Heart, Eye, Scissors, RefreshCw, Mail, CheckCircle2 } from 'lucide-react';
import {
  Dress,
  AccessoryItem,
  CurrencyCode,
  AIRecommendationsResponse,
  CartItem,
  UserBehaviorProfile,
} from '../types';
import { formatPrice } from '../utils/currency';

interface RecommendedForYouProps {
  recommendations: AIRecommendationsResponse;
  isLoading: boolean;
  currency: CurrencyCode;
  wishlistIds: string[];
  userProfile: UserBehaviorProfile;
  onSelectDress: (dress: Dress) => void;
  onQuickView: (dress: Dress) => void;
  onToggleWishlist: (dress: Dress) => void;
  onCustomize: (dress: Dress) => void;
  onAddToCart: (dress: Dress) => void;
  onAddAccessoryToCart: (acc: AccessoryItem) => void;
  onOpenQuiz: () => void;
  onOpenEmailCampaign: () => void;
  onRefreshRecommendations: () => void;
}

export const RecommendedForYou: React.FC<RecommendedForYouProps> = ({
  recommendations,
  isLoading,
  currency,
  wishlistIds,
  userProfile,
  onSelectDress,
  onQuickView,
  onToggleWishlist,
  onCustomize,
  onAddToCart,
  onAddAccessoryToCart,
  onOpenQuiz,
  onOpenEmailCampaign,
  onRefreshRecommendations,
}) => {
  const totalBrowsed = userProfile.browsingHistory.reduce((sum, b) => sum + b.viewCount, 0);
  const hasQuiz = Boolean(userProfile.quizPreferences?.occasion);

  return (
    <section id="recommended-for-you-section" className="py-16 bg-[#F8F5F0] border-y border-[#E8E2D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-[#E8E2D9] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C5A059] font-sans font-semibold mb-2">
              <Sparkles className="w-4 h-4" />
              <span>AI Couture Intelligence</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#121212] tracking-tight">
              Recommended for You
            </h2>
            <p className="text-xs sm:text-sm text-[#59534A] font-sans font-light mt-1 max-w-2xl">
              Synthesized by analyzing your browsing journey, active styling selections, and explicit tailoring quiz preferences.
            </p>
          </div>

          {/* Persona & Actions Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="refresh-recommendations-btn"
              onClick={onRefreshRecommendations}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-sans uppercase tracking-wider text-neutral-600 bg-white border border-[#D9D2C7] hover:border-black transition-colors"
              title="Recalculate recommendations from latest activity"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#C5A059]' : ''}`} />
              <span>{isLoading ? 'Recalculating...' : 'Refresh'}</span>
            </button>

            <button
              id="preview-targeted-email-btn"
              onClick={onOpenEmailCampaign}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-sans uppercase tracking-wider bg-[#121212] text-white hover:bg-[#2A2825] transition-all shadow-sm"
            >
              <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>View Targeted VIP Email Edit</span>
            </button>
          </div>
        </div>

        {/* Persona Analysis Banner */}
        <div className="bg-white border border-[#E8E2D9] p-4 sm:p-6 mb-10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#F4EFEB] border border-[#D9D2C7] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider text-[#8C8275] font-semibold font-sans">
                  Active Client Persona
                </span>
                <span className="text-[10px] bg-[#C5A059]/15 text-[#997A35] font-sans font-bold px-2 py-0.5">
                  {recommendations.confidenceScore}% Confidence
                </span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-medium text-[#121212] mt-0.5">
                {recommendations.personaSummary}
              </h3>
              <p className="text-xs text-[#59534A] font-sans mt-0.5">
                {recommendations.stylistNote}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[#E8E2D9] shrink-0">
            <div className="text-right hidden lg:block text-xs font-sans text-neutral-500">
              <p>{totalBrowsed} items browsed</p>
              <p>{hasQuiz ? 'Quiz preferences active' : 'Default preferences'}</p>
            </div>
            <button
              id="retake-quiz-profile-btn"
              onClick={onOpenQuiz}
              className="px-3.5 py-2 text-xs font-sans uppercase tracking-wider border border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white transition-colors"
            >
              {hasQuiz ? 'Tweak Style Quiz' : 'Take Style Quiz (+40% Precision)'}
            </button>
          </div>
        </div>

        {/* Recommended Dresses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {recommendations.dresses.map((item) => {
            const isWish = wishlistIds.includes(item.dress.id);

            return (
              <div
                key={item.dress.id}
                className="bg-white border border-[#E8E2D9] flex flex-col justify-between group hover:border-[#121212] hover:shadow-md transition-all relative"
              >
                {/* Image & Badges */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#F4EFEB]">
                  <img
                    src={item.dress.images[0]}
                    alt={item.dress.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Match Score Badge */}
                  <div className="absolute top-3 left-3 bg-[#121212]/90 backdrop-blur-xs text-white text-[10px] font-sans uppercase tracking-widest px-2.5 py-1 flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3 text-[#C5A059]" />
                    <span>{item.matchScore}% Match</span>
                  </div>

                  {/* Curator Tag */}
                  <div className="absolute bottom-3 left-3 bg-white/95 text-[#121212] text-[9px] font-sans uppercase tracking-widest px-2 py-0.5 font-semibold shadow-xs">
                    {item.curatorTag}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => onToggleWishlist(item.dress)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center transition-all shadow-sm"
                    aria-label="Wishlist dress"
                  >
                    <Heart
                      className={`w-4 h-4 ${isWish ? 'fill-[#C5A059] text-[#C5A059]' : 'text-neutral-700'}`}
                    />
                  </button>

                  {/* Quick Action Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onQuickView(item.dress)}
                      className="flex-1 py-2 bg-white/95 hover:bg-white text-[#121212] text-[10px] uppercase font-sans tracking-wider font-semibold flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                    <button
                      onClick={() => onCustomize(item.dress)}
                      className="flex-1 py-2 bg-[#121212] hover:bg-[#C5A059] text-white text-[10px] uppercase font-sans tracking-wider font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>Bespoke</span>
                    </button>
                  </div>
                </div>

                {/* Information & AI Reason Box */}
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] uppercase font-sans tracking-wider text-[#8C8275] mb-1">
                      <span>{item.dress.occasion}</span>
                      <span>{item.dress.silhouette}</span>
                    </div>

                    <h4
                      onClick={() => onSelectDress(item.dress)}
                      className="font-serif text-lg font-medium text-[#121212] hover:text-[#C5A059] transition-colors cursor-pointer line-clamp-1"
                    >
                      {item.dress.name}
                    </h4>

                    <p className="text-xs text-neutral-500 font-sans line-clamp-1 mt-0.5">
                      {item.dress.subtitle}
                    </p>

                    {/* AI Rationale Box */}
                    <div className="mt-3 p-2.5 bg-[#FAF8F5] border border-[#EFEBE4] text-[11px] text-[#59534A] font-sans leading-relaxed">
                      <span className="font-semibold text-[#121212] block mb-0.5">Why Curated for You:</span>
                      {item.reason}
                    </div>
                  </div>

                  {/* Price & Add to Bag */}
                  <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#E8E2D9]">
                    <span className="text-sm font-sans font-bold text-[#121212]">
                      {formatPrice(item.dress.priceINR, currency)}
                    </span>
                    <button
                      onClick={() => onAddToCart(item.dress)}
                      className="px-3.5 py-1.5 bg-[#121212] hover:bg-[#C5A059] text-white text-[10px] uppercase font-sans tracking-wider transition-colors"
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Complementary Curated Accessories Rail */}
        <div className="border-t border-[#E8E2D9] pt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-sans text-[#C5A059] font-medium block mb-1">
                Atelier Pairings
              </span>
              <h3 className="font-serif text-2xl font-light text-[#121212]">
                Recommended Accessories to Complete Your Persona
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.accessories.map((accItem) => (
              <div
                key={accItem.accessory.id}
                className="bg-white border border-[#E8E2D9] p-4 flex flex-col justify-between group hover:border-[#121212] transition-all"
              >
                <div>
                  <div className="aspect-square overflow-hidden bg-[#FAF8F5] mb-3 relative">
                    <img
                      src={accItem.accessory.image}
                      alt={accItem.accessory.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-black/80 text-white text-[9px] font-sans px-2 py-0.5 uppercase tracking-widest">
                      {accItem.matchScore}% Match
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-sans tracking-wider text-[#8C8275]">
                    {accItem.pairedCategory || accItem.accessory.category}
                  </span>
                  <h4 className="font-serif text-base font-medium text-[#121212] mt-0.5">
                    {accItem.accessory.name}
                  </h4>

                  <p className="text-xs text-[#59534A] font-sans mt-1.5 bg-[#FAF8F5] p-2 border border-[#EFEBE4]">
                    {accItem.reason}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#E8E2D9]">
                  <span className="text-xs font-sans font-bold text-[#121212]">
                    {formatPrice(accItem.accessory.priceINR, currency)}
                  </span>
                  <button
                    onClick={() => onAddAccessoryToCart(accItem.accessory)}
                    className="px-3 py-1.5 bg-[#121212] hover:bg-[#C5A059] text-white text-[10px] uppercase font-sans tracking-wider transition-colors"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
