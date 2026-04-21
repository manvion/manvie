"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useApp } from "@/context/AppContext";
import { useState } from "react";

export default function CartPage() {
  const { items, count, subtotal, removeItem, updateQuantity } = useCart();
  const { t } = useApp();
  const [checkingOut, setCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Checkout failed");
        setCheckingOut(false);
      }
    } catch {
      alert("Connection error. Please try again.");
      setCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a08] text-black dark:text-white pt-32 pb-24 px-4 md:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-gray-200 dark:border-white/10 pb-8">
            <div>
              <p className="text-[10px] text-gold tracking-[0.3em] uppercase mb-3">
                {count} {count === 1 ? "Item" : "Items"}
              </p>
              <h1 className="font-serif text-4xl">{t.cart.title}</h1>
            </div>
            <Link
              href="/shop"
              className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors border-b border-transparent hover:border-black dark:hover:border-white pb-1 mb-2 md:mb-0"
            >
              {t.cart.continue}
            </Link>
          </div>

          <AnimatePresence mode="popLayout">
            {items.length > 0 ? (
              <motion.div key="cart" className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                {/* Items */}
                <div className="lg:col-span-8 space-y-10">
                  {items.map((item, idx) => (
                    <motion.div
                      key={`${item.id}-${item.size}`}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      transition={{ delay: idx * 0.08, duration: 0.5 }}
                      className="flex flex-col sm:flex-row gap-8 border-b border-gray-100 dark:border-white/10 pb-10"
                    >
                      <div className="w-full sm:w-36 aspect-[3/4] bg-gray-50 dark:bg-white/5 relative overflow-hidden shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-[2s] hover:scale-110"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <p className="text-[8px] tracking-[0.3em] text-gold uppercase mb-1">{item.category ?? "Couture"}</p>
                          <h3 className="font-serif text-xl mb-2">{item.name}</h3>
                          <p className="text-[10px] tracking-[0.2em] text-gray-400 dark:text-white/40 uppercase">
                            {t.product.selectSize.replace("Select", "").trim()}: {item.size}
                          </p>
                        </div>
                        <div className="flex flex-wrap justify-between items-end gap-4 mt-6">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                              className="w-7 h-7 border border-gray-200 dark:border-white/20 flex items-center justify-center text-sm hover:border-black dark:hover:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all"
                            >
                              −
                            </button>
                            <span className="text-sm w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                              className="w-7 h-7 border border-gray-200 dark:border-white/20 flex items-center justify-center text-sm hover:border-black dark:hover:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all"
                            >
                              +
                            </button>
                          </div>
                          <div className="flex items-center gap-6">
                            <p className="font-serif text-lg">
                              ${(item.price * item.quantity).toLocaleString()}
                            </p>
                            <button
                              onClick={() => removeItem(item.id, item.size)}
                              className="text-[9px] border-b border-gray-200 dark:border-white/20 uppercase tracking-[0.2em] text-gray-400 dark:text-white/40 hover:text-red-500 hover:border-red-400 transition-colors pb-0.5"
                            >
                              {t.cart.remove}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Summary */}
                <div className="lg:col-span-4">
                  <div className="bg-white dark:bg-white/5 p-8 md:p-10 border border-gray-100 dark:border-white/10 sticky top-32">
                    <h2 className="font-serif text-2xl mb-8 border-b border-gray-100 dark:border-white/10 pb-4">Summary</h2>
                    <div className="space-y-5 mb-10 text-[11px] tracking-[0.2em] uppercase font-medium">
                      <div className="flex justify-between">
                        <span className="text-gray-400 dark:text-white/40">{t.cart.subtotal}</span>
                        <span>${subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gold">
                        <span className="text-gray-400 dark:text-white/40">{t.cart.shipping}</span>
                        <span>{t.cart.shippingFree}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 dark:border-white/10 pt-5 mt-5 text-sm">
                        <span>{t.cart.total}</span>
                        <span className="font-serif text-xl">${subtotal.toLocaleString()} CAD</span>
                      </div>
                    </div>

                    <motion.button
                      onClick={handleCheckout}
                      disabled={checkingOut}
                      whileHover={!checkingOut ? { scale: 1.01 } : {}}
                      whileTap={!checkingOut ? { scale: 0.99 } : {}}
                      className="w-full bg-black dark:bg-white text-white dark:text-black py-5 text-[11px] tracking-[0.3em] uppercase hover:bg-gold hover:text-black transition-colors duration-500 mb-5 shadow-xl disabled:opacity-60 disabled:cursor-wait relative overflow-hidden"
                    >
                      {checkingOut ? (
                        <span className="flex items-center justify-center gap-3">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                          />
                          Redirecting to Payment...
                        </span>
                      ) : (
                        t.cart.checkout
                      )}
                    </motion.button>

                    <div className="flex items-center justify-center gap-2">
                      <span className="text-gray-300 dark:text-white/20 text-xs">🔒</span>
                      <p className="text-[9px] text-center text-gray-400 dark:text-white/30 tracking-[0.2em] uppercase font-light">
                        {t.cart.secure}
                      </p>
                    </div>

                    {/* Accepted payment methods */}
                    <div className="mt-6 pt-5 border-t border-gray-100 dark:border-white/10 flex items-center justify-center gap-3 opacity-40">
                      {["VISA", "MC", "AMEX", "APPLE"].map(m => (
                        <span key={m} className="text-[8px] tracking-widest font-mono border border-current px-2 py-0.5">{m}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32"
              >
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-20 h-20 border border-dashed border-gray-200 dark:border-white/20 rounded-full mx-auto mb-8 flex items-center justify-center"
                >
                  <span className="text-gray-200 dark:text-white/20 text-3xl">∅</span>
                </motion.div>
                <p className="font-serif text-2xl text-gray-300 dark:text-white/30 mb-10">
                  {t.cart.empty}
                </p>
                <Link
                  href="/shop"
                  className="inline-block bg-black dark:bg-white text-white dark:text-black px-10 py-5 text-[11px] tracking-[0.3em] uppercase hover:bg-gold hover:text-black transition-colors duration-500 shadow-xl"
                >
                  {t.cart.continue}
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
