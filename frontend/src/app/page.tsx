'use client'

import { useState } from 'react'
import { MessageCircle, Users, LogOut, Settings, Plus, Shield, Sparkles, Zap } from 'lucide-react'
import AuthForm from '@/components/AuthForm'
import ChatInterface from '@/components/ChatInterface'
import UserSearchModal from '@/components/UserSearchModal'
import ProfileModal from '@/components/ProfileModal'

export default function Home() {
  const [user, setUser] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [chats, setChats] = useState<{id: string, username: string, lastMessage?: string}[]>([])
  const [chatPartnerUsername, setChatPartnerUsername] = useState<string>('')
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)

  const getUsernameById = async (userId: string): Promise<string> => {
    try {
      const response = await fetch(`http://localhost:8000/api/auth/user-by-id/${userId}`)
      const data = await response.json()
      return data.success ? data.user.username : userId
    } catch (error) {
      return userId
    }
  }

  const loadChats = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/messages/chats?user_id=${userId}`)
      const data = await response.json()
      
      const chatObjects = await Promise.all(
        data.map(async (chatId: string) => {
          const username = await getUsernameById(chatId)
          return {
            id: chatId,
            username: username,
            lastMessage: 'Click to start chatting...'
          }
        })
      )
      
      setChats(chatObjects)
    } catch (error) {
      console.error('Failed to load chats:', error)
    }
  }

  const handleAuthSuccess = (userId: string, email?: string, userUsername?: string) => {
    setUser(userId)
    setUsername(userUsername || null)
    loadChats(userId)
  }

  const handleLogout = () => {
    setUser(null)
    setUsername(null)
    setSelectedChat(null)
    setChats([])
    setChatPartnerUsername('')
  }

  const handleSelectUser = (userId: string, userUsername: string) => {
    const newChat = { id: userId, username: userUsername }
    
    setSelectedChat(userId)
    setChatPartnerUsername(userUsername)
    
    setChats(prev => {
      const exists = prev.find(chat => chat.id === userId)
      if (!exists) {
        return [...prev, newChat]
      }
      return prev
    })
  }

  if (!user) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '320px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setShowProfileModal(true)}
                style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
                  borderRadius: '12px',
                  border: 'none',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {username?.charAt(0)?.toUpperCase() || 'A'}
              </button>
              <div>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'white',
                  margin: 0
                }}>
                  @{username || 'user'}
                </h2>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    background: '#10b981',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite'
                  }}></span>
                  Online
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setShowProfileModal(true)}
                style={{
                  padding: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              >
                <Settings size={20} />
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: '8px',
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ef4444',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          {/* AI SecureChat Branding */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
            borderRadius: '12px',
            marginBottom: '16px',
            boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)'
          }}>
            <Shield size={20} color="white" />
            <span style={{
              color: 'white',
              fontWeight: '600',
              fontSize: '16px'
            }}>
              AI SecureChat
            </span>
            <Sparkles size={16} color="white" />
          </div>

          {/* New Chat Button */}
          <button
            onClick={() => setShowSearchModal(true)}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(6, 182, 212, 0.4)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(6, 182, 212, 0.3)'
            }}
          >
            <Plus size={20} />
            New Chat
          </button>
        </div>

        {/* Chat List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px'
        }}>
          {chats.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px 16px',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                animation: 'float 6s ease-in-out infinite'
              }}>
                <MessageCircle size={32} color="white" />
              </div>
              <p style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                margin: '0 0 8px'
              }}>
                No conversations yet
              </p>
              <p style={{
                fontSize: '14px',
                margin: 0
              }}>
                Start a secure chat with someone
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    setSelectedChat(chat.id)
                    setChatPartnerUsername(chat.username)
                  }}
                  style={{
                    width: '100%',
                    padding: '16px',
                    textAlign: 'left',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: selectedChat === chat.id 
                      ? 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)'
                      : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseOver={(e) => {
                    if (selectedChat !== chat.id) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedChat !== chat.id) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      position: 'relative'
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: 'bold'
                      }}>
                        {chat.username?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '-2px',
                        width: '16px',
                        height: '16px',
                        background: '#10b981',
                        borderRadius: '50%',
                        border: '2px solid rgba(255, 255, 255, 0.2)'
                      }}></div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontWeight: '600',
                        fontSize: '16px',
                        marginBottom: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        @{chat.username}
                        <Zap size={14} color="#fbbf24" />
                      </div>
                      <div style={{
                        fontSize: '14px',
                        opacity: 0.8,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {chat.lastMessage || 'No messages yet'}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: selectedChat ? 'flex' : 'flex' }}>
        {selectedChat ? (
          <ChatInterface 
            currentUserId={user} 
            currentUsername={username || ''}
            chatPartnerId={selectedChat} 
            chatPartnerUsername={chatPartnerUsername}
            onNewMessage={() => loadChats(user)}
            onLogout={handleLogout}
          />
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            width: '100%'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '32px'
            }}>
              <div style={{
                width: '128px',
                height: '128px',
                background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 32px',
                animation: 'float 6s ease-in-out infinite',
                boxShadow: '0 20px 40px rgba(168, 85, 247, 0.3)'
              }}>
                <MessageCircle size={64} color="white" />
              </div>
              <h2 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: 'white',
                margin: '0 0 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}>
                Welcome to AI SecureChat
                <Sparkles size={32} color="#a855f7" />
              </h2>
              <p style={{
                fontSize: '18px',
                color: 'rgba(255, 255, 255, 0.7)',
                margin: '0 0 32px'
              }}>
                Select a conversation to start secure messaging
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '32px',
                fontSize: '14px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#10b981'
                }}>
                  <Shield size={16} />
                  End-to-End Encrypted
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#3b82f6'
                }}>
                  <Zap size={16} />
                  AI-Protected
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#a855f7'
                }}>
                  <Sparkles size={16} />
                  Secure
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <UserSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSelectUser={handleSelectUser}
        currentUsername={username || ''}
      />
      
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentUsername={username || ''}
        currentUserId={user || ''}
        onUsernameUpdate={(newUsername) => setUsername(newUsername)}
      />
    </div>
  )
}