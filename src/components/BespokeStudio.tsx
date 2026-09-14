import React, { useState } from 'react';
import {
  Scissors,
  Ruler,
  Sparkles,
  Info,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { Dress, CurrencyCode, BespokeCustomization, BodyMeasurements } from '../types';
import { formatPrice } from '../utils/currency';

interface BespokeStudioProps {
  baseDress?: Dress | null;
  currency: CurrencyCode;
  onAddToCartWithCustom: (customItem: BespokeCustomization) => void;
  onProceedToCheckout: (customItem: BespokeCustomization) => void;
}

export const BespokeStudio: React.FC<BespokeStudioProps> = ({
  baseDress,
  currency,
  onAddToCartWithCustom,
  onProceedToCheckout,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Customization State
  const [silhouette, setSilhouette] = useState(baseDress?.silhouette || 'Column / Sheath');
  const [fabric, setFabric] = useState(baseDress?.fabric || 'Heavy Italian Silk Crepe (420gsm)');
  const [colorName, setColorName] = useState(baseDress?.colors[0]?.name || 'Noir Obsidian');
  const [colorHex, setColorHex] = useState(baseDress?.colors[0]?.hex || '#111111');
  const [neckline, setNeckline] = useState('Architectural Cowl Neck');
  const [sleeveStyle, setSleeveStyle] = useState('Sleeveless (Refined Armhole)');
  const [embellishments, setEmbellishments] = useState<string[]>(['Internal Contoured Boning']);
  const [slitHeight, setSlitHeight] = useState('Mid-Thigh Walking Slit');
  const [trainLength, setTrainLength] = useState('30cm Subtle Sweep Train');
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [activeMeasureField, setActiveMeasureField] = useState<string>('bust');

  const [measurements, setMeasurements] = useState<BodyMeasurements>({
    unit: 'in',
    bust: 34,
    waist: 27,
    hips: 37,
    hollowToHem: 58,
    shoulderWidth: 15,
    neckCircumference: 13.5,
    sleeveLength: 23,
    armhole: 16,
    heelHeight: 3.5,
    fullHeight: 67,
  });

  const [specialRequests, setSpecialRequests] = useState('');
  const [eventDate, setEventDate] = useState('');

  // Base price
  const basePriceINR = baseDress ? baseDress.priceINR + 8000 : 54000;
  const embellishmentCost = embellishments.length * 2500;
  const totalBespokePriceINR = basePriceINR + embellishmentCost;

  const handleMeasurementChange = (field: keyof BodyMeasurements, value: number) => {
    setMeasurements((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEmbellishment = (emb: string) => {
    setEmbellishments((prev) =>
      prev.includes(emb) ? prev.filter((e) => e !== emb) : [...prev, emb]
    );
  };

  const getBespokeData = (): BespokeCustomization => ({
    silhouette,
    fabric,
    colorName,
    colorHex,
    neckline,
    sleeveStyle,
    embellishments,
    slitHeight,
    trainLength,
    measurements: { ...measurements, unit },
    specialRequests: `${specialRequests}${eventDate ? ` | Target Event Date: ${eventDate}` : ''}`,
    isMadeToMeasure: true,
    baseDressId: baseDress?.id,
    baseDressName: baseDress?.name || 'Infi Atelier Bespoke Gown',
    estimatedWeeks: 3,
    customPriceINR: totalBespokePriceINR,
  });

  // Silhouette Choices
  const silhouetteOptions = [
    { id: 'Column / Sheath', title: 'Architectural Column', desc: 'Sleek, statuesque drape that elongates the frame.' },
    { id: 'Mermaid', title: 'Verona Mermaid', desc: 'Contoured bodice flaring with dramatic volume below knees.' },
    { id: 'A-Line', title: 'Imperial A-Line', desc: 'Universally balanced flare starting from the natural waist.' },
    { id: 'Bias Cut', title: 'Fluid 45° Bias Cut', desc: 'Liquid movement clinging organically to natural contours.' },
    { id: 'Ball Gown', title: 'Haute Gala Ball Gown', desc: 'Grand structured volume with layered crinoline foundation.' },
  ];

  // Fabric & Swatch Choices
  const fabricOptions = [
    { name: 'Heavy Italian Silk Crepe (420gsm)', desc: 'Matte, heavy drape with internal structure.', origin: 'Como, Italy' },
    { name: 'Grade 6A Mulberry Silk Satin (28 Momme)', desc: 'Luminous liquid gloss with pure silk backing.', origin: 'Lyon, France' },
    { name: 'Lyon Silk Velvet (Deep Obsidian)', desc: 'Ultra-plush depth that absorbs chandelier light.', origin: 'Lyon, France' },
    { name: 'French Corded Chantilly Lace', desc: 'Hand-appliquéd floral lace over sheer organza.', origin: 'Caudry, France' },
    { name: 'Japanese Silk Mikado', desc: 'Crisp, sculptural sheen ideal for structural pleats.', origin: 'Kyoto, Japan' },
  ];

  const colorPalette = [
    { name: 'Noir Obsidian', hex: '#111111' },
    { name: 'Pearl Alabaster', hex: '#F7F5F0' },
    { name: 'Champagne Taupe', hex: '#CBBFA8' },
    { name: 'Emerald Royale', hex: '#0D382A' },
    { name: 'Crimson Royale', hex: '#6A0C16' },
    { name: 'Royal Sapphire', hex: '#12254B' },
    { name: 'Molten Bronze', hex: '#9E7247' },
    { name: 'Midnight Amethyst', hex: '#2C1B38' },
  ];

  const necklineOptions = [
    'Architectural Cowl Neck',
    'Sculpted Square Plunge',
    'One-Shoulder Asymmetrical',
    'Sweetheart Corset with Illusion Tulle',
    'Modest High Boatneck',
  ];

  const sleeveOptions = [
    'Sleeveless (Refined Armhole)',
    'French Bishop Sleeve (Gathered Cuffs)',
    'Off-the-Shoulder Draped Cap',
    'Architectural Long Slim Sleeve',
    'Detachable Silk Chiffon Flutter',
  ];

  const embellishmentOptions = [
    'Internal Contoured Boning',
    'Hand-Beaded Austrian Pearl Hemline',
    'Swarovski Crystal Pavé Straps',
    'Detachable Watteau Train (1.5m)',
    'Sewn-in Moulded Bra Cups',
    'Concealed Silk-Lined Pockets',
  ];

  return (
    <div className="py-12 bg-[#FDFBF7]" id="bespoke-tailoring-studio">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Studio Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.3em] text-[#C5A059] font-sans font-medium mb-2">
            <Scissors className="w-3.5 h-3.5" />
            <span>Private Atelier Service</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#121212] mb-3">
            Custom Tailoring & Made-to-Measure
          </h1>
          <p className="text-xs sm:text-sm text-[#59534A] font-sans font-light leading-relaxed">
            Inspired by haute couture ateliers, our made-to-measure studio creates gowns tailored to your unique anatomical measurements. Follow our illustrated guide below.
          </p>
        </div>

        {/* Step Progression Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-sans uppercase tracking-wider">
            {[
              { num: 1, label: 'Silhouette' },
              { num: 2, label: 'Fabric & Color' },
              { num: 3, label: 'Design Elements' },
              { num: 4, label: 'Measurements' },
            ].map((s) => (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`py-3 border-b-2 transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                  currentStep === s.num
                    ? 'border-[#121212] text-[#121212] font-semibold'
                    : currentStep > s.num
                    ? 'border-[#C5A059] text-[#C5A059]'
                    : 'border-[#E8E2D9] text-neutral-400'
                }`}
              >
                <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center ${
                  currentStep === s.num
                    ? 'bg-[#121212] text-white'
                    : currentStep > s.num
                    ? 'bg-[#C5A059] text-white'
                    : 'bg-[#E8E2D9] text-neutral-600'
                }`}>
                  {s.num}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Studio Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Interactive Step Canvas (8 Cols) */}
          <div className="lg:col-span-8 bg-white border border-[#E8E2D9] p-6 sm:p-8 shadow-xs">
            {/* STEP 1: Silhouette */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl text-[#121212] mb-1">Select Foundation Silhouette</h3>
                  <p className="text-xs text-[#736B60] font-sans">
                    Choose the primary architecture that will frame your gown.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {silhouetteOptions.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setSilhouette(opt.id)}
                      className={`p-4 border cursor-pointer transition-all ${
                        silhouette === opt.id
                          ? 'border-[#121212] bg-[#F4EFEB] ring-1 ring-[#121212]'
                          : 'border-[#E8E2D9] hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-serif text-base font-medium text-[#121212]">{opt.title}</h4>
                        {silhouette === opt.id && <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />}
                      </div>
                      <p className="text-xs text-[#59534A] font-sans leading-relaxed">{opt.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    id="step-1-next-btn"
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 bg-[#121212] text-white text-xs uppercase font-sans tracking-widest flex items-center gap-2"
                  >
                    <span>Proceed to Fabrics</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Fabric & Color */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl text-[#121212] mb-1">Haute Fabric & Bespoke Dye</h3>
                  <p className="text-xs text-[#736B60] font-sans">
                    All fabrics are loomed exclusively for Infi in historic European mills.
                  </p>
                </div>

                {/* Fabric List */}
                <div className="space-y-3">
                  {fabricOptions.map((f) => (
                    <div
                      key={f.name}
                      onClick={() => setFabric(f.name)}
                      className={`p-4 border cursor-pointer transition-all flex items-center justify-between ${
                        fabric === f.name
                          ? 'border-[#121212] bg-[#F4EFEB] ring-1 ring-[#121212]'
                          : 'border-[#E8E2D9] hover:border-neutral-400'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-base font-medium text-[#121212]">{f.name}</h4>
                          <span className="text-[10px] uppercase font-sans text-[#8C8275] tracking-wider px-2 py-0.5 bg-white border border-[#E8E2D9]">
                            {f.origin}
                          </span>
                        </div>
                        <p className="text-xs text-[#59534A] font-sans mt-0.5">{f.desc}</p>
                      </div>
                      {fabric === f.name && <CheckCircle2 className="w-5 h-5 text-[#C5A059]" />}
                    </div>
                  ))}
                </div>

                {/* Color Swatches */}
                <div className="pt-4 border-t border-[#E8E2D9]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-sans uppercase tracking-wider text-neutral-600">
                      Select Atelier Shade: <strong className="text-black">{colorName}</strong>
                    </span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                    {colorPalette.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => {
                          setColorName(c.name);
                          setColorHex(c.hex);
                        }}
                        className={`flex flex-col items-center gap-1.5 p-2 border transition-all ${
                          colorName === c.name ? 'border-[#121212] bg-[#F4EFEB]' : 'border-transparent'
                        }`}
                      >
                        <span
                          className="w-8 h-8 rounded-full border border-black/20 shadow-xs"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="text-[10px] font-sans text-neutral-600 text-center line-clamp-1">
                          {c.name.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2.5 text-xs uppercase font-sans tracking-widest text-neutral-600 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    id="step-2-next-btn"
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-3 bg-[#121212] text-white text-xs uppercase font-sans tracking-widest flex items-center gap-2"
                  >
                    <span>Proceed to Elements</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Necklines, Sleeves, Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl text-[#121212] mb-1">Tailoring Customizations</h3>
                  <p className="text-xs text-[#736B60] font-sans">
                    Specify necklines, sleeves, walking slits, and artisanal finishes.
                  </p>
                </div>

                {/* Necklines */}
                <div>
                  <label className="block text-xs uppercase font-sans tracking-wider text-neutral-700 font-semibold mb-2">
                    Neckline Finish
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {necklineOptions.map((n) => (
                      <button
                        key={n}
                        onClick={() => setNeckline(n)}
                        className={`text-left p-3 border text-xs font-sans transition-all ${
                          neckline === n
                            ? 'border-[#121212] bg-[#F4EFEB] font-medium'
                            : 'border-[#E8E2D9] hover:border-neutral-400'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sleeve Style */}
                <div>
                  <label className="block text-xs uppercase font-sans tracking-wider text-neutral-700 font-semibold mb-2">
                    Sleeve Style
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {sleeveOptions.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSleeveStyle(s)}
                        className={`text-left p-3 border text-xs font-sans transition-all ${
                          sleeveStyle === s
                            ? 'border-[#121212] bg-[#F4EFEB] font-medium'
                            : 'border-[#E8E2D9] hover:border-neutral-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slit & Train */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-sans tracking-wider text-neutral-700 font-semibold mb-1">
                      Walking Slit
                    </label>
                    <select
                      value={slitHeight}
                      onChange={(e) => setSlitHeight(e.target.value)}
                      className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans focus:outline-none"
                    >
                      <option>No Slit (Solid Silhouette)</option>
                      <option>Mid-Thigh Walking Slit</option>
                      <option>High Thigh Couture Slit</option>
                      <option>Center Back Vent (Discreet)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-sans tracking-wider text-neutral-700 font-semibold mb-1">
                      Train Length
                    </label>
                    <select
                      value={trainLength}
                      onChange={(e) => setTrainLength(e.target.value)}
                      className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans focus:outline-none"
                    >
                      <option>Floor Length (No Train)</option>
                      <option>30cm Subtle Sweep Train</option>
                      <option>60cm Chapel Drama Train</option>
                      <option>Detachable 1.5m Watteau Train</option>
                    </select>
                  </div>
                </div>

                {/* Embellishments Checkboxes */}
                <div>
                  <label className="block text-xs uppercase font-sans tracking-wider text-neutral-700 font-semibold mb-2">
                    Special Atelier Finishes (+{formatPrice(2500, currency)} each)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {embellishmentOptions.map((emb) => {
                      const isChecked = embellishments.includes(emb);
                      return (
                        <div
                          key={emb}
                          onClick={() => toggleEmbellishment(emb)}
                          className={`flex items-center gap-2 p-2.5 border cursor-pointer text-xs font-sans transition-all ${
                            isChecked ? 'border-[#C5A059] bg-[#FAF8F5]' : 'border-[#E8E2D9]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded-xs text-[#C5A059] focus:ring-0 cursor-pointer"
                          />
                          <span>{emb}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2.5 text-xs uppercase font-sans tracking-widest text-neutral-600 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    id="step-3-next-btn"
                    onClick={() => setCurrentStep(4)}
                    className="px-6 py-3 bg-[#121212] text-white text-xs uppercase font-sans tracking-widest flex items-center gap-2"
                  >
                    <span>Proceed to Measurements</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Illustrated Measurement Studio (Core Prominent Requirement) */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E2D9] pb-4">
                  <div>
                    <h3 className="font-serif text-2xl text-[#121212] mb-1">
                      Illustrated Anatomical Tailoring Guide
                    </h3>
                    <p className="text-xs text-[#736B60] font-sans">
                      Our tailors cut individual paper patterns for every made-to-measure order.
                    </p>
                  </div>

                  {/* Unit Switcher */}
                  <div className="inline-flex rounded-xs border border-[#E8E2D9] p-0.5 bg-[#F4EFEB]">
                    <button
                      onClick={() => setUnit('in')}
                      className={`px-3 py-1 text-xs font-sans uppercase font-medium ${
                        unit === 'in' ? 'bg-[#121212] text-white shadow-xs' : 'text-neutral-600'
                      }`}
                    >
                      Inches (in)
                    </button>
                    <button
                      onClick={() => setUnit('cm')}
                      className={`px-3 py-1 text-xs font-sans uppercase font-medium ${
                        unit === 'cm' ? 'bg-[#121212] text-white shadow-xs' : 'text-neutral-600'
                      }`}
                    >
                      Centimeters (cm)
                    </button>
                  </div>
                </div>

                {/* Visual Diagram & Form Split */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left: Interactive Tailoring Diagram (Illustrated Fashion Dummy with anatomical lines) */}
                  <div className="md:col-span-5 bg-[#FDFBF7] p-4 border border-[#E8E2D9] flex flex-col items-center">
                    <span className="text-[10px] uppercase font-sans tracking-[0.2em] text-[#8C8275] mb-2 font-medium">
                      Anatomical Reference Map
                    </span>

                    {/* SVG Tailoring Mannequin Diagram */}
                    <div className="relative w-48 h-80 flex items-center justify-center">
                      <svg viewBox="0 0 200 360" className="w-full h-full stroke-[#121212] fill-none" strokeWidth="1.5">
                        {/* Head & Neck */}
                        <ellipse cx="100" cy="35" rx="16" ry="22" className="stroke-neutral-300" />
                        <path d="M94 56 L94 72 M106 56 L106 72" className="stroke-neutral-400" />

                        {/* Shoulders & Torso Silhouette */}
                        <path
                          d="M60 76 Q100 80 140 76 L152 110 Q148 140 128 165 Q110 178 120 220 L136 330 L64 330 L80 220 Q90 178 72 165 Q52 140 48 110 Z"
                          className="stroke-[#121212] fill-[#F7F4EE]"
                        />

                        {/* Bust Line */}
                        <line
                          x1="46"
                          y1="112"
                          x2="154"
                          y2="112"
                          stroke={activeMeasureField === 'bust' ? '#C5A059' : '#8C8275'}
                          strokeWidth={activeMeasureField === 'bust' ? '3' : '1.5'}
                          strokeDasharray={activeMeasureField === 'bust' ? 'none' : '3,3'}
                        />
                        <circle cx="100" cy="112" r="4" fill={activeMeasureField === 'bust' ? '#C5A059' : '#8C8275'} />

                        {/* Waist Line (Narrowest Point) */}
                        <line
                          x1="62"
                          y1="168"
                          x2="138"
                          y2="168"
                          stroke={activeMeasureField === 'waist' ? '#C5A059' : '#8C8275'}
                          strokeWidth={activeMeasureField === 'waist' ? '3' : '1.5'}
                          strokeDasharray={activeMeasureField === 'waist' ? 'none' : '3,3'}
                        />
                        <circle cx="100" cy="168" r="4" fill={activeMeasureField === 'waist' ? '#C5A059' : '#8C8275'} />

                        {/* Hips Line (Fullest Point) */}
                        <line
                          x1="52"
                          y1="216"
                          x2="148"
                          y2="216"
                          stroke={activeMeasureField === 'hips' ? '#C5A059' : '#8C8275'}
                          strokeWidth={activeMeasureField === 'hips' ? '3' : '1.5'}
                          strokeDasharray={activeMeasureField === 'hips' ? 'none' : '3,3'}
                        />
                        <circle cx="100" cy="216" r="4" fill={activeMeasureField === 'hips' ? '#C5A059' : '#8C8275'} />

                        {/* Hollow-to-Hem Vertical Center Line */}
                        <line
                          x1="100"
                          y1="72"
                          x2="100"
                          y2="330"
                          stroke={activeMeasureField === 'hollowToHem' ? '#C5A059' : '#D9D2C7'}
                          strokeWidth={activeMeasureField === 'hollowToHem' ? '2.5' : '1'}
                          strokeDasharray="2,2"
                        />

                        {/* Neck Circumference Indicator */}
                        <ellipse
                          cx="100"
                          cy="68"
                          rx="14"
                          ry="5"
                          stroke={activeMeasureField === 'neckCircumference' ? '#C5A059' : '#D9D2C7'}
                          strokeWidth={activeMeasureField === 'neckCircumference' ? '2.5' : '1'}
                        />
                      </svg>
                    </div>

                    {/* Active measurement tip */}
                    <div className="mt-3 p-2.5 bg-white border border-[#E8E2D9] text-[11px] text-[#59534A] font-sans w-full">
                      {activeMeasureField === 'bust' && (
                        <p><strong>Bust:</strong> Measure across the fullest part of the bust, keeping tape level with the back.</p>
                      )}
                      {activeMeasureField === 'waist' && (
                        <p><strong>Natural Waist:</strong> Measure around the narrowest curve, approx. 1 inch above the navel.</p>
                      )}
                      {activeMeasureField === 'hips' && (
                        <p><strong>Hips:</strong> Measure around the widest part of the buttocks and hip bones.</p>
                      )}
                      {activeMeasureField === 'hollowToHem' && (
                        <p><strong>Hollow to Hem:</strong> From the center hollow of the collarbone down to the floor (with heels).</p>
                      )}
                      {activeMeasureField === 'neckCircumference' && (
                        <p><strong>Neck:</strong> Circle comfortably at the base of the throat.</p>
                      )}
                      {activeMeasureField === 'sleeveLength' && (
                        <p><strong>Sleeve:</strong> From shoulder point down to wrist bone with arm slightly bent.</p>
                      )}
                      {!['bust', 'waist', 'hips', 'hollowToHem', 'neckCircumference', 'sleeveLength'].includes(activeMeasureField) && (
                        <p>Focus on key points: Bust, Waist, and Hips for seamless tailored drape.</p>
                      )}
                    </div>
                  </div>

                  {/* Right: Key Input Fields */}
                  <div className="md:col-span-7 space-y-3">
                    {/* Primary Measurements (Bust, Waist, Hips) */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                          Bust ({unit}) *
                        </label>
                        <input
                          id="input-measure-bust"
                          type="number"
                          value={measurements.bust}
                          onFocus={() => setActiveMeasureField('bust')}
                          onChange={(e) => handleMeasurementChange('bust', parseFloat(e.target.value) || 0)}
                          className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans focus:ring-1 focus:ring-[#121212] focus:border-[#121212]"
                          placeholder="34"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                          Waist ({unit}) *
                        </label>
                        <input
                          id="input-measure-waist"
                          type="number"
                          value={measurements.waist}
                          onFocus={() => setActiveMeasureField('waist')}
                          onChange={(e) => handleMeasurementChange('waist', parseFloat(e.target.value) || 0)}
                          className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans focus:ring-1 focus:ring-[#121212] focus:border-[#121212]"
                          placeholder="27"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                          Hips ({unit}) *
                        </label>
                        <input
                          id="input-measure-hips"
                          type="number"
                          value={measurements.hips}
                          onFocus={() => setActiveMeasureField('hips')}
                          onChange={(e) => handleMeasurementChange('hips', parseFloat(e.target.value) || 0)}
                          className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans focus:ring-1 focus:ring-[#121212] focus:border-[#121212]"
                          placeholder="37"
                        />
                      </div>
                    </div>

                    {/* Secondary Measurements (Hollow to Hem, Heel Height, Full Height) */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                          Hollow to Hem ({unit}) *
                        </label>
                        <input
                          id="input-measure-hollow"
                          type="number"
                          value={measurements.hollowToHem}
                          onFocus={() => setActiveMeasureField('hollowToHem')}
                          onChange={(e) => handleMeasurementChange('hollowToHem', parseFloat(e.target.value) || 0)}
                          className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans focus:ring-1 focus:ring-[#121212] focus:border-[#121212]"
                          placeholder="58"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                          Heel Height ({unit})
                        </label>
                        <input
                          id="input-measure-heel"
                          type="number"
                          value={measurements.heelHeight || 3.5}
                          onFocus={() => setActiveMeasureField('heelHeight')}
                          onChange={(e) => handleMeasurementChange('heelHeight', parseFloat(e.target.value) || 0)}
                          className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans focus:ring-1 focus:ring-[#121212] focus:border-[#121212]"
                          placeholder="3.5"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                          Full Height ({unit})
                        </label>
                        <input
                          id="input-measure-height"
                          type="number"
                          value={measurements.fullHeight || 67}
                          onFocus={() => setActiveMeasureField('fullHeight')}
                          onChange={(e) => handleMeasurementChange('fullHeight', parseFloat(e.target.value) || 0)}
                          className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans focus:ring-1 focus:ring-[#121212] focus:border-[#121212]"
                          placeholder="67"
                        />
                      </div>
                    </div>

                    {/* Specialist Proportions (Neck Circumference & Sleeve) */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                          Neck Circumference ({unit})
                        </label>
                        <input
                          type="number"
                          value={measurements.neckCircumference || 13.5}
                          onFocus={() => setActiveMeasureField('neckCircumference')}
                          onChange={(e) => handleMeasurementChange('neckCircumference', parseFloat(e.target.value) || 0)}
                          className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans"
                          placeholder="13.5"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                          Sleeve Length ({unit})
                        </label>
                        <input
                          type="number"
                          value={measurements.sleeveLength || 23}
                          onFocus={() => setActiveMeasureField('sleeveLength')}
                          onChange={(e) => handleMeasurementChange('sleeveLength', parseFloat(e.target.value) || 0)}
                          className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans"
                          placeholder="23"
                        />
                      </div>
                    </div>

                    {/* Special Requests / Event Date */}
                    <div className="pt-2">
                      <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                        Couturier Notes & Target Event Date
                      </label>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans mb-2"
                      />
                      <textarea
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        rows={2}
                        placeholder="e.g., Preference for modesty lining, specific bra cup preference, or posture notes..."
                        className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-4 py-2.5 text-xs uppercase font-sans tracking-widest text-neutral-600 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    id="step-4-finish-btn"
                    onClick={() => onAddToCartWithCustom(getBespokeData())}
                    className="px-8 py-3 bg-[#121212] hover:bg-[#2A2825] text-white text-xs uppercase font-sans tracking-widest font-semibold flex items-center gap-2 shadow-lg"
                  >
                    <Scissors className="w-4 h-4 text-[#C5A059]" />
                    <span>Confirm Bespoke Order</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Live Bespoke Atelier Summary (4 Cols) */}
          <div className="lg:col-span-4 bg-white border border-[#E8E2D9] p-6 shadow-xs sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D9]">
              <span className="text-xs uppercase font-sans tracking-widest text-[#8C8275] font-medium">
                Atelier Dossier
              </span>
              <span className="text-[10px] uppercase font-sans bg-[#C5A059]/15 text-[#997A35] px-2 py-0.5 font-semibold">
                Made to Order
              </span>
            </div>

            {/* Visual Preview Card */}
            <div className="py-4 border-b border-[#E8E2D9]">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full border border-black/15 shrink-0 shadow-xs"
                  style={{ backgroundColor: colorHex }}
                />
                <div>
                  <h4 className="font-serif text-lg font-medium text-[#121212]">{silhouette}</h4>
                  <p className="text-xs text-[#736B60] font-sans">{colorName}</p>
                </div>
              </div>

              <div className="text-xs font-sans text-[#59534A] space-y-1.5 bg-[#FAF8F5] p-3 border border-[#EFEBE4]">
                <p><strong>Fabric:</strong> {fabric}</p>
                <p><strong>Neckline:</strong> {neckline}</p>
                <p><strong>Sleeve:</strong> {sleeveStyle}</p>
                <p><strong>Slit:</strong> {slitHeight}</p>
                <p><strong>Train:</strong> {trainLength}</p>
                {embellishments.length > 0 && (
                  <p><strong>Finishes:</strong> {embellishments.join(', ')}</p>
                )}
                <p>
                  <strong>Fitted Specs:</strong> {measurements.bust}"B • {measurements.waist}"W • {measurements.hips}"H
                </p>
              </div>
            </div>

            {/* Production Timeline & Guarantee */}
            <div className="py-4 border-b border-[#E8E2D9] space-y-2 text-xs font-sans text-[#736B60]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C5A059]" />
                <span>Handcrafted in Atelier: <strong>14–21 Business Days</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>Complimentary Private Alteration Guarantee</span>
              </div>
            </div>

            {/* Price & CTA */}
            <div className="pt-4">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-xs font-sans uppercase tracking-wider text-neutral-500">
                  Custom Atelier Total:
                </span>
                <span className="text-2xl font-sans font-bold text-[#121212]">
                  {formatPrice(totalBespokePriceINR, currency)}
                </span>
              </div>

              <div className="space-y-2">
                <button
                  id="bespoke-add-to-bag-btn"
                  onClick={() => onAddToCartWithCustom(getBespokeData())}
                  className="w-full py-3.5 bg-[#121212] hover:bg-[#2A2825] text-white text-xs uppercase font-sans tracking-[0.2em] font-semibold flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Scissors className="w-4 h-4 text-[#C5A059]" />
                  <span>Add Bespoke Gown to Bag</span>
                </button>

                <button
                  id="bespoke-direct-checkout-btn"
                  onClick={() => onProceedToCheckout(getBespokeData())}
                  className="w-full py-3 bg-transparent border border-[#121212] hover:bg-[#121212] hover:text-white text-[#121212] text-xs uppercase font-sans tracking-[0.18em] font-medium transition-colors cursor-pointer"
                >
                  <span>Proceed Directly to Order</span>
                </button>
              </div>

              <p className="text-[10px] text-center text-neutral-400 font-sans mt-3">
                Questions? Infi Master Tailors available via WhatsApp or phone (+91 8295313004).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
