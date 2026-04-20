// src/hooks/useDebounce.js
import { useState, useEffect } from 'react'

/** Delays updating a value until the user stops typing. */
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

// ─────────────────────────────────────────────────────────────

// src/hooks/useGeolocation.js — exported from same file for simplicity

/** Returns the user's current coords or an error string. */
export function useGeolocation() {
  const [coords, setCoords]   = useState(null)
  const [geoError, setError]  = useState(null)
  const [loading, setLoading] = useState(false)

  function requestLocation() {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser.')
      return
    }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLoading(false)
      },
      err => {
        setError(err.message)
        setLoading(false)
      }
    )
  }

  return { coords, geoError, loading, requestLocation }
}

// ─────────────────────────────────────────────────────────────

// src/hooks/useVoiceInput.js

/**
 * Wraps the Web Speech API for voice-to-text input.
 * Works in Chrome/Edge. Falls back silently on unsupported browsers.
 */
export function useVoiceInput(lang = 'en') {
  const [transcript, setTranscript] = useState('')
  const [listening, setListening]   = useState(false)
  const [supported, setSupported]   = useState(false)

  useEffect(() => {
    setSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  }, [])

  function startListening() {
    if (!supported) return
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart  = () => setListening(true)
    recognition.onend    = () => setListening(false)
    recognition.onerror  = () => setListening(false)
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript
      setTranscript(text)
    }

    recognition.start()
  }

  function clearTranscript() { setTranscript('') }

  return { transcript, listening, supported, startListening, clearTranscript }
}

// ─────────────────────────────────────────────────────────────

// src/hooks/useEligibility.js

import { useMemo } from 'react'
import { checkEligibility } from '../services/schemeService'

/**
 * Returns eligible schemes + document checklist for a given profile.
 * useMemo ensures it only recomputes when inputs change.
 */
export function useEligibility(allSchemes, userProfile) {
  const eligible = useMemo(() => {
    if (!userProfile || !allSchemes?.length) return []
    return checkEligibility(allSchemes, userProfile)
  }, [allSchemes, userProfile])

  // Aggregate all required documents across eligible schemes
  const documentChecklist = useMemo(() => {
    const docs = new Set()
    eligible.forEach(s => {
      s.documentsEn?.forEach(d => docs.add(d))
    })
    return Array.from(docs)
  }, [eligible])

  return { eligible, documentChecklist }
}

// ─────────────────────────────────────────────────────────────

// src/hooks/useEMI.js

/**
 * EMI calculator hook.
 * EMI = P × r × (1+r)^n / ((1+r)^n - 1)
 */
export function useEMI(principal, annualRate, tenureMonths) {
  return useMemo(() => {
    if (!principal || !annualRate || !tenureMonths) return { emi: 0, total: 0, interest: 0 }
    const r = annualRate / 12 / 100
    const n = tenureMonths
    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const total = emi * n
    return {
      emi:      Math.round(emi),
      total:    Math.round(total),
      interest: Math.round(total - principal),
    }
  }, [principal, annualRate, tenureMonths])
}
