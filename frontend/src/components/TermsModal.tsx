'use client'

import { X } from 'lucide-react'

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        style={{ position: 'relative', zIndex: 10000 }}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600">
          <h2 className="text-2xl font-bold text-white">Terms & Conditions</h2>
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6 bg-white">
          <div>
            <h3 className="text-lg font-semibold text-purple-600 mb-2">Academic Project Notice</h3>
            <p className="text-gray-700">
              This application, "Guard Message Hub" (AI-Powered Fuzzy Logic Based Encrypted Messaging System), 
              is developed as a capstone project for academic purposes. This is a demonstration of secure messaging 
              technologies and AI-powered content filtering.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-purple-600 mb-2">Project Overview</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>End-to-End Encryption using AES + RSA hybrid encryption</li>
              <li>AI Content Classification for spam/ham/toxic message detection</li>
              <li>Fuzzy Logic decision making for message filtering</li>
              <li>Real-time messaging with WebSocket technology</li>
              <li>Email OTP verification system</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-purple-600 mb-2">Data Usage & Privacy</h3>
            <p className="text-gray-700">
              This is an educational project. All data entered is for demonstration purposes only. While the 
              application implements encryption and security measures, it should not be used for actual sensitive communications. 
              Messages and user data may be stored temporarily for testing and evaluation purposes.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-purple-600 mb-2">Security Features</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>AES-256 symmetric encryption for message content</li>
              <li>RSA-2048 asymmetric encryption for key exchange</li>
              <li>AI-powered content analysis and filtering</li>
              <li>Fuzzy logic decision engine for message safety</li>
              <li>Email verification for account security</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-purple-600 mb-2">Limitations & Disclaimers</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>This is a prototype developed for educational demonstration</li>
              <li>Not intended for production use or real-world deployment</li>
              <li>Security implementations are for academic evaluation</li>
              <li>No warranty or guarantee of data protection</li>
            </ul>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-4 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  )
}