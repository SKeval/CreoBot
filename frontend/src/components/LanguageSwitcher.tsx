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
      className="bg-transparent border border-gray-700 text-gray-400 hover:text-white text-xs rounded px-2 py-1 cursor-pointer focus:outline-none focus:border-gray-500 transition-colors duration-200"
      aria-label="Select language"
    >
      {LANGS.map((l) => (
        <option key={l.code} value={l.code} className="bg-gray-900 text-white">
          {l.label}
        </option>
      ))}
    </select>
  )
}
