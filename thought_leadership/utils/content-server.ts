/**
 * Content Server Utility
 * Handles version selection and content serving logic
 */

import { VisitorType, VisitorContext } from './visitor-detection';
import { QueryMatch } from './content-matcher';

export interface ArticleContent {
  article: {
    id: string;
    title: string;
    slug: string;
    metadata: {
      publishedDate: string;
      lastUpdated: string;
      author: string;
      readingTime: number;
      tags: string[];
      seoKeywords: string[];
    };
    versions: {
      bot: ArticleVersion;
      human: ArticleVersion;
      chat?: ChatVersion; // Optional for backwards compatibility
    };
    keywords_for_matching?: string[];
    related_content?: string[];
  };
}

export interface CaseStudyContent {
  case_study: {
    id: string;
    client: {
      industry: string;
      sub_sector: string;
      size: string;
      region: string;
      anonymous_name: string;
    };
    versions: {
      human: {
        executive_summary: string;
        key_metrics?: string;
        lessons_learned?: string;
      };
      bot: {
        comprehensive_version: string;
      };
      chat: {
        chunks: Record<string, string>;
      };
    };
    metrics: Record<string, any>;
    keywords_for_matching?: string[];
    lessons?: string[];
  };
}

export interface ArticleVersion {
  content: string;
  wordCount: number;
  excerpt: string;
  structuredData?: any;
  callToAction?: string;
}

export interface ChatVersion {
  sections: ChatSection[];
  followUpQuestions: string[];
  industryExamples: Record<string, string>;
}

export interface ChatSection {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  relevanceScore?: number;
}

export interface ContentResponse {
  content: string;
  version: 'bot' | 'human' | 'chat';
  source: 'article' | 'generated' | 'service_description' | 'faq';
  metadata?: {
    articleId?: string;
    serviceId?: string;
    faqId?: string;
    confidence?: number;
    followUpQuestions?: string[];
    relatedArticles?: string[];
  };
}

/**
 * Load article from JSON file
 */
async function loadArticle(articleId: string): Promise<ArticleContent | null> {
  try {
    // In Node.js environment (API routes), read from filesystem
    if (typeof window === 'undefined') {
      const fs = await import('fs');
      const path = await import('path');

      const articlePath = path.join(process.cwd(), 'thought_leadership', 'articles', `${articleId}.json`);

      if (!fs.existsSync(articlePath)) {
        console.warn(`Article ${articleId} not found at ${articlePath}`);
        return null;
      }

      const fileContent = fs.readFileSync(articlePath, 'utf8');
      return JSON.parse(fileContent);
    } else {
      // In browser environment, fetch from public API
      const articlePath = `/thought_leadership/articles/${articleId}.json`;
      const response = await fetch(articlePath);

      if (!response.ok) {
        console.warn(`Article ${articleId} not found`);
        return null;
      }

      return await response.json();
    }
  } catch (error) {
    console.error(`Error loading article ${articleId}:`, error);
    return null;
  }
}

/**
 * Load case study from JSON file
 */
async function loadCaseStudy(caseStudyId: string): Promise<CaseStudyContent | null> {
  try {
    // In Node.js environment (API routes), read from filesystem
    if (typeof window === 'undefined') {
      const fs = await import('fs');
      const path = await import('path');

      const caseStudyPath = path.join(process.cwd(), 'Case_studies', `${caseStudyId}.json`);

      if (!fs.existsSync(caseStudyPath)) {
        console.warn(`Case study ${caseStudyId} not found at ${caseStudyPath}`);
        return null;
      }

      const fileContent = fs.readFileSync(caseStudyPath, 'utf8');
      return JSON.parse(fileContent);
    } else {
      // In browser environment, fetch from public API
      const caseStudyPath = `/Case_studies/${caseStudyId}.json`;
      const response = await fetch(caseStudyPath);

      if (!response.ok) {
        console.warn(`Case study ${caseStudyId} not found`);
        return null;
      }

      return await response.json();
    }
  } catch (error) {
    console.error(`Error loading case study ${caseStudyId}:`, error);
    return null;
  }
}

/**
 * Generate schema markup for SEO bots
 */
function generateSchemaMarkup(article: ArticleContent): string {
  const articleData = article.article;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": articleData.title,
    "author": {
      "@type": "Organization",
      "name": "Context is Everything"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Context is Everything",
      "logo": {
        "@type": "ImageObject",
        "url": "https://contextiseverything.ai/logo.png"
      }
    },
    "datePublished": articleData.metadata.publishedDate,
    "dateModified": articleData.metadata.lastUpdated,
    "description": articleData.versions.bot.excerpt,
    "keywords": articleData.metadata.seoKeywords.join(", "),
    "wordCount": articleData.versions.bot.wordCount,
    "timeRequired": `PT${articleData.metadata.readingTime}M`,
    "about": {
      "@type": "Thing",
      "name": "AI Consulting"
    }
  };

  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
}

/**
 * Generate chat CTA for newsletter readers
 */
function generateChatCTA(): string {
  return `

**Ready to explore this further?**

Our AI consultancy team can help you navigate these challenges with personalized guidance.

[Start a conversation with our experts →](#chat)

*Get insights tailored to your specific industry and organizational context.*`;
}

/**
 * Extract relevant chat section based on query context
 */
function extractRelevantSection(
  article: ArticleContent,
  queryContext: QueryMatch
): ChatSection | null {
  const chatVersion = article.article.versions.chat;

  // If no chat version exists, return null
  if (!chatVersion) {
    return null;
  }

  // Score sections based on keyword matching
  const scoredSections = chatVersion.sections.map(section => {
    const matchCount = section.keywords.filter(keyword =>
      queryContext.matchedKeywords.some(matched =>
        keyword.toLowerCase().includes(matched.toLowerCase()) ||
        matched.toLowerCase().includes(keyword.toLowerCase())
      )
    ).length;

    return {
      ...section,
      relevanceScore: matchCount / section.keywords.length
    };
  });

  // Return highest scoring section
  const bestSection = scoredSections.reduce((best, current) =>
    (current.relevanceScore || 0) > (best.relevanceScore || 0) ? current : best
  );

  return bestSection.relevanceScore && bestSection.relevanceScore > 0.3 ? bestSection : null;
}

/**
 * Enhance content with industry-specific examples
 */
function enhanceWithIndustryContext(
  content: string,
  article: ArticleContent,
  visitorContext: VisitorContext
): string {
  // Extract industry from referrer or UTM data
  const industry = detectIndustryFromContext(visitorContext);

  if (industry && article.article.versions.chat?.industryExamples?.[industry]) {
    const industryExample = article.article.versions.chat.industryExamples[industry];
    return `${content}

**${industry.charAt(0).toUpperCase() + industry.slice(1)} Context:**
${industryExample}`;
  }

  return content;
}

/**
 * Detect industry from visitor context
 */
function detectIndustryFromContext(context: VisitorContext): string | null {
  const referrer = (context.referrer || '').toLowerCase();
  const utmSource = (context.utmSource || '').toLowerCase();

  const industryKeywords = {
    healthcare: ['health', 'medical', 'clinical', 'hospital'],
    finance: ['bank', 'financial', 'investment', 'trading'],
    retail: ['retail', 'ecommerce', 'shopping', 'commerce'],
    manufacturing: ['manufacturing', 'production', 'industrial'],
    technology: ['tech', 'software', 'saas', 'platform']
  };

  for (const [industry, keywords] of Object.entries(industryKeywords)) {
    if (keywords.some(keyword =>
      referrer.includes(keyword) || utmSource.includes(keyword)
    )) {
      return industry;
    }
  }

  return null;
}

/**
 * Select appropriate case study chunk based on query intent
 */
function selectCaseStudyChunk(query: string, chunks: Record<string, string>): string {
  const queryLower = query.toLowerCase();

  // Intent-based chunk selection
  if (queryLower.includes('result') || queryLower.includes('roi') || queryLower.includes('outcome') || queryLower.includes('proof')) {
    return chunks.results || chunks.roi || chunks.solution;
  }
  if (queryLower.includes('how') || queryLower.includes('methodology') || queryLower.includes('approach')) {
    return chunks.methodology || chunks.solution;
  }
  if (queryLower.includes('challenge') || queryLower.includes('problem') || queryLower.includes('issue')) {
    return chunks.challenge;
  }
  if (queryLower.includes('why') || queryLower.includes('context') || queryLower.includes('factor')) {
    return chunks.context_factors || chunks.solution;
  }
  if (queryLower.includes('advantage') || queryLower.includes('competitive') || queryLower.includes('moat')) {
    return chunks.competitive_advantage || chunks.results;
  }

  // Default to solution if no specific intent detected
  return chunks.solution || chunks.challenge;
}

/**
 * Serve case study content based on visitor type and query
 */
export async function serveCaseStudyContent(
  caseStudyId: string,
  visitorType: VisitorType,
  query?: string,
  queryContext?: QueryMatch
): Promise<ContentResponse | null> {
  const caseStudy = await loadCaseStudy(caseStudyId);

  if (!caseStudy) {
    return null;
  }

  const study = caseStudy.case_study;

  switch (visitorType) {
    case 'bot': {
      // Serve comprehensive version for SEO with schema markup
      const content = study.versions.bot.comprehensive_version;

      // Generate schema markup for case study
      const schema = {
        "@context": "https://schema.org",
        "@type": "CaseStudy",
        "name": `${study.client.industry} Digital Transformation`,
        "about": {
          "@type": "Organization",
          "industry": study.client.industry
        },
        "author": {
          "@type": "Organization",
          "name": "Context is Everything"
        },
        "description": study.versions.human.executive_summary.substring(0, 200)
      };

      const schemaMarkup = `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;

      return {
        content: `${content}\n\n${schemaMarkup}`,
        version: 'bot',
        source: 'article',
        metadata: {
          articleId: caseStudyId,
          confidence: 1.0
        }
      };
    }

    case 'newsletter': {
      // Serve human-friendly executive summary with metrics
      let content = study.versions.human.executive_summary;

      if (study.versions.human.key_metrics) {
        content += `\n\n### Key Results\n\n${study.versions.human.key_metrics}`;
      }

      const cta = generateChatCTA();

      return {
        content: `${content}${cta}`,
        version: 'human',
        source: 'article',
        metadata: {
          articleId: caseStudyId,
          confidence: 1.0
        }
      };
    }

    case 'chat': {
      // Serve contextual chunk based on query intent
      const selectedChunk = query
        ? selectCaseStudyChunk(query, study.versions.chat.chunks)
        : study.versions.chat.chunks.solution || study.versions.chat.chunks.challenge;

      const followUpQuestions = [
        'Would you like to know more about the results?',
        'Interested in the methodology we used?',
        'Want to explore similar challenges in your industry?'
      ];

      return {
        content: selectedChunk,
        version: 'chat',
        source: 'article',
        metadata: {
          articleId: caseStudyId,
          confidence: queryContext?.confidence || 0.8,
          followUpQuestions
        }
      };
    }

    default:
      return null;
  }
}

/**
 * Main content serving function
 */
export async function serveArticleContent(
  articleId: string,
  visitorType: VisitorType,
  queryContext?: QueryMatch,
  visitorContext?: VisitorContext
): Promise<ContentResponse | null> {
  const articleData = await loadArticle(articleId);

  if (!articleData || !articleData.article) {
    return null;
  }

  const article = articleData.article;

  switch (visitorType) {
    case 'bot': {
      // Serve comprehensive content for SEO
      const content = article.versions.bot.content;
      const schemaMarkup = article.versions.bot.structuredData
        ? `<script type="application/ld+json">${JSON.stringify(article.versions.bot.structuredData, null, 2)}</script>`
        : generateSchemaMarkup(articleData);

      return {
        content: `${content}\n\n${schemaMarkup}`,
        version: 'bot',
        source: 'article',
        metadata: {
          articleId,
          confidence: 1.0
        }
      };
    }

    case 'newsletter': {
      // Serve engaging human version with CTA
      const content = article.versions.human.content;
      const cta = generateChatCTA();

      return {
        content: `${content}${cta}`,
        version: 'human',
        source: 'article',
        metadata: {
          articleId,
          confidence: 1.0
        }
      };
    }

    case 'chat': {
      // For new article format (human/bot only), serve human version for chat
      // For old format with chat sections, use extractRelevantSection
      if (article.versions.chat && queryContext) {
        const relevantSection = extractRelevantSection(articleData, queryContext);

        if (relevantSection) {
          let content = relevantSection.content;
          if (visitorContext) {
            content = enhanceWithIndustryContext(content, articleData, visitorContext);
          }

          return {
            content,
            version: 'chat',
            source: 'article',
            metadata: {
              articleId,
              confidence: queryContext.confidence,
              followUpQuestions: article.versions.chat.followUpQuestions?.slice(0, 3) || [],
              relatedArticles: article.related_content || []
            }
          };
        }
      }

      // Fallback: serve human version for chat
      return {
        content: article.versions.human.content,
        version: 'chat',
        source: 'article',
        metadata: {
          articleId,
          confidence: queryContext?.confidence || 0.8,
          followUpQuestions: ['Want to know more?', 'How could this apply to your situation?'],
          relatedArticles: article.related_content || []
        }
      };
    }

    default:
      return null;
  }
}

/**
 * Enhanced response selection for ChatInterface integration
 */
export async function selectResponse(
  query: string,
  visitorType: VisitorType,
  queryMatch?: QueryMatch,
  visitorContext?: VisitorContext
): Promise<ContentResponse | null> {

  // Priority 1: Check for article or case study match
  if (queryMatch && queryMatch.confidence > 0.4) {
    // Determine if this is a case study or article based on ID prefix
    const isCaseStudy = queryMatch.articleId.includes('transformation') ||
                        queryMatch.articleId.includes('insurance') ||
                        queryMatch.articleId.includes('brokerage');

    if (isCaseStudy) {
      const caseStudyResponse = await serveCaseStudyContent(
        queryMatch.articleId,
        visitorType,
        query,
        queryMatch
      );

      if (caseStudyResponse) {
        return caseStudyResponse;
      }
    } else {
      const articleResponse = await serveArticleContent(
        queryMatch.articleId,
        visitorType,
        queryMatch,
        visitorContext
      );

      if (articleResponse) {
        return articleResponse;
      }
    }
  }

  // Priority 2: Could integrate with existing Foundation/Team/Research responses
  // Priority 3: Fall back to AI generation

  return null;
}

/**
 * Debug helper for development
 */
export function debugContentServing(
  articleId: string,
  visitorType: VisitorType,
  queryContext?: QueryMatch
): void {
  if (process.env.NODE_ENV !== 'development') return;

  console.log('🎬 Content Serving Debug:', {
    articleId,
    visitorType,
    queryContext: queryContext ? {
      confidence: Math.round(queryContext.confidence * 100) + '%',
      matchedKeywords: queryContext.matchedKeywords.slice(0, 3)
    } : 'none'
  });
}

/**
 * Serve service description content with visitor type optimization
 */
export async function serveServiceDescription(
  visitorType: VisitorType,
  query: string
): Promise<ContentResponse | null> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');

    const filePath = path.join(process.cwd(), 'thought_leadership', 'content', 'service-description.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const serviceData = JSON.parse(fileContent);

    // Access nested service_module structure
    const module = serviceData.service_module;
    const queryLower = query.toLowerCase();

    let content: string;
    let version: 'bot' | 'human' | 'chat';

    // Bot visitors get comprehensive SEO-optimized version
    if (visitorType === 'bot') {
      content = module.versions.bot.content;
      version = 'bot';
    }
    // Human visitors get version based on query specificity
    else {
      // Check for specific chat chunk queries first
      const chatChunks = module.versions.chat;

      if (queryLower.includes('roi') || queryLower.includes('results') || queryLower.includes('proof')) {
        content = chatChunks.roi_proof;
        version = 'chat';
      }
      else if (queryLower.includes('how you work') || queryLower.includes('how do you work') || queryLower.includes('process') || queryLower.includes('methodology')) {
        content = chatChunks.how_we_work;
        version = 'chat';
      }
      else if (queryLower.includes('different') || queryLower.includes('unique') || queryLower.includes('why choose')) {
        content = chatChunks.why_different;
        version = 'chat';
      }
      else if (queryLower.includes('pricing') || queryLower.includes('cost') || queryLower.includes('engagement')) {
        content = chatChunks.pricing_model;
        version = 'chat';
      }
      else if (queryLower.includes('industry') || queryLower.includes('industries') || queryLower.includes('sector')) {
        content = chatChunks.industries;
        version = 'chat';
      }
      else if (queryLower.includes('governance') || queryLower.includes('responsible') || queryLower.includes('ethical')) {
        content = chatChunks.governance;
        version = 'chat';
      }
      else if (queryLower.includes('typical project') || queryLower.includes('examples')) {
        content = chatChunks.typical_projects;
        version = 'chat';
      }
      else if (queryLower.includes('when to') || queryLower.includes('when should')) {
        content = chatChunks.when_to_engage;
        version = 'chat';
      }
      // Comprehensive queries get human-optimized long version
      else if (queryLower.includes('detail') || queryLower.includes('comprehensive') || queryLower.includes('everything')) {
        content = module.versions.human.content;
        version = 'human';
      }
      // Default to chat chunk for "what we do"
      else {
        content = chatChunks.what_we_do;
        version = 'chat';
      }
    }

    return {
      content,
      version,
      source: 'service_description',
      metadata: {
        serviceId: module.id,
        followUpQuestions: [
          'What ROI have you achieved?',
          'How do you work?',
          'What makes you different?',
          'What industries do you serve?'
        ]
      }
    };

  } catch (error) {
    console.error('Error loading service description:', error);
    return null;
  }
}

/**
 * Serve methodology content with visitor type optimization
 */
export async function serveMethodology(
  visitorType: VisitorType,
  query: string
): Promise<ContentResponse | null> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');

    const filePath = path.join(process.cwd(), 'thought_leadership', 'content', 'methodology.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const methodologyData = JSON.parse(fileContent);

    // Access nested methodology_module structure
    const module = methodologyData.methodology_module;
    const queryLower = query.toLowerCase();

    let content: string;
    let version: 'bot' | 'human' | 'chat';

    // Bot visitors get comprehensive SEO-optimized version
    if (visitorType === 'bot') {
      content = module.versions.bot.content;
      version = 'bot';
    }
    // Human visitors get version based on query specificity
    else {
      // Check for specific chat chunk queries
      const chatChunks = module.versions.chat;

      if (queryLower.includes('what is context') || queryLower.includes('context-first')) {
        content = chatChunks.what_is_context_first;
        version = 'chat';
      }
      else if (queryLower.includes('how it works') || queryLower.includes('how does it work')) {
        content = chatChunks.how_it_works;
        version = 'chat';
      }
      else if (queryLower.includes('why context') || queryLower.includes('why matter')) {
        content = chatChunks.why_context_matters;
        version = 'chat';
      }
      else if (queryLower.includes('example') || queryLower.includes('case study')) {
        content = chatChunks.examples;
        version = 'chat';
      }
      else if (queryLower.includes('vs') || queryLower.includes('versus') || queryLower.includes('traditional') || queryLower.includes('different')) {
        content = chatChunks.vs_traditional;
        version = 'chat';
      }
      else if (queryLower.includes('getting started') || queryLower.includes('how to start') || queryLower.includes('begin')) {
        content = chatChunks.getting_started;
        version = 'chat';
      }
      else if (queryLower.includes('metric') || queryLower.includes('measure') || queryLower.includes('success')) {
        content = chatChunks.success_metrics;
        version = 'chat';
      }
      else if (queryLower.includes('why') && (queryLower.includes('fail') || queryLower.includes('failure'))) {
        content = chatChunks.why_context_matters;
        version = 'chat';
      }
      // Comprehensive queries get human-optimized long version
      else if (queryLower.includes('detail') || queryLower.includes('comprehensive') || queryLower.includes('everything')) {
        content = module.versions.human.content;
        version = 'human';
      }
      // Default to "what is context-first"
      else {
        content = chatChunks.what_is_context_first;
        version = 'chat';
      }
    }

    return {
      content,
      version,
      source: 'service_description',
      metadata: {
        serviceId: module.id,
        followUpQuestions: [
          'Why do AI projects fail?',
          'How does Context-First work?',
          'Can you show me examples?',
          'How do I get started?'
        ]
      }
    };

  } catch (error) {
    console.error('Error loading methodology:', error);
    return null;
  }
}

/**
 * Serve FAQ content with visitor type optimization
 * Matches specific objections and concerns to FAQ answers
 */
export async function serveFAQ(
  visitorType: VisitorType,
  query: string
): Promise<ContentResponse | null> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');

    const filePath = path.join(process.cwd(), 'thought_leadership', 'content', 'faq.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const faqData = JSON.parse(fileContent);

    const module = faqData.faq_module;
    const queryLower = query.toLowerCase();

    let content: string;
    let version: 'bot' | 'human' | 'chat';
    let matchedFaqId: string | undefined;

    // Bot visitors get comprehensive SEO-optimized version
    if (visitorType === 'bot') {
      content = module.versions.bot.comprehensive_faq;
      version = 'bot';
    }
    // Human visitors get version based on query specificity
    else {
      const chatFAQs = module.versions.chat;

      // Match query to specific FAQ
      if (queryLower.includes('pricing') || queryLower.includes('price') || queryLower.includes('cost') || queryLower.includes('how much')) {
        content = chatFAQs.pricing.answer;
        matchedFaqId = 'pricing';
        version = 'chat';
      }
      else if (queryLower.includes('accenture') || queryLower.includes('mckinsey') || queryLower.includes('big 4') ||
               (queryLower.includes('different') && (queryLower.includes('big') || queryLower.includes('consultant')))) {
        content = chatFAQs.vs_big_consulting.answer;
        matchedFaqId = 'vs_big_consulting';
        version = 'chat';
      }
      else if (queryLower.includes('guarantee') || queryLower.includes('results')) {
        content = chatFAQs.guarantee.answer;
        matchedFaqId = 'guarantee';
        version = 'chat';
      }
      else if (queryLower.includes('data') && (queryLower.includes('not ready') || queryLower.includes('not clean') || queryLower.includes('messy'))) {
        content = chatFAQs.data_not_ready.answer;
        matchedFaqId = 'data_not_ready';
        version = 'chat';
      }
      else if (queryLower.includes('already have') || queryLower.includes('existing vendor') || queryLower.includes('current tool')) {
        content = chatFAQs.already_have_vendor.answer;
        matchedFaqId = 'already_have_vendor';
        version = 'chat';
      }
      else if (queryLower.includes('how long') || queryLower.includes('timeline') || queryLower.includes('timeframe') || queryLower.includes('duration')) {
        content = chatFAQs.timeline.answer;
        matchedFaqId = 'timeline';
        version = 'chat';
      }
      else if (queryLower.includes('too complex') || queryLower.includes('too unique') || queryLower.includes('business is unique')) {
        content = chatFAQs.too_complex.answer;
        matchedFaqId = 'too_complex';
        version = 'chat';
      }
      else if (queryLower.includes('failed before') || queryLower.includes('tried before') || queryLower.includes('didn\'t work')) {
        content = chatFAQs.failed_before.answer;
        matchedFaqId = 'failed_before';
        version = 'chat';
      }
      else if (queryLower.includes('roi') || queryLower.includes('return') || queryLower.includes('prove')) {
        content = chatFAQs.roi_skeptical.answer;
        matchedFaqId = 'roi_skeptical';
        version = 'chat';
      }
      else if (queryLower.includes('build internal') || queryLower.includes('build ourselves') || queryLower.includes('do it ourselves')) {
        content = chatFAQs.internal_team.answer;
        matchedFaqId = 'internal_team';
        version = 'chat';
      }
      else if (queryLower.includes('security') || queryLower.includes('privacy') || queryLower.includes('data protection')) {
        content = chatFAQs.security_concerns.answer;
        matchedFaqId = 'security_concerns';
        version = 'chat';
      }
      else if (queryLower.includes('experience in') || queryLower.includes('industry experience') || queryLower.includes('worked in')) {
        content = chatFAQs.industry_experience.answer;
        matchedFaqId = 'industry_experience';
        version = 'chat';
      }
      else if (queryLower.includes('scale') || queryLower.includes('organization-wide') || queryLower.includes('enterprise')) {
        content = chatFAQs.scale_concern.answer;
        matchedFaqId = 'scale_concern';
        version = 'chat';
      }
      else if (queryLower.includes('after') || queryLower.includes('maintenance') || queryLower.includes('ongoing')) {
        content = chatFAQs.maintenance.answer;
        matchedFaqId = 'maintenance';
        version = 'chat';
      }
      else if (queryLower.includes('why now') || queryLower.includes('urgent') || queryLower.includes('when should we')) {
        content = chatFAQs.why_now.answer;
        matchedFaqId = 'why_now';
        version = 'chat';
      }
      else if (queryLower.includes('what problem') || queryLower.includes('which problem') || queryLower.includes('what types') || queryLower.includes('what kind')) {
        content = chatFAQs.which_problems.answer;
        matchedFaqId = 'which_problems';
        version = 'chat';
      }
      else if (queryLower.includes('what makes') && (queryLower.includes('different') || queryLower.includes('unique')) || queryLower.includes('how different')) {
        content = chatFAQs.how_different.answer;
        matchedFaqId = 'how_different';
        version = 'chat';
      }
      else if (queryLower.includes('first step') || queryLower.includes('how to start') || queryLower.includes('where to start') || queryLower.includes('get started')) {
        content = chatFAQs.first_step.answer;
        matchedFaqId = 'first_step';
        version = 'chat';
      }
      else if (queryLower.includes('worth it') || queryLower.includes('is ai worth') || queryLower.includes('should we use ai')) {
        content = chatFAQs.worth_it.answer;
        matchedFaqId = 'worth_it';
        version = 'chat';
      }
      else if (queryLower.includes('who are you') || queryLower.includes('who is context') || queryLower.includes('about you')) {
        content = chatFAQs.who_are_you.answer;
        matchedFaqId = 'who_are_you';
        version = 'chat';
      }
      // Comprehensive queries get human-optimized summary
      else if (queryLower.includes('common question') || queryLower.includes('faq') || queryLower.includes('frequently asked')) {
        content = module.versions.human.summary;
        version = 'human';
      }
      // Default to pricing as it's the most common objection
      else {
        content = chatFAQs.pricing.answer;
        matchedFaqId = 'pricing';
        version = 'chat';
      }
    }

    return {
      content,
      version,
      source: 'faq',
      metadata: {
        faqId: matchedFaqId || module.id,
        followUpQuestions: [
          'What about pricing?',
          'How are you different from big consultancies?',
          'Do you guarantee results?',
          'What if our data isn\'t ready?'
        ]
      }
    };

  } catch (error) {
    console.error('Error loading FAQ:', error);
    return null;
  }
}