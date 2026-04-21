"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useApp } from "@/context/AppContext";

type Product = {
  id: string; name: string; price: number;
  image_url: string; category: string; badge: string | null;
};

const BADGE_COLORS: Record<string, string> = {
  "Bestseller": "bg-black text-white",
  "New": "bg-gold text-black",
  "Limited": "bg-white text-black",
};

// Internal filter keys always use the French brand names to match DB values
const CATEGORY_KEYS = ["Le Catalogue", "La Femme", "L'Homme", "L'Enfant", "L'Atelier"] as const;
type CategoryKey = typeof CATEGORY_KEYS[number];

function ShopPageInner() {
  const { t } = useApp();
  const tShop = t.shop as Record<string, string>;
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get("category") as CategoryKey) || "Le Catalogue";

  const [filter, setFilter] = useState<CategoryKey>(initialCategory);
  const [priceSort, setPriceSort] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Map DB keys to translated display labels
  const categoryLabels: Record<CategoryKey, string> = {
    "Le Catalogue": tShop.catAll,
    "La Femme": tShop.catWomen,
    "L'Homme": tShop.catMen,
    "L'Enfant": tShop.catChildren,
    "L'Atelier": tShop.catAtelier,
  };

  // Fetch products from API
  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(data => setAllProducts(data.products ?? []))
      .finally(() => setLoadingProducts(false));
  }, []);

  let filtered = allProducts.filter(p => filter === "Le Catalogue" || p.category === filter);
  if (priceSort === "low") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (priceSort === "high") filtered = [...filtered].sort((a, b) => b.price - a.price);

  const campaignBg =
    filter === "L'Homme"
      ? "https://images.unsplash.com/photo-1594938298603-c8148c4b4357?q=80&w=2000&auto=format&fit=crop"
      : filter === "L'Enfant"
      ? "https://images.unsplash.com/photo-1522771930-78848d92871d?q=80&w=2000&auto=format&fit=crop"
      : filter === "L'Atelier"
      ? "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=2000&auto=format&fit=crop"
      : "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-[#f7f6f4] text-black">

      {/* Campaign Header */}
      <div className="relative h-[65vh] w-full mt-20 overflow-hidden flex items-end pb-16 px-10 md:px-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ scale: 1.06, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-0"
          >
            <Image src={campaignBg} alt="Campaign" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/10" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10">
          <motion.p
            key={`cat-${filter}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[9px] tracking-[0.5em] uppercase text-gold mb-4"
          >
            {filter === "Le Catalogue" ? "Digital Runway" : categoryLabels[filter]}
          </motion.p>
          <motion.h1
            key={`title-${filter}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-serif text-5xl md:text-7xl text-white leading-none"
          >
            {filter === "Le Catalogue" ? "Spring / Summer '26" : categoryLabels[filter]}
          </motion.h1>
          <motion.p
            key={`count-${filter}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-[10px] tracking-[0.3em] text-white/40 uppercase mt-4"
          >
            {loadingProducts ? "Loading..." : `${filtered.length} Pieces`}
          </motion.p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="sticky top-0 z-40 bg-[#f7f6f4]/95 backdrop-blur-sm border-b border-gray-200 px-8 md:px-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col md:flex-row justify-between items-center py-5 gap-4"
        >
          {/* Category filters */}
          <div className="flex flex-wrap gap-0 text-[10px] tracking-[0.2em] font-medium uppercase">
            {CATEGORY_KEYS.map(key => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-5 py-2 transition-all duration-300 relative border-b-2 ${
                  filter === key
                    ? "text-black border-black"
                    : "text-gray-400 hover:text-black border-transparent hover:border-gray-300"
                }`}
              >
                {categoryLabels[key]}
              </button>
            ))}
          </div>

          {/* Sort & View */}
          <div className="flex items-center gap-6">
            <div className="flex gap-4 text-[9px] tracking-[0.2em] uppercase text-gray-400">
              <button
                onClick={() => setPriceSort(p => p === "low" ? "" : "low")}
                className={`hover:text-black transition-colors pb-1 border-b ${priceSort === "low" ? "text-black border-black" : "border-transparent"}`}
              >
                Price ↑
              </button>
              <button
                onClick={() => setPriceSort(p => p === "high" ? "" : "high")}
                className={`hover:text-black transition-colors pb-1 border-b ${priceSort === "high" ? "text-black border-black" : "border-transparent"}`}
              >
                Price ↓
              </button>
            </div>
            <div className="flex gap-2 border-l border-gray-200 pl-6">
              <button
                onClick={() => setView("grid")}
                className={`text-[14px] transition-colors ${view === "grid" ? "text-black" : "text-gray-300 hover:text-gray-600"}`}
              >
                ⊞
              </button>
              <button
                onClick={() => setView("list")}
                className={`text-[14px] transition-colors ${view === "list" ? "text-black" : "text-gray-300 hover:text-gray-600"}`}
              >
                ≡
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Collections Banner (shown on full catalogue) */}
      {filter === "Le Catalogue" && (
        <div className="px-8 md:px-16 pt-16 pb-8 max-w-[1600px] mx-auto">
          <p className="text-[9px] tracking-[0.5em] uppercase text-gold mb-8">{tShop.catAll}</p>
          <div className="grid grid-cols-2 gap-4 mb-16">
            {[
              { id: "ss26", name: "Spring / Summer '26", desc: "Fluid forms and natural textures", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1400&auto=format&fit=crop" },
              { id: "fw25", name: "Fall / Winter '25", desc: "Architectural silhouettes", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1400&auto=format&fit=crop" },
            ].map((col) => (
              <div key={col.id} className="relative h-48 overflow-hidden group cursor-pointer">
                <Image src={col.image} alt={col.name} fill className="object-cover transition-transform duration-[2s] group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-700" />
                <div className="absolute bottom-6 left-6">
                  <p className="font-serif text-2xl text-white">{col.name}</p>
                  <p className="text-[9px] tracking-[0.3em] text-white/60 uppercase mt-1">{col.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="pt-8 pb-32 px-8 md:px-16 max-w-[1600px] mx-auto">
        <motion.div
          layout
          className={`grid gap-x-5 gap-y-16 ${
            view === "grid"
              ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
              : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((product, idx) => (
              <Link href={`/product/${product.id}`} key={product.id}>
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: (idx % 8) * 0.06 }}
                  className="group cursor-pointer flex flex-col"
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {view === "grid" ? (
                    <>
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-5">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-[2s] ease-[0.16,1,0.3,1] group-hover:scale-[1.05]"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-700" />
                        {/* Badge */}
                        {product.badge && (
                          <div className={`absolute top-4 left-4 text-[8px] tracking-[0.2em] uppercase px-2.5 py-1.5 font-medium ${BADGE_COLORS[product.badge]}`}>
                            {product.badge}
                          </div>
                        )}
                        {/* Quick actions */}
                        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500 flex gap-2">
                          <span className="flex-1 bg-white/90 backdrop-blur text-black text-[8px] tracking-[0.2em] uppercase py-2 text-center shadow-lg">
                            {categoryLabels[product.category as CategoryKey] ?? product.category}
                          </span>
                          <Link
                            href={`/try-on?product=${product.id}`}
                            onClick={e => e.stopPropagation()}
                            className="bg-black text-white text-[8px] tracking-[0.15em] uppercase py-2 px-3 shadow-lg hover:bg-gold hover:text-black transition-colors"
                          >
                            Try
                          </Link>
                        </div>
                      </div>
                      <div>
                        <h2 className="font-sans text-[10px] tracking-[0.2em] font-medium uppercase mb-1.5 group-hover:text-gold transition-colors duration-300">
                          {product.name}
                        </h2>
                        <p className="font-serif text-gray-500 text-sm">${product.price.toLocaleString()}</p>
                      </div>
                    </>
                  ) : (
                    <div className="flex gap-6 border-b border-gray-100 pb-8 group-hover:border-gray-300 transition-colors">
                      <div className="relative w-32 h-40 overflow-hidden bg-gray-100 shrink-0">
                        <Image src={product.image_url} alt={product.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                        {product.badge && (
                          <div className={`absolute top-2 left-2 text-[7px] tracking-[0.2em] uppercase px-2 py-1 ${BADGE_COLORS[product.badge]}`}>
                            {product.badge}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-between py-1">
                        <div>
                          <p className="text-[8px] tracking-[0.3em] text-gold uppercase mb-1">{categoryLabels[product.category as CategoryKey] ?? product.category}</p>
                          <h2 className="font-serif text-xl mb-2 group-hover:text-gold transition-colors">{product.name}</h2>
                          <p className="font-sans text-2xl text-gray-400">${product.price.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-4">
                          <span className="text-[9px] tracking-[0.2em] uppercase text-gray-400 border-b border-gray-300 hover:text-black hover:border-black transition-colors pb-0.5 cursor-pointer">
                            View Details →
                          </span>
                          <Link
                            href={`/try-on?product=${product.id}`}
                            onClick={e => e.stopPropagation()}
                            className="text-[9px] tracking-[0.2em] uppercase text-gold border-b border-gold/30 hover:border-gold pb-0.5 transition-colors"
                          >
                            Virtual Try-On
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </Link>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-32">
            <p className="font-serif text-3xl text-gray-300 mb-4">No pieces found</p>
            <button onClick={() => setFilter("Le Catalogue")} className="text-[10px] tracking-[0.3em] uppercase text-gold border-b border-gold pb-0.5">
              {tShop.catAll}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopPageInner />
    </Suspense>
  );
}
