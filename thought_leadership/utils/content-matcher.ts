/**
 * Content Matching Utility
 * Matches user queries to relevant thought leadership articles
 */

export interface QueryMatch {
  articleId: string;
  confidence: number;
  matchedKeywords: string[];
  relevantSections?: string[];
}

/**
 * Article keyword mapping for query matching
 */
const ARTICLE_KEYWORDS = {
  'article-01-ai-projects-fail': {
    primary: [
      'ai fail', 'ai failure', 'why ai fail', 'ai project fail',
      'ai implementation', 'ai pilot', 'ai success', 'enterprise ai'
    ],
    secondary: [
      'mit ai study', 'ai 95%', 'generative ai roi', 'ai adoption',
      'build vs buy ai', 'ai strategy', 'ai best practices'
    ],
    concepts: [
      'ai implementation failure', 'enterprise ai success', 'context-aware ai',
      'ai vendor selection', 'ai integration', 'distributed ai adoption'
    ]
  },
  'article-02-worthless-technology-stack': {
    primary: [
      'middleware', 'technology stack', 'worthless complexity',
      'system simplification', 'technical debt', 'architecture'
    ],
    secondary: [
      'esb', 'enterprise service bus', 'integration', 'legacy system',
      'complexity reduction', 'architecture optimization', 'stack audit'
    ],
    concepts: [
      'architectural bloat', 'worthless middleware', 'valuable complexity',
      'direct connection', 'integration simplification', 'cost reduction',
      'performance optimization', 'system modernization'
    ]
  },
  'article-03-hidden-vendor-costs': {
    primary: [
      'vendor costs', 'hidden costs', 'procurement', 'rfp',
      'vendor proposal', 'contract analysis', 'vendor evaluation'
    ],
    secondary: [
      'vendor selection', 'total cost of ownership', 'tco',
      'procurement analysis', 'cost discovery', 'vendor comparison',
      'contract negotiation', 'proposal evaluation'
    ],
    concepts: [
      'responsibility shifting', 'unrealistic assumptions', 'missing inclusions',
      'baseline establishment', 'proposal standardisation', 'anomaly detection',
      'procurement best practices', 'vendor management'
    ]
  },
  'article-04-complete-cost-of-ai': {
    primary: [
      'ai cost', 'ai budget', 'ai investment', 'ai roi',
      'ai spending', 'ai implementation cost', 'hidden ai costs'
    ],
    secondary: [
      'total cost of ownership', 'tco', 'data preparation cost',
      'change management cost', 'ai maintenance', 'ai governance',
      'budget planning', 'investment planning'
    ],
    concepts: [
      'data readiness', 'adoption challenge', 'integration complexity',
      'model drift', 'performance degradation', 'compliance requirements',
      'context-aware ai', 'cost optimization', 'roi measurement'
    ]
  },
  'article-05-signs-you-need-ai': {
    primary: [
      'do i need ai', 'should i use ai', 'ai readiness',
      'when to use ai', 'ai assessment', 'ready for ai'
    ],
    secondary: [
      'ai decision', 'business ai', 'sme ai', 'small business ai',
      'ai for business', 'ai implementation readiness', 'ai suitability'
    ],
    concepts: [
      'repetitive decisions', 'data analysis bottleneck', 'personalisation at scale',
      'non-linear scaling', 'context-dependent operations', 'process documentation',
      'problem definition', 'data quality', 'competitive pressure'
    ]
  },
  'article-06-faster-cheaper-better': {
    primary: [
      'faster cheaper better', 'ai value', 'ai roi', 'ai business value',
      'ai outcomes', 'ai results', 'what does ai deliver'
    ],
    secondary: [
      'ai trade-offs', 'pick two', 'ai benefits', 'ai performance',
      'ai value delivery', 'business outcomes', 'ai expectations'
    ],
    concepts: [
      'speed cost quality', 'implementation trade-offs', 'jackpot scenario',
      'two out of three', 'outcome prioritisation', 'realistic expectations',
      'value realisation', 'scale economics'
    ]
  },
  'article-08-information-asymmetry': {
    primary: [
      'information asymmetry', 'lemon market', 'ai consulting', 'ia vs ai',
      'intelligence augmentation', 'buying ai', 'vendor selection', 'consultant selection'
    ],
    secondary: [
      'akerlof', 'market for lemons', 'generic ai', 'contextual ai',
      'ai commodity', 'strategic asset', 'proof of value', 'adverse selection'
    ],
    concepts: [
      'quality uncertainty', 'consultant evaluation', 'implementation failure',
      'generic vs contextual', 'context encoding', 'competitive advantage',
      'risk shifting', 'outcome-based metrics', 'contextual understanding'
    ]
  },
  'article-09-7-ai-mistakes': {
    primary: [
      'ai mistakes', 'ai implementation mistakes', '7 ai mistakes', 'ai failures',
      'ai abandonment', 'ai project failure', 'uk small business ai', 'ai experiment'
    ],
    secondary: [
      'ai costs uk', 'ai project costs', 'why ai fails', 'ai adoption decline',
      'ai implementation costs', 'cast ai experiments', 'ai experimentation'
    ],
    concepts: [
      'implementation vs experiment', 'ai cost reality', 'human oversight ai',
      'forcing adoption', 'perfect data myth', 'set and forget', 'measuring wrong things',
      'starting too broad', 'underestimating costs', 'ai abandonment rate'
    ]
  },
  'article-10-ai-native-buyers': {
    primary: [
      'b2b buyers ai', 'marketing ai readiness', 'ai native buyers', 'forrester ai research',
      'b2b marketing ai', 'ai buying journey', '90 20 gap', 'buyer ai adoption'
    ],
    secondary: [
      'marketing ai gap', 'b2b marketing transformation', 'ai readiness framework',
      'marketing ai implementation', 'forrester research', 'ai content scrutiny'
    ],
    concepts: [
      'buyer seller mismatch', 'ai assisted research', 'content consistency ai',
      'messaging stress test', 'five pillars readiness', 'governance frameworks',
      'change fatigue', 'strategic pilots', 'amplification risk'
    ]
  },
  'contextual-ai-adoption': {
    primary: [
      'contextual ai', 'ai adoption', 'ai strategy', 'ai planning',
      'intelligent systems', 'adaptive ai', 'context aware'
    ],
    secondary: [
      'business intelligence', 'ai integration', 'enterprise ai',
      'ai architecture', 'scalable ai', 'ai framework'
    ],
    concepts: [
      'business context', 'organizational readiness', 'technology stack',
      'data architecture', 'user experience', 'performance monitoring'
    ]
  },
  'transformation-readiness': {
    primary: [
      'ai readiness', 'transformation assessment', 'digital readiness',
      'organizational change', 'ai maturity', 'change readiness'
    ],
    secondary: [
      'culture change', 'team development', 'process optimization',
      'technology audit', 'capability assessment', 'strategic planning'
    ],
    concepts: [
      'leadership commitment', 'data governance', 'technical skills',
      'process maturity', 'risk management', 'stakeholder engagement'
    ]
  }
};

/**
 * Case Study keyword mapping for query matching
 */
const CASE_STUDY_KEYWORDS = {
  'insurance-brokerage-transformation': {
    primary: [
      'insurance', 'conversion rate', 'lead conversion', 'automation',
      'InsurTech', 'medical aesthetics', 'brokerage'
    ],
    secondary: [
      'digital transformation', 'process optimization', 'agent productivity',
      'middleware', 'ROI', 'scalability', 'form automation'
    ],
    concepts: [
      'context-aware automation', 'intelligent questioning', 'eliminate complexity',
      'architectural simplification', 'document generation', 'competitive advantage'
    ],
    industries: ['insurance', 'healthcare', 'finance']
  },
  'lsa-contract-analysis': {
    primary: [
      'education', 'student', 'university', 'contract analysis', 'LSA',
      'architecture school', 'transparency', 'student rights'
    ],
    secondary: [
      'educational transparency', 'contract risk', 'institutional merger',
      'student protection', 'hidden fees', 'refund policy', 'legal analysis'
    ],
    concepts: [
      'information asymmetry', 'risk disclosure', 'forensic analysis',
      'multi-tier verification', 'public transparency', 'student empowerment'
    ],
    industries: ['education', 'legal', 'professional services']
  },
  'procurement-analysis': {
    primary: [
      'procurement', 'vendor evaluation', 'supplier', 'RFP', 'contract evaluation',
      'catering', 'sports venue', '48 hours', 'AI analysis'
    ],
    secondary: [
      'procurement transformation', 'anomaly detection', 'hidden costs',
      'vendor comparison', 'time reduction', 'enterprise procurement'
    ],
    concepts: [
      'context-aware AI', 'multi-format processing', 'audit trails',
      'financial modeling', 'risk assessment', 'strategic acceleration'
    ],
    industries: ['sports', 'entertainment', 'procurement', 'facilities']
  }
};

/**
 * Industry-specific context mapping
 */
const INDUSTRY_CONTEXT = {
  healthcare: ['patient', 'clinical', 'medical', 'healthcare', 'hospital', 'diagnosis'],
  finance: ['financial', 'banking', 'investment', 'trading', 'regulatory', 'compliance'],
  retail: ['customer', 'ecommerce', 'inventory', 'supply chain', 'personalization'],
  manufacturing: ['production', 'quality', 'supply chain', 'automation', 'efficiency'],
  technology: ['software', 'development', 'platform', 'infrastructure', 'scalability']
};

/**
 * Extract keywords from user query
 */
function extractKeywords(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2)
    .filter(word => !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'had', 'but', 'what', 'say', 'this', 'how', 'why', 'when', 'where'].includes(word));
}

/**
 * Calculate semantic similarity between query and article keywords
 */
function calculateSemanticMatch(queryKeywords: string[], articleKeywords: string[]): number {
  const exactMatches = queryKeywords.filter(qk =>
    articleKeywords.some(ak => ak.includes(qk) || qk.includes(ak))
  );

  const conceptMatches = queryKeywords.filter(qk =>
    articleKeywords.some(ak => {
      const akWords = ak.split(/\s+/);
      return akWords.some(akw => qk.includes(akw) || akw.includes(qk));
    })
  );

  const exactScore = exactMatches.length / queryKeywords.length;
  const conceptScore = conceptMatches.length / queryKeywords.length * 0.7;

  return Math.min(1.0, exactScore + conceptScore);
}

/**
 * Detect industry context from query
 */
function detectIndustryContext(query: string): string[] {
  const queryLower = query.toLowerCase();
  const detectedIndustries: string[] = [];

  Object.entries(INDUSTRY_CONTEXT).forEach(([industry, keywords]) => {
    const matches = keywords.filter(keyword => queryLower.includes(keyword));
    if (matches.length > 0) {
      detectedIndustries.push(industry);
    }
  });

  return detectedIndustries;
}

/**
 * Match user query to relevant articles and case studies
 */
export function matchQueryToArticles(query: string): QueryMatch[] {
  const queryKeywords = extractKeywords(query);
  const industries = detectIndustryContext(query);
  const matches: QueryMatch[] = [];

  // Match against thought leadership articles
  Object.entries(ARTICLE_KEYWORDS).forEach(([articleId, keywords]) => {
    // Calculate matches for different keyword types
    const primaryMatch = calculateSemanticMatch(queryKeywords, keywords.primary);
    const secondaryMatch = calculateSemanticMatch(queryKeywords, keywords.secondary) * 0.8;
    const conceptMatch = calculateSemanticMatch(queryKeywords, keywords.concepts) * 0.6;

    // Boost score if industry context is relevant
    const industryBoost = industries.length > 0 ? 0.1 : 0;

    const totalConfidence = Math.min(1.0, primaryMatch + secondaryMatch + conceptMatch + industryBoost);

    if (totalConfidence > 0.2) { // Threshold for relevance
      const matchedKeywords = [
        ...keywords.primary.filter(k => queryKeywords.some(qk => k.includes(qk) || qk.includes(k))),
        ...keywords.secondary.filter(k => queryKeywords.some(qk => k.includes(qk) || qk.includes(k))),
        ...keywords.concepts.filter(k => queryKeywords.some(qk => k.includes(qk) || qk.includes(k)))
      ];

      matches.push({
        articleId,
        confidence: totalConfidence,
        matchedKeywords,
        relevantSections: industries.length > 0 ? industries : undefined
      });
    }
  });

  // Match against case studies
  Object.entries(CASE_STUDY_KEYWORDS).forEach(([caseStudyId, keywords]) => {
    const primaryMatch = calculateSemanticMatch(queryKeywords, keywords.primary);
    const secondaryMatch = calculateSemanticMatch(queryKeywords, keywords.secondary) * 0.8;
    const conceptMatch = calculateSemanticMatch(queryKeywords, keywords.concepts) * 0.6;

    // Industry-specific boost for case studies
    const industryBoost = keywords.industries && industries.some(i => keywords.industries.includes(i)) ? 0.15 : 0;

    const totalConfidence = Math.min(1.0, primaryMatch + secondaryMatch + conceptMatch + industryBoost);

    if (totalConfidence > 0.2) {
      const matchedKeywords = [
        ...keywords.primary.filter(k => queryKeywords.some(qk => k.includes(qk) || qk.includes(k))),
        ...keywords.secondary.filter(k => queryKeywords.some(qk => k.includes(qk) || qk.includes(k))),
        ...keywords.concepts.filter(k => queryKeywords.some(qk => k.includes(qk) || qk.includes(k)))
      ];

      matches.push({
        articleId: caseStudyId,
        confidence: totalConfidence,
        matchedKeywords,
        relevantSections: industries.length > 0 ? industries : undefined
      });
    }
  });

  // Sort by confidence, highest first
  return matches.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Get the best matching article for a query
 */
export function getBestArticleMatch(query: string): QueryMatch | null {
  const matches = matchQueryToArticles(query);
  return matches.length > 0 ? matches[0] : null;
}

/**
 * Check if query is relevant to any thought leadership content
 */
export function isThoughtLeadershipQuery(query: string): boolean {
  const matches = matchQueryToArticles(query);
  return matches.length > 0 && matches[0].confidence > 0.4;
}

/**
 * Check if query is asking about core services/what we do
 * Includes SEO keywords for organic search optimization
 */
export function isServiceDescriptionQuery(query: string): boolean {
  const serviceKeywords = [
    // General service queries
    'what do you do', 'what you do', 'services', 'what you offer',
    'capabilities', 'how you work', 'how do you work', 'your approach',
    'methodology', 'who you help', 'who do you help', 'typical projects',
    'what makes you different', 'why choose you', 'your background',
    'about you', 'tell me about', 'what is this', 'who are you',
    'describe your', 'explain what you',

    // SEO keywords for AI consulting services
    'ai consulting', 'ai implementation', 'ai roi', 'ai strategy',
    'ai operational efficiency', 'reduce costs with ai', 'ai governance',
    'scale ai', 'enterprise ai', 'responsible ai', 'ai integration',
    'context-aware ai', 'ai transformation', 'ai project fail',
    'ai adoption', 'ai readiness'
  ];

  const queryLower = query.toLowerCase();
  return serviceKeywords.some(keyword => queryLower.includes(keyword));
}

/**
 * Generate contextual follow-up questions based on matched article or case study
 */
export function generateFollowUpQuestions(match: QueryMatch): string[] {
  const followUps: Record<string, string[]> = {
    'ai-project-failures': [
      'What specific challenges are you facing with your AI initiative?',
      'How is your organisation approaching change management for AI?',
      'Are you looking for strategies to improve stakeholder buy-in?',
      'Would you like to discuss data strategy and governance frameworks?'
    ],
    'contextual-ai-adoption': [
      'What industry or business context are you working within?',
      'How familiar is your team with AI implementation best practices?',
      'Are you looking for guidance on technology stack selection?',
      'Would you like to explore specific use cases for your organisation?'
    ],
    'transformation-readiness': [
      'Where is your organisation in its digital transformation journey?',
      'What are the key stakeholders involved in this initiative?',
      'Are you looking for an assessment framework or implementation roadmap?',
      'How is leadership support for this transformation effort?'
    ],
    'insurance-brokerage-transformation': [
      'How did you identify the 85% unnecessary complexity?',
      'What made the conversion rate improve so dramatically?',
      'Can this approach work for other insurance sectors?',
      'Want to discuss ROI timelines and implementation approach?'
    ],
    'lsa-contract-analysis': [
      'How did you verify all 75+ sources?',
      'What other hidden risks did you discover?',
      'Can this methodology apply to other institutions?',
      'How do you ensure complete transparency?'
    ],
    'procurement-analysis': [
      'How did the AI detect the hidden £200K?',
      'What types of procurement can this handle?',
      'How do you maintain enterprise audit standards?',
      'Can this work for other contract evaluations?'
    ]
  };

  return followUps[match.articleId] || [
    'Would you like to explore this topic in more detail?',
    'Are there specific aspects of this challenge you\'d like to discuss?',
    'How does this relate to your current business objectives?'
  ];
}

/**
 * Detect if query is asking about methodology/approach
 */
/**
 * Check if query is asking about methodology
 * Enhanced with SEO keywords for methodology/implementation questions
 */
export function isMethodologyQuery(query: string): boolean {
  const methodologyKeywords = [
    // General methodology queries
    'how do you', 'methodology', 'approach', 'process', 'framework',
    'how it works', 'implementation', 'strategy', 'technique', 'method',
    'how you work', 'your process', 'your approach',

    // SEO keywords for AI methodology
    'why ai fail', 'why ai projects fail', 'ai failure', 'ai implementation',
    'context-first', 'contextual ai', 'context aware', 'ai best practices',
    'successful ai', 'ai strategy framework', 'how to implement ai',
    'ai methodology', 'domain-driven ai', 'situated ai'
  ];

  const queryLower = query.toLowerCase();
  return methodologyKeywords.some(keyword => queryLower.includes(keyword));
}

/**
 * DEPRECATED: Legacy function - now using serveMethodology() from content-server.ts
 * Keeping for backwards compatibility but will be removed in future version
 */
export function getCombinedMethodology(): string {
  console.warn('getCombinedMethodology() is deprecated - use serveMethodology() instead');
  return `Our **Context-First Methodology** adapts to each unique situation - see methodology content for details.`;
}

/**
 * Check if query is asking FAQ/objection-related questions
 * Targets pricing, differentiation, ROI, timeline, concerns
 */
export function isFAQQuery(query: string): boolean {
  const faqKeywords = [
    // Pricing queries
    'pricing', 'price', 'cost', 'how much', 'investment', 'budget', 'fee', 'charge',

    // Comparison/differentiation queries
    'vs', 'versus', 'different from', 'compare', 'accenture', 'mckinsey', 'big 4',
    'why choose', 'what makes you different', 'unique', 'advantage',

    // ROI and results queries
    'roi', 'return', 'guarantee', 'results', 'prove', 'success rate', 'track record',
    'proof', 'evidence',

    // Timeline queries
    'how long', 'timeline', 'when', 'timeframe', 'duration', 'fast',

    // Concerns and objections
    'data not ready', 'already have', 'failed before', 'tried before',
    'too complex', 'too unique', 'can we build', 'build internally',
    'security', 'privacy', 'risk', 'concern',

    // Experience queries
    'experience in', 'worked with', 'industry experience', 'expertise',

    // Implementation queries
    'scale', 'after implementation', 'maintenance', 'support',

    // Urgency queries
    'why now', 'urgent', 'when should we start'
  ];

  const queryLower = query.toLowerCase();
  return faqKeywords.some(keyword => queryLower.includes(keyword));
}

/**
 * Debug helper for development
 */
export function debugQueryMatching(query: string): void {
  if (process.env.NODE_ENV !== 'development') return;

  const matches = matchQueryToArticles(query);
  const keywords = extractKeywords(query);
  const industries = detectIndustryContext(query);

  console.log('🎯 Query Matching Debug:', {
    query,
    extractedKeywords: keywords,
    detectedIndustries: industries,
    matches: matches.map(m => ({
      articleId: m.articleId,
      confidence: Math.round(m.confidence * 100) + '%',
      topKeywords: m.matchedKeywords.slice(0, 3)
    }))
  });
}