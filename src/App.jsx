// src/App.jsx
import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider }     from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import { UserProvider }     from './context/UserContext'

import Navbar           from './components/Navbar'
import ProtectedRoute   from './components/ProtectedRoute'
import { LoadingSpinner } from './components/index.jsx'

// ── Lazy-loaded pages (React.lazy + Suspense for code splitting) ──
const Home           = lazy(() => import('./pages/Home'))
const Schemes        = lazy(() => import('./pages/Schemes').then(m => ({ default: m.default })))
const SchemeDetail   = lazy(() => import('./pages/Schemes').then(m => ({ default: m.SchemeDetail })))
const Earn           = lazy(() => import('./pages/Earn'))
const Loans          = lazy(() => import('./pages/Loans'))
const LocalResources = lazy(() => import('./pages/LocalResources'))
const Dashboard      = lazy(() => import('./pages/Other').then(m => ({ default: m.default })))
const Community      = lazy(() => import('./pages/Other').then(m => ({ default: m.Community })))
const Awareness      = lazy(() => import('./pages/Other').then(m => ({ default: m.Awareness })))
const Login          = lazy(() => import('./pages/Other').then(m => ({ default: m.Login })))
const OrganizerDashboard = lazy(() => import('./pages/OrganizerDashboard'))

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingSpinner fullPage />}>
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/schemes"         element={<Schemes />} />
          <Route path="/schemes/:id"     element={<SchemeDetail />} />
          <Route path="/earn"            element={<Earn />} />
          <Route path="/loans"           element={<Loans />} />
          <Route path="/local"           element={<LocalResources />} />
          <Route path="/community"       element={<Community />} />
          <Route path="/awareness"       element={<Awareness />} />
          <Route path="/login"           element={<Login />} />

          {/* Protected routes — require login */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          
          <Route path="/management" element={
            <ProtectedRoute allowedRoles={['organizer']}>
              <OrganizerDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Suspense>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      {/*
        Provider order matters:
        AuthProvider → LanguageProvider (reads user for lang pref)
        → UserProvider (reads user for profile/saved schemes)
      */}
      <AuthProvider>
        <LanguageProvider>
          <UserProvider>
            <AppRoutes />
          </UserProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
