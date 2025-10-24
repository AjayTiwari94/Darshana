/**
 * API utility functions for making HTTP requests to the backend
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface ApiCallOptions {
  method?: string
  body?: any
  headers?: Record<string, string>
  requireAuth?: boolean
}

/**
 * Generic API call function
 */
export async function apiCall(
  endpoint: string,
  options: ApiCallOptions = {}
): Promise<any> {
  const {
    method = 'GET',
    body,
    headers = {},
    requireAuth = false,
  } = options

  const url = `${API_BASE_URL}${endpoint}`

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  // Add auth token if required
  if (requireAuth && typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }
  }

  // Add body for POST/PUT/PATCH requests
  if (body && method !== 'GET') {
    config.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}

/**
 * Authentication API calls
 */
export const authApi = {
  login: async (email: string, password: string) => {
    return apiCall('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
  },

  register: async (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    phone?: string
  }) => {
    return apiCall('/api/auth/register', {
      method: 'POST',
      body: userData,
    })
  },

  logout: async () => {
    return apiCall('/api/auth/logout', {
      method: 'POST',
      requireAuth: true,
    })
  },

  getCurrentUser: async () => {
    return apiCall('/api/auth/me', {
      requireAuth: true,
    })
  },
}

/**
 * Monuments API calls
 */
export const monumentsApi = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const queryParams = new URLSearchParams(params as any).toString()
    return apiCall(`/api/monuments${queryParams ? `?${queryParams}` : ''}`)
  },

  getById: async (id: string) => {
    return apiCall(`/api/monuments/${id}`)
  },

  create: async (monumentData: any) => {
    return apiCall('/api/monuments', {
      method: 'POST',
      body: monumentData,
      requireAuth: true,
    })
  },

  update: async (id: string, monumentData: any) => {
    return apiCall(`/api/monuments/${id}`, {
      method: 'PUT',
      body: monumentData,
      requireAuth: true,
    })
  },

  delete: async (id: string) => {
    return apiCall(`/api/monuments/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    })
  },
}

/**
 * Stories API calls
 */
export const storiesApi = {
  getAll: async (params?: { page?: number; limit?: number; category?: string }) => {
    const queryParams = new URLSearchParams(params as any).toString()
    return apiCall(`/api/stories${queryParams ? `?${queryParams}` : ''}`)
  },

  getById: async (id: string) => {
    return apiCall(`/api/stories/${id}`)
  },

  create: async (storyData: any) => {
    return apiCall('/api/stories', {
      method: 'POST',
      body: storyData,
      requireAuth: true,
    })
  },

  update: async (id: string, storyData: any) => {
    return apiCall(`/api/stories/${id}`, {
      method: 'PUT',
      body: storyData,
      requireAuth: true,
    })
  },

  delete: async (id: string) => {
    return apiCall(`/api/stories/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    })
  },
}

/**
 * AI Service API calls
 */
export const aiApi = {
  chat: async (message: string, sessionId?: string, context?: any) => {
    return apiCall('/api/ai/chat', {
      method: 'POST',
      body: { message, session_id: sessionId, context },
    })
  },

  health: async () => {
    const AI_BASE_URL = process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:8000'
    const response = await fetch(`${AI_BASE_URL}/health`)
    return response.json()
  },
}

/**
 * Tickets API calls
 */
export const ticketsApi = {
  create: async (ticketData: any) => {
    return apiCall('/api/tickets', {
      method: 'POST',
      body: ticketData,
      requireAuth: true,
    })
  },

  getMyTickets: async () => {
    return apiCall('/api/tickets/my-tickets', {
      requireAuth: true,
    })
  },

  getById: async (id: string) => {
    return apiCall(`/api/tickets/${id}`, {
      requireAuth: true,
    })
  },

  cancel: async (id: string) => {
    return apiCall(`/api/tickets/${id}/cancel`, {
      method: 'POST',
      requireAuth: true,
    })
  },
}

export default apiCall


