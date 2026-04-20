// src/services/userService.js

import {
  doc, getDoc, setDoc, updateDoc,
  collection, addDoc, getDocs,
  orderBy, query, serverTimestamp, limit,
} from 'firebase/firestore'
import { db } from './firebase'

// ── Profile ──────────────────────────────────────────

/** Creates or updates a user profile in Firestore. */
export async function upsertProfile(userId, data) {
  try {
    const ref = doc(db, 'users', userId)
    await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true })
  } catch (err) {
    console.warn("Firestore upsertProfile failed:", err.message)
  }
}

/** Returns the user's profile document. */
export async function getProfile(userId) {
  try {
    const snap = await getDoc(doc(db, 'users', userId))
    return snap.exists() ? snap.data() : null
  } catch (err) {
    console.warn("Firestore getProfile failed:", err.message)
    return null
  }
}

// ── Language preference ──────────────────────────────

/** Persists language choice to Firestore + localStorage. */
export async function saveLangPreference(userId, lang) {
  localStorage.setItem('saarthi_lang', lang)
  if (userId) {
    await updateDoc(doc(db, 'users', userId), { lang })
  }
}

/** Reads language: Firestore first → localStorage → default 'en'. */
export async function getLangPreference(userId) {
  if (userId) {
    try {
      const snap = await getDoc(doc(db, 'users', userId))
      if (snap.exists() && snap.data().lang) return snap.data().lang
    } catch {/* ignore */}
  }
  return localStorage.getItem('saarthi_lang') || 'en'
}

// ── Search history ───────────────────────────────────

/** Logs a situation search query. */
export async function logSearch(userId, query) {
  if (!userId) return
  try {
    await addDoc(collection(db, 'users', userId, 'history'), {
      query,
      createdAt: serverTimestamp(),
    })
  } catch (err) {
    console.warn("Firestore logSearch failed, using fallback:", err.message)
    const local = JSON.parse(localStorage.getItem(`history_${userId}`) || '[]')
    local.push({ id: `local_${Date.now()}`, query, createdAt: { toDate: () => new Date() } })
    localStorage.setItem(`history_${userId}`, JSON.stringify(local.slice(-20)))
  }
}

/** Returns last 20 searches for the user. */
export async function getSearchHistory(userId) {
  let fallback = []
  try {
    fallback = JSON.parse(localStorage.getItem(`history_${userId}`) || '[]')
    fallback = fallback.map(item => ({...item, createdAt: item.createdAt?.toDate ? item.createdAt : { toDate: () => new Date(item.createdAt) }}))
    
    const snap = await getDocs(
      query(
        collection(db, 'users', userId, 'history'),
        orderBy('createdAt', 'desc'),
        limit(20)
      )
    )
    return [...snap.docs.map(d => ({ id: d.id, ...d.data() })), ...fallback].slice(0, 20)
  } catch (err) {
    console.warn("Firestore getSearchHistory failed, using fallback:", err.message)
    return fallback
  }
}

// ── Applied Jobs ─────────────────────────────────────

/** Saves a job application record to the user's profile. */
export async function saveAppliedJob(userId, jobDetails) {
  if (!userId) return
  try {
    await addDoc(collection(db, 'users', userId, 'appliedJobs'), {
      ...jobDetails,
      appliedAt: serverTimestamp(),
    })
  } catch (err) {
    console.warn("Firestore saveAppliedJob failed, using fallback:", err.message)
    const local = JSON.parse(localStorage.getItem(`appliedJobs_${userId}`) || '[]')
    local.push({ id: `local_${Date.now()}`, ...jobDetails, appliedAt: { toDate: () => new Date() } })
    localStorage.setItem(`appliedJobs_${userId}`, JSON.stringify(local))
  }
}

/** Retrieves all jobs applied by the user. */
export async function getAppliedJobs(userId) {
  if (!userId) return []
  let fallback = []
  try {
    fallback = JSON.parse(localStorage.getItem(`appliedJobs_${userId}`) || '[]')
    fallback = fallback.map(item => ({...item, appliedAt: item.appliedAt?.toDate ? item.appliedAt : { toDate: () => new Date(item.appliedAt) }}))
    
    const snap = await getDocs(
      query(
        collection(db, 'users', userId, 'appliedJobs'),
        orderBy('appliedAt', 'desc')
      )
    )
    return [...snap.docs.map(d => ({ id: d.id, ...d.data() })), ...fallback]
  } catch (err) {
    console.warn("Firestore getAppliedJobs failed, using fallback:", err.message)
    return fallback
  }
}

// ── Community stories ────────────────────────────────

/** Adds a success story from a user. */
export async function addStory(userId, displayName, storyText, schemeId) {
  try {
    await addDoc(collection(db, 'stories'), {
      userId,
      displayName,
      storyText,
      schemeId,
      createdAt: serverTimestamp(),
      upvotes: 0,
    })
  } catch (err) {
    console.warn("Firestore addStory failed, using local fallback:", err.message)
    const local = JSON.parse(localStorage.getItem('local_stories') || '[]')
    local.unshift({
      id: 'local_' + Date.now(),
      userId,
      displayName,
      storyText,
      schemeId,
      createdAt: new Date().toISOString(),
      upvotes: 0
    })
    localStorage.setItem('local_stories', JSON.stringify(local))
  }
}

/** Returns all stories, newest first. */
export async function getStories() {
  let localStories = []
  try {
    localStories = JSON.parse(localStorage.getItem('local_stories') || '[]')
    const snap = await getDocs(
      query(collection(db, 'stories'), orderBy('createdAt', 'desc'), limit(50))
    )
    return [...localStories, ...snap.docs.map(d => ({ id: d.id, ...d.data() }))]
  } catch (err) {
    console.warn("Firestore getStories failed, returning local fallback:", err.message)
    return localStories
  }
}
