// src/pages/Loans.jsx
import { useState, useMemo } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { PageWrapper } from '../components/index.jsx'

const LOANS = {
  en: [
    { id: 'mudra-shishu',   name: 'Mudra — Shishu',         max: '₹50,000',  rate: '8–10%',  who: 'New micro businesses',          tag: 'Business', url: 'https://www.mudra.org.in' },
    { id: 'mudra-kishore',  name: 'Mudra — Kishore',        max: '₹5 Lakh',  rate: '9–12%',  who: 'Existing small businesses',     tag: 'Business', url: 'https://www.mudra.org.in' },
    { id: 'mudra-tarun',    name: 'Mudra — Tarun',          max: '₹10 Lakh', rate: '10–12%', who: 'Growing enterprises',           tag: 'Business', url: 'https://www.mudra.org.in' },
    { id: 'kcc',            name: 'Kisan Credit Card',      max: '₹3 Lakh',  rate: '4%',     who: 'Farmers with land records',     tag: 'Farmer',   url: 'https://agricoop.nic.in' },
    { id: 'svnidhi',        name: 'PM SVANidhi',            max: '₹50,000',  rate: '7%',     who: 'Street vendors',                tag: 'Vendor',   url: 'https://pmsvanidhi.mohua.gov.in' },
    { id: 'shg',            name: 'SHG Group Loan',         max: '₹10 Lakh', rate: '7%',     who: 'Women Self Help Groups',        tag: 'Women',    url: 'https://nrlm.gov.in' },
    { id: 'education',      name: 'PM Vidyalakshmi',        max: '₹10 Lakh', rate: '4%',     who: 'Students in higher education',  tag: 'Education',url: 'https://www.vidyalakshmi.co.in' },
    { id: 'housing',        name: 'PM Awas Grih Rin Yojana',max: '₹6 Lakh',  rate: '6.5%',   who: 'EWS / LIG households',          tag: 'Housing',  url: 'https://pmayg.nic.in' },
  ],
  hi: [
    { id: 'mudra-shishu',   name: 'मुद्रा — शिशु',          max: '₹५०,०००',  rate: '८–१०%',  who: 'नए सूक्ष्म व्यवसाय',           tag: 'व्यवसाय',  url: 'https://www.mudra.org.in' },
    { id: 'mudra-kishore',  name: 'मुद्रा — किशोर',         max: '₹५ लाख',   rate: '९–१२%',  who: 'मौजूदा छोटे व्यवसाय',          tag: 'व्यवसाय',  url: 'https://www.mudra.org.in' },
    { id: 'mudra-tarun',    name: 'मुद्रा — तरुण',          max: '₹१० लाख',  rate: '१०–१२%', who: 'बढ़ते उद्यम',                   tag: 'व्यवसाय',  url: 'https://www.mudra.org.in' },
    { id: 'kcc',            name: 'किसान क्रेडिट कार्ड',   max: '₹३ लाख',   rate: '४%',     who: 'भूमि अभिलेख वाले किसान',       tag: 'किसान',    url: 'https://agricoop.nic.in' },
    { id: 'svnidhi',        name: 'पीएम स्वनिधि',           max: '₹५०,०००',  rate: '७%',     who: 'सड़क विक्रेता',                 tag: 'विक्रेता', url: 'https://pmsvanidhi.mohua.gov.in' },
    { id: 'shg',            name: 'स्वयं सहायता समूह ऋण',  max: '₹१० लाख',  rate: '७%',     who: 'महिला स्वयं सहायता समूह',      tag: 'महिला',    url: 'https://nrlm.gov.in' },
    { id: 'education',      name: 'पीएम विद्यालक्ष्मी',    max: '₹१० लाख',  rate: '४%',     who: 'उच्च शिक्षा के विद्यार्थी',    tag: 'शिक्षा',   url: 'https://www.vidyalakshmi.co.in' },
    { id: 'housing',        name: 'पीएम आवास गृह ऋण योजना',max: '₹६ लाख',   rate: '६.५%',   who: 'ईडब्ल्यूएस / एलआईजी परिवार',  tag: 'आवास',     url: 'https://pmayg.nic.in' },
  ],
}

export default function Loans() {
  const { t, lang } = useLanguage()
  const [amount, setAmount]   = useState(100000)
  const [rate, setRate]       = useState(8)
  const [tenure, setTenure]   = useState(24)
  const [activeTab, setActiveTab] = useState('all')

  const loans = LOANS[lang]

  // EMI calculation — useMemo so it only recalculates when inputs change
  const emi = useMemo(() => {
    const r = rate / 12 / 100
    const n = tenure
    if (!r) return { monthly: Math.round(amount / n), total: amount, interest: 0 }
    const monthly = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const total   = monthly * n
    return {
      monthly:  Math.round(monthly),
      total:    Math.round(total),
      interest: Math.round(total - amount),
    }
  }, [amount, rate, tenure])

  const tabs = [
    { key: 'all',       label: t('loans.tab.all') },
    { key: 'agri',      label: t('loans.tab.agri') },
    { key: 'business',  label: t('loans.tab.business') },
    { key: 'home',      label: t('loans.tab.home') },
    { key: 'education', label: t('loans.tab.education') },
  ]

  const tagMap = {
    all: null,
    agri: lang === 'hi' ? 'किसान' : 'Farmer',
    business: lang === 'hi' ? 'व्यवसाय' : 'Business',
    home: lang === 'hi' ? 'आवास' : 'Housing',
    education: lang === 'hi' ? 'शिक्षा' : 'Education',
  }

  const filtered = activeTab === 'all' ? loans : loans.filter(l => l.tag === tagMap[activeTab])

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-primary-800 text-white px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">{t('loans.title')}</h1>
          <p className="text-primary-400 text-sm">{t('loans.subtitle')}</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-100 sticky top-14 z-10">
        <div className="max-w-4xl mx-auto px-4 flex overflow-x-auto gap-0">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.key ? 'border-primary-600 text-primary-800' : 'border-transparent text-gray-500 hover:text-primary-600'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <PageWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Loan cards */}
          <div className="lg:col-span-2 space-y-3">
            {filtered.map(loan => (
              <div key={loan.id} className="bg-white border border-primary-100 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold bg-primary-50 text-primary-800 px-2 py-0.5 rounded-full">{loan.tag}</span>
                    </div>
                    <h3 className="font-semibold text-primary-900 text-sm mb-3">{loan.name}</h3>
                    <div className="grid grid-cols-2 gap-y-2 text-xs">
                      <div>
                        <span className="text-gray-400">{t('loans.maxamount')}</span>
                        <p className="font-bold text-primary-800 text-sm">{loan.max}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">{t('loans.interest')}</span>
                        <p className="font-bold text-accent-700 text-sm">{loan.rate}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400">{t('loans.who')}</span>
                        <p className="text-gray-700 mt-0.5">{loan.who}</p>
                      </div>
                    </div>
                  </div>
                  <a href={loan.url} target="_blank" rel="noreferrer"
                    className="flex-shrink-0 bg-primary-800 text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-primary-800 transition-colors">
                    {t('schemes.apply')}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* EMI Calculator sticky */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-primary-100 rounded-2xl p-5 lg:sticky lg:top-28">
              <h3 className="font-bold text-primary-900 mb-4">{t('loans.emi.title')}</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium">{t('loans.emi.amount')}</label>
                  <input type="number" value={amount} onChange={e => setAmount(+e.target.value)}
                    className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-400" />
                  <input type="range" min={10000} max={1000000} step={10000} value={amount}
                    onChange={e => setAmount(+e.target.value)}
                    className="w-full mt-2 accent-primary-600" />
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-medium">{t('loans.emi.rate')} — {rate}%</label>
                  <input type="range" min={4} max={20} step={0.5} value={rate}
                    onChange={e => setRate(+e.target.value)}
                    className="w-full mt-2 accent-primary-600" />
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-medium">{t('loans.emi.tenure')} — {tenure}</label>
                  <input type="range" min={6} max={120} step={6} value={tenure}
                    onChange={e => setTenure(+e.target.value)}
                    className="w-full mt-2 accent-primary-600" />
                </div>
              </div>

              <div className="mt-5 space-y-3 border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">{t('loans.emi.monthly')}</span>
                  <span className="font-bold text-primary-800">₹{emi.monthly.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">{t('loans.emi.total')}</span>
                  <span className="font-bold text-gray-800">₹{emi.total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">{lang === 'hi' ? 'कुल ब्याज' : 'Total interest'}</span>
                  <span className="font-semibold text-red-600">₹{emi.interest.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </PageWrapper>
    </div>
  )
}
