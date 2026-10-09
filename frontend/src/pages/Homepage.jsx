import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useInstall } from '../context/InstallContext'

function ChatBubbleIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function ShieldCheckIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  )
}

function CloudOfflineIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  )
}

function HomePage() {
  const { currentUser } = useAuth()
  const { isInstallable, install } = useInstall()

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="border-b border-[#f3f0f7] dark:border-gray-800 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            {currentUser ? `Welcome back, ${currentUser.username} 👋` : 'Welcome to Yappy'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time messaging, PWA offline ready, and secure authentication
          </p>
        </div>

        {!currentUser && (
          <Link
            to="/auth"
            className="self-start sm:self-auto bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_4px_12px_rgba(124,58,237,0.18)]"
          >
            Get Started
          </Link>
        )}
      </div>

      {/* Boilerplate Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-gray-800 border border-[#f3f0f7] dark:border-gray-700 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.015)] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <ChatBubbleIcon className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">Chat Architecture</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
            Ready for WebSocket or Socket.io real-time chat rooms, direct messaging, and message persistence.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-[#f3f0f7] dark:border-gray-700 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.015)] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 flex items-center justify-center">
            <ShieldCheckIcon className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">Better Auth</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
            Multi-factor authentication, secure HTTP-only cookies, password hashing, and Google OAuth login pre-configured.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-[#f3f0f7] dark:border-gray-700 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.015)] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <CloudOfflineIcon className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">PWA & Push Notifications</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
            Offline service worker shell, Web Push notification endpoints, and standalone install prompt support.
          </p>
        </div>
      </div>

      {/* Main Action Banner / Chat Placeholder */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-3xl p-8 md:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm">
            Ready to Build
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Your chat app foundation is ready
          </h2>
          <p className="text-sm text-purple-100 leading-relaxed">
            The boilerplate is clean and ready. Add your chat schemas, state, and real-time messaging to start building.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <Link
              to="/settings"
              className="bg-white text-purple-700 hover:bg-purple-50 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              App Settings
            </Link>
            {isInstallable && (
              <button
                onClick={install}
                className="bg-white/15 hover:bg-white/25 text-white border border-white/20 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Install App
              </button>
            )}
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>
    </div>
  )
}

export default HomePage
