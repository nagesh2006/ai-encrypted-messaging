'use client'

import { X } from 'lucide-react'

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Terms & Conditions</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] text-gray-300 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Academic Project Notice</h3>
            <p className="text-sm leading-relaxed">
              This application, "Guard Message Hub" (AI-Powered Fuzzy Logic Based Encrypted Messaging System), 
              is developed as a capstone project for academic purposes. This is a demonstration of secure 
              messaging technologies and AI-powered content filtering.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Project Overview</h3>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>End-to-End Encryption using AES + RSA hybrid encryption</li>
              <li>AI Content Classification for spam/ham/toxic message detection</li>
              <li>Fuzzy Logic decision making for message filtering</li>
              <li>Real-time messaging with WebSocket technology</li>
              <li>Email OTP verification system</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Data Usage & Privacy</h3>
            <p className="text-sm leading-relaxed">
              This is an educational project. All data entered is for demonstration purposes only. 
              While the application implements encryption and security measures, it should not be 
              used for actual sensitive communications. Messages and user data may be stored 
              temporarily for testing and evaluation purposes.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Security Features</h3>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>AES-256 symmetric encryption for message content</li>
              <li>RSA-2048 asymmetric encryption for key exchange</li>
              <li>AI-powered content analysis and filtering</li>
              <li>Fuzzy logic decision engine for message safety</li>
              <li>Email verification for account security</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Limitations & Disclaimers</h3>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>This is a prototype developed for educational demonstration</li>
              <li>Not intended for production use or real-world deployment</li>
              <li>Security implementations are for academic evaluation</li>
              <li>No warranty or guarantee of data protection</li>
              <li>Use at your own discretion for testing purposes only</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Technology Stack</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-white">Backend:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>FastAPI (Python)</li>
                  <li>Scikit-learn (ML)</li>
                  <li>Scikit-fuzzy</li>
                  <li>Cryptography</li>
                  <li>Supabase</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white">Frontend:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Next.js 14</li>
                  <li>TypeScript</li>
                  <li>TailwindCSS</li>
                  <li>Lucide React</li>
                  <li>WebSockets</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Contact & Support</h3>
            <p className="text-sm leading-relaxed">
              This project is developed as part of academic coursework. For questions or 
              technical inquiries related to the implementation, please contact through 
              appropriate academic channels.
            </p>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <p className="text-xs text-gray-400">
              Last updated: {new Date().toLocaleDateString()}<br/>
              Version: 1.0.0 (Capstone Project)<br/>
              © 2024 Guard Message Hub - Academic Project
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  )
}