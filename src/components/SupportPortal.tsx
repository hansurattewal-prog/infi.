import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MessageSquare,
  ShieldCheck,
  RefreshCw,
  Ruler,
  Clock,
  Sparkles,
  CheckCircle2,
  Printer,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ReturnRequest } from '../types';

interface SupportPortalProps {
  onOpenAiChat: () => void;
  initialTab?: 'faq' | 'returns' | 'contact' | 'policy';
}

export const SupportPortal: React.FC<SupportPortalProps> = ({
  onOpenAiChat,
  initialTab = 'faq',
}) => {
  const [activeTab, setActiveTab] = useState<'faq' | 'returns' | 'contact' | 'policy'>(initialTab);

  // FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Return Request Portal State
  const [returnOrderNum, setReturnOrderNum] = useState('');
  const [returnEmail, setReturnEmail] = useState('');
  const [returnReason, setReturnReason] = useState('Fit was too snug around bust/waist');
  const [returnResolution, setReturnResolution] = useState<'refund' | 'store_credit_bonus' | 'exchange'>('store_credit_bonus');
  const [returnItems, setReturnItems] = useState('The Alabaster Column Gown (Size M)');
  const [conditionConfirmed, setConditionConfirmed] = useState(false);
  const [generatedReturn, setGeneratedReturn] = useState<ReturnRequest | null>(null);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const req: ReturnRequest = {
      id: `RET-${Math.floor(10000 + Math.random() * 90000)}`,
      orderNumber: returnOrderNum || 'INFI-748921',
      customerEmail: returnEmail || 'client@example.com',
      customerPhone: '+91 8295313004',
      reason: returnReason,
      preferredResolution: returnResolution,
      itemNames: returnItems,
      conditionConfirmed,
      status: 'Label Generated',
      createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      labelCode: `AWB-DHL-INFI-${Math.floor(10000000 + Math.random() * 90000000)}`,
    };
    setGeneratedReturn(req);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  const faqs = [
    {
      q: 'How do I determine my precise measurements for made-to-measure gowns?',
      a: 'We recommend using a flexible tailor\'s tape measure wearing the foundation undergarments and heel height you plan to wear. Key measurements include Bust (across fullest point), Natural Waist (narrowest curve approx. 1" above navel), and Hips (widest point across seat). You can follow our interactive visual guide in the Bespoke Studio or request a complimentary video consultation with our head couturier.',
    },
    {
      q: 'What is Infi’s 30-Day Return & Exchange Policy?',
      a: 'We provide an effortless 30-day return window from date of receipt for all standard collection dresses. Garments must be unworn, undamaged, with original atelier tags and security ribbon intact. You may choose a full refund to your original payment method, a seamless size exchange, or Infi Store Credit with an additional +10% styling bonus.',
    },
    {
      q: 'What are the production timelines for bespoke custom dresses?',
      a: 'Because our bespoke gowns are hand-draped and individually cut on custom paper patterns with hand-sewn finishes, standard bespoke production requires 14 to 21 business days. Need your gown sooner for an impending gala or red carpet? Contact our atelier concierge hotline (+91 8295313004) to arrange priority expedited salon production.',
    },
    {
      q: 'What payment methods are supported for Indian and international clients?',
      a: 'For our Indian clients, we support all real-time mobile UPI wallets (PhonePe, Google Pay, Paytm, BHIM) with zero surcharge, alongside NetBanking and RuPay. For international and card transactions, we accept Visa, MasterCard, American Express, Apple Pay, and PayPal Express with encrypted 256-bit SSL protocols.',
    },
    {
      q: 'Are bespoke made-to-measure orders eligible for alterations?',
      a: 'Every Infi Made-to-Measure gown includes our Complimentary Private Fit Guarantee. In the rare event that your dress requires minor nip-and-tuck adjustments, our atelier provides complimentary adjustments or reimburses up to ₹4,000 / $50 towards your trusted local master tailor.',
    },
  ];

  return (
    <div className="py-12 sm:py-16 bg-[#FDFBF7]" id="support-portal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Support Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.3em] text-[#C5A059] font-sans font-medium mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Client Concierge & Atelier Services</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#121212] mb-3">
            Atelier Support & Returns Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#59534A] font-sans font-light leading-relaxed">
            Every step of your Infi experience is backed by our private salon team. Connect via phone, WhatsApp, or our automated self-service returns portal.
          </p>
        </div>

        {/* Multi-Channel Concierge Quick-Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {/* Phone Hotline */}
          <a
            href="tel:+918295313004"
            id="support-phone-card"
            className="p-5 bg-white border border-[#E8E2D9] hover:border-[#121212] transition-all flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-full bg-[#F4EFEB] flex items-center justify-center text-[#121212] group-hover:bg-[#121212] group-hover:text-white transition-colors">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-sans tracking-wider text-[#8C8275]">Bespoke Hotline</span>
              <p className="font-serif text-base font-medium text-[#121212]">+91 8295313004</p>
              <span className="text-[11px] text-[#C5A059] font-sans">Mon–Sat, 9AM–9PM IST</span>
            </div>
          </a>

          {/* WhatsApp Direct */}
          <a
            href="https://wa.me/918295313004?text=Hello%20Infi%20Atelier,%20I%20would%20like%20assistance%20with%20custom%20formalwear"
            target="_blank"
            rel="noopener noreferrer"
            id="support-whatsapp-card"
            className="p-5 bg-white border border-[#E8E2D9] hover:border-[#25D366] transition-all flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-full bg-[#25D366]/15 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-colors">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-sans tracking-wider text-[#8C8275]">WhatsApp Concierge</span>
              <p className="font-serif text-base font-medium text-[#121212]">Instant Chat</p>
              <span className="text-[11px] text-[#25D366] font-sans">Available 24/7</span>
            </div>
          </a>

          {/* AI Couturier Assistant */}
          <button
            onClick={onOpenAiChat}
            id="support-ai-chat-card"
            className="p-5 bg-white border border-[#E8E2D9] hover:border-[#C5A059] transition-all flex items-center gap-4 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#C5A059] group-hover:bg-[#121212] group-hover:text-[#C5A059] transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-sans tracking-wider text-[#8C8275]">AI Couture Stylist</span>
              <p className="font-serif text-base font-medium text-[#121212]">Ask Sizing & Drape</p>
              <span className="text-[11px] text-[#C5A059] font-sans">Powered by Infi AI</span>
            </div>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E8E2D9] mb-8 overflow-x-auto text-xs font-sans uppercase tracking-widest">
          {[
            { id: 'faq', label: 'FAQ & Tailoring Guide' },
            { id: 'returns', label: 'Self-Service Returns Portal' },
            { id: 'contact', label: 'Contact Us & Salon Enquiry' },
            { id: 'policy', label: '30-Day Policy & Guarantee' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`py-3 px-5 border-b-2 font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === t.id
                  ? 'border-[#121212] text-[#121212] font-semibold'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: FAQ ACCORDION */}
        {activeTab === 'faq' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {faqs.map((item, idx) => (
              <div key={idx} className="bg-white border border-[#E8E2D9] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF8F5] transition-colors"
                >
                  <span className="font-serif text-lg text-[#121212] font-medium">{item.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-neutral-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="p-5 pt-0 text-xs sm:text-sm font-sans text-[#59534A] leading-relaxed border-t border-[#F4EFEB]">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: SELF-SERVICE RETURNS & EXCHANGE PORTAL */}
        {activeTab === 'returns' && (
          <div className="max-w-2xl mx-auto bg-white border border-[#E8E2D9] p-6 sm:p-8 shadow-xs">
            {!generatedReturn ? (
              <form onSubmit={handleReturnSubmit} className="space-y-4">
                <div className="border-b border-[#E8E2D9] pb-4 mb-4">
                  <h3 className="font-serif text-2xl text-[#121212]">Self-Service Online Return Portal</h3>
                  <p className="text-xs text-[#736B60] font-sans mt-1">
                    Instant return authorization with complimentary DHL courier pickup & QR code label.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                      Order Dossier # *
                    </label>
                    <input
                      type="text"
                      required
                      value={returnOrderNum}
                      onChange={(e) => setReturnOrderNum(e.target.value)}
                      placeholder="e.g. INFI-489210"
                      className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={returnEmail}
                      onChange={(e) => setReturnEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                    Item(s) Being Returned *
                  </label>
                  <input
                    type="text"
                    required
                    value={returnItems}
                    onChange={(e) => setReturnItems(e.target.value)}
                    className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                    Reason for Return / Exchange *
                  </label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans"
                  >
                    <option>Fit was too snug around bust/waist</option>
                    <option>Fit was too loose / requires smaller size</option>
                    <option>Event date changed or canceled</option>
                    <option>Prefer an alternative atelier shade</option>
                    <option>Fabric drape didn't match occasion expectation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                    Preferred Resolution *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-sans">
                    <button
                      type="button"
                      onClick={() => setReturnResolution('store_credit_bonus')}
                      className={`p-3 border text-left ${
                        returnResolution === 'store_credit_bonus'
                          ? 'border-[#C5A059] bg-[#FAF8F5] font-semibold text-[#121212]'
                          : 'border-[#E8E2D9]'
                      }`}
                    >
                      <span className="block font-medium">Store Credit</span>
                      <span className="text-[10px] text-[#C5A059]">+10% Bonus Added</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReturnResolution('refund')}
                      className={`p-3 border text-left ${
                        returnResolution === 'refund'
                          ? 'border-[#121212] bg-[#F4EFEB] font-semibold text-[#121212]'
                          : 'border-[#E8E2D9]'
                      }`}
                    >
                      <span className="block font-medium">Original Payment</span>
                      <span className="text-[10px] text-neutral-500">Credited in 3-5 days</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReturnResolution('exchange')}
                      className={`p-3 border text-left ${
                        returnResolution === 'exchange'
                          ? 'border-[#121212] bg-[#F4EFEB] font-semibold text-[#121212]'
                          : 'border-[#E8E2D9]'
                      }`}
                    >
                      <span className="block font-medium">Direct Size Swap</span>
                      <span className="text-[10px] text-neutral-500">Expedited dispatch</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] flex items-start gap-2 text-xs font-sans text-neutral-700">
                  <input
                    type="checkbox"
                    id="confirm-tags"
                    required
                    checked={conditionConfirmed}
                    onChange={(e) => setConditionConfirmed(e.target.checked)}
                    className="mt-0.5"
                  />
                  <label htmlFor="confirm-tags" className="cursor-pointer">
                    I certify that the gown is unworn, unwashed, and that the original atelier security ribbon and tags remain attached.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#121212] hover:bg-[#2A2825] text-white text-xs uppercase font-sans tracking-widest font-semibold"
                >
                  Generate Instant Return Label & QR
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <CheckCircle2 className="w-12 h-12 text-[#C5A059] mx-auto" />
                <h3 className="font-serif text-2xl text-[#121212]">Return Request Authorized</h3>
                <p className="text-xs font-sans text-neutral-600">
                  Return Dossier: <strong>{generatedReturn.id}</strong> for Order <strong>{generatedReturn.orderNumber}</strong>
                </p>

                <div className="bg-[#FAF8F5] p-4 border border-[#E8E2D9] text-left text-xs font-sans space-y-2">
                  <div className="flex justify-between border-b border-[#E8E2D9] pb-2">
                    <span>Tracking AWB:</span>
                    <strong>{generatedReturn.labelCode}</strong>
                  </div>
                  <div className="flex justify-between border-b border-[#E8E2D9] pb-2">
                    <span>Resolution:</span>
                    <strong>{generatedReturn.preferredResolution.replace('_', ' ').toUpperCase()}</strong>
                  </div>
                  <p className="text-neutral-500 pt-1">
                    White-glove courier will collect the package from your delivery address between 10am–2pm tomorrow. Simply show the digital barcode or print the label.
                  </p>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="px-5 py-2.5 bg-[#121212] text-white text-xs uppercase font-sans tracking-wider flex items-center gap-2"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Return Label</span>
                  </button>
                  <button
                    onClick={() => setGeneratedReturn(null)}
                    className="px-5 py-2.5 border border-[#E8E2D9] text-xs uppercase font-sans tracking-wider"
                  >
                    New Request
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CONTACT US & ENQUIRY FORM */}
        {activeTab === 'contact' && (
          <div className="max-w-2xl mx-auto bg-white border border-[#E8E2D9] p-6 sm:p-8 shadow-xs">
            {contactSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#C5A059] mx-auto" />
                <h3 className="font-serif text-2xl text-[#121212]">Salon Message Dispatched</h3>
                <p className="text-xs text-neutral-600 font-sans max-w-md mx-auto">
                  Our senior couturier team has received your enquiry and will respond within 4 business hours.
                </p>
                <button
                  onClick={() => setContactSubmitted(false)}
                  className="px-6 py-2.5 bg-[#121212] text-white text-xs uppercase font-sans tracking-widest"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <h3 className="font-serif text-2xl text-[#121212] mb-1">Contact Infi Atelier</h3>
                  <p className="text-xs text-[#736B60] font-sans">
                    Have questions regarding custom sizing, gala deadlines, or fabric swatches?
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                    Contact Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 8295313004"
                    className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                    How may our couturiers assist you? *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Tell us about your upcoming event, silhouette preferences, or fit questions..."
                    className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#121212] hover:bg-[#2A2825] text-white text-xs uppercase font-sans tracking-widest font-semibold"
                >
                  Send Atelier Enquiry
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 4: 30-DAY POLICY & GUARANTEE */}
        {activeTab === 'policy' && (
          <div className="max-w-3xl mx-auto bg-white border border-[#E8E2D9] p-6 sm:p-10 shadow-xs space-y-6 text-xs font-sans text-[#59534A] leading-relaxed">
            <h3 className="font-serif text-3xl text-[#121212]">Infi 30-Day Effortless Return Policy</h3>

            <div className="border-l-2 border-[#C5A059] pl-4 py-1 italic font-serif text-sm text-[#121212]">
              “We understand that formalwear must be tried in the comfort of your home with your intended heels and jewelry.”
            </div>

            <div className="space-y-3">
              <h4 className="font-serif text-base text-[#121212] font-semibold">1. Return Window</h4>
              <p>
                Clients enjoy a generous <strong>30-day return & exchange window</strong> starting from the recorded courier delivery date.
              </p>

              <h4 className="font-serif text-base text-[#121212] font-semibold">2. Garment Condition Standards</h4>
              <p>
                To maintain haute atelier hygiene standards, dresses must be unworn, free of perfume, makeup marks, or deodorants, with the original Infi silk-ribbon security tag still fastened to the neckline or zipper.
              </p>

              <h4 className="font-serif text-base text-[#121212] font-semibold">3. Refund Choices</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Original Payment Method:</strong> Credited within 3–5 business days of atelier intake inspection.</li>
                <li><strong>Infi Atelier Credit (+10% Bonus):</strong> Opt for store credit and receive an extra 10% value applied to your private dossier.</li>
                <li><strong>Complimentary Size Exchange:</strong> Swap immediately for XS, S, M, L, XL or request bespoke adjustments.</li>
              </ul>

              <h4 className="font-serif text-base text-[#121212] font-semibold">4. Bespoke Made-to-Measure Guarantee</h4>
              <p>
                Custom bespoke gowns cut to individual measurements are accompanied by our <strong>Complimentary Fit Guarantee</strong>: including one complimentary round of salon adjustments or up to ₹4,000 / $50 local tailor reimbursement.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
