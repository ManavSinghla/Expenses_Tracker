import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 text-center max-w-2xl animate-fade-in">
        {/* Logo */}
        <div className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full glass-card">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">F</span>
          </div>
          <span className="text-sm font-medium text-surface-300 tracking-wide uppercase">FairShare</span>
        </div>

        {/* Hero */}
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight">
          Split expenses,
          <br />
          <span className="gradient-text">not friendships.</span>
        </h1>

        <p className="text-lg text-surface-400 mb-10 max-w-lg mx-auto leading-relaxed">
          Track shared expenses, manage group memberships that change over time, 
          support multiple currencies, and settle debts — all in one place.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/login"
            id="cta-login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-base shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Get Started
          </a>
          <a
            href="/register"
            id="cta-register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass-card text-surface-200 font-semibold text-base hover:bg-surface-700/60 hover:border-surface-500/30 transition-all duration-200"
          >
            Create Account
          </a>
        </div>
      </div>

      {/* Feature pills */}
      <div className="relative z-10 mt-16 flex flex-wrap items-center justify-center gap-3 animate-slide-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
        {['Multi-currency', 'CSV Import', 'Smart Splits', 'Debt Simplification'].map((feature) => (
          <span
            key={feature}
            className="px-4 py-2 rounded-full text-xs font-medium text-surface-400 bg-surface-800/60 border border-surface-700/50"
          >
            {feature}
          </span>
        ))}
      </div>
    </div>
  )
}

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </>
  )
}

export default App
