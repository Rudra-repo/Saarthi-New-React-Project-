// src/hooks/useSchemes.js
import { useState, useEffect, useMemo, useCallback } from 'react'
import { getAllSchemes, checkEligibility } from '../services/schemeService'
import { SCHEMES } from '../constants/schemes'

/**
 * Central hook for all scheme data operations.
 * Demonstrates: useEffect, useMemo, useState, useCallback
 */
export function useSchemes(userProfile = null, initialCategory = 'all') {
  const [schemes, setSchemes]   = useState(SCHEMES)   // optimistic seed data
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [category, setCategory] = useState(initialCategory)
  const [searchText, setSearch] = useState('')
  const [sortBy, setSortBy]     = useState('default')  // 'amount-asc' | 'amount-desc' | 'deadline'

  // Fetch from Firestore on mount
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getAllSchemes()
      .then(data => { if (!cancelled) setSchemes(data) })
      .catch(err  => { if (!cancelled) setError(err.message) })
      .finally(()  => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  // useMemo — only recomputes when schemes/filters/profile change
  const filtered = useMemo(() => {
    let result = schemes

    // Category filter
    if (category !== 'all' && (!Array.isArray(category) || !category.includes('all'))) {
      result = result.filter(s => {
        if (Array.isArray(category)) return category.includes(s.category)
        return s.category === category
      })
    }

    // Search filter (name in both languages)
    if (searchText.trim()) {
      const q = searchText.toLowerCase()
      result = result.filter(s =>
        s.nameEn?.toLowerCase().includes(q) ||
        s.nameHi?.includes(searchText) ||
        s.tags?.some(t => t.includes(q))
      )
    }

    // Eligibility filter — only if profile provided
    if (userProfile) {
      result = checkEligibility(result, userProfile)
    }

    // Sort
    if (sortBy === 'amount-asc')  result = [...result].sort((a, b) => a.amount - b.amount)
    if (sortBy === 'amount-desc') result = [...result].sort((a, b) => b.amount - a.amount)
    if (sortBy === 'deadline')    result = [...result].sort((a, b) =>
      (a.deadlineDays ?? 9999) - (b.deadlineDays ?? 9999)
    )

    return result
  }, [schemes, category, searchText, sortBy, userProfile])

  const eligibleCount = useMemo(() => {
    if (!userProfile) return 0
    return checkEligibility(schemes, userProfile).length
  }, [schemes, userProfile])

  const reset = useCallback(() => {
    setCategory('all')
    setSearch('')
    setSortBy('default')
  }, [])

  return {
    schemes: filtered,
    allSchemes: schemes,
    loading,
    error,
    category, setCategory,
    searchText, setSearch,
    sortBy, setSortBy,
    eligibleCount,
    reset,
  }
}
