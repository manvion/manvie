"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const FOOTER_LINKS = {
  collection: [
    { label: "La Femme", href: "/shop?category=La+Femme" },
    { label: "L'Homme", href: "/shop?category=L%27Homme" },
    { label: "L'Enfant", href: "/shop?category=L%27Enfant" },
    { label: "L'Atelier", href: "/shop?category=L%27Atelier" },
    { label: "New Arrivals", href: "/shop" },
    { label: "Bestsellers", href: "/shop" },
  ],
  maison: [
    { label: "Our Story", href: "#" },
    { label: "Savoir-Faire", href: "#" },
    { label: "Sustainability", href: "#" },
    { label: "Press", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  services: [
    { label: "Virtual Try-On", href: "/try-on" },
    { label: "AI Personal Stylist", href: "/stylist" },
    { label: "Private Appointments", href: "#" },
    { label: "Gift Wrapping", href: "#" },
    { label: "Size Guide", href: "#" },
    { label: "Care Instructions", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Settings", href: "#" },
    { label: "Accessibility", href: "#" },
  ],
};

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#", icon: "IG" },
  { label: "Pinterest", href: "#", icon: "PT" },
  { label: "X / Twitter", href: "#", icon: "X" },
  { label: "YouTube", href: "#", icon: "YT" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Top divider with gold gradient */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      {/* Newsletter band */}
      <div className="border-b border-white/[0.06] py-14 px-8 md:px-16">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <p className="text-[9px] tracking-[0.5em] uppercase text-gold mb-2">Private Access</p>
            <h3 className="font-serif text-3xl text-white">Join the Inner Circle</h3>
            <p className="text-gray-600 text-sm mt-2">New collections, private sales, and invitations worldwide.</p>
          </div>

          {!subscribed ? (
            <form
              onSubmit={e => { e.preventDefault(); setSubscribed(true); }}
              className="flex w-full max-w-md"
            >
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 bg-transparent border border-white/15 border-r-0 px-5 py-3.5 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-gold/40 transition-colors"
              />
              <button
                type="submit"
                className="bg-gold text-black px-6 py-3.5 text-[9px] tracking-[0.3em] uppercase hover:bg-white transition-colors duration-400 shrink-0 font-medium"
              >
                Subscribe
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 text-[9px] tracking-[0.3em] uppercase text-gold"
            >
              <span className="w-5 h-5 rounded-full border border-gold flex items-center justify-center text-[10px]">✓</span>
              You are now part of the circle.
            </motion.div>
          )}
        </div>
      </div>

      {/* Main footer grid */}
      <div className="px-8 md:px-16 pt-20 pb-14 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 mb-20">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4">
            <Link href="/">
              <h2 className="font-serif text-4xl tracking-[0.25em] uppercase mb-6 hover:opacity-70 transition-opacity">
                Manvié
              </h2>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-xs">
              A Parisian luxury fashion house, reimagined through the lens of artificial intelligence. Est. 1942.
            </p>

            {/* Social links */}
            <div className="flex gap-4">
              {SOCIAL_LINKS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  className="w-9 h-9 border border-white/10 flex items-center justify-center text-[9px] font-mono text-gray-600 hover:border-gold/50 hover:text-gold transition-all duration-300"
                  title={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Awards / trust markers */}
            <div className="mt-10 space-y-2">
              {["Vogue Business Top 100 · 2025", "LVMH Innovation Award · 2024", "FT Best Luxury Brand · 2023"].map(a => (
                <p key={a} className="text-[8px] tracking-[0.2em] text-gray-700 uppercase">{a}</p>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="col-span-1 md:col-span-2">
            <p className="text-[8px] tracking-[0.4em] uppercase text-gold mb-6">Collection</p>
            <ul className="space-y-3">
              {FOOTER_LINKS.collection.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-gray-500 hover:text-white transition-colors text-sm">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <p className="text-[8px] tracking-[0.4em] uppercase text-gold mb-6">La Maison</p>
            <ul className="space-y-3">
              {FOOTER_LINKS.maison.map(l => (
                <li key={l.label}>
                  <a href={l.href} className="text-gray-500 hover:text-white transition-colors text-sm">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <p className="text-[8px] tracking-[0.4em] uppercase text-gold mb-6">Services</p>
            <ul className="space-y-3">
              {FOOTER_LINKS.services.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-gray-500 hover:text-white transition-colors text-sm group flex items-center gap-2">
                    {l.label}
                    {(l.href === "/try-on" || l.href === "/stylist") && (
                      <span className="text-[7px] tracking-widest text-gold/70 border border-gold/30 px-1.5 py-0.5 group-hover:border-gold/60 transition-colors">
                        AI
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div className="col-span-1 md:col-span-2">
            <p className="text-[8px] tracking-[0.4em] uppercase text-gold mb-6">Contact</p>
            <div className="space-y-4 text-sm text-gray-500">
              <div>
                <p className="text-[8px] tracking-[0.3em] uppercase text-gray-700 mb-1">Paris Flagship</p>
                <p>25 Rue du Faubourg Saint-Honoré</p>
                <p>75008 Paris, France</p>
              </div>
              <div>
                <p className="text-[8px] tracking-[0.3em] uppercase text-gray-700 mb-1">Concierge</p>
                <p className="hover:text-white transition-colors cursor-pointer">+33 1 42 68 XX XX</p>
                <p className="hover:text-white transition-colors cursor-pointer">maison@manvie.com</p>
              </div>
              <div>
                <p className="text-[8px] tracking-[0.3em] uppercase text-gray-700 mb-1">Hours</p>
                <p>Mon–Sat: 10:00–19:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] tracking-[0.3em] uppercase text-gray-700">
            © 2026 Maison Manvié. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-6 justify-center">
            {FOOTER_LINKS.legal.map(l => (
              <a key={l.label} href={l.href} className="text-[9px] tracking-[0.25em] uppercase text-gray-700 hover:text-white transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[8px] tracking-[0.2em] uppercase text-gray-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            All Systems Operational
          </div>
        </div>
      </div>

      {/* Background decorative text */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none select-none overflow-hidden">
        <p className="font-serif text-[clamp(4rem,15vw,14rem)] text-white/[0.015] leading-none uppercase tracking-[0.1em] whitespace-nowrap">
          Manvié
        </p>
      </div>
    </footer>
  );
}
