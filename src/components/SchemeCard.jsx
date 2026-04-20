// src/components/SchemeCard.jsx
import { useLanguage } from '../context/LanguageContext'
import { useUser } from '../context/UserContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { HiBookmark, HiExternalLink, HiClock } from 'react-icons/hi'

export default function SchemeCard({ scheme, compact = false }) {
  const { t, lang } = useLanguage()
  const { user } = useAuth()
  const { isSaved, saveAScheme } = useUser()
  const navigate = useNavigate()

  if (!scheme) return null

  const name    = lang === 'hi' ? scheme.nameHi    : scheme.nameEn
  const benefit = lang === 'hi' ? scheme.benefitHi : scheme.benefitEn
  const saved   = isSaved(scheme.id)

  const categoryColors = {
    housing:    'bg-blue-100 text-blue-800',
    health:     'bg-red-100 text-red-800',
    farmer:     'bg-green-100 text-green-800',
    education:  'bg-purple-100 text-purple-800',
    women:      'bg-pink-100 text-pink-800',
    loan:       'bg-amber-100 text-amber-800',
    senior:     'bg-orange-100 text-orange-800',
    disability: 'bg-gray-100 text-gray-700',
    financial:  'bg-teal-100 text-teal-800',
  }

  async function handleSave(e) {
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    if (saved) return
    await saveAScheme(scheme.id)
    toast.success(lang === 'hi' ? 'योजना सहेजी गई!' : 'Scheme saved!')
  }

  return (
    <div
      onClick={() => navigate(`/schemes/${scheme.id}`)}
      className="bg-white border border-primary-100 rounded-2xl p-4 cursor-pointer hover:border-primary-400 hover:shadow-md transition-all duration-200 flex flex-col gap-3"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-2xl shrink-0">{scheme.icon}</span>
          <div className="min-w-0 flex flex-wrap items-center">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${categoryColors[scheme.category] || 'bg-gray-100 text-gray-700'}`}>
              {t(`schemes.filter.${scheme.category}`)}
            </span>
            <span className="ml-2 text-xs text-gray-400 font-medium uppercase truncate">{t(`schemes.${scheme.type}`)}</span>
          </div>
        </div>
        <button
          onClick={handleSave}
          aria-label={saved ? t('schemes.saved') : t('schemes.save')}
          className={`shrink-0 p-1.5 rounded-lg transition-colors ${saved ? 'text-primary-600 bg-primary-50' : 'text-gray-400 hover:text-primary-600 hover:bg-primary-50'}`}
        >
          <HiBookmark size={18} />
        </button>
      </div>

      {/* Name */}
      <h3 className="font-semibold text-primary-900 text-sm leading-snug break-words">{name}</h3>

      {/* Benefit */}
      {!compact && (
        <p className="text-xs text-gray-600 leading-relaxed">{benefit}</p>
      )}

      {/* Footer */}
      <div className="flex items-center pt-1 border-t border-gray-100 gap-2">
        {scheme.amount > 0 && (
          <span className="text-sm font-bold text-primary-800">
            ₹{scheme.amount >= 100000
              ? `${(scheme.amount / 100000).toFixed(1)}L`
              : scheme.amount >= 1000
                ? `${(scheme.amount / 1000).toFixed(0)}K`
                : scheme.amount}
          </span>
        )}
        {scheme.interestRate && (
          <span className="text-sm font-bold text-accent-700">{scheme.interestRate}</span>
        )}
        {scheme.deadlineDays && (
          <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
            <HiClock size={13} />
            {scheme.deadlineDays} {t('schemes.days')}
          </span>
        )}
        <span className="text-xs text-primary-600 flex items-center gap-1 ml-auto">
          {t('schemes.apply')} <HiExternalLink size={12} />
        </span>
      </div>
    </div>
  )
}
