"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useApp } from "@/context/AppContext";

const ALL_PRODUCTS: Record<string, { name: string; price: number; description: string; image: string; category: string; sizes: string[] }> = {
  "1": {
    name: "Manvié Signature Coat",
    price: 2400,
    description: "An iconic piece from the Manvié Atelier in Montréal. Handcrafted from pure cashmere with meticulous attention to detail, this signature coat defines modern Québécois luxury. Features structured shoulders, a flowing silhouette, and hand-stitched gold-tone interior lining.",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1500&auto=format&fit=crop",
    category: "Outerwear",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  "2": {
    name: "Manvié Atelier Silk Dress",
    price: 1850,
    description: "Pure silk charmeuse flows like liquid gold in this architectural masterpiece. Each dress is cut by hand at our Montréal atelier, featuring invisible French seams and a bias cut that moves with the body. Crafted in the heart of Québec.",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1500&auto=format&fit=crop",
    category: "Dresses",
    sizes: ["XS", "S", "M", "L"],
  },
  "3": {
    name: "Manvié Classic Blazer",
    price: 1500,
    description: "The quintessential Manvié blazer. Tailored from Italian virgin wool in our Montréal atelier with peak lapels and a single-breasted closure. Features hand-rolled buttonholes and custom Manvié monogrammed buttons.",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1500&auto=format&fit=crop",
    category: "Suits",
    sizes: ["S", "M", "L", "XL"],
  },
  "4": {
    name: "Manvié Leather Handbag",
    price: 3200,
    description: "Full-grain Italian leather shaped by Montréal master artisans. The signature lock closure is plated in 18k gold. Interior features suede lining with dedicated compartments. Each bag comes with a certificate of Québécois authenticity.",
    image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1500&auto=format&fit=crop",
    category: "Accessories",
    sizes: ["One Size"],
  },
  "5": {
    name: "Manvié Noir Evening Gown",
    price: 4200,
    description: "A breathtaking evening gown capturing the essence of Montréal nights. Crafted from layers of French tulle and organza, adorned with hand-sewn jet beading at our Vieux-Montréal atelier. The ultimate statement of Manvié luxury.",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1500&auto=format&fit=crop",
    category: "Dresses",
    sizes: ["XS", "S", "M", "L"],
  },
  "6": {
    name: "Manvié Heritage Trench",
    price: 2800,
    description: "Reinventing the classic trench with Manvié precision. Water-resistant gabardine with a detachable wool liner. Features the signature Manvié plaid interior — inspired by Québec's natural landscapes — and horn-toggle closures.",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1500&auto=format&fit=crop",
    category: "Outerwear",
    sizes: ["S", "M", "L", "XL"],
  },
  "7": {
    name: "Manvié Velvet Smoking Jacket",
    price: 1950,
    description: "Luxe Italian velvet meets impeccable tailoring from our Montréal maison. This smoking jacket features silk-satin peaked lapels, a single-button closure, and jetted pockets. For evenings that demand distinction.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1500&auto=format&fit=crop",
    category: "Suits",
    sizes: ["S", "M", "L", "XL"],
  },
  "8": {
    name: "Manvié Gold Chain Necklace",
    price: 850,
    description: "18k gold-plated links handcrafted by Manvié jewelers in Montréal. This statement necklace features an adjustable clasp and arrives in a signature Manvié leather jewellery case — a piece of Québécois artisanal excellence.",
    image: "https://images.unsplash.com/photo-1515562141589-67f0d727b750?q=80&w=1500&auto=format&fit=crop",
    category: "Accessories",
    sizes: ["One Size"],
  },
};

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = ALL_PRODUCTS[params.id] ?? ALL_PRODUCTS["1"];
  const { addItem } = useCart();
  const { t } = useApp();
  const [size, setSize] = useState("");
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  const handleAddToCart = () => {
    if (!size) { setSizeError(true); return; }
    setSizeError(false);
    addItem({
      id: params.id,
      name: product.name,
      price: product.price,
      size,
      image: product.image,
      category: product.category,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a08] text-black dark:text-white pt-24 transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-6rem)]">
        {/* Left: Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="relative h-[60vh] md:h-full w-full bg-gray-50 dark:bg-white/5"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="50vw"
          />
        </motion.div>

        {/* Right: Details */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex flex-col justify-center px-10 md:px-16 lg:px-24 py-16 overflow-y-auto"
        >
          <p className="text-[9px] uppercase tracking-[0.4em] text-gold mb-3">{product.category}</p>
          <h1 className="font-serif text-4xl md:text-5xl mb-4 leading-tight">{product.name}</h1>
          <p className="font-serif text-2xl text-gray-500 dark:text-white/50 mb-10">
            ${product.price.toLocaleString()} CAD
          </p>

          <p className="text-gray-500 dark:text-white/50 font-light leading-relaxed mb-12 text-sm">
            {product.description}
          </p>

          {/* Size Selector */}
          <div className="mb-10">
            <h3 className="text-[9px] tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
              {t.product.selectSize}
              {sizeError && (
                <motion.span
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-400 text-[9px]"
                >
                  — {t.product.sizeRequired}
                </motion.span>
              )}
            </h3>
            <div className="flex gap-3 flex-wrap">
              {product.sizes.map((s: string) => (
                <button
                  key={s}
                  onClick={() => { setSize(s); setSizeError(false); }}
                  className={`min-w-[48px] h-12 px-4 flex items-center justify-center border transition-all duration-300 text-sm ${
                    size === s
                      ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black"
                      : "border-gray-200 dark:border-white/20 hover:border-black dark:hover:border-white text-black dark:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4">
            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full py-5 px-8 text-[11px] tracking-[0.35em] uppercase transition-all duration-500 ${
                added
                  ? "bg-gold text-black"
                  : "bg-black dark:bg-white text-white dark:text-black hover:bg-gold hover:text-black"
              }`}
            >
              {added ? t.product.added : t.product.addToBag}
            </motion.button>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href={`/try-on`}
                className="flex items-center justify-center border border-black dark:border-white py-4 text-[10px] tracking-[0.25em] uppercase hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors duration-300"
              >
                {t.product.tryon}
              </Link>
              <Link
                href="/stylist"
                className="flex items-center justify-center border border-black dark:border-white py-4 text-[10px] tracking-[0.25em] uppercase hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors duration-300"
              >
                {t.product.stylist}
              </Link>
            </div>
          </div>

          {/* Details */}
          <div className="mt-14 border-t border-gray-100 dark:border-white/10 pt-8 space-y-3">
            <p className="text-[9px] tracking-[0.3em] uppercase text-gray-400 dark:text-white/40">
              ✦ {t.product.freeShipping}
            </p>
            <p className="text-[9px] tracking-[0.3em] uppercase text-gray-400 dark:text-white/40">
              ✦ {t.product.returns}
            </p>
            <p className="text-[9px] tracking-[0.3em] uppercase text-gray-400 dark:text-white/40">
              ✦ Handcrafted · Montréal, Québec
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
