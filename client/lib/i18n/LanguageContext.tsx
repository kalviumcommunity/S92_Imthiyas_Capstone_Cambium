"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { SupportedLocale, SUPPORTED_LOCALES, TRANSLATIONS, LocaleMetadata } from "./translations";
import { useBrowserStorageValue, writeBrowserStorageValue } from "@/lib/hooks/use-browser-storage";

interface LanguageContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: string, fallback?: string) => string;
  formatCurrency: (amount: number, overrideSymbol?: string) => string;
  formatDate: (date: string | Date, options?: Intl.DateTimeFormatOptions) => string;
  metadata: LocaleMetadata;
  supportedLocales: LocaleMetadata[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "cambium_scholarly_locale";

function isSupportedLocale(value: string | null): value is SupportedLocale {
  return value !== null && Object.prototype.hasOwnProperty.call(TRANSLATIONS, value);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const storedLocale = useBrowserStorageValue("local", STORAGE_KEY);
  const [fallbackLocale, setFallbackLocale] = useState<SupportedLocale | null>(null);
  const locale =
    fallbackLocale ?? (isSupportedLocale(storedLocale) ? storedLocale : "en");

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (newLocale: SupportedLocale) => {
    document.documentElement.lang = newLocale;
    try {
      writeBrowserStorageValue("local", STORAGE_KEY, newLocale);
      setFallbackLocale(null);
    } catch (error) {
      console.error("[LanguageProvider] Unable to persist locale preference:", error);
      setFallbackLocale(newLocale);
    }
  };

  const metadata = useMemo(() => {
    return SUPPORTED_LOCALES.find((m) => m.code === locale) || SUPPORTED_LOCALES[0];
  }, [locale]);

  const t = (key: string, fallback?: string): string => {
    const localeDict = TRANSLATIONS[locale];
    if (localeDict && localeDict[key]) {
      return localeDict[key];
    }
    // Fallback to English
    const enDict = TRANSLATIONS.en;
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return fallback || key;
  };

  const formatCurrency = (amount: number, overrideSymbol?: string): string => {
    const sym = overrideSymbol || metadata.currencySymbol;
    return `${sym}${amount.toLocaleString(locale === "en" ? "en-US" : locale)}`;
  };

  const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return d.toLocaleDateString(locale === "en" ? "en-US" : locale, options || defaultOptions);
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        t,
        formatCurrency,
        formatDate,
        metadata,
        supportedLocales: SUPPORTED_LOCALES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
