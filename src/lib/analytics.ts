/**
 * Analytics Utilities
 *
 * Helper functions for tracking events in Google Analytics 4
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

/**
 * Track when AI concierge mentions an article in a response
 */
export function trackArticleMentioned(articleTitle: string, conversationContext?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'article_mentioned', {
      article_title: articleTitle,
      context: conversationContext || 'chat',
      event_category: 'ai_concierge',
      event_label: articleTitle
    })
  }
}

/**
 * Track when a visitor clicks an article link from the chat
 */
export function trackArticleClicked(articleTitle: string, articleUrl: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'article_clicked', {
      article_title: articleTitle,
      article_url: articleUrl,
      click_source: 'ai_concierge',
      event_category: 'engagement',
      event_label: articleTitle
    })
  }
}

/**
 * Track when visitor uses the chat interface
 */
export function trackChatQuery(query: string, queryType?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'chat_query', {
      query_length: query.length,
      query_type: queryType || 'general',
      event_category: 'ai_concierge',
    })
  }
}

/**
 * Track when visitor receives a response from chat
 */
export function trackChatResponse(responseType: string, containsArticle: boolean) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'chat_response', {
      response_type: responseType,
      contains_article: containsArticle,
      event_category: 'ai_concierge',
    })
  }
}

/**
 * Track when visitor opens contact form from chat
 */
export function trackContactFormOpened(teamMember?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'contact_form_opened', {
      team_member: teamMember || 'general',
      source: 'ai_concierge',
      event_category: 'conversion',
    })
  }
}

/**
 * Track when contact form is successfully submitted
 */
export function trackContactFormSubmitted(teamMember: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'contact_form_submitted', {
      team_member: teamMember,
      source: 'ai_concierge',
      event_category: 'conversion',
    })
  }
}

/**
 * Detect if response contains article references and extract them
 */
export function detectArticleReferences(responseText: string): string[] {
  const articles = [
    'Why AI Projects Fail',
    'Worthless Technology Stack',
    'Hidden Vendor Costs',
    'Complete Cost of AI',
    'Signs You Need AI',
    'Faster, Cheaper, Better AI',
    'Where to Start with AI',
    '8 AI Mistakes',
    'Information Asymmetry',
    'AI-Native Buyers'
  ]

  const mentioned: string[] = []

  for (const article of articles) {
    // Check for article mentions (case insensitive, partial matches)
    const pattern = new RegExp(article, 'i')
    if (pattern.test(responseText)) {
      mentioned.push(article)
    }
  }

  return mentioned
}
