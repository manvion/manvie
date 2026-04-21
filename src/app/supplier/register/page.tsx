"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

const SPECIALTY_OPTIONS = [
  "Outerwear & Coats",
  "Dresses & Gowns",
  "Tailoring & Suits",
  "Knitwear & Cashmere",
  "Accessories & Leather",
  "Jewellery & Fine Goods",
  "Scarves & Silk",
  "Children's Wear",
  "Other",
];

const COUNTRY_OPTIONS = [
  "Canada", "France", "Italy", "United Kingdom", "United States",
  "Spain", "Germany", "Japan", "South Korea", "Other",
];

export default function SupplierRegisterPage() {
  const { t } = useApp();
  const tReg = t.supplierRegister as Record<string, string>;

  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
    country: "Canada",
    specialty: "",
    description: "",
    annualCapacity: "",
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = (key: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!form.agreeTerms) {
      setError("Please accept the supplier terms to continue.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/supplier/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: form.companyName,
          contactName: form.contactName,
          email: form.email,
          password: form.password,
          phone: form.phone,
          location: form.location,
          country: form.country,
          specialty: form.specialty,
          description: form.description,
          annualCapacity: form.annualCapacity ? parseInt(form.annualCapacity) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0d0c0a] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 border border-gold/40 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="#C8A96A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-[9px] tracking-[0.5em] uppercase text-gold mb-4">Application Received</p>
          <h1 className="font-serif text-3xl text-white mb-6">{tReg.successTitle}</h1>
          <p className="text-sm text-gray-400 leading-relaxed mb-12">{tReg.successDesc}</p>
          <Link href="/" className="inline-block text-[10px] tracking-[0.3em] uppercase text-white/40 hover:text-white transition-colors border border-white/10 px-8 py-4">
            Return to Manvié →
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0c0a] relative overflow-hidden">
      {/* Gold grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#C8A96A 1px, transparent 1px), linear-gradient(90deg, #C8A96A 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <Link href="/" className="inline-block mb-8">
              <p className="text-[9px] tracking-[0.6em] text-gold uppercase">Manvié</p>
            </Link>
            <p className="text-[9px] tracking-[0.5em] uppercase text-gold/70 mb-4">Partner Network</p>
            <h1 className="font-serif text-3xl text-white mb-3">{tReg.title}</h1>
            <p className="text-[11px] text-gray-500 tracking-wider">{tReg.subtitle}</p>
            <div className="w-12 h-[1px] bg-gold/40 mx-auto mt-6" />
          </div>

          <div className="bg-black/60 border border-white/10 backdrop-blur-xl p-10">
            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-[10px] tracking-[0.15em] text-red-400 mb-6 p-3 bg-red-900/20 border border-red-800/30"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section: Company Info */}
              <div>
                <p className="text-[8px] tracking-[0.4em] uppercase text-gold/60 mb-5">Company Information</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-2">{tReg.companyName} *</label>
                    <input
                      type="text" value={form.companyName} onChange={e => set("companyName", e.target.value)}
                      required
                      className="w-full bg-transparent border-b border-white/20 focus:border-gold pb-2 outline-none text-sm text-white transition-colors placeholder:text-white/20"
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-2">{tReg.contactName} *</label>
                    <input
                      type="text" value={form.contactName} onChange={e => set("contactName", e.target.value)}
                      required
                      className="w-full bg-transparent border-b border-white/20 focus:border-gold pb-2 outline-none text-sm text-white transition-colors placeholder:text-white/20"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-2">{tReg.location}</label>
                    <input
                      type="text" value={form.location} onChange={e => set("location", e.target.value)}
                      className="w-full bg-transparent border-b border-white/20 focus:border-gold pb-2 outline-none text-sm text-white transition-colors placeholder:text-white/20"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-2">{tReg.country}</label>
                    <select
                      value={form.country} onChange={e => set("country", e.target.value)}
                      className="w-full bg-transparent border-b border-white/20 focus:border-gold pb-2 outline-none text-sm text-white transition-colors"
                    >
                      {COUNTRY_OPTIONS.map(c => (
                        <option key={c} value={c} className="bg-[#0d0c0a]">{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-2">{tReg.specialty} *</label>
                    <select
                      value={form.specialty} onChange={e => set("specialty", e.target.value)}
                      required
                      className="w-full bg-transparent border-b border-white/20 focus:border-gold pb-2 outline-none text-sm text-white transition-colors"
                    >
                      <option value="" className="bg-[#0d0c0a]">Select specialty</option>
                      {SPECIALTY_OPTIONS.map(s => (
                        <option key={s} value={s} className="bg-[#0d0c0a]">{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-2">{tReg.phone}</label>
                    <input
                      type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
                      className="w-full bg-transparent border-b border-white/20 focus:border-gold pb-2 outline-none text-sm text-white transition-colors placeholder:text-white/20"
                      placeholder="+1 514 000 0000"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-2">{tReg.description}</label>
                  <textarea
                    value={form.description} onChange={e => set("description", e.target.value)}
                    rows={3}
                    className="w-full bg-transparent border border-white/10 focus:border-gold p-3 outline-none text-sm text-white transition-colors placeholder:text-white/20 resize-none"
                    placeholder="Describe your brand, craftsmanship, and values..."
                  />
                </div>

                <div className="mt-5">
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-2">{tReg.capacity}</label>
                  <input
                    type="number" value={form.annualCapacity} onChange={e => set("annualCapacity", e.target.value)}
                    min="1"
                    className="w-full bg-transparent border-b border-white/20 focus:border-gold pb-2 outline-none text-sm text-white transition-colors placeholder:text-white/20"
                    placeholder="e.g. 500"
                  />
                </div>
              </div>

              {/* Section: Portal Credentials */}
              <div>
                <p className="text-[8px] tracking-[0.4em] uppercase text-gold/60 mb-5">Portal Credentials</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-2">{tReg.email} *</label>
                    <input
                      type="email" value={form.email} onChange={e => set("email", e.target.value)}
                      required
                      className="w-full bg-transparent border-b border-white/20 focus:border-gold pb-2 outline-none text-sm text-white transition-colors placeholder:text-white/20"
                      placeholder="business@yourcompany.com"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-2">{tReg.password} *</label>
                    <input
                      type={showPass ? "text" : "password"} value={form.password}
                      onChange={e => set("password", e.target.value)} required minLength={8}
                      className="w-full bg-transparent border-b border-white/20 focus:border-gold pb-2 outline-none text-sm text-white transition-colors placeholder:text-white/20 pr-12"
                      placeholder="Min. 8 characters"
                    />
                    <button type="button" onClick={() => setShowPass(v => !v)}
                      className="absolute right-0 bottom-2 text-[9px] text-white/30 hover:text-gold transition-colors">
                      {showPass ? "Hide" : "Show"}
                    </button>
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-2">{tReg.confirmPassword} *</label>
                    <input
                      type="password" value={form.confirmPassword}
                      onChange={e => set("confirmPassword", e.target.value)} required
                      className="w-full bg-transparent border-b border-white/20 focus:border-gold pb-2 outline-none text-sm text-white transition-colors placeholder:text-white/20"
                      placeholder="Confirm password"
                    />
                  </div>
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div
                  onClick={() => set("agreeTerms", !form.agreeTerms)}
                  className={`w-4 h-4 mt-0.5 flex-shrink-0 border transition-colors ${
                    form.agreeTerms ? "bg-gold border-gold" : "border-white/20 group-hover:border-gold/50"
                  }`}
                >
                  {form.agreeTerms && (
                    <svg viewBox="0 0 16 16" fill="none" className="w-full h-full p-0.5">
                      <path d="M13 4L6 11l-3-3" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-[10px] text-white/40 leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="text-gold/70 hover:text-gold underline">Supplier Terms & Conditions</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-gold/70 hover:text-gold underline">Privacy Policy</Link>.
                  I understand my application will be reviewed before portal access is granted.
                </span>
              </label>

              <motion.button
                type="submit" disabled={loading}
                whileHover={!loading ? { scale: 1.01 } : {}}
                whileTap={!loading ? { scale: 0.99 } : {}}
                className="w-full bg-gold text-black py-4 text-[10px] tracking-[0.4em] uppercase hover:bg-white transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block w-3 h-3 border border-black/30 border-t-black rounded-full" />
                    Submitting...
                  </span>
                ) : tReg.applyNow}
              </motion.button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center">
              <Link href="/" className="text-[9px] tracking-[0.2em] uppercase text-white/30 hover:text-white/60 transition-colors">
                ← Back to Site
              </Link>
              <Link href="/supplier/login" className="text-[9px] tracking-[0.2em] uppercase text-gold/60 hover:text-gold transition-colors">
                {tReg.haveAccount} {tReg.signInLink}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
