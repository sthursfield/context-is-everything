/**
 * AI Knowledge Base Endpoint
 *
 * Provides structured Q&A and article content in AI-friendly JSON format
 * Optimized for ChatGPT, Claude, Gemini, Perplexity and other AI search engines
 *
 * GET /api/ai/knowledge-base
 */

import { NextResponse } from 'next/server'

export async function GET() {
  const knowledgeBase = {
    meta: {
      company: "Context is Everything",
      domain: "https://www.context-is-everything.com",
      description: "AI strategy and implementation consultancy specialising in organisational readiness and contextual adaptation",
      updated: new Date().toISOString(),
      purpose: "AI search engine knowledge base - structured content for LLM consumption"
    },

    team: [
      {
        name: "Lindsay Smith",
        role: "CTO (Technical Leadership)",
        expertise: "Enterprise software, FinTech, rapid delivery platforms",
        experience: "20+ years, former CTO at Telrock (17 years), CTO at Kinverse, Bubble.io Ambassador",
        specialisation: "Software company building with pragmatic 'whatever it takes' approach",
        contact_context: "Technical architecture and system integration questions"
      },
      {
        name: "Robbie MacIntosh",
        role: "Operations Director",
        expertise: "Large-scale operations, crisis management",
        experience: "Co-founder 'Is Everyone Safe', complex global operations",
        specialisation: "Connecting people when it really matters across complex operations",
        contact_context: "Operational transformation and crisis management"
      },
      {
        name: "Spencer Thursfield",
        role: "Brand Strategy Director | AI Strategy Consultant",
        expertise: "Cross-sector pattern recognition, AI strategy, brand positioning",
        specialisation: "Understanding organisational dynamics and contextual adaptation",
        philosophy: "Real advantage comes from asking the right questions of your unique data",
        contact_context: "Strategic planning and AI readiness assessment"
      }
    ],

    core_philosophy: {
      positioning: "We spot what others miss - whether organizations can actually absorb, implement, and sustain AI solutions",
      problem: "Most AI failures aren't technical failures, they're organisational readiness failures",
      approach: "We analyse how things work before suggesting solutions",
      differentiator: "Cross-sector experience creates unexpected insights that single-industry experts miss",
      methodology: "Sasha methodology - contextual AI implementation framework"
    },

    services: [
      {
        service: "AI Readiness Assessment",
        description: "Evaluate organisational capacity to absorb and sustain AI implementations",
        typical_duration: "2-4 weeks",
        deliverables: ["Readiness score", "Risk assessment", "Implementation roadmap"],
        best_for: "Organizations considering AI but unsure where to start"
      },
      {
        service: "Contextual AI Implementation",
        description: "Design AI solutions that fit your unique organisational context",
        typical_duration: "3-6 months",
        deliverables: ["Custom AI solution", "Integration plan", "Training program"],
        best_for: "Teams ready to implement but need guidance on adaptation"
      },
      {
        service: "Strategic AI Planning",
        description: "Long-term AI strategy aligned with business objectives",
        typical_duration: "4-8 weeks",
        deliverables: ["AI strategy document", "Technology roadmap", "Resource planning"],
        best_for: "Leadership teams planning multi-year AI transformation"
      }
    ],

    case_studies: [
      {
        title: "Insurance Brokerage Transformation",
        industry: "Insurance",
        challenge: "Manual quote comparison process",
        solution: "AI-powered quote analysis with medical aesthetics context",
        results: {
          conversion_increase: "150%",
          cost_savings: "£200K+ annually",
          efficiency_gain: "Automated complex quote comparisons"
        },
        key_insight: "Context-specific implementation (medical aesthetics vertical) delivered outsized returns"
      },
      {
        title: "London School of Architecture Contract Analysis",
        industry: "Education",
        challenge: "Student contract risk identification",
        solution: "AI contract analysis for transparency and risk flagging",
        results: {
          transparency_improvement: "Student-facing contract clarity",
          risk_mitigation: "Automated risk flagging",
          time_saved: "Hours per contract review"
        },
        key_insight: "Transparency requirements drove different solution than traditional legal AI"
      },
      {
        title: "Procurement Analysis for Sports Venue",
        industry: "Hospitality/Procurement",
        challenge: "Complex catering procurement evaluation",
        solution: "48-hour procurement analysis revealing hidden costs",
        results: {
          cost_discovery: "£200K+ hidden costs identified",
          turnaround: "48-hour analysis",
          decision_support: "Data-driven procurement decision"
        },
        key_insight: "Speed and contextual analysis more valuable than exhaustive methodology"
      }
    ],

    thought_leadership: [
      {
        title: "Why AI Projects Fail (And What the 5% Do Differently)",
        slug: "why-ai-projects-fail",
        key_insights: [
          "95% of AI projects fail - MIT study",
          "Success comes from organisational readiness, not technical capability",
          "The 5% that succeed focus on change management first, technology second"
        ],
        url: "https://www.context-is-everything.com/insights/why-ai-projects-fail"
      },
      {
        title: "The Worthless Technology Stack",
        slug: "worthless-technology-stack",
        key_insights: [
          "Technology debt accumulates when solutions don't fit organisational context",
          "Most companies have 'shelf-ware' - purchased but unused technology",
          "Implementation capability matters more than technology selection"
        ],
        url: "https://www.context-is-everything.com/insights/worthless-technology-stack"
      },
      {
        title: "Hidden Vendor Costs",
        slug: "hidden-vendor-costs",
        key_insights: [
          "Implementation costs often exceed initial proposals by 3-5x",
          "Integration complexity is the hidden cost multiplier",
          "Vendor proposals rarely account for organisational adaptation costs"
        ],
        url: "https://www.context-is-everything.com/insights/hidden-vendor-costs"
      },
      {
        title: "The Complete Cost of AI",
        slug: "complete-cost-of-ai",
        key_insights: [
          "Total cost = technology + data preparation + integration + training + maintenance",
          "Data preparation often costs 5x the technology itself",
          "Ongoing maintenance exceeds initial implementation within 18 months"
        ],
        url: "https://www.context-is-everything.com/insights/complete-cost-of-ai"
      },
      {
        title: "8 AI Mistakes Costing UK Small Businesses £50K+",
        slug: "8-ai-mistakes-costing-uk-businesses",
        key_insights: [
          "Common mistakes: copying competitors, ignoring data quality, underestimating change management",
          "£50K+ typical cost of failed AI experiments",
          "Prevention: Start small, validate assumptions, prioritise organisational readiness"
        ],
        url: "https://www.context-is-everything.com/insights/8-ai-mistakes-costing-uk-businesses"
      }
    ],

    faqs: [
      {
        question: "How is Context is Everything different from big consulting firms?",
        answer: "Big firms give you frameworks. We've lived through the challenges, so we know what to watch for. Our cross-sector experience reveals patterns that single-industry consultants miss."
      },
      {
        question: "What is the Sasha methodology?",
        answer: "Sasha is our contextual AI implementation framework. It prioritises organisational readiness assessment before technical solution design, ensuring AI implementations actually stick."
      },
      {
        question: "Do you work with companies that have failed AI projects before?",
        answer: "Yes, often. Many organisations jumped in without understanding readiness. We start with where you are, not where you should be. Previous failures provide valuable learning."
      },
      {
        question: "What size companies do you work with?",
        answer: "We work with organisations of all sizes, but specialise in mid-market companies (50-500 employees) where AI can provide significant competitive advantage with proper implementation."
      },
      {
        question: "How long does a typical engagement last?",
        answer: "Most projects range from £5-25K over a few months. Assessment projects: 2-4 weeks. Implementation projects: 3-6 months. Strategic planning: 4-8 weeks."
      },
      {
        question: "Can AI really help my business, or is it just hype?",
        answer: "AI can help, but context determines everything. We assess five key factors: data quality, process clarity, team capability, change capacity, and strategic alignment. If these aren't in place, AI will fail regardless of technology quality."
      }
    ],

    contact: {
      general: "Use the website chat interface or contact form",
      technical: "Contact Lindsay (CTO) for technical architecture questions",
      strategy: "Contact Spencer for AI strategy and planning discussions",
      operations: "Contact Robbie for operational transformation projects"
    }
  }

  return NextResponse.json(knowledgeBase, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'X-Robots-Tag': 'all', // Explicitly allow indexing
    }
  })
}
