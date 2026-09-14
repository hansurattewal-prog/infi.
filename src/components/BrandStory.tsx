import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface BrandStoryProps {
  onExploreCustom: () => void;
  onExploreLookbook: () => void;
}

export const BrandStory: React.FC<BrandStoryProps> = ({
  onExploreCustom,
  onExploreLookbook,
}) => {
  return (
    <section className="py-20 lg:py-28 bg-[#FDFBF7] border-b border-[#E8E2D9]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual Pair: Artisanal Atelier Photography */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[3/4] w-full max-w-md mx-auto lg:max-w-none overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85"
                alt="Infi Haute Couture Atelier Hand-Draping Process"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] uppercase font-sans tracking-[0.3em] text-[#C5A059] block mb-1">
                  Atelier Archive • No. 04
                </span>
                <p className="font-serif text-lg italic text-[#FDFBF7]">
                  “Every fold is drafted against the natural curve of the collarbone.”
                </p>
              </div>
            </div>

            {/* Inset Detail Badge */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 w-44 p-4 bg-[#121212] text-[#FDFBF7] shadow-xl border border-[#2B2925]">
              <span className="text-[9px] uppercase font-sans tracking-[0.25em] text-[#C5A059] block mb-1">
                Craftsmanship
              </span>
              <p className="text-xs font-serif leading-snug">
                100% French silk threads & internal cotton waist tape.
              </p>
            </div>
          </div>

          {/* Editorial Text Content */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span className="text-xs uppercase tracking-[0.28em] text-[#8C8275] font-sans font-medium">
                The Infi Maison Vision
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#121212] leading-tight mb-6">
              Haute formalwear, uncompromised fit, and the art of deliberate tailoring.
            </h2>

            <p className="text-sm sm:text-base text-[#59534A] font-sans font-light leading-relaxed mb-6">
              Founded on the belief that formalwear should feel as liberating as it is commanding, Infi merges historic French draping techniques with modern precision patterns. We reject mass-production shortcuts: our silks are hand-loomed in Lyon and Como, our laces are corded in Caudry, and our internal boning is custom-curved for day-to-night comfort.
            </p>

            <p className="text-sm sm:text-base text-[#59534A] font-sans font-light leading-relaxed mb-8">
              Whether you select an iconic ready-to-wear gown or commission a bespoke creation through our interactive tailoring studio, each garment is individually inspected by our head couturier before dispatch.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <button
                id="brand-story-custom-btn"
                onClick={onExploreCustom}
                className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] font-semibold text-[#121212] border-b border-[#121212] pb-1 hover:text-[#C5A059] hover:border-[#C5A059] transition-all cursor-pointer"
              >
                <span>Discover Custom Tailoring</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                id="brand-story-lookbook-btn"
                onClick={onExploreLookbook}
                className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-[#7A7165] hover:text-[#121212] transition-colors cursor-pointer"
              >
                <span>Read Autumn / Winter Stories</span>
                <span className="text-sm">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
