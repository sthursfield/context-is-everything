/**
 * Visitor Detection Utility
 * Identifies visitor type for contextual content serving
 */

export type VisitorType = 'bot' | 'newsletter' | 'chat';

export interface VisitorContext {
  type: VisitorType;
  userAgent: string;
  referrer?: string;
  utmSource?: string;
  ipAddress?: string;
  sessionData?: any;
}

/**
 * Bot user agents to detect for SEO content serving
 */
const BOT_PATTERNS = [
  // Search engine crawlers
  'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
  // Social media crawlers
  'facebookexternalhit', 'twitterbot', 'linkedinbot', 'whatsapp',
  // AI crawlers
  'gptbot', 'google-extended', 'claude-web', 'chatgpt-user',
  // Generic patterns
  'bot', 'crawl', 'spider', 'scrape', 'fetch'
];

/**
 * Newsletter referrer patterns
 */
const NEWSLETTER_PATTERNS = [
  'mailchimp', 'constantcontact', 'sendinblue', 'substack',
  'email', 'newsletter', 'campaign', 'mailgun', 'sendgrid'
];

/**
 * Identify visitor type based on request context
 */
export function identifyVisitor(request: {
  userAgent?: string;
  referrer?: string;
  utmSource?: string;
  headers?: Record<string, string>;
}): VisitorContext {
  const userAgent = (request.userAgent || '').toLowerCase();
  const referrer = (request.referrer || '').toLowerCase();
  const utmSource = (request.utmSource || '').toLowerCase();

  // Primary: Bot detection via User-Agent
  const isBot = BOT_PATTERNS.some(pattern => userAgent.includes(pattern));
  if (isBot) {
    return {
      type: 'bot',
      userAgent: request.userAgent || '',
      referrer: request.referrer,
      utmSource: request.utmSource
    };
  }

  // Secondary: Newsletter detection via UTM or referrer
  const isNewsletter =
    utmSource === 'newsletter' ||
    utmSource === 'email' ||
    NEWSLETTER_PATTERNS.some(pattern =>
      referrer.includes(pattern) || utmSource.includes(pattern)
    );

  if (isNewsletter) {
    return {
      type: 'newsletter',
      userAgent: request.userAgent || '',
      referrer: request.referrer,
      utmSource: request.utmSource
    };
  }

  // Default: Interactive chat user
  return {
    type: 'chat',
    userAgent: request.userAgent || '',
    referrer: request.referrer,
    utmSource: request.utmSource
  };
}

/**
 * Next.js request helper
 */
export function identifyVisitorFromNextRequest(req: any): VisitorContext {
  const userAgent = req.headers['user-agent'] || '';
  const referrer = req.headers.referer || req.headers.referrer || '';

  // Extract UTM parameters from URL or referrer
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const utmSource = url.searchParams.get('utm_source') || '';

  return identifyVisitor({
    userAgent,
    referrer,
    utmSource,
    headers: req.headers
  });
}

/**
 * Browser-side detection (limited but useful for SPA routing)
 */
export function identifyVisitorBrowser(): VisitorContext {
  if (typeof window === 'undefined') {
    return { type: 'bot', userAgent: 'server-side' };
  }

  const userAgent = navigator.userAgent || '';
  const referrer = document.referrer || '';
  const utmSource = new URLSearchParams(window.location.search).get('utm_source') || '';

  return identifyVisitor({
    userAgent,
    referrer,
    utmSource
  });
}

/**
 * Confidence scoring for visitor type detection
 */
export function getVisitorConfidence(context: VisitorContext): number {
  const { type, userAgent, referrer, utmSource } = context;

  switch (type) {
    case 'bot':
      // High confidence if multiple bot indicators
      const botIndicators = BOT_PATTERNS.filter(pattern =>
        userAgent.toLowerCase().includes(pattern)
      ).length;
      return Math.min(0.9, 0.6 + (botIndicators * 0.1));

    case 'newsletter':
      // High confidence if explicit UTM source
      if (utmSource === 'newsletter' || utmSource === 'email') return 0.9;
      // Medium confidence if newsletter referrer
      if (NEWSLETTER_PATTERNS.some(p => referrer.includes(p))) return 0.7;
      return 0.5;

    case 'chat':
      // High confidence if no bot/newsletter indicators
      const hasNoBotIndicators = !BOT_PATTERNS.some(p => userAgent.toLowerCase().includes(p));
      const hasNoNewsletterIndicators = !NEWSLETTER_PATTERNS.some(p =>
        referrer.includes(p) || (utmSource || '').includes(p)
      );
      return hasNoBotIndicators && hasNoNewsletterIndicators ? 0.8 : 0.6;

    default:
      return 0.5;
  }
}

/**
 * Debug helper for development
 */
export function debugVisitorDetection(request: any): void {
  if (process.env.NODE_ENV !== 'development') return;

  const context = identifyVisitorFromNextRequest(request);
  const confidence = getVisitorConfidence(context);

  console.log('🔍 Visitor Detection Debug:', {
    type: context.type,
    confidence: Math.round(confidence * 100) + '%',
    userAgent: context.userAgent,
    referrer: context.referrer,
    utmSource: context.utmSource
  });
}