'use client'

import { useLanguage } from '@/lib/LanguageContext'
import { LangCode } from '@/lib/i18n'

const LANGS: { code: LangCode; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'pt', label: 'PT' },
  { code: 'fr', label: 'FR' },
  { code: 'de', label: 'DE' },
]

export function LanguageSwitcher() {
  const { currentLang, setLang } = useLanguage()

  return (
    <select
      value={currentLang}
      onChange={(e) => setLang(e.target.value as LangCode)}
      className="bg-transparent border border-white/[0.08] text-white/60 hover:text-white text-xs rounded-[6px] px-2 py-1 cursor-pointer focus:outline-none focus:border-cb-primary transition-colors duration-150"
      aria-label="Select language"
    >
      {LANGS.map((l) => (
        <option key={l.code} value={l.code} className="bg-cb-card text-white">
          {l.label}
        </option>
      ))}
    </select>
  )
}
