import React, { useState } from 'react';
import { ShoppingBag, Heart, Sparkles, Phone, Menu, X, Globe, Scissors, Mail } from 'lucide-react';
import { CurrencyCode } from '../types';
import { CURRENCY_RATES } from '../utils/currency';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  cartCount: number;
  wishlistCount: number;
  openCart: () => void;
  openWishlist: () => void;
  openAiStylist: () => void;
  openQuiz: () => void;
  openEmailCampaign?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  cartCount,
  wishlistCount,
  openCart,
  openWishlist,
  openAiStylist,
  openQuiz,
  openEmailCampaign,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Collection' },
    { id: 'custom', label: 'Bespoke Studio', icon: Scissors },
    { id: 'lookbook', label: 'Stories & Lookbook' },
    { id: 'quiz', label: 'Style Quiz', action: openQuiz },
    { id: 'support', label: 'Atelier & Returns' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E8E2D9]">
      {/* Top Luxury Announcement Micro-Bar */}
      <div className="bg-[#121212] text-[#E5DFD5] text-[11px] font-sans tracking-widest uppercase py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
            <span>Complimentary Bespoke Consultation & Global White-Glove Delivery</span>
          </div>

          <div className="flex items-center gap-5 text-xs">
            <a
              href="tel:+918295313004"
              id="header-phone-link"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-[#C5A059]" />
              <span>Atelier: +91 8295313004</span>
            </a>

            {/* Currency Selector */}
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-neutral-400" />
              <select
                id="currency-selector"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                aria-label="Select shopping currency"
                className="bg-transparent border-none text-[#E5DFD5] focus:ring-0 focus:outline-none cursor-pointer text-[11px] font-medium py-0"
              >
                {(Object.keys(CURRENCY_RATES) as CurrencyCode[]).map((code) => (
                  <option key={code} value={code} className="bg-[#1a1a1a] text-white">
                    {CURRENCY_RATES[code].label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Luxury Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Trigger */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-800 hover:text-neutral-900 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Left Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-sans font-medium uppercase tracking-[0.18em] text-neutral-700">
            {navLinks.slice(0, 3).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`transition-colors duration-200 relative py-2 flex items-center gap-1.5 ${
                    activeTab === item.id
                      ? 'text-[#121212] font-semibold'
                      : 'hover:text-[#121212]'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 text-[#C5A059]" />}
                  <span>{item.label}</span>
                  {activeTab === item.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#121212]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Center Brand Identity */}
          <div className="flex flex-col items-center cursor-pointer" onClick={() => setActiveTab('home')}>
            <span className="font-serif text-3xl sm:text-4xl tracking-[0.28em] font-medium text-[#121212] select-none">
              I N F I
            </span>
            <span className="text-[9px] font-sans tracking-[0.35em] text-[#8C8275] uppercase -mt-1 font-light">
              Haute Couture & Atelier
            </span>
          </div>

          {/* Right Navigation & Utility Actions */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Desktop secondary links */}
            <nav className="hidden lg:flex items-center space-x-6 text-xs font-sans font-medium uppercase tracking-[0.18em] text-neutral-700 mr-2">
              {navLinks.slice(3).map((item) => (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`transition-colors duration-200 relative py-2 ${
                    activeTab === item.id
                      ? 'text-[#121212] font-semibold'
                      : 'hover:text-[#121212]'
                  }`}
                >
                  <span>{item.label}</span>
                  {activeTab === item.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#121212]" />
                  )}
                </button>
              ))}
            </nav>

            {/* AI Stylist Button */}
            <button
              id="open-ai-stylist-btn"
              onClick={openAiStylist}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-sans font-medium tracking-wider uppercase bg-[#F4EFEB] hover:bg-[#EBE3D8] text-[#121212] rounded-full border border-[#D9D2C7] transition-all"
              title="Consult Infi AI Couturier & Size Concierge"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="hidden sm:inline">AI Stylist</span>
            </button>

            {/* Targeted VIP Email Campaign Preview Button */}
            {openEmailCampaign && (
              <button
                id="open-vip-campaign-nav-btn"
                onClick={openEmailCampaign}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-sans font-medium tracking-wider uppercase bg-transparent hover:bg-[#F4EFEB] text-[#121212] rounded-full border border-[#D9D2C7] transition-all"
                title="View Targeted VIP Email Campaign & Atelier Edit"
              >
                <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="hidden lg:inline">VIP Edit</span>
              </button>
            )}

            {/* Wishlist Icon */}
            <button
              id="open-wishlist-btn"
              onClick={openWishlist}
              className="relative p-2 text-neutral-700 hover:text-black transition-colors"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.5]" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C5A059] text-white text-[10px] font-medium flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Icon */}
            <button
              id="open-cart-btn"
              onClick={openCart}
              className="relative p-2 text-neutral-800 hover:text-black transition-colors flex items-center gap-2"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#121212] text-white text-[10px] font-medium flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FDFBF7] border-b border-[#E8E2D9] px-6 py-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3 font-sans text-sm tracking-wider uppercase text-neutral-800">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      setActiveTab(item.id);
                    }
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left py-2 border-b border-[#EFEBE4] flex items-center justify-between ${
                    activeTab === item.id ? 'font-bold text-[#C5A059]' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-[#C5A059]" />}
                    {item.label}
                  </span>
                  <span className="text-xs text-neutral-400">→</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => {
                openAiStylist();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 bg-[#121212] text-[#FDFBF7] text-xs uppercase tracking-widest font-sans flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>Consult Infi AI Couturier</span>
            </button>
            <div className="text-center text-xs text-neutral-500 py-1">
              Atelier Hotline: <a href="tel:+918295313004" className="text-neutral-800 font-medium">+91 8295313004</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
