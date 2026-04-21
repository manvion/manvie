"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const METRICS = [
  { label: "Gross Revenue",     value: "$128,400", change: "+12.5%",        trend: "up",      sub: "vs last 30 days" },
  { label: "Fulfillment Queue", value: "23",        change: "8 Prioritized", trend: "neutral", sub: "units pending dispatch" },
  { label: "Supplier Approvals",value: "2",         change: "Action Required",trend: "warn",   sub: "pending review" },
  { label: "Active Partners",   value: "6",         change: "Stable",        trend: "up",      sub: "across 4 regions" },
  { label: "Avg. Order Value",  value: "$3,842",    change: "+8.1%",         trend: "up",      sub: "vs last 30 days" },
  { label: "Return Rate",       value: "1.2%",      change: "-0.4%",         trend: "up",      sub: "below industry avg." },
];

const INITIAL_PRODUCTS = [
  { id: 1, name: "Manvié Signature Coat",  supplier: "Atelier Blanc", sku: "MB-001", cost: 450, retail: 2400, stock: 12, status: "active",  sales: 48 },
  { id: 2, name: "Atelier Silk Dress",     supplier: "Maison Rouge",  sku: "MB-002", cost: 320, retail: 1850, stock: 8,  status: "active",  sales: 31 },
  { id: 3, name: "Noir Evening Gown",      supplier: "Studio Noir",   sku: "MB-003", cost: 680, retail: 4200, stock: 4,  status: "active",  sales: 17 },
  { id: 4, name: "Wool Blend Trench",      supplier: "Atelier Blanc", sku: "MB-004", cost: 380, retail: null, stock: 20, status: "pending", sales: 0  },
  { id: 5, name: "Cashmere Wrap Coat",     supplier: "Studio Noir",   sku: "MB-005", cost: 520, retail: null, stock: 5,  status: "pending", sales: 0  },
  { id: 6, name: "Italian Leather Bag",    supplier: "Maison Rouge",  sku: "MB-006", cost: 680, retail: 3200, stock: 6,  status: "active",  sales: 22 },
];

const INITIAL_ORDERS = [
  { id: "ORD-4825", customer: "Isabelle Fontaine", email: "i.fontaine@example.com", total: 4250, status: "processing", supplier: "Atelier Blanc", items: 1, date: "Apr 20, 2026" },
  { id: "ORD-4824", customer: "Marcus Webb",        email: "m.webb@example.com",     total: 1850, status: "shipped",     supplier: "Maison Rouge",  items: 1, date: "Apr 19, 2026" },
  { id: "ORD-4823", customer: "Yuki Tanaka",        email: "y.tanaka@example.com",   total: 6400, status: "delivered",   supplier: "Atelier Blanc", items: 2, date: "Apr 18, 2026" },
  { id: "ORD-4822", customer: "Camille Dubois",     email: "c.dubois@example.com",   total: 3200, status: "processing",  supplier: "Studio Noir",   items: 1, date: "Apr 18, 2026" },
  { id: "ORD-4821", customer: "Ahmad Al-Rashid",    email: "a.alrashid@example.com", total: 2800, status: "shipped",     supplier: "Atelier Blanc", items: 1, date: "Apr 17, 2026" },
];

const INITIAL_SUPPLIERS = [
  { id: 1, name: "Atelier Blanc", location: "Montréal, QC", speciality: "Outerwear & Coats",     status: "active",  products: 3, revenue: 68400, rating: 4.9 },
  { id: 2, name: "Maison Rouge",  location: "Milan, IT",    speciality: "Dresses & Gowns",       status: "active",  products: 2, revenue: 41200, rating: 4.8 },
  { id: 3, name: "Studio Noir",   location: "London, UK",   speciality: "Accessories & Leather", status: "active",  products: 2, revenue: 18800, rating: 4.7 },
  { id: 4, name: "Casa Velvet",   location: "Barcelona, ES",speciality: "Evening Wear",          status: "pending", products: 0, revenue: 0,     rating: null },
];

const ORDER_FLOW: Record<string, string> = {
  processing: "shipped",
  shipped: "delivered",
  delivered: "delivered",
};

const STATUS_STYLES: Record<string, string> = {
  active:     "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  pending:    "bg-gold/10 border-gold/20 text-gold",
  shipped:    "bg-blue-500/10 border-blue-500/20 text-blue-400",
  processing: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
  delivered:  "bg-gray-500/10 border-gray-500/20 text-gray-400",
  denied:     "bg-red-500/10 border-red-500/20 text-red-400",
};

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: 20, x: "-50%" }}
      className={`fixed bottom-8 left-1/2 z-[500] px-6 py-3.5 text-[9px] tracking-[0.3em] uppercase font-medium shadow-2xl ${
        type === "success" ? "bg-gold text-black" : "bg-red-500 text-white"
      }`}
    >
      {message}
    </motion.div>
  );
}

// ─── Spark Bar ────────────────────────────────────────────────────────────────

function SparkBar({ value, max }: { value: number; max: number }) {
  return (
    <div className="w-20 h-1.5 bg-white/5 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 1, delay: 0.3 }}
        className="h-full bg-gold"
      />
    </div>
  );
}

// ─── Edit Product Modal ───────────────────────────────────────────────────────

function EditProductModal({ product, onSave, onClose }: {
  product: typeof INITIAL_PRODUCTS[0];
  onSave: (id: number, retail: number, stock: number) => void;
  onClose: () => void;
}) {
  const [retail, setRetail] = useState(product.retail?.toString() ?? "");
  const [stock, setStock] = useState(product.stock.toString());

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
        className="bg-[#141414] border border-white/10 text-white w-full max-w-md p-10 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="font-serif text-2xl mb-1">{product.name}</h3>
        <p className="text-[8px] tracking-[0.3em] text-gray-600 uppercase mb-8">{product.sku}</p>

        <div className="space-y-5">
          <div>
            <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-500 mb-2">Retail Price (CAD)</label>
            <input value={retail} onChange={e => setRetail(e.target.value)} type="number"
              className="w-full bg-white/5 border border-white/10 focus:border-gold px-4 py-3 outline-none text-sm text-white transition-colors" />
          </div>
          <div>
            <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-500 mb-2">Stock Units</label>
            <input value={stock} onChange={e => setStock(e.target.value)} type="number"
              className="w-full bg-white/5 border border-white/10 focus:border-gold px-4 py-3 outline-none text-sm text-white transition-colors" />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={() => { onSave(product.id, parseInt(retail), parseInt(stock)); onClose(); }}
            className="flex-1 bg-gold text-black py-3.5 text-[10px] tracking-[0.3em] uppercase hover:bg-white transition-colors">
            Save Changes
          </button>
          <button onClick={onClose} className="px-6 border border-white/10 text-gray-500 text-[10px] uppercase tracking-widest hover:border-white/30 hover:text-white transition-colors">
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [tab, setTab] = useState("overview");

  // Interactive state
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [editingProduct, setEditingProduct] = useState<typeof INITIAL_PRODUCTS[0] | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const approveProduct = (id: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: "active" } : p));
    showToast("Product approved and listed.");
  };

  const denyProduct = (id: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: "denied" } : p));
    showToast("Product submission denied.", "error");
  };

  const advanceOrderStatus = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: ORDER_FLOW[o.status] ?? o.status } : o));
    showToast(`Order ${id} status updated.`);
  };

  const approveSupplier = (id: number) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, status: "active" } : s));
    showToast("Supplier approved and activated.");
  };

  const denySupplier = (id: number) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
    showToast("Supplier application rejected.", "error");
  };

  const saveProduct = (id: number, retail: number, stock: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, retail, stock } : p));
    showToast("Product updated successfully.");
  };

  const tabs = [
    { id: "overview",  label: "Overview" },
    { id: "catalog",   label: "Catalog" },
    { id: "orders",    label: "Orders" },
    { id: "suppliers", label: "Partners" },
    { id: "analytics", label: "Analytics" },
  ];

  const pendingProducts = products.filter(p => p.status === "pending");
  const activeProducts = products.filter(p => p.status === "active");

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-28 pb-24 px-8 font-sans">
      <div className="max-w-[1500px] mx-auto">

        {/* Toast */}
        <AnimatePresence>
          {toast && <Toast message={toast.message} type={toast.type} />}
        </AnimatePresence>

        {/* Edit Product Modal */}
        <AnimatePresence>
          {editingProduct && (
            <EditProductModal
              product={editingProduct}
              onSave={saveProduct}
              onClose={() => setEditingProduct(null)}
            />
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="flex justify-between items-end mb-10 border-b border-white/[0.06] pb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <p className="text-[9px] tracking-[0.5em] uppercase text-gold">Secure · Maison Internal Network</p>
            </div>
            <h1 className="font-serif text-3xl tracking-wide">Control Console</h1>
            <p className="text-[9px] tracking-[0.3em] text-gray-600 uppercase mt-1">Manvié Maison · Admin Access Level 1</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => showToast("Report exported to your inbox.")}
              className="border border-white/10 bg-white/[0.03] text-gray-400 px-5 py-2.5 text-[9px] tracking-[0.2em] uppercase hover:border-gold/40 hover:text-gold transition-colors">
              Export Report
            </button>
            <a href="/admin/login"
              className="border border-white/10 bg-white/[0.03] text-gray-400 px-5 py-2.5 text-[9px] tracking-[0.2em] uppercase hover:border-white/30 hover:text-white transition-colors">
              Sign Out
            </a>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-0 mb-10 border-b border-white/[0.06] overflow-x-auto hide-scrollbar">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-6 py-3.5 text-[9px] tracking-[0.3em] uppercase whitespace-nowrap transition-colors relative ${tab === t.id ? "text-gold" : "text-gray-500 hover:text-white"}`}
            >
              {t.label}
              {tab === t.id && <motion.div layoutId="adminTab" className="absolute bottom-0 left-0 right-0 h-[1px] bg-gold" />}
              {t.id === "suppliers" && suppliers.filter(s => s.status === "pending").length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gold" />
              )}
            </button>
          ))}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {METRICS.map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-[#111] border border-white/[0.05] p-5 hover:border-gold/20 transition-colors group">
              <p className="text-[7px] tracking-[0.3em] uppercase text-gray-600 mb-3">{m.label}</p>
              <p className="font-serif text-2xl font-light text-white mb-1">{m.value}</p>
              <p className={`text-[9px] font-mono ${m.trend === "up" ? "text-emerald-400" : m.trend === "warn" ? "text-gold" : "text-gray-500"}`}>{m.change}</p>
              <p className="text-[7px] text-gray-700 mt-0.5">{m.sub}</p>
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── Catalog tab ── */}
          {(tab === "overview" || tab === "catalog") && (
            <motion.div key="catalog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-[#0f0f0f] border border-white/[0.05] overflow-hidden mb-6">
                <div className="px-6 py-5 border-b border-white/[0.05] bg-[#141414] flex justify-between items-center">
                  <div>
                    <h2 className="font-serif text-lg">Catalog Distribution</h2>
                    <p className="text-[8px] tracking-[0.3em] text-gray-600 uppercase mt-0.5">{products.length} assets</p>
                  </div>
                  <div className="flex gap-4 text-[8px] uppercase tracking-widest">
                    <span className="text-gold flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-gold" />{pendingProducts.length} Pending</span>
                    <span className="text-emerald-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{activeProducts.length} Active</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/[0.04] bg-[#141414]">
                        {["SKU", "Asset Name", "Partner", "Base Cost", "Retail", "Margin", "Stock", "Sales", "Status", ""].map(h => (
                          <th key={h} className="px-5 py-3.5 text-[8px] tracking-[0.3em] uppercase text-gray-600 font-normal whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {products.map((p, i) => (
                        <motion.tr key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                          className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-5 py-4 font-mono text-[9px] text-gray-600">{p.sku}</td>
                          <td className="px-5 py-4 font-serif text-sm text-white">{p.name}</td>
                          <td className="px-5 py-4 text-[10px] text-gray-400">{p.supplier}</td>
                          <td className="px-5 py-4 font-mono text-[10px] text-gray-400">${p.cost.toLocaleString()}</td>
                          <td className="px-5 py-4 font-mono text-[10px] text-white">{p.retail ? `$${p.retail.toLocaleString()}` : <span className="text-gray-600">—</span>}</td>
                          <td className="px-5 py-4 font-mono text-[10px] text-emerald-400">{p.retail ? `+$${(p.retail - p.cost).toLocaleString()}` : "—"}</td>
                          <td className="px-5 py-4 font-mono text-[10px] text-gray-300">
                            <div className="flex items-center gap-2">{p.stock}<SparkBar value={p.stock} max={20} /></div>
                          </td>
                          <td className="px-5 py-4 font-mono text-[10px] text-gray-300">{p.sales || "—"}</td>
                          <td className="px-5 py-4">
                            <span className={`text-[8px] uppercase tracking-[0.15em] px-2 py-1 border ${STATUS_STYLES[p.status] ?? STATUS_STYLES.pending}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            {p.status === "pending" ? (
                              <div className="flex justify-end gap-3">
                                <button onClick={() => approveProduct(p.id)} className="text-[8px] uppercase tracking-widest text-gold hover:text-white transition-colors">Approve</button>
                                <button onClick={() => denyProduct(p.id)} className="text-[8px] uppercase tracking-widest text-red-500/70 hover:text-red-400 transition-colors">Deny</button>
                              </div>
                            ) : (
                              <button onClick={() => setEditingProduct(p)} className="text-[8px] uppercase tracking-widest text-gray-600 hover:text-white transition-colors group-hover:text-gray-400">Edit</button>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Orders tab ── */}
          {(tab === "overview" || tab === "orders") && (
            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-[#0f0f0f] border border-white/[0.05] overflow-hidden mb-6">
                <div className="px-6 py-5 border-b border-white/[0.05] bg-[#141414] flex justify-between items-center">
                  <div>
                    <h2 className="font-serif text-lg">Logistics Stream</h2>
                    <p className="text-[8px] tracking-[0.3em] text-gray-600 uppercase mt-0.5">{orders.length} recent transactions</p>
                  </div>
                  <button onClick={() => showToast("Full order export sent to admin email.")} className="text-[8px] tracking-widest uppercase text-gray-500 hover:text-white transition-colors">Export All →</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/[0.04] bg-[#141414]">
                        {["Order ID", "Client", "Items", "Total", "Partner", "Status", "Date", ""].map(h => (
                          <th key={h} className="px-5 py-3.5 text-[8px] tracking-[0.3em] uppercase text-gray-600 font-normal whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {orders.map((o, i) => (
                        <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
                          className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-4 font-mono text-[10px] text-gold">{o.id}</td>
                          <td className="px-5 py-4">
                            <p className="text-sm text-white">{o.customer}</p>
                            <p className="text-[9px] text-gray-600 font-mono mt-0.5">{o.email}</p>
                          </td>
                          <td className="px-5 py-4 font-mono text-[10px] text-gray-400">{o.items}</td>
                          <td className="px-5 py-4 font-mono text-[11px] text-white">${o.total.toLocaleString()}</td>
                          <td className="px-5 py-4 text-[10px] text-gray-500">{o.supplier}</td>
                          <td className="px-5 py-4">
                            <span className={`text-[8px] uppercase tracking-widest px-2 py-1 border ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                          </td>
                          <td className="px-5 py-4 font-mono text-[9px] text-gray-600">{o.date}</td>
                          <td className="px-5 py-4 text-right">
                            {o.status !== "delivered" ? (
                              <button onClick={() => advanceOrderStatus(o.id)} className="text-[8px] uppercase tracking-widest text-gray-500 hover:text-gold transition-colors whitespace-nowrap">
                                → {ORDER_FLOW[o.status]}
                              </button>
                            ) : (
                              <span className="text-[8px] uppercase tracking-widest text-gray-700">Complete</span>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Suppliers tab ── */}
          {(tab === "overview" || tab === "suppliers") && (
            <motion.div key="suppliers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {suppliers.map((s, i) => (
                  <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="bg-[#0f0f0f] border border-white/[0.05] p-6 hover:border-gold/20 transition-colors">
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <p className="font-serif text-base text-white mb-1">{s.name}</p>
                        <p className="text-[8px] tracking-[0.2em] text-gray-600 uppercase">{s.location}</p>
                      </div>
                      <span className={`text-[7px] uppercase tracking-widest px-2 py-1 border ${STATUS_STYLES[s.status]}`}>{s.status}</span>
                    </div>
                    <p className="text-[9px] text-gray-500 mb-5">{s.speciality}</p>
                    <div className="space-y-2.5 text-[9px] font-mono">
                      <div className="flex justify-between"><span className="text-gray-600">Products</span><span className="text-white">{s.products}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Revenue</span><span className="text-emerald-400">${s.revenue.toLocaleString()}</span></div>
                      {s.rating && <div className="flex justify-between"><span className="text-gray-600">Rating</span><span className="text-gold">★ {s.rating}</span></div>}
                    </div>
                    <div className="mt-6 flex gap-2">
                      {s.status === "pending" ? (
                        <>
                          <button onClick={() => approveSupplier(s.id)} className="flex-1 bg-gold/10 border border-gold/20 text-gold text-[8px] tracking-widest uppercase py-2 hover:bg-gold hover:text-black transition-colors">Approve</button>
                          <button onClick={() => denySupplier(s.id)} className="px-3 border border-white/10 text-[8px] text-gray-600 hover:text-red-400 hover:border-red-500/30 transition-colors">✕</button>
                        </>
                      ) : (
                        <button onClick={() => showToast(`${s.name} profile details loaded.`)} className="flex-1 border border-white/10 text-gray-500 text-[8px] tracking-widest uppercase py-2 hover:border-white/30 hover:text-white transition-colors">View Profile</button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Analytics tab ── */}
          {tab === "analytics" && (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue chart */}
                <div className="lg:col-span-2 bg-[#0f0f0f] border border-white/[0.05] p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <p className="text-[8px] tracking-[0.3em] uppercase text-gray-600 mb-1">Revenue Trend</p>
                      <p className="font-serif text-2xl text-white">$128,400 <span className="text-emerald-400 text-sm font-sans font-normal">↑ 12.5%</span></p>
                    </div>
                    <div className="flex gap-2 text-[8px] uppercase tracking-widest">
                      {["7D", "30D", "90D", "1Y"].map(p => (
                        <button key={p} className="px-3 py-1.5 border border-white/10 text-gray-500 hover:border-gold/40 hover:text-gold transition-colors">{p}</button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-end gap-2 h-40">
                    {[45, 62, 58, 80, 72, 95, 88, 110, 105, 128, 115, 140].map((v, i) => (
                      <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${(v / 140) * 100}%` }}
                        transition={{ delay: i * 0.05, duration: 0.6 }}
                        className="flex-1 bg-gradient-to-t from-gold/30 to-gold/60 hover:to-gold transition-colors cursor-pointer"
                        title={`$${v}k`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-[7px] text-gray-700 font-mono">
                    {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(m => (
                      <span key={m}>{m}</span>
                    ))}
                  </div>
                </div>

                {/* Top products */}
                <div className="bg-[#0f0f0f] border border-white/[0.05] p-8">
                  <p className="text-[8px] tracking-[0.3em] uppercase text-gray-600 mb-6">Top Selling</p>
                  <div className="space-y-5">
                    {products.filter(p => p.sales > 0).sort((a, b) => b.sales - a.sales).map((p, i) => (
                      <div key={p.id} className="space-y-2">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-gray-400 truncate pr-2">{p.name}</span>
                          <span className="text-white font-mono shrink-0">{p.sales} sold</span>
                        </div>
                        <div className="h-1 bg-white/5">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${(p.sales / 48) * 100}%` }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            className="h-full bg-gold"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
