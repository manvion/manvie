"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PRODUCTS = [
  { id: 1, name: "Cashmere Coat", sku: "AC-001", baseCost: 450, retailPrice: 2400, status: "active", stock: 12, submitted: "Mar 20, 2026", sales: 22 },
  { id: 2, name: "Silk Evening Dress", sku: "AC-002", baseCost: 320, retailPrice: 1850, status: "active", stock: 8, submitted: "Feb 15, 2026", sales: 14 },
  { id: 3, name: "Wool Blend Trench", sku: "AC-003", baseCost: 380, retailPrice: null, status: "pending", stock: 20, submitted: "Apr 14, 2026", sales: 0 },
];

const ORDERS = [
  { id: "ORD-4825", items: "Cashmere Coat × 1", earning: 450, status: "assigned", date: "Apr 20, 2026", customer: "Paris, FR" },
  { id: "ORD-4823", items: "Silk Evening Dress × 2", earning: 640, status: "shipped", date: "Apr 18, 2026", customer: "London, UK" },
  { id: "ORD-4819", items: "Cashmere Coat × 1", earning: 450, status: "delivered", date: "Apr 12, 2026", customer: "Dubai, UAE" },
];

const STATUS_STYLES: Record<string, string> = {
  active:    "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  pending:   "bg-gold/10 border-gold/20 text-gold",
  shipped:   "bg-blue-500/10 border-blue-500/20 text-blue-400",
  assigned:  "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
  delivered: "bg-gray-500/10 border-gray-500/20 text-gray-400",
};

// ─── Upload Form ──────────────────────────────────────────────────────────────

function UploadForm({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-12 text-center"
      >
        <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center text-gold text-lg mx-auto mb-6">
          ✓
        </div>
        <p className="font-serif text-2xl text-white mb-3">Submitted to Maison</p>
        <p className="text-[9px] tracking-[0.3em] uppercase text-gray-500 mb-8">
          Under review — expect a response within 48 hours
        </p>
        <button
          onClick={onClose}
          className="text-[9px] tracking-[0.3em] uppercase text-gold border-b border-gold pb-0.5"
        >
          Return to Dashboard
        </button>
      </motion.div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-[9px] tracking-[0.4em] uppercase text-gold mb-1">Submission Portal</p>
          <h3 className="font-serif text-2xl text-white">Upload New Asset</h3>
        </div>
        <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors text-xl">✕</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {[
          { label: "Asset Name", placeholder: "e.g. Cashmere Wrap Coat", type: "text" },
          { label: "Category", placeholder: "Outerwear", type: "select" },
          { label: "Base Cost (USD)", placeholder: "450", type: "number" },
          { label: "Manufacturing Capacity", placeholder: "20 units/month", type: "number" },
          { label: "Available Sizes", placeholder: "XS, S, M, L, XL", type: "text" },
          { label: "Lead Time (days)", placeholder: "14", type: "number" },
        ].map(field => (
          <div key={field.label}>
            <label className="block text-[8px] uppercase tracking-[0.3em] text-gray-600 mb-2">{field.label}</label>
            {field.type === "select" ? (
              <select className="w-full bg-[#1a1a1a] border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-gold transition-colors appearance-none">
                {["Outerwear", "Dresses", "Suits", "Accessories", "Knitwear"].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                placeholder={field.placeholder}
                className="w-full bg-[#1a1a1a] border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-gray-700"
              />
            )}
          </div>
        ))}
      </div>

      {/* Photo upload */}
      <div className="mb-6">
        <label className="block text-[8px] uppercase tracking-[0.3em] text-gray-600 mb-2">Product Photography</label>
        <div className="border-2 border-dashed border-white/10 p-8 text-center cursor-pointer hover:border-gold/40 hover:bg-white/[0.01] transition-all group">
          <div className="text-3xl text-white/10 group-hover:text-white/20 transition-colors mb-2">↑</div>
          <p className="text-[9px] tracking-[0.25em] uppercase text-gray-600 group-hover:text-gray-400 transition-colors">
            Upload High-Res Images
          </p>
          <p className="text-[8px] text-gray-800 mt-1">Minimum 3 angles · White background preferred</p>
        </div>
      </div>

      {/* Description */}
      <div className="mb-8">
        <label className="block text-[8px] uppercase tracking-[0.3em] text-gray-600 mb-2">Design Description & Material Composition</label>
        <textarea
          rows={4}
          placeholder="Describe fabrication, materials, construction details, and unique design elements..."
          className="w-full bg-[#1a1a1a] border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-gold transition-colors resize-none placeholder:text-gray-700"
        />
      </div>

      <button
        onClick={() => setSubmitted(true)}
        className="w-full bg-gold text-black py-4 text-[10px] tracking-[0.35em] uppercase hover:bg-white transition-colors duration-500 font-medium"
      >
        Submit to Maison for Approval
      </button>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: 20, x: "-50%" }}
      className="fixed bottom-8 left-1/2 z-[500] bg-blue-500 text-white px-6 py-3.5 text-[9px] tracking-[0.3em] uppercase font-medium shadow-2xl"
    >
      {message}
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SupplierDashboard() {
  const [tab, setTab] = useState("overview");
  const [showUpload, setShowUpload] = useState(false);
  const [orders, setOrders] = useState(ORDERS);
  const [toast, setToast] = useState<string | null>(null);

  const showToastMsg = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const markDispatched = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "shipped" } : o));
    showToastMsg(`Order ${id} marked as dispatched.`);
  };

  const tabs = [
    { id: "overview",  label: "Overview" },
    { id: "portfolio", label: "Portfolio" },
    { id: "orders",    label: "Dispatch Queue" },
    { id: "earnings",  label: "Earnings" },
  ];

  const totalEarnings = orders.filter(o => o.status !== "assigned").reduce((a, o) => a + o.earning, 0);
  const escrow = orders.filter(o => o.status === "assigned").reduce((a, o) => a + o.earning, 0);

  return (
    <div className="min-h-screen bg-[#060608] text-white pt-28 pb-24 px-8 font-sans">
      <div className="max-w-[1400px] mx-auto">

        {/* Toast */}
        <AnimatePresence>
          {toast && <Toast message={toast} />}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-end mb-10 border-b border-white/[0.06] pb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              <p className="text-[9px] tracking-[0.5em] uppercase text-blue-400">Manvié Partner Network — Supplier Access</p>
            </div>
            <h1 className="font-serif text-3xl tracking-wide">Supplier Hub</h1>
            <p className="text-[9px] tracking-[0.3em] text-gray-700 uppercase mt-1">Partner Node: Atelier Blanc · Montréal, QC</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowUpload(true)}
              className="bg-gold text-black px-6 py-3 text-[9px] tracking-[0.3em] uppercase hover:bg-white transition-colors duration-300 font-medium"
            >
              + Upload New Asset
            </button>
            <a href="/supplier/login" className="border border-white/10 text-gray-500 px-6 py-3 text-[9px] tracking-[0.3em] uppercase hover:border-white/30 hover:text-white transition-colors">
              Sign Out
            </a>
          </div>
        </motion.div>

        {/* Upload Modal */}
        <AnimatePresence>
          {showUpload && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowUpload(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-[#111] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <UploadForm onClose={() => setShowUpload(false)} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Earnings", value: `$${totalEarnings.toLocaleString()}`, sub: "All time", color: "text-emerald-400" },
            { label: "In Escrow", value: `$${escrow}`, sub: "Awaiting fulfillment", color: "text-gold" },
            { label: "Active Assets", value: PRODUCTS.filter(p => p.status === "active").length.toString(), sub: "Live on platform", color: "text-white" },
            { label: "Pending Review", value: PRODUCTS.filter(p => p.status === "pending").length.toString(), sub: "Awaiting Maison approval", color: "text-gold" },
          ].map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-[#0e0e10] border border-white/[0.05] p-6 hover:border-blue-500/20 transition-colors"
            >
              <p className="text-[7px] tracking-[0.3em] uppercase text-gray-600 mb-3">{m.label}</p>
              <p className={`font-serif text-3xl font-light mb-1 ${m.color}`}>{m.value}</p>
              <p className="text-[8px] text-gray-700">{m.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-8 border-b border-white/[0.06] overflow-x-auto hide-scrollbar">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-6 py-3.5 text-[9px] tracking-[0.3em] uppercase whitespace-nowrap transition-colors relative ${
                tab === t.id ? "text-blue-400" : "text-gray-600 hover:text-white"
              }`}
            >
              {t.label}
              {tab === t.id && (
                <motion.div layoutId="supplierTab" className="absolute bottom-0 left-0 right-0 h-[1px] bg-blue-500" />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── Portfolio ── */}
          {(tab === "overview" || tab === "portfolio") && (
            <motion.div key="portfolio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-[#0e0e10] border border-white/[0.05] overflow-hidden mb-6">
                <div className="px-6 py-5 border-b border-white/[0.04] bg-[#131316] flex justify-between items-center">
                  <h2 className="font-serif text-lg">Asset Portfolio</h2>
                  <span className="text-[8px] tracking-widest uppercase text-gray-600">{PRODUCTS.length} assets</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/[0.04] bg-[#131316]">
                        {["SKU", "Asset Name", "Base Cost", "Retail Price", "Your Margin", "Stock", "Sales", "Status"].map(h => (
                          <th key={h} className="px-5 py-3.5 text-[8px] tracking-[0.25em] uppercase text-gray-700 font-normal whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {PRODUCTS.map((p, i) => (
                        <motion.tr
                          key={p.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.06 }}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-5 py-4 font-mono text-[8px] text-gray-700">{p.sku}</td>
                          <td className="px-5 py-4 font-serif text-sm text-white">{p.name}</td>
                          <td className="px-5 py-4 font-mono text-[10px] text-gray-400">${p.baseCost}</td>
                          <td className="px-5 py-4 font-mono text-[10px] text-white">
                            {p.retailPrice ? `$${p.retailPrice.toLocaleString()}` : <span className="text-gray-700">Pending</span>}
                          </td>
                          <td className="px-5 py-4 font-mono text-[10px] text-emerald-400">
                            {p.retailPrice ? `+$${(p.baseCost).toLocaleString()}` : "—"}
                          </td>
                          <td className="px-5 py-4 font-mono text-[10px] text-gray-300">{p.stock}</td>
                          <td className="px-5 py-4 font-mono text-[10px] text-gray-400">{p.sales || "—"}</td>
                          <td className="px-5 py-4">
                            <span className={`text-[7px] uppercase tracking-widest px-2 py-1 border ${STATUS_STYLES[p.status]}`}>
                              {p.status}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Dispatch Queue ── */}
          {(tab === "overview" || tab === "orders") && (
            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-[#0e0e10] border border-white/[0.05] overflow-hidden">
                <div className="px-6 py-5 border-b border-white/[0.04] bg-[#131316]">
                  <h2 className="font-serif text-lg">Dispatch Queue</h2>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {orders.map((o, i) => (
                    <motion.div
                      key={o.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="px-6 py-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-8">
                        <div>
                          <p className="font-mono text-[10px] text-blue-400">{o.id}</p>
                          <p className="text-[9px] text-gray-600 mt-0.5">{o.date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white">{o.items}</p>
                          <p className="text-[9px] text-gray-600 mt-0.5">→ {o.customer}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <p className="font-mono text-emerald-400 font-medium">+${o.earning}</p>
                        <span className={`text-[8px] uppercase tracking-widest px-3 py-1 border ${STATUS_STYLES[o.status]}`}>
                          {o.status}
                        </span>
                        {o.status === "assigned" ? (
                          <button
                            onClick={() => markDispatched(o.id)}
                            className="text-[9px] uppercase tracking-widest text-gold border border-gold/20 px-4 py-2 hover:bg-gold hover:text-black transition-colors">
                            Mark Dispatched
                          </button>
                        ) : (
                          <button
                            onClick={() => showToastMsg(`Tracking loaded for ${o.id}.`)}
                            className="text-[9px] uppercase tracking-widest text-gray-600 hover:text-white transition-colors">
                            Track →
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Earnings ── */}
          {tab === "earnings" && (
            <motion.div key="earnings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#0e0e10] border border-white/[0.05] p-8">
                  <p className="text-[8px] tracking-[0.3em] uppercase text-gray-600 mb-6">Earnings Breakdown</p>
                  <div className="space-y-4">
                    {PRODUCTS.filter(p => p.sales > 0).map(p => (
                      <div key={p.id} className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-[10px] text-gray-400">{p.name}</span>
                            <span className="text-[10px] text-emerald-400 font-mono">${(p.baseCost * p.sales).toLocaleString()}</span>
                          </div>
                          <div className="h-1 bg-white/5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(p.sales / 22) * 100}%` }}
                              transition={{ duration: 0.8 }}
                              className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                            />
                          </div>
                        </div>
                        <span className="text-[9px] text-gray-600 font-mono">{p.sales} units</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/10 pt-6 mt-6 flex justify-between">
                    <span className="text-[9px] uppercase tracking-widest text-gray-600">Total Earned</span>
                    <span className="font-mono text-emerald-400 text-lg">${totalEarnings.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-[#0e0e10] border border-white/[0.05] p-8">
                  <p className="text-[8px] tracking-[0.3em] uppercase text-gray-600 mb-6">Payout Information</p>
                  <div className="space-y-4 text-sm mb-8">
                    {[
                      { label: "Next Payout", value: "Apr 30, 2026" },
                      { label: "Amount", value: `$${totalEarnings.toLocaleString()}` },
                      { label: "Method", value: "SWIFT Transfer" },
                      { label: "Bank", value: "BNP Paribas ••••8821" },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between border-b border-white/[0.04] pb-3">
                        <span className="text-gray-600 text-[10px] tracking-widest uppercase">{r.label}</span>
                        <span className="text-white text-[11px] font-mono">{r.value}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full border border-white/10 py-3 text-[9px] uppercase tracking-widest text-gray-500 hover:border-gold/40 hover:text-gold transition-colors">
                    Update Bank Details
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
