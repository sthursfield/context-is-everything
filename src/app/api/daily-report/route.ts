import { NextRequest, NextResponse } from 'next/server'

/**
 * Daily Content Intelligence Report Generator
 *
 * This endpoint:
 * 1. Analyzes yesterday's query logs from Vercel
 * 2. Generates insights about content performance
 * 3. Emails report to spencer@point35.com
 *
 * Triggered by Vercel Cron daily at 9am GMT
 */

interface QueryLog {
  timestamp: string
  query: string
  matchedContent: string | null
  confidence: number
  visitorType: string
  source: string
}

export async function GET(request: NextRequest) {
  try {
    // Verify this is from Vercel Cron (security check)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get yesterday's date range
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    console.log(`Generating daily report for ${yesterday.toISOString().split('T')[0]}`)

    // In production, this would fetch from Vercel logs
    // For now, we'll analyze logs from console.log statements
    const queryLogs = await fetchQueryLogs(yesterday, today)

    // Generate intelligence report
    const report = generateIntelligenceReport(queryLogs, yesterday)

    // Send email via Resend
    await sendReport(report)

    return NextResponse.json({
      success: true,
      message: 'Daily report generated and sent',
      summary: {
        totalQueries: queryLogs.length,
        matched: queryLogs.filter(q => q.matchedContent).length,
        unmatched: queryLogs.filter(q => !q.matchedContent).length
      }
    })

  } catch (error) {
    console.error('Daily report error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}

/**
 * Fetch query logs from Vercel
 * Note: In production, this would use Vercel's API or log aggregation
 * For initial implementation, we parse console logs
 */
async function fetchQueryLogs(startDate: Date, endDate: Date): Promise<QueryLog[]> {
  // TODO: Implement Vercel log fetching
  // For now, return empty array (will be populated as queries come in)

  // This is a placeholder - in production you'd fetch from:
  // 1. Vercel's log streaming API
  // 2. A database you're logging to
  // 3. Analytics platform like Mixpanel

  return []
}

/**
 * Generate human-readable intelligence report
 */
function generateIntelligenceReport(logs: QueryLog[], date: Date): string {
  const dateStr = date.toISOString().split('T')[0]

  // Count queries by category
  const totalQueries = logs.length
  const matchedQueries = logs.filter(l => l.matchedContent)
  const unmatchedQueries = logs.filter(l => !l.matchedContent)

  // Group by content type
  const contentPerformance = new Map<string, number>()
  matchedQueries.forEach(log => {
    if (log.matchedContent) {
      const count = contentPerformance.get(log.matchedContent) || 0
      contentPerformance.set(log.matchedContent, count + 1)
    }
  })

  // Sort by frequency
  const topContent = Array.from(contentPerformance.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Group unmatched queries
  const unmatchedByQuery = new Map<string, number>()
  unmatchedQueries.forEach(log => {
    const count = unmatchedByQuery.get(log.query) || 0
    unmatchedByQuery.set(log.query, count + 1)
  })

  const topUnmatched = Array.from(unmatchedByQuery.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Visitor type breakdown
  const visitorTypes = new Map<string, number>()
  logs.forEach(log => {
    const count = visitorTypes.get(log.visitorType) || 0
    visitorTypes.set(log.visitorType, count + 1)
  })

  // Generate report
  return `
📊 DAILY CONTENT INTELLIGENCE REPORT
Date: ${dateStr}
Generated: ${new Date().toISOString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 OVERVIEW
• Total Queries: ${totalQueries}
• Matched: ${matchedQueries.length} (${totalQueries > 0 ? Math.round(matchedQueries.length / totalQueries * 100) : 0}%)
• Unmatched: ${unmatchedQueries.length} (${totalQueries > 0 ? Math.round(unmatchedQueries.length / totalQueries * 100) : 0}%)

${totalQueries === 0 ? '⚠️  No queries recorded yesterday. System may be warming up or experiencing low traffic.\n' : ''}

${topContent.length > 0 ? `
🔥 TOP PERFORMING CONTENT
${topContent.map(([content, count], i) =>
  `${i + 1}. ${formatContentName(content)} - ${count} ${count === 1 ? 'match' : 'matches'}`
).join('\n')}
` : ''}

${topUnmatched.length > 0 ? `
❌ UNMATCHED QUERIES (Content Gaps)
${topUnmatched.map(([query, count], i) =>
  `${i + 1}. "${query}" - ${count} ${count === 1 ? 'request' : 'requests'}`
).join('\n')}

💡 Recommendation: ${generateRecommendation(topUnmatched)}
` : ''}

${visitorTypes.size > 0 ? `
👥 VISITOR BREAKDOWN
${Array.from(visitorTypes.entries()).map(([type, count]) =>
  `• ${capitalise(type)}: ${count} (${totalQueries > 0 ? Math.round(count / totalQueries * 100) : 0}%)`
).join('\n')}
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 ACTIONABLE INSIGHTS

${generateActionableInsights(logs, topContent, topUnmatched)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This report was automatically generated by your Content Intelligence system.
To adjust frequency or content, modify /api/daily-report/route.ts

Context is Everything | www.context-is-everything.com
  `.trim()
}

/**
 * Format content IDs into readable names
 */
function formatContentName(contentId: string): string {
  const names: Record<string, string> = {
    'insurance-brokerage-transformation': 'Insurance Case Study',
    'lsa-contract-analysis': 'LSA Education Case Study',
    'procurement-analysis': 'Procurement Case Study',
    'methodology_overview': 'Methodology Overview',
    'ai-project-failures': 'AI Project Failures Article'
  }

  return names[contentId] || contentId
}

/**
 * Capitalise first letter
 */
function capitalise(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Generate recommendation based on unmatched queries
 */
function generateRecommendation(topUnmatched: [string, number][]): string {
  if (topUnmatched.length === 0) {
    return 'All queries matched existing content. System performing well!'
  }

  const [topQuery, count] = topUnmatched[0]

  // Analyse query to suggest content type
  const query = topQuery.toLowerCase()

  if (query.includes('healthcare') || query.includes('medical')) {
    return `Consider creating healthcare-focused case study (${count} requests)`
  } else if (query.includes('small business') || query.includes('smb')) {
    return `Consider SMB-focused content variant (${count} requests)`
  } else if (query.includes('cost') || query.includes('pricing')) {
    return `Add pricing/ROI information to existing content (${count} requests)`
  } else {
    return `High priority: Create content addressing "${topQuery}" (${count} requests)`
  }
}

/**
 * Generate actionable insights
 */
function generateActionableInsights(
  logs: QueryLog[],
  topContent: [string, number][],
  topUnmatched: [string, number][]
): string {
  const insights: string[] = []

  if (logs.length === 0) {
    insights.push('• Monitor traffic sources - low query volume detected')
    insights.push('• Verify analytics tracking is working correctly')
    return insights.join('\n')
  }

  // Content performance insights
  if (topContent.length > 0) {
    const [bestContent, bestCount] = topContent[0]
    const matchRate = (bestCount / logs.length * 100).toFixed(0)
    insights.push(`✅ ${formatContentName(bestContent)} is your top performer (${matchRate}% of queries)`)

    if (topContent.length > 1) {
      insights.push(`📊 Consider creating similar content to ${formatContentName(bestContent)}`)
    }
  }

  // Content gap insights
  if (topUnmatched.length > 0) {
    insights.push(`⚠️  ${topUnmatched.length} unique unmatched ${topUnmatched.length === 1 ? 'query' : 'queries'} - opportunity for new content`)
    insights.push(`🎯 Priority: ${generateRecommendation(topUnmatched)}`)
  }

  // Default insight if nothing specific
  if (insights.length === 0) {
    insights.push('• System operating normally')
    insights.push('• Monitor for emerging trends')
  }

  return insights.join('\n')
}

/**
 * Send report via Resend
 */
async function sendReport(report: string): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    console.error('RESEND_API_KEY not configured - cannot send email')
    console.log('Report would have been:\n', report)
    return
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'onboarding@resend.dev',
      to: ['spencer@point35.com'],
      subject: `📊 Daily Content Intelligence - ${new Date().toISOString().split('T')[0]}`,
      text: report
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to send email: ${error}`)
  }

  console.log('Daily report sent successfully to spencer@point35.com')
}
