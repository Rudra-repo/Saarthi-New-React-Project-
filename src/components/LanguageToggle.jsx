// src/components/LanguageToggle.jsx
import { useLanguage } from '../context/LanguageContext'

export default function LanguageToggle({ className = '' }) {
  const { lang, setLang } = useLanguage()

  return (
    <div
      className={`flex bg-primary-900 rounded-full p-0.5 gap-0.5 ${className}`}
      role="group"
      aria-label="Language selection"
    >
      <button
        onClick={() => setLang('en')}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
          lang === 'en'
            ? 'bg-white text-primary-800 shadow-sm'
            : 'text-primary-400 hover:text-white'
        }`}
        aria-pressed={lang === 'en'}
      >
        English
      </button>
      <button
        onClick={() => setLang('hi')}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
          lang === 'hi'
            ? 'bg-white text-primary-800 shadow-sm'
            : 'text-primary-400 hover:text-white'
        }`}
        aria-pressed={lang === 'hi'}
        style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
      >
        हिन्दी
      </button>
    </div>
  )
}
