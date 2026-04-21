"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/context/AppContext";

type Tab = "signin" | "register";

function AccountPageInner() {
  const { t } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [tab, setTab] = useState<Tab>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState<{ email?: string; id: string } | null>(null);

  const tAccount = t.account as Record<string, string>;

  // Check current session
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser({ id: data.user.id, email: data.user.email });
    });
  }, []);

  // Show error from URL (e.g. OAuth failure)
  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError) setError(decodeURIComponent(urlError));
  }, [searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError(authError.message === "Invalid login credentials"
        ? "Invalid email or password."
        : authError.message);
    } else {
      router.push("/account/dashboard");
      router.refresh();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setLoading(false);
    if (authError) {
      if (authError.message.toLowerCase().includes("already")) {
        setError("An account with this email already exists.");
      } else {
        setError(authError.message);
      }
    } else {
      setSuccess("Account created! Check your email to verify your address.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFullName("");
    }
  };

  const handleGoogleOAuth = async () => {
    setGoogleLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  // If already logged in, show the dashboard card
  if (user) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-black dark:text-white pt-32 pb-24 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="text-center mb-16 border-b border-gray-200 dark:border-white/10 pb-12">
              <p className="text-[9px] tracking-[0.5em] uppercase text-gold mb-4">Welcome Back</p>
              <h1 className="font-serif text-4xl mb-3">{tAccount.myAccount}</h1>
              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">{user.email}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/account/dashboard" className="group block bg-black text-white p-10 hover:bg-gold transition-colors duration-500">
                <p className="text-[9px] tracking-[0.4em] uppercase text-gold group-hover:text-black transition-colors mb-6">Client Dashboard</p>
                <h2 className="font-serif text-2xl mb-3">{tAccount.wardrobe}</h2>
                <p className="text-[11px] text-gray-400 group-hover:text-black/70 leading-relaxed transition-colors">
                  {tAccount.wardrobeDesc}
                </p>
                <p className="mt-8 text-[10px] tracking-[0.2em] uppercase text-gold group-hover:text-black transition-colors">{tAccount.viewDashboard}</p>
              </Link>

              <div className="border border-gray-200 dark:border-white/10 p-10 flex flex-col justify-between">
                <div>
                  <p className="text-[9px] tracking-[0.4em] uppercase text-gray-400 mb-6">{tAccount.internalPortals}</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed mb-8">{tAccount.restrictedAccess}</p>
                  <div className="flex flex-col gap-3">
                    <Link href="/admin" className="block p-3 text-center text-[9px] uppercase tracking-[0.2em] border border-gray-100 dark:border-white/10 hover:border-black dark:hover:border-white transition-colors">
                      Maison Administration
                    </Link>
                    <Link href="/supplier" className="block p-3 text-center text-[9px] uppercase tracking-[0.2em] border border-gray-100 dark:border-white/10 hover:border-black dark:hover:border-white transition-colors">
                      Partner Marketplace
                    </Link>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="mt-8 w-full py-3 text-[9px] uppercase tracking-[0.3em] text-gray-400 hover:text-red-500 border border-gray-100 dark:border-white/10 hover:border-red-500 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-black dark:text-white pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="text-center mb-16 border-b border-gray-200 dark:border-white/10 pb-12">
            <p className="text-[9px] tracking-[0.5em] uppercase text-gold mb-4">Client Access</p>
            <h1 className="font-serif text-4xl mb-3">{tAccount.myAccount}</h1>
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">Your personal Manvié universe</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
            {/* Auth Form */}
            <div className="bg-white dark:bg-white/5 p-8 md:p-10 border border-gray-100 dark:border-white/10 shadow-sm">
              {/* Tabs */}
              <div className="flex border-b border-gray-100 dark:border-white/10 mb-8">
                {(["signin", "register"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTab(t); setError(""); setSuccess(""); }}
                    className={`flex-1 pb-3 text-[10px] uppercase tracking-[0.25em] transition-colors ${
                      tab === t
                        ? "text-black dark:text-white border-b-2 border-black dark:border-white -mb-px"
                        : "text-gray-400 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    {t === "signin" ? tAccount.signIn : tAccount.register}
                  </button>
                ))}
              </div>

              {/* Google OAuth */}
              <button
                onClick={handleGoogleOAuth}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-white/20 py-3.5 mb-6 hover:border-black dark:hover:border-white transition-colors text-[10px] uppercase tracking-[0.2em] disabled:opacity-50"
              >
                {googleLoading ? (
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border border-gray-300 border-t-black rounded-full inline-block" />
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                {tAccount.signInWithGoogle}
              </button>

              <div className="relative flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-gray-100 dark:bg-white/10" />
                <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400">{tAccount.orContinueWith}</span>
                <div className="flex-1 h-px bg-gray-100 dark:bg-white/10" />
              </div>

              {/* Error / Success */}
              <AnimatePresence>
                {error && (
                  <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-[10px] tracking-[0.15em] text-red-500 mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30">
                    {error}
                  </motion.p>
                )}
                {success && (
                  <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-[10px] tracking-[0.15em] text-emerald-600 mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30">
                    {success}
                  </motion.p>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {tab === "signin" ? (
                  <motion.form key="signin" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                    onSubmit={handleSignIn} className="space-y-5">
                    <div>
                      <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-2">{tAccount.email}</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                        className="w-full bg-transparent border-b border-gray-200 dark:border-white/20 py-3 focus:outline-none focus:border-black dark:focus:border-white transition-colors text-sm" />
                    </div>
                    <div className="relative">
                      <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-2">{tAccount.password}</label>
                      <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                        className="w-full bg-transparent border-b border-gray-200 dark:border-white/20 py-3 focus:outline-none focus:border-black dark:focus:border-white transition-colors text-sm pr-12" />
                      <button type="button" onClick={() => setShowPass(v => !v)}
                        className="absolute right-0 bottom-3 text-[9px] text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                        {showPass ? "Hide" : "Show"}
                      </button>
                    </div>
                    <div className="flex justify-end">
                      <button type="button" className="text-[9px] uppercase tracking-[0.15em] text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                        {tAccount.forgotPassword}
                      </button>
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full bg-black dark:bg-white text-white dark:text-black py-4 text-[10px] tracking-[0.3em] uppercase hover:bg-gold hover:text-black transition-colors duration-500 shadow-lg disabled:opacity-50 mt-2">
                      {loading ? "Signing in..." : tAccount.signIn}
                    </button>
                    <p className="text-center text-[9px] text-gray-400">
                      {tAccount.noAccount}{" "}
                      <button type="button" onClick={() => setTab("register")} className="text-black dark:text-white underline">
                        {tAccount.register}
                      </button>
                    </p>
                  </motion.form>
                ) : (
                  <motion.form key="register" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                    onSubmit={handleRegister} className="space-y-5">
                    <div>
                      <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-2">{tAccount.fullName}</label>
                      <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required
                        className="w-full bg-transparent border-b border-gray-200 dark:border-white/20 py-3 focus:outline-none focus:border-black dark:focus:border-white transition-colors text-sm" />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-2">{tAccount.email}</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                        className="w-full bg-transparent border-b border-gray-200 dark:border-white/20 py-3 focus:outline-none focus:border-black dark:focus:border-white transition-colors text-sm" />
                    </div>
                    <div className="relative">
                      <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-2">{tAccount.password}</label>
                      <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                        className="w-full bg-transparent border-b border-gray-200 dark:border-white/20 py-3 focus:outline-none focus:border-black dark:focus:border-white transition-colors text-sm pr-12" />
                      <button type="button" onClick={() => setShowPass(v => !v)}
                        className="absolute right-0 bottom-3 text-[9px] text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                        {showPass ? "Hide" : "Show"}
                      </button>
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-2">{tAccount.confirmPassword}</label>
                      <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                        className="w-full bg-transparent border-b border-gray-200 dark:border-white/20 py-3 focus:outline-none focus:border-black dark:focus:border-white transition-colors text-sm" />
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full bg-black dark:bg-white text-white dark:text-black py-4 text-[10px] tracking-[0.3em] uppercase hover:bg-gold hover:text-black transition-colors duration-500 shadow-lg disabled:opacity-50 mt-2">
                      {loading ? "Creating Account..." : tAccount.register}
                    </button>
                    <p className="text-center text-[9px] text-gray-400">
                      {tAccount.haveAccount}{" "}
                      <button type="button" onClick={() => setTab("signin")} className="text-black dark:text-white underline">
                        {tAccount.signIn}
                      </button>
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Side panel */}
            <div className="space-y-6 flex flex-col justify-center">
              <div className="bg-black text-white p-8 md:p-10 shadow-xl">
                <p className="text-[9px] tracking-[0.4em] uppercase text-gold mb-6">Client Exclusives</p>
                <h2 className="font-serif text-xl mb-4 text-gold">{tAccount.wardrobe}</h2>
                <p className="text-[11px] text-gray-400 tracking-wider leading-relaxed mb-8">
                  {tAccount.wardrobeDesc}
                </p>
                <ul className="space-y-3 text-[10px] text-gray-500 mb-8">
                  {["Order history & tracking", "AI outfit recommendations", "Virtual try-on history", "Early access to new arrivals", "White-glove support"].map(item => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/account/dashboard" className="block w-full border border-white/20 p-4 text-center text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300">
                  {tAccount.viewDashboard}
                </Link>
              </div>

              <div className="border border-gray-200 dark:border-white/10 p-8">
                <p className="text-[9px] tracking-[0.4em] uppercase text-gray-400 mb-4">{tAccount.internalPortals}</p>
                <p className="text-[10px] text-gray-500 leading-relaxed mb-6">{tAccount.restrictedAccess}</p>
                <div className="flex flex-col gap-3">
                  <Link href="/admin" className="block p-3 text-center text-[9px] uppercase tracking-[0.2em] border border-gray-100 dark:border-white/10 hover:border-black dark:hover:border-white transition-colors">
                    Maison Administration
                  </Link>
                  <Link href="/supplier/login" className="block p-3 text-center text-[9px] uppercase tracking-[0.2em] border border-gray-100 dark:border-white/10 hover:border-black dark:hover:border-white transition-colors">
                    Supplier Portal
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense>
      <AccountPageInner />
    </Suspense>
  );
}
