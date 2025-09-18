'use client'

import { useEffect, useRef } from 'react'
import { Shield, Brain, Zap, Lock, Eye, Activity } from 'lucide-react'

interface AIVisualizationProps {
  isActive?: boolean
}

export default function AIVisualization({ isActive = false }: AIVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 400
    canvas.height = 600

    let animationId: number
    let time = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Neural network visualization
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      
      // Draw neural network nodes
      const layers = [
        { nodes: 4, y: centerY - 150, color: '#3b82f6' },
        { nodes: 6, y: centerY - 50, color: '#8b5cf6' },
        { nodes: 4, y: centerY + 50, color: '#06b6d4' },
        { nodes: 2, y: centerY + 150, color: '#10b981' }
      ]
      
      layers.forEach((layer, layerIndex) => {
        const nodeSpacing = 60
        const startX = centerX - (layer.nodes - 1) * nodeSpacing / 2
        
        for (let i = 0; i < layer.nodes; i++) {
          const x = startX + i * nodeSpacing
          const y = layer.y + Math.sin(time * 0.02 + i * 0.5) * 5
          
          // Node glow
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, 15)
          gradient.addColorStop(0, layer.color + '80')
          gradient.addColorStop(1, layer.color + '20')
          
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(x, y, 15, 0, Math.PI * 2)
          ctx.fill()
          
          // Node core
          ctx.fillStyle = layer.color
          ctx.beginPath()
          ctx.arc(x, y, 8, 0, Math.PI * 2)
          ctx.fill()
          
          // Connections to next layer
          if (layerIndex < layers.length - 1) {
            const nextLayer = layers[layerIndex + 1]
            const nextStartX = centerX - (nextLayer.nodes - 1) * nodeSpacing / 2
            
            for (let j = 0; j < nextLayer.nodes; j++) {
              const nextX = nextStartX + j * nodeSpacing
              const nextY = nextLayer.y
              
              const opacity = 0.3 + Math.sin(time * 0.03 + i + j) * 0.2
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
              ctx.lineWidth = 1
              ctx.beginPath()
              ctx.moveTo(x, y)
              ctx.lineTo(nextX, nextY)
              ctx.stroke()
            }
          }
        }
      })
      
      // Floating particles
      for (let i = 0; i < 20; i++) {
        const x = centerX + Math.sin(time * 0.01 + i) * 150
        const y = centerY + Math.cos(time * 0.015 + i) * 200
        const size = 2 + Math.sin(time * 0.02 + i) * 1
        
        ctx.fillStyle = `rgba(99, 102, 241, ${0.5 + Math.sin(time * 0.02 + i) * 0.3})`
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }
      
      time++
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 relative overflow-hidden">
      {/* 3D Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-30"
        style={{ filter: 'blur(1px)' }}
      />
      
      {/* Main Content */}
      <div className="relative z-10 text-center space-y-8">
        {/* AI Brain Icon */}
        <div className="relative mb-4">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto animate-pulse shadow-2xl">
            <Brain size={48} className="text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
            <Activity size={12} className="text-white" />
          </div>
        </div>
        
        {/* Status */}
        <div className="space-y-3 text-center">
          <h3 className="text-xl font-bold text-white">AI Guardian Active</h3>
          <p className="text-gray-300 text-sm px-2">
            Advanced neural networks are analyzing messages in real-time to ensure your safety
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 text-center">
            <Shield size={20} className="text-blue-400 mx-auto mb-1" />
            <p className="text-xs text-gray-300">Threat Detection</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 text-center">
            <Zap size={20} className="text-yellow-400 mx-auto mb-1" />
            <p className="text-xs text-gray-300">Real-time Analysis</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 text-center">
            <Lock size={20} className="text-green-400 mx-auto mb-1" />
            <p className="text-xs text-gray-300">End-to-End Encrypted</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 text-center">
            <Eye size={20} className="text-purple-400 mx-auto mb-1" />
            <p className="text-xs text-gray-300">Privacy Protected</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 w-full max-w-xs">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-green-400">99.2%</div>
              <div className="text-xs text-gray-400">Accuracy</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-400">&lt;50ms</div>
              <div className="text-xs text-gray-400">Response</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-400">24/7</div>
              <div className="text-xs text-gray-400">Protection</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}