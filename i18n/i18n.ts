"use client"

import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import enTranslation from "./locales/en.json"
import koTranslation from "./locales/ko.json"

// Initialize i18next
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    ko: {
      translation: koTranslation,
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false, // This is important for client components
  },
  detection: {
    order: ["localStorage", "navigator"],
    caches: ["localStorage"],
  },
})

export default i18n
