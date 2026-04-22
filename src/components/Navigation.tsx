"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useApp } from "@/context/AppContext";

// Images don't need translation — only text labels do
const COLLECTION_IMAGES = [
  "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522771930-78848d92871d?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop",
];

type NavCol = { category: string; label: string; subtitle: string; items: string[] };

export default function Navigation() {
  const { count } = useCart();
  const { theme, toggleTheme, lang, setLang, t } = useApp();

  // Cast the translated nav collections to a usable type
  const navCols = t.navCollections as unknown as NavCol[];

  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeMegaIdx, setActiveMegaIdx] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  const activeMega = { ...navCols[activeMegaIdx], image: COLLECTION_IMAGES[activeMegaIdx] };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openMega = () => { clearTimeout(closeTimer.current); setMegaOpen(true); };
  const closeMega = () => { closeTimer.current = setTimeout(() => setMegaOpen(false), 150); };

  const navBg = scrolled
    ? "bg-white/95 dark:bg-black/95 shadow-sm border-b border-gray-100 dark:border-white/10"
    : "bg-transparent";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 backdrop-blur-md ${navBg}`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">

          {/* Left: Collections mega trigger + Shop */}
          <div className="flex items-center gap-8">
            <button
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
              onClick={() => setMegaOpen((v) => !v)}
              className={`text-[10px] tracking-[0.3em] uppercase transition-colors duration-300 hidden md:block ${
                scrolled
                  ? "text-black dark:text-white hover:text-gold"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {t.nav.collections}
            </button>
            <Link
              href="/shop"
              className={`text-[10px] tracking-[0.3em] uppercase transition-colors duration-300 hidden md:block ${
                scrolled
                  ? "text-black dark:text-white hover:text-gold"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {t.nav.shop}
            </Link>
          </div>

          {/* Center: Wordmark */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <motion.div whileHover={{ scale: 1.02 }} className="text-center">
              <h1
                className={`font-serif tracking-[0.3em] text-xl md:text-2xl transition-colors duration-500 ${
                  scrolled ? "text-black dark:text-white" : "text-white"
                }`}
              >
                MANVIÉ
              </h1>
              <p
                className={`text-[6px] tracking-[0.5em] uppercase transition-colors duration-500 hidden md:block ${
                  scrolled ? "text-gray-400 dark:text-white/40" : "text-white/40"
                }`}
              >
                {t.brand.founded}
              </p>
            </motion.div>
          </Link>

          {/* Right: Try-On, Stylist, Lang, Theme, Cart, Mobile */}
          <div className="flex items-center gap-4 md:gap-5">
            {/* Try-On (desktop) */}
            <Link
              href="/try-on"
              className={`text-[10px] tracking-[0.3em] uppercase transition-colors duration-300 hidden md:flex items-center gap-2 ${
                scrolled
                  ? "text-black dark:text-white hover:text-gold"
                  : "text-white/80 hover:text-white"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              {t.nav.tryon}
            </Link>

            {/* AI Stylist (desktop) */}
            <Link
              href="/stylist"
              className={`text-[10px] tracking-[0.3em] uppercase transition-colors duration-300 hidden md:flex items-center gap-2 ${
                scrolled
                  ? "text-black dark:text-white hover:text-gold"
                  : "text-white/80 hover:text-white"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold/60 animate-pulse" />
              {t.nav.stylist}
            </Link>

            {/* Account (desktop) */}
            <Link
              href="/account"
              className={`text-[10px] tracking-[0.3em] uppercase transition-colors duration-300 hidden md:flex items-center gap-1.5 ${
                scrolled
                  ? "text-black dark:text-white hover:text-gold"
                  : "text-white/80 hover:text-white"
              }`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              {t.nav.account}
            </Link>

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "en" ? "fr" : "en")}
              className={`text-[9px] tracking-[0.3em] uppercase border px-2.5 py-1 transition-all duration-300 hidden md:block ${
                scrolled
                  ? "border-gray-200 dark:border-white/20 text-black dark:text-white hover:border-gold hover:text-gold"
                  : "border-white/30 text-white/70 hover:border-white hover:text-white"
              }`}
              title={t.nav.switchLang}
            >
              {t.nav.lang}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`w-8 h-8 flex items-center justify-center transition-colors duration-300 ${
                scrolled
                  ? "text-black dark:text-white hover:text-gold"
                  : "text-white/80 hover:text-white"
              }`}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                  <motion.span
                    key="sun"
                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    transition={{ duration: 0.25 }}
                    className="text-base"
                  >
                    ☀
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    transition={{ duration: 0.25 }}
                    className="text-base"
                  >
                    ☾
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className={`relative transition-colors duration-300 ${
                scrolled
                  ? "text-black dark:text-white hover:text-gold"
                  : "text-white/80 hover:text-white"
              }`}
            >
              <span className="text-[10px] tracking-[0.3em] uppercase">{t.nav.cart}</span>
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-4 w-4 h-4 bg-gold text-black text-[8px] rounded-full flex items-center justify-center font-bold"
                  >
                    {count > 9 ? "9+" : count}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className={`md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 transition-colors ${
                scrolled ? "text-black dark:text-white" : "text-white"
              }`}
              aria-label="Menu"
            >
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="w-5 h-[1.5px] bg-current block"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-5 h-[1.5px] bg-current block"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="w-5 h-[1.5px] bg-current block"
              />
            </button>
          </div>
        </div>

        {/* ── Mega Menu ── */}
        <AnimatePresence>
          {megaOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
              className="absolute top-full left-0 right-0 bg-white dark:bg-[#0d0d0b] border-b border-gray-100 dark:border-white/10 shadow-2xl"
            >
              <div className="max-w-[1600px] mx-auto px-10 py-10 grid grid-cols-5 gap-10">
                {/* Category tabs */}
                <div className="col-span-1 space-y-1 border-r border-gray-100 dark:border-white/10 pr-10">
                  {navCols.map((col, idx) => (
                    <button
                      key={col.category}
                      onMouseEnter={() => setActiveMegaIdx(idx)}
                      onClick={() => setMegaOpen(false)}
                      className={`w-full text-left px-3 py-3 text-[10px] tracking-[0.25em] uppercase transition-all duration-200 ${
                        activeMegaIdx === idx
                          ? "text-black dark:text-white bg-gray-50 dark:bg-white/5"
                          : "text-gray-400 dark:text-white/40 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      <div className="font-medium">{col.label}</div>
                      <div className="text-[8px] opacity-60 mt-0.5">{col.subtitle}</div>
                    </button>
                  ))}
                </div>

                {/* Items */}
                <div className="col-span-2 pl-4">
                  <p className="text-[8px] tracking-[0.4em] text-gold uppercase mb-5">
                    {activeMega.label}
                  </p>
                  <ul className="space-y-3">
                    {activeMega.items.map((item) => (
                      <li key={item}>
                        <Link
                          href={`/shop?category=${encodeURIComponent(activeMega.category)}&sub=${encodeURIComponent(item)}`}
                          onClick={() => setMegaOpen(false)}
                          className="text-sm text-gray-500 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors group flex items-center gap-2"
                        >
                          <span className="w-0 group-hover:w-3 h-[1px] bg-gold transition-all duration-300" />
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Editorial image */}
                <div className="col-span-2">
                  <motion.div
                    key={activeMegaIdx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-white/5"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeMega.image}
                      alt={activeMega.label}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <p className="text-[8px] tracking-[0.3em] text-gold uppercase">{activeMega.subtitle}</p>
                      <Link
                        href={`/shop?category=${encodeURIComponent(activeMega.category)}`}
                        onClick={() => setMegaOpen(false)}
                        className="text-white text-xs hover:text-gold transition-colors mt-1 block"
                      >
                        {(t.shop as unknown as Record<string, string>).shopCollection}
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-white dark:bg-black flex flex-col pt-20 px-8 pb-10 overflow-y-auto"
          >
            <div className="space-y-6 mt-6">
              {[
                { label: t.nav.collections, href: "/shop" },
                { label: t.nav.shop, href: "/shop" },
                { label: t.nav.tryon, href: "/try-on" },
                { label: t.nav.stylist, href: "/stylist" },
                { label: t.nav.account, href: "/account" },
                { label: t.nav.cart + (count > 0 ? ` (${count})` : ""), href: "/cart" },
              ].map(({ label, href }) => (
                <Link
                  key={href + label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="block font-serif text-3xl text-black dark:text-white hover:text-gold transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Mobile nav collections */}
            <div className="mt-8 border-t border-gray-100 dark:border-white/10 pt-8">
              <p className="text-[8px] tracking-[0.4em] text-gold uppercase mb-4">{t.nav.collections}</p>
              <div className="grid grid-cols-2 gap-3">
                {navCols.map((col) => (
                  <Link
                    key={col.category}
                    href={`/shop?category=${encodeURIComponent(col.category)}`}
                    onClick={() => setMobileOpen(false)}
                    className="border border-gray-100 dark:border-white/10 p-3 hover:border-gold transition-colors"
                  >
                    <p className="text-[9px] tracking-[0.2em] uppercase font-medium text-black dark:text-white">{col.label}</p>
                    <p className="text-[8px] text-gray-400 dark:text-white/40 mt-0.5">{col.subtitle}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-auto flex items-center gap-6 pt-10 border-t border-gray-100 dark:border-white/10">
              <button
                onClick={() => { setLang(lang === "en" ? "fr" : "en"); setMobileOpen(false); }}
                className="text-[10px] tracking-[0.3em] uppercase border border-gray-200 dark:border-white/20 px-4 py-2 text-black dark:text-white hover:border-gold hover:text-gold transition-colors"
              >
                {t.nav.lang}
              </button>
              <button
                onClick={toggleTheme}
                className="text-2xl text-black dark:text-white"
              >
                {theme === "dark" ? "☀" : "☾"}
              </button>
              <p className="text-[9px] tracking-[0.3em] text-gray-300 dark:text-white/30 uppercase">
                {t.brand.founded}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
