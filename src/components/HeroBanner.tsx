import React from 'react';
import { ArrowRight, Sparkles, Scissors, ShieldCheck, Ruler, Clock } from 'lucide-react';

interface HeroBannerProps {
  onShopClick: () => void;
  onCustomClick: () => void;
  onLookbookClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onShopClick,
  onCustomClick,
  onLookbookClick,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#121212] text-[#FDFBF7]">
      {/* Luxury Cinematic Hero Visual */}
      <div className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center">
        {/* Background Editorial Imagery with Soft Contrast Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=2000&q=90"
            alt="Infi Haute Couture Evening Gown Collection"
            className="w-full h-full object-cover object-[center_28%] filter brightness-[0.75] contrast-[1.05]"
          />
          {/* Subtle gradient vignette to preserve high typographic contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/30" />
        </div>

        {/* Hero Editorial Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 lg:py-28 w-full">
          <div className="max-w-2xl">
            {/* Delicate Couture Tagline */}
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-[#C5A059]" />
              <span className="text-xs uppercase tracking-[0.35em] text-[#E0D7C9] font-sans font-light">
                Autumn / Winter Haute Couture
              </span>
            </div>

            {/* Editorial Serif Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[1.08] mb-6 text-white">
              Signature Elegance, <br />
              <span className="italic font-normal text-[#F4EFEB]">Handcrafted for You.</span>
            </h1>

            {/* Supporting Minimalist Copy */}
            <p className="text-sm sm:text-base text-[#D4CBBF] font-sans font-light leading-relaxed max-w-xl mb-10 tracking-wide">
              Where sculptural silhouette meets timeless drape. Discover ready-to-wear luxury formalwear, or collaborate with our master atelier for bespoke made-to-measure gowns tailored to your unique anatomy.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                id="hero-shop-dresses-btn"
                onClick={onShopClick}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#FDFBF7] text-[#121212] hover:bg-[#EBE5DC] text-xs font-sans uppercase tracking-[0.22em] font-medium transition-all shadow-xl cursor-pointer"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                id="hero-custom-order-btn"
                onClick={onCustomClick}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border border-[#FDFBF7]/60 text-[#FDFBF7] hover:bg-white/10 hover:border-white text-xs font-sans uppercase tracking-[0.22em] font-medium transition-all cursor-pointer backdrop-blur-xs"
              >
                <Scissors className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Bespoke Tailoring</span>
              </button>

              <button
                id="hero-lookbook-link-btn"
                onClick={onLookbookClick}
                className="text-xs uppercase tracking-[0.2em] text-[#C5A059] hover:text-white font-sans py-2 px-2 transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <span>View Stories</span>
                <span className="text-sm">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Atelier Trust Pillars Bar */}
      <div className="bg-[#181715] border-t border-[#2A2825] py-5 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <Ruler className="w-4 h-4 text-[#C5A059] shrink-0" />
            <div>
              <p className="text-xs uppercase font-sans tracking-wider text-white font-medium">Bespoke Anatomical Fit</p>
              <p className="text-[11px] text-[#A69E92] font-light">40+ points of custom measurements</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
            <div>
              <p className="text-xs uppercase font-sans tracking-wider text-white font-medium">Haute Materials</p>
              <p className="text-[11px] text-[#A69E92] font-light">Grade 6A Mulberry silk & French lace</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
            <div>
              <p className="text-xs uppercase font-sans tracking-wider text-white font-medium">30-Day Effortless Returns</p>
              <p className="text-[11px] text-[#A69E92] font-light">Unworn with tags or full exchange</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <Clock className="w-4 h-4 text-[#C5A059] shrink-0" />
            <div>
              <p className="text-xs uppercase font-sans tracking-wider text-white font-medium">Dedicated Master Couturier</p>
              <p className="text-[11px] text-[#A69E92] font-light">Direct phone & WhatsApp styling</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
