export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: 'user' | 'admin'
  preferences: {
    language: string
    interests: string[]
  }
  createdAt: string
  updatedAt: string
  isActive: boolean
  lastLogin?: string
  avatar?: string
}

export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone?: string
  preferences: {
    language: string
    interests: string[]
  }
  avatar?: string
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  newUsers: number
  adminUsers: number
}
