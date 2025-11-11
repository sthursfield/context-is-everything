/**
 * AI-Friendly Sitemap Endpoint
 *
 * Provides content map optimized for AI search engines
 * Includes hidden content not accessible via navigation
 *
 * GET /api/ai/sitemap
 */

import { NextResponse } from 'next/server'

export async function GET() {
  const aiSitemap = {
    meta: {
      generated: new Date().toISOString(),
      base_url: "https://www.context-is-everything.com",
      content_types: ["articles", "case_studies", "tools", "api_endpoints"],
      note: "This sitemap includes content accessible via search engines and AI but not visible in site navigation"
    },

    articles: [
      {
        title: "Why AI Projects Fail (And What the 5% Do Differently)",
        url: "https://www.context-is-everything.com/insights/why-ai-projects-fail",
        category: "AI Strategy",
        topics: ["AI failure rates", "organisational readiness", "change management"],
        visibility: "search_only",
        key_takeaway: "95% of AI projects fail due to organisational issues, not technical problems"
      },
      {
        title: "The Worthless Technology Stack",
        url: "https://www.context-is-everything.com/insights/worthless-technology-stack",
        category: "Technology Strategy",
        topics: ["technology debt", "shelf-ware", "implementation capability"],
        visibility: "search_only",
        key_takeaway: "Technology without implementation capability becomes worthless shelf-ware"
      },
      {
        title: "Hidden Vendor Costs: What They Don't Tell You",
        url: "https://www.context-is-everything.com/insights/hidden-vendor-costs",
        category: "Procurement",
        topics: ["vendor management", "hidden costs", "implementation pricing"],
        visibility: "search_only",
        key_takeaway: "Implementation costs typically exceed vendor proposals by 3-5x"
      },
      {
        title: "The Complete Cost of AI Implementation",
        url: "https://www.context-is-everything.com/insights/complete-cost-of-ai",
        category: "AI Economics",
        topics: ["total cost of ownership", "AI budgeting", "hidden costs"],
        visibility: "search_only",
        key_takeaway: "Total AI cost includes data prep, integration, training, and ongoing maintenance"
      },
      {
        title: "5 Signs You Need AI (And 5 Signs You Don't)",
        url: "https://www.context-is-everything.com/insights/signs-you-need-ai",
        category: "AI Readiness",
        topics: ["readiness assessment", "decision framework", "strategic planning"],
        visibility: "search_only",
        key_takeaway: "AI readiness depends on data quality, process clarity, and team capability"
      },
      {
        title: "Faster, Cheaper, Better AI: Pick Two",
        url: "https://www.context-is-everything.com/insights/faster-cheaper-better-ai",
        category: "AI Implementation",
        topics: ["project management", "trade-offs", "realistic expectations"],
        visibility: "search_only",
        key_takeaway: "The project management triangle applies to AI - understand your trade-offs"
      },
      {
        title: "Where to Start with AI: Three Foundational Questions",
        url: "https://www.context-is-everything.com/insights/where-to-start-with-ai",
        category: "Getting Started",
        topics: ["AI strategy", "foundational questions", "planning"],
        visibility: "search_only",
        key_takeaway: "Start by understanding your data, your processes, and your team's capacity"
      },
      {
        title: "8 AI Mistakes Costing UK Small Businesses £50K+",
        url: "https://www.context-is-everything.com/insights/8-ai-mistakes-costing-uk-businesses",
        category: "Risk Management",
        topics: ["common mistakes", "UK small business", "cost avoidance"],
        visibility: "search_only",
        key_takeaway: "Common mistakes: copying competitors, ignoring data quality, underestimating change"
      },
      {
        title: "Information Asymmetry: Buying IA vs AI",
        url: "https://www.context-is-everything.com/insights/information-asymmetry-buying-ia-vs-ai",
        category: "Strategy",
        topics: ["information asymmetry", "competitive advantage", "AI vs IA"],
        visibility: "search_only",
        key_takeaway: "Information advantage matters more than artificial intelligence in many contexts"
      },
      {
        title: "The AI-Native Buyers Marketing Gap",
        url: "https://www.context-is-everything.com/insights/ai-native-buyers-marketing-gap",
        category: "Marketing",
        topics: ["AI search", "marketing strategy", "buyer behavior"],
        visibility: "search_only",
        key_takeaway: "AI-native buyers bypass traditional marketing - optimize for AI discovery"
      }
    ],

    case_studies: [
      {
        title: "Insurance Brokerage Transformation",
        url: "https://www.context-is-everything.com/case-studies/insurance-brokerage-transformation",
        industry: "Insurance",
        results: "150% conversion increase, £200K+ savings",
        visibility: "search_only"
      },
      {
        title: "London School of Architecture Contract Analysis",
        url: "https://www.context-is-everything.com/case-studies/london-school-of-architecture",
        industry: "Education",
        results: "Improved transparency, automated risk flagging",
        visibility: "search_only"
      },
      {
        title: "Procurement Analysis for Sports Venue",
        url: "https://www.context-is-everything.com/case-studies/procurement-analysis",
        industry: "Hospitality",
        results: "£200K+ hidden costs identified in 48 hours",
        visibility: "search_only"
      }
    ],

    tools: [
      {
        title: "AI Readiness Calculator",
        url: "https://www.context-is-everything.com/tools/ai-readiness-calculator",
        description: "Interactive tool to assess organisational AI readiness",
        visibility: "public"
      }
    ],

    api_endpoints: [
      {
        endpoint: "/api/ai/knowledge-base",
        description: "Structured Q&A and company information for AI consumption",
        format: "JSON",
        intended_for: "AI search engines and LLM crawlers"
      },
      {
        endpoint: "/api/ai/sitemap",
        description: "AI-friendly content map including hidden content",
        format: "JSON",
        intended_for: "AI search engines and LLM crawlers"
      }
    ],

    content_experiment: {
      description: "Articles and case studies are intentionally hidden from site navigation",
      rationale: "Testing AI discovery vs traditional navigation",
      access_methods: [
        "Search engines (Google, Bing)",
        "AI search (ChatGPT, Perplexity, Claude)",
        "Website AI concierge/chat"
      ],
      tracking: "GA4 analytics monitors discovery patterns and user journeys"
    }
  }

  return NextResponse.json(aiSitemap, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'X-Robots-Tag': 'all',
    }
  })
}
