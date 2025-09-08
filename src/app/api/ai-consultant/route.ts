import { NextRequest, NextResponse } from 'next/server'

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const userLimit = rateLimitStore.get(ip)
  
  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new limit
    rateLimitStore.set(ip, { count: 1, resetTime: now + 60 * 60 * 1000 }) // 1 hour
    return false
  }
  
  if (userLimit.count >= 10) { // Max 10 requests per hour
    return true
  }
  
  userLimit.count++
  return false
}

function sanitizeInput(input: string): string {
  // Basic input sanitization
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, 500) // Limit length
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous'
    
    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    const { query } = await request.json()
    
    // Validate input
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      )
    }

    const sanitizedQuery = sanitizeInput(query)
    
    if (!sanitizedQuery) {
      return NextResponse.json(
        { error: 'Invalid query after sanitization' },
        { status: 400 }
      )
    }

    // Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not configured')
      return NextResponse.json(
        { error: 'AI service temporarily unavailable' },
        { status: 500 }
      )
    }

    // Create context-aware system prompt
    const systemPrompt = `You are an AI consultant for "Context is Everything," a brand strategy and design agency. 

    Our core philosophy: Identity emerges through perspective. Context shapes meaning.

    Our services include:
    - Brand strategy and positioning
    - Visual identity and design systems  
    - 3D visualization and interactive experiences
    - Contextual marketing and adaptive content
    - Technology consultation for brand implementations

    Our team consists of:
    - CTO: Sarah Chen (technology strategy, AI integration)
    - COO: Marcus Rodriguez (operations, growth strategy)
    - CMO: Elena Kowalski (brand strategy, marketing)

    Respond helpfully about our services, philosophy, and capabilities. Keep responses concise (under 200 words), professional, and aligned with our "context is everything" brand voice. If asked about topics unrelated to our business, politely redirect to our services.`

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 300,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: sanitizedQuery
          }
        ]
      })
    })

    if (!response.ok) {
      console.error('Anthropic API error:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'AI service temporarily unavailable' },
        { status: 500 }
      )
    }

    const data = await response.json()
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      console.error('Unexpected API response structure:', data)
      return NextResponse.json(
        { error: 'Invalid response from AI service' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      answer: data.content[0].text,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI consultant error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}