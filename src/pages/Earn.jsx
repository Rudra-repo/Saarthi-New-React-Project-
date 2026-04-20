// src/pages/Earn.jsx
import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { PageWrapper, SectionHeading } from '../components/index.jsx'
import { suggestSelfEmployment } from '../services/aiService'
import { toast } from 'react-toastify'

const TABS = ['mgnrega', 'skill', 'private', 'self']

const WAGE_TABLE = {
  en: [
    { state: 'Maharashtra', skilled: 537, semiskilled: 428, unskilled: 357 },
    { state: 'Uttar Pradesh', skilled: 421, semiskilled: 346, unskilled: 291 },
    { state: 'Bihar', skilled: 370, semiskilled: 304, unskilled: 266 },
    { state: 'Rajasthan', skilled: 467, semiskilled: 375, unskilled: 309 },
    { state: 'Madhya Pradesh', skilled: 425, semiskilled: 340, unskilled: 275 },
    { state: 'Gujarat', skilled: 480, semiskilled: 384, unskilled: 317 },
  ],
  hi: [
    { state: 'महाराष्ट्र', skilled: 537, semiskilled: 428, unskilled: 357 },
    { state: 'उत्तर प्रदेश', skilled: 421, semiskilled: 346, unskilled: 291 },
    { state: 'बिहार', skilled: 370, semiskilled: 304, unskilled: 266 },
    { state: 'राजस्थान', skilled: 467, semiskilled: 375, unskilled: 309 },
    { state: 'मध्य प्रदेश', skilled: 425, semiskilled: 340, unskilled: 275 },
    { state: 'गुजरात', skilled: 480, semiskilled: 384, unskilled: 317 },
  ],
}

const SKILL_COURSES = {
  en: [
    { name: 'Welding & Fabrication', duration: '3 months', cert: 'NSQF Level 3', org: 'ITI / PMKVY' },
    { name: 'Beauty & Wellness', duration: '3 months', cert: 'NSQF Level 3', org: 'Skill India' },
    { name: 'Plumbing', duration: '2 months', cert: 'NSQF Level 2', org: 'PMKVY Centre' },
    { name: 'Commercial Vehicle Driving', duration: '4 months', cert: 'NSQF Level 4', org: 'PMKVY' },
    { name: 'Apparel & Textile', duration: '3 months', cert: 'NSQF Level 3', org: 'Skill India' },
    { name: 'Basic IT / Data Entry', duration: '2 months', cert: 'NSQF Level 2', org: 'NIELIT' },
  ],
  hi: [
    { name: 'वेल्डिंग और फैब्रिकेशन', duration: '३ माह', cert: 'एनएसक्यूएफ स्तर ३', org: 'आईटीआई / पीएमकेवीवाई' },
    { name: 'सौंदर्य और स्वास्थ्य', duration: '३ माह', cert: 'एनएसक्यूएफ स्तर ३', org: 'स्किल इंडिया' },
    { name: 'प्लंबिंग', duration: '२ माह', cert: 'एनएसक्यूएफ स्तर २', org: 'पीएमकेवीवाई केंद्र' },
    { name: 'वाणिज्यिक वाहन चालन', duration: '४ माह', cert: 'एनएसक्यूएफ स्तर ४', org: 'पीएमकेवीवाई' },
    { name: 'परिधान और कपड़ा', duration: '३ माह', cert: 'एनएसक्यूएफ स्तर ३', org: 'स्किल इंडिया' },
    { name: 'बुनियादी आईटी / डेटा प्रविष्टि', duration: '२ माह', cert: 'एनएसक्यूएफ स्तर २', org: 'एनआईईएलआईटी' },
  ],
}

const PRIVATE_JOBS = {
  en: [
    { title: 'Factory Helper', wage: '₹400/day', type: 'Unskilled', location: '5 km', openings: 12 },
    { title: 'Construction Worker', wage: '₹450/day', type: 'Unskilled', location: '3 km', openings: 8 },
    { title: 'Farm Labour', wage: '₹350/day', type: 'Unskilled', location: '8 km', openings: 20 },
    { title: 'Delivery Partner', wage: '₹500/day', type: 'Semi-skilled', location: '2 km', openings: 5 },
    { title: 'Tailoring Worker', wage: '₹380/day', type: 'Semi-skilled', location: '4 km', openings: 3 },
  ],
  hi: [
    { title: 'कारखाना सहायक', wage: '₹४००/दिन', type: 'अकुशल', location: '५ किमी', openings: 12 },
    { title: 'निर्माण मजदूर', wage: '₹४५०/दिन', type: 'अकुशल', location: '३ किमी', openings: 8 },
    { title: 'कृषि मजदूर', wage: '₹३५०/दिन', type: 'अकुशल', location: '८ किमी', openings: 20 },
    { title: 'डिलीवरी भागीदार', wage: '₹५००/दिन', type: 'अर्ध-कुशल', location: '२ किमी', openings: 5 },
    { title: 'दर्जी कामगार', wage: '₹३८०/दिन', type: 'अर्ध-कुशल', location: '४ किमी', openings: 3 },
  ],
}

export default function Earn() {
  const { t, lang } = useLanguage()
  const { user } = useAuth()
  const { applyForJob } = useUser()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('mgnrega')

  const [skillsInput, setSkillsInput] = useState('')
  const [aiIdeas, setAiIdeas] = useState([])
  const [isAiLoading, setIsAiLoading] = useState(false)

  async function handleGetSuggestions() {
    if (!skillsInput.trim()) return
    setIsAiLoading(true)
    const ideas = await suggestSelfEmployment(skillsInput, lang)
    if (ideas && ideas.length > 0) {
      setAiIdeas(ideas)
    } else {
      toast.error(lang === 'hi' ? 'सुझाव लाने में विफल' : 'Failed to fetch suggestions')
    }
    setIsAiLoading(false)
  }

  const handleApply = async (e, jobDetails, link) => {
    e.preventDefault()
    if (!user) {
      toast.info(lang === 'hi' ? 'आवेदन करने के लिए कृपया पहले लॉगिन करें' : 'Please login first to apply')
      navigate('/login')
      return
    }
    await applyForJob(jobDetails)
    toast.success(lang === 'hi' ? 'डैशबोर्ड में जोड़ा गया! प्रपत्र खोल रहा है...' : 'Added to dashboard! Opening form...')
    window.open(link, '_blank')
  }

  const wages   = WAGE_TABLE[lang]
  const courses = SKILL_COURSES[lang]
  const jobs    = PRIVATE_JOBS[lang]

  const tabLabel = (key) => t(`earn.tab.${key}`)

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-primary-800 text-white px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">{t('earn.title')}</h1>
          <p className="text-primary-400 text-sm">{t('earn.subtitle')}</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-100 sticky top-14 z-10">
        <div className="max-w-4xl mx-auto px-4 flex overflow-x-auto gap-0 no-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary-600 text-primary-800'
                  : 'border-transparent text-gray-500 hover:text-primary-600'
              }`}
            >
              {tabLabel(tab)}
            </button>
          ))}
        </div>
      </div>

      <PageWrapper>
        {/* ── MGNREGA ── */}
        {activeTab === 'mgnrega' && (
          <div className="space-y-4">
            <div className="bg-primary-800 text-white rounded-2xl p-5">
              <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider mb-2">MGNREGA</p>
              <p className="text-2xl font-bold">{t('earn.mgnrega.wage')}</p>
              <p className="text-primary-400 text-sm mt-1">{lang === 'hi' ? 'प्रति वर्ष १०० दिन के काम की गारंटी' : '100 days of work guaranteed per year'}</p>
            </div>
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white border border-primary-100 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-xs font-semibold text-primary-600 mb-1">{t('earn.mgnrega.nearby')}</p>
                  <p className="font-semibold text-primary-900 text-sm">
                    {lang === 'hi' ? ['सड़क मरम्मत', 'नहर खुदाई', 'वृक्षारोपण'][i - 1] : ['Road Repair', 'Canal Digging', 'Tree Plantation'][i - 1]}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{lang === 'hi' ? `${i * 2}.${i} किमी दूर` : `${i * 2}.${i} km away`}</p>
                </div>
                <a 
                  href="https://docs.google.com/forms/d/e/1FAIpQLSdRriqM8cFAGxEtH13sMp-wK6U4JSKrYKHorxpbZeN1aP1uHg/viewform?usp=publish-editor" 
                  onClick={e => handleApply(e, {
                    title: `MGNREGA - ${lang === 'hi' ? ['सड़क मरम्मत', 'नहर खुदाई', 'वृक्षारोपण'][i - 1] : ['Road Repair', 'Canal Digging', 'Tree Plantation'][i - 1]}`,
                    category: 'mgnrega',
                    type: 'Government Work'
                  }, "https://docs.google.com/forms/d/e/1FAIpQLSdRriqM8cFAGxEtH13sMp-wK6U4JSKrYKHorxpbZeN1aP1uHg/viewform?usp=publish-editor")}
                  className="bg-accent-600 text-primary-900 text-xs font-bold px-4 py-2 rounded-xl hover:bg-accent-400 transition-colors"
                >
                  {t('earn.register')}
                </a>
              </div>
            ))}
          </div>
        )}

        {/* ── Skill Training ── */}
        {activeTab === 'skill' && (
          <div className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-800 font-medium">
              ✅ {t('earn.skill.free')} — {lang === 'hi' ? 'पीएमकेवीवाई द्वारा' : 'Powered by PMKVY'}
            </div>
            {courses.map((c, i) => (
              <div key={i} className="bg-white border border-primary-100 rounded-2xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-primary-900 text-sm">{c.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{t('earn.duration')}: {c.duration} · {c.org}</p>
                    <p className="text-xs text-primary-600 mt-1">{t('earn.certificate')}: {c.cert}</p>
                  </div>
                  <a 
                    href="https://www.skillindia.gov.in" 
                    onClick={e => handleApply(e, {
                      title: c.name,
                      category: 'skill',
                      type: c.org
                    }, "https://www.skillindia.gov.in")}
                    className="flex-shrink-0 text-xs font-semibold text-white bg-primary-600 px-3 py-1.5 rounded-lg hover:bg-primary-800 transition-colors"
                  >
                    {t('earn.register')}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Private Jobs ── */}
        {activeTab === 'private' && (
          <div className="space-y-3">
            {jobs.map((j, i) => (
              <div key={i} className="bg-white border border-primary-100 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-primary-900 text-sm">{j.title}</p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs font-bold text-accent-700">{j.wage}</span>
                    <span className="text-xs text-gray-500">{j.type}</span>
                    <span className="text-xs text-gray-400">{j.location}</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    {j.openings} {lang === 'hi' ? 'पद रिक्त' : 'openings'}
                  </p>
                </div>
                <a 
                  href="https://docs.google.com/forms/d/e/1FAIpQLSdRriqM8cFAGxEtH13sMp-wK6U4JSKrYKHorxpbZeN1aP1uHg/viewform?usp=publish-editor" 
                  onClick={e => handleApply(e, {
                    title: j.title,
                    category: 'private',
                    wage: j.wage,
                    location: j.location
                  }, "https://docs.google.com/forms/d/e/1FAIpQLSdRriqM8cFAGxEtH13sMp-wK6U4JSKrYKHorxpbZeN1aP1uHg/viewform?usp=publish-editor")}
                  className="inline-block bg-primary-800 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-primary-700 transition-colors"
                >
                  {t('earn.apply')}
                </a>
              </div>
            ))}
          </div>
        )}

        {/* ── Self Employment ── */}
        {activeTab === 'self' && (
          <div className="space-y-4">
            <div className="bg-white border border-primary-100 rounded-2xl p-5">
              <h3 className="font-semibold text-primary-900 mb-2">{t('earn.ai.suggest')}</h3>

              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  placeholder={lang === 'hi' ? 'अपने कौशल दर्ज करें (उदा. सिलाई, खाना पकाना)' : 'Enter your skills (e.g. stitching, cooking)'}
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleGetSuggestions()}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-800 focus:outline-none focus:border-primary-400"
                />
                <button 
                  onClick={handleGetSuggestions}
                  disabled={isAiLoading || !skillsInput.trim()}
                  className="bg-accent-600 hover:bg-accent-400 text-primary-900 font-semibold px-4 py-2 rounded-xl text-xs disabled:opacity-50 transition-colors shrink-0"
                >
                  {isAiLoading ? (lang === 'hi' ? 'खोज रहा है...' : 'Thinking...') : (lang === 'hi' ? 'पूछें AI' : 'Ask AI')}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {isAiLoading ? (
                  <div className="col-span-2 py-4 flex justify-center">
                    <div className="w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  (aiIdeas.length > 0 ? aiIdeas : (lang === 'hi'
                    ? ['इडली-डोसा स्टॉल', 'सिलाई केंद्र', 'किराना दुकान', 'मोबाइल मरम्मत', 'सब्जी ठेला', 'सौंदर्य पार्लर']
                    : ['Idli-Dosa stall', 'Tailoring unit', 'Kirana shop', 'Mobile repair', 'Vegetable cart', 'Beauty parlour']
                  )).map((idea, i) => (
                    <div key={i} className="bg-primary-50 border border-primary-100 rounded-xl p-3 text-sm text-primary-800 font-medium">
                      {idea}
                    </div>
                  ))
                )}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                {lang === 'hi'
                  ? 'मुद्रा ऋण से ₹५०,००० तक की सहायता से शुरू करें'
                  : 'Start with up to ₹50,000 support via Mudra Loan'}
              </p>
            </div>

            {/* Wage reference table */}
            <div className="bg-white border border-primary-100 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-primary-900 text-sm">{t('earn.wage.label')}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-primary-50">
                    <tr>
                      <th className="text-left px-4 py-2 text-primary-800 font-semibold">{lang === 'hi' ? 'राज्य' : 'State'}</th>
                      <th className="text-right px-3 py-2 text-primary-800 font-semibold">{t('earn.wage.skilled')}</th>
                      <th className="text-right px-3 py-2 text-primary-800 font-semibold">{t('earn.wage.semiskilled')}</th>
                      <th className="text-right px-3 py-2 text-primary-800 font-semibold">{t('earn.wage.unskilled')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wages.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 font-medium text-gray-800">{row.state}</td>
                        <td className="text-right px-3 py-2 text-gray-700">₹{row.skilled}</td>
                        <td className="text-right px-3 py-2 text-gray-700">₹{row.semiskilled}</td>
                        <td className="text-right px-3 py-2 text-gray-700">₹{row.unskilled}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </PageWrapper>
    </div>
  )
}
