"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { login, signup } from "@/app/actions/auth";

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-black pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16 border-b border-gray-200 pb-12">
            <h1 className="font-serif text-4xl mb-4">My Account</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Access your digital wardrobe and orders</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
            {/* Auth Forms */}
            <div className="bg-white p-8 md:p-10 border border-gray-100 shadow-sm">
              <h2 className="font-serif text-2xl mb-8 border-b border-gray-100 pb-4">Sign In / Register</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2" htmlFor="email">Email Address</label>
                  <input id="email" name="email" type="email" required className="w-full bg-transparent border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2" htmlFor="password">Password</label>
                  <input id="password" name="password" type="password" required className="w-full bg-transparent border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-colors text-sm" />
                </div>
                
                <div className="flex flex-col gap-4 mt-8">
                  <button formAction={login} className="w-full bg-black text-white py-4 text-[11px] tracking-[0.3em] uppercase hover:bg-gold transition-colors duration-500 shadow-lg">
                    Sign In
                  </button>
                  <button formAction={signup} className="w-full border border-black text-black py-4 text-[11px] tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-colors duration-500">
                    Register New Account
                  </button>
                </div>
              </form>
            </div>

            {/* Access Levels */}
            <div className="space-y-8 flex flex-col justify-center">
              <div className="bg-black text-white p-8 md:p-10 shadow-xl">
                 <h2 className="font-serif text-xl mb-4 text-gold">Your Personal Wardrobe</h2>
                 <p className="text-[11px] text-gray-400 tracking-wider leading-relaxed mb-8">
                  View your recent orders, access AI-curated outfits, and review your virtual try-on history in your personal client dashboard.
                 </p>
                 <Link href="/account/dashboard" className="block w-full border border-white/20 p-4 text-center text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300">
                   Go to Client Dashboard →
                 </Link>
              </div>

               <div className="border border-gray-200 p-8">
                 <h2 className="font-serif text-xl mb-4">Internal Portals</h2>
                 <p className="text-[10px] text-gray-500 tracking-wider leading-relaxed mb-6">
                  Restricted access. Valid high-tier credentials are required.
                 </p>
                 <div className="flex flex-col gap-3">
                   <Link href="/admin" className="block p-3 text-center text-[9px] uppercase tracking-[0.2em] border border-gray-100 hover:border-black transition-colors">
                     Maison Administration
                   </Link>
                   <Link href="/supplier" className="block p-3 text-center text-[9px] uppercase tracking-[0.2em] border border-gray-100 hover:border-black transition-colors">
                     Partner Marketplace
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
