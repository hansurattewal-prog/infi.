import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, RotateCcw } from 'lucide-react';
import { Dress, CurrencyCode, UserQuizPreferences } from '../types';
import { formatPrice } from '../utils/currency';

interface DressQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  dresses: Dress[];
  currency: CurrencyCode;
  onSelectDress: (dress: Dress) => void;
  onSavePreferences?: (prefs: UserQuizPreferences) => void;
}

export const DressQuizModal: React.FC<DressQuizModalProps> = ({
  isOpen,
  onClose,
  dresses,
  currency,
  onSelectDress,
  onSavePreferences,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [occasion, setOccasion] = useState('');
  const [silhouette, setSilhouette] = useState('');
  const [mood, setMood] = useState('');
  const [fitPriority, setFitPriority] = useState('');
  const [matchedDresses, setMatchedDresses] = useState<Dress[]>([]);

  const handleFinish = (finalFitPriority: string) => {
    setFitPriority(finalFitPriority);

    const quizPrefs: UserQuizPreferences = {
      occasion,
      silhouette,
      mood,
      fitPriority: finalFitPriority,
      completedAt: Date.now(),
    };

    if (onSavePreferences) {
      onSavePreferences(quizPrefs);
    }

    // Compute tailored recommendations
    const scored = dresses.map((dress) => {
      let score = 0;
      if (dress.occasion.toLowerCase().includes(occasion.toLowerCase()) || occasion === 'All Galas') score += 3;
      if (dress.silhouette.toLowerCase().includes(silhouette.toLowerCase())) score += 3;
      if (mood === 'Minimalist & Sculptural' && (dress.silhouette.includes('Column') || dress.silhouette.includes('Bias'))) score += 2;
      if (mood === 'Dramatic & Regal' && (dress.fabric.includes('Velvet') || dress.fabric.includes('Mikado') || dress.silhouette.includes('Ball Gown'))) score += 2;
      if (mood === 'Romantic & Delicate' && dress.fabric.includes('Lace')) score += 2;
      return { dress, score };
    });

    scored.sort((a, b) => b.score - a.score);
    setMatchedDresses(scored.slice(0, 3).map((s) => s.dress));
    setStep(5); // results step
  };

  const resetQuiz = () => {
    setStep(1);
    setOccasion('');
    setSilhouette('');
    setMood('');
    setFitPriority('');
    setMatchedDresses([]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#FDFBF7] text-[#121212] border border-[#D9D2C7] p-6 sm:p-10 shadow-2xl my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-black transition-colors"
          aria-label="Close Quiz"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C5A059] font-sans font-medium mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalized Atelier Styling</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#121212]">
            The Infi Dress & Silhouette Survey
          </h2>
          <p className="text-xs text-[#736B60] font-sans mt-1">
            Find your ideal formalwear match in four guided steps.
          </p>
        </div>

        {/* Progress Dots */}
        {step < 5 && (
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`w-8 h-1 transition-all ${
                  step === i ? 'bg-[#121212]' : step > i ? 'bg-[#C5A059]' : 'bg-[#E8E2D9]'
                }`}
              />
            ))}
          </div>
        )}

        {/* Question 1: Occasion */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-center text-[#121212] mb-4">
              1. What grand occasion are you dressing for?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Black Tie Gala or Charity Ball', val: 'Black Tie' },
                { label: 'Couture Wedding Guest / Reception', val: 'Wedding Guest' },
                { label: 'Cocktail Soirée & Gallery Opening', val: 'Cocktail' },
                { label: 'Red Carpet or High-Jewelry Evening', val: 'Red Carpet' },
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => {
                    setOccasion(item.val);
                    setStep(2);
                  }}
                  className={`p-4 border text-left text-xs font-sans uppercase tracking-wider transition-all ${
                    occasion === item.val
                      ? 'border-[#121212] bg-[#121212] text-white font-medium'
                      : 'border-[#E8E2D9] bg-white hover:border-black'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 2: Silhouette */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-center text-[#121212] mb-4">
              2. Which silhouette flatters your movement best?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Architectural Column (Clean vertical drape)', val: 'Column' },
                { label: 'Contoured Mermaid (Bodice hugged, flared hem)', val: 'Mermaid' },
                { label: 'Bias-Cut Slip (Fluid liquid silk)', val: 'Bias' },
                { label: 'Classic Imperial A-Line (Balanced volume)', val: 'A-Line' },
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => {
                    setSilhouette(item.val);
                    setStep(3);
                  }}
                  className="p-4 border border-[#E8E2D9] bg-white hover:border-black text-left text-xs font-sans uppercase tracking-wider transition-all"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 3: Aesthetic Mood */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-center text-[#121212] mb-4">
              3. What aesthetic mood resonates with you?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Minimalist & Sculptural (Focus on form)', val: 'Minimalist & Sculptural' },
                { label: 'Dramatic & Regal (Velvet, mikado & trains)', val: 'Dramatic & Regal' },
                { label: 'Romantic & Delicate (French lace & georgette)', val: 'Romantic & Delicate' },
                { label: 'Modern Luminescence (Metallic lamé & silk sheen)', val: 'Modern Luminescence' },
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => {
                    setMood(item.val);
                    setStep(4);
                  }}
                  className="p-4 border border-[#E8E2D9] bg-white hover:border-black text-left text-xs font-sans uppercase tracking-wider transition-all"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 4: Fit Priority */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-center text-[#121212] mb-4">
              4. What is your primary tailoring priority?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Hourglass Cinched Waist',
                'Effortless Comfort & Fluid Drape',
                'Dramatic Back Cutout / Open Plunge',
                'Bespoke Length Accommodating High Stilettos',
              ].map((p) => (
                <button
                  key={p}
                  onClick={() => handleFinish(p)}
                  className="p-4 border border-[#E8E2D9] bg-white hover:border-black text-left text-xs font-sans uppercase tracking-wider transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Matches Result */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="p-3 bg-[#F4EFEB] border border-[#E8E2D9] text-center text-xs font-sans text-[#59534A]">
              Curated for: <strong>{occasion}</strong> • <strong>{silhouette}</strong> • <strong>{mood}</strong>
            </div>

            <div className="space-y-3">
              {matchedDresses.map((dress) => (
                <div
                  key={dress.id}
                  onClick={() => {
                    onSelectDress(dress);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 border border-[#E8E2D9] bg-white hover:border-[#C5A059] cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-4">
                    <img src={dress.images[0]} alt={dress.name} className="w-16 h-20 object-cover" />
                    <div>
                      <span className="text-[10px] uppercase font-sans tracking-widest text-[#C5A059] font-medium">
                        98% Match
                      </span>
                      <h4 className="font-serif text-lg font-medium text-[#121212]">{dress.name}</h4>
                      <p className="text-xs text-[#736B60] font-sans">{dress.subtitle}</p>
                      <p className="text-xs font-semibold text-[#121212] mt-1 font-sans">
                        {formatPrice(dress.priceINR, currency)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-sans uppercase tracking-wider text-[#121212] font-semibold pr-2">
                    <span>View Gown</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={resetQuiz}
                className="flex items-center gap-1.5 text-xs uppercase font-sans tracking-wider text-neutral-500 hover:text-black"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Survey</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#121212] text-white text-xs uppercase font-sans tracking-widest font-medium"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
