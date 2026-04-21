"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useApp } from "@/context/AppContext";

// ─── Data ────────────────────────────────────────────────────────────────────

const OCCASIONS = [
  { id: "gala",     label: "Evening Gala",     icon: "✦", desc: "Black-tie events, charity galas, award ceremonies" },
  { id: "wedding",  label: "Wedding",           icon: "◌", desc: "Guest attire, wedding parties, civil ceremonies" },
  { id: "business", label: "Business",          icon: "⬡", desc: "Boardroom, client meetings, conferences" },
  { id: "dinner",   label: "Fine Dining",       icon: "◈", desc: "Restaurant dinners, private events, cultural evenings" },
  { id: "casual",   label: "Casual Luxe",       icon: "◇", desc: "Weekend outings, art galleries, boutique visits" },
  { id: "travel",   label: "Luxury Travel",     icon: "◎", desc: "First class, boutique hotels, private aviation" },
];

const GENDERS = [
  { id: "femme",  label: "La Femme",  icon: "👩" },
  { id: "homme",  label: "L'Homme",   icon: "👨" },
  { id: "enfant", label: "L'Enfant",  icon: "🧒" },
];

const STYLES = [
  "Minimalist",
  "Classic & Timeless",
  "Avant-Garde",
  "Romantic",
  "Power Dressing",
  "Eclectic",
];

const BUDGETS = [
  { label: "Ultimate Luxury",  range: "No limit",          min: 0    },
  { label: "$5,000 – $15,000", range: "$5k – $15k",        min: 5000  },
  { label: "$2,000 – $5,000",  range: "$2k – $5k",         min: 2000  },
  { label: "$500 – $2,000",    range: "$500 – $2k",        min: 500   },
];

// Curated static ensembles per occasion + gender (for instant, no-API recommendations)
const ENSEMBLES: Record<string, Record<string, { explanation: string; outfit: { type: string; name: string; price: string; productId: string; img: string }[] }>> = {
  gala: {
    femme: {
      explanation: "An evening gala calls for supreme drama. We have curated a head-to-toe Manvié ensemble that commands every room — from the sweeping silk of our Noir Evening Gown to jewellery that catches the candlelight.",
      outfit: [
        { type: "Gown",      name: "Noir Evening Gown",        price: "$4,200", productId: "5",  img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600&auto=format&fit=crop" },
        { type: "Outer",     name: "Signature Cashmere Coat",  price: "$2,400", productId: "1",  img: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600&auto=format&fit=crop" },
        { type: "Jewellery", name: "18k Gold Chain Necklace",  price: "$850",   productId: "8",  img: "https://images.unsplash.com/photo-1515562141589-67f0d727b750?q=80&w=600&auto=format&fit=crop" },
        { type: "Bag",       name: "Italian Leather Handbag",  price: "$3,200", productId: "4",  img: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop" },
      ],
    },
    homme: {
      explanation: "A black-tie gala demands the complete Manvié formal statement. The Velvet Smoking Jacket draped over our Tailored Suit signals an effortless mastery of dress codes that cannot be bought — only earned.",
      outfit: [
        { type: "Jacket",    name: "Velvet Smoking Jacket",    price: "$1,950", productId: "7",  img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop" },
        { type: "Suit",      name: "Tailored Suit",            price: "$3,400", productId: "14", img: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=600&auto=format&fit=crop" },
        { type: "Belt",      name: "Suede Belt",               price: "$490",   productId: "22", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop" },
      ],
    },
    enfant: {
      explanation: "Even the youngest Manvié guest deserves an extraordinary entrance. The Silk Party Dress with its bespoke finishing makes every child the most memorable presence at any formal table.",
      outfit: [
        { type: "Dress",     name: "Silk Party Dress",         price: "$580",   productId: "17", img: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=600&auto=format&fit=crop" },
        { type: "Outer",     name: "Petit Wool Pea Coat",      price: "$890",   productId: "10", img: "https://images.unsplash.com/photo-1522771930-78848d92871d?q=80&w=600&auto=format&fit=crop" },
      ],
    },
  },
  wedding: {
    femme: {
      explanation: "Attending a wedding as a Manvié guest means walking a refined line — luminous without eclipsing, joyful without compromise. The Atelier Silk Dress with a delicate Silk Scarf achieves exactly this.",
      outfit: [
        { type: "Dress",     name: "Atelier Silk Dress",       price: "$1,850", productId: "2",  img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop" },
        { type: "Scarf",     name: "Signature Silk Scarf",     price: "$420",   productId: "19", img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=600&auto=format&fit=crop" },
        { type: "Jewellery", name: "Diamond Stud Earrings",    price: "$2,200", productId: "21", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop" },
        { type: "Bag",       name: "Italian Leather Handbag",  price: "$3,200", productId: "4",  img: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop" },
      ],
    },
    homme: {
      explanation: "The Manvié Classic Wool Blazer is the definitive wedding guest choice — precise in silhouette, relaxed in spirit. Paired with a curated accessory set for effortless elegance.",
      outfit: [
        { type: "Blazer",    name: "Classic Wool Blazer",      price: "$1,500", productId: "3",  img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop" },
        { type: "Belt",      name: "Suede Belt",               price: "$490",   productId: "22", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop" },
        { type: "Scarf",     name: "Signature Silk Scarf",     price: "$420",   productId: "19", img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=600&auto=format&fit=crop" },
      ],
    },
    enfant: {
      explanation: "A miniature Manvié occasion look, crafted with the same care as our adult couture. The Silk Party Dress ensures your child is impeccably dressed for any celebration.",
      outfit: [
        { type: "Dress",     name: "Silk Party Dress",         price: "$580",   productId: "17", img: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=600&auto=format&fit=crop" },
        { type: "Wrap",      name: "Miniature Cashmere Wrap",  price: "$650",   productId: "9",  img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop" },
      ],
    },
  },
  business: {
    femme: {
      explanation: "Power is worn, not claimed. The Manvié High-Waist silhouette with the Signature Coat projects authority without sacrificing elegance — perfect for the boardroom or a high-stakes client conversation.",
      outfit: [
        { type: "Outer",     name: "Signature Cashmere Coat",  price: "$2,400", productId: "1",  img: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600&auto=format&fit=crop" },
        { type: "Blouse",    name: "Organza Blouse",           price: "$890",   productId: "12", img: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=600&auto=format&fit=crop" },
        { type: "Bag",       name: "Italian Leather Handbag",  price: "$3,200", productId: "4",  img: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop" },
      ],
    },
    homme: {
      explanation: "The Manvié Tailored Suit is built for presence. Its architectural cut in Italian virgin wool signals quiet dominance — the garment of choice for those who understand that true luxury speaks softly.",
      outfit: [
        { type: "Suit",      name: "Tailored Suit",            price: "$3,400", productId: "14", img: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=600&auto=format&fit=crop" },
        { type: "Belt",      name: "Suede Belt",               price: "$490",   productId: "22", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop" },
      ],
    },
    enfant: {
      explanation: "For little ones attending school events, presentations, or formal family occasions — the Velvet Pageboy Suit is precise, composed, and unmistakably Manvié.",
      outfit: [
        { type: "Coat",      name: "Petit Wool Pea Coat",      price: "$890",   productId: "10", img: "https://images.unsplash.com/photo-1522771930-78848d92871d?q=80&w=600&auto=format&fit=crop" },
      ],
    },
  },
  dinner: {
    femme: {
      explanation: "Fine dining at a private club or Michelin-starred restaurant demands the Ivory Wrap Dress — understated from the first glance, revelatory in its detail. The Gold Chain Necklace completes the statement.",
      outfit: [
        { type: "Dress",     name: "Ivory Wrap Dress",         price: "$1,650", productId: "11", img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=600&auto=format&fit=crop" },
        { type: "Jewellery", name: "18k Gold Chain Necklace",  price: "$850",   productId: "8",  img: "https://images.unsplash.com/photo-1515562141589-67f0d727b750?q=80&w=600&auto=format&fit=crop" },
        { type: "Scarf",     name: "Signature Silk Scarf",     price: "$420",   productId: "19", img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=600&auto=format&fit=crop" },
      ],
    },
    homme: {
      explanation: "The Velvet Smoking Jacket over a Cashmere Turtleneck — a combination that suggests both artistic sensibility and personal wealth. Ideal for table eighteen at any great restaurant.",
      outfit: [
        { type: "Jacket",    name: "Velvet Smoking Jacket",    price: "$1,950", productId: "7",  img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop" },
        { type: "Turtleneck",name: "Cashmere Turtleneck",      price: "$650",   productId: "15", img: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=600&auto=format&fit=crop" },
        { type: "Belt",      name: "Suede Belt",               price: "$490",   productId: "22", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop" },
      ],
    },
    enfant: {
      explanation: "An elegant dinner with children calls for refined ease. The Cashmere Wrap is comfortable enough for a long evening yet polished enough for the finest tables.",
      outfit: [
        { type: "Wrap",      name: "Miniature Cashmere Wrap",  price: "$650",   productId: "9",  img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop" },
      ],
    },
  },
  casual: {
    femme: {
      explanation: "Casual luxury is the most nuanced dress code of all — effortless, yet deliberate. The Organza Blouse with the Silk Scarf and Handbag creates the kind of studied ease that only true Manvié devotees understand.",
      outfit: [
        { type: "Blouse",    name: "Organza Blouse",           price: "$890",   productId: "12", img: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=600&auto=format&fit=crop" },
        { type: "Scarf",     name: "Signature Silk Scarf",     price: "$420",   productId: "19", img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=600&auto=format&fit=crop" },
        { type: "Bag",       name: "Italian Leather Handbag",  price: "$3,200", productId: "4",  img: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop" },
      ],
    },
    homme: {
      explanation: "Weekend luxury should feel like your best self on an easy day. The Cashmere Turtleneck with the Heritage Trench Coat achieves exactly that — warm, precise, effortlessly authoritative.",
      outfit: [
        { type: "Turtleneck",name: "Cashmere Turtleneck",      price: "$650",   productId: "15", img: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=600&auto=format&fit=crop" },
        { type: "Outer",     name: "Heritage Trench Coat",     price: "$2,800", productId: "6",  img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop" },
        { type: "Belt",      name: "Suede Belt",               price: "$490",   productId: "22", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop" },
      ],
    },
    enfant: {
      explanation: "Everyday luxury for the young Manvié client — the Cashmere Wrap keeps the day comfortable without sacrificing the impeccable Manvié standard.",
      outfit: [
        { type: "Wrap",      name: "Miniature Cashmere Wrap",  price: "$650",   productId: "9",  img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop" },
        { type: "Coat",      name: "Petit Wool Pea Coat",      price: "$890",   productId: "10", img: "https://images.unsplash.com/photo-1522771930-78848d92871d?q=80&w=600&auto=format&fit=crop" },
      ],
    },
  },
  travel: {
    femme: {
      explanation: "First-class travel is part of the experience. The Signature Cashmere Coat ensures you arrive looking precisely as you left — composed, luxurious, and exactly yourself. The Silk Scarf is your in-flight companion.",
      outfit: [
        { type: "Outer",     name: "Signature Cashmere Coat",  price: "$2,400", productId: "1",  img: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600&auto=format&fit=crop" },
        { type: "Scarf",     name: "Signature Silk Scarf",     price: "$420",   productId: "19", img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=600&auto=format&fit=crop" },
        { type: "Bag",       name: "Italian Leather Handbag",  price: "$3,200", productId: "4",  img: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop" },
      ],
    },
    homme: {
      explanation: "The Merino Wool Coat is engineered for long-haul luxury — wrinkle-resistant, temperature-regulating, and unmistakably Manvié. The Cashmere Turtleneck beneath ensures arrival-ready composure.",
      outfit: [
        { type: "Outer",     name: "Merino Wool Coat",         price: "$2,100", productId: "16", img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=600&auto=format&fit=crop" },
        { type: "Turtleneck",name: "Cashmere Turtleneck",      price: "$650",   productId: "15", img: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=600&auto=format&fit=crop" },
        { type: "Scarf",     name: "Signature Silk Scarf",     price: "$420",   productId: "19", img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=600&auto=format&fit=crop" },
      ],
    },
    enfant: {
      explanation: "Young travellers deserve the same luxury as their parents. The Petit Pea Coat and Cashmere Wrap make the journey as refined as the destination.",
      outfit: [
        { type: "Coat",      name: "Petit Wool Pea Coat",      price: "$890",   productId: "10", img: "https://images.unsplash.com/photo-1522771930-78848d92871d?q=80&w=600&auto=format&fit=crop" },
        { type: "Wrap",      name: "Miniature Cashmere Wrap",  price: "$650",   productId: "9",  img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop" },
      ],
    },
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function AIStylistPage() {
  const { t, lang } = useApp();
  const { addItem } = useCart();

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<typeof ENSEMBLES["gala"]["femme"] | null>(null);
  const [aiText, setAiText] = useState("");
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const [occasion, setOccasion] = useState("");
  const [gender, setGender] = useState("");
  const [style, setStyle] = useState("");
  const [budget, setBudget] = useState(BUDGETS[0]);

  const canGenerate = occasion && gender;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setLoading(true);
    setResult(null);
    setAiText("");
    setAddedIds(new Set());

    // Use static ensembles for instant results (no API latency)
    await new Promise(r => setTimeout(r, 1200)); // brief cinematic pause

    const ensemble = ENSEMBLES[occasion]?.[gender];
    if (ensemble) {
      setResult(ensemble);
      // Optionally enrich with AI text
      try {
        const res = await fetch("/api/stylist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ occasion, gender, style, budget: budget.label }),
        });
        const data = await res.json();
        if (data.explanation) setAiText(data.explanation);
      } catch { /* use static explanation */ }
    }

    setLoading(false);
    setStep(2);
  };

  const addAllToCart = () => {
    if (!result) return;
    result.outfit.forEach(item => {
      addItem({
        id: item.productId,
        name: item.name,
        price: parseInt(item.price.replace(/[$,]/g, "")),
        size: "M",
        image: item.img,
        category: item.type,
      });
      setAddedIds(prev => new Set([...prev, item.productId]));
    });
  };

  const totalOutfitPrice = result
    ? result.outfit.reduce((sum, item) => sum + parseInt(item.price.replace(/[$,]/g, "")), 0)
    : 0;

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* ── Header ── */}
      <div className="pt-36 pb-0 px-8 max-w-[1200px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="text-[9px] tracking-[0.6em] uppercase text-gold mb-4">Intelligence Couture</p>
          <h1 className="font-serif text-6xl md:text-7xl text-white mb-4">
            {lang === "fr" ? "Styliste IA" : "AI Stylist"}
          </h1>
          <p className="text-gray-500 text-sm tracking-[0.2em] font-light max-w-md mx-auto">
            {lang === "fr"
              ? "Votre conseil de mode personnel, propulsé par l'intelligence artificielle."
              : "Your personal luxury stylist, powered by artificial intelligence."}
          </p>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-8" />
        </motion.div>
      </div>

      <AnimatePresence mode="wait">

        {/* ── Step 1: Selection ── */}
        {step === 1 && !loading && (
          <motion.div
            key="step1"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
            className="px-8 max-w-[1200px] mx-auto pb-32"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Occasion */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <p className="text-[9px] tracking-[0.4em] uppercase text-gray-500 mb-5">
                    01 — {lang === "fr" ? "Occasion" : "Occasion"}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {OCCASIONS.map(occ => (
                      <motion.button
                        key={occ.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setOccasion(occ.id)}
                        className={`p-5 border text-left transition-all duration-300 relative overflow-hidden group ${
                          occasion === occ.id
                            ? "border-gold bg-gold/5 text-white"
                            : "border-white/[0.06] bg-white/[0.02] text-gray-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        <div className={`text-2xl mb-3 transition-colors ${occasion === occ.id ? "text-gold" : "text-gray-600 group-hover:text-gray-400"}`}>
                          {occ.icon}
                        </div>
                        <p className="text-[10px] tracking-[0.2em] uppercase font-medium mb-1">{occ.label}</p>
                        <p className="text-[8px] text-gray-600 leading-relaxed">{occ.desc}</p>
                        {occasion === occ.id && (
                          <motion.div layoutId="occasionSel" className="absolute inset-0 border-2 border-gold pointer-events-none" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <p className="text-[9px] tracking-[0.4em] uppercase text-gray-500 mb-5">
                    02 — {lang === "fr" ? "Profil" : "Profile"}
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {GENDERS.map(g => (
                      <button
                        key={g.id}
                        onClick={() => setGender(g.id)}
                        className={`py-5 border transition-all duration-300 text-center ${
                          gender === g.id
                            ? "border-gold bg-gold/5 text-white"
                            : "border-white/[0.06] bg-white/[0.02] text-gray-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        <div className="text-3xl mb-2">{g.icon}</div>
                        <p className="text-[9px] tracking-[0.2em] uppercase font-medium">{g.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style preference */}
                <div>
                  <p className="text-[9px] tracking-[0.4em] uppercase text-gray-500 mb-5">
                    03 — {lang === "fr" ? "Préférence de style (optionnel)" : "Style preference (optional)"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {STYLES.map(s => (
                      <button
                        key={s}
                        onClick={() => setStyle(style === s ? "" : s)}
                        className={`px-4 py-2 text-[9px] tracking-[0.2em] uppercase border transition-all duration-200 ${
                          style === s
                            ? "border-gold text-gold bg-gold/5"
                            : "border-white/10 text-gray-500 hover:border-white/30 hover:text-white"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Budget + CTA sidebar */}
              <div className="space-y-6">
                <div>
                  <p className="text-[9px] tracking-[0.4em] uppercase text-gray-500 mb-5">
                    04 — {lang === "fr" ? "Budget" : "Budget"}
                  </p>
                  <div className="space-y-2">
                    {BUDGETS.map(b => (
                      <button
                        key={b.label}
                        onClick={() => setBudget(b)}
                        className={`w-full p-4 text-left border transition-all duration-200 flex justify-between items-center ${
                          budget.label === b.label
                            ? "border-gold bg-gold/5 text-white"
                            : "border-white/[0.06] text-gray-500 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        <span className="text-[10px] tracking-[0.15em] uppercase">{b.label}</span>
                        {budget.label === b.label && <span className="text-gold text-xs">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary & CTA */}
                <div className="border border-white/[0.06] bg-white/[0.02] p-6 space-y-4">
                  {occasion && (
                    <div className="flex items-center gap-3">
                      <span className="text-gold text-lg">{OCCASIONS.find(o => o.id === occasion)?.icon}</span>
                      <div>
                        <p className="text-[8px] tracking-[0.3em] uppercase text-gray-600">Occasion</p>
                        <p className="text-[11px] text-white tracking-wide">{OCCASIONS.find(o => o.id === occasion)?.label}</p>
                      </div>
                    </div>
                  )}
                  {gender && (
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{GENDERS.find(g => g.id === gender)?.icon}</span>
                      <div>
                        <p className="text-[8px] tracking-[0.3em] uppercase text-gray-600">Profile</p>
                        <p className="text-[11px] text-white tracking-wide">{GENDERS.find(g => g.id === gender)?.label}</p>
                      </div>
                    </div>
                  )}
                  {style && (
                    <div className="flex items-center gap-3">
                      <span className="text-gold text-lg">◈</span>
                      <div>
                        <p className="text-[8px] tracking-[0.3em] uppercase text-gray-600">Style</p>
                        <p className="text-[11px] text-white tracking-wide">{style}</p>
                      </div>
                    </div>
                  )}
                </div>

                <motion.button
                  whileHover={canGenerate ? { scale: 1.01 } : {}}
                  whileTap={canGenerate ? { scale: 0.99 } : {}}
                  onClick={handleGenerate}
                  disabled={!canGenerate}
                  className="w-full py-6 text-[10px] tracking-[0.4em] uppercase transition-all duration-500 disabled:opacity-20 disabled:cursor-not-allowed bg-white text-black hover:bg-gold relative overflow-hidden group"
                >
                  <span className="relative z-10">{lang === "fr" ? "Créer Mon Ensemble" : "Create My Ensemble"}</span>
                  <motion.div className="absolute inset-0 bg-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.button>

                {!canGenerate && (
                  <p className="text-[8px] text-gray-600 tracking-[0.2em] uppercase text-center">
                    Select an occasion and profile to continue
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-40"
          >
            <div className="relative w-32 h-32 mb-10">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border border-gold/30 rounded-full" />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} className="absolute inset-4 border border-white/10 rounded-full" />
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute inset-8 border-t-2 border-gold rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[7px] tracking-[0.4em] text-gold uppercase">AI</span>
              </div>
            </div>
            <p className="font-serif text-3xl mb-3">Curating Your Look</p>
            <p className="text-[9px] tracking-[0.4em] uppercase text-gray-600">Consulting the Manvié Archive...</p>
          </motion.div>
        )}

        {/* ── Step 2: Results ── */}
        {step === 2 && result && !loading && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="px-8 max-w-[1200px] mx-auto pb-32"
          >
            {/* Result header */}
            <div className="text-center mb-14">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-12 h-12 border-2 border-gold rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-gold text-lg">✦</span>
              </motion.div>
              <p className="text-[9px] tracking-[0.5em] text-gold uppercase mb-3">The Curated Ensemble</p>
              <h2 className="font-serif text-4xl md:text-5xl mb-2">{OCCASIONS.find(o => o.id === occasion)?.label}</h2>
              <p className="text-[10px] tracking-[0.3em] text-gray-500 uppercase">
                {GENDERS.find(g => g.id === gender)?.label} · {budget.label} · {style || "All Styles"}
              </p>
            </div>

            {/* Stylist note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="border border-gold/20 bg-gold/[0.03] p-10 mb-14 text-center max-w-3xl mx-auto"
            >
              <p className="text-[8px] tracking-[0.4em] text-gold uppercase mb-4">Atelier Note</p>
              <p className="font-serif text-lg leading-relaxed text-gray-300">
                &ldquo;{aiText || result.explanation}&rdquo;
              </p>
            </motion.div>

            {/* Outfit items */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${result.outfit.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-5 mb-10`}>
              {result.outfit.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                  className="group border border-white/[0.06] bg-[#0f0f0f] overflow-hidden hover:border-gold/30 transition-colors duration-500"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#0a0a0a]">
                    <Image
                      src={item.img}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-[2s] group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-[7px] tracking-[0.3em] text-gold uppercase px-3 py-1.5">
                      {item.type}
                    </div>
                    {addedIds.has(item.productId) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-3 w-6 h-6 bg-gold rounded-full flex items-center justify-center text-black text-[10px] font-bold"
                      >
                        ✓
                      </motion.div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="font-serif text-base text-white mb-1 leading-tight">{item.name}</p>
                    <p className="font-sans text-gold text-sm mb-4">{item.price}</p>
                    <div className="flex gap-2">
                      <Link
                        href={`/product/${item.productId}`}
                        className="flex-1 border border-white/10 py-2 text-[8px] tracking-[0.2em] uppercase text-gray-400 text-center hover:border-white/30 hover:text-white transition-colors"
                      >
                        View →
                      </Link>
                      <Link
                        href={`/try-on?product=${item.productId}`}
                        className="px-3 border border-gold/30 py-2 text-[8px] tracking-[0.2em] uppercase text-gold text-center hover:bg-gold hover:text-black transition-colors"
                      >
                        Try
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Total + actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
              className="border border-white/[0.06] bg-[#0f0f0f] p-8 flex flex-col md:flex-row justify-between items-center gap-6"
            >
              <div>
                <p className="text-[8px] tracking-[0.3em] uppercase text-gray-600 mb-1">Total Ensemble Value</p>
                <p className="font-serif text-3xl text-white">${totalOutfitPrice.toLocaleString()} <span className="text-sm text-gray-500 font-sans">CAD</span></p>
              </div>
              <div className="flex gap-4 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addAllToCart}
                  className="bg-gold text-black px-10 py-4 text-[10px] tracking-[0.3em] uppercase hover:bg-white transition-colors"
                >
                  {lang === "fr" ? "Ajouter au Sac" : "Add Look to Bag"}
                </motion.button>
                <button
                  onClick={() => { setStep(1); setResult(null); setAiText(""); }}
                  className="border border-white/10 text-gray-400 px-10 py-4 text-[10px] tracking-[0.3em] uppercase hover:border-white/30 hover:text-white transition-colors"
                >
                  {lang === "fr" ? "Recommencer" : "New Consultation"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
