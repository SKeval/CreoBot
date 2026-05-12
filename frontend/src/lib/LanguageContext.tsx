'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { TRANSLATIONS, LangCode } from './i18n'

const STORAGE_KEY = 'creobot_ui_lang'

function detectLang(): LangCode {
  if (typeof navigator === 'undefined') return 'en'
  const nav = navigator.language?.slice(0, 2).toLowerCase()
  const supported: LangCode[] = ['en', 'es', 'pt', 'fr', 'de']
  return supported.includes(nav as LangCode) ? (nav as LangCode) : 'en'
}

type LanguageContextValue = {
  currentLang: LangCode
  setLang: (lang: LangCode) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextValue>({
  currentLang: 'en',
  setLang: () => {},
  t: (key) => key,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLang, setCurrentLang] = useState<LangCode>('en')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as LangCode | null
    const supported: LangCode[] = ['en', 'es', 'pt', 'fr', 'de']
    if (stored && supported.includes(stored)) {
      setCurrentLang(stored)
    } else {
      setCurrentLang(detectLang())
    }
  }, [])

  const setLang = useCallback((lang: LangCode) => {
    setCurrentLang(lang)
    localStorage.setItem(STORAGE_KEY, lang)
  }, [])

  const t = useCallback((key: string): string => {
    const parts = key.split('.')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let node: any = TRANSLATIONS[currentLang]
    for (const part of parts) {
      if (node == null) return key
      node = node[part]
    }
    return typeof node === 'string' ? node : key
  }, [currentLang])

  return (
    <LanguageContext.Provider value={{ currentLang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
