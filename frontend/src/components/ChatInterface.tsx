'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Users, LogOut, Shield, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react'
import { api } from '@/lib/api'
import AIVisualization from './AIVisualization'

interface User {
  id: string
  username: string
}

interface Message {
  id: string
  content: string
  sender_id: string
  receiver_id: string
  status: 'allowed' | 'flagged' | 'blocked'
  created_at: string
  sender_username?: string
  ai_score?: number
  fuzzy_score?: number
  fuzzy_details?: string
  ai_analysis?: {
    spam_probability: number
    toxicity_probability: number
    confidence: number
    classification: string
  }
}

interface ChatInterfaceProps {
  currentUserId: string
  currentUsername: string
  chatPartnerId: string
  chatPartnerUsername: string
  onNewMessage?: () => void
  onLogout?: () => void
  onBack?: () => void
}

export default function ChatInterface({ 
  currentUserId, 
  currentUsername, 
  chatPartnerId, 
  chatPartnerUsername,
  onNewMessage,
  onLogout,
  onBack 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [ws, setWs] = useState<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatPartnerId) {
      loadMessages()
      connectWebSocket()
    }
    return () => ws?.close()
  }, [chatPartnerId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const connectWebSocket = () => {
    const wsUrl = `ws://localhost:8000/api/messages/ws/${currentUserId}`
    const websocket = new WebSocket(wsUrl)
    
    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data)
  setMessages(prev => [...(Array.isArray(prev) ? prev : []), message])
    }
    
    setWs(websocket)
  }

  const loadMessages = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/messages/chat/${chatPartnerId}?user_id=${currentUserId}`)
      const data = await response.json()
  setMessages(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load messages')
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return
    
    setLoading(true)
    const messageContent = newMessage
    setNewMessage('')
    
    // Add temporary message with AI processing indicator
    const tempMessage: Message = {
      id: 'temp-' + Date.now(),
      content: messageContent,
      sender_id: currentUserId,
      receiver_id: chatPartnerId,
      status: 'allowed',
      created_at: new Date().toISOString(),
      sender_username: currentUsername,
      ai_analysis: undefined
    }
  setMessages(prev => [...(Array.isArray(prev) ? prev : []), tempMessage])
    
    try {
      const response = await fetch('http://localhost:8000/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: currentUserId,
          recipient_id: chatPartnerId,
          content: messageContent
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        // Remove temp message and add real message with AI analysis
  setMessages(prev => (Array.isArray(prev) ? prev : []).filter(m => m.id !== tempMessage.id))
        loadMessages()
        onNewMessage?.()
      }
    } catch (err) {
      console.error('Failed to send message')
      // Remove temp message on error
  setMessages(prev => (Array.isArray(prev) ? prev : []).filter(m => m.id !== tempMessage.id))
      setNewMessage(messageContent)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'allowed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'flagged': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'blocked': return <Shield className="w-4 h-4 text-red-500" />
      default: return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'allowed': return 'border-l-green-500'
      case 'flagged': return 'border-l-yellow-500'
      case 'blocked': return 'border-l-red-500'
      default: return 'border-l-gray-300'
    }
  }

  const AIAnalysisDisplay = ({ analysis }: { analysis?: Message['ai_analysis'] }) => {
    if (!analysis) return null
    
    return (
      <div style={{
        marginTop: '0.5rem',
        padding: '0.5rem',
        background: 'rgba(17, 24, 39, 0.6)',
        borderRadius: '0.5rem',
        fontSize: '0.75rem',
        border: '1px solid rgba(75, 85, 99, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span style={{ color: '#818cf8', fontWeight: '600' }}>🤖 AI Analysis</span>
          <span style={{
            padding: '0.125rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.625rem',
            background: analysis.confidence > 0.8 ? '#059669' : analysis.confidence > 0.6 ? '#d97706' : '#dc2626',
            color: 'white'
          }}>
            {Math.round(analysis.confidence * 100)}% confident
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', color: '#d1d5db' }}>
          <div>
            <span style={{ color: '#9ca3af' }}>Spam:</span> {Math.round(analysis.spam_probability * 100)}%
          </div>
          <div>
            <span style={{ color: '#9ca3af' }}>Toxic:</span> {Math.round(analysis.toxicity_probability * 100)}%
          </div>
        </div>
        <div style={{ marginTop: '0.25rem', color: '#d1d5db' }}>
          <span style={{ color: '#9ca3af' }}>Type:</span> {analysis.classification}
        </div>
      </div>
    )
  }

  return (
    <div style={{
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex'
    }}>
      {/* Chat Section */}
      <div style={{
        width: '70%',
        display: 'flex',
        flexDirection: 'column'
      }}>
      {/* Header */}
      <div style={{
        background: 'rgba(17, 24, 39, 0.9)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(75, 85, 99, 0.3)',
        padding: '1rem 1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                padding: '0.5rem',
                color: '#9ca3af',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '0.5rem',
                transition: 'color 0.3s'
              }}
              className="md:hidden"
            >
              <ArrowLeft style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>
          )}
          <div style={{
            width: '3rem',
            height: '3rem',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.125rem'
          }}>
            {chatPartnerUsername?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: 'white',
              margin: 0
            }}>
              @{chatPartnerUsername || 'User'}
            </h2>
            <p style={{
              fontSize: '0.875rem',
              color: '#9ca3af',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0.25rem 0 0 0'
            }}>
              <span style={{
                width: '0.5rem',
                height: '0.5rem',
                background: '#10b981',
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }}></span>
              <span>Online</span>
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1.5rem'
      }}>
  {(Array.isArray(messages) ? messages : []).map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.sender_id === currentUserId ? 'flex-end' : 'flex-start',
              marginBottom: '1rem'
            }}
          >
            <div style={{
              maxWidth: '70%',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              flexDirection: message.sender_id === currentUserId ? 'row-reverse' : 'row'
            }}>
              {/* User Avatar */}
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                background: message.sender_id === currentUserId 
                  ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                flexShrink: 0
              }}>
                {message.sender_id === currentUserId 
                  ? currentUsername?.charAt(0)?.toUpperCase() || 'Y'
                  : (message.sender_username || chatPartnerUsername)?.charAt(0)?.toUpperCase() || 'U'
                }
              </div>
              
              {/* Message Bubble */}
              <div style={{
                background: message.sender_id === currentUserId
                  ? 'rgba(59, 130, 246, 0.9)'
                  : 'rgba(17, 24, 39, 0.9)',
                backdropFilter: 'blur(16px)',
                borderRadius: '1rem',
                padding: '0.75rem 1rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                {/* Message Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}>
                    {message.sender_id === currentUserId ? 'You' : `@${message.sender_username || chatPartnerUsername}`}
                  </span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.625rem',
                    background: message.status === 'allowed' ? '#059669' :
                               message.status === 'flagged' ? '#d97706' : '#dc2626',
                    color: 'white'
                  }}>
                    {/* Show fuzzy_score instead of flagged status */}
                    <span>Fuzzy Score: {message.fuzzy_score ? message.fuzzy_score.toFixed(2) : '0.00'}</span>
                  </div>
                </div>
                
                {/* Message Content */}
                <p style={{
                  color: 'white',
                  fontSize: '0.875rem',
                  lineHeight: '1.4',
                  margin: 0
                }}>
                  {message.content}
                </p>
                
                {/* Timestamp */}
                <p style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginTop: '0.5rem',
                  margin: '0.5rem 0 0 0'
                }}>
                  {new Date(message.created_at).toLocaleTimeString()}
                </p>
                
                {/* AI Analysis */}
                <AIAnalysisDisplay analysis={message.ai_analysis} />
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        background: 'rgba(17, 24, 39, 0.9)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(75, 85, 99, 0.3)',
        padding: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              background: 'rgba(31, 41, 55, 0.7)',
              border: '1px solid rgba(75, 85, 99, 0.5)',
              borderRadius: '1.5rem',
              color: 'white',
              outline: 'none',
              fontSize: '0.875rem'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !newMessage.trim()}
            style={{
              width: '3rem',
              height: '3rem',
              background: loading || !newMessage.trim() 
                ? '#6b7280' 
                : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              cursor: loading || !newMessage.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Send style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>
      </div>
      </div>
      
      {/* AI Visualization Section */}
      <div style={{
        width: '30%',
        minWidth: '350px',
        background: 'rgba(17, 24, 39, 0.3)',
        backdropFilter: 'blur(20px)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <AIVisualization isActive={true} />
      </div>
    </div>
  )
}