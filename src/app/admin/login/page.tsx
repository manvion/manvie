"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminLogin() {
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
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Invalid credentials");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: "repeating-linear-gradient(45deg, #C8A96A 0, #C8A96A 1px, transparent 0, transparent 50%)",
          backgroundSize: "20px 20px",
        }} />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Logo */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-block">
              <p className="text-[9px] tracking-[0.6em] text-gold uppercase mb-2">Manvié</p>
              <h1 className="font-serif text-3xl text-white">Atelier Admin</h1>
            </Link>
            <div className="w-12 h-[1px] bg-gold/40 mx-auto mt-4" />
          </div>

          {/* Form Card */}
          <div className="bg-[#0d0d0d] border border-white/10 p-10">
            <p className="text-[9px] tracking-[0.4em] text-gold uppercase mb-8">Secure Access</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[9px] uppercase tracking-[0.25em] text-white/40 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  className="w-full bg-transparent border-b border-white/20 focus:border-gold pb-2 outline-none text-sm text-white transition-colors placeholder:text-white/20"
                  placeholder="admin"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-[0.25em] text-white/40 mb-2">
                  Password
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
                    className="absolute right-0 bottom-2 text-[9px] text-white/30 hover:text-gold transition-colors uppercase tracking-widest"
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
                className="w-full bg-gold text-black py-4 text-[10px] tracking-[0.4em] uppercase mt-4 hover:bg-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
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
                  "Sign In"
                )}
              </motion.button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center">
              <Link
                href="/"
                className="text-[9px] tracking-[0.2em] uppercase text-white/30 hover:text-white/60 transition-colors"
              >
                ← Back to Site
              </Link>
              <p className="text-[8px] tracking-[0.2em] text-white/20 uppercase">
                Protected Portal
              </p>
            </div>
          </div>

          {/* Security note */}
          <p className="text-center text-[8px] tracking-[0.2em] text-white/20 uppercase mt-6">
            🔒 256-bit SSL · Session expires in 24h
          </p>
        </motion.div>
      </div>
    </div>
  );
}
