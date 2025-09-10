'use client'

interface FuzzyLogicVisualizationProps {
  fuzzyDetails: any
  finalDecision: string
  finalScore: number
}

export default function FuzzyLogicVisualization({ 
  fuzzyDetails, 
  finalDecision, 
  finalScore 
}: FuzzyLogicVisualizationProps) {
  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'allowed': return 'text-green-600 bg-green-50'
      case 'flagged': return 'text-yellow-600 bg-yellow-50'
      case 'blocked': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.7) return 'bg-red-500'
    if (score >= 0.4) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-800 flex items-center">
          🧠 AI Analysis
        </h4>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDecisionColor(finalDecision)}`}>
          {finalDecision.toUpperCase()}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Risk Score</span>
          <div className="flex items-center space-x-2">
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getScoreColor(finalScore)} transition-all duration-500`}
                style={{ width: `${finalScore * 100}%` }}
              />
            </div>
            <span className="text-sm font-mono text-gray-700">
              {(finalScore * 100).toFixed(1)}%
            </span>
          </div>
        </div>
        
        {fuzzyDetails && (
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-white rounded border">
              <div className="font-medium text-gray-600">Spam</div>
              <div className="text-orange-600 font-mono">
                {((fuzzyDetails.spam_prob || 0) * 100).toFixed(0)}%
              </div>
            </div>
            <div className="text-center p-2 bg-white rounded border">
              <div className="font-medium text-gray-600">Toxic</div>
              <div className="text-red-600 font-mono">
                {((fuzzyDetails.toxic_prob || 0) * 100).toFixed(0)}%
              </div>
            </div>
            <div className="text-center p-2 bg-white rounded border">
              <div className="font-medium text-gray-600">AI Conf</div>
              <div className="text-blue-600 font-mono">
                {((fuzzyDetails.ai_confidence || 0) * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}