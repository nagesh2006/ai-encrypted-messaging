const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface AuthTokens {
  access_token: string
  refresh_token?: string
  user_id: string
  email: string
  username: string
}

export class AuthManager {
  private static instance: AuthManager
  
  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager()
    }
    return AuthManager.instance
  }
  
  setTokens(tokens: AuthTokens): void {
    localStorage.setItem('access_token', tokens.access_token)
    localStorage.setItem('user_id', tokens.user_id)
    localStorage.setItem('email', tokens.email)
    localStorage.setItem('username', tokens.username)
    
    if (tokens.refresh_token) {
      localStorage.setItem('refresh_token', tokens.refresh_token)
    }
  }
  
  getAccessToken(): string | null {
    return localStorage.getItem('access_token')
  }
  
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token')
  }
  
  getUserData(): { user_id: string; email: string; username: string } | null {
    const user_id = localStorage.getItem('user_id')
    const email = localStorage.getItem('email')
    const username = localStorage.getItem('username')
    
    if (user_id && email && username) {
      return { user_id, email, username }
    }
    return null
  }
  
  async refreshAccessToken(): Promise<AuthTokens | null> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) return null
    
    try {
      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      })
      
      const result = await response.json()
      
      if (result.success) {
        const tokens: AuthTokens = {
          access_token: result.access_token,
          user_id: result.user_id,
          email: result.email,
          username: result.username
        }
        this.setTokens(tokens)
        return tokens
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
    }
    
    return null
  }
  
  async verifyToken(): Promise<boolean> {
    const accessToken = this.getAccessToken()
    if (!accessToken) return false
    
    try {
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      })
      
      return response.ok
    } catch (error) {
      console.error('Token verification failed:', error)
      return false
    }
  }
  
  async autoLogin(): Promise<AuthTokens | null> {
    // First try to verify current access token
    if (await this.verifyToken()) {
      const userData = this.getUserData()
      if (userData) {
        return {
          access_token: this.getAccessToken()!,
          ...userData
        }
      }
    }
    
    // If access token is invalid, try to refresh
    return await this.refreshAccessToken()
  }
  
  logout(): void {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_id')
    localStorage.removeItem('email')
    localStorage.removeItem('username')
  }
  
  isLoggedIn(): boolean {
    return !!this.getAccessToken() && !!this.getUserData()
  }
}

export const authManager = AuthManager.getInstance()