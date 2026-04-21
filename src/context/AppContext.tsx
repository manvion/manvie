"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { translations, type Language } from "@/lib/i18n";

// Recursive type that converts all string literals to string
type DeepString<T> = T extends string
  ? string
  : { [K in keyof T]: DeepString<T[K]> };

export type T = DeepString<typeof translations.en>;

interface AppContextValue {
  theme: "light" | "dark";
  toggleTheme: () => void;
  lang: Language;
  setLang: (l: Language) => void;
  t: T;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({
  children,
  initialTheme = "light",
  initialLang = "en",
}: {
  children: React.ReactNode;
  initialTheme?: "light" | "dark";
  initialLang?: Language;
}) {
  const [theme, setTheme] = useState<"light" | "dark">(initialTheme);
  const [lang, setLangState] = useState<Language>(initialLang);

  // Apply theme class to <html> and persist in cookie
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    document.cookie = `manvie-theme=${theme};path=/;max-age=31536000;samesite=lax`;
  }, [theme]);

  // Persist language in cookie
  const setLang = useCallback((l: Language) => {
    setLangState(l);
    document.cookie = `manvie-lang=${l};path=/;max-age=31536000;samesite=lax`;
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const t = translations[lang] as T;

  return (
    <AppContext.Provider value={{ theme, toggleTheme, lang, setLang, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
