// src/services/schemeService.js
// Handles all scheme-related Firestore operations.

import {
  collection, doc, getDocs, getDoc,
  addDoc, updateDoc, deleteDoc,
  query, where, orderBy, serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import { SCHEMES, SITUATION_KEYWORDS } from '../constants/schemes'

// ── Read ────────────────────────────────────────────

/** Returns all schemes from Firestore, falls back to static data. */
export async function getAllSchemes() {
  try {
    const snap = await getDocs(collection(db, 'schemes'))
    if (snap.empty) return SCHEMES          // fallback to seed data
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch {
    return SCHEMES
  }
}

/** Returns schemes filtered by category. */
export async function getSchemesByCategory(category) {
  if (category === 'all') return getAllSchemes()
  try {
    const q = query(collection(db, 'schemes'), where('category', '==', category))
    const snap = await getDocs(q)
    if (snap.empty) return SCHEMES.filter(s => s.category === category)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch {
    return SCHEMES.filter(s => s.category === category)
  }
}

/** Returns a single scheme by id. */
export async function getSchemeById(id) {
  try {
    const snap = await getDoc(doc(db, 'schemes', id))
    if (snap.exists()) return { id: snap.id, ...snap.data() }
    return SCHEMES.find(s => s.id === id) || null
  } catch {
    return SCHEMES.find(s => s.id === id) || null
  }
}

// ── Saved schemes (per user) ─────────────────────────

/** Saves a scheme to the user's saved list. */
export async function saveScheme(userId, schemeId) {
  try {
    await addDoc(collection(db, 'users', userId, 'savedSchemes'), {
      schemeId,
      savedAt: serverTimestamp(),
      status: 'saved',
    })
  } catch (err) {
    console.warn("Firestore saveScheme failed, using fallback:", err.message)
    const local = JSON.parse(localStorage.getItem(`savedSchemes_${userId}`) || '[]')
    local.push({ id: `local_${Date.now()}`, schemeId, savedAt: { toDate: () => new Date() }, status: 'saved' })
    localStorage.setItem(`savedSchemes_${userId}`, JSON.stringify(local))
  }
}

/** Returns all saved schemes for a user. */
export async function getSavedSchemes(userId) {
  let fallback = []
  try {
    fallback = JSON.parse(localStorage.getItem(`savedSchemes_${userId}`) || '[]')
    // reconstruct dates for local fallbacks
    fallback = fallback.map(item => ({...item, savedAt: item.savedAt?.toDate ? item.savedAt : { toDate: () => new Date(item.savedAt) }}))
    
    const snap = await getDocs(
      query(collection(db, 'users', userId, 'savedSchemes'), orderBy('savedAt', 'desc'))
    )
    return [...snap.docs.map(d => ({ id: d.id, ...d.data() })), ...fallback]
  } catch (err) {
    console.warn("Firestore getSavedSchemes failed, using fallback:", err.message)
    return fallback
  }
}

/** Updates the application status of a saved scheme. */
export async function updateSchemeStatus(userId, docId, status) {
  try {
    if (docId.startsWith('local_')) {
      let local = JSON.parse(localStorage.getItem(`savedSchemes_${userId}`) || '[]')
      local = local.map(s => s.id === docId ? { ...s, status } : s)
      localStorage.setItem(`savedSchemes_${userId}`, JSON.stringify(local))
      return
    }
    await updateDoc(doc(db, 'users', userId, 'savedSchemes', docId), { status })
  } catch (err) {
    console.warn("Firestore updateSchemeStatus failed:", err.message)
  }
}

/** Removes a scheme from saved list. */
export async function removeSavedScheme(userId, docId) {
  try {
    if (docId.startsWith('local_')) {
      let local = JSON.parse(localStorage.getItem(`savedSchemes_${userId}`) || '[]')
      local = local.filter(s => s.id !== docId)
      localStorage.setItem(`savedSchemes_${userId}`, JSON.stringify(local))
      return
    }
    await deleteDoc(doc(db, 'users', userId, 'savedSchemes', docId))
  } catch (err) {
    console.warn("Firestore removeSavedScheme failed:", err.message)
  }
}

// ── Eligibility logic ────────────────────────────────

/**
 * Pure function — takes user profile and returns list of matching schemes.
 * Rule: income <= maxIncome, state matches or scheme is 'all', etc.
 */
export function checkEligibility(schemes, userProfile) {
  const { income = 0, state = '', gender = 'all', occupation = 'all', age = 25 } = userProfile

  return schemes.filter(scheme => {
    const e = scheme.eligibility
    if (!e) return true

    const incomeOk  = e.maxIncome === null || income <= e.maxIncome
    const stateOk   = e.states === 'all'   || e.states?.includes(state)
    const genderOk  = e.gender === 'all' || gender === 'all' || e.gender === gender
    const occOk     = e.occupation === 'all' || occupation === 'all' || e.occupation === occupation
    const minAgeOk  = !e.minAge || age >= e.minAge
    const maxAgeOk  = !e.maxAge || age <= e.maxAge

    return incomeOk && stateOk && genderOk && occOk && minAgeOk && maxAgeOk
  })
}

/** Maps a free-text situation to matching scheme categories. */
export function situationToCategories(text) {
  const lower = text.toLowerCase()
  const matched = []
  for (const [cat, keywords] of Object.entries(SITUATION_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) matched.push(cat)
  }
  return matched.length ? matched : ['all']
}
