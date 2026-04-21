"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

function SuccessContent() {
  const params = useSearchParams();
  const isDemo = params.get("demo") === "1";
  const sessionId = params.get("session_id");
  const total = params.get("total");

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Clear cart after successful payment
    try { localStorage.removeItem("manvie-cart"); } catch { /* ignore */ }
    setVisible(true);
  }, []);

  const orderRef = isDemo
    ? "DEMO-" + Math.random().toString(36).slice(2, 8).toUpperCase()
    : sessionId?.slice(-8).toUpperCase() ?? "MV-" + Date.now().toString(36).slice(-6).toUpperCase();

  return (
    <div className="min-h-screen bg-[#faf9f7] dark:bg-[#0a0a08] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg text-center"
      >
        {/* Gold ring animation */}
        <div className="relative w-24 h-24 mx-auto mb-10">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={visible ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute inset-0 border-2 border-gold rounded-full"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={visible ? { scale: [0, 1.3, 1] } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute inset-3 bg-gold/10 rounded-full flex items-center justify-center"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={visible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="text-gold text-3xl"
            >
              ✓
            </motion.span>
          </motion.div>
          {/* Pulse ring */}
          <motion.div
            animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
            className="absolute inset-0 border border-gold/30 rounded-full"
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-[9px] tracking-[0.6em] text-gold uppercase mb-3"
        >
          Order Confirmed · Commande Confirmée
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="font-serif text-4xl md:text-5xl text-black dark:text-white mb-3"
        >
          Merci
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ delay: 0.9 }}
          className="font-serif text-xl text-gray-400 dark:text-white/40 italic mb-10"
        >
          Thank you for your order
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.0 }}
          className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-8 mb-10 text-left space-y-4"
        >
          <div className="flex justify-between items-center">
            <span className="text-[9px] tracking-[0.3em] text-gray-400 uppercase">Order Reference</span>
            <span className="font-mono text-sm font-medium text-black dark:text-white">{orderRef}</span>
          </div>
          {total && (
            <div className="flex justify-between items-center">
              <span className="text-[9px] tracking-[0.3em] text-gray-400 uppercase">Total</span>
              <span className="font-serif text-lg text-black dark:text-white">
                ${Number(total).toLocaleString("en-CA", { minimumFractionDigits: 2 })} CAD
              </span>
            </div>
          )}
          <div className="flex justify-between items-center border-t border-gray-100 dark:border-white/10 pt-4">
            <span className="text-[9px] tracking-[0.3em] text-gray-400 uppercase">Fulfillment</span>
            <span className="text-[10px] text-gold">White-Glove Delivery · 5–10 Business Days</span>
          </div>
          {isDemo && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 p-3 mt-2">
              <p className="text-[9px] text-amber-700 dark:text-amber-400 tracking-widest uppercase">
                Demo mode — Add your Stripe key to process real payments
              </p>
            </div>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ delay: 1.1 }}
          className="text-sm text-gray-400 dark:text-white/40 leading-relaxed mb-10"
        >
          A confirmation email has been sent. Your order is being prepared by our Montréal atelier.
          <br />
          <span className="italic text-xs">Un courriel de confirmation a été envoyé.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/shop"
            className="bg-black dark:bg-white text-white dark:text-black px-10 py-4 text-[10px] tracking-[0.35em] uppercase hover:bg-gold hover:text-black transition-colors duration-300"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="border border-gray-200 dark:border-white/20 text-gray-500 dark:text-white/50 px-10 py-4 text-[10px] tracking-[0.35em] uppercase hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-colors"
          >
            Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
