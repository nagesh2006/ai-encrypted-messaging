'use client'

import { useState } from 'react'
import { Search, X, User, MessageCircle } from 'lucide-react'

interface UserSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectUser: (userId: string, username: string) => void
  currentUsername: string
}

export default function UserSearchModal({ 
  isOpen, 
  onClose, 
  onSelectUser, 
  currentUsername 
}: UserSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const searchUsers = async () => {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`http://localhost:8000/api/auth/user/${searchQuery}`)
      const data = await response.json()
      
      if (data.success) {
        if (data.user.username === currentUsername) {
          setError("You can't message yourself!")
          setSearchResults([])
        } else {
          setSearchResults([data.user])
        }
      } else {
        setError('User not found or not verified')
        setSearchResults([])
      }
    } catch (err) {
      setError('Failed to search users')
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelectUser = (user: any) => {
    onSelectUser(user.id, user.username)
    setSearchQuery('')
    setSearchResults([])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: 50
    }}>
      <div style={{
        background: 'rgba(17, 24, 39, 0.95)',
        backdropFilter: 'blur(16px)',
        borderRadius: '1.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: '28rem',
        border: '1px solid rgba(75, 85, 99, 0.3)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem',
          borderBottom: '1px solid rgba(75, 85, 99, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Search style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
            </div>
            <div>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: 'white',
                margin: 0
              }}>Find Users</h2>
              <p style={{
                fontSize: '0.875rem',
                color: '#9ca3af',
                margin: 0
              }}>Search by username</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem',
              background: 'none',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            <X style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} />
          </button>
        </div>

        {/* Search Input */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Enter username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'rgba(31, 41, 55, 0.7)',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                borderRadius: '0.5rem',
                color: 'white',
                outline: 'none'
              }}
            />
            <button
              onClick={searchUsers}
              disabled={loading || !searchQuery.trim()}
              style={{
                background: loading || !searchQuery.trim() 
                  ? '#6b7280' 
                  : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: loading || !searchQuery.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                fontWeight: '500'
              }}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              marginTop: '1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          {/* Search Results */}
          <div style={{ marginTop: '1.5rem' }}>
            {searchResults.length > 0 ? (
              searchResults.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    background: 'rgba(31, 41, 55, 0.5)',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    marginBottom: '0.5rem'
                  }}
                >
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontWeight: '600',
                      color: 'white',
                      margin: 0
                    }}>@{user.username}</h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#9ca3af',
                      margin: 0
                    }}>{user.email}</p>
                  </div>
                  <MessageCircle style={{ width: '1.25rem', height: '1.25rem', color: '#60a5fa' }} />
                </div>
              ))
            ) : searchQuery && !loading && !error ? (
              <div style={{
                textAlign: 'center',
                padding: '2rem 0',
                color: '#9ca3af'
              }}>
                <User style={{
                  width: '3rem',
                  height: '3rem',
                  margin: '0 auto 0.75rem',
                  color: '#6b7280'
                }} />
                <p style={{ margin: 0 }}>No users found</p>
                <p style={{
                  fontSize: '0.875rem',
                  margin: '0.25rem 0 0 0'
                }}>Try a different username</p>
              </div>
            ) : !searchQuery ? (
              <div style={{
                textAlign: 'center',
                padding: '2rem 0',
                color: '#9ca3af'
              }}>
                <Search style={{
                  width: '3rem',
                  height: '3rem',
                  margin: '0 auto 0.75rem',
                  color: '#6b7280'
                }} />
                <p style={{ margin: 0 }}>Search for users to start chatting</p>
                <p style={{
                  fontSize: '0.875rem',
                  margin: '0.25rem 0 0 0'
                }}>Enter a username above</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}