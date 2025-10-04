import { NextRequest, NextResponse } from 'next/server'
import { identifyVisitorFromNextRequest } from '../../../../thought_leadership/utils/visitor-detection'
import { matchQueryToArticles, getBestArticleMatch } from '../../../../thought_leadership/utils/content-matcher'
import { serveArticleContent, serveCaseStudyContent } from '../../../../thought_leadership/utils/content-server'

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
  
  if (userLimit.count >= 10) { // LOW CREDIT PHASE: 10 requests per hour
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

    // THOUGHT LEADERSHIP + CASE STUDIES INTEGRATION: Check for matches first
    try {
      // Detect visitor type for contextual content serving
      const visitorContext = identifyVisitorFromNextRequest(request)

      // Match query to thought leadership articles and case studies
      const contentMatch = getBestArticleMatch(sanitizedQuery)

      // If we have a high-confidence match, serve appropriate content
      if (contentMatch && contentMatch.confidence > 0.5) {
        // Determine if this is a case study or article
        const isCaseStudy = contentMatch.articleId.includes('transformation') ||
                            contentMatch.articleId.includes('insurance') ||
                            contentMatch.articleId.includes('brokerage')

        const contentResponse = isCaseStudy
          ? await serveCaseStudyContent(
              contentMatch.articleId,
              visitorContext.type,
              sanitizedQuery,
              contentMatch
            )
          : await serveArticleContent(
              contentMatch.articleId,
              visitorContext.type,
              contentMatch,
              visitorContext
            )

        if (contentResponse) {
          return NextResponse.json({
            answer: contentResponse.content,
            timestamp: new Date().toISOString(),
            source: isCaseStudy ? 'case_study' : 'thought_leadership',
            metadata: {
              contentId: contentMatch.articleId,
              confidence: contentMatch.confidence,
              visitorType: visitorContext.type,
              followUpQuestions: contentResponse.metadata?.followUpQuestions
            }
          })
        }
      }
    } catch (error) {
      // Log error but continue to fallback AI response
      console.error('Content serving system error:', error)
    }

    // DEBUG: Special handling for Foundation/Team queries
    if (sanitizedQuery.toLowerCase().includes('foundation') || sanitizedQuery.toLowerCase().includes('team')) {
      const foundationResponse = `**🔬 TEAM-PAGE-V5** Strategic Approach & Team Expertise

Our approach centres on three core team members, each bringing distinct expertise to solve your business challenges:
<div style="display: flex; flex-direction: column; gap: 6px; margin: 8px 0;">
  <div style="display: flex; align-items: flex-start; padding: 8px; border: 1px solid #e0e0e0; border-radius: 8px; background: rgba(255, 255, 255, 0.3); backdrop-filter: blur(8px); gap: 16px;">
    <img src="/uploads/lindsay-headshot.jpg" alt="Lindsay" style="width: 150px; height: 150px; border-radius: 8px; object-fit: cover; border: 1px solid #ddd; flex-shrink: 0;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
    <div style="width: 150px; height: 150px; border-radius: 8px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); display: none; align-items: center; justify-content: center; color: white; font-size: 30px; font-weight: bold; border: 1px solid #ddd; flex-shrink: 0;">L</div>
    <div style="flex: 1; min-width: 0;">
      <h4 style="margin: 0 0 2px 0; font-size: 18px; font-weight: bold; color: #333;">Lindsay</h4>
      <p style="margin: 0 0 2px 0; font-size: 15px; font-weight: 600; color: #666;">CTO (Technical Leadership)</p>
      <p style="margin: 0 0 2px 0; font-size: 15px; line-height: 1.4; color: #555;">Software company building specialist with pragmatic "whatever it takes" approach. Code → Teams → DevOps → FinTech → CTO progression.</p>
      <p style="margin: 0; font-size: 15px;"><strong><a href="javascript:void(0)" onclick="window.parent.postMessage({type:'contact', member:'Lindsay - CTO'}, '*')" style="color: #0066cc; text-decoration: none;">Contact Lindsay →</a></strong></p>
    </div>
  </div>
  <div style="display: flex; align-items: flex-start; padding: 8px; border: 1px solid #e0e0e0; border-radius: 8px; background: rgba(255, 255, 255, 0.3); backdrop-filter: blur(8px); gap: 16px;">
    <img src="/uploads/robbie-macintosh-headshot.jpg" alt="Robbie MacIntosh" style="width: 150px; height: 150px; border-radius: 8px; object-fit: cover; border: 1px solid #ddd; flex-shrink: 0;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
    <div style="width: 150px; height: 150px; border-radius: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: none; align-items: center; justify-content: center; color: white; font-size: 30px; font-weight: bold; border: 1px solid #ddd; flex-shrink: 0;">R</div>
    <div style="flex: 1; min-width: 0;">
      <h4 style="margin: 0 0 2px 0; font-size: 18px; font-weight: bold; color: #333;">Robbie MacIntosh</h4>
      <p style="margin: 0 0 2px 0; font-size: 15px; font-weight: 600; color: #666;">Operations Director (Operational Leadership)</p>
      <p style="margin: 0 0 2px 0; font-size: 15px; line-height: 1.4; color: #555;">Large-scale operations and crisis management specialist. "Connecting people when it really matters" across complex global operations.</p>
      <p style="margin: 0; font-size: 15px;"><strong><a href="javascript:void(0)" onclick="window.parent.postMessage({type:'contact', member:'Robbie MacIntosh - Operations Director'}, '*')" style="color: #0066cc; text-decoration: none;">Contact Robbie →</a></strong></p>
    </div>
  </div>
  <div style="display: flex; align-items: flex-start; padding: 8px; border: 1px solid #e0e0e0; border-radius: 8px; background: rgba(255, 255, 255, 0.3); backdrop-filter: blur(8px); gap: 16px;">
    <img src="/uploads/spencer-headshot.jpg" alt="Spencer" style="width: 150px; height: 150px; border-radius: 8px; object-fit: cover; border: 1px solid #ddd; flex-shrink: 0;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
    <div style="width: 150px; height: 150px; border-radius: 8px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); display: none; align-items: center; justify-content: center; color: white; font-size: 30px; font-weight: bold; border: 1px solid #ddd; flex-shrink: 0;">S</div>
    <div style="flex: 1; min-width: 0;">
      <h4 style="margin: 0 0 2px 0; font-size: 18px; font-weight: bold; color: #333;">Spencer</h4>
      <p style="margin: 0 0 2px 0; font-size: 15px; font-weight: 600; color: #666;">Brand Strategy Director | AI Strategy Consultant (Strategic Leadership)</p>
      <p style="margin: 0 0 2px 0; font-size: 15px; line-height: 1.4; color: #555;">Cross-sector pattern recognition specialist. "Real advantage comes from asking the right questions of your unique data."</p>
      <p style="margin: 0; font-size: 15px;"><strong><a href="javascript:void(0)" onclick="window.parent.postMessage({type:'contact', member:'Spencer - Brand Strategy Director'}, '*')" style="color: #0066cc; text-decoration: none;">Contact Spencer →</a></strong></p>
    </div>
  </div>
</div>
<div style="margin-top: 20px; padding: 15px; background: rgba(248, 249, 250, 0.3); border-radius: 6px; backdrop-filter: blur(6px);">
  <p style="margin: 0; font-weight: bold; color: #333;">Why This Foundation Works:</p>
  <ul style="margin: 10px 0 0 20px; color: #555;">
    <li><strong>Complementary Expertise:</strong> Technical capability + strategic insight + implementation experience</li>
    <li><strong>Proven Track Record:</strong> Collective experience across diverse organisational transformations</li>
    <li><strong>Analytical Approach:</strong> We analyse implementation dynamics before proposing solutions</li>
  </ul>
</div>
What's the specific challenge you're trying to solve?`

      return NextResponse.json({
        answer: foundationResponse,
        timestamp: new Date().toISOString()
      })
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

    // Create sophisticated system prompt with business context and team expertise
    const systemPrompt = `You are Sasha, the research analyst for "Context is Everything" consultancy.

CORE PHILOSOPHY: "Identity emerges through perspective" - demonstrated through contextual intelligence and cross-sector pattern recognition.

YOUR ROLE: Provide immediate analytical value through business intelligence insights, not eager assistance.

TEAM EXPERTISE:
• Lindsay (CTO): Technical architecture, software company building, Bubble.io Ambassador
• Robbie (Operations Director): Crisis management, operational transformation, "Is Everyone Safe" co-founder
• Spencer (Strategy Director): AI strategy, brand positioning, cross-sector pattern recognition

CONVERSATION STYLE: Authentic anti-sycophancy framework
- Lead with relevant analysis, not questions about their challenges
- Provide contrarian insights backed by business intelligence
- Focus on "useful, not eager" interactions
- Route to appropriate team member when reaching expertise limits

ABSOLUTE REQUIREMENTS:
• Maximum 2-3 short sentences per response
• NO *pauses*, *gestures*, *leans in*, *nods* - EVER
• British spelling (analyse, organisation, realise)
• Direct, conversational tone

STANDARD RESPONSES:

Opening:
"Hi, how can I help today?"

Findings Button:
"Most failures happen when companies apply best practices without contextual adaptation. Solutions that work brilliantly elsewhere often create bottlenecks when context shifts.

Cross-sector insights reveal implementation approaches that single-industry experience misses.

What's working elsewhere that you're considering for your situation?"

Future Button:
"Strategic collaboration works when it addresses your specific organisational context rather than applying generic frameworks. We help identify where proven approaches need adaptation for your situation.

Most valuable conversations happen when you're evaluating options that have worked elsewhere but need contextual adjustment for your organisation.

Interested in a strategic discussion about your specific situation?"

Response approach:
1. Open with relevant analytical insight
2. Provide pattern recognition from similar organisations
3. Offer honest limitations and appropriate team handoffs
4. Never use phrases like "I love helping" or "That's exciting!"

PROHIBITED ELEMENTS:
❌ NEVER use: *pauses*, *leans forward*, *makes eye contact*, *nods*, *gestures*
❌ NO lengthy explanations - keep it punchy
❌ NO capability lists without context

Keep responses under 200 words, professional, insightful.`

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
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
      const errorText = await response.text()
      console.error('Anthropic API error:', response.status, response.statusText)
      console.error('Error details:', errorText)
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