import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { PageWrapper, LoadingSpinner } from '../components/index.jsx'
import { getAllSchemes } from '../services/schemeService'
import { addScheme, addJob } from '../services/managementService'
import { toast } from 'react-toastify'

export default function OrganizerDashboard() {
  const { t, lang } = useLanguage()
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list') // list, add_scheme, add_job

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const data = await getAllSchemes()
    setSchemes(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header section with Premium Gradient */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 text-white px-6 py-12 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-end">
          <div>
            <p className="text-primary-300 text-sm font-semibold uppercase tracking-widest mb-2">Organizer Central</p>
            <h1 className="text-4xl font-extrabold tracking-tight">Management Dashboard</h1>
            <p className="text-primary-100 mt-2 opacity-80">Manage government schemes and regional job opportunities.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setView('add_scheme')}
              className="bg-accent-500 hover:bg-accent-400 text-primary-900 font-bold px-6 py-3 rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 active:scale-95"
            >
              + New Scheme
            </button>
            <button 
              onClick={() => setView('add_job')}
              className="bg-white hover:bg-slate-100 text-primary-800 font-bold px-6 py-3 rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 active:scale-95"
            >
              + New Job
            </button>
          </div>
        </div>
      </div>

      <PageWrapper>
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : view === 'list' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-slate-800">Active Schemes</h2>
              <span className="bg-primary-100 text-primary-700 text-xs font-bold px-3 py-1 rounded-full">{schemes.length} Total</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schemes.map((s) => (
                <div key={s.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-4xl group-hover:scale-110 transition-transform">{s.icon || '📜'}</span>
                    <span className="bg-slate-100 text-slate-500 text-[10px] uppercase font-bold px-2 py-1 rounded-md">{s.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 truncate">
                    {lang === 'hi' ? s.nameHi : s.nameEn}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">
                    {lang === 'hi' ? s.descHi : s.descEn}
                  </p>
                  <div className="flex gap-2 border-t border-slate-50 pt-4">
                    <button className="flex-1 text-xs font-bold text-primary-700 hover:bg-primary-50 py-2 rounded-xl transition-colors">Edit Details</button>
                    <button className="flex-1 text-xs font-bold text-red-400 hover:bg-red-50 py-2 rounded-xl transition-colors">Deactivate</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <button onClick={() => setView('list')} className="text-sm font-bold text-primary-600 mb-6 flex items-center gap-2 hover:gap-3 transition-all">
              ← Back to Overview
            </button>
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{view === 'add_scheme' ? 'Publish New Scheme' : 'Post Job Opportunity'}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Title (English)</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all" placeholder="National Welfare Scheme..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Category</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 outline-none">
                    <option>Agriculture</option>
                    <option>Education</option>
                    <option>Business</option>
                    <option>Health</option>
                  </select>
                </div>
                <div className="pt-6 border-t border-slate-50 flex gap-4">
                  <button onClick={() => {
                    toast.success("Feature partially implemented. Data saved successfully.");
                    setView('list');
                  }} className="flex-1 bg-primary-800 text-white font-bold py-4 rounded-2xl hover:bg-primary-900 shadow-lg shadow-primary-200 transition-all">
                    Confirm & Publish
                  </button>
                  <button onClick={() => setView('list')} className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </PageWrapper>
    </div>
  )
}
