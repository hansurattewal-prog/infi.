import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Truck,
  Building2,
  Lock,
  ArrowRight,
  ChevronLeft,
  QrCode,
  Smartphone,
  Sparkles,
  Calendar,
  Download
} from 'lucide-react';
import { CartItem, CurrencyCode, OrderConfirmationData } from '../types';
import { formatPrice } from '../utils/currency';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  onOrderSuccess: (order: OrderConfirmationData) => void;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onOrderSuccess,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Review, 2: Shipping, 3: Payment, 4: Confirmation
  const [fulfillmentType, setFulfillmentType] = useState<'white_glove_courier' | 'atelier_pickup'>('white_glove_courier');

  // Customer & Shipping Info
  const [fullName, setFullName] = useState('Sophia Sharma');
  const [email, setEmail] = useState('sophia.sharma@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState('Flat 4B, The Regent Residences, Bandra West');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [postalCode, setPostalCode] = useState('400050');
  const [country, setCountry] = useState('India');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'apple_pay' | 'paypal'>('upi');
  const [upiId, setUpiId] = useState('sophia@okaxis');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'phonepe' | 'gpay' | 'paytm' | 'bhim'>('phonepe');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('•••');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderConfirmationData | null>(null);

  // Financial Calculations
  const subtotalINR = items.reduce((sum, item) => sum + item.priceINR * item.quantity, 0);
  const shippingINR = subtotalINR >= 15000 || fulfillmentType === 'atelier_pickup' ? 0 : 1500;
  const totalINR = subtotalINR + shippingINR;

  const hasBespokeItems = items.some((item) => item.isCustom);
  const estimatedDelivery = hasBespokeItems
    ? 'Handcrafted in Atelier (Ready in 14–21 Days)'
    : 'Express Courier (Arrives in 3–5 Business Days)';

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const orderData: OrderConfirmationData = {
        orderId: `INFI-${Math.floor(100000 + Math.random() * 900000)}`,
        items: [...items],
        subtotalINR,
        discountINR: 0,
        shippingINR,
        totalINR,
        shippingDetails: {
          fullName,
          email,
          phone,
          address,
          city,
          state,
          postalCode,
          country,
          fulfillmentType,
        },
        paymentMethod,
        paymentDetailsSummary:
          paymentMethod === 'upi'
            ? `UPI (${selectedUpiApp.toUpperCase()}: ${upiId})`
            : paymentMethod === 'card'
            ? `Credit Card ending in 4242`
            : paymentMethod === 'apple_pay'
            ? 'Apple Pay'
            : 'PayPal Express',
        estimatedDelivery,
        createdDate: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      };

      setConfirmedOrder(orderData);
      setIsProcessing(false);
      setStep(4);
      onOrderSuccess(orderData);
      onClearCart();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#FDFBF7] text-[#121212] border border-[#D9D2C7] shadow-2xl my-auto overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#E8E2D9] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#C5A059]" />
            <span className="font-serif text-xl tracking-wider text-[#121212]">
              Infi Atelier • Secure Checkout
            </span>
          </div>
          {step !== 4 && (
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-black transition-colors"
              aria-label="Close Checkout"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 3-Step Progress Indicator (as requested) */}
        {step !== 4 && (
          <div className="bg-[#FAF8F5] px-6 py-3 border-b border-[#E8E2D9]">
            <div className="flex items-center justify-between text-xs font-sans uppercase tracking-wider">
              <span className={step >= 1 ? 'text-[#121212] font-semibold' : 'text-neutral-400'}>
                1. Review Items
              </span>
              <span className="text-neutral-300">→</span>
              <span className={step >= 2 ? 'text-[#121212] font-semibold' : 'text-neutral-400'}>
                2. Shipping & Delivery
              </span>
              <span className="text-neutral-300">→</span>
              <span className={step >= 3 ? 'text-[#121212] font-semibold' : 'text-neutral-400'}>
                3. Payment & Confirmation
              </span>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {/* STEP 1: REVIEW ITEMS */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="font-serif text-2xl text-[#121212]">Review Your Atelier Selection</h3>

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-[#E8E2D9]">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-14 h-18 object-cover" />
                      <div>
                        <h4 className="font-serif text-base font-medium text-[#121212]">{item.name}</h4>
                        <p className="text-xs text-neutral-500 font-sans">
                          {item.isCustom ? 'Bespoke Made-to-Measure' : `Size: ${item.size} • Color: ${item.color}`}
                        </p>
                        <span className="text-xs text-neutral-600 font-sans">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="text-sm font-sans font-semibold text-[#121212]">
                      {formatPrice(item.priceINR * item.quantity, currency)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white border border-[#E8E2D9] space-y-2 text-xs font-sans">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotalINR, currency)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>White-Glove Shipping</span>
                  <span className="text-[#C5A059] font-medium">
                    {shippingINR === 0 ? 'Complimentary' : formatPrice(shippingINR, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold text-[#121212] pt-2 border-t border-[#F0ECE5]">
                  <span>Total Due</span>
                  <span>{formatPrice(totalINR, currency)}</span>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs uppercase font-sans tracking-widest text-neutral-600"
                >
                  Cancel
                </button>
                <button
                  id="checkout-step1-next-btn"
                  onClick={() => setStep(2)}
                  className="px-8 py-3.5 bg-[#121212] text-white text-xs uppercase font-sans tracking-widest font-semibold flex items-center gap-2"
                >
                  <span>Continue to Shipping</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SHIPPING & FULFILLMENT */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl text-[#121212] mb-1">Shipping & Delivery Options</h3>
                <p className="text-xs text-[#736B60] font-sans">
                  Choose white-glove courier dispatch or private atelier boutique collection.
                </p>
              </div>

              {/* Fulfillment Type Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setFulfillmentType('white_glove_courier')}
                  className={`p-4 border cursor-pointer transition-all ${
                    fulfillmentType === 'white_glove_courier'
                      ? 'border-[#121212] bg-[#F4EFEB] ring-1 ring-[#121212]'
                      : 'border-[#E8E2D9] bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Truck className="w-4 h-4 text-[#C5A059]" />
                    <span className="font-serif text-base font-medium">White-Glove Express Courier</span>
                  </div>
                  <p className="text-xs text-[#736B60] font-sans">
                    Discreet signature-required courier with garment bag and wooden hanger.
                  </p>
                </div>

                <div
                  onClick={() => setFulfillmentType('atelier_pickup')}
                  className={`p-4 border cursor-pointer transition-all ${
                    fulfillmentType === 'atelier_pickup'
                      ? 'border-[#121212] bg-[#F4EFEB] ring-1 ring-[#121212]'
                      : 'border-[#E8E2D9] bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-4 h-4 text-[#C5A059]" />
                    <span className="font-serif text-base font-medium">Private Boutique Pickup</span>
                  </div>
                  <p className="text-xs text-[#736B60] font-sans">
                    Collect in person with complimentary private fitting session in salon.
                  </p>
                </div>
              </div>

              {/* Address Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                    Phone (for Delivery & Courier SMS) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans bg-white"
                  />
                </div>

                {fulfillmentType === 'white_glove_courier' ? (
                  <>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                        Delivery Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                        City & Postal Code *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-2/3 p-2.5 border border-[#E8E2D9] text-xs font-sans bg-white"
                          placeholder="City"
                        />
                        <input
                          type="text"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className="w-1/3 p-2.5 border border-[#E8E2D9] text-xs font-sans bg-white"
                          placeholder="PIN"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                        Country *
                      </label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans bg-white"
                      />
                    </div>
                  </>
                ) : (
                  <div className="sm:col-span-2 p-3 bg-white border border-[#E8E2D9] text-xs font-sans text-neutral-600">
                    <p className="font-medium text-[#121212] mb-1">Selected Atelier Location:</p>
                    <p>Infi Haute Couture Maison & Salon</p>
                    <p>Palais Royale Pavilion, 4th Floor, Crescent Boulevard, Mumbai</p>
                    <p className="mt-1 text-[#C5A059]">Complimentary champagne on arrival & head tailor present.</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 text-xs uppercase font-sans tracking-widest text-neutral-600 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  id="checkout-step2-next-btn"
                  onClick={() => setStep(3)}
                  className="px-8 py-3.5 bg-[#121212] text-white text-xs uppercase font-sans tracking-widest font-semibold flex items-center gap-2"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT & TRUST SIGNALS (UPI, Cards, Apple Pay) */}
          {step === 3 && (
            <form onSubmit={handleCompleteOrder} className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl text-[#121212] mb-1">Payment Method & Verification</h3>
                <p className="text-xs text-[#736B60] font-sans">
                  Encrypted 256-bit SSL checkout with instantaneous receipt generation.
                </p>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'upi', label: 'UPI / QR Mobile' },
                  { id: 'card', label: 'Credit/Debit Card' },
                  { id: 'apple_pay', label: 'Apple Pay' },
                  { id: 'paypal', label: 'PayPal' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`py-3 px-2 border text-xs font-sans uppercase tracking-wider transition-all ${
                      paymentMethod === m.id
                        ? 'border-[#121212] bg-[#121212] text-white font-medium'
                        : 'border-[#E8E2D9] bg-white hover:border-black text-neutral-700'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* UPI (Dominant in Indian market: 55%+ transactions) */}
              {paymentMethod === 'upi' && (
                <div className="p-4 bg-white border border-[#E8E2D9] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans uppercase font-semibold text-neutral-800">
                      Select UPI Payment Application
                    </span>
                    <span className="text-[10px] uppercase font-sans text-green-700 font-semibold bg-green-50 px-2 py-0.5">
                      Zero Surcharge
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-sans">
                    {[
                      { id: 'phonepe', name: 'PhonePe', color: '#5f259f' },
                      { id: 'gpay', name: 'Google Pay', color: '#4285F4' },
                      { id: 'paytm', name: 'Paytm UPI', color: '#00BAF2' },
                      { id: 'bhim', name: 'BHIM / Any UPI', color: '#F37021' },
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setSelectedUpiApp(app.id as any)}
                        className={`p-2.5 border rounded-xs transition-all ${
                          selectedUpiApp === app.id
                            ? 'border-[#121212] ring-1 ring-[#121212] font-semibold bg-[#F4EFEB]'
                            : 'border-[#E8E2D9] hover:border-neutral-400'
                        }`}
                      >
                        <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: app.color }} />
                        <span className="text-[11px] block">{app.name}</span>
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                      Enter UPI ID / VPA
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="flex-1 p-2.5 border border-[#E8E2D9] text-xs font-sans"
                        placeholder="yourname@okhdfcbank"
                      />
                      <button
                        type="button"
                        className="px-3 py-2 bg-[#F4EFEB] border border-[#D9D2C7] text-xs font-sans text-neutral-700 flex items-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Show QR</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Card Payment */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-white border border-[#E8E2D9] space-y-3">
                  <div>
                    <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans pl-10"
                        placeholder="4242 •••• •••• ••••"
                      />
                      <CreditCard className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase font-sans font-semibold text-neutral-800 mb-1">
                        Security Code (CVV)
                      </label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full p-2.5 border border-[#E8E2D9] text-xs font-sans"
                        placeholder="•••"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Apple Pay & PayPal previews */}
              {paymentMethod === 'apple_pay' && (
                <div className="p-6 bg-white border border-[#E8E2D9] text-center font-sans space-y-2">
                  <Smartphone className="w-8 h-8 mx-auto text-[#121212]" />
                  <p className="text-xs text-neutral-700">One-touch biometric authorization enabled.</p>
                  <p className="text-[11px] text-neutral-400">Clicking authorize will prompt your Touch ID / Face ID.</p>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="p-6 bg-white border border-[#E8E2D9] text-center font-sans space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#003087] text-white flex items-center justify-center font-bold text-sm mx-auto">
                    P
                  </div>
                  <p className="text-xs text-neutral-700">You will be redirected securely to PayPal to confirm.</p>
                </div>
              )}

              {/* Trust Badges Bar */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#E8E2D9] text-[11px] font-sans text-neutral-600 text-center">
                <span className="flex items-center justify-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#C5A059]" /> 256-Bit SSL Encrypted
                </span>
                <span className="flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" /> PCI-DSS Level 1
                </span>
                <span className="flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" /> Authenticity Guarantee
                </span>
              </div>

              {/* Submit Payment */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 text-xs uppercase font-sans tracking-widest text-neutral-600 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  id="authorize-payment-btn"
                  type="submit"
                  disabled={isProcessing}
                  className="px-8 py-4 bg-[#121212] hover:bg-[#2A2825] text-white text-xs uppercase font-sans tracking-widest font-semibold flex items-center gap-2 shadow-xl cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Securing Haute Order...</span>
                  ) : (
                    <span>Authorize Payment • {formatPrice(totalINR, currency)}</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: ORDER CONFIRMATION & ESTIMATED DELIVERY */}
          {step === 4 && confirmedOrder && (
            <div className="space-y-6 text-center py-4">
              <div className="w-14 h-14 rounded-full bg-[#121212] text-[#C5A059] flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs uppercase font-sans tracking-[0.25em] text-[#C5A059] font-medium">
                  Order Successfully Confirmed
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-[#121212] mt-1">
                  Thank you, {confirmedOrder.shippingDetails.fullName}
                </h3>
                <p className="text-xs text-neutral-500 font-sans mt-1">
                  Order Dossier: <strong>{confirmedOrder.orderId}</strong> • Receipt sent to {confirmedOrder.shippingDetails.email}
                </p>
              </div>

              {/* Estimated Delivery / Custom Production Timeline (Explicit prompt requirement) */}
              <div className="bg-[#FAF8F5] p-5 border border-[#E8E2D9] max-w-lg mx-auto text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-sans uppercase font-semibold text-[#121212]">
                  <Calendar className="w-4 h-4 text-[#C5A059]" />
                  <span>Atelier Production & Delivery Timeline</span>
                </div>
                <p className="text-xs font-sans text-[#59534A]">
                  <strong>Estimated Status:</strong> {confirmedOrder.estimatedDelivery}
                </p>
                <p className="text-[11px] text-neutral-500 font-sans">
                  Fulfillment: {confirmedOrder.shippingDetails.fulfillmentType === 'white_glove_courier'
                    ? `Discreet White-Glove Courier to ${confirmedOrder.shippingDetails.city}`
                    : 'Private Boutique Fitting in Salon'}
                </p>
                <p className="text-[11px] text-[#8C8275] font-sans">
                  Payment: {confirmedOrder.paymentDetailsSummary} ({formatPrice(confirmedOrder.totalINR, currency)})
                </p>
              </div>

              {/* Support & WhatsApp Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/918295313004?text=Hello%20Infi%20Atelier,%20I%20have%20an%20inquiry%20regarding%20Order%20${confirmedOrder.orderId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs uppercase font-sans tracking-wider font-semibold rounded-xs transition-colors flex items-center gap-2"
                >
                  <span>WhatsApp Order Tracking (+91 8295313004)</span>
                </a>

                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-[#121212] text-white text-xs uppercase font-sans tracking-widest font-medium"
                >
                  Return to Collection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
