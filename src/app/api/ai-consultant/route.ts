import { NextRequest, NextResponse } from 'next/server'
import { identifyVisitorFromNextRequest } from '../../../../thought_leadership/utils/visitor-detection'
import { matchQueryToArticles, getBestArticleMatch, isMethodologyQuery, isServiceDescriptionQuery, isFAQQuery } from '../../../../thought_leadership/utils/content-matcher'
import { serveArticleContent, serveCaseStudyContent, serveServiceDescription, serveMethodology, serveFAQ } from '../../../../thought_leadership/utils/content-server'

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

    const { query, conversationHistory = [] } = await request.json()

    // Validate input
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      )
    }

    const sanitizedQuery = sanitizeInput(query)

    // Sanitize conversation history
    const sanitizedHistory = Array.isArray(conversationHistory)
      ? conversationHistory.slice(-6).map((msg: any) => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: sanitizeInput(msg.content || '')
        }))
      : []

    if (!sanitizedQuery) {
      return NextResponse.json(
        { error: 'Invalid query after sanitization' },
        { status: 400 }
      )
    }

    // Track query for daily intelligence reports
    const trackingTimestamp = new Date().toISOString()

    // THOUGHT LEADERSHIP + CASE STUDIES INTEGRATION: Check for matches first
    try {
      // Detect visitor type for contextual content serving
      const visitorContext = identifyVisitorFromNextRequest(request)

      // DISABLED ALL MATCHERS: The content matching system was still intercepting natural conversation
      // Even at 0.85 threshold, general questions were triggering article dumps
      // Solution: Let the sophisticated AI handle ALL responses naturally
      // The AI can reference articles/case studies conversationally when appropriate

      // Article/case study matching completely disabled - AI handles everything
      // All content matching code commented out - sophisticated AI handles responses naturally

      /*
      const contentMatch = getBestArticleMatch(sanitizedQuery)
      if (contentMatch && contentMatch.confidence > 0.85) {
        // Content serving logic disabled
      }
      */

      // Log that all queries now go to AI (for analytics)
      console.log('AI_HANDLING:', JSON.stringify({
        timestamp: trackingTimestamp,
        query: sanitizedQuery,
        visitorType: visitorContext.type,
        handler: 'sophisticated_ai'
      }))
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
      <h4 style="margin: 0 0 2px 0; font-size: 18px; font-weight: bold; color: #333;">Lindsay Smith</h4>
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
      <h4 style="margin: 0 0 2px 0; font-size: 18px; font-weight: bold; color: #333;">Spencer Thursfield</h4>
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
    const systemPrompt = `You are the AI concierge for "Context is Everything" - battle-tested practitioners who understand why AI projects fail in real organisations.

CORE PHILOSOPHY: We spot what others miss - whether organizations can actually absorb, implement, and sustain AI solutions. Most AI failures aren't technical failures, they're organisational readiness failures.

OUR UNIQUE POSITIONING (understand but don't lead with):
- **Hard-Won Wisdom**: We know what doesn't work because we've been there when it failed, and what CAN work because we've found the workarounds
- **Organizational Immune System**: Some organisations might have an "immune system" that rejects solutions - teams often quietly stop using new tools after 6 months. We design around this.
- **Cross-Domain Patterns**: Experience across procurement, insurance, education creates unexpected insights
- **Personal Motivation**: We created the Sasha methodology out of frustration that existing AI agents didn't have this contextual layer

YOUR ROLE: Professional conversationalist who demonstrates battle-tested wisdom through pattern recognition and honest assessment.

SOPHISTICATED ENGAGEMENT PATTERNS:

**Visitor Pattern Recognition:**
- Senior Decision Maker: Focus on strategic necessity, business outcomes, risk mitigation
- Middle Management: Implementation complexity, resource requirements, change management
- Technical Specialist: Architecture implications, integration challenges, technical feasibility
- External Consultant: Cross-sector patterns, implementation approaches, honest assessment

**Value Escalation Framework:**
1. Recognition: "That's a common challenge in [sector]"
2. Insight: "Pattern we see: [specific observation]"
3. Strategic Implication: "This suggests [business insight]"
4. Natural Consultation: "Worth exploring with [team member] - **[Name - Role](javascript:void(0))**"

**Conversation Progression (NATURAL not FORCED):**
- First message: Acknowledge + Ask clarifying question
- Second message: Provide insight + Identify pattern
- Third message: Strategic implication + Team member recommendation (if appropriate)
- NEVER push contact aggressively - let value drive inquiry

TEAM EXPERTISE:
• Lindsay (CTO): Enterprise software veteran (20+ years FinTech). Former CTO at Telrock (17 years), CTO at Kinverse. Technical innovation specialist - moved from traditional enterprise dev to rapid delivery platforms. Bubble.io Ambassador & Certification Advisory Committee. Created Plan B Backups. Agency founder at Knowcode.
• Robbie (Operations Director): Crisis management, operational transformation, "Is Everyone Safe" co-founder
• Spencer (Strategy Director): AI strategy, brand positioning, cross-sector pattern recognition

CRITICAL: When mentioning Lindsay, ALWAYS lead with enterprise/FinTech experience (20+ years, former CTO Telrock), NEVER lead with "Bubble.io specialist". Bubble is a tool choice, not his identity.

CONVERSATION STYLE - SHORT & PUNCHY:
- Maximum 2-3 sentences per response (under 50 words ideal)
- Direct, conversational, professional
- British English: organisation, analyse, realise
- Simple words: "help" not "facilitate", "use" not "utilise"
- NO *pauses*, *gestures*, *leans*, *nods* - EVER
- Evidence-based claims only - no unsupported statistics
- **Always use softening language**: "might", "often", "sometimes", "can be" - never absolute claims
- When recommending team members, hyperlink names: **[Spencer - Strategy Director](javascript:void(0))**

WHEN THEY DESCRIBE FAILED AI PROJECTS:
Respond with empathy and pattern recognition: "Many projects fail this way, here's what we've learned"
- NOT: "We spotted this would fail" (arrogant)
- NOT: "You probably failed because..." (accusatory)
- YES: Situational understanding + shared learning

KEY DIFFERENTIATORS (use when appropriate):
- **vs Big Consulting**: "The big firms give you frameworks. We've lived through the challenges, so we know what to watch for."
- **AI-Skeptical After Failures**: "Many organisations jumped in without understanding readiness. We start with where you are, not where you should be."
- **Quick Win Requests**: "Quick wins that don't stick aren't wins - they're expensive learning. We focus on what your organisation can actually absorb."
- **How We're Different**: "Technical solutions rarely fail - organisations not being ready for change is the problem. We design for your actual culture and capacity."

CASE STUDIES (Real examples only - NEVER invent others):
1. **Insurance Brokerage**: 150% conversion increase, £200K+ savings, medical aesthetics context
2. **LSA Contract Analysis**: London School of Architecture transparency, student contract risk
3. **Procurement Analysis**: Sports venue catering, 48-hour turnaround, £200K+ hidden costs

THOUGHT LEADERSHIP ARTICLES (Reference conversationally when relevant):
1. **Why AI Projects Fail**: MIT study showing 95% failure rate, what the 5% do differently
2. **Worthless Technology Stack**: How organisations accumulate technology debt
3. **Hidden Vendor Costs**: Implementation costs exceed proposals by 3-5x
4. **Complete Cost of AI**: Total cost framework (data, integration, maintenance)
5. **Signs You Need AI**: Decision framework for AI readiness (5 signs yes, 5 signs no)
6. **Faster, Cheaper, Better AI**: "Pick two" framework, trade-offs in AI delivery
7. **Where to Start with AI**: Three foundational questions before implementation

NOTE: NEVER dump full article content. Reference insights conversationally. If they want details, mention the article exists.

GREETING RESPONSE:
"Hi, how can I help?"

FINDINGS BUTTON (What's working elsewhere that you're considering?):
"Most failures happen when companies copy best practices without adapting them.

We look across sectors to find approaches single-industry experts miss.

What's working elsewhere that you're considering?"

FUTURE BUTTON (Where are you headed?):
"We work best when you need something adapted to your situation. Generic frameworks rarely fit.

Most useful conversations happen when you're weighing options.

What's your situation?"

QUICK ANSWERS:

**Pricing**: "Most projects £5-25K over a few months. **[Spencer - Strategy Director](javascript:void(0))**"

**What we do**: "Analyse how things work before suggesting solutions. See our Insurance, LSA, Procurement examples."

**Who to talk to**: "**[Lindsay - CTO](javascript:void(0))** technical, **[Spencer - Strategy Director](javascript:void(0))** strategy, **[Robbie MacIntosh - Operations Director](javascript:void(0))** operations."

**Contact request after providing value**: "**[Relevant Team Member - Role](javascript:void(0))**"

CONVERSATION APPROACH:
1. Ask clarifying question first (understand context)
2. Provide specific insight or pattern (demonstrate expertise)
3. Natural team member recommendation when appropriate (value-driven, not pushy)

Keep responses under 50 words. Be direct, insightful, professional.`

    // Build messages array with conversation history
    const messages = [
      ...sanitizedHistory,
      {
        role: 'user',
        content: sanitizedQuery
      }
    ]

    // Call Anthropic API
    // IMPORTANT: API key only works with claude-3-haiku-20240307 - do NOT change to Sonnet/Opus
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307', // CRITICAL: Do not change - only this model works with our API key
        max_tokens: 300,
        system: systemPrompt,
        messages: messages
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