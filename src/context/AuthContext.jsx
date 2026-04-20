// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider } from '../services/firebase'
import { upsertProfile, getProfile } from '../services/userService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch or create profile
        const p = await getProfile(firebaseUser.uid)
        setProfile(p)
        setUser({ ...firebaseUser, role: p?.role || 'consumer' })
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  async function loginWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider)
    const existing = await getProfile(result.user.uid)
    const role = existing?.role || 'consumer'
    
    await upsertProfile(result.user.uid, {
      displayName: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
      role
    })
    return result.user
  }

  async function loginWithEmail(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  }

  async function signupWithEmail(email, password, displayName, role = 'consumer') {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName })
    await upsertProfile(result.user.uid, { displayName, email, role })
    return result.user
  }

  async function logout() {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile,
      loading, 
      loginWithGoogle, 
      loginWithEmail, 
      signupWithEmail, 
      logout 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
