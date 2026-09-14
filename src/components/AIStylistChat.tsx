import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Bot, User, Phone, MessageSquare, Loader2 } from 'lucide-react';
import { Dress } from '../types';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

interface AIStylistChatProps {
  isOpen: boolean;
  onClose: () => void;
  activeDress?: Dress | null;
  onOpenCustomStudio?: () => void;
}

export const AIStylistChat: React.FC<AIStylistChatProps> = ({
  isOpen,
  onClose,
  activeDress,
  onOpenCustomStudio,
}) => {
  if (!isOpen) return null;

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: activeDress
        ? `Bonjour and welcome to Infi Atelier. I see you are considering "${activeDress.name}" (${activeDress.silhouette}, crafted in ${activeDress.fabric}). May I advise you on styling accessories, size calculations, or bespoke anatomical customizations?`
        : 'Welcome to Infi Atelier Private Concierge. I am your master couturier assistant. How may I assist you with gala dress codes, bespoke measurements, or styling pairings today?',
      time: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickPrompts = [
    'How do I measure my bust, waist & hips correctly?',
    'What accessories pair with evening gowns?',
    'How does the 30-day return policy work?',
    'Can I order custom bespoke length for high heels?',
  ];

  const handleSend = async (textToSend?: string) => {
    const userText = textToSend || input.trim();
    if (!userText || loading) return;

    const newMsg: Message = {
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          mode: 'concierge_chat',
          dressContext: activeDress ? { name: activeDress.name, fabric: activeDress.fabric } : undefined,
        }),
      });

      const data = await res.json();
      const aiReply: Message = {
        sender: 'ai',
        text: data.response || 'Thank you for your enquiry. Our master couturiers are at your service.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      const fallbackReply: Message = {
        sender: 'ai',
        text: 'At Infi Atelier, every garment is crafted with immaculate French seam allowances. For personalized styling or bespoke order inquiries, our salon hotline (+91 8295313004) and WhatsApp concierge are available 24/7.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm sm:max-w-md bg-[#FDFBF7] text-[#121212] border border-[#D9D2C7] shadow-2xl overflow-hidden flex flex-col h-[520px] animate-fadeIn">
      {/* Header */}
      <div className="bg-[#121212] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#FAF8F5] text-[#C5A059] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-medium leading-none">Infi AI Couturier</h3>
            <span className="text-[10px] text-[#C5A059] uppercase font-sans tracking-widest">
              Private Salon Concierge
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/918295313004"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-neutral-300 hover:text-[#25D366] transition-colors"
            title="Switch to WhatsApp"
          >
            <MessageSquare className="w-4 h-4" />
          </a>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-300 hover:text-white transition-colors"
            aria-label="Close Chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF8F5]">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 text-xs font-sans leading-relaxed rounded-xs shadow-2xs whitespace-pre-line ${
                m.sender === 'user'
                  ? 'bg-[#121212] text-white'
                  : 'bg-white text-[#2A2825] border border-[#E8E2D9]'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[9px] text-neutral-400 font-sans mt-0.5 px-1">{m.time}</span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs font-sans text-neutral-500 bg-white p-2.5 rounded-xs border border-[#E8E2D9] w-max">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C5A059]" />
            <span>Consulting master draping archives...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="p-2 bg-white border-t border-[#E8E2D9] flex gap-1.5 overflow-x-auto">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="text-[10px] font-sans px-2.5 py-1 bg-[#F4EFEB] hover:bg-[#EBE3D8] text-neutral-800 whitespace-nowrap rounded-xs transition-colors shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-[#E8E2D9] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask sizing, gala styling, or fabric care..."
          className="flex-1 p-2 text-xs font-sans border border-[#E8E2D9] focus:outline-none focus:border-[#121212]"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2 bg-[#121212] hover:bg-[#2A2825] text-white disabled:opacity-40 transition-colors"
          aria-label="Send Message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
