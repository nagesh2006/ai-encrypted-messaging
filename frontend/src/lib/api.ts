const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = {
  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async get(endpoint: string, token?: string) {
    const headers: any = {}
    if (token) headers.Authorization = `Bearer ${token}`
    
    const response = await fetch(`${API_URL}${endpoint}`, { headers })
    return response.json()
  }
}