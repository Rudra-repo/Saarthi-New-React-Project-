// src/pages/Dashboard.jsx
import { useLanguage } from '../context/LanguageContext'
import { useUser } from '../context/UserContext'
import { useAuth } from '../context/AuthContext'
import { PageWrapper, StatusBadge, EmptyState, LoadingSpinner } from '../components/index.jsx'
import { getAllSchemes } from '../services/schemeService'
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Dashboard() {
  const { t, lang } = useLanguage()
  const { user } = useAuth()
  const { profile, savedSchemes, changeStatus, removeAScheme, loadingProfile, appliedJobs = [] } = useUser()
  const [allSchemes, setAll] = useState([])

  useEffect(() => { getAllSchemes().then(setAll) }, [])

  if (loadingProfile) return <LoadingSpinner fullPage />

  const statusOptions = ['saved', 'applied', 'pending', 'received']

  // Aggregate document checklist
  const savedIds = savedSchemes.map(s => s.schemeId)
  const savedDetails = allSchemes.filter(s => savedIds.includes(s.id))
  const allDocs = [...new Set(savedDetails.flatMap(s => lang === 'hi' ? (s.documentsHi || []) : (s.documentsEn || [])))]

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-primary-800 text-white px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-primary-400 text-sm">{t('dash.welcome')},</p>
          <h1 className="text-2xl font-bold">{user?.displayName || t('dash.title')}</h1>
          <div className="flex gap-4 mt-4">
            {[
              { label: t('dash.saved'),   val: savedSchemes.length },
              { label: t('dash.applied'), val: appliedJobs.length },
            ].map((m, i) => (
              <div key={i} className="bg-primary-800 rounded-2xl px-5 py-3 text-center">
                <p className="text-2xl font-bold text-accent-400">{m.val}</p>
                <p className="text-xs text-primary-400 mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <PageWrapper>
        <div className="space-y-8">
          {/* Saved Schemes */}
          <section>
            <h2 className="text-lg font-bold text-primary-900 mb-4">{t('dash.saved')}</h2>
            {savedSchemes.length === 0 ? (
              <EmptyState icon="📋" message={lang === 'hi' ? 'अभी तक कोई योजना सहेजी नहीं गई' : 'No schemes saved yet'} />
            ) : (
              <div className="space-y-3">
                {savedSchemes.map(saved => {
                  const scheme = allSchemes.find(s => s.id === saved.schemeId)
                  if (!scheme) return null
                  return (
                    <div key={saved.id} className="bg-white border border-primary-100 rounded-2xl p-4 flex items-center gap-4">
                      <span className="text-2xl">{scheme.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-primary-900 text-sm truncate">
                          {lang === 'hi' ? scheme.nameHi : scheme.nameEn}
                        </p>
                        <select
                          value={saved.status}
                          onChange={e => changeStatus(saved.id, e.target.value)}
                          className="mt-1 text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-primary-400 bg-white"
                        >
                          {statusOptions.map(s => (
                            <option key={s} value={s}>{t(`dash.status.${s}`)}</option>
                          ))}
                        </select>
                      </div>
                      <StatusBadge status={saved.status} />
                      <button onClick={() => removeAScheme(saved.id)}
                        className="text-gray-300 hover:text-red-400 transition-colors text-lg font-bold">×</button>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Applied Jobs */}
          <section>
            <h2 className="text-lg font-bold text-primary-900 mb-4">{lang === 'hi' ? 'आवेदन की गई नौकरियां' : 'Applied Jobs'}</h2>
            {appliedJobs.length === 0 ? (
              <EmptyState icon="💼" message={lang === 'hi' ? 'अभी तक कोई नौकरी के लिए आवेदन नहीं किया गया' : 'No jobs applied yet'} />
            ) : (
              <div className="space-y-3">
                {appliedJobs.map(job => (
                  <div key={job.id} className="bg-white border border-primary-100 rounded-2xl p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-primary-900 text-sm">{job.title}</p>
                      {job.appliedAt && (
                        <p className="text-xs text-gray-400">
                          {job.appliedAt.toDate ? job.appliedAt.toDate().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN') : ''}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-3">
                      {job.category && <span className="text-xs font-bold text-gray-500 uppercase">{job.category}</span>}
                      {job.type && <span className="text-xs text-gray-500">{job.type}</span>}
                      {job.wage && <span className="text-xs font-bold text-accent-700">{job.wage}</span>}
                      {job.location && <span className="text-xs text-gray-400">{job.location}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Document Checklist */}
          {allDocs.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-primary-900 mb-4">{t('dash.checklist')}</h2>
              <div className="bg-white border border-primary-100 rounded-2xl p-5">
                <p className="text-xs text-gray-500 mb-3">
                  {lang === 'hi'
                    ? 'आपकी सहेजी योजनाओं के लिए सभी आवश्यक दस्तावेज़'
                    : 'All documents needed for your saved schemes combined'}
                </p>
                <ul className="space-y-2">
                  {allDocs.map((doc, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                      <span className="w-5 h-5 border-2 border-primary-400 rounded flex-shrink-0" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </div>
      </PageWrapper>
    </div>
  )
}

// ─────────────────────────────────────────────────────

// src/pages/Community.jsx
export function Community() {
  const { t, lang } = useLanguage()
  const { user } = useAuth()
  const [stories, setStories] = useState([])
  const [storyText, setStoryText] = useState('')

  useEffect(() => {
    import('../services/userService').then(m => m.getStories().then(setStories))
  }, [])

  async function submitStory() {
    if (!storyText.trim() || !user) return
    const { addStory } = await import('../services/userService')
    await addStory(user.uid, user.displayName, storyText, '')
    setStoryText('')
    const { getStories } = await import('../services/userService')
    getStories().then(setStories)
    import('react-toastify').then(m => m.toast.success(lang === 'hi' ? 'कहानी साझा की गई!' : 'Story shared!'))
  }

  const SAMPLE_STORIES = lang === 'hi' ? [
    { name: 'रमेश — पुणे', text: 'पीएम आवास से मुझे ₹२.४ लाख मिले और मेरा पक्का घर बन गया।', scheme: 'प्रधानमंत्री आवास योजना' },
    { name: 'सुनीता — लखनऊ', text: 'मुद्रा ऋण से मैंने सिलाई केंद्र शुरू किया, अब हर महीने ₹१५,००० कमाती हूँ।', scheme: 'मुद्रा योजना' },
    { name: 'विजय — नागपुर', text: 'किसान क्रेडिट कार्ड से ४% ब्याज पर ₹२ लाख मिले, खेती आसान हो गई।', scheme: 'किसान क्रेडिट कार्ड' },
  ] : [
    { name: 'Ramesh — Pune', text: 'Got ₹2.4L from PM Awas Yojana and built my permanent house.', scheme: 'PM Awas Yojana' },
    { name: 'Sunita — Lucknow', text: 'Started a tailoring unit with Mudra loan, earning ₹15K/month now.', scheme: 'Mudra Yojana' },
    { name: 'Vijay — Nagpur', text: 'KCC gave me ₹2L at 4% interest. Farming became so much easier.', scheme: 'Kisan Credit Card' },
  ]

  const display = stories.length > 0 ? stories : SAMPLE_STORIES

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-primary-800 text-white px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">{t('community.title')}</h1>
          <p className="text-primary-400 text-sm">{t('community.subtitle')}</p>
        </div>
      </div>
      <PageWrapper>
        <div className="space-y-6">
          {user && (
            <div className="bg-white border border-primary-100 rounded-2xl p-4">
              <p className="font-semibold text-primary-900 text-sm mb-3">{t('community.add.story')}</p>
              <textarea value={storyText} onChange={e => setStoryText(e.target.value)} rows={3}
                placeholder={lang === 'hi' ? 'आपकी कहानी क्या है?' : 'What is your story?'}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-400 resize-none" />
              <button onClick={submitStory}
                className="mt-2 bg-primary-800 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-primary-800 transition-colors">
                {t('common.submit')}
              </button>
            </div>
          )}

          <h2 className="text-lg font-bold text-primary-900">{t('community.stories')}</h2>
          {display.map((s, i) => (
            <div key={s.id || i} className="bg-white border border-primary-100 rounded-2xl p-4">
              <p className="text-sm text-gray-700 leading-relaxed mb-3">"{s.text || s.storyText}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-primary-800">{s.name || s.displayName}</p>
                  {s.scheme && <p className="text-xs text-gray-400 mt-0.5">{s.scheme}</p>}
                </div>
                <button 
                  onClick={() => {
                    const text = encodeURIComponent(`Read this inspiring story on Saarthi!\n\n"${s.text || s.storyText}"\n— ${s.name || s.displayName} ${s.scheme ? `(${s.scheme})` : ''}\n\nJoin Saarthi to find your benefits!`);
                    window.open(`https://wa.me/?text=${text}`, '_blank');
                  }}
                  className="text-xs font-medium text-green-600 border border-green-200 px-3 py-1 rounded-lg hover:bg-green-50 transition-colors">
                  {t('community.share')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </PageWrapper>
    </div>
  )
}

// ─────────────────────────────────────────────────────

// src/pages/Awareness.jsx
export function Awareness() {
  const { t, lang } = useLanguage()
  const [activeTab, setActiveTab] = useState('rights')
  const tabs = ['rights', 'fraud', 'rti', 'bpl', 'calendar']

  const RIGHTS = lang === 'hi' ? [
    { title: 'श्रमिक अधिकार', desc: 'न्यूनतम मजदूरी, समय पर भुगतान, काम के घंटे सीमित, ईएसआई और पीएफ अनिवार्य है।' },
    { title: 'किरायेदार अधिकार', desc: 'मकान मालिक बिना नोटिस मकान नहीं खाली करा सकता। किराया रसीद माँगें।' },
    { title: 'किसान अधिकार', desc: 'एमएसपी पर बिक्री का अधिकार, मुफ़्त सरकारी बीज, कृषि बीमा का अधिकार।' },
  ] : [
    { title: 'Labour Rights', desc: 'Minimum wage is mandatory. PF and ESI must be provided. Working hours are limited by law.' },
    { title: 'Tenant Rights', desc: 'Landlord cannot evict without notice. Always demand a rent receipt.' },
    { title: 'Farmer Rights', desc: 'Right to sell at MSP, free government seeds, crop insurance is your right.' },
  ]

  const FRAUD_SITES = [
    'pmayojana-apply.com', 'government-schemes.net', 'ayushman-card-free.xyz', 'kisanyojana-register.in',
  ]

  const [bplAnswers, setBplAnswers] = useState({ land: 'no', livestock: 'no', appliance: 'no', income: 'no' })
  const bplScore = Object.values(bplAnswers).filter(v => v === 'yes').length
  const bplCategory = bplScore <= 1
    ? (lang === 'hi' ? 'अत्यंत गरीब (बीपीएल)' : 'Extremely Poor (BPL)')
    : bplScore <= 2
      ? (lang === 'hi' ? 'गरीब' : 'Poor')
      : (lang === 'hi' ? 'मध्यम वर्ग' : 'Middle class')

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-primary-800 text-white px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">{t('awareness.title')}</h1>
          <p className="text-primary-400 text-sm">{t('awareness.subtitle')}</p>
        </div>
      </div>

      <div className="bg-white border-b border-gray-100 sticky top-14 z-10">
        <div className="max-w-4xl mx-auto px-4 flex overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-primary-600 text-primary-800' : 'border-transparent text-gray-500 hover:text-primary-600'}`}>
              {t(`awareness.tab.${tab}`)}
            </button>
          ))}
        </div>
      </div>

      <PageWrapper>
        {activeTab === 'rights' && (
          <div className="space-y-4">
            {RIGHTS.map((r, i) => (
              <div key={i} className="bg-white border border-primary-100 rounded-2xl p-5">
                <h3 className="font-bold text-primary-900 mb-2">{r.title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'fraud' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
              ⚠️ {t('awareness.fraud.warning')}
            </div>
            <div className="bg-white border border-primary-100 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-gray-100 font-semibold text-primary-900 text-sm">
                {lang === 'hi' ? 'ज्ञात नकली वेबसाइटें' : 'Known fraudulent websites'}
              </div>
              {FRAUD_SITES.map((site, i) => (
                <div key={i} className="px-4 py-3 border-b border-gray-50 flex items-center gap-3">
                  <span className="text-red-500 font-bold text-lg">✗</span>
                  <span className="font-mono text-sm text-red-700">{site}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rti' && (
          <div className="space-y-4">
            {(lang === 'hi' ? [
              { step: '१', title: 'आरटीआई पोर्टल पर जाएँ', desc: 'rtionline.gov.in पर जाएँ' },
              { step: '२', title: 'आवेदन भरें', desc: 'हिंदी या अंग्रेजी में सूचना माँगें' },
              { step: '३', title: 'शुल्क भरें', desc: '₹१० का शुल्क, बीपीएल के लिए मुफ़्त' },
              { step: '४', title: 'उत्तर प्रतीक्षा करें', desc: '३० दिनों में उत्तर अनिवार्य है' },
            ] : [
              { step: '1', title: 'Visit RTI portal', desc: 'Go to rtionline.gov.in' },
              { step: '2', title: 'Fill application', desc: 'Request information in Hindi or English' },
              { step: '3', title: 'Pay fee', desc: '₹10 fee, free for BPL applicants' },
              { step: '4', title: 'Wait for reply', desc: 'Reply is mandatory within 30 days' },
            ]).map((s, i) => (
              <div key={i} className="bg-white border border-primary-100 rounded-2xl p-4 flex gap-4">
                <span className="w-8 h-8 bg-primary-100 text-primary-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{s.step}</span>
                <div>
                  <p className="font-semibold text-primary-900 text-sm">{s.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'bpl' && (
          <div className="bg-white border border-primary-100 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-primary-900">{t('awareness.bpl.title')}</h3>
            {[
              { key: 'land',      qEn: 'Do you own more than 2 acres of land?',   qHi: 'क्या आपके पास २ एकड़ से अधिक जमीन है?' },
              { key: 'livestock', qEn: 'Do you own more than 3 cattle?',           qHi: 'क्या आपके पास ३ से अधिक पशु हैं?' },
              { key: 'appliance', qEn: 'Do you own a refrigerator or car?',        qHi: 'क्या आपके पास फ्रिज या कार है?' },
              { key: 'income',    qEn: 'Is your monthly income above ₹10,000?',   qHi: 'क्या आपकी मासिक आय ₹१०,००० से अधिक है?' },
            ].map(q => (
              <div key={q.key}>
                <p className="text-sm text-gray-700 mb-2">{lang === 'hi' ? q.qHi : q.qEn}</p>
                <div className="flex gap-2">
                  {['yes', 'no'].map(v => (
                    <button key={v} onClick={() => setBplAnswers(a => ({ ...a, [q.key]: v }))}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${bplAnswers[q.key] === v ? 'bg-primary-800 text-white border-primary-800' : 'border-gray-200 text-gray-600 hover:border-primary-400'}`}>
                      {v === 'yes' ? (lang === 'hi' ? 'हाँ' : 'Yes') : (lang === 'hi' ? 'नहीं' : 'No')}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
              <p className="text-sm text-gray-600">{lang === 'hi' ? 'अनुमानित श्रेणी' : 'Estimated category'}</p>
              <p className="text-xl font-bold text-primary-800 mt-1">{bplCategory}</p>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="space-y-3">
            {(lang === 'hi' ? [
              { month: 'अप्रैल', scheme: 'पीएम किसान किस्त', deadline: '१५ अप्रैल' },
              { month: 'मई',    scheme: 'उज्ज्वला आवेदन',    deadline: '३१ मई' },
              { month: 'जून',   scheme: 'पीएम आवास पंजीकरण', deadline: '३० जून' },
            ] : [
              { month: 'April', scheme: 'PM Kisan Installment', deadline: 'April 15' },
              { month: 'May',   scheme: 'Ujjwala Application',  deadline: 'May 31' },
              { month: 'June',  scheme: 'PM Awas Registration', deadline: 'June 30' },
            ]).map((c, i) => (
              <div key={i} className="bg-white border border-primary-100 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400 font-medium">{c.month}</p>
                  <p className="font-semibold text-primary-900 text-sm mt-1">{c.scheme}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-red-500 font-semibold">{c.deadline}</p>
                  <p className="text-xs text-gray-400 mt-1">{lang === 'hi' ? 'अंतिम तिथि' : 'Deadline'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </PageWrapper>
    </div>
  )
}

// ─────────────────────────────────────────────────────

// src/pages/Login.jsx
export function Login() {
  const { t, lang } = useLanguage()
  const { loginWithGoogle, loginWithEmail, signupWithEmail } = useAuth()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [isSignup, setIsSignup]  = useState(false)
  const [role, setRole]          = useState('consumer') // consumer, organizer
  const [email, setEmail]        = useState('')
  const [password, setPassword]  = useState('')
  const [name, setName]          = useState('')
  const [loading, setLoading]    = useState(false)
  const [error, setError]        = useState('')

  async function handleGoogle() {
    setLoading(true); setError('')
    try {
      await loginWithGoogle()
      navigate(state?.from?.pathname || '/')
    } catch (e) { 
      setError(e.message.includes('auth/operation-not-allowed') 
        ? (lang === 'hi' ? 'Firebase में ईमेल लॉगिन अक्षम है' : 'Email login is disabled in Firebase console')
        : e.message) 
    }
    setLoading(false)
  }

  async function handleEmail(e) {
    e.preventDefault(); setLoading(true); setError('')
    try {
      if (isSignup) {
        await signupWithEmail(email, password, name, role)
      } else {
        await loginWithEmail(email, password)
      }
      navigate(state?.from?.pathname || '/')
    } catch (e) { 
      console.error(e)
      let msg = e.message
      if (msg.includes('auth/operation-not-allowed')) {
        msg = lang === 'hi' 
          ? 'Firebase में ईमेल लॉगिन अक्षम है (इसे कंसोल में सक्षम करें)' 
          : 'Email login is disabled. Please enable it in Firebase Console > Authentication.'
      } else if (msg.includes('auth/invalid-credential') || msg.includes('auth/user-not-found')) {
        msg = lang === 'hi' ? 'ईमेल या पासवर्ड गलत है' : 'Invalid email or password'
      }
      setError(msg) 
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm bg-white border border-primary-100 rounded-3xl p-8 shadow-md">
        <div className="text-center mb-6">
          <p className="text-3xl font-bold text-primary-800 mb-1">
            <span className="text-accent-600">स</span>
            {lang === 'hi' ? 'ारथी' : 'aarthi'}
          </p>
          <p className="text-sm text-gray-500">{isSignup ? t('auth.signup.title') : t('auth.login.title')}</p>
        </div>



        <button onClick={handleGoogle} disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60 mb-6 transition-all duration-200">
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" />
          {t('auth.google')}
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
          <div className="relative flex justify-center text-xs text-gray-400 bg-white px-3">{lang === 'hi' ? 'या' : 'or'}</div>
        </div>

        <form onSubmit={handleEmail} className="space-y-4">
          {isSignup && (
            <div className="space-y-1">
              <input value={name} onChange={e => setName(e.target.value)} placeholder={lang === 'hi' ? 'पूरा नाम' : 'Full name'}
                required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-50 transition-all" />
            </div>
          )}
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t('auth.email')}
            required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-50 transition-all" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t('auth.password')}
            required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-50 transition-all" />
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium border border-red-100">
              {error}
            </div>
          )}
          
          <button type="submit" disabled={loading}
            className="w-full bg-primary-800 text-white font-semibold py-3 rounded-xl hover:bg-primary-900 transition-all shadow-lg shadow-primary-200 disabled:opacity-60 transform active:scale-[0.98]">
            {loading ? t('common.loading') : isSignup ? t('auth.signup.btn') : t('auth.login.btn')}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          {isSignup ? t('auth.have.account') : t('auth.no.account')}{' '}
          <button onClick={() => setIsSignup(s => !s)} className="text-primary-600 font-bold hover:underline">
            {isSignup ? t('auth.login.btn') : t('auth.signup.btn')}
          </button>
        </p>
      </div>
    </div>
  )
}

