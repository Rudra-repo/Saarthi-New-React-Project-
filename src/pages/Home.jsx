// src/pages/Home.jsx
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMicrophone, HiSearch, HiArrowRight, HiLightningBolt } from 'react-icons/hi'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { useUser } from '../context/UserContext'
import { toast } from 'react-toastify'
import { useSchemes } from '../hooks/useSchemes'
import { useVoiceInput } from '../hooks/index'
import { analyseSituation } from '../services/aiService'
import SchemeCard from '../components/SchemeCard'
import LoadingSpinner from '../components/LoadingSpinner'

const WORK_OPPORTUNITIES = {
  en: [
    { title: 'Road repair project', wage: '₹267/day', type: 'Unskilled', distance: '2.3 km', tag: 'MGNREGA' },
    { title: 'Tree plantation drive', wage: '₹267/day', type: 'Unskilled', distance: '4.1 km', tag: 'MGNREGA' },
    { title: 'Tailoring assistant', wage: '₹350/day', type: 'Semi-skilled', distance: '1.8 km', tag: 'Private' },
  ],
  hi: [
    { title: 'सड़क मरम्मत परियोजना', wage: '₹२६७/दिन', type: 'अकुशल', distance: '२.३ किमी', tag: 'मनरेगा' },
    { title: 'वृक्षारोपण अभियान', wage: '₹२६७/दिन', type: 'अकुशल', distance: '४.१ किमी', tag: 'मनरेगा' },
    { title: 'दर्जी सहायक', wage: '₹३५०/दिन', type: 'अर्ध-कुशल', distance: '१.८ किमी', tag: 'निजी' },
  ],
}

export default function Home() {
  const { t, lang } = useLanguage()
  const { user } = useAuth()
  const { profile, addToHistory, applyForJob } = useUser()
  const { schemes, loading } = useSchemes(profile)
  const { transcript, listening, supported, startListening } = useVoiceInput(lang)
  const navigate = useNavigate()

  const [input, setInput]         = useState('')
  const [aiResult, setAiResult]   = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError]     = useState(null)
  const inputRef = useRef(null)

  // Sync voice transcript to input
  useEffect(() => {
    if (transcript) setInput(transcript)
  }, [transcript])

  const CHIPS = [
    { key: 'farmer', label: t('home.chips.farmer') },
    { key: 'job',    label: t('home.chips.job') },
    { key: 'sick',   label: t('home.chips.sick') },
    { key: 'loan',   label: t('home.chips.loan') },
    { key: 'widow',  label: t('home.chips.widow') },
    { key: 'student',label: t('home.chips.student') },
  ]

  const handleApply = async (e, jobDetails, link) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      toast.info(lang === 'hi' ? 'आवेदन करने के लिए कृपया पहले लॉगिन करें' : 'Please login first to apply')
      navigate('/login')
      return
    }
    await applyForJob(jobDetails)
    toast.success(lang === 'hi' ? 'डैशबोर्ड में जोड़ा गया! प्रपत्र खोल रहा है...' : 'Added to dashboard! Opening form...')
    window.open(link, '_blank')
  }

  async function handleAnalyse() {
    const text = input.trim()
    if (!text) return
    setAiLoading(true)
    setAiError(null)
    setAiResult(null)
    
    try {
      // Log search history (silently handle errors to not block the AI analysis)
      addToHistory(text).catch(e => console.error("History log failed:", e))
      
      const result = await analyseSituation(text, lang, profile || {})
      setAiResult(result)
    } catch (err) {
      console.error("Home AI Analysis failed:", err)
      setAiError(err.message || "Something went wrong. Please try again.")
    } finally {
      setAiLoading(false)
    }
  }

  const featuredSchemes = schemes.slice(0, 3)
  const works = WORK_OPPORTUNITIES[lang]

  return (
    <div className="min-h-screen bg-surface">

      {/* ── Hero ── */}
      <section className="bg-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-3">
            {t('home.hero.tag')}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3 whitespace-pre-line">
            {t('home.hero.headline')}
          </h1>
          <p className="text-primary-400 text-sm mb-6 max-w-xl leading-relaxed">
            {t('home.hero.sub')}
          </p>

          {/* Input box */}
          <div className="bg-primary-800 rounded-2xl p-1 flex gap-1">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAnalyse()}
              placeholder={t('home.hero.placeholder')}
              className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder-primary-400 outline-none"
            />
            {supported && (
              <button
                onClick={startListening}
                className={`p-3 rounded-xl transition-colors ${listening ? 'bg-red-500 text-white animate-pulse' : 'text-primary-400 hover:bg-primary-600 hover:text-white'}`}
                aria-label="Voice input"
              >
                <HiMicrophone size={20} />
              </button>
            )}
            <button
              onClick={handleAnalyse}
              disabled={!input.trim() || aiLoading}
              className="bg-accent-600 hover:bg-accent-400 disabled:opacity-50 text-primary-900 font-semibold px-5 py-3 rounded-xl text-sm transition-colors flex items-center gap-2"
            >
              {aiLoading ? (
                <div className="w-4 h-4 border-2 border-primary-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <HiLightningBolt size={16} />
              )}
              {lang === 'hi' ? 'खोजें' : 'Find Help'}
            </button>
          </div>

          {/* Quick chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {CHIPS.map(chip => (
              <button
                key={chip.key}
                onClick={() => { setInput(chip.label); setTimeout(handleAnalyse, 100) }}
                className="px-4 py-2 bg-primary-800 hover:bg-primary-600 text-primary-200 hover:text-white text-xs font-medium rounded-full transition-colors border border-primary-600"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Result ── */}
      <AnimatePresence>
        {(aiLoading || aiResult || aiError) && (
          <motion.section
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white border-b border-primary-100"
          >
            <div className="max-w-4xl mx-auto px-4 py-6">
              {aiLoading ? (
                <div className="flex items-center gap-3 text-primary-800 text-sm py-4">
                  <div className="w-5 h-5 border-2 border-primary-400 border-t-primary-600 rounded-full animate-spin" />
                  <span>{t('home.ai.thinking')}</span>
                </div>
              ) : aiError ? (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-800 text-sm flex flex-col gap-2">
                   <p className="font-bold">{lang === 'hi' ? 'क्षमा करें, समस्या हुई' : 'Sorry, something went wrong'}</p>
                   <p className="opacity-80">{aiError}</p>
                   <button 
                    onClick={handleAnalyse}
                    className="w-fit text-xs font-bold underline mt-2"
                   >
                     {lang === 'hi' ? 'फिर से प्रयास करें' : 'Try again'}
                   </button>
                </div>
              ) : aiResult && (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-primary-800 mb-2">{t('home.ai.result')}</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{aiResult.summary}</p>
                  </div>

                  {/* Directly show matched cards for high impact */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      {lang === 'hi' ? 'आपके लिए अनुशंसित योजनाएं' : 'Recommended Schemes for You'}
                    </p>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-1 px-1">
                      {(() => {
                        const categoryMap = {
                          'farmer': ['agriculture', 'farming', 'crop', 'kisan', 'disaster relief'],
                          'health': ['medical', 'hospital', 'disease', 'wellness'],
                          'education': ['student', 'school', 'college', 'training', 'skill'],
                          'loan': ['finance', 'credit', 'money', 'business'],
                          'housing': ['home', 'shelter', 'building'],
                          'women': ['female', 'mother', 'girl child', 'widow'],
                          'job': ['employment', 'work', 'career', 'unemployed'],
                          'senior': ['old age', 'elderly', 'pension'],
                          'disability': ['handicap', 'disabled', 'divyang']
                        }
                        
                        const suggested = (aiResult.schemeCategories || []).map(c => c.toLowerCase())
                        const normalizedIds = Object.keys(categoryMap).filter(id => 
                          suggested.includes(id) || suggested.some(s => categoryMap[id].includes(s) || s.includes(id))
                        )
                        if (normalizedIds.length === 0 && suggested.length > 0) normalizedIds.push('all')

                        return (
                          <>
                            {schemes
                              .filter(s => normalizedIds.includes(s.category) || s.category === 'all')
                              .slice(0, 5)
                              .map(s => (
                                <div key={s.id} className="min-w-[280px]">
                                  <SchemeCard scheme={s} />
                                </div>
                              ))
                            }
                            {/* View all link at the end of the scroll - pass normalized IDs */}
                            <button 
                              onClick={() => navigate('/schemes', { 
                                state: { 
                                  filterCategories: normalizedIds,
                                  context: input.trim() 
                                } 
                              })}
                              className="min-w-[140px] flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl text-primary-600 hover:bg-primary-50 hover:border-primary-200 transition-all group"
                            >
                              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                <HiArrowRight size={20} />
                              </div>
                              <span className="text-xs font-bold">{t('common.viewall')}</span>
                            </button>
                          </>
                        )
                      })()}
                    </div>
                  </div>

                  {/* Job Hook (If AI senses unemployment or job search) */}
                  {(aiResult.schemeCategories?.some(c => c.toLowerCase().includes('job') || c.toLowerCase().includes('work') || c.toLowerCase().includes('employ')) || input.toLowerCase().includes('job') || input.toLowerCase().includes('काम') || input.toLowerCase().includes('नौकरी') || input.toLowerCase().includes('unemploy')) && (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-green-900 mb-1">
                          {lang === 'hi' ? 'नौकरी खोज रहे हैं?' : 'Looking for a Job?'}
                        </p>
                        <p className="text-sm text-green-800">
                          {lang === 'hi'
                            ? 'हमारे पास आपके लिए सरकारी (मनरेगा), निजी, और कौशल आधारित काम के अवसर मौजूद हैं।'
                            : 'We have government (MGNREGA), private, and skill-based work opportunities available for you.'}
                        </p>
                      </div>
                      <button 
                        onClick={() => navigate('/earn')}
                        className="whitespace-nowrap px-6 py-2.5 bg-green-600 text-white font-bold rounded-xl shadow-sm shadow-green-200 hover:bg-green-700 hover:shadow transition-all"
                      >
                        {lang === 'hi' ? 'नौकरियाँ देखें' : 'View Job Offers'}
                      </button>
                    </div>
                  )}

                  {aiResult.immediateSteps?.length > 0 && (
                    <div className="bg-primary-50 rounded-2xl p-5 border border-primary-100">
                      <p className="text-xs font-semibold text-primary-800 uppercase tracking-wider mb-3">
                        {lang === 'hi' ? 'तुरंत क्या करें' : 'Immediate steps'}
                      </p>
                      <ul className="space-y-3">
                        {aiResult.immediateSteps.map((step, i) => (
                          <li key={i} className="flex gap-3 text-sm text-primary-900 font-medium">
                            <span className="flex-shrink-0 w-6 h-6 bg-white shadow-sm text-primary-700 rounded-full text-xs flex items-center justify-center font-bold">{i + 1}</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">

        {/* ── Featured Schemes ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-primary-900">{t('home.section.schemes')}</h2>
            <button onClick={() => navigate('/schemes')} className="text-sm text-primary-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
              {t('common.viewall')} <HiArrowRight size={15} />
            </button>
          </div>
          {loading ? <LoadingSpinner /> : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {featuredSchemes.map(s => <SchemeCard key={s.id} scheme={s} />)}
            </div>
          )}
        </section>

        {/* ── Work Nearby ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-primary-900">{t('home.section.work')}</h2>
            <button onClick={() => navigate('/earn')} className="text-sm text-primary-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
              {t('common.viewall')} <HiArrowRight size={15} />
            </button>
          </div>
          <div className="space-y-3">
            {works.map((w, i) => (
              <div key={i} className="bg-white border border-primary-100 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-primary-400 transition-colors cursor-pointer" onClick={() => navigate('/earn')}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{w.tag}</span>
                    <span className="text-xs text-gray-400">{w.distance}</span>
                  </div>
                  <p className="font-semibold text-primary-900 text-sm">{w.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{w.wage} · {w.type}</p>
                </div>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSdRriqM8cFAGxEtH13sMp-wK6U4JSKrYKHorxpbZeN1aP1uHg/viewform?usp=publish-editor"
                  onClick={e => handleApply(e, {
                    title: w.title,
                    category: w.tag.toLowerCase(),
                    wage: w.wage,
                    location: w.distance,
                    type: w.type
                  }, "https://docs.google.com/forms/d/e/1FAIpQLSdRriqM8cFAGxEtH13sMp-wK6U4JSKrYKHorxpbZeN1aP1uHg/viewform?usp=publish-editor")}
                  className="flex-shrink-0 bg-accent-600 hover:bg-accent-400 text-primary-900 text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                >
                  {t('earn.apply')}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ── Local Help Banner ── */}
        <section
          onClick={() => navigate('/local')}
          className="bg-primary-800 text-white rounded-2xl p-6 cursor-pointer hover:bg-primary-800 transition-colors"
        >
          <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider mb-2">
            {t('home.section.local')}
          </p>
          <h3 className="text-lg font-bold mb-1">
            {lang === 'hi' ? 'निःशुल्क शिविर, राशन, दवाएँ और अधिक' : 'Free camps, ration, medicines & more'}
          </h3>
          <p className="text-primary-400 text-sm">{lang === 'hi' ? 'स्थान की अनुमति देकर पास की सुविधाएँ खोजें' : 'Allow location to find resources near you'}</p>
          <div className="flex items-center gap-1 mt-4 text-accent-400 font-semibold text-sm">
            {lang === 'hi' ? 'अभी देखें' : 'Explore now'} <HiArrowRight size={16} />
          </div>
        </section>

      </div>
    </div>
  )
}
