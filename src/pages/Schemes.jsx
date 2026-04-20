// src/pages/Schemes.jsx
import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useUser } from '../context/UserContext'
import { useAuth } from '../context/AuthContext'
import { useSchemes } from '../hooks/useSchemes'
import { useDebounce } from '../hooks/index'
import { CATEGORIES } from '../constants/schemes'
import SchemeCard from '../components/SchemeCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { EmptyState } from '../components/index.jsx'
import { toast } from 'react-toastify'
import { HiSearch, HiExternalLink, HiDocumentText, HiCheckCircle } from 'react-icons/hi'

// ── Schemes List Page ────────────────────────────────────
export default function Schemes() {
  const { t, lang } = useLanguage()
  const { profile } = useUser()
  const location = useLocation()
  const initialCategory = location.state?.filterCategories?.length ? location.state.filterCategories : 'all'
  const { schemes, loading, error, category, setCategory, searchText, setSearch, eligibleCount } = useSchemes(profile, initialCategory)
  const [rawSearch, setRawSearch] = useState('')
  const debounced = useDebounce(rawSearch, 350)

  // sync debounced → hook
  useState(() => setSearch(debounced), [debounced])

  return (
    <div className="min-h-screen bg-surface">
      {/* Page header */}
      <div className="bg-primary-800 text-white px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">{t('schemes.title')}</h1>
          <p className="text-primary-400 text-sm">{t('schemes.subtitle')}</p>
          
          <div className="flex flex-wrap gap-3 mt-4">
            {profile && (
              <div className="inline-flex items-center gap-2 bg-primary-700/50 rounded-full px-4 py-1.5 text-sm border border-primary-600/50">
                <HiCheckCircle size={16} className="text-accent-400" />
                <span className="text-primary-100 font-medium">
                  {lang === 'hi'
                    ? `आप ${eligibleCount} योजनाओं के लिए पात्र हैं`
                    : `You are eligible for ${eligibleCount} schemes`}
                </span>
              </div>
            )}
            
            {location.state?.context && (
              <div className="inline-flex items-center gap-2 bg-accent-600 rounded-full px-4 py-1.5 text-sm text-primary-900 font-bold shadow-lg animate-in fade-in slide-in-from-left-2 transition-all">
                <span>🔍</span>
                <span>{lang === 'hi' ? 'आपकी स्थिति के लिए फ़िल्टर किया गया' : 'Filtered for your situation'}</span>
                <button 
                  onClick={() => { setCategory('all'); navigate(location.pathname, { replace: true, state: {} }) }}
                  className="ml-1 hover:bg-primary-900/10 rounded-full p-0.5"
                >
                   ✕
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        {/* Search bar */}
        <div className="relative">
          <HiSearch size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={rawSearch}
            onChange={e => setRawSearch(e.target.value)}
            placeholder={t('common.search') + '...'}
            className="w-full pl-9 pr-4 py-3 bg-white border border-primary-100 rounded-xl text-sm outline-none focus:border-primary-400 transition-colors"
          />
        </div>

        {/* Category filter pills */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                (Array.isArray(category) ? category.includes(cat.id) : category === cat.id)
                  ? 'bg-primary-800 text-white border-primary-800'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400 hover:text-primary-800'
              }`}
            >
              {lang === 'hi' ? cat.labelHi : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <EmptyState icon="⚠️" message={t('common.error')} />
        ) : schemes.length === 0 ? (
          <EmptyState icon="🔍" message={lang === 'hi' ? 'कोई योजना नहीं मिली' : 'No schemes found'} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {schemes.map(s => <SchemeCard key={s.id} scheme={s} />)}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Scheme Detail Page ───────────────────────────────────
export function SchemeDetail() {
  const { id } = useParams()
  const { t, lang } = useLanguage()
  const { user } = useAuth()
  const { isSaved, saveAScheme } = useUser()
  const navigate = useNavigate()
  const { allSchemes } = useSchemes()
  const scheme = allSchemes.find(s => s.id === id)

  if (!scheme) return <LoadingSpinner fullPage />

  const name      = lang === 'hi' ? scheme.nameHi    : scheme.nameEn
  const benefit   = lang === 'hi' ? scheme.benefitHi : scheme.benefitEn
  const documents = lang === 'hi' ? scheme.documentsHi : scheme.documentsEn
  const steps     = lang === 'hi' ? scheme.stepsHi   : scheme.stepsEn
  const saved     = isSaved(scheme.id)

  async function handleSave() {
    if (!user) { navigate('/login'); return }
    await saveAScheme(scheme.id)
    toast.success(lang === 'hi' ? 'योजना सहेजी गई!' : 'Scheme saved!')
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-primary-800 text-white px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => navigate(-1)} className="text-primary-400 text-sm mb-4 hover:text-white flex items-center gap-1">
            ← {t('common.back')}
          </button>
          <div className="flex items-start gap-3">
            <span className="text-4xl">{scheme.icon}</span>
            <div>
              <h1 className="text-xl font-bold">{name}</h1>
              <p className="text-primary-400 text-sm mt-1">{benefit}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Benefit amount */}
        {scheme.amount > 0 && (
          <div className="bg-white rounded-2xl p-5 border border-primary-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('schemes.benefit')}</p>
            <p className="text-3xl font-bold text-primary-800">
              ₹{scheme.amount.toLocaleString('en-IN')}
            </p>
            {scheme.interestRate && (
              <p className="text-sm text-accent-700 mt-1">{t('loans.interest')}: {scheme.interestRate}</p>
            )}
          </div>
        )}

        {/* Documents */}
        <div className="bg-white rounded-2xl p-5 border border-primary-100">
          <h3 className="font-semibold text-primary-900 mb-3 flex items-center gap-2">
            <HiDocumentText size={18} className="text-primary-600" />
            {t('schemes.documents')}
          </h3>
          <ul className="space-y-2">
            {documents?.map((doc, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-2 h-2 rounded-full bg-primary-400 flex-shrink-0" />
                {doc}
              </li>
            ))}
          </ul>
        </div>

        {/* Application steps */}
        <div className="bg-white rounded-2xl p-5 border border-primary-100">
          <h3 className="font-semibold text-primary-900 mb-4">{t('schemes.steps')}</h3>
          <ol className="space-y-4">
            {steps?.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-100 text-primary-800 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <p className="text-sm text-gray-700 leading-relaxed pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Fraud warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
          ⚠️ {t('awareness.fraud.warning')}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saved}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors border ${
              saved
                ? 'bg-primary-50 text-primary-600 border-primary-200 cursor-default'
                : 'bg-white text-primary-800 border-primary-400 hover:bg-primary-50'
            }`}
          >
            {saved ? t('schemes.saved') : t('schemes.save')}
          </button>
          <a
            href={scheme.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 rounded-xl font-semibold text-sm bg-primary-800 text-white text-center flex items-center justify-center gap-2 hover:bg-primary-800 transition-colors"
          >
            {t('schemes.official')} <HiExternalLink size={15} />
          </a>
        </div>
      </div>
    </div>
  )
}
