import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AppProvider } from "@/context/AppContext";
import { CartProvider } from "@/context/CartContext";
import type { Language } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://manvie.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "MANVIÉ | Haute Couture Québécoise — Montréal",
    template: "%s | MANVIÉ",
  },
  description:
    "Maison Manvié — Une maison de mode de luxe québécoise, Montréal. Haute couture artisanale, essayage virtuel IA et styliste personnel. Québécois luxury fashion house from Montréal.",
  keywords: [
    "luxury fashion", "haute couture", "Québec fashion", "Montréal fashion",
    "mode québécoise", "couture québécoise", "AI stylist", "virtual try-on",
    "Manvié", "designer clothing", "Canadian luxury", "mode canadienne",
    "essayage virtuel", "styliste IA",
  ],
  authors: [{ name: "Maison Manvié", url: BASE_URL }],
  creator: "Maison Manvié",
  publisher: "Maison Manvié",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "fr_CA",
    alternateLocale: "en_CA",
    url: BASE_URL,
    siteName: "MANVIÉ",
    title: "MANVIÉ | Haute Couture Québécoise",
    description: "Haute couture artisanale de Montréal, réimaginée par l'intelligence artificielle.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "MANVIÉ — Haute Couture Québécoise" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MANVIÉ | Haute Couture Québécoise",
    description: "Québécois luxury fashion house, Montréal.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: BASE_URL,
    languages: {
      "fr-CA": `${BASE_URL}`,
      "en-CA": `${BASE_URL}`,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a08" },
  ],
  width: "device-width",
  initialScale: 1,
};

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: "Maison Manvié",
  alternateName: "MANVIÉ",
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.svg`,
  description: "Québécois luxury fashion house from Montréal.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Montréal",
    addressRegion: "Québec",
    addressCountry: "CA",
  },
  sameAs: [],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Manvié Collections",
    itemListElement: [
      { "@type": "OfferCatalog", name: "La Femme" },
      { "@type": "OfferCatalog", name: "L'Homme" },
      { "@type": "OfferCatalog", name: "L'Enfant" },
      { "@type": "OfferCatalog", name: "L'Atelier" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Read theme + lang from cookies (SSR — prevents flash)
  const cookieStore = cookies();
  const themeCookie = cookieStore.get("manvie-theme")?.value;
  const langCookie = cookieStore.get("manvie-lang")?.value;

  const initialTheme: "light" | "dark" =
    themeCookie === "dark" ? "dark" : "light";
  const initialLang: Language =
    langCookie === "fr" ? "fr" : "en";

  return (
    <html
      lang={initialLang}
      className={`${inter.variable} ${playfair.variable} ${initialTheme === "dark" ? "dark" : ""}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-white dark:bg-[#0a0a08] text-black dark:text-white transition-colors duration-300 grain-overlay">
        <AppProvider initialTheme={initialTheme} initialLang={initialLang}>
          <CartProvider>
            <Navigation />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </AppProvider>
      </body>
    </html>
  );
}
