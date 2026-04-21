"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function MerchantLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/merchant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Invalid credentials");
      } else {
        router.push("/supplier");
        router.refresh();
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0c0a] flex items-center justify-center relative overflow-hidden">
      {/* Subtle gold grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#C8A96A 1px, transparent 1px), linear-gradient(90deg, #C8A96A 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-block">
              <p className="text-[9px] tracking-[0.6em] text-gold uppercase mb-2">Manvié</p>
              <h1 className="font-serif text-3xl text-white">Supplier Portal</h1>
              <p className="font-serif text-3xl text-white/30 italic text-xl">Portail Fournisseur</p>
            </Link>
            <div className="w-12 h-[1px] bg-gold/40 mx-auto mt-4" />
          </div>

          {/* Form */}
          <div className="bg-black/60 border border-white/10 backdrop-blur-xl p-10">
            <p className="text-[9px] tracking-[0.4em] text-gold/70 uppercase mb-8">Merchant Access · Accès Marchand</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[9px] uppercase tracking-[0.25em] text-white/40 mb-2">
                  Username / Nom d'utilisateur
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  className="w-full bg-transparent border-b border-white/20 focus:border-gold pb-2 outline-none text-sm text-white transition-colors placeholder:text-white/20"
                  placeholder="merchant"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-[0.25em] text-white/40 mb-2">
                  Password / Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="w-full bg-transparent border-b border-white/20 focus:border-gold pb-2 outline-none text-sm text-white transition-colors pr-12 placeholder:text-white/20"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-0 bottom-2 text-[9px] text-white/30 hover:text-gold transition-colors"
                  >
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[10px] tracking-[0.2em] text-red-400 uppercase"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.01 } : {}}
                whileTap={!loading ? { scale: 0.99 } : {}}
                className="w-full bg-gold text-black py-4 text-[10px] tracking-[0.4em] uppercase mt-4 hover:bg-white transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block w-3 h-3 border border-black/30 border-t-black rounded-full"
                    />
                    Verifying...
                  </span>
                ) : (
                  "Sign In · Se Connecter"
                )}
              </motion.button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center">
              <Link href="/" className="text-[9px] tracking-[0.2em] uppercase text-white/30 hover:text-white/60 transition-colors">
                ← Back to Site
              </Link>
              <p className="text-[8px] text-white/20 uppercase tracking-widest">Secure Portal</p>
            </div>
          </div>

          <p className="text-center text-[8px] tracking-[0.2em] text-white/20 uppercase mt-6">
            🔒 Encrypted · Session 24h
          </p>
        </motion.div>
      </div>
    </div>
  );
}
