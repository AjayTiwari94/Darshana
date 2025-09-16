import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User, Monument, NaradAI, Message } from '@/types'

// Auth Store
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        
        login: async (email: string, password: string) => {
          set({ isLoading: true })
          try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
            // API call to login
            const response = await fetch(`${apiUrl}/api/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
            })
            const data = await response.json()
            
            if (data.success) {
              set({ 
                user: data.data,
                token: data.token,
                isAuthenticated: true, 
                isLoading: false 
              })
            } else {
              throw new Error(data.message)
            }
          } catch (error) {
            set({ isLoading: false })
            throw error
          }
        },
        
        logout: async () => {
          try {
            const token = get().token
            
            // Call backend logout endpoint if user is authenticated
            if (token) {
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
              await fetch(`${apiUrl}/api/auth/logout`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              })
            }
          } catch (error) {
            console.error('Logout API error:', error)
            // Continue with local logout even if API fails
          } finally {
            // Clear local state regardless of API success/failure
            set({ 
              user: null,
              token: null,
              isAuthenticated: false 
            })
          }
        },
        
        updateProfile: async (data: Partial<User>) => {
          const currentUser = get().user
          const token = get().token
          if (!currentUser || !token) return
          
          try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
            const response = await fetch(`${apiUrl}/api/user/profile`, {
              method: 'PUT',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(data)
            })
            const result = await response.json()
            
            if (result.success) {
              set({ user: { ...currentUser, ...data } })
            }
          } catch (error) {
            console.error('Profile update failed:', error)
          }
        }
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ 
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated 
        })
      }
    )
  )
)

// Monument Store
interface MonumentState {
  monuments: Monument[]
  currentMonument: Monument | null
  isLoading: boolean
  searchResults: Monument[]
  filters: {
    location?: string
    category?: string[]
    period?: string
  }
  fetchMonuments: () => Promise<void>
  fetchMonument: (id: string) => Promise<void>
  searchMonuments: (query: string) => Promise<void>
  setFilters: (filters: any) => void
}

export const useMonumentStore = create<MonumentState>()(
  devtools((set, get) => ({
    monuments: [],
    currentMonument: null,
    isLoading: false,
    searchResults: [],
    filters: {},
    
    fetchMonuments: async () => {
      set({ isLoading: true })
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        const response = await fetch(`${apiUrl}/api/monuments`)
        const data = await response.json()
        set({ monuments: data.data || [], isLoading: false })
      } catch (error) {
        set({ isLoading: false })
        console.error('Failed to fetch monuments:', error)
      }
    },
    
    fetchMonument: async (id: string) => {
      set({ isLoading: true })
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        const response = await fetch(`${apiUrl}/api/monuments/${id}`)
        const data = await response.json()
        set({ currentMonument: data.data, isLoading: false })
      } catch (error) {
        set({ isLoading: false })
        console.error('Failed to fetch monument:', error)
      }
    },
    
    searchMonuments: async (query: string) => {
      set({ isLoading: true })
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        const response = await fetch(`${apiUrl}/api/monuments/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        set({ searchResults: data.data || [], isLoading: false })
      } catch (error) {
        set({ isLoading: false })
        console.error('Search failed:', error)
      }
    },
    
    setFilters: (filters) => {
      set({ filters: { ...get().filters, ...filters } })
    }
  }))
)

// Narad AI Store
interface NaradAIState {
  session: NaradAI | null
  messages: Message[]
  isActive: boolean
  isLoading: boolean
  startSession: () => void
  endSession: () => void
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
}

export const useNaradAIStore = create<NaradAIState>()(
  devtools((set, get) => ({
    session: null,
    messages: [],
    isActive: false,
    isLoading: false,
    
    startSession: () => {
      const sessionId = Date.now().toString()
      set({ 
        session: {
          sessionId,
          context: {
            userLocation: undefined,
            preferences: {
              language: 'en',
              contentTypes: [],
              interests: [],
              accessibility: {
                audioNarration: false,
                highContrast: false,
                fontSize: 'medium',
                subtitles: false
              }
            },
            conversationHistory: []
          },
          isActive: true
        },
        isActive: true,
        messages: [{
          _id: 'welcome',
          type: 'ai',
          content: 'Namaste! 🙏 I\'m Narad AI, your friendly cultural guide. Ask me about monuments, stories, or myths - I\'m here to help! ✨',
          timestamp: new Date().toISOString()
        }]
      })
    },
    
    endSession: () => {
      set({ 
        session: null, 
        isActive: false,
        messages: []
      })
    },
    
    sendMessage: async (content: string) => {
      const session = get().session
      if (!session) return
      
      const userMessage: Message = {
        _id: Date.now().toString(),
        type: 'user',
        content,
        timestamp: new Date().toISOString()
      }
      
      set({ 
        messages: [...get().messages, userMessage],
        isLoading: true 
      })
      
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        const requestUrl = `${apiUrl}/api/ai/chat`
        
        console.log('🔍 Narad AI Debug:', {
          apiUrl,
          requestUrl,
          sessionId: session.sessionId,
          message: content
        })
        
        const response = await fetch(requestUrl, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            sessionId: session.sessionId,
            message: content,
            context: session.context
          })
        })
        
        console.log('📡 Response status:', response.status, response.statusText)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('📨 Response data:', data)
        
        if (data.status === 'success') {
          const aiMessage: Message = {
            _id: (Date.now() + 1).toString(),
            type: 'ai',
            content: data.response,
            timestamp: new Date().toISOString(),
            metadata: {
              suggestedActions: data.suggestions,
              ...data.metadata
            }
          }
          
          set({
            messages: [...get().messages, aiMessage],
            isLoading: false
          })
        } else {
          throw new Error(data.message || 'Failed to get AI response')
        }

      } catch (error) {
        console.error('❌ Narad AI Error:', error)
        
        // Add error message
        const errorMessage: Message = {
          _id: (Date.now() + 1).toString(),
          type: 'ai',
          content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
          timestamp: new Date().toISOString()
        }
        
        set({ 
          messages: [...get().messages, errorMessage],
          isLoading: false
        })
      }
    },
    
    clearMessages: () => {
      set({ messages: [] })
    }
  }))
)

// UI Store for global UI state
interface UIState {
  sidebarOpen: boolean
  searchModalOpen: boolean
  naradAIOpen: boolean
  currentPage: string
  setSidebarOpen: (open: boolean) => void
  setSearchModalOpen: (open: boolean) => void
  setNaradAIOpen: (open: boolean) => void
  setCurrentPage: (page: string) => void
}

export const useUIStore = create<UIState>()(
  devtools((set) => ({
    sidebarOpen: false,
    searchModalOpen: false,
    naradAIOpen: false,
    currentPage: 'home',
    
    setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
    setSearchModalOpen: (open: boolean) => set({ searchModalOpen: open }),
    setNaradAIOpen: (open: boolean) => set({ naradAIOpen: open }),
    setCurrentPage: (page: string) => set({ currentPage: page })
  }))
)