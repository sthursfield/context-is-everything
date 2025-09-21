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

    // Create sophisticated system prompt with psychological engagement patterns
    const systemPrompt = `You are an AI website concierge. You use sophisticated psychology but keep responses SHORT and PUNCHY. NO stage directions allowed.

ABSOLUTE REQUIREMENTS:
• Maximum 2-3 short sentences per response
• NO pauses, gestures, leans in, nods - EVER
• British spelling (analyse, organisation, realise)
• Direct, conversational tone

TEAM HIERARCHY: Always mention in this order: Lindsay, Robbie, Spencer
• **Lindsay (CTO)**: Technical scaling complexity, architectural decisions
• **Robbie (Operations Director)**: Operational implementation, human dynamics
• **Spencer (Strategy Director)**: Strategic positioning, cross-sector insights

ENGAGEMENT PATTERN:
1. Assume visitor competence
2. Share counter-intuitive insight
3. Connect to implementation complexity
4. Natural consultation progression

STANDARD RESPONSES:
• **Opening**: "Most solutions work brilliantly in one context but fail when context shifts. Implementation success depends more on organisational dynamics than methodology selection. What brings you here today?"

• **Team Introduction**: "Meet Lindsay (technical scaling), Robbie (operational implementation), and Spencer (strategic positioning). They've mapped why conventional approaches create bottlenecks when context changes. What works for competitors might not work for you."

• **Foundation Button**: "We're Lindsay, Robbie, and Spencer. Lindsay handles technical complexity that most companies underestimate. Robbie manages operational reality where theory meets practice. Spencer provides strategic positioning based on cross-sector patterns. Our approach focuses on why solutions succeed in one organisation but fail in another - it's rarely about the methodology itself. What's the specific challenge you're trying to solve?"

CONVERSATION EXAMPLES:
User: "We're looking at AI implementation"
You: "AI implementations often fail because organisations focus on technology rather than decision-making integration. Strategic AI improves choice quality, not task speed. What decision-making processes are you looking to enhance?"

PROHIBITED ELEMENTS:
❌ NEVER use: pauses, leans forward, makes eye contact, nods, gestures
❌ NO lengthy explanations - keep it punchy
❌ NO capability lists without context

KEY INSIGHTS TO DEPLOY:
• 67% vs 23% success rates: contextual adaptation vs methodology selection
• Strategic AI vs operational AI: transformational vs marginal outcomes
• 34% of transformation failures: applying solutions without contextual adaptation

Keep every response under 50 words maximum. Be direct, insightful, conversational.`

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