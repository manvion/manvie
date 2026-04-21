"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

// ─── Types ──────────────────────────────────────────────────────────────────

interface CardDetails {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
}

interface ShippingDetails {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

// ─── Formatters ─────────────────────────────────────────────────────────────

function formatCardNumber(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
}
function detectCardBrand(n: string): string {
  const raw = n.replace(/\s/g, "");
  if (/^4/.test(raw)) return "VISA";
  if (/^5[1-5]/.test(raw)) return "MC";
  if (/^3[47]/.test(raw)) return "AMEX";
  if (/^6/.test(raw)) return "DISC";
  return "";
}

// ─── Input component ─────────────────────────────────────────────────────────

function LuxInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  maxLength,
  className = "",
  suffix,
  onFocus,
  onBlur,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  suffix?: React.ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className={`relative ${className}`}>
      <label
        className={`absolute left-0 transition-all duration-300 pointer-events-none ${
          focused || value
            ? "-top-5 text-[8px] tracking-[0.3em] text-gold uppercase"
            : "top-3 text-xs text-gray-400"
        }`}
      >
        {label}
      </label>
      <div className="flex items-center">
        <input
          type={type}
          value={value}
          maxLength={maxLength}
          placeholder={focused ? placeholder : ""}
          onFocus={() => { setFocused(true); onFocus?.(); }}
          onBlur={() => { setFocused(false); onBlur?.(); }}
          onChange={e => onChange(e.target.value)}
          className={`w-full bg-transparent border-b py-3 text-sm focus:outline-none transition-colors duration-300 ${
            focused ? "border-black" : "border-gray-200"
          }`}
        />
        {suffix && <span className="ml-2 shrink-0">{suffix}</span>}
      </div>
    </div>
  );
}

// ─── Card Visual ─────────────────────────────────────────────────────────────

function CreditCardVisual({ card, flipped }: { card: CardDetails; flipped: boolean }) {
  const brand = detectCardBrand(card.number);
  const maskedNum = card.number
    ? card.number.padEnd(19, "·").replace(/(.{5})$/g, (s) => s)
    : "•••• •••• •••• ••••";

  return (
    <div className="relative w-full max-w-sm mx-auto h-48 perspective-[1200px]" style={{ perspective: "1200px" }}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2a2518] to-[#1a1a1a] rounded-2xl p-6 flex flex-col justify-between shadow-2xl border border-white/10"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-7 bg-gradient-to-br from-gold to-gold-dark rounded-sm" />
            <span className="text-[10px] tracking-[0.3em] text-gold/80 font-medium">{brand || "MANVIÉ"}</span>
          </div>
          <div>
            <p className="font-mono text-white/90 text-xl tracking-[0.15em] mb-4">
              {maskedNum || "•••• •••• •••• ••••"}
            </p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[8px] tracking-[0.3em] text-white/40 uppercase mb-1">Card Holder</p>
                <p className="text-xs text-white/80 tracking-widest uppercase">
                  {card.name || "Your Name"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[8px] tracking-[0.3em] text-white/40 uppercase mb-1">Expires</p>
                <p className="text-xs text-white/80 font-mono">{card.expiry || "MM / YY"}</p>
              </div>
            </div>
          </div>
          {/* Shimmer */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#2a2518] rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="w-full h-10 bg-gray-800 mt-6" />
          <div className="px-6 mt-5">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-8 bg-white/10 rounded" />
              <div className="w-12 h-8 bg-white/90 rounded flex items-center justify-center">
                <span className="font-mono text-black text-xs font-bold tracking-wider">
                  {card.cvc || "•••"}
                </span>
              </div>
            </div>
            <p className="text-[7px] tracking-[0.2em] text-white/30 uppercase mt-3">Security Code</p>
          </div>
          <div className="absolute bottom-5 right-6">
            <span className="text-[9px] tracking-[0.3em] text-gold/60">MANVIÉ</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Steps ───────────────────────────────────────────────────────────────────

const STEPS = ["Shipping", "Payment", "Review"];

// ─── Main ────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [success, setSuccess] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [orderNumber] = useState(() => `M-${Math.floor(80000 + Math.random() * 19999)}-FX`);

  const [shipping, setShipping] = useState<ShippingDetails>({
    firstName: "", lastName: "", email: "",
    address: "", apt: "", city: "", state: "", zip: "", country: "Canada"
  });

  const [card, setCard] = useState<CardDetails>({
    number: "", name: "", expiry: "", cvc: ""
  });

  const cartItems = [
    { id: "1", name: "Manvié Signature Coat", price: 2400, size: "M", quantity: 1, image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=300&auto=format&fit=crop" },
    { id: "4", name: "Italian Leather Handbag", price: 3200, size: "One Size", quantity: 1, image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=300&auto=format&fit=crop" },
  ];

  const subtotal = cartItems.reduce((a, i) => a + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const setS = (field: keyof ShippingDetails) => (v: string) =>
    setShipping(prev => ({ ...prev, [field]: v }));
  const setC = (field: keyof CardDetails) => (v: string) =>
    setCard(prev => ({ ...prev, [field]: v }));

  // ── Place Order ─────────────────────────────────────────────────────────
  const placeOrder = () => {
    setLoading(true);
    const msgs = [
      "Initializing Secure Gateway...",
      "Authenticating Client Identity...",
      "Verifying Bank Protocol...",
      "Encrypting Transaction...",
      "Securing Assets...",
    ];
    msgs.forEach((m, i) => setTimeout(() => setLoadingText(m), i * 900));
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, msgs.length * 900 + 400);
  };

  // ── Success screen ───────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-[#f8f7f5] text-black pt-32 pb-24 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-2xl w-full bg-white p-10 md:p-16 shadow-2xl text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>

          <p className="text-[9px] tracking-[0.5em] uppercase text-gold mb-3">Order Confirmed</p>
          <h1 className="font-serif text-4xl mb-2">Transaction Authorized</h1>
          <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase mb-10">{orderNumber}</p>

          <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-md mx-auto">
            Your pieces are queued for white-glove logistics. A Manvié concierge will contact you within 24 hours with secure transit details.
          </p>

          {/* Order receipt */}
          <div className="border border-gray-100 bg-gray-50/50 text-left p-6 mb-10 space-y-4">
            <p className="text-[8px] tracking-[0.3em] uppercase text-gray-400 mb-4">Digital Receipt</p>
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="font-serif">{item.name} <span className="text-gray-400 text-xs">({item.size})</span></span>
                <span className="font-mono">${item.price.toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-4 space-y-2 text-xs tracking-widest uppercase">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span><span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tax</span><span>${tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span><span>Complimentary</span>
              </div>
              <div className="flex justify-between text-base font-medium text-black pt-2 border-t border-gray-200">
                <span>Total</span><span>${total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/account/dashboard"
              className="bg-black text-white px-10 py-4 text-[10px] tracking-[0.3em] uppercase hover:bg-gold hover:text-black transition-colors duration-500"
            >
              View Client Wardrobe
            </Link>
            <Link
              href="/shop"
              className="border border-gray-200 text-black px-10 py-4 text-[10px] tracking-[0.3em] uppercase hover:border-black transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Loading Overlay ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8f7f5] text-black pt-32 pb-24 px-4 md:px-8 relative">
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/97 backdrop-blur-xl flex flex-col items-center justify-center text-white"
          >
            <div className="relative w-24 h-24 mb-12">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-gold/40 rounded-full" />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-3 border-t-2 border-gold rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[7px] tracking-[0.5em] text-gold uppercase">Pay</span>
              </div>
            </div>
            <motion.p key={loadingText} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="text-[10px] tracking-[0.4em] uppercase text-white/80"
            >
              {loadingText}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-12 border-b border-gray-200 pb-8">
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-gold mb-2">Secure Checkout</p>
            <h1 className="font-serif text-4xl">Order Summary</h1>
          </div>
          <Link href="/cart" className="text-[9px] uppercase tracking-[0.25em] text-gray-400 hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5">
            ← Return to Bag
          </Link>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-0 mb-14">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 text-[9px] tracking-[0.3em] uppercase transition-colors ${
                  i === step ? "text-black font-medium" : i < step ? "text-gold cursor-pointer" : "text-gray-300"
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border transition-all ${
                  i < step ? "bg-gold border-gold text-black" : i === step ? "bg-black border-black text-white" : "border-gray-200 text-gray-300"
                }`}>
                  {i < step ? "✓" : i + 1}
                </span>
                {s}
              </button>
              {i < STEPS.length - 1 && (
                <div className={`h-[1px] w-16 mx-3 transition-colors ${i < step ? "bg-gold" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* ── Left: form ── */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">

              {/* Step 0: Shipping */}
              {step === 0 && (
                <motion.div key="shipping"
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white p-8 md:p-12 border border-gray-100 shadow-sm space-y-10"
                >
                  <h2 className="font-serif text-2xl border-b border-gray-100 pb-5">Shipping Destination</h2>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                    <LuxInput label="First Name" value={shipping.firstName} onChange={setS("firstName")} />
                    <LuxInput label="Last Name" value={shipping.lastName} onChange={setS("lastName")} />
                    <LuxInput label="Email Address" type="email" value={shipping.email} onChange={setS("email")} className="col-span-2" />
                    <LuxInput label="Street Address" value={shipping.address} onChange={setS("address")} className="col-span-2" />
                    <LuxInput label="Apt / Suite (optional)" value={shipping.apt} onChange={setS("apt")} className="col-span-2" />
                    <LuxInput label="City" value={shipping.city} onChange={setS("city")} />
                    <LuxInput label="State / Region" value={shipping.state} onChange={setS("state")} />
                    <LuxInput label="ZIP / Postal Code" value={shipping.zip} onChange={setS("zip")} />
                    <div className="relative">
                      <label className="-top-5 absolute text-[8px] tracking-[0.3em] text-gold uppercase">Country</label>
                      <select
                        value={shipping.country}
                        onChange={e => setShipping(prev => ({ ...prev, country: e.target.value }))}
                        className="w-full border-b border-gray-200 py-3 text-sm bg-transparent focus:outline-none focus:border-black transition-colors appearance-none"
                      >
                        {["France", "United States", "United Kingdom", "Germany", "Italy", "Japan", "UAE", "Singapore", "Australia"].map(c => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => setStep(1)}
                      disabled={!shipping.firstName || !shipping.email || !shipping.address}
                      className="w-full bg-black text-white py-5 text-[10px] tracking-[0.35em] uppercase hover:bg-gold hover:text-black transition-colors duration-500 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 1: Payment */}
              {step === 1 && (
                <motion.div key="payment"
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8"
                >
                  {/* Card visual */}
                  <div className="bg-[#0a0a0a] p-8 md:p-12">
                    <CreditCardVisual card={card} flipped={cardFlipped} />
                  </div>

                  <div className="bg-white p-8 md:p-12 border border-gray-100 shadow-sm space-y-10">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-5">
                      <h2 className="font-serif text-2xl">Payment Details</h2>
                      <div className="flex gap-2 items-center text-[8px] tracking-[0.2em] text-gray-400 uppercase">
                        <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                        SSL Encrypted
                      </div>
                    </div>

                    <div className="space-y-10">
                      <LuxInput
                        label="Card Number"
                        value={card.number}
                        onChange={v => setC("number")(formatCardNumber(v))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        suffix={
                          <span className="text-[10px] tracking-widest text-gray-400 font-mono min-w-[36px] text-right">
                            {detectCardBrand(card.number)}
                          </span>
                        }
                      />
                      <LuxInput
                        label="Cardholder Name"
                        value={card.name}
                        onChange={setC("name")}
                        placeholder="As it appears on card"
                      />
                      <div className="grid grid-cols-2 gap-8">
                        <LuxInput
                          label="Expiry"
                          value={card.expiry}
                          onChange={v => setC("expiry")(formatExpiry(v))}
                          placeholder="MM / YY"
                          maxLength={7}
                        />
                        <LuxInput
                          label="CVC"
                          value={card.cvc}
                          onChange={v => setC("cvc")(v.replace(/\D/g, "").slice(0, 4))}
                          placeholder="•••"
                          maxLength={4}
                          onFocus={() => setCardFlipped(true)}
                          onBlur={() => setCardFlipped(false)}
                        />
                      </div>
                    </div>

                    {/* Payment methods */}
                    <div>
                      <p className="text-[8px] tracking-[0.3em] uppercase text-gray-400 mb-4">Or pay with</p>
                      <div className="grid grid-cols-3 gap-3">
                        {["Apple Pay", "Google Pay", "PayPal"].map(method => (
                          <button key={method} className="border border-gray-200 py-3 text-[9px] tracking-[0.2em] uppercase text-gray-500 hover:border-black hover:text-black transition-colors">
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => setStep(0)}
                        className="w-1/3 border border-gray-200 py-5 text-[10px] tracking-[0.3em] uppercase text-gray-500 hover:border-black hover:text-black transition-colors"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={() => setStep(2)}
                        disabled={!card.number || !card.name || !card.expiry || !card.cvc}
                        className="flex-1 bg-black text-white py-5 text-[10px] tracking-[0.35em] uppercase hover:bg-gold hover:text-black transition-colors duration-500 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Review Order
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Review */}
              {step === 2 && (
                <motion.div key="review"
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white p-8 md:p-12 border border-gray-100 shadow-sm space-y-10"
                >
                  <h2 className="font-serif text-2xl border-b border-gray-100 pb-5">Review & Confirm</h2>

                  {/* Shipping summary */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-[9px] tracking-[0.3em] uppercase text-gold">Delivery Address</p>
                      <button onClick={() => setStep(0)} className="text-[8px] tracking-[0.2em] uppercase text-gray-400 hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5">
                        Edit
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">{shipping.firstName} {shipping.lastName}</p>
                    <p className="text-sm text-gray-500">{shipping.address}{shipping.apt ? `, ${shipping.apt}` : ""}</p>
                    <p className="text-sm text-gray-500">{shipping.city}{shipping.state ? `, ${shipping.state}` : ""} {shipping.zip}</p>
                    <p className="text-sm text-gray-500">{shipping.country}</p>
                    <p className="text-sm text-gray-500 mt-1">{shipping.email}</p>
                  </div>

                  {/* Payment summary */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-[9px] tracking-[0.3em] uppercase text-gold">Payment Method</p>
                      <button onClick={() => setStep(1)} className="text-[8px] tracking-[0.2em] uppercase text-gray-400 hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5">
                        Edit
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 font-mono">
                      •••• •••• •••• {card.number.replace(/\s/g, "").slice(-4) || "••••"}
                    </p>
                    <p className="text-sm text-gray-500">{card.name}</p>
                    <p className="text-sm text-gray-500">Expires {card.expiry}</p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={placeOrder}
                      className="w-full bg-black text-white py-6 text-[10px] tracking-[0.4em] uppercase hover:bg-gold hover:text-black transition-colors duration-500 shadow-xl relative overflow-hidden group"
                    >
                      <span className="relative z-10">Place Order · ${total.toLocaleString()}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 skew-x-12" />
                    </button>
                    <p className="text-center text-[8px] tracking-[0.2em] uppercase text-gray-400 mt-4">
                      By placing this order you agree to our Terms of Service
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:col-span-5">
            <div className="bg-black text-white p-8 md:p-12 shadow-2xl sticky top-28">
              <h2 className="font-serif text-2xl mb-8 border-b border-white/10 pb-5 text-gold">Bag</h2>

              <div className="space-y-6 mb-8">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-5">
                    <div className="relative w-16 h-20 bg-gray-900 border border-white/10 shrink-0 overflow-hidden">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <p className="text-[9px] tracking-[0.2em] uppercase text-white/80">{item.name}</p>
                        <p className="text-[8px] tracking-widest text-gray-500 mt-0.5">Size {item.size} · Qty {item.quantity}</p>
                      </div>
                      <p className="font-serif text-white/80">${item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo code */}
              <div className="flex gap-0 mb-8">
                <input
                  type="text"
                  placeholder="Promo code"
                  className="flex-1 bg-white/5 border border-white/10 px-4 py-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50 transition-colors"
                />
                <button className="bg-white/10 border border-white/10 border-l-0 px-5 text-[8px] tracking-[0.2em] uppercase text-gray-400 hover:bg-gold hover:text-black hover:border-gold transition-colors">
                  Apply
                </button>
              </div>

              <div className="border-t border-white/10 pt-6 space-y-4 text-xs tracking-widest uppercase">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax</span>
                  <span>${tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-gold">Complimentary</span>
                </div>
                <div className="flex justify-between text-base border-t border-white/10 pt-5 mt-2">
                  <span className="text-gold">Total</span>
                  <span className="font-serif">${total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center gap-3 text-[8px] text-gray-600 tracking-widest uppercase">
                <span>🔒</span>
                <span>Secure Payment</span>
                <span>·</span>
                <span>AES-256</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
