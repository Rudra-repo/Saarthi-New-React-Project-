// src/components/Navbar.jsx
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { HiMenuAlt3, HiX, HiUser } from 'react-icons/hi'
import LanguageToggle from './LanguageToggle'

export default function Navbar() {
  const { t, lang } = useLanguage()
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { to: '/',           label: t('nav.home') },
    { to: '/schemes',    label: t('nav.schemes') },
    { to: '/earn',       label: t('nav.earn') },
    { to: '/loans',      label: t('nav.loans') },
    { to: '/local',      label: t('nav.local') },
    { to: '/community',  label: t('nav.community') },
    { to: '/awareness',  label: t('nav.awareness') },
  ]

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <nav className="bg-primary-800 text-primary-100 sticky top-0 z-50 shadow-lg">
      {/* Desktop bar */}
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-accent-400">स</span>
            {lang === 'hi' ? 'ारथी' : 'aarthi'}
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? 'bg-primary-600 text-white'
                  : 'text-primary-200 hover:bg-primary-800 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <LanguageToggle />

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to={user.role === 'organizer' ? '/management' : '/dashboard'}
                className="hidden md:flex items-center gap-1.5 text-sm text-primary-200 hover:text-white px-2 py-1 rounded-lg hover:bg-primary-800 transition-colors"
              >
                <HiUser size={16} />
                {user.role === 'organizer' ? (lang === 'hi' ? 'प्रबंधन' : 'Management') : t('nav.dashboard')}
              </Link>
              <button
                onClick={handleLogout}
                className="hidden md:block text-xs text-primary-400 hover:text-white px-2 py-1 rounded hover:bg-primary-800 transition-colors"
              >
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:block text-sm font-medium bg-accent-600 text-primary-900 px-4 py-1.5 rounded-lg hover:bg-accent-400 transition-colors"
            >
              {t('nav.login')}
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-primary-800 transition-colors"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-primary-900 border-t border-primary-800 px-4 py-3 flex flex-col gap-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? 'bg-primary-600 text-white'
                  : 'text-primary-200 hover:bg-primary-800 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-primary-800 mt-2 pt-2">
            {user ? (
              <>
                <Link 
                  to={user.role === 'organizer' ? '/management' : '/dashboard'} 
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-primary-200 hover:text-white"
                >
                  {user.role === 'organizer' ? (lang === 'hi' ? 'प्रबंधन' : 'Management') : t('nav.dashboard')}
                </Link>
                <button onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-sm text-primary-400 hover:text-white">
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-accent-400">
                {t('nav.login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
