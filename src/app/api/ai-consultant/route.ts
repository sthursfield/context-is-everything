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
• NO *pauses*, *gestures*, *leans in*, *nods* - EVER
• British spelling (analyse, organisation, realise)
• Direct, conversational tone

TEAM HIERARCHY:
Always mention in this order: Lindsay, Robbie, Spencer

STANDARD RESPONSES:

Opening:
"Most solutions work brilliantly in one context but fail when context shifts. Implementation success depends more on organisational dynamics than methodology selection.

What brings you here today?"

Foundation Button:
"**Foundation: Strategic Approach & Team Expertise**

Our approach centres on three core team members, each bringing distinct expertise to solve your business challenges:

<div style=\"display: flex; gap: 20px; margin: 20px 0; flex-wrap: wrap; justify-content: center;\">
  <div style=\"text-align: center; flex: 1; min-width: 200px; max-width: 250px;\">
    <div style=\"width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 36px; font-weight: bold; border: 3px solid #e0e0e0;\">R</div>
    <h4 style=\"margin: 10px 0 5px 0; color: #333;\">Robbie MacIntosh</h4>
    <p style=\"font-weight: bold; color: #666; margin: 5px 0 10px 0;\">Strategic Implementation</p>
    <p style=\"font-size: 14px; line-height: 1.4; color: #555;\">15+ years scaling technology solutions. Focuses on implementation dynamics that determine success rates.</p>
  </div>

  <div style=\"text-align: center; flex: 1; min-width: 200px; max-width: 250px;\">
    <div style=\"width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 36px; font-weight: bold; border: 3px solid #e0e0e0;\">L</div>
    <h4 style=\"margin: 10px 0 5px 0; color: #333;\">Lindsay</h4>
    <p style=\"font-weight: bold; color: #666; margin: 5px 0 10px 0;\">Technical Architecture</p>
    <p style=\"font-size: 14px; line-height: 1.4; color: #555;\">Expert in system integration and technical feasibility analysis for complex organisational requirements.</p>
  </div>

  <div style=\"text-align: center; flex: 1; min-width: 200px; max-width: 250px;\">
    <div style=\"width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 36px; font-weight: bold; border: 3px solid #e0e0e0;\">S</div>
    <h4 style=\"margin: 10px 0 5px 0; color: #333;\">Spencer</h4>
    <p style=\"font-weight: bold; color: #666; margin: 5px 0 10px 0;\">Business Analysis</p>
    <p style=\"font-size: 14px; line-height: 1.4; color: #555;\">Specialises in organisational dynamics and strategic business transformation initiatives.</p>
  </div>
</div>

<div style=\"margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 6px;\">
  <p style=\"margin: 0; font-weight: bold; color: #333;\">Why This Foundation Works:</p>
  <ul style=\"margin: 10px 0 0 20px; color: #555;\">
    <li><strong>Complementary Expertise:</strong> Technical capability + strategic insight + implementation experience</li>
    <li><strong>Proven Track Record:</strong> Collective experience across diverse organisational transformations</li>
    <li><strong>Analytical Approach:</strong> We analyse implementation dynamics before proposing solutions</li>
  </ul>
  <p style=\"margin: 10px 0 0 0; color: #555;\">The combination ensures you get both strategic direction and practical execution capability.</p>
</div>

What's the specific challenge you're trying to solve?"

Findings Button:
"Most failures happen when companies apply best practices without contextual adaptation. Solutions that work brilliantly elsewhere often create bottlenecks when context shifts.

Cross-sector insights reveal implementation approaches that single-industry experience misses.

What's working elsewhere that you're considering for your situation?"

Future Button:
"Strategic collaboration works when it addresses your specific organisational context rather than applying generic frameworks. We help identify where proven approaches need adaptation for your situation.

Most valuable conversations happen when you're evaluating options that have worked elsewhere but need contextual adjustment for your organisation.

Interested in a strategic discussion about your specific situation?"

PROHIBITED ELEMENTS:
❌ NEVER use: *pauses*, *leans forward*, *makes eye contact*, *nods*, *gestures*
❌ NO lengthy explanations - keep it punchy
❌ NO capability lists without context

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