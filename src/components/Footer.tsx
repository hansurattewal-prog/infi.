import React from 'react';
import { Phone, Mail, MessageSquare, ShieldCheck, Lock, Sparkles, ArrowRight, Instagram, Facebook } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenAiStylist: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAiStylist }) => {
  return (
    <footer className="bg-[#121212] text-[#E8E2D9] pt-16 pb-12 border-t border-[#262422]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Atelier Invitations */}
        <div className="pb-12 mb-12 border-b border-[#262422] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <span className="text-[10px] uppercase font-sans tracking-[0.3em] text-[#C5A059] block mb-2 font-medium">
              Private Client Register
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-light">
              Receive Private Salon Invitations & Couture Previews
            </h3>
            <p className="text-xs text-[#9E9589] font-sans mt-1">
              Subscribers receive early access to seasonal capsule drops and bespoke tailoring priority.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for subscribing to Infi Private Salon previews.');
              }}
              className="flex flex-col sm:flex-row gap-2 max-w-md lg:ml-auto"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="flex-1 p-3 bg-[#1A1917] border border-[#383531] text-xs font-sans text-white focus:outline-none focus:border-[#C5A059]"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#FDFBF7] text-[#121212] hover:bg-[#C5A059] hover:text-white text-xs uppercase font-sans tracking-widest font-semibold transition-all whitespace-nowrap cursor-pointer"
              >
                Join Salon
              </button>
            </form>
          </div>
        </div>

        {/* Main 4-Column Directory */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-[#262422]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-3xl tracking-[0.25em] font-medium text-white">
                I N F I
              </span>
              <span className="text-[9px] font-sans tracking-[0.35em] text-[#8C8275] uppercase -mt-1 font-light">
                Haute Couture & Atelier
              </span>
            </div>
            <p className="text-xs text-[#9E9589] font-sans leading-relaxed max-w-sm">
              Crafting modern formalwear and anatomical made-to-measure gowns. Hand-draped silks, French corded lace, and timeless architectural grace.
            </p>

            <div className="pt-2 space-y-2 text-xs font-sans text-[#BDB5A8]">
              <a
                href="tel:+918295313004"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Atelier Hotline: +91 8295313004</span>
              </a>

              <a
                href="mailto:concierge@inficouture.com"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Private Salon: concierge@inficouture.com</span>
              </a>
            </div>

            {/* Instant WhatsApp Help Button (Explicit prompt requirement) */}
            <div className="pt-2">
              <a
                href="https://wa.me/918295313004?text=Hello%20Infi%20Atelier,%20I%20would%20like%20instant%20styling%20advice"
                target="_blank"
                rel="noopener noreferrer"
                id="footer-whatsapp-chat-btn"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366]/20 border border-[#25D366]/40 hover:bg-[#25D366] text-white text-xs font-sans uppercase tracking-wider rounded-xs transition-all"
              >
                <MessageSquare className="w-4 h-4 text-[#25D366] group-hover:text-white" />
                <span>Chat with us on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Couture Collections */}
          <div>
            <h4 className="text-xs font-sans uppercase tracking-[0.2em] font-semibold text-white mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#9E9589]">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Evening Gowns
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Cocktail & Gala
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Bridal & Red Carpet
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Pure Silk Slips
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('custom')} className="hover:text-white transition-colors text-[#C5A059]">
                  Bespoke Studio (M2M)
                </button>
              </li>
            </ul>
          </div>

          {/* Client Services & Returns */}
          <div>
            <h4 className="text-xs font-sans uppercase tracking-[0.2em] font-semibold text-white mb-4">
              Client Services
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#9E9589]">
              <li>
                <button onClick={() => onNavigate('support')} className="hover:text-white transition-colors">
                  30-Day Return Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support')} className="hover:text-white transition-colors">
                  Online Return Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('custom')} className="hover:text-white transition-colors">
                  Illustrated Sizing Guide
                </button>
              </li>
              <li>
                <button onClick={onOpenAiStylist} className="hover:text-white transition-colors flex items-center gap-1 text-[#C5A059]">
                  <Sparkles className="w-3 h-3" />
                  <span>AI Size Advisor</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support')} className="hover:text-white transition-colors">
                  White-Glove Shipping
                </button>
              </li>
            </ul>
          </div>

          {/* The Maison */}
          <div>
            <h4 className="text-xs font-sans uppercase tracking-[0.2em] font-semibold text-white mb-4">
              The Maison
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#9E9589]">
              <li>
                <button onClick={() => onNavigate('lookbook')} className="hover:text-white transition-colors">
                  Stories & Lookbook
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Atelier Heritage
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support')} className="hover:text-white transition-colors">
                  Book Private Salon
                </button>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white transition-colors">
                  Privacy & Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Trust, Security & Supported Payment Methods (Explicit Prompt Requirement) */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left text-xs font-sans text-[#7E7569]">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span>© {new Date().getFullYear()} INFI Haute Couture Maison. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1 text-[#C5A059]">
              <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted & PCI DSS Compliant
            </span>
          </div>

          {/* Payment Method Badges (UPI, PhonePe, Paytm, GPay, Visa, Mastercard, Apple Pay, PayPal) */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 mr-1">Accepted Payments:</span>
            <span className="px-2 py-1 bg-[#1E1D1A] border border-[#33302B] text-[10px] text-white font-medium">UPI</span>
            <span className="px-2 py-1 bg-[#1E1D1A] border border-[#33302B] text-[10px] text-white font-medium">PhonePe</span>
            <span className="px-2 py-1 bg-[#1E1D1A] border border-[#33302B] text-[10px] text-white font-medium">Paytm</span>
            <span className="px-2 py-1 bg-[#1E1D1A] border border-[#33302B] text-[10px] text-white font-medium">Google Pay</span>
            <span className="px-2 py-1 bg-[#1E1D1A] border border-[#33302B] text-[10px] text-white font-medium">Visa</span>
            <span className="px-2 py-1 bg-[#1E1D1A] border border-[#33302B] text-[10px] text-white font-medium">MasterCard</span>
            <span className="px-2 py-1 bg-[#1E1D1A] border border-[#33302B] text-[10px] text-white font-medium">Apple Pay</span>
            <span className="px-2 py-1 bg-[#1E1D1A] border border-[#33302B] text-[10px] text-white font-medium">PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
