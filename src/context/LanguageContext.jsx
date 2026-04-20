// src/context/LanguageContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { translations } from '../constants/translations'
import { saveLangPreference, getLangPreference } from '../services/userService'
import { useAuth } from './AuthContext'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('en')
  const { user } = useAuth()

  // On mount — load saved preference
  useEffect(() => {
    getLangPreference(user?.uid).then(savedLang => {
      setLangState(savedLang)
      applyFontClass(savedLang)
    })
  }, [user?.uid])

  /** Applies the correct font class to <html> so Devanagari font cascades everywhere. */
  function applyFontClass(newLang) {
    document.documentElement.classList.remove('lang-en', 'lang-hi')
    document.documentElement.classList.add(`lang-${newLang}`)
  }

  /** Toggle or set language — persists to localStorage + Firestore. */
  const setLang = useCallback(async (newLang) => {
    setLangState(newLang)
    applyFontClass(newLang)
    await saveLangPreference(user?.uid, newLang)
  }, [user?.uid])

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'hi' : 'en')
  }, [lang, setLang])

  /**
   * Translation function — returns the string for the current language.
   * Usage: t('nav.schemes') → 'Schemes' | 'योजनाएँ'
   */
  const t = useCallback((key) => {
    return translations[lang]?.[key] ?? translations['en']?.[key] ?? key
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, isHindi: lang === 'hi' }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
