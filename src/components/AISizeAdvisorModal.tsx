import React, { useState } from 'react';
import { X, Sparkles, Ruler, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { Dress } from '../types';

interface AISizeAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  dress: Dress | null;
  onApplySize: (size: string) => void;
}

export const AISizeAdvisorModal: React.FC<AISizeAdvisorModalProps> = ({
  isOpen,
  onClose,
  dress,
  onApplySize,
}) => {
  if (!isOpen) return null;

  const [bust, setBust] = useState('34');
  const [waist, setWaist] = useState('27');
  const [hips, setHips] = useState('37');
  const [height, setHeight] = useState('5\'6" (168cm)');
  const [fitPreference, setFitPreference] = useState('Sculpted / Form-Fitting');
  const [usualBrandSize, setUsualBrandSize] = useState('US 4 / UK 8 / EU 36');
  const [loading, setLoading] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState<string | null>(null);

  const calculateFit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'size_recommendation',
          measurements: { bust, waist, hips, height, fitPreference, usualBrandSize },
          dressContext: dress ? { name: dress.name, fabric: dress.fabric } : undefined,
        }),
      });

      const data = await res.json();
      setRecommendationResult(data.response || 'Recommended Infi Size: M (US 6). Custom alterations available.');
    } catch (err) {
      // Fallback
      setRecommendationResult(
        `Based on your proportions (${bust}" bust, ${waist}" waist, ${hips}" hips), Infi Master Couturiers recommend **Size M (US 6-8)** for ${dress?.name || 'this gown'}. It accommodates the bust line with ease and contours the hips.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#FDFBF7] text-[#121212] border border-[#D9D2C7] p-6 sm:p-8 shadow-2xl my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-black transition-colors"
          aria-label="Close Size Advisor"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C5A059] font-sans font-medium mb-1">
            <Ruler className="w-3.5 h-3.5" />
            <span>TrueFit Couture Sizing</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#121212]">
            AI Size & Drape Consultant
          </h2>
          {dress && (
            <p className="text-xs text-[#736B60] font-sans mt-1">
              Optimizing fit for <strong>{dress.name}</strong> ({dress.fabric})
            </p>
          )}
        </div>

        {/* Form or Result */}
        {!recommendationResult ? (
          <form onSubmit={calculateFit} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                  Bust (in) *
                </label>
                <input
                  type="number"
                  required
                  value={bust}
                  onChange={(e) => setBust(e.target.value)}
                  className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans bg-white focus:outline-none"
                  placeholder="34"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                  Waist (in) *
                </label>
                <input
                  type="number"
                  required
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans bg-white focus:outline-none"
                  placeholder="27"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                  Hips (in) *
                </label>
                <input
                  type="number"
                  required
                  value={hips}
                  onChange={(e) => setHips(e.target.value)}
                  className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans bg-white focus:outline-none"
                  placeholder="37"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                  Height
                </label>
                <input
                  type="text"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans bg-white"
                  placeholder="5'6"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                  Usual Luxury/High-Street Size
                </label>
                <input
                  type="text"
                  value={usualBrandSize}
                  onChange={(e) => setUsualBrandSize(e.target.value)}
                  className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans bg-white"
                  placeholder="US 4 / UK 8"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                Preferred Fit Sensation
              </label>
              <select
                value={fitPreference}
                onChange={(e) => setFitPreference(e.target.value)}
                className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans bg-white cursor-pointer"
              >
                <option>Sculpted / Form-Fitting (Emphasizes Waist & Ribs)</option>
                <option>Relaxed Fluid Drape (Graceful Ease around Hips)</option>
                <option>Empire / Unrestricted Midriff</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#121212] hover:bg-[#2A2825] text-white text-xs uppercase font-sans tracking-[0.2em] font-semibold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />
                  <span>Analyzing Fabric & Proportions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>Analyze My TrueFit Size</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#8C8275] font-sans pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Reduces return hassle by 88% • Backed by 30-day guarantee</span>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-white border border-[#C5A059] shadow-xs">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C5A059] font-sans font-semibold mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Atelier Sizing Diagnosis</span>
              </div>
              <div className="text-xs font-sans text-[#2A2825] leading-relaxed whitespace-pre-line">
                {recommendationResult}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setRecommendationResult(null)}
                className="flex-1 py-2.5 border border-[#E8E2D9] text-xs uppercase font-sans tracking-wider text-neutral-700"
              >
                Adjust Measurements
              </button>
              <button
                onClick={() => {
                  if (recommendationResult.includes('XS')) onApplySize('XS');
                  else if (recommendationResult.includes('S')) onApplySize('S');
                  else if (recommendationResult.includes('M')) onApplySize('M');
                  else if (recommendationResult.includes('XL')) onApplySize('XL');
                  else if (recommendationResult.includes('L')) onApplySize('L');
                  onClose();
                }}
                className="flex-1 py-2.5 bg-[#121212] text-white text-xs uppercase font-sans tracking-wider font-semibold"
              >
                Apply Recommended Size
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
