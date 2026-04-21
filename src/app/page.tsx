"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useApp } from "@/context/AppContext";

const CATEGORIES = [
  {
    name: "La Femme",
    subtitle: "Womenswear",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop",
    count: "142 Pieces",
    href: "/shop?category=La+Femme"
  },
  {
    name: "L'Homme",
    subtitle: "Menswear",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1200&auto=format&fit=crop",
    count: "98 Pieces",
    href: "/shop?category=L%27Homme"
  },
  {
    name: "L'Enfant",
    subtitle: "Children's Couture",
    image: "https://images.unsplash.com/photo-1522771930-78848d92871d?q=80&w=1200&auto=format&fit=crop",
    count: "54 Pieces",
    href: "/shop?category=L%27Enfant"
  },
  {
    name: "L'Atelier",
    subtitle: "Accessories & Artisanal",
    image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1200&auto=format&fit=crop",
    count: "76 Pieces",
    href: "/shop?category=L%27Atelier"
  }
];

const EDITORIAL_FEATURES = [
  {
    id: "01",
    title: "The Signature Coat",
    subtitle: "La Femme Collection",
    price: "$2,400",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1200&auto=format&fit=crop",
    href: "/product/1"
  },
  {
    id: "02",
    title: "Velvet Smoking Jacket",
    subtitle: "L'Homme Collection",
    price: "$1,950",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop",
    href: "/product/7"
  },
  {
    id: "03",
    title: "Noir Evening Gown",
    subtitle: "La Femme Collection",
    price: "$4,200",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200&auto=format&fit=crop",
    href: "/product/5"
  }
];

const TICKER_ITEMS = [
  "New Arrival: Silk Charmeuse Collection",
  "Complimentary Express Shipping on All Orders",
  "Virtual Try-On — Powered by AI",
  "Spring / Summer '26 Now Live",
  "Manvié Atelier — Bespoke Appointments Available",
  "AI Personal Stylist — Available 24/7",
  "New Arrival: Heritage Cashmere Edit"
];

function HeroSection() {
  const { t } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden flex flex-col justify-center items-center">
      {/* BG image with parallax */}
      <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full relative"
        >
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2400&auto=format&fit=crop"
            alt="Manvié Hero"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/30 via-black/10 to-black" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/20 to-transparent" />

      {/* Hero content */}
      <motion.div style={{ opacity }} className="relative z-10 flex flex-col items-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-[9px] tracking-[0.6em] uppercase text-gold mb-8 font-sans"
        >
          {t.hero.eyebrow}
        </motion.div>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[clamp(5rem,14vw,16rem)] leading-[0.88] tracking-[0.05em] text-white uppercase"
          >
            Manvié
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1.0 }}
          className="w-32 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent my-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.2 }}
          className="font-sans text-[11px] tracking-[0.5em] uppercase text-white/70 max-w-md"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="flex gap-6 mt-14"
        >
          <Link href="/shop" className="group relative inline-flex items-center justify-center px-12 py-5 overflow-hidden border border-white/25 hover:border-white transition-colors duration-700 bg-transparent text-white">
            <span className="absolute inset-0 w-full h-full bg-white -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1]" />
            <span className="relative font-sans text-[10px] tracking-[0.35em] uppercase group-hover:text-black transition-colors duration-700">
              {t.hero.cta}
            </span>
          </Link>
          <Link href="/try-on" className="group relative inline-flex items-center justify-center px-12 py-5 overflow-hidden border border-gold/40 hover:border-gold transition-colors duration-700 bg-transparent text-gold">
            <span className="absolute inset-0 w-full h-full bg-gold -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1]" />
            <span className="relative font-sans text-[10px] tracking-[0.35em] uppercase group-hover:text-black transition-colors duration-700">
              Virtual Try-On
            </span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 3 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
      >
        <span className="text-[8px] tracking-[0.5em] uppercase text-white/40">{t.hero.scroll}</span>
        <div className="w-[1px] h-14 bg-white/20 overflow-hidden">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
            className="w-full h-full bg-white/80"
          />
        </div>
      </motion.div>

      {/* Corner decorations */}
      <div className="absolute top-32 left-8 text-[8px] tracking-[0.3em] text-white/30 uppercase rotate-90 origin-left">2026</div>
      <div className="absolute top-32 right-8 text-[8px] tracking-[0.3em] text-white/30 uppercase -rotate-90 origin-right">SS'26</div>
    </div>
  );
}

function TickerSection() {
  const { t } = useApp();
  const tickerItems = t.ticker;
  return (
    <div className="bg-gold py-3 overflow-hidden relative z-10">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...tickerItems, ...tickerItems].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-8 px-8">
            <span className="text-black text-[10px] tracking-[0.3em] uppercase font-medium">{item}</span>
            <span className="text-black/40 text-[8px]">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function ManifestoSection() {
  return (
    <section className="bg-black py-40 px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <p className="text-[9px] tracking-[0.5em] uppercase text-gold mb-12">La Philosophie Manvié</p>
          <p className="font-serif text-[clamp(1.8rem,4vw,4rem)] leading-[1.25] text-white/90 mb-16">
            We redefine luxury through the seamless convergence of{" "}
            <em className="text-gold not-italic">artificial intelligence</em>{" "}
            and the timeless mastery of Québécois craftsmanship, born in Montréal.
          </p>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-16" />
          <div className="grid grid-cols-3 gap-16 max-w-3xl mx-auto text-center">
            {[
              { num: "1942", label: "Founded" },
              { num: "47", label: "Master Artisans" },
              { num: "180+", label: "Countries Served" }
            ].map(({ num, label }) => (
              <div key={label}>
                <p className="font-serif text-4xl text-gold mb-2">{num}</p>
                <p className="text-[9px] tracking-[0.35em] uppercase text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CategoryGridSection() {
  return (
    <section className="bg-black pb-8 px-4 md:px-6">
      <div className="max-w-[1800px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex justify-between items-end mb-10 px-2"
        >
          <p className="text-[9px] tracking-[0.5em] uppercase text-gold">Le Catalogue</p>
          <Link href="/shop" className="text-[9px] tracking-[0.3em] uppercase text-gray-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5">
            View All →
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {CATEGORIES.map((cat, idx) => (
            <Link href={cat.href} key={cat.name}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="group relative aspect-[3/4] overflow-hidden cursor-pointer"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-[2.5s] ease-[0.16,1,0.3,1] group-hover:scale-[1.06] opacity-75 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-700 group-hover:opacity-60" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-[8px] tracking-[0.35em] text-gold uppercase mb-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-3 group-hover:translate-y-0">
                    {cat.count}
                  </p>
                  <h3 className="font-serif text-2xl md:text-3xl text-white mb-1">{cat.name}</h3>
                  <p className="text-[9px] tracking-[0.35em] text-white/50 uppercase">{cat.subtitle}</p>
                  <div className="mt-4 w-0 group-hover:w-full h-[1px] bg-gold transition-all duration-700 ease-[0.16,1,0.3,1]" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function EditorialSection() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % EDITORIAL_FEATURES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-black py-8 px-4 md:px-6">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-[85vh]">
          {/* Main featured */}
          <div className="lg:col-span-8 relative overflow-hidden group cursor-pointer">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={EDITORIAL_FEATURES[activeIdx].image}
                  alt={EDITORIAL_FEATURES[activeIdx].title}
                  fill
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
            <div className="absolute bottom-0 left-0 right-0 p-10 z-20">
              <motion.p
                key={`sub-${activeIdx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[9px] tracking-[0.4em] text-gold uppercase mb-3"
              >
                {EDITORIAL_FEATURES[activeIdx].subtitle}
              </motion.p>
              <motion.h2
                key={`title-${activeIdx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif text-4xl md:text-5xl text-white mb-4"
              >
                {EDITORIAL_FEATURES[activeIdx].title}
              </motion.h2>
              <div className="flex items-center gap-8">
                <span className="font-serif text-2xl text-white/80">{EDITORIAL_FEATURES[activeIdx].price}</span>
                <Link
                  href={EDITORIAL_FEATURES[activeIdx].href}
                  className="text-[9px] tracking-[0.3em] uppercase text-white border-b border-white/30 hover:border-gold hover:text-gold transition-colors pb-0.5"
                >
                  Shop Now →
                </Link>
              </div>
            </div>
            {/* Progress dots */}
            <div className="absolute bottom-10 right-10 flex gap-2 z-20">
              {EDITORIAL_FEATURES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={`transition-all duration-500 ${i === activeIdx ? "w-6 h-1 bg-gold" : "w-1 h-1 bg-white/30"}`}
                />
              ))}
            </div>
          </div>

          {/* Side stack */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {EDITORIAL_FEATURES.map((feat, i) => (
              <Link href={feat.href} key={feat.id}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setActiveIdx(i)}
                  className={`relative flex-1 min-h-[28vh] overflow-hidden cursor-pointer group transition-all duration-500 ${
                    i === activeIdx ? "ring-1 ring-gold/50" : ""
                  }`}
                >
                  <Image src={feat.image} alt={feat.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute bottom-4 left-5 z-10">
                    <p className="text-[8px] tracking-[0.3em] text-gold/80 uppercase mb-1">{feat.id}</p>
                    <p className="font-serif text-white text-base">{feat.title}</p>
                    <p className="text-[9px] text-white/50 tracking-widest uppercase mt-0.5">{feat.price}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AIFeaturesSection() {
  return (
    <section className="bg-[#0a0a0a] py-40 px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-gold/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gold/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-gold/8" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="text-center mb-24"
        >
          <p className="text-[9px] tracking-[0.5em] uppercase text-gold mb-6">Intelligence Couture</p>
          <h2 className="font-serif text-[clamp(2rem,5vw,5rem)] text-white leading-tight">
            Where AI Meets Artistry
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {[
            {
              num: "01",
              title: "Virtual Try-On",
              desc: "Our Neural Styling Engine maps Manvié couture directly to your physical form using generative AI.",
              href: "/try-on",
              cta: "Try Now",
              icon: "◈"
            },
            {
              num: "02",
              title: "AI Personal Stylist",
              desc: "GPT-4 powered personal styling for any occasion. Tell us where you're going, we'll dress you perfectly.",
              href: "/stylist",
              cta: "Style Me",
              icon: "✦"
            },
            {
              num: "03",
              title: "Family Atelier",
              desc: "Multiple fitting profiles for every member of your family. One session, complete household wardrobe.",
              href: "/try-on",
              cta: "Start Session",
              icon: "❋"
            }
          ].map((feat, i) => (
            <motion.div
              key={feat.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="group relative bg-[#111] border border-white/5 hover:border-gold/20 transition-all duration-700 p-12 flex flex-col hover-glow"
            >
              <div className="text-4xl text-gold/30 mb-8 group-hover:text-gold/60 transition-colors duration-500">
                {feat.icon}
              </div>
              <p className="text-[8px] tracking-[0.4em] text-gray-600 uppercase mb-4">{feat.num}</p>
              <h3 className="font-serif text-2xl text-white mb-6">{feat.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-10 flex-1">{feat.desc}</p>
              <Link
                href={feat.href}
                className="inline-flex items-center gap-3 text-[9px] tracking-[0.3em] uppercase text-gold border-b border-gold/30 hover:border-gold pb-1 transition-colors w-fit"
              >
                {feat.cta}
                <span className="transition-transform group-hover:translate-x-1 duration-300">→</span>
              </Link>
              {/* Shimmer effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-12" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandStorySection() {
  return (
    <section className="bg-black overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh]">
        {/* Image side */}
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-[60vh] lg:h-auto overflow-hidden"
        >
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop"
            alt="Manvié Atelier"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
          {/* Year stamp */}
          <div className="absolute top-12 left-12">
            <p className="text-[8px] tracking-[0.4em] text-white/50 uppercase">Est.</p>
            <p className="font-serif text-5xl text-white/30">1942</p>
          </div>
        </motion.div>

        {/* Text side */}
        <div className="flex flex-col justify-center px-12 md:px-24 py-24 bg-[#0a0a0a]">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            <p className="text-[9px] tracking-[0.5em] uppercase text-gold mb-8">Maison Story</p>
            <h2 className="font-serif text-[clamp(2.5rem,4vw,4.5rem)] text-white leading-[1.1] mb-10">
              Born in Montréal.<br />
              <span className="text-gold/70 italic">Elevated</span> by Intelligence.
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6 text-sm max-w-lg">
              Founded in 1942 by Maison Manvié, our house has spent eight decades perfecting the art of Québécois couture. In 2020, we became the first luxury house to integrate generative AI into every step of the creative process.
            </p>
            <p className="text-gray-500 leading-relaxed mb-12 text-sm max-w-lg">
              Each piece is still cut by hand in our Montréal atelier. The difference is that now, you can try it on from anywhere in the world.
            </p>
            <Link
              href="/shop"
              className="group relative inline-flex items-center gap-4 text-[10px] tracking-[0.35em] uppercase text-white"
            >
              <span className="h-[1px] w-10 bg-gold group-hover:w-16 transition-all duration-500" />
              Explore the Collection
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeaturedProductsSection() {
  const products = [
    { id: "1", name: "Signature Coat", price: "$2,400", image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop", cat: "La Femme" },
    { id: "4", name: "Leather Handbag", price: "$3,200", image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop", cat: "L'Atelier" },
    { id: "5", name: "Noir Evening Gown", price: "$4,200", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop", cat: "La Femme" },
    { id: "3", name: "Classic Blazer", price: "$1,500", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop", cat: "L'Homme" },
  ];

  return (
    <section className="bg-[#f8f7f5] py-32 px-6 md:px-10">
      <div className="max-w-[1600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-end mb-14 border-b border-gray-200 pb-8"
        >
          <div>
            <p className="text-[9px] tracking-[0.5em] text-gold uppercase mb-3">Featured Pieces</p>
            <h2 className="font-serif text-4xl md:text-5xl text-black">New Arrivals</h2>
          </div>
          <Link href="/shop" className="text-[9px] tracking-[0.3em] uppercase text-gray-400 hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5">
            View All →
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p, i) => (
            <Link href={`/product/${p.id}`} key={p.id}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-5">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-[2s] ease-[0.16,1,0.3,1] group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-700" />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    <span className="bg-white text-black text-[8px] tracking-[0.2em] uppercase px-3 py-1.5 shadow-lg">
                      Quick View
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    <span className="bg-black text-white text-[8px] tracking-[0.2em] uppercase px-3 py-1.5">
                      {p.cat}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-sans text-[10px] tracking-[0.25em] uppercase font-medium mb-1.5 group-hover:text-gold transition-colors duration-300">
                    {p.name}
                  </h3>
                  <p className="font-serif text-gray-500">{p.price}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="bg-black py-40 px-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-1/2 left-1/4 w-[500px] h-[500px] rounded-full bg-gold/[0.02] blur-3xl" />
        <div className="absolute -bottom-1/2 right-1/4 w-[600px] h-[600px] rounded-full bg-gold/[0.03] blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        >
          <p className="text-[9px] tracking-[0.5em] uppercase text-gold mb-8">Private Access</p>
          <h2 className="font-serif text-[clamp(2rem,4vw,4rem)] text-white mb-6">
            Join the Inner Circle
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-16 max-w-md mx-auto">
            Exclusive access to new collections, private sales, and invitations to Manvié events worldwide.
          </p>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                exit={{ opacity: 0, y: -20 }}
                onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                className="flex max-w-lg mx-auto gap-0"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 bg-transparent border border-white/15 border-r-0 px-6 py-4 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gold/50 transition-colors"
                />
                <button
                  type="submit"
                  className="bg-gold text-black px-8 py-4 text-[9px] tracking-[0.3em] uppercase hover:bg-white transition-colors duration-500 shrink-0 font-medium"
                >
                  Join
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center text-gold text-lg">✓</div>
                <p className="text-[10px] tracking-[0.35em] uppercase text-gold">Welcome to the Inner Circle</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="relative w-full bg-black text-white selection:bg-gold selection:text-black">
      <HeroSection />
      <TickerSection />
      <ManifestoSection />
      <CategoryGridSection />
      <EditorialSection />
      <AIFeaturesSection />
      <BrandStorySection />
      <FeaturedProductsSection />
      <NewsletterSection />
    </div>
  );
}
