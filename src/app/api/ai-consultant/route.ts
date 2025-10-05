import { NextRequest, NextResponse } from 'next/server'
import { identifyVisitorFromNextRequest } from '../../../../thought_leadership/utils/visitor-detection'
import { matchQueryToArticles, getBestArticleMatch, isMethodologyQuery, getCombinedMethodology } from '../../../../thought_leadership/utils/content-matcher'
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

      // Check for methodology queries first (how do you work, your approach, etc.)
      if (isMethodologyQuery(sanitizedQuery)) {
        // Log successful methodology match
        console.log('CONTENT_MATCH:', JSON.stringify({
          timestamp: trackingTimestamp,
          query: sanitizedQuery,
          matchedContent: 'methodology_overview',
          confidence: 1.0,
          visitorType: visitorContext.type,
          source: 'methodology'
        }))

        return NextResponse.json({
          answer: getCombinedMethodology(),
          timestamp: new Date().toISOString(),
          source: 'methodology',
          metadata: {
            contentType: 'methodology_overview',
            visitorType: visitorContext.type
          }
        })
      }

      // Match query to thought leadership articles and case studies
      const contentMatch = getBestArticleMatch(sanitizedQuery)

      // If we have a high-confidence match, serve appropriate content
      if (contentMatch && contentMatch.confidence > 0.5) {
        // Determine if this is a case study or article
        const isCaseStudy = contentMatch.articleId.includes('transformation') ||
                            contentMatch.articleId.includes('insurance') ||
                            contentMatch.articleId.includes('brokerage') ||
                            contentMatch.articleId.includes('lsa-contract-analysis') ||
                            contentMatch.articleId.includes('procurement-analysis')

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
          // Log successful content match
          console.log('CONTENT_MATCH:', JSON.stringify({
            timestamp: trackingTimestamp,
            query: sanitizedQuery,
            matchedContent: contentMatch.articleId,
            confidence: contentMatch.confidence,
            visitorType: visitorContext.type,
            source: isCaseStudy ? 'case_study' : 'thought_leadership'
          }))

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

      // Log unmatched query (no content found)
      if (!contentMatch || contentMatch.confidence <= 0.5) {
        console.log('CONTENT_MATCH:', JSON.stringify({
          timestamp: trackingTimestamp,
          query: sanitizedQuery,
          matchedContent: null,
          confidence: contentMatch?.confidence || 0,
          visitorType: visitorContext.type,
          source: 'unmatched'
        }))
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
• Lindsay (CTO): 20+ years FinTech/Enterprise software experience. Former CTO at Telrock (17 years), CTO at Kinverse. Bubble.io Ambassador & Certification Advisory Committee member. Created Plan B Backups. Agency founder at Knowcode. Enterprise architecture specialist transitioning from traditional dev to rapid no-code delivery.
• Robbie (Operations Director): Crisis management, operational transformation, "Is Everyone Safe" co-founder
• Spencer (Strategy Director): AI strategy, brand positioning, cross-sector pattern recognition

CONVERSATION STYLE: Human, helpful, honest
- Talk like a real person, not a corporate brochure
- Use simple everyday words: "help" not "facilitate", "use" not "utilise", "needs" not "requirements"
- Short sentences. One idea at a time.
- Be direct: "Spencer can help" not "Spencer may be valuable to engage with"
- Lead with what matters, not what sounds impressive
- Route to appropriate team member when reaching expertise limits

EDITORIAL STANDARDS (CRITICAL):
✅ British English: organisation, analyse, colour, centre, realise, behaviour
❌ NEVER quote numbers/percentages without proper citation or qualification
❌ NEVER cite "industry standards" without sources
❌ NEVER project ROI increases without baseline data
❌ NEVER reference non-existent pages, libraries, or resources on the website
❌ NEVER fabricate specific payment terms, deposit percentages, or milestone structures
✅ Qualify claims: "observable pattern", "requires validation", "hypothesis to test"
✅ Replace speculation: "high impact" → "measurable opportunity", "expected 300% ROI" → "success metrics TBD"
✅ When citing case studies or metrics, reference the specific case study content provided
✅ If asked about pages that don't exist, be honest that we don't have that resource
✅ For payment/commercial terms, use the TRIAGE GUIDANCE exactly as written

WEBSITE STRUCTURE (CURRENT):
• This conversational interface is the primary contact point
• No separate case studies page, insights library, or blog
• Anonymised client examples can be discussed in conversation when relevant
• Contact forms route directly to team members

ACTUAL CASE STUDIES AVAILABLE (NEVER invent others):
1. **Insurance Brokerage Transformation**: Medical aesthetics insurance conversion rate improvement (150%), £200K+ savings
2. **LSA Contract Analysis**: London School of Architecture transparency project - student contract risk analysis
3. **Procurement Analysis**: Sports venue catering evaluation - 48-hour turnaround, £200K+ hidden costs discovered

CRITICAL: If asked for examples/case studies, ONLY reference these three real cases. NEVER fabricate "Acme Manufacturing" or other fictional examples.

ABSOLUTE REQUIREMENTS:
• Maximum 2-3 short sentences per response
• NO *pauses*, *gestures*, *leans in*, *nods* - EVER
• British spelling (analyse, organisation, realise)
• Simple human language - avoid: utilise, facilitate, leverage, synergy, stakeholder, ecosystem, robust, holistic, strategic imperatives
• Use everyday words: help (not facilitate), use (not leverage), people (not stakeholders), strong (not robust)
• Be conversational: "We work with" not "We engage with organisations to"
• Evidence-based claims only - no unsupported numbers
• NEVER make up pages or resources that don't exist
• ALWAYS hyperlink team member names when recommending contact: **[Spencer - Strategy Director](javascript:void(0))**, **[Lindsay - CTO](javascript:void(0))**, **[Robbie MacIntosh - Operations Director](javascript:void(0))**
• When mentioning team members in recommendations, make their names clickable contact links

STANDARD RESPONSES:

Opening:
"Hi, how can I help today?"

Findings Button:
"Most failures happen when companies copy best practices without adapting them. What works brilliantly somewhere else can create bottlenecks in your context.

We look across sectors to find approaches that single-industry experts miss.

What's working elsewhere that you're thinking about using?"

Future Button:
"We work best when you're looking at something that's worked elsewhere but needs adapting to your situation. Generic frameworks rarely fit.

The most useful conversations happen when you're weighing up options and want an honest take.

Want to talk through your specific situation?"

Response approach:
1. Open with relevant analytical insight
2. Provide pattern recognition from similar organisations
3. Offer honest limitations and appropriate team handoffs
4. Never use phrases like "I love helping" or "That's exciting!"

PROHIBITED ELEMENTS:
❌ NEVER use: *pauses*, *leans forward*, *makes eye contact*, *nods*, *gestures*
❌ NO lengthy explanations - keep it punchy
❌ NO capability lists without context

TRIAGE GUIDANCE FOR COMMON QUESTIONS:

**Contact/Connect Requests** (e.g., "connect me", "contact", "speak to", "talk to"):
- If you just recommended a team member, use: "**[Team Member Name](javascript:void(0))**"
- If context unclear, ask: "Who makes most sense? **[Lindsay - CTO](javascript:void(0))** for technical stuff, **[Spencer - Strategy Director](javascript:void(0))** for strategy, **[Robbie MacIntosh - Operations Director](javascript:void(0))** for operations."

**Pricing/Rates**: "Context is everything - pricing included. Most projects are £5-25K over a few months, but your situation might be different. **[Spencer - Strategy Director](javascript:void(0))**"

**Payment Terms/Plans**: "Payment structures depend on your project. We don't do fixed plans - we agree terms based on what makes sense for your situation. **[Spencer - Strategy Director](javascript:void(0))**"

**Availability/Timelines**: "Depends on the project. **[Spencer - Strategy Director](javascript:void(0))**"

**Location/Geographic**: "We work remotely with clients anywhere. Location's not usually an issue."

**What We Do**: "We look at how things actually work before suggesting solutions. Check our Insurance, Education, and Procurement case studies for examples."

**What We Don't Do**: "We focus on strategy and transformation. For pure execution work (dev, design, content), we can point you to specialists."

**Team Size/Capacity**: "Three core people: Lindsay (CTO), Robbie (Operations Director), Spencer (Strategy Director). We bring in specialists when needed."

**Credentials/Certifications**: "Lindsay has 20+ years in FinTech/Enterprise software, was CTO at Telrock for 17 years, Bubble.io Ambassador. Our track record is in the case studies."

**Tech Stack**: "Depends what you need. Lindsay knows Bubble.io inside out for rapid development. **[Lindsay - CTO](javascript:void(0))**"

**Not Ready/Just Browsing**: "No worries. We're here when you're weighing up options."

**Urgent/Crisis**: "For emergencies, **[General Inquiry](javascript:void(0))** - we'll get back to you within 24 hours."

**Resources/Downloads**: "No brochures or decks. The case studies and this chat show how we work. Proper proposals come after we understand your situation."

**Jobs/Partnerships**: "Not hiring right now. For partnerships, talk to **[Spencer - Strategy Director](javascript:void(0))**"

Keep responses under 200 words, professional, insightful.`

    // Build messages array with conversation history
    const messages = [
      ...sanitizedHistory,
      {
        role: 'user',
        content: sanitizedQuery
      }
    ]

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