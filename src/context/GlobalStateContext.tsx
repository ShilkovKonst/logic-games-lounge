"use client";
import { Locale, translations } from "@/lib/locales/locale";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface GlobalContextType {
  locale: Locale;
  setLocale: (newLocale: Locale) => void;
  t: (path: string, vars?: Record<string, string | number>) => string;
}

export const GlobalStateContext = createContext<GlobalContextType | undefined>(
  undefined
);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("locale") as Locale | null;
      if (saved) setLocaleState(saved);
    }
  }, []);

  function setLocale(newLocale: Locale) {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", newLocale);
    }
  }

  function t(path: string, vars: Record<string, string | number> = {}): string {
    const keys = path.split(".");
    let value: unknown = translations[locale];

    for (const key of keys) {
      if (typeof value === "object" && value !== null) {
        value = (value as Record<string, unknown>)[key];
      } else {
        throw new Error(
          `Invalid translation path: '${path}' for locale: '${locale}'`
        );
      }
    }

    if (typeof value !== "string") {
      throw new Error(`Translation key "${path}" is not a string`);
    }
    return value.replace(/\{\{(.*?)\}\}/g, (_, v) =>
      String(vars[v.trim()] ?? "")
    );
  }

  return (
    <GlobalStateContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  const ctx = useContext(GlobalStateContext);
  if (!ctx) {
    throw new Error("useGlobalState must be used within a GlobalProvider");
  }
  return ctx;
}
