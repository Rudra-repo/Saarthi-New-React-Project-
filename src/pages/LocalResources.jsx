// src/pages/LocalResources.jsx
import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useGeolocation } from '../hooks/index'
import { PageWrapper } from '../components/index.jsx'
import { HiLocationMarker, HiPhone } from 'react-icons/hi'

const HELPLINES = [
  { labelEn: 'PM Helpline',       labelHi: 'प्रधानमंत्री हेल्पलाइन', number: '1800' },
  { labelEn: 'Women Helpline',    labelHi: 'महिला हेल्पलाइन',         number: '181' },
  { labelEn: 'Farmer Helpline',   labelHi: 'किसान हेल्पलाइन',         number: '1551' },
  { labelEn: 'Health Helpline',   labelHi: 'स्वास्थ्य हेल्पलाइन',     number: '104' },
  { labelEn: 'Child Helpline',    labelHi: 'बाल हेल्पलाइन',           number: '1098' },
  { labelEn: 'Ambulance',         labelHi: 'एम्बुलेंस',               number: '108' },
]

const MEDICAL_CAMPS = {
  en: [
    { name: 'Eye Check-up Camp', date: 'April 10', location: 'Community Hall, Ward 5', free: true },
    { name: 'Dental Camp',       date: 'April 14', location: 'PHC Nandgaon',           free: true },
    { name: 'Blood Test Drive',  date: 'April 18', location: 'Gram Panchayat Office',  free: true },
    { name: 'Cancer Screening',  date: 'April 22', location: 'District Hospital',       free: true },
  ],
  hi: [
    { name: 'नेत्र जाँच शिविर',    date: '१० अप्रैल', location: 'सामुदायिक हॉल, वार्ड ५', free: true },
    { name: 'दंत चिकित्सा शिविर',  date: '१४ अप्रैल', location: 'पीएचसी नंदगाँव',         free: true },
    { name: 'रक्त परीक्षण',        date: '१८ अप्रैल', location: 'ग्राम पंचायत कार्यालय',  free: true },
    { name: 'कैंसर जाँच',          date: '२२ अप्रैल', location: 'जिला अस्पताल',            free: true },
  ],
}

export default function LocalResources() {
  const { t, lang } = useLanguage()
  const { coords, loading, requestLocation } = useGeolocation()
  const [activeTab, setActiveTab] = useState('medical')
  const camps = MEDICAL_CAMPS[lang]

  const tabs = [
    { key: 'medical',    label: t('local.tab.medical') },
    { key: 'medicine',   label: t('local.tab.medicine') },
    { key: 'ration',     label: t('local.tab.ration') },
    { key: 'helplines',  label: t('local.tab.helplines') },
    { key: 'facilities', label: t('local.tab.facilities') },
  ]

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-primary-800 text-white px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">{t('local.title')}</h1>
          <p className="text-primary-400 text-sm mb-4">{t('local.subtitle')}</p>
          {!coords && (
            <button onClick={requestLocation} disabled={loading}
              className="flex items-center gap-2 bg-accent-600 text-primary-900 font-semibold px-4 py-2 rounded-xl text-sm hover:bg-accent-400 transition-colors disabled:opacity-60">
              <HiLocationMarker size={16} />
              {loading ? t('common.loading') : t('local.location.allow')}
            </button>
          )}
          {coords && (
            <div className="flex items-center gap-2 text-primary-400 text-sm">
              <HiLocationMarker size={16} className="text-accent-400" />
              {lang === 'hi' ? 'स्थान मिला — पास की सुविधाएँ दिखा रहे हैं' : 'Location found — showing nearby resources'}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border-b border-gray-100 sticky top-14 z-10">
        <div className="max-w-4xl mx-auto px-4 flex overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.key ? 'border-primary-600 text-primary-800' : 'border-transparent text-gray-500 hover:text-primary-600'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <PageWrapper>
        {activeTab === 'medical' && (
          <div className="space-y-3">
            {camps.map((c, i) => (
              <div key={i} className="bg-white border border-primary-100 rounded-2xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{t('common.free')}</span>
                    <h3 className="font-semibold text-primary-900 text-sm mt-2">{c.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{c.date} · {c.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'medicine' && (
          <div className="space-y-4">
            <div className="bg-primary-800 text-white rounded-2xl p-5">
              <h3 className="font-bold text-lg">{t('local.medicine.nearby')}</h3>
              <p className="text-primary-400 text-sm mt-1">{t('local.medicine.saving')}</p>
            </div>
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white border border-primary-100 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-primary-900 text-sm">
                    {lang === 'hi' ? `जन औषधि केंद्र — ${['वार्ड ३', 'बाजार चौक', 'नया बस स्टैंड'][i - 1]}` : `Jan Aushadhi — ${['Ward 3', 'Market Square', 'New Bus Stand'][i - 1]}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{i * 1.2} {t('common.km')}</p>
                </div>
                <a href="https://janaushadhi.gov.in" target="_blank" rel="noreferrer"
                  className="text-xs text-primary-600 font-semibold border border-primary-200 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors">
                  {lang === 'hi' ? 'दिशा' : 'Directions'}
                </a>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ration' && (
          <div className="space-y-4">
            {[
              { q: lang === 'hi' ? 'राशन कार्ड कैसे बनाएँ?' : 'How to get Ration Card?', a: lang === 'hi' ? 'जन सेवा केंद्र जाएँ, आधार और निवास प्रमाण लाएँ।' : 'Visit CSC centre with Aadhar and address proof.' },
              { q: lang === 'hi' ? 'क्या मिलता है?' : 'What do you get?', a: lang === 'hi' ? 'गेहूँ २ रु/किलो, चावल ३ रु/किलो, चीनी और मिट्टी तेल।' : 'Wheat ₹2/kg, Rice ₹3/kg, Sugar and kerosene.' },
              { q: lang === 'hi' ? 'कहाँ से मिलेगा?' : 'Where to collect?', a: lang === 'hi' ? 'नजदीकी उचित मूल्य दुकान से, हर माह।' : 'Nearest Fair Price Shop, every month.' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-primary-100 rounded-2xl p-4">
                <p className="font-semibold text-primary-900 text-sm mb-2">{item.q}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'helplines' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {HELPLINES.map((h, i) => (
              <a key={i} href={`tel:${h.number}`}
                className="bg-white border border-primary-100 rounded-2xl p-4 flex items-center justify-between hover:border-primary-400 transition-colors">
                <div>
                  <p className="font-semibold text-primary-900 text-sm">{lang === 'hi' ? h.labelHi : h.labelEn}</p>
                  <p className="text-2xl font-bold text-primary-800 mt-1">{h.number}</p>
                </div>
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <HiPhone size={18} className="text-primary-800" />
                </div>
              </a>
            ))}
          </div>
        )}

        {activeTab === 'facilities' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(lang === 'hi' ? [
              { title: 'मुफ़्त बस पास', desc: 'वरिष्ठ नागरिकों और विकलांगों के लिए', tag: 'निःशुल्क' },
              { title: 'सब्सिडीकृत बिजली', desc: 'पहले १०० यूनिट पर छूट', tag: 'सब्सिडी' },
              { title: 'नि:शुल्क पानी कनेक्शन', desc: 'जल जीवन मिशन — घर तक नल', tag: 'निःशुल्क' },
              { title: 'सौर ऊर्जा सब्सिडी', desc: 'सोलर पैनल पर ४०% सब्सिडी', tag: 'सब्सिडी' },
            ] : [
              { title: 'Free Bus Pass', desc: 'For senior citizens and disabled', tag: 'Free' },
              { title: 'Subsidised Electricity', desc: 'Discount on first 100 units', tag: 'Subsidy' },
              { title: 'Free Water Connection', desc: 'Jal Jeevan Mission — tap at home', tag: 'Free' },
              { title: 'Solar Subsidy', desc: '40% subsidy on solar panels', tag: 'Subsidy' },
            ]).map((f, i) => (
              <div key={i} className="bg-white border border-primary-100 rounded-2xl p-4">
                <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{f.tag}</span>
                <h3 className="font-semibold text-primary-900 text-sm mt-2">{f.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        )}
      </PageWrapper>
    </div>
  )
}
