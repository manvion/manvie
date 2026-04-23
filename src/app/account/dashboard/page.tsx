"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Order = {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  total: number;
  items: string;
};

const STATUS_STYLES: Record<string, string> = {
  delivered:   "bg-emerald-50 text-emerald-600",
  shipped:     "bg-blue-50 text-blue-600",
  processing:  "bg-gold/10 text-amber-700",
  pending:     "bg-gray-50 text-gray-500",
  cancelled:   "bg-red-50 text-red-500",
};

type Tab = "orders" | "outfits" | "tryon";

export default function UserDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [tab, setTab] = useState<Tab>("orders");
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/account");
        return;
      }
      setUser({ email: data.user.email });
    });

    fetch("/api/customer/orders")
      .then(r => r.json())
      .then(data => setOrders(data.orders ?? []))
      .finally(() => setLoading(false));
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/account");
    router.refresh();
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen bg-white text-black pt-32 pb-24 px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

          <div className="flex justify-between items-end mb-16 border-b border-gray-200 pb-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold mb-2">Welcome back</p>
              <h1 className="font-serif text-4xl">My Manvié</h1>
              {user?.email && (
                <p className="text-xs text-gray-400 tracking-widest mt-1">{user.email}</p>
              )}
            </div>
            <button
              onClick={handleSignOut}
              className="text-xs uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors border-b border-transparent hover:border-red-500 pb-1"
            >
              Sign Out
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-12 mb-16 text-[10px] tracking-widest uppercase border-b border-gray-100 pb-4">
            {(["orders", "outfits", "tryon"] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-2 -mb-[18px] transition-colors ${
                  tab === t ? "border-b-2 border-black text-black" : "text-gray-400 hover:text-black"
                }`}
              >
                {t === "orders" ? "Orders" : t === "outfits" ? "Saved Outfits" : "Try-On History"}
              </button>
            ))}
          </div>

          {/* Orders Tab */}
          {tab === "orders" && (
            <div className="mb-20">
              <h2 className="font-serif text-2xl mb-8">Order History</h2>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="border border-gray-100 p-8 animate-pulse">
                      <div className="h-5 bg-gray-100 w-40 mb-3 rounded" />
                      <div className="h-3 bg-gray-50 w-72 rounded" />
                    </div>
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="border border-dashed border-gray-200 p-16 text-center">
                  <p className="text-gray-400 text-sm tracking-widest uppercase mb-6">No orders yet</p>
                  <Link
                    href="/shop"
                    className="inline-block border border-black px-8 py-3 text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-colors duration-300"
                  >
                    Explore the Collection
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="border border-gray-100 p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-4 mb-2">
                          <span className="font-serif text-lg">{order.order_number}</span>
                          <span className={`text-xs uppercase tracking-widest px-3 py-1 ${STATUS_STYLES[order.status] ?? "bg-gray-50 text-gray-500"}`}>
                            {order.status}
                          </span>
                        </div>
                        {order.items && <p className="text-sm text-gray-500">{order.items}</p>}
                        <p className="text-xs text-gray-400 mt-1">{formatDate(order.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-serif text-xl">${order.total?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Saved Outfits Tab */}
          {tab === "outfits" && (
            <div className="mb-20">
              <h2 className="font-serif text-2xl mb-8">AI-Curated Outfits</h2>
              <div className="border border-dashed border-gray-200 p-16 text-center">
                <p className="text-gray-400 text-sm tracking-widest uppercase mb-6">No saved outfits yet</p>
                <Link
                  href="/stylist"
                  className="inline-block border border-black px-8 py-3 text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-colors duration-300"
                >
                  Try the AI Stylist
                </Link>
              </div>
            </div>
          )}

          {/* Try-On History Tab */}
          {tab === "tryon" && (
            <div>
              <h2 className="font-serif text-2xl mb-8">Virtual Try-On History</h2>
              <div className="border border-dashed border-gray-200 p-16 text-center">
                <p className="text-gray-400 text-sm tracking-widest uppercase mb-6">No saved try-ons yet</p>
                <Link
                  href="/try-on"
                  className="inline-block border border-black px-8 py-3 text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-colors duration-300"
                >
                  Virtual Try-On
                </Link>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
