// API utility functions and configuration

// Base URL for API requests
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Base URL for backend requests (authentication, user management, etc.)
export const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

// Generic API call function for AI service
export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || `API error: ${response.status}`)
    }
    
    return data
  } catch (error) {
    console.error(`API call failed for ${url}:`, error)
    throw error
  }
}

// Generic API call function for backend service
export const backendApiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = `${BACKEND_BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || `Backend API error: ${response.status}`)
    }
    
    return data
  } catch (error) {
    console.error(`Backend API call failed for ${url}:`, error)
    throw error
  }
}