'use client'

import { useState } from 'react'
import { Shield, Mail, User, Lock, ArrowRight, Sparkles } from 'lucide-react'
import TermsModal from './TermsModal'

interface AuthFormProps {
  onAuthSuccess: (userId: string, email?: string, username?: string) => void
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    otp: ''
  })
  const [step, setStep] = useState<'form' | 'otp' | 'forgot'>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState('')
  const [showTerms, setShowTerms] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (step === 'form') {
        if (isLogin) {
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
      } else if (step === 'otp') {
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
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="card max-w-md w-full relative z-10 animate-fadeInUp">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 animate-glow">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Verify Your Email
            </h2>
            <p className="text-gray-400">
              We've sent a 6-digit code to <span className="text-indigo-400 font-medium">{formData.email}</span>
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                placeholder="000000"
                value={formData.otp}
                onChange={(e) => setFormData({...formData, otp: e.target.value})}
                className="w-full p-4 text-center text-3xl font-mono tracking-widest bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm"
                maxLength={6}
                required
              />
            </div>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full group"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>{loading ? 'Verifying...' : 'Verify Account'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <button
              type="button"
              onClick={() => setStep('form')}
              className="w-full text-gray-400 hover:text-white transition-colors"
            >
              Back to Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (step === 'forgot') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="card max-w-md w-full relative z-10 animate-fadeInUp">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 animate-glow">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Reset Password
            </h2>
            <p className="text-gray-400">Enter your email to receive a reset link</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="input-primary pl-12"
                required
              />
            </div>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full group"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>{loading ? 'Sending...' : 'Send Reset Link'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <button
              type="button"
              onClick={() => setStep('form')}
              className="w-full text-gray-400 hover:text-white transition-colors"
            >
              Back to Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      {/* Animated Background */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: '24rem',
          height: '24rem',
          background: 'rgba(99, 102, 241, 0.2)',
          borderRadius: '50%',
          filter: 'blur(3rem)',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '25%',
          right: '25%',
          width: '24rem',
          height: '24rem',
          background: 'rgba(147, 51, 234, 0.2)',
          borderRadius: '50%',
          filter: 'blur(3rem)',
          animation: 'float 6s ease-in-out infinite 2s'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '75%',
          left: '50%',
          width: '24rem',
          height: '24rem',
          background: 'rgba(6, 182, 212, 0.2)',
          borderRadius: '50%',
          filter: 'blur(3rem)',
          animation: 'float 6s ease-in-out infinite 4s'
        }}></div>
      </div>

      <div style={{
        maxWidth: '28rem',
        width: '100%',
        position: 'relative',
        zIndex: 10,
        background: 'rgba(17, 24, 39, 0.8)',
        backdropFilter: 'blur(16px)',
        borderRadius: '1.5rem',
        padding: '2rem',
        border: '1px solid rgba(75, 85, 99, 0.3)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '5rem',
            height: '5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            animation: 'glow 2s ease-in-out infinite alternate'
          }}>
            <Shield style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} />
          </div>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <span>AI SecureChat</span>
            <Sparkles style={{ width: '2rem', height: '2rem', color: '#818cf8' }} />
          </h1>
          <p style={{ color: '#9ca3af' }}>Secure • Encrypted • AI-Protected</p>
        </div>
        
        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(31, 41, 55, 0.5)',
          borderRadius: '0.75rem',
          padding: '0.25rem',
          marginBottom: '1.5rem',
          backdropFilter: 'blur(8px)'
        }}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              transition: 'all 0.3s',
              background: isLogin ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
              color: isLogin ? 'white' : '#9ca3af',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              transition: 'all 0.3s',
              background: !isLogin ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
              color: !isLogin ? 'white' : '#9ca3af',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Sign Up
          </button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Mail style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '1.25rem',
              height: '1.25rem',
              color: '#9ca3af'
            }} />
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{
                width: '100%',
                padding: '1rem 1rem 1rem 3rem',
                background: 'rgba(31, 41, 55, 0.5)',
                border: '1px solid #4b5563',
                borderRadius: '0.75rem',
                color: 'white',
                backdropFilter: 'blur(8px)',
                outline: 'none'
              }}
              required
            />
          </div>
          
          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <User style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '1.25rem',
                height: '1.25rem',
                color: '#9ca3af'
              }} />
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3rem',
                  background: 'rgba(31, 41, 55, 0.5)',
                  border: '1px solid #4b5563',
                  borderRadius: '0.75rem',
                  color: 'white',
                  backdropFilter: 'blur(8px)',
                  outline: 'none'
                }}
                required
              />
            </div>
          )}
          
          <div style={{ position: 'relative' }}>
            <Lock style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '1.25rem',
              height: '1.25rem',
              color: '#9ca3af'
            }} />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{
                width: '100%',
                padding: '1rem 1rem 1rem 3rem',
                background: 'rgba(31, 41, 55, 0.5)',
                border: '1px solid #4b5563',
                borderRadius: '0.75rem',
                color: 'white',
                backdropFilter: 'blur(8px)',
                outline: 'none'
              }}
              required
            />
          </div>
          
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              backdropFilter: 'blur(8px)'
            }}>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              background: loading ? '#6b7280' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <span>{loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}</span>
            <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
          
          {isLogin && (
            <button
              type="button"
              onClick={() => setStep('forgot')}
              style={{
                width: '100%',
                color: '#9ca3af',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                marginTop: '0.75rem',
                transition: 'color 0.3s'
              }}
            >
              Forgot Password?
            </button>
          )}
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowTerms(true)}
            className="text-gray-400 hover:text-white transition-colors text-sm underline"
          >
            Terms & Conditions
          </button>
        </div>
      </div>
      
      <TermsModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
      />
    </div>
  )
}