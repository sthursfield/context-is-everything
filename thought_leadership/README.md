# Thought Leadership Content System

This directory contains the contextual content serving system for Context is Everything.

## Directory Structure

```
thought_leadership/
├── articles/
│   ├── ai-project-failures.json       # "Why AI Projects Fail" - flagship article
│   ├── contextual-ai-adoption.json    # "Contextual AI Adoption Strategies"
│   └── transformation-readiness.json  # "AI Transformation Readiness Assessment"
├── utils/
│   ├── visitor-detection.ts           # Bot/newsletter/chat visitor identification
│   ├── content-matcher.ts             # Query to article matching logic
│   └── content-server.ts              # Version selection and serving logic
└── README.md                          # This file
```

## Content Version Strategy

Each article contains three optimized versions:

### 1. Bot Version (SEO/Crawlers)
- **Length**: 2,500+ words
- **Format**: Comprehensive, structured with H2/H3 headers
- **Content**: Full methodology, statistics, citations
- **Purpose**: SEO optimization, comprehensive reference

### 2. Human Version (Newsletter/Direct)
- **Length**: 600-800 words
- **Format**: Engaging, story-driven with examples
- **Content**: One clear takeaway, actionable insights
- **Purpose**: Newsletter distribution, quick consumption

### 3. Chat Version (Interactive)
- **Length**: 100-200 word chunks
- **Format**: Conversational, personalized
- **Content**: Specific answers with follow-up questions
- **Purpose**: Interactive consultation, contextual responses

## Visitor Detection Strategy

```typescript
function identifyVisitor(request): 'bot' | 'newsletter' | 'chat' {
  // Primary: User-Agent detection for bots
  if (userAgent.includes(['bot', 'crawl', 'spider', 'GPT', 'Claude'])) {
    return 'bot'
  }

  // Secondary: UTM/referrer for newsletter
  if (utmSource === 'newsletter' || referrer.includes('email')) {
    return 'newsletter'
  }

  // Default: Interactive chat user
  return 'chat'
}
```

## Implementation Flow

1. **Content Storage**: Articles stored as JSON with metadata
2. **Request Analysis**: Detect visitor type and extract query intent
3. **Content Matching**: Match user query to relevant article topics
4. **Version Selection**: Serve appropriate content version
5. **Personalization**: Enhance with industry/context-specific details

## Integration Points

- **Chat Interface**: Enhanced responses with article-sourced content
- **SEO Pages**: Dedicated article pages for bot crawling
- **API Endpoints**: Programmatic access for newsletter/external use
- **Analytics**: Track content performance by visitor type and version