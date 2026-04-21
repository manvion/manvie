"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function UserDashboard() {
  const mockOrders = [
    { id: "ORD-4821", date: "April 12, 2026", total: "$4,250.00", status: "In Transit", items: "Manvié Signature Coat, Manvié Leather Handbag" },
    { id: "ORD-3910", date: "March 28, 2026", total: "$1,850.00", status: "Delivered", items: "Manvié Atelier Silk Dress" },
  ];

  const mockOutfits = [
    { id: 1, name: "Evening Gala Ensemble", items: 3, created: "April 10, 2026" },
    { id: 2, name: "Business Luxe Look", items: 4, created: "April 3, 2026" },
  ];

  return (
    <div className="min-h-screen bg-white text-black pt-32 pb-24 px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-between items-end mb-16 border-b border-gray-200 pb-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold mb-2">Welcome back</p>
              <h1 className="font-serif text-4xl">My Manvié</h1>
            </div>
            <button className="text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-colors border-b border-transparent hover:border-black pb-1">
              Sign Out
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-12 mb-16 text-sm tracking-widest uppercase border-b border-gray-100 pb-4">
            <button className="border-b-2 border-black pb-2 -mb-[18px]">Orders</button>
            <button className="text-gray-400 hover:text-black transition-colors pb-2 -mb-[18px]">Saved Outfits</button>
            <button className="text-gray-400 hover:text-black transition-colors pb-2 -mb-[18px]">Try-On History</button>
          </div>

          {/* Orders Section */}
          <div className="mb-20">
            <h2 className="font-serif text-2xl mb-8">Recent Orders</h2>
            <div className="space-y-6">
              {mockOrders.map((order) => (
                <div key={order.id} className="border border-gray-100 p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="font-serif text-lg">{order.id}</span>
                      <span className={`text-xs uppercase tracking-widest px-3 py-1 ${
                        order.status === 'Delivered' 
                          ? 'bg-green-50 text-green-600' 
                          : 'bg-gold/10 text-gold-dark'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{order.items}</p>
                    <p className="text-xs text-gray-400 mt-1">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-xl">{order.total}</p>
                    <button className="text-xs uppercase tracking-widest text-gold hover:text-black transition-colors mt-2">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Outfits Section */}
          <div className="mb-20">
            <h2 className="font-serif text-2xl mb-8">AI-Curated Outfits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mockOutfits.map((outfit) => (
                <div key={outfit.id} className="border border-gray-100 p-8 hover:border-gold/50 transition-colors cursor-pointer group">
                  <h3 className="font-serif text-xl mb-2 group-hover:text-gold transition-colors">{outfit.name}</h3>
                  <p className="text-sm text-gray-500">{outfit.items} pieces • Curated {outfit.created}</p>
                  <button className="text-xs uppercase tracking-widest text-gold mt-4 hover:text-black transition-colors">
                    View Outfit →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Try-On History */}
          <div>
            <h2 className="font-serif text-2xl mb-8">Virtual Try-On History</h2>
            <div className="border border-dashed border-gray-200 p-12 text-center">
              <p className="text-gray-400 text-sm tracking-widest uppercase mb-4">No saved try-ons yet</p>
              <Link href="/try-on" className="inline-block border border-black px-8 py-3 text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-colors duration-300">
                Try On Now
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
