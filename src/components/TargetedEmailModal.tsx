import React, { useState } from 'react';
import {
  X,
  Mail,
  Send,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  UserCheck,
  RefreshCw,
} from 'lucide-react';
import {
  TargetedEmailCampaign,
  CurrencyCode,
  Dress,
  UserBehaviorProfile,
} from '../types';
import { formatPrice } from '../utils/currency';

interface TargetedEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: TargetedEmailCampaign | null;
  currency: CurrencyCode;
  onSelectDress: (dress: Dress) => void;
  onApplyPersonaPreset: (presetName: string) => void;
  isRegenerating: boolean;
}

export const TargetedEmailModal: React.FC<TargetedEmailModalProps> = ({
  isOpen,
  onClose,
  campaign,
  currency,
  onSelectDress,
  onApplyPersonaPreset,
  isRegenerating,
}) => {
  if (!isOpen || !campaign) return null;

  const [copied, setCopied] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [activePersona, setActivePersona] = useState<string>('active');

  const handleCopy = () => {
    const text = `Subject: ${campaign.subjectLine}\n\n${campaign.personalSalutation}\n\n${campaign.couturierNote}\n\nRecommended: ${campaign.recommendedDresses.map((d) => d.dress.name).join(', ')}\n\nVIP Invitation Code: ${campaign.privateInvitationCode}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendSimulation = () => {
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#FDFBF7] text-[#121212] border border-[#D9D2C7] shadow-2xl my-auto overflow-hidden">
        {/* Modal Top Control Bar */}
        <div className="bg-[#121212] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#C5A059]" />
            <span className="text-xs uppercase font-sans tracking-[0.2em] font-medium text-neutral-300">
              AI Targeted Email Campaign Intelligence
            </span>
          </div>

          <button
            id="close-email-modal-btn"
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Persona Preset Simulator Bar */}
        <div className="bg-[#F4EFEB] border-b border-[#E8E2D9] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
          <div className="flex items-center gap-2 text-neutral-700">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Simulate Behavioral Profiles:
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'gala', label: 'Black Tie Gala Muse' },
              { id: 'riviera', label: 'Riviera Silk Purist' },
              { id: 'bride', label: 'Haute Bridal Gala' },
              { id: 'minimalist', label: 'Minimalist Architectural' },
            ].map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  setActivePersona(preset.id);
                  onApplyPersonaPreset(preset.id);
                }}
                disabled={isRegenerating}
                className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium transition-all ${
                  activePersona === preset.id
                    ? 'bg-[#121212] text-white'
                    : 'bg-white border border-[#D9D2C7] text-neutral-700 hover:border-neutral-900'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-4 sm:p-8">
          {/* Email Client Metadata Chrome */}
          <div className="bg-white border border-[#E8E2D9] p-4 mb-6 shadow-xs font-sans text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-[#F0EBE3] pb-2">
              <span className="text-neutral-400 uppercase text-[10px] tracking-wider w-20">From:</span>
              <span className="font-medium text-[#121212] flex-1">
                Infi Atelier Private Salon &lt;concierge@infi-formalwear.com&gt;
              </span>
              <span className="text-[10px] text-neutral-400">{campaign.generatedDate}</span>
            </div>

            <div className="flex items-center border-b border-[#F0EBE3] pb-2">
              <span className="text-neutral-400 uppercase text-[10px] tracking-wider w-20">To:</span>
              <span className="font-medium text-[#121212] flex-1">
                {campaign.clientName} &lt;{campaign.clientEmail}&gt;
              </span>
            </div>

            <div className="flex items-center">
              <span className="text-neutral-400 uppercase text-[10px] tracking-wider w-20">Subject:</span>
              <span className="font-serif text-sm font-semibold text-[#121212] flex-1">
                {campaign.subjectLine}
              </span>
            </div>
          </div>

          {/* Email Body Container (Editorial Luxury Letter) */}
          <div className="bg-white border border-[#E8E2D9] shadow-sm max-w-2xl mx-auto overflow-hidden">
            {/* Editorial Brand Header */}
            <div className="bg-[#121212] text-white p-8 text-center border-b border-[#C5A059]/30">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] font-sans font-medium block mb-2">
                Haute Couture Maison
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl tracking-tight text-white font-light">
                INFI
              </h1>
              <p className="text-[11px] font-sans tracking-[0.2em] uppercase text-neutral-400 mt-1">
                Private Clientele Edit
              </p>
            </div>

            {/* Letter Content */}
            <div className="p-6 sm:p-10 space-y-6 text-[#1A1815]">
              <div className="border-b border-[#E8E2D9] pb-4">
                <span className="text-xs uppercase font-sans tracking-[0.2em] text-[#C5A059] block mb-1">
                  {campaign.heroTagline}
                </span>
                <h2 className="font-serif text-2xl font-normal text-[#121212]">
                  A Tailored Formalwear Edit, Curated For You
                </h2>
              </div>

              <p className="font-serif text-base text-[#121212]">
                {campaign.personalSalutation}
              </p>

              <p className="text-xs sm:text-sm font-sans font-light leading-relaxed text-[#59534A]">
                {campaign.couturierNote}
              </p>

              {/* Recommended Dress Showcases */}
              <div className="space-y-6 pt-4 border-t border-[#E8E2D9]">
                <h3 className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#121212]">
                  Selected Silhouettes For Your Upcoming Engagements
                </h3>

                <div className="space-y-6">
                  {campaign.recommendedDresses.map((rd, i) => (
                    <div
                      key={rd.dress.id}
                      className="bg-[#FAF8F5] border border-[#EFEBE4] p-4 flex flex-col sm:flex-row gap-4 group cursor-pointer hover:border-[#121212] transition-colors"
                      onClick={() => {
                        onClose();
                        onSelectDress(rd.dress);
                      }}
                    >
                      <div className="w-full sm:w-32 aspect-[3/4] bg-white overflow-hidden shrink-0">
                        <img
                          src={rd.dress.images[0]}
                          alt={rd.dress.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-[10px] uppercase font-sans tracking-wider text-[#8C8275] mb-1">
                            <span>{rd.dress.occasion} • {rd.dress.silhouette}</span>
                            <span className="text-[#997A35] font-semibold bg-[#C5A059]/15 px-1.5 py-0.5">
                              {rd.matchScore}% Match
                            </span>
                          </div>

                          <h4 className="font-serif text-lg font-medium text-[#121212] group-hover:text-[#C5A059] transition-colors">
                            {rd.dress.name}
                          </h4>

                          <p className="text-xs text-[#59534A] font-sans mt-1 leading-relaxed">
                            {rd.exclusiveNote}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#E8E2D9]">
                          <span className="text-xs font-sans font-bold text-[#121212]">
                            {formatPrice(rd.dress.priceINR, currency)}
                          </span>
                          <span className="text-[10px] uppercase font-sans tracking-wider text-[#121212] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            <span>Inspect Silhouette</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Accessories Pairings */}
              {campaign.recommendedAccessories.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-[#E8E2D9]">
                  <h3 className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#121212]">
                    Recommended Accessories to Complete the Look
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    {campaign.recommendedAccessories.map((ra) => (
                      <div
                        key={ra.accessory.id}
                        className="p-3 bg-[#FAF8F5] border border-[#EFEBE4] flex gap-3 items-center"
                      >
                        <img
                          src={ra.accessory.image}
                          alt={ra.accessory.name}
                          className="w-12 h-12 object-cover bg-white shrink-0 border border-[#E8E2D9]"
                        />
                        <div className="overflow-hidden">
                          <h5 className="font-serif text-xs font-medium text-[#121212] truncate">
                            {ra.accessory.name}
                          </h5>
                          <p className="text-[10px] text-neutral-500 font-sans">
                            {formatPrice(ra.accessory.priceINR, currency)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIP Invitation Box */}
              <div className="bg-[#121212] text-white p-6 border border-[#C5A059]/40 text-center space-y-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-sans font-semibold">
                  Private Salon Privileges
                </span>
                <p className="font-serif text-lg text-white">
                  Exclusive Atelier Invitation Code
                </p>
                <div className="inline-block px-4 py-1.5 bg-white/10 border border-[#C5A059] font-mono text-sm tracking-widest text-[#E0C58A]">
                  {campaign.privateInvitationCode}
                </div>
                <p className="text-[11px] font-sans text-neutral-300">
                  {campaign.vipBenefit}
                </p>
              </div>

              {/* Sign-off */}
              <div className="pt-4 text-xs font-sans text-[#736B60] leading-relaxed border-t border-[#E8E2D9]">
                <p>Warmest regards,</p>
                <p className="font-serif text-base text-[#121212] mt-1">Hélène Vance & Armaan Mehta</p>
                <p className="text-[11px] text-[#8C8275]">Infi Master Couturiers & Client Styling Directorate</p>
                <p className="text-[10px] text-neutral-400 mt-2">
                  Atelier Hotline: +91 8295313004 • Paris | Como | New Delhi
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="bg-[#F4EFEB] border-t border-[#E8E2D9] px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-sans text-neutral-600">
            {sentSuccess ? (
              <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                Targeted VIP campaign sent successfully to {campaign.clientEmail}
              </span>
            ) : (
              <span>Targeted campaign generated from behavioral intelligence & quiz telemetry.</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-white border border-[#D9D2C7] text-neutral-800 text-xs font-sans uppercase tracking-wider hover:border-black flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Campaign'}</span>
            </button>

            <button
              onClick={handleSendSimulation}
              className="px-5 py-2 bg-[#121212] hover:bg-[#C5A059] text-white text-xs font-sans uppercase tracking-wider font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Simulate Live Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
