"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import enTranslations from "../public/locales/en.json";
import viTranslations from "../public/locales/vi.json";

type Language = "en" | "vi";
type Translations = typeof enTranslations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  availableLanguages: Language[];
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [translations, setTranslations] =
    useState<Translations>(enTranslations);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
      setTranslations(savedLanguage === "en" ? enTranslations : viTranslations);
    }
    setIsLoading(false);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    setTranslations(lang === "en" ? enTranslations : viTranslations);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  };

  const availableLanguages: Language[] = ["en", "vi"];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t,
        availableLanguages,
        isLoading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function useTranslationDebug() {
  const { t } = useLanguage();

  return (keys: string[]) => {
    console.group("🔍 Translation Debug");
    keys.forEach((key) => {
      const result = t(key);
      console.log(`${key}: "${result}"`);
    });
    console.groupEnd();
  };
}
