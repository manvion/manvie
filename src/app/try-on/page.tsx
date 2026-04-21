"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

// ─── Data ───────────────────────────────────────────────────────────────────

const GARMENTS = [
  // ── La Femme ──────────────────────────────────────────────────────────────
  { id: "g1",  name: "Signature Cashmere Coat", gender: "femme", category: "Outerwear",    subcategory: "",         price: "$2,400", img: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600&auto=format&fit=crop", productId: "1" },
  { id: "g2",  name: "Atelier Silk Dress",      gender: "femme", category: "Dresses",      subcategory: "",         price: "$1,850", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop", productId: "2" },
  { id: "g4",  name: "Noir Evening Gown",       gender: "femme", category: "Dresses",      subcategory: "",         price: "$4,200", img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600&auto=format&fit=crop", productId: "5" },
  { id: "g7",  name: "Ivory Wrap Dress",        gender: "femme", category: "Dresses",      subcategory: "",         price: "$1,650", img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=600&auto=format&fit=crop", productId: "11" },
  // ── L'Homme ───────────────────────────────────────────────────────────────
  { id: "g3",  name: "Classic Wool Blazer",     gender: "homme", category: "Suits",        subcategory: "",         price: "$1,500", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop", productId: "3" },
  { id: "g5",  name: "Heritage Trench Coat",    gender: "homme", category: "Outerwear",    subcategory: "",         price: "$2,800", img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop", productId: "6" },
  { id: "g6",  name: "Velvet Smoking Jacket",   gender: "homme", category: "Suits",        subcategory: "",         price: "$1,950", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop", productId: "7" },
  { id: "g14", name: "Tailored Suit",           gender: "homme", category: "Suits",        subcategory: "",         price: "$3,400", img: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=600&auto=format&fit=crop", productId: "14" },
  { id: "g16", name: "Merino Wool Coat",        gender: "homme", category: "Outerwear",    subcategory: "",         price: "$2,100", img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=600&auto=format&fit=crop", productId: "16" },
  // ── L'Enfant ──────────────────────────────────────────────────────────────
  { id: "g9",  name: "Cashmere Wrap",           gender: "enfant", category: "Outerwear",   subcategory: "",         price: "$650",   img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop", productId: "9" },
  { id: "g10", name: "Petit Pea Coat",          gender: "enfant", category: "Outerwear",   subcategory: "",         price: "$890",   img: "https://images.unsplash.com/photo-1522771930-78848d92871d?q=80&w=600&auto=format&fit=crop", productId: "10" },
  { id: "g17", name: "Silk Party Dress",        gender: "enfant", category: "Dresses",     subcategory: "",         price: "$580",   img: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=600&auto=format&fit=crop", productId: "17" },
  // ── L'Atelier — Accessories (all genders) ─────────────────────────────────
  { id: "ga1", name: "Italian Leather Handbag", gender: "unisex", category: "Accessories", subcategory: "Handbags", price: "$3,200", img: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop", productId: "4" },
  { id: "ga2", name: "18k Gold Chain Necklace", gender: "unisex", category: "Accessories", subcategory: "Jewellery",price: "$850",   img: "https://images.unsplash.com/photo-1515562141589-67f0d727b750?q=80&w=600&auto=format&fit=crop", productId: "8" },
  { id: "ga3", name: "Signature Silk Scarf",    gender: "unisex", category: "Accessories", subcategory: "Scarves",  price: "$420",   img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=600&auto=format&fit=crop", productId: "19" },
  { id: "ga4", name: "Suede Belt",              gender: "unisex", category: "Accessories", subcategory: "Belts",    price: "$490",   img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop", productId: "22" },
  { id: "ga5", name: "Diamond Stud Earrings",   gender: "unisex", category: "Accessories", subcategory: "Jewellery",price: "$2,200", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop", productId: "21" },
];

const CLOTHING_CATEGORIES = ["All", "Outerwear", "Dresses", "Suits"];
const ACCESSORY_SUBCATEGORIES = ["All", "Handbags", "Jewellery", "Scarves", "Belts"];

const AI_STEPS = [
  "Scanning body topology...",
  "Mapping garment geometry...",
  "Applying fabric simulation...",
  "Rendering photorealistic output...",
  "Finalizing couture synthesis...",
];

// ─── Types ──────────────────────────────────────────────────────────────────

interface Profile {
  id: string;
  name: string;
  type: string;
  avatar: string;
  color: string;
  gender: "femme" | "homme" | "enfant" | null;
  size: string;
  age: number | null;
}
interface TryOnResult { url: string; isMock?: boolean; garmentUrl?: string; }

const DEFAULT_PROFILES: Profile[] = [
  { id: "p1", name: "My Profile", type: "Self",    avatar: "👤", color: "#C8A96A", gender: null,     size: "",   age: null },
  { id: "p2", name: "Partner",    type: "Partner", avatar: "👥", color: "#8B9DBF", gender: null,     size: "",   age: null },
  { id: "p3", name: "Child",      type: "Child",   avatar: "🌟", color: "#B5C4A8", gender: "enfant", size: "6Y", age: 6    },
];

// ─── Image Validation ────────────────────────────────────────────────────────

function validateImage(file: File): { ok: boolean; error?: string } {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) return { ok: false, error: "Please upload a JPG or PNG image." };
  if (file.size > 12 * 1024 * 1024) return { ok: false, error: "Image must be under 12 MB." };
  return { ok: true };
}

// ─── Before / After Comparison Slider ───────────────────────────────────────

function ComparisonSlider({ before, after }: { before: string; after: string }) {
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPosition(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      updatePosition(x);
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging, updatePosition]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[3/4] overflow-hidden shadow-2xl cursor-col-resize select-none"
      onMouseDown={e => { setDragging(true); updatePosition(e.clientX); }}
      onTouchStart={e => { setDragging(true); updatePosition(e.touches[0].clientX); }}
    >
      <div className="absolute inset-0">
        <Image src={after} alt="After" fill className="object-cover" unoptimized priority />
      </div>
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image src={before} alt="Before" fill className="object-cover" unoptimized />
        <div className="absolute inset-0 bg-black/10" />
      </div>
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-[8px] tracking-[0.3em] text-white/80 uppercase px-3 py-1.5 pointer-events-none">Before</div>
      <div className="absolute top-4 right-4 bg-gold/90 backdrop-blur-sm text-[8px] tracking-[0.3em] text-black uppercase px-3 py-1.5 pointer-events-none">After</div>
      <div className="absolute top-0 bottom-0 z-20 flex items-center justify-center pointer-events-none" style={{ left: `${position}%`, transform: "translateX(-50%)" }}>
        <div className="w-[2px] h-full bg-white/80" />
        <div className="absolute w-10 h-10 rounded-full bg-white shadow-xl border border-white/30 flex items-center justify-center">
          <span className="text-black text-[10px] font-bold tracking-tight">◀▶</span>
        </div>
      </div>
    </div>
  );
}

// ─── Add Profile Modal ───────────────────────────────────────────────────────

function AddProfileModal({ onAdd, onClose }: { onAdd: (p: Profile) => void; onClose: () => void }) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"femme" | "homme" | "enfant" | null>(null);
  const [size, setSize] = useState("");
  const [age, setAge] = useState("");

  const adultSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const enfantSizes = ["2Y", "4Y", "6Y", "8Y", "10Y", "12Y"];
  const sizes = gender === "enfant" ? enfantSizes : adultSizes;

  const genderAvatars: Record<string, string> = { femme: "👩", homme: "👨", enfant: "🧒" };
  const isValid = name.trim() && gender && size;

  const submit = () => {
    if (!isValid) return;
    onAdd({
      id: `p-${Date.now()}`,
      name: name.trim(),
      type: gender === "enfant" ? "Child" : "Self",
      avatar: genderAvatars[gender!] ?? "👤",
      color: `hsl(${Math.floor(Math.random() * 360)}, 40%, 60%)`,
      gender: gender!,
      size,
      age: age ? parseInt(age) : null,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white text-black w-full max-w-md p-10 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-[9px] tracking-[0.4em] text-gold uppercase mb-1">Atelier</p>
            <h3 className="font-serif text-2xl">Add Fitting Profile</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors text-xl">✕</button>
        </div>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-500 mb-2">Profile Name</label>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              placeholder="e.g., Sophie"
              className="w-full border-b border-gray-200 focus:border-black pb-2 outline-none text-sm transition-colors"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-500 mb-3">
              Gender <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["femme", "homme", "enfant"] as const).map(g => (
                <button
                  key={g}
                  onClick={() => { setGender(g); setSize(""); }}
                  className={`py-3 text-[9px] tracking-[0.2em] uppercase border-2 transition-all ${
                    gender === g ? "border-gold bg-gold/5 text-black" : "border-gray-100 text-gray-400 hover:border-gray-300"
                  }`}
                >
                  <div className="text-xl mb-1">{genderAvatars[g]}</div>
                  {g === "femme" ? "La Femme" : g === "homme" ? "L'Homme" : "L'Enfant"}
                </button>
              ))}
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-500 mb-2">
              Age {gender === "enfant" && <span className="text-red-400">*</span>}
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={age}
              onChange={e => setAge(e.target.value)}
              placeholder={gender === "enfant" ? "e.g., 6" : "e.g., 28"}
              className="w-full border-b border-gray-200 focus:border-black pb-2 outline-none text-sm transition-colors"
            />
          </div>

          {/* Size */}
          {gender && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-500 mb-3">
                Size <span className="text-red-400">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-4 py-2 text-[9px] tracking-[0.2em] uppercase border-2 transition-all ${
                      size === s ? "border-black bg-black text-white" : "border-gray-100 text-gray-500 hover:border-black"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex gap-3 mt-10">
          <button
            onClick={submit}
            disabled={!isValid}
            className="flex-1 bg-black text-white py-4 text-[10px] tracking-[0.3em] uppercase hover:bg-gold hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Add Profile
          </button>
          <button onClick={onClose} className="px-6 border border-gray-200 text-gray-500 text-[10px] uppercase tracking-widest hover:border-black hover:text-black transition-colors">
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Complete Profile Prompt ─────────────────────────────────────────────────

function CompleteProfilePrompt({ profile, onEdit }: { profile: Profile; onEdit: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-50 border border-amber-200 p-5 text-center"
    >
      <p className="text-[9px] tracking-[0.3em] text-amber-600 uppercase mb-2">Profile Incomplete</p>
      <p className="text-sm text-amber-800 mb-4">
        {profile.name} needs gender and size set to enable garment filtering and try-on.
      </p>
      <button
        onClick={onEdit}
        className="bg-black text-white px-6 py-2.5 text-[9px] tracking-[0.3em] uppercase hover:bg-gold hover:text-black transition-colors"
      >
        Complete Profile
      </button>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

function VirtualTryOnInner() {
  const searchParams = useSearchParams();
  const productParam = searchParams.get("product");

  const [profiles, setProfiles] = useState<Profile[]>(DEFAULT_PROFILES);
  const [activeProfile, setActiveProfile] = useState<Profile>(DEFAULT_PROFILES[0]);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  const [userImages, setUserImages] = useState<Record<string, string | null>>({});
  const [selectedGarment, setSelectedGarment] = useState<typeof GARMENTS[0] | null>(null);

  // Garment tab / filters
  const [garmentTab, setGarmentTab] = useState<"clothing" | "accessories">("clothing");
  const [clothingCat, setClothingCat] = useState("All");
  const [accessorySub, setAccessorySub] = useState("All");

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [generationProgress, setGenerationProgress] = useState(0);

  const [aiResults, setAiResults] = useState<Record<string, TryOnResult | null>>({});
  const [savedLooks, setSavedLooks] = useState<{ profile: string; garment: string; url: string }[]>([]);
  const [activeTab, setActiveTab] = useState<"tryon" | "saved">("tryon");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const currentImage = userImages[activeProfile.id] ?? null;
  const currentResult = aiResults[activeProfile.id] ?? null;

  // Pre-select garment from URL param (e.g. /try-on?product=3)
  useEffect(() => {
    if (productParam) {
      const garment = GARMENTS.find(g => g.productId === productParam);
      if (garment) {
        setSelectedGarment(garment);
        setGarmentTab(garment.category === "Accessories" ? "accessories" : "clothing");
        if (garment.category !== "Accessories") setClothingCat("All");
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productParam]);

  // ── Gender-locked garment filtering ─────────────────────────────────────
  const genderAllowed = (g: typeof GARMENTS[0]) => {
    if (!activeProfile.gender) return true; // show all if no gender set
    if (g.gender === "unisex") return true;
    return g.gender === activeProfile.gender;
  };

  const visibleGarments = GARMENTS.filter(g => {
    if (!genderAllowed(g)) return false;
    if (garmentTab === "clothing") {
      if (g.category === "Accessories") return false;
      return clothingCat === "All" || g.category === clothingCat;
    } else {
      if (g.category !== "Accessories") return false;
      return accessorySub === "All" || g.subcategory === accessorySub;
    }
  });

  // ── Image upload ─────────────────────────────────────────────────────────
  const processFile = useCallback((file: File) => {
    const validation = validateImage(file);
    if (!validation.ok) { setUploadError(validation.error ?? "Invalid file."); return; }
    setUploadError(null);
    const url = URL.createObjectURL(file);
    setUserImages(prev => ({ ...prev, [activeProfile.id]: url }));
    setAiResults(prev => ({ ...prev, [activeProfile.id]: null }));
    setCompareMode(false);
  }, [activeProfile.id]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  };

  // ── Load demo photo ──────────────────────────────────────────────────────
  const loadDemoPhoto = () => {
    const demos = [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    ];
    const url = demos[profiles.indexOf(activeProfile) % demos.length];
    setUserImages(prev => ({ ...prev, [activeProfile.id]: url }));
    setAiResults(prev => ({ ...prev, [activeProfile.id]: null }));
  };

  // ── Profile management ───────────────────────────────────────────────────
  const addProfile = (p: Profile) => {
    if (editingProfile) {
      setProfiles(prev => prev.map(x => x.id === editingProfile.id ? { ...x, ...p, id: x.id } : x));
      setActiveProfile(prev => prev.id === editingProfile.id ? { ...prev, ...p, id: prev.id } : prev);
      setEditingProfile(null);
    } else {
      setProfiles(prev => [...prev, p]);
      setActiveProfile(p);
    }
    setShowAddProfile(false);
  };

  const removeProfile = (id: string) => {
    if (profiles.length <= 1) return;
    setProfiles(prev => prev.filter(p => p.id !== id));
    if (activeProfile.id === id) setActiveProfile(profiles.find(p => p.id !== id)!);
  };

  const openEditProfile = (p: Profile) => {
    setEditingProfile(p);
    setShowAddProfile(true);
  };

  // ── blob → base64 (for Replicate) ───────────────────────────────────────
  const blobToDataUri = useCallback(async (blobUrl: string): Promise<string> => {
    const res = await fetch(blobUrl);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }, []);

  // ── AI synthesis ─────────────────────────────────────────────────────────
  const handleSynthesize = async () => {
    if (!currentImage || !selectedGarment || isGenerating || !activeProfile.gender) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    const startedAt = Date.now();

    const stepTimers: ReturnType<typeof setTimeout>[] = [];
    AI_STEPS.forEach((step, i) => {
      stepTimers.push(setTimeout(() => {
        setGenerationStep(step);
        setGenerationProgress(Math.round(((i + 1) / AI_STEPS.length) * 100));
      }, i * 400)); // fast: 400ms per step
    });

    try {
      const imageToSend = currentImage.startsWith("blob:")
        ? await blobToDataUri(currentImage)
        : currentImage;

      const res = await fetch("/api/generate-tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userImage: imageToSend, garmentId: selectedGarment.img }),
      });

      const data = await res.json();
      if (data.success) {
        setAiResults(prev => ({
          ...prev,
          [activeProfile.id]: { url: data.generatedUrl, isMock: data.isMock, garmentUrl: selectedGarment.img },
        }));
      }
    } catch (err) {
      console.error("VTON error:", err);
    } finally {
      const elapsed = Date.now() - startedAt;
      const animDuration = AI_STEPS.length * 400;
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress(100);
        setTimeout(() => setGenerationProgress(0), 300);
      }, Math.max(200, animDuration - elapsed + 300));
    }
  };

  // ── Download result ──────────────────────────────────────────────────────
  const downloadResult = async () => {
    if (!currentResult) return;
    try {
      const res = await fetch(currentResult.url);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `manvie-${activeProfile.name.replace(/\s+/g, "-").toLowerCase()}-look.jpg`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch { window.open(currentResult.url, "_blank"); }
  };

  const saveLook = () => {
    if (!currentResult || !selectedGarment) return;
    setSavedLooks(prev => [...prev, { profile: activeProfile.name, garment: selectedGarment.name, url: currentResult.url }]);
  };

  const genderLabel = (g: Profile["gender"]) =>
    g === "femme" ? "La Femme" : g === "homme" ? "L'Homme" : g === "enfant" ? "L'Enfant" : null;

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#f9f8f6] text-black">

      {/* AI Processing Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/97 backdrop-blur-xl flex flex-col items-center justify-center text-white"
          >
            <div className="relative w-40 h-40 mb-14">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border border-gold/30 rounded-full" />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} className="absolute inset-3 border border-white/10 rounded-full" />
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} className="absolute inset-6 border-t-2 border-gold rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-1">
                <span className="text-[7px] tracking-[0.5em] text-gold uppercase">AI</span>
                <span className="font-serif text-lg text-white">{generationProgress}%</span>
              </div>
            </div>
            <h2 className="font-serif text-3xl mb-3 text-center px-4">Synthesizing Look</h2>
            <motion.p key={generationStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9px] tracking-[0.4em] uppercase text-gray-500 mb-12">
              {generationStep}
            </motion.p>
            <div className="w-64 h-[1px] bg-white/10 relative overflow-hidden">
              <motion.div className="absolute left-0 top-0 h-full bg-gold" initial={{ width: "0%" }} animate={{ width: `${generationProgress}%` }} transition={{ duration: 0.4, ease: "easeOut" }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add / Edit Profile Modal */}
      <AnimatePresence>
        {showAddProfile && (
          <AddProfileModal
            onAdd={addProfile}
            onClose={() => { setShowAddProfile(false); setEditingProfile(null); }}
          />
        )}
      </AnimatePresence>

      {/* ── Page Header ── */}
      <div className="pt-32 pb-0 px-8 md:px-12 max-w-[1600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-end border-b border-gray-200 pb-10 gap-4"
        >
          <div>
            <p className="text-[9px] uppercase tracking-[0.5em] text-gold mb-3">Neural Styling Engine 2.0</p>
            <h1 className="font-serif text-5xl md:text-6xl leading-none">Virtual Atelier</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex border border-gray-200">
              {(["tryon", "saved"] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 text-[9px] tracking-[0.3em] uppercase transition-colors ${activeTab === tab ? "bg-black text-white" : "text-gray-400 hover:text-black"}`}>
                  {tab === "tryon" ? "Try-On Studio" : `Saved Looks (${savedLooks.length})`}
                </button>
              ))}
            </div>
            <p className="font-sans font-light text-gray-400 text-[10px] tracking-widest uppercase hidden md:block max-w-xs text-right">
              AI-powered couture · Gender-personalised
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Saved Looks Tab ── */}
      <AnimatePresence mode="wait">
        {activeTab === "saved" && (
          <motion.div key="saved" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="px-8 md:px-12 max-w-[1600px] mx-auto py-16">
            {savedLooks.length === 0 ? (
              <div className="text-center py-32">
                <p className="font-serif text-3xl text-gray-300 mb-4">No saved looks yet</p>
                <button onClick={() => setActiveTab("tryon")} className="text-[10px] tracking-[0.3em] uppercase text-gold border-b border-gold pb-0.5">
                  Go to Try-On Studio
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {savedLooks.map((look, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="group bg-white border border-gray-100 overflow-hidden">
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                      <Image src={look.url} alt={look.garment} fill className="object-cover" unoptimized />
                    </div>
                    <div className="p-4">
                      <p className="text-[8px] tracking-[0.3em] text-gold uppercase mb-1">{look.profile}</p>
                      <p className="font-serif text-base">{look.garment}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── Try-On Studio Tab ── */}
        {activeTab === "tryon" && (
          <motion.div key="tryon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-8 md:px-12 max-w-[1600px] mx-auto py-10">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

              {/* ── Left Panel ── */}
              <div className="xl:col-span-4 space-y-5">

                {/* Family Profiles */}
                <div className="bg-white border border-gray-100 shadow-sm">
                  <div className="px-7 py-5 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-serif text-lg">Fitting Profiles</h3>
                    <button onClick={() => { setEditingProfile(null); setShowAddProfile(true); }}
                      className="text-[8px] tracking-[0.3em] uppercase text-gold border border-gold/30 hover:border-gold px-3 py-1.5 transition-colors flex items-center gap-1">
                      + Add
                    </button>
                  </div>
                  <div className="p-4 space-y-2">
                    {profiles.map(profile => (
                      <div key={profile.id} className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveProfile(profile)}
                          className={`flex-1 flex items-center gap-3 p-3.5 text-left text-[10px] uppercase tracking-widest transition-all duration-300 border ${
                            activeProfile.id === profile.id
                              ? "bg-black text-white border-black"
                              : "bg-white text-gray-500 border-gray-100 hover:border-black hover:text-black"
                          }`}
                        >
                          <span className="text-base">{profile.avatar}</span>
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-medium">{profile.name}</p>
                            <p className={`text-[8px] tracking-[0.15em] mt-0.5 ${activeProfile.id === profile.id ? "text-white/50" : "text-gray-400"}`}>
                              {profile.gender ? `${genderLabel(profile.gender)} · ${profile.size}` : "Profile incomplete"}
                              {userImages[profile.id] ? " · Photo loaded" : ""}
                              {aiResults[profile.id] ? " · Look ready" : ""}
                            </p>
                          </div>
                          {aiResults[profile.id] && <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />}
                          {!profile.gender && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
                        </button>
                        <button onClick={() => openEditProfile(profile)} className="p-3 text-gray-300 hover:text-gold transition-colors text-sm shrink-0" title="Edit profile">✎</button>
                        {profiles.length > 1 && (
                          <button onClick={() => removeProfile(profile.id)} className="p-3 text-gray-300 hover:text-red-400 transition-colors text-sm shrink-0" title="Remove">✕</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Complete Profile Prompt */}
                {!activeProfile.gender && (
                  <CompleteProfilePrompt profile={activeProfile} onEdit={() => openEditProfile(activeProfile)} />
                )}

                {/* Photo Upload */}
                <div className="bg-white border border-gray-100 shadow-sm">
                  <div className="px-7 py-5 border-b border-gray-100">
                    <h3 className="font-serif text-lg">{activeProfile.avatar} {activeProfile.name} — Photo</h3>
                    {activeProfile.gender && (
                      <p className="text-[8px] tracking-[0.2em] text-gold uppercase mt-1">
                        {genderLabel(activeProfile.gender)} · Size {activeProfile.size}
                      </p>
                    )}
                  </div>
                  <div className="p-6 space-y-3">
                    {!currentImage ? (
                      <>
                        <div
                          ref={dropRef}
                          onDragEnter={() => setIsDragging(true)}
                          onDragLeave={() => setIsDragging(false)}
                          onDragOver={e => e.preventDefault()}
                          onDrop={handleDrop}
                          onClick={() => fileRef.current?.click()}
                          className={`relative border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300 ${
                            isDragging ? "border-gold bg-gold/5" : "border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
                          }`}
                        >
                          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
                          <div className="text-3xl mb-3 opacity-30">↑</div>
                          <p className="text-[10px] tracking-[0.25em] uppercase text-gray-400">{isDragging ? "Drop photo here" : "Upload or drag photo"}</p>
                          <p className="text-[9px] text-gray-300 mt-1">JPG / PNG · Full-body recommended</p>
                        </div>
                        {uploadError && <p className="text-[9px] tracking-[0.2em] uppercase text-red-500 text-center">{uploadError}</p>}
                        <button onClick={loadDemoPhoto} className="w-full border border-gray-200 py-3 text-[9px] tracking-[0.25em] uppercase text-gray-400 hover:bg-black hover:text-white hover:border-black transition-all duration-300">
                          Load Demo Photo
                        </button>
                      </>
                    ) : (
                      <div className="space-y-3">
                        <div className="relative aspect-square overflow-hidden bg-gray-100">
                          <Image src={currentImage} alt="Profile photo" fill className="object-cover" unoptimized />
                          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur text-[8px] tracking-[0.2em] text-white uppercase px-2 py-1">{activeProfile.name}</div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => fileRef.current?.click()} className="flex-1 border border-gray-200 py-2.5 text-[9px] tracking-widest uppercase text-gray-500 hover:border-black hover:text-black transition-colors">Change</button>
                          <button onClick={() => { setUserImages(prev => ({ ...prev, [activeProfile.id]: null })); setAiResults(prev => ({ ...prev, [activeProfile.id]: null })); }} className="flex-1 border border-gray-200 py-2.5 text-[9px] tracking-widest uppercase text-gray-500 hover:border-red-400 hover:text-red-400 transition-colors">Remove</button>
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Garment Selector */}
                <div className="bg-white border border-gray-100 shadow-sm">
                  <div className="px-7 py-5 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-serif text-lg">Select Garment</h3>
                    {selectedGarment && <span className="text-[8px] tracking-[0.2em] text-gold uppercase max-w-[120px] truncate">{selectedGarment.name}</span>}
                  </div>

                  {/* Main tabs: Clothing | Accessories */}
                  <div className="flex border-b border-gray-100">
                    {(["clothing", "accessories"] as const).map(tab => (
                      <button key={tab} onClick={() => { setGarmentTab(tab); setSelectedGarment(null); }}
                        className={`flex-1 py-3 text-[9px] tracking-[0.2em] uppercase border-b-2 transition-all ${garmentTab === tab ? "border-black text-black" : "border-transparent text-gray-400 hover:text-black"}`}>
                        {tab === "clothing" ? "Clothing" : "Accessories"}
                      </button>
                    ))}
                  </div>

                  {/* Sub-filters */}
                  <div className="px-5 pt-4 flex gap-1.5 flex-wrap">
                    {garmentTab === "clothing"
                      ? CLOTHING_CATEGORIES.map(cat => (
                          <button key={cat} onClick={() => setClothingCat(cat)}
                            className={`px-3 py-1 text-[8px] tracking-[0.2em] uppercase border transition-colors ${clothingCat === cat ? "bg-black text-white border-black" : "border-gray-200 text-gray-400 hover:border-black hover:text-black"}`}>
                            {cat}
                          </button>
                        ))
                      : ACCESSORY_SUBCATEGORIES.map(sub => (
                          <button key={sub} onClick={() => setAccessorySub(sub)}
                            className={`px-3 py-1 text-[8px] tracking-[0.2em] uppercase border transition-colors ${accessorySub === sub ? "bg-gold text-black border-gold" : "border-gray-200 text-gray-400 hover:border-gold hover:text-black"}`}>
                            {sub}
                          </button>
                        ))
                    }
                  </div>

                  {/* Gender lock indicator */}
                  {activeProfile.gender && (
                    <div className="px-5 pt-3">
                      <p className="text-[8px] tracking-[0.2em] text-gray-400 uppercase">
                        Showing: {genderLabel(activeProfile.gender)} {garmentTab === "accessories" ? "" : "& L'Atelier"}
                      </p>
                    </div>
                  )}

                  <div className="p-5 grid grid-cols-2 gap-3 max-h-80 overflow-y-auto hide-scrollbar">
                    {visibleGarments.length === 0 ? (
                      <div className="col-span-2 text-center py-8 text-gray-300 text-sm">No items in this category</div>
                    ) : visibleGarments.map(g => (
                      <motion.button key={g.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedGarment(g)}
                        className={`relative aspect-[3/4] overflow-hidden border-2 transition-all duration-300 ${selectedGarment?.id === g.id ? "border-gold" : "border-transparent hover:border-gray-300"}`}
                      >
                        <Image src={g.img} alt={g.name} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-[7px] tracking-widest text-white uppercase truncate">{g.name}</p>
                          <p className="text-[7px] text-white/60">{g.price}</p>
                        </div>
                        {selectedGarment?.id === g.id && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-5 h-5 bg-gold rounded-full flex items-center justify-center text-black text-[10px]">✓</motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Synthesize CTA */}
                <motion.button
                  whileHover={currentImage && selectedGarment && activeProfile.gender ? { scale: 1.01 } : {}}
                  whileTap={currentImage && selectedGarment && activeProfile.gender ? { scale: 0.99 } : {}}
                  onClick={handleSynthesize}
                  disabled={!currentImage || !selectedGarment || isGenerating || !activeProfile.gender}
                  className="w-full bg-black text-white py-6 text-[10px] tracking-[0.4em] uppercase hover:bg-gold hover:text-black transition-all duration-500 disabled:opacity-25 disabled:cursor-not-allowed shadow-xl relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {!activeProfile.gender ? "Complete profile to try on" : isGenerating ? "Synthesizing..." : "Synthesize AI Look"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 skew-x-12" />
                </motion.button>
              </div>

              {/* ── Canvas Panel ── */}
              <div className="xl:col-span-8">
                <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                  {/* Canvas Header */}
                  <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="bg-black text-gold px-4 py-2 text-[8px] tracking-[0.3em] uppercase">
                        {activeProfile.avatar} {activeProfile.name}
                      </span>
                      {activeProfile.gender && (
                        <span className="text-[8px] tracking-[0.2em] text-gold uppercase border border-gold/30 px-3 py-1">
                          {genderLabel(activeProfile.gender)} · {activeProfile.size}
                        </span>
                      )}
                      {currentResult && !currentResult.isMock && (
                        <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-gold text-black px-4 py-2 text-[8px] tracking-[0.3em] uppercase relative overflow-hidden">
                          <span className="relative z-10">AI Synthesized</span>
                          <motion.div animate={{ x: ["-100%", "300%"] }} transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }} className="absolute inset-0 w-1/3 bg-white/30 skew-x-12" />
                        </motion.span>
                      )}
                    </div>
                    {currentResult && !currentResult.isMock && (
                      <div className="flex gap-2 flex-wrap">
                        <button onClick={() => setCompareMode(m => !m)} className={`text-[8px] tracking-[0.25em] uppercase border px-4 py-2 transition-colors ${compareMode ? "bg-black text-white border-black" : "text-gray-500 border-gray-200 hover:border-black hover:text-black"}`}>
                          {compareMode ? "▶ Result" : "◀▶ Compare"}
                        </button>
                        <button onClick={downloadResult} className="text-[8px] tracking-[0.25em] uppercase text-gray-500 border border-gray-200 px-4 py-2 hover:border-gold hover:text-gold transition-colors">↓ Download</button>
                        <button onClick={saveLook} className="text-[8px] tracking-[0.25em] uppercase text-gray-500 border border-gray-200 px-4 py-2 hover:border-gold hover:text-gold transition-colors">♡ Save</button>
                        <button onClick={() => { setAiResults(prev => ({ ...prev, [activeProfile.id]: null })); setCompareMode(false); }} className="text-[8px] tracking-[0.25em] uppercase text-gray-400 border border-gray-100 px-4 py-2 hover:border-gray-400 transition-colors">Reset</button>
                      </div>
                    )}
                  </div>

                  {/* Canvas Body */}
                  <div className="relative min-h-[70vh] flex items-center justify-center bg-[#fafaf9]">
                    {currentImage ? (
                      <div className="w-full h-full p-6 md:p-8">
                        <AnimatePresence mode="wait">
                          {currentResult && compareMode ? (
                            <motion.div key="compare" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-md mx-auto">
                              <ComparisonSlider before={currentImage} after={currentResult.url} />
                              <p className="text-center text-[9px] tracking-[0.3em] uppercase text-gray-400 mt-4">Drag slider to compare</p>
                            </motion.div>
                          ) : currentResult && !currentResult.isMock ? (
                            <motion.div key="result" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-lg mx-auto">
                              <div className="relative aspect-[3/4] overflow-hidden shadow-2xl">
                                <Image src={currentResult.url} alt="AI Try-On Result" fill className="object-cover" unoptimized priority />
                                <motion.div initial={{ y: "-2%" }} animate={{ y: "102%" }} transition={{ duration: 2, delay: 0.3, ease: "linear" }} className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent shadow-[0_0_16px_rgba(200,169,106,0.9)] z-10 pointer-events-none" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-5 left-5 right-5">
                                  <p className="text-[8px] tracking-[0.4em] text-gold uppercase mb-1">AI Generated</p>
                                  <p className="font-serif text-lg text-white">{activeProfile.name}</p>
                                  <p className="text-[10px] text-white/60 mt-0.5">Wearing {selectedGarment?.name}</p>
                                </div>
                                <div className="absolute top-4 right-4 bg-gold text-black text-[7px] tracking-[0.3em] uppercase px-3 py-1.5 font-semibold">AI Try-On</div>
                              </div>
                            </motion.div>
                          ) : currentResult?.isMock ? (
                            <motion.div key="setup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full max-w-md mx-auto text-center py-8">
                              <div className="w-16 h-16 border-2 border-dashed border-gold/40 rounded-full mx-auto mb-6 flex items-center justify-center">
                                <span className="text-gold text-2xl">✦</span>
                              </div>
                              <p className="text-[9px] tracking-[0.5em] text-gold uppercase mb-3">API Setup Required</p>
                              <h3 className="font-serif text-2xl mb-4">Enable Real AI Try-On</h3>
                              <p className="text-sm text-gray-400 mb-8 leading-relaxed">Connect a Replicate API key to generate real try-on images. Free to start.</p>
                              <div className="bg-black text-left p-5 mb-6 font-mono text-[11px] space-y-2">
                                <p className="text-gray-500"># 1. Get free key at replicate.com</p>
                                <p className="text-gray-500"># 2. Open <span className="text-gold">.env.local</span></p>
                                <p className="text-white">REPLICATE_API_TOKEN=<span className="text-gold">r8_your_token</span></p>
                                <p className="text-gray-500"># 3. Restart dev server</p>
                              </div>
                              <a href="https://replicate.com" target="_blank" rel="noopener noreferrer" className="inline-block bg-gold text-black px-8 py-3 text-[10px] tracking-[0.3em] uppercase hover:bg-black hover:text-gold transition-colors duration-300">
                                Get Free API Key →
                              </a>
                              <button onClick={() => setAiResults(prev => ({ ...prev, [activeProfile.id]: null }))} className="block mx-auto mt-4 text-[9px] tracking-widest uppercase text-gray-400 hover:text-black transition-colors">
                                Dismiss
                              </button>
                            </motion.div>
                          ) : (
                            <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative aspect-[3/4] w-full overflow-hidden shadow-lg">
                              <Image src={currentImage} alt="Your photo" fill className="object-cover opacity-90" unoptimized />
                              {selectedGarment && (
                                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                                  <div className="border border-dashed border-white/40 w-3/4 h-[55%] mt-[30%] relative flex items-start justify-center pt-4">
                                    <span className="bg-black/60 backdrop-blur-sm text-[8px] text-white tracking-[0.3em] uppercase px-3 py-1">AI Active Zone</span>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Other profile thumbnails */}
                        <div className="absolute -right-16 top-0 flex flex-col gap-2">
                          {profiles.filter(p => p.id !== activeProfile.id).map(p => (
                            <button key={p.id} onClick={() => setActiveProfile(p)}
                              className={`w-12 h-12 border flex items-center justify-center text-lg transition-all ${aiResults[p.id] ? "border-gold bg-white shadow-md" : "border-gray-200 bg-white/80"}`}
                              title={p.name}
                            >
                              {aiResults[p.id] ? (
                                <div className="relative w-full h-full overflow-hidden">
                                  <Image src={aiResults[p.id]!.url} alt={p.name} fill className="object-cover" unoptimized />
                                </div>
                              ) : userImages[p.id] ? (
                                <div className="relative w-full h-full overflow-hidden opacity-60">
                                  <Image src={userImages[p.id]!} alt={p.name} fill className="object-cover" unoptimized />
                                </div>
                              ) : (
                                <span className="text-xl">{p.avatar}</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center px-8">
                        <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity }} className="w-20 h-20 border border-dashed border-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                          <span className="text-gray-300 text-3xl">↑</span>
                        </motion.div>
                        <p className="font-serif text-3xl text-gray-300 mb-3">Atelier Canvas</p>
                        <p className="text-[10px] tracking-[0.3em] uppercase text-gray-300 mb-8">
                          Upload a photo for {activeProfile.name} to begin
                        </p>
                        <button onClick={loadDemoPhoto} className="text-[9px] tracking-[0.3em] uppercase text-gold border-b border-gold/50 pb-0.5 hover:border-gold transition-colors">
                          Load Demo Photo
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Canvas Footer */}
                  {selectedGarment && (
                    <div className="px-8 py-5 border-t border-gray-100 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-12 relative overflow-hidden">
                          <Image src={selectedGarment.img} alt={selectedGarment.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="text-[8px] tracking-[0.3em] text-gray-400 uppercase">{selectedGarment.category}{selectedGarment.subcategory ? ` · ${selectedGarment.subcategory}` : ""}</p>
                          <p className="font-serif text-sm">{selectedGarment.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="font-serif text-lg text-gray-600">{selectedGarment.price}</span>
                        <a href={`/product/${selectedGarment.productId}`} className="text-[9px] tracking-[0.3em] uppercase text-black border-b border-black hover:text-gold hover:border-gold transition-colors pb-0.5">
                          View Product →
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile summary row */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {profiles.map(p => (
                    <button key={p.id} onClick={() => setActiveProfile(p)}
                      className={`p-4 border flex items-center gap-3 transition-all duration-300 ${activeProfile.id === p.id ? "bg-black text-white border-black" : "bg-white border-gray-100 hover:border-black text-gray-600"}`}
                    >
                      <span className="text-2xl">{p.avatar}</span>
                      <div className="text-left">
                        <p className="text-[9px] tracking-[0.2em] uppercase font-medium">{p.name}</p>
                        <p className={`text-[8px] mt-0.5 ${activeProfile.id === p.id ? "text-white/50" : "text-gray-400"}`}>
                          {p.gender ? `${genderLabel(p.gender)} · ${p.size}` : "Complete profile"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function VirtualTryOn() {
  return (
    <Suspense>
      <VirtualTryOnInner />
    </Suspense>
  );
}
