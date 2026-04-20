// src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import {
  getProfile, upsertProfile,
  getSearchHistory, logSearch,
  getAppliedJobs, saveAppliedJob,
} from '../services/userService'
import {
  getSavedSchemes, saveScheme,
  removeSavedScheme, updateSchemeStatus,
} from '../services/schemeService'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const { user } = useAuth()

  const [profile, setProfile]           = useState(null)
  const [savedSchemes, setSavedSchemes] = useState([])
  const [appliedJobs, setAppliedJobs]   = useState([])
  const [history, setHistory]           = useState([])
  const [loadingProfile, setLoadingProfile] = useState(false)

  // Load profile & saved schemes when user logs in
  useEffect(() => {
    if (!user) {
      setProfile(null)
      setSavedSchemes([])
      setAppliedJobs([])
      setHistory([])
      return
    }
    setLoadingProfile(true)
    Promise.all([
      getProfile(user.uid),
      getSavedSchemes(user.uid),
      getSearchHistory(user.uid),
      getAppliedJobs(user.uid),
    ]).then(([prof, saved, hist, jobs]) => {
      setProfile(prof)
      const uniqueSchemes = []
      const seenSchemes = new Set()
      for (const s of saved) {
        if (!seenSchemes.has(s.schemeId)) {
          seenSchemes.add(s.schemeId)
          uniqueSchemes.push(s)
        }
      }
      setSavedSchemes(uniqueSchemes)
      
      setHistory(hist)
      
      const uniqueJobs = []
      const seen = new Set()
      for (const job of jobs) {
        if (!seen.has(job.title)) {
          seen.add(job.title)
          uniqueJobs.push(job)
        }
      }
      setAppliedJobs(uniqueJobs)
    }).finally(() => setLoadingProfile(false))
  }, [user])

  const updateProfile = useCallback(async (data) => {
    if (!user) return
    await upsertProfile(user.uid, data)
    setProfile(prev => ({ ...prev, ...data }))
  }, [user])

  const saveAScheme = useCallback(async (schemeId) => {
    if (!user) return
    await saveScheme(user.uid, schemeId)
    const updated = await getSavedSchemes(user.uid)
    setSavedSchemes(updated)
  }, [user])

  const removeAScheme = useCallback(async (docId) => {
    if (!user) return
    await removeSavedScheme(user.uid, docId)
    setSavedSchemes(prev => prev.filter(s => s.id !== docId))
  }, [user])

  const changeStatus = useCallback(async (docId, status) => {
    if (!user) return
    await updateSchemeStatus(user.uid, docId, status)
    setSavedSchemes(prev => prev.map(s => s.id === docId ? { ...s, status } : s))
  }, [user])

  const addToHistory = useCallback(async (query) => {
    if (!user) return
    await logSearch(user.uid, query)
    setHistory(prev => [{ query, createdAt: new Date() }, ...prev.slice(0, 19)])
  }, [user])

  const applyForJob = useCallback(async (jobDetails) => {
    if (!user) return
    
    // Deduplicate: prevent saving if already applied to this specific job
    if (appliedJobs.some(j => j.title === jobDetails.title)) {
      return
    }

    await saveAppliedJob(user.uid, jobDetails)
    // Refresh applied jobs
    const updated = await getAppliedJobs(user.uid)
    
    // Deduplicate the combined list just in case of local/cloud crossover
    const uniqueJobs = []
    const seen = new Set()
    for (const job of updated) {
      if (!seen.has(job.title)) {
        seen.add(job.title)
        uniqueJobs.push(job)
      }
    }
    setAppliedJobs(uniqueJobs)
  }, [user, appliedJobs])

  const isSaved = useCallback((schemeId) => {
    return savedSchemes.some(s => s.schemeId === schemeId)
  }, [savedSchemes])

  return (
    <UserContext.Provider value={{
      profile, loadingProfile, updateProfile,
      savedSchemes, saveAScheme, removeAScheme, changeStatus, isSaved,
      appliedJobs, applyForJob,
      history, addToHistory,
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be inside UserProvider')
  return ctx
}
