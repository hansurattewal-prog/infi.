import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Scissors,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Eye,
  MessageSquare,
  Truck,
  RotateCcw
} from 'lucide-react';

import { DRESSES, ACCESSORIES } from './data/products';
import { LOOKBOOK_COLLECTIONS, LOOKBOOKS } from './data/lookbooks';
import {
  Dress,
  CurrencyCode,
  CartItem,
  AccessoryItem,
  BespokeCustomization,
  OrderConfirmationData,
  UserBehaviorProfile,
  AIRecommendationsResponse,
  TargetedEmailCampaign,
  UserQuizPreferences,
  PastPurchaseItem
} from './types';
import { formatPrice } from './utils/currency';
import {
  computeLocalRecommendations,
  getAIRecommendations,
  generateTargetedEmailCampaign
} from './services/recommendationEngine';

import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { BrandStory } from './components/BrandStory';
import { ProductCard } from './components/ProductCard';
import { CatalogGrid } from './components/CatalogGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { BespokeStudio } from './components/BespokeStudio';
import { LookbookView } from './components/LookbookView';
import { SupportPortal } from './components/SupportPortal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { DressQuizModal } from './components/DressQuizModal';
import { AISizeAdvisorModal } from './components/AISizeAdvisorModal';
import { AIStylistChat } from './components/AIStylistChat';
import { RecommendedForYou } from './components/RecommendedForYou';
import { TargetedEmailModal } from './components/TargetedEmailModal';
import { Footer } from './components/Footer';

export default function App() {
  // Navigation & Page State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currency, setCurrency] = useState<CurrencyCode>('INR');

  // E-commerce State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['infi-01', 'infi-04']);
  const [selectedDress, setSelectedDress] = useState<Dress | null>(null);
  const [bespokeBaseDress, setBespokeBaseDress] = useState<Dress | null>(null);

  // Modals & Drawers Visibility
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [isSizeAdvisorOpen, setIsSizeAdvisorOpen] = useState<boolean>(false);
  const [sizeAdvisorDress, setSizeAdvisorDress] = useState<Dress | null>(null);
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);

  // AI-Powered Recommendation Engine State
  const [userProfile, setUserProfile] = useState<UserBehaviorProfile>(() => {
    return {
      browsingHistory: [
        { dressId: 'infi-01', viewedAt: Date.now() - 3600000, viewCount: 2 },
        { dressId: 'infi-02', viewedAt: Date.now() - 1800000, viewCount: 1 },
      ],
      cartDressIds: [],
      wishlistDressIds: ['infi-01', 'infi-04'],
      pastPurchases: [],
      quizPreferences: {
        occasion: 'Black Tie Gala',
        silhouette: 'Column / Sheath',
        mood: 'Minimalist & Sculptural',
        fitPriority: 'Sculpted Waist & Elegant Draping',
        completedAt: Date.now() - 7200000,
      },
    };
  });

  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendationsResponse>(() =>
    computeLocalRecommendations(
      {
        browsingHistory: [
          { dressId: 'infi-01', viewedAt: Date.now() - 3600000, viewCount: 2 },
          { dressId: 'infi-02', viewedAt: Date.now() - 1800000, viewCount: 1 },
        ],
        cartDressIds: [],
        wishlistDressIds: ['infi-01', 'infi-04'],
        pastPurchases: [],
        quizPreferences: {
          occasion: 'Black Tie Gala',
          silhouette: 'Column / Sheath',
          mood: 'Minimalist & Sculptural',
          fitPriority: 'Sculpted Waist & Elegant Draping',
          completedAt: Date.now() - 7200000,
        },
      },
      DRESSES,
      ACCESSORIES
    )
  );

  const [targetedEmailCampaign, setTargetedEmailCampaign] = useState<TargetedEmailCampaign | null>(null);
  const [isRecsLoading, setIsRecsLoading] = useState<boolean>(false);

  // Recalculate AI Recommendations whenever user behavior or quiz updates
  const refreshRecommendations = async (profileToUse = userProfile) => {
    setIsRecsLoading(true);
    try {
      const recs = await getAIRecommendations(profileToUse, DRESSES, ACCESSORIES);
      setAiRecommendations(recs);
      const campaign = await generateTargetedEmailCampaign(profileToUse, recs);
      setTargetedEmailCampaign(campaign);
    } catch (err) {
      console.error('Error refreshing recommendations:', err);
    } finally {
      setIsRecsLoading(false);
    }
  };

  // Initial targeted campaign generation
  useEffect(() => {
    generateTargetedEmailCampaign(userProfile, aiRecommendations).then(setTargetedEmailCampaign);
  }, []);

  // Track dress viewing in browsing history
  const handleSelectDressWithTracking = (dress: Dress) => {
    setSelectedDress(dress);
    setUserProfile((prev) => {
      const existing = prev.browsingHistory.find((b) => b.dressId === dress.id);
      let updatedHistory;
      if (existing) {
        updatedHistory = prev.browsingHistory.map((b) =>
          b.dressId === dress.id ? { ...b, viewCount: b.viewCount + 1, viewedAt: Date.now() } : b
        );
      } else {
        updatedHistory = [{ dressId: dress.id, viewedAt: Date.now(), viewCount: 1 }, ...prev.browsingHistory];
      }
      const updatedProfile = { ...prev, browsingHistory: updatedHistory };
      // Background async update of recommendations
      getAIRecommendations(updatedProfile, DRESSES, ACCESSORIES).then((recs) => {
        setAiRecommendations(recs);
        generateTargetedEmailCampaign(updatedProfile, recs).then(setTargetedEmailCampaign);
      });
      return updatedProfile;
    });
  };

  // Handle explicit quiz preference submission
  const handleSaveQuizPreferences = (quizPrefs: UserQuizPreferences) => {
    setUserProfile((prev) => {
      const updatedProfile = {
        ...prev,
        quizPreferences: quizPrefs,
      };
      refreshRecommendations(updatedProfile);
      return updatedProfile;
    });
    showToast('Your styling preferences were saved. Personal recommendations updated.');
  };

  // Simulate behavioral persona presets
  const handleApplyPersonaPreset = (presetId: string) => {
    let presetProfile: UserBehaviorProfile;
    if (presetId === 'gala') {
      presetProfile = {
        browsingHistory: [
          { dressId: 'infi-02', viewedAt: Date.now(), viewCount: 3 },
          { dressId: 'infi-06', viewedAt: Date.now() - 10000, viewCount: 2 },
        ],
        cartDressIds: ['infi-02'],
        wishlistDressIds: ['infi-06'],
        pastPurchases: [],
        quizPreferences: {
          occasion: 'Gala / Black Tie',
          silhouette: 'Mermaid / Hourglass',
          mood: 'Dramatic & Regal',
          fitPriority: 'Sculpted Waist & Train',
          completedAt: Date.now(),
        },
      };
    } else if (presetId === 'riviera') {
      presetProfile = {
        browsingHistory: [
          { dressId: 'infi-03', viewedAt: Date.now(), viewCount: 4 },
          { dressId: 'infi-05', viewedAt: Date.now() - 10000, viewCount: 2 },
        ],
        cartDressIds: ['infi-03'],
        wishlistDressIds: ['infi-05'],
        pastPurchases: [],
        quizPreferences: {
          occasion: 'Riviera Soirée / Destination',
          silhouette: 'Bias-Cut Slip Gown',
          mood: 'Minimalist & Fluid',
          fitPriority: 'Liquid Mulberry Silk Movement',
          completedAt: Date.now(),
        },
      };
    } else if (presetId === 'bride') {
      presetProfile = {
        browsingHistory: [
          { dressId: 'infi-04', viewedAt: Date.now(), viewCount: 3 },
          { dressId: 'infi-05', viewedAt: Date.now() - 10000, viewCount: 2 },
        ],
        cartDressIds: [],
        wishlistDressIds: ['infi-04'],
        pastPurchases: [],
        quizPreferences: {
          occasion: 'Haute Bridal / Wedding Ball',
          silhouette: 'Ball Gown / Cathedral Train',
          mood: 'Romantic & Delicate',
          fitPriority: 'French Chantilly Lace Support',
          completedAt: Date.now(),
        },
      };
    } else {
      presetProfile = {
        browsingHistory: [
          { dressId: 'infi-01', viewedAt: Date.now(), viewCount: 4 },
          { dressId: 'infi-06', viewedAt: Date.now() - 10000, viewCount: 1 },
        ],
        cartDressIds: ['infi-01'],
        wishlistDressIds: ['infi-06'],
        pastPurchases: [],
        quizPreferences: {
          occasion: 'Architectural Awards Soirée',
          silhouette: 'Column / Sheath',
          mood: 'Sculptural & Contemporary',
          fitPriority: 'Crisp Architectural Lines',
          completedAt: Date.now(),
        },
      };
    }

    setUserProfile(presetProfile);
    refreshRecommendations(presetProfile);
    showToast(`Simulating persona: "${presetId.toUpperCase()}"`);
  };

  // Add single accessory directly to bag
  const handleAddAccessoryToCart = (acc: AccessoryItem) => {
    const accessoryItem: CartItem = {
      id: `acc-${acc.id}-${Date.now()}`,
      dressId: 'accessory-solo',
      name: acc.name,
      priceINR: acc.priceINR,
      size: 'One Size',
      color: acc.category,
      image: acc.image,
      quantity: 1,
      isCustom: false,
    };
    setCartItems((prev) => [...prev, accessoryItem]);
    setIsCartOpen(true);
    showToast(`Added "${acc.name}" to your shopping bag.`);
  };

  // Toast / Status Message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Wishlist Helpers
  const handleToggleWishlist = (dress: Dress) => {
    setWishlistIds((prev) => {
      if (prev.includes(dress.id)) {
        showToast(`Removed "${dress.name}" from your private wishlist.`);
        return prev.filter((id) => id !== dress.id);
      } else {
        showToast(`Added "${dress.name}" to your private wishlist.`);
        return [...prev, dress.id];
      }
    });
  };

  const wishlistedDresses = DRESSES.filter((d) => wishlistIds.includes(d.id));

  // Add Ready-to-Wear to Bag (including optional Complete the Look accessories)
  const handleAddToCart = (
    dress: Dress,
    size: string,
    color: string,
    selectedAccessories: AccessoryItem[]
  ) => {
    const mainCartItem: CartItem = {
      id: `${dress.id}-${size}-${color}-${Date.now()}`,
      dressId: dress.id,
      name: dress.name,
      priceINR: dress.priceINR,
      size,
      color,
      image: dress.images[0],
      quantity: 1,
      isCustom: false,
    };

    const accessoryItems: CartItem[] = selectedAccessories.map((acc) => ({
      id: `${acc.id}-${Date.now()}-${Math.random()}`,
      dressId: dress.id,
      name: `${acc.name} (Accessory)`,
      priceINR: acc.priceINR,
      size: 'One Size',
      color: acc.category,
      image: acc.image,
      quantity: 1,
      isCustom: false,
    }));

    setCartItems((prev) => [...prev, mainCartItem, ...accessoryItems]);
    setIsCartOpen(true);
    showToast(`Added "${dress.name}" to your shopping bag.`);
  };

  // Quick Add from Wishlist or Catalog
  const handleQuickAdd = (dress: Dress) => {
    const item: CartItem = {
      id: `${dress.id}-M-${dress.colors[0]?.name || 'Noir'}-${Date.now()}`,
      dressId: dress.id,
      name: dress.name,
      priceINR: dress.priceINR,
      size: 'M',
      color: dress.colors[0]?.name || 'Default',
      image: dress.images[0],
      quantity: 1,
      isCustom: false,
    };
    setCartItems((prev) => [...prev, item]);
    setIsCartOpen(true);
    showToast(`Added "${dress.name}" (Size M) to your shopping bag.`);
  };

  // Add Bespoke Made-to-Measure Dress to Bag
  const handleAddToCartWithCustom = (customItem: BespokeCustomization) => {
    const item: CartItem = {
      id: `bespoke-${Date.now()}`,
      dressId: customItem.baseDressId || 'bespoke-custom',
      name: customItem.baseDressName || `Bespoke: ${customItem.silhouette} (${customItem.fabric})`,
      priceINR: customItem.customPriceINR,
      size: 'Bespoke M2M',
      color: customItem.colorName,
      image:
        (customItem.baseDressId && DRESSES.find((d) => d.id === customItem.baseDressId)?.images[0]) ||
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=85',
      quantity: 1,
      isCustom: true,
      bespokeDetails: customItem,
    };

    setCartItems((prev) => [...prev, item]);
    setIsCartOpen(true);
    showToast(`Bespoke made-to-measure gown added to your shopping bag.`);
  };

  // Direct checkout from Bespoke Studio
  const handleProceedToCheckoutFromCustom = (customItem: BespokeCustomization) => {
    handleAddToCartWithCustom(customItem);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Update Item Quantity
  const handleUpdateQuantity = (id: string, qty: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  // Remove Item from Bag
  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Open Custom Studio with Preloaded Dress
  const handleCustomizeDress = (dress: Dress) => {
    setBespokeBaseDress(dress);
    setSelectedDress(null);
    setActiveTab('custom');
  };

  // Size Advisor Launcher
  const handleOpenSizeAdvisor = (dress: Dress) => {
    setSizeAdvisorDress(dress);
    setIsSizeAdvisorOpen(true);
  };

  // Apply Size from AI Advisor into Current Product Detail
  const handleApplyRecommendedSize = (size: string) => {
    showToast(`Master Couturier recommendation applied: Size ${size}`);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#121212] flex flex-col selection:bg-[#C5A059]/20 selection:text-[#121212]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-[#121212] text-white px-5 py-3 shadow-2xl border border-[#3A3835] text-xs font-sans flex items-center gap-2.5 animate-slideInRight">
          <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Luxury Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currency={currency}
        setCurrency={setCurrency}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlistIds.length}
        openCart={() => setIsCartOpen(true)}
        openWishlist={() => setIsWishlistOpen(true)}
        openAiStylist={() => setIsAiChatOpen(true)}
        openQuiz={() => setIsQuizOpen(true)}
        openEmailCampaign={() => setIsEmailModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {/* ================= 1. HOMEPAGE VIEW ================= */}
        {activeTab === 'home' && (
          <div>
            {/* Cinematic Hero */}
            <HeroBanner
              onExploreCollection={() => setActiveTab('shop')}
              onOpenBespoke={() => {
                setBespokeBaseDress(null);
                setActiveTab('custom');
              }}
              onOpenQuiz={() => setIsQuizOpen(true)}
            />

            {/* Editorial Brand Narrative */}
            <BrandStory
              onExploreCraft={() => setActiveTab('custom')}
              onViewLookbook={() => setActiveTab('lookbook')}
            />

            {/* Featured Gowns Carousel / Highlights */}
            <section className="py-16 sm:py-24 bg-white border-y border-[#E8E2D9]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                  <div>
                    <span className="text-xs uppercase font-sans tracking-[0.3em] text-[#C5A059] font-medium block mb-2">
                      Iconic Creations
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#121212]">
                      Signature Evening Silhouettes
                    </h2>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center gap-4">
                    <button
                      onClick={() => setIsQuizOpen(true)}
                      className="text-xs font-sans uppercase tracking-widest text-[#736B60] hover:text-[#121212] flex items-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Take Style Quiz</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('shop')}
                      className="text-xs font-sans uppercase tracking-widest font-semibold text-[#121212] flex items-center gap-1 border-b border-[#121212] pb-0.5 hover:text-[#C5A059] hover:border-[#C5A059] transition-colors"
                    >
                      <span>Explore All 9 Gowns</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 4 Featured Products */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {DRESSES.slice(0, 4).map((dress) => (
                    <ProductCard
                      key={dress.id}
                      dress={dress}
                      currency={currency}
                      isWishlisted={wishlistIds.includes(dress.id)}
                      onToggleWishlist={handleToggleWishlist}
                      onQuickView={handleSelectDressWithTracking}
                      onSelectDress={handleSelectDressWithTracking}
                      onCustomize={handleCustomizeDress}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* AI-Powered Personalized Recommendations ("Recommended for You") */}
            <RecommendedForYou
              recommendations={aiRecommendations}
              isLoading={isRecsLoading}
              currency={currency}
              wishlistIds={wishlistIds}
              userProfile={userProfile}
              onSelectDress={handleSelectDressWithTracking}
              onQuickView={handleSelectDressWithTracking}
              onToggleWishlist={handleToggleWishlist}
              onCustomize={handleCustomizeDress}
              onAddToCart={handleQuickAdd}
              onAddAccessoryToCart={handleAddAccessoryToCart}
              onOpenQuiz={() => setIsQuizOpen(true)}
              onOpenEmailCampaign={() => setIsEmailModalOpen(true)}
              onRefreshRecommendations={() => refreshRecommendations(userProfile)}
            />

            {/* Bespoke Atelier Teaser Callout */}
            <section className="py-20 bg-[#FAF8F5]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white border border-[#E8E2D9] p-8 sm:p-14 shadow-xs">
                  <div className="lg:col-span-7 space-y-5">
                    <span className="text-xs uppercase font-sans tracking-[0.3em] text-[#C5A059] font-medium block">
                      Haute Couture Made-to-Measure
                    </span>
                    <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#121212] leading-tight">
                      "A dress should follow the frame of the woman, not the woman follow the frame of the dress."
                    </h3>
                    <p className="text-xs sm:text-sm text-[#59534A] font-sans font-light leading-relaxed">
                      Every woman’s posture, shoulder slope, and waist-to-hip ratio are singular. Enter the Infi Bespoke Studio to select silhouette, necklines, sleeves, and enter your exact measurements with our illustrated tailoring guide.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div className="border border-[#F0ECE5] p-3">
                        <span className="font-serif text-lg text-[#121212] block mb-1">01. Silhouette</span>
                        <span className="text-[11px] text-[#8C8275] font-sans">Column, Mermaid, Bias Slip or A-Line</span>
                      </div>
                      <div className="border border-[#F0ECE5] p-3">
                        <span className="font-serif text-lg text-[#121212] block mb-1">02. Pure Silk</span>
                        <span className="text-[11px] text-[#8C8275] font-sans">Italian Crepe, Georgette & French Lace</span>
                      </div>
                      <div className="border border-[#F0ECE5] p-3">
                        <span className="font-serif text-lg text-[#121212] block mb-1">03. Fit Promise</span>
                        <span className="text-[11px] text-[#8C8275] font-sans">Complimentary adjustments guarantee</span>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-wrap items-center gap-4">
                      <button
                        onClick={() => {
                          setBespokeBaseDress(null);
                          setActiveTab('custom');
                        }}
                        className="px-8 py-4 bg-[#121212] hover:bg-[#2A2825] text-white text-xs uppercase font-sans tracking-[0.2em] font-semibold flex items-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        <Scissors className="w-4 h-4 text-[#C5A059]" />
                        <span>Launch Bespoke Studio</span>
                      </button>
                      <button
                        onClick={() => setIsQuizOpen(true)}
                        className="px-6 py-4 border border-[#121212] text-[#121212] hover:bg-[#F4EFEB] text-xs uppercase font-sans tracking-[0.18em] font-medium transition-all"
                      >
                        Take Silhouette Survey
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#F4EFEB] shadow-lg">
                      <img
                        src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop"
                        alt="Atelier drape craftsmanship"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-xs p-3 text-white text-xs font-sans">
                        <span className="text-[10px] text-[#C5A059] uppercase tracking-wider block">Live Atelier</span>
                        Individual pattern cutting & hand-finished French seams.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Complete The Look & Styling Preview */}
            <section className="py-16 sm:py-20 bg-white border-t border-[#E8E2D9]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <span className="text-xs uppercase font-sans tracking-[0.3em] text-[#C5A059] font-medium block mb-2">
                    Couture Accents
                  </span>
                  <h3 className="font-serif text-3xl font-light text-[#121212]">
                    Complete the Evening Ensemble
                  </h3>
                  <p className="text-xs text-[#59534A] font-sans mt-1">
                    Carefully curated evening wraps, mother-of-pearl minaudierès, and satin opera gloves designed to pair seamlessly with Infi gowns.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {ACCESSORIES.map((acc) => (
                    <div
                      key={acc.id}
                      className="border border-[#E8E2D9] bg-[#FDFBF7] p-4 flex flex-col justify-between group hover:border-[#121212] transition-all"
                    >
                      <div>
                        <div className="aspect-square overflow-hidden bg-white mb-3">
                          <img
                            src={acc.image}
                            alt={acc.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <span className="text-[10px] uppercase font-sans tracking-wider text-[#8C8275]">
                          {acc.category}
                        </span>
                        <h4 className="font-serif text-base font-medium text-[#121212] mt-0.5">{acc.name}</h4>
                        <p className="text-xs text-neutral-500 font-sans mt-1 line-clamp-2">{acc.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#E8E2D9]">
                        <span className="text-xs font-semibold font-sans text-[#121212]">
                          {formatPrice(acc.priceINR, currency)}
                        </span>
                        <button
                          onClick={() => {
                            const accItem: CartItem = {
                              id: `${acc.id}-${Date.now()}`,
                              dressId: 'accessory',
                              name: acc.name,
                              priceINR: acc.priceINR,
                              size: 'One Size',
                              color: 'Standard',
                              image: acc.image,
                              quantity: 1,
                              isCustom: false,
                            };
                            setCartItems((prev) => [...prev, accItem]);
                            setIsCartOpen(true);
                            showToast(`Added "${acc.name}" to your bag.`);
                          }}
                          className="px-3 py-1.5 bg-[#121212] text-white text-[10px] uppercase font-sans tracking-wider hover:bg-[#C5A059] transition-colors"
                        >
                          Add to Bag
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================= 2. SHOP / COLLECTION VIEW ================= */}
        {activeTab === 'shop' && (
          <div className="py-10 bg-[#FDFBF7]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
              <div className="border-b border-[#E8E2D9] pb-8">
                <span className="text-xs uppercase font-sans tracking-[0.3em] text-[#C5A059] font-medium block mb-2">
                  Atelier Formalwear
                </span>
                <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#121212]">
                  The Couture Gown Collection
                </h1>
                <p className="text-xs sm:text-sm text-[#59534A] font-sans font-light mt-2 max-w-2xl leading-relaxed">
                  Sculptural floor-length silhouettes, fluid bias-cut silks, and dramatic ball gowns. Every creation is available in standard ready-to-wear sizing or customizable to your anatomical measurements.
                </p>
              </div>
            </div>

            <CatalogGrid
              dresses={DRESSES}
              currency={currency}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onQuickView={handleSelectDressWithTracking}
              onSelectDress={handleSelectDressWithTracking}
              onCustomize={handleCustomizeDress}
              onOpenQuiz={() => setIsQuizOpen(true)}
            />
          </div>
        )}

        {/* ================= 3. BESPOKE CUSTOM STUDIO VIEW ================= */}
        {activeTab === 'custom' && (
          <BespokeStudio
            baseDress={bespokeBaseDress}
            currency={currency}
            onAddToCartWithCustom={handleAddToCartWithCustom}
            onProceedToCheckout={handleProceedToCheckoutFromCustom}
          />
        )}

        {/* ================= 4. LOOKBOOK & STORIES VIEW ================= */}
        {activeTab === 'lookbook' && (
          <LookbookView
            lookbooks={LOOKBOOK_COLLECTIONS}
            dresses={DRESSES}
            currency={currency}
            onSelectDress={setSelectedDress}
            onExploreCatalog={() => setActiveTab('shop')}
          />
        )}

        {/* ================= 5. SUPPORT & RETURNS VIEW ================= */}
        {activeTab === 'support' && (
          <SupportPortal
            onOpenAiChat={() => setIsAiChatOpen(true)}
            initialTab="faq"
          />
        )}
      </main>

      {/* Product Detail Modal with "Complete the Look" & AI "You May Also Like" */}
      <ProductDetailModal
        dress={selectedDress}
        currency={currency}
        isWishlisted={selectedDress ? wishlistIds.includes(selectedDress.id) : false}
        onClose={() => setSelectedDress(null)}
        onAddToCart={handleAddToCart}
        onCustomize={handleCustomizeDress}
        onToggleWishlist={handleToggleWishlist}
        onOpenSizeAdvisor={handleOpenSizeAdvisor}
        onSelectRelatedDress={handleSelectDressWithTracking}
        allDresses={DRESSES}
        userProfile={userProfile}
        allAccessories={ACCESSORIES}
      />

      {/* Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        currency={currency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistDresses={wishlistedDresses}
        currency={currency}
        onRemoveWishlist={handleToggleWishlist}
        onSelectDress={handleSelectDressWithTracking}
        onQuickAdd={handleQuickAdd}
      />

      {/* 3-Step Luxury Checkout Modal (UPI, Cards, Apple Pay) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        currency={currency}
        onOrderSuccess={(orderData) => {
          showToast(`Order ${orderData.orderId} successfully placed.`);
          const newPurchase: PastPurchaseItem = {
            orderId: orderData.orderId,
            dressIds: cartItems.map((item) => item.dressId),
            date: new Date().toISOString(),
            totalINR: cartItems.reduce((acc, item) => acc + item.priceINR * item.quantity, 0),
            primaryOccasion: 'Formal Soirée',
          };
          setUserProfile((prev) => {
            const updated = {
              ...prev,
              pastPurchases: [...prev.pastPurchases, newPurchase],
              cartDressIds: [],
            };
            refreshRecommendations(updated);
            return updated;
          });
        }}
        onClearCart={() => setCartItems([])}
      />

      {/* Style & Silhouette Survey / Dress Quiz */}
      <DressQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        dresses={DRESSES}
        currency={currency}
        onSelectDress={handleSelectDressWithTracking}
        onSavePreferences={handleSaveQuizPreferences}
      />

      {/* Targeted VIP Email Campaign Modal */}
      <TargetedEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        campaign={targetedEmailCampaign}
        currency={currency}
        onSelectDress={handleSelectDressWithTracking}
        onApplyPersonaPreset={handleApplyPersonaPreset}
        isRegenerating={isRecsLoading}
      />

      {/* AI TrueFit Size Advisor Modal */}
      <AISizeAdvisorModal
        isOpen={isSizeAdvisorOpen}
        onClose={() => setIsSizeAdvisorOpen(false)}
        dress={sizeAdvisorDress}
        onApplySize={handleApplyRecommendedSize}
      />

      {/* AI Couturier Chatbot Widget */}
      <AIStylistChat
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        activeDress={selectedDress}
        onOpenCustomStudio={() => {
          setIsAiChatOpen(false);
          setActiveTab('custom');
        }}
      />

      {/* Floating AI Couturier Trigger Bubble (when chat is closed) */}
      {!isAiChatOpen && (
        <button
          onClick={() => setIsAiChatOpen(true)}
          id="floating-ai-stylist-btn"
          className="fixed bottom-6 right-6 z-40 bg-[#121212] hover:bg-[#2A2825] text-white p-3.5 rounded-full shadow-2xl border border-[#C5A059]/50 flex items-center gap-2 group transition-transform hover:scale-105 cursor-pointer"
          title="Infi AI Couturier & Concierge"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-[#C5A059]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#C5A059] animate-ping" />
          </div>
          <span className="hidden sm:inline text-xs uppercase font-sans tracking-widest font-semibold pr-1">
            AI Couturier
          </span>
        </button>
      )}

      {/* Global Luxury Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAiStylist={() => setIsAiChatOpen(true)}
      />
    </div>
  );
}
