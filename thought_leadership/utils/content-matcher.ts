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
  'ai-project-failures': {
    primary: [
      'ai project fail', 'ai failure', 'why ai fails', 'ai implementation',
      'ai project challenges', 'machine learning fail', 'ai adoption issues'
    ],
    secondary: [
      'ai strategy', 'ai transformation', 'digital transformation',
      'technology implementation', 'change management', 'ai roi'
    ],
    concepts: [
      'lack of data strategy', 'insufficient change management',
      'unrealistic expectations', 'technical debt', 'stakeholder alignment'
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
 * Match user query to relevant articles
 */
export function matchQueryToArticles(query: string): QueryMatch[] {
  const queryKeywords = extractKeywords(query);
  const industries = detectIndustryContext(query);
  const matches: QueryMatch[] = [];

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
 * Generate contextual follow-up questions based on matched article
 */
export function generateFollowUpQuestions(match: QueryMatch): string[] {
  const followUps: Record<string, string[]> = {
    'ai-project-failures': [
      'What specific challenges are you facing with your AI initiative?',
      'How is your organization approaching change management for AI?',
      'Are you looking for strategies to improve stakeholder buy-in?',
      'Would you like to discuss data strategy and governance frameworks?'
    ],
    'contextual-ai-adoption': [
      'What industry or business context are you working within?',
      'How familiar is your team with AI implementation best practices?',
      'Are you looking for guidance on technology stack selection?',
      'Would you like to explore specific use cases for your organization?'
    ],
    'transformation-readiness': [
      'Where is your organization in its digital transformation journey?',
      'What are the key stakeholders involved in this initiative?',
      'Are you looking for an assessment framework or implementation roadmap?',
      'How is leadership support for this transformation effort?'
    ]
  };

  return followUps[match.articleId] || [
    'Would you like to explore this topic in more detail?',
    'Are there specific aspects of this challenge you\'d like to discuss?',
    'How does this relate to your current business objectives?'
  ];
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