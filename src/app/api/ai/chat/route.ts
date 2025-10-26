import { NextRequest, NextResponse } from 'next/server'

// Use the public env var (accessible at build time) or fallback to localhost
const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || process.env.AI_SERVICE_URL || 'https://darshana-copy-production.up.railway.app'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, sessionId, context, user_id } = body

    console.log('[AI API] Received request:', { message: message?.substring(0, 50), sessionId })
    console.log('[AI API] AI Service URL:', AI_SERVICE_URL)
    console.log('[AI API] Environment check:', {
      NEXT_PUBLIC_AI_SERVICE_URL: process.env.NEXT_PUBLIC_AI_SERVICE_URL,
      AI_SERVICE_URL: process.env.AI_SERVICE_URL,
      fallback: 'http://localhost:8000'
    })

    if (!message || message.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Message is required',
          success: false 
        },
        { status: 400 }
      )
    }

    // Forward the request to the AI service
    const aiServiceEndpoint = `${AI_SERVICE_URL}/api/ai/chat`
    console.log('[AI API] Calling AI service:', aiServiceEndpoint)

    const response = await fetch(aiServiceEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message.trim(),
        session_id: sessionId || `session-${Date.now()}`,
        context: context || {},
        user_id: user_id || null,
      }),
    })

    console.log('[AI API] AI service response status:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('[AI API] AI service error:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        url: aiServiceEndpoint
      })
      return NextResponse.json(
        { 
          error: 'AI service error', 
          details: errorData.message || response.statusText,
          status: response.status,
          url: aiServiceEndpoint,
          success: false
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('[AI API] AI service response:', { 
      status: data.status, 
      hasResponse: !!data.response,
      intent: data.intent 
    })

    // Ensure the response has the expected structure
    return NextResponse.json({
      ...data,
      success: true,
      response: data.response || 'I apologize, but I encountered an issue processing your request.',
      suggestions: data.suggestions || [],
      intent: data.intent || 'general_inquiry',
      metadata: data.metadata || {
        confidence: 0.5,
        session_id: sessionId,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('[AI API] Unexpected error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false,
        response: 'I apologize, but I encountered a technical issue. Please try again.',
        suggestions: ['Try asking a different question', 'Refresh the page'],
        intent: 'error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Check if AI service is reachable
    const aiServiceUrl = AI_SERVICE_URL || 'http://localhost:8000'
    console.log('[AI API Health] Checking AI service at:', aiServiceUrl)
    
    const response = await fetch(`${aiServiceUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch((error) => {
      console.error('[AI API Health] AI service unreachable:', error)
      return null
    })

    if (!response || !response.ok) {
      return NextResponse.json({ 
        message: 'AI Chat API',
        status: 'degraded',
        aiServiceStatus: 'unreachable',
        aiServiceUrl: aiServiceUrl,
        endpoint: '/api/ai/chat',
        method: 'POST',
        success: false
      }, { status: 503 })
    }

    const healthData = await response.json()
    console.log('[AI API Health] AI service health:', healthData)

    return NextResponse.json({ 
      message: 'AI Chat API',
      status: 'healthy',
      aiServiceStatus: healthData.status || 'unknown',
      aiServiceUrl: aiServiceUrl,
      endpoint: '/api/ai/chat',
      method: 'POST',
      success: true
    })
  } catch (error) {
    console.error('[AI API Health] Error:', error)
    return NextResponse.json({ 
      message: 'AI Chat API',
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      endpoint: '/api/ai/chat',
      method: 'POST',
      success: false
    }, { status: 500 })
  }
}


