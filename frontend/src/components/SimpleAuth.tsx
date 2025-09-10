'use client'

import { useState } from 'react'

interface SimpleAuthProps {
  onAuthSuccess: (userId: string, email?: string, username?: string) => void
}

export default function SimpleAuth({ onAuthSuccess }: SimpleAuthProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    otp: ''
  })
  const [step, setStep] = useState<'form' | 'otp'>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (step === 'form') {
        if (isLogin) {
          // Login
          const response = await fetch('http://localhost:8000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password
            })
          })
          const result = await response.json()
          
          if (result.success) {
            onAuthSuccess(result.user_id, result.email, result.username)
          } else {
            setError(result.message)
          }
        } else {
          // Register
          const response = await fetch('http://localhost:8000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: formData.email,
              username: formData.username,
              password: formData.password
            })
          })
          const result = await response.json()
          
          if (result.success) {
            setUserId(result.user_id)
            setStep('otp')
          } else {
            setError(result.message)
          }
        }
      } else {
        // Verify OTP
        const response = await fetch('http://localhost:8000/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            otp_code: formData.otp
          })
        })
        const result = await response.json()
        
        if (result.success) {
          onAuthSuccess(result.user_id, formData.email, formData.username)
        } else {
          setError(result.message)
        }
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md transform hover:scale-105 transition-transform">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              📧 Verify Email
            </h2>
            <p className="text-gray-600 mt-2">Enter the OTP sent to your email</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={formData.otp}
              onChange={(e) => setFormData({...formData, otp: e.target.value})}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 text-center text-2xl font-mono tracking-widest"
              maxLength={6}
              required
            />
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:via-pink-600 hover:to-red-600 disabled:opacity-50 transform hover:scale-105 transition-all shadow-lg"
            >
              {loading ? '🔄 Verifying...' : '✅ Verify Account'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md transform hover:scale-105 transition-transform">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            🛡️ AI SecureChat
          </h1>
          <p className="text-gray-600">Secure • Encrypted • AI-Protected</p>
        </div>
        
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              isLogin 
                ? 'bg-white text-purple-600 shadow-md' 
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              !isLogin 
                ? 'bg-white text-purple-600 shadow-md' 
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            Sign Up
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="📧 Email address"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500"
            required
          />
          
          {!isLogin && (
            <input
              type="text"
              placeholder="👤 Username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500"
              required
            />
          )}
          
          <input
            type="password"
            placeholder="🔒 Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500"
            required
          />
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:via-pink-600 hover:to-red-600 disabled:opacity-50 transform hover:scale-105 transition-all shadow-lg"
          >
            {loading ? '🔄 Loading...' : (isLogin ? '🚀 Sign In' : '✨ Create Account')}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>🔐 End-to-end encrypted • 🤖 AI-filtered • 🛡️ Secure messaging</p>
        </div>
      </div>
    </div>
  )
}