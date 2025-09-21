# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Version History

### V6.6 (Current) - Refined AI Concierge + Professional Conversation Patterns ✨
**Key Achievements:**
- **Cleaned System Prompt**: Removed uncited statistics and stage directions for truthful, professional responses
- **Simplified Visitor Questions**: "What's working elsewhere that you're considering for your situation?" for Findings button
- **Streamlined Fallback Responses**: Aligned ChatInterface fallback responses with refined API standards
- **Professional Conversation Flow**: Maintains SHORT & PUNCHY requirements without aggressive contact link patterns
- **Honest Claims**: Removed false precision statistics, kept truthful insights about contextual adaptation

**Technical Breakthroughs:**
- Enhanced AI API route with professional conversation standards removing *pauses* and *gestures* completely
- Updated fallback responses to match refined system prompt exactly
- Maintained complete email integration and sophisticated psychological engagement patterns
- Clean British spelling consistency throughout all responses

**Status**: ✅ COMPLETE - Professional AI concierge system with refined conversation patterns

### V6.5 - Sophisticated AI Concierge + Psychological Engagement ✨
**Key Achievements:**
- **Sophisticated AI Concierge**: Advanced psychological engagement patterns for authentic, high-value conversations
- **SHORT & PUNCHY Responses**: Maximum 2-3 sentences, under 50 words, direct and conversational
- **Visitor Pattern Recognition**: Real-time adaptation based on Senior Decision Maker, Middle Management, Technical Specialist, External Consultant patterns
- **Value Escalation Framework**: Recognition → Insight → Strategic Framework → Consultation positioning
- **Conversational CTAs**: Bold text on new lines for natural engagement (not shouty or demanding)
- **British Spelling Consistency**: analyse, organisation, realise throughout all responses

**Technical Breakthroughs:**
- Complete AI API integration with sophisticated system prompt and psychological engagement patterns
- Visitor pattern recognition system with adaptive conversation strategies
- Enhanced markdown parser with conversational CTA formatting
- Strategic necessity positioning over capability pitches
- Cross-sector business intelligence with implementation complexity insights
- Team hierarchy enforcement: Lindsay (CTO), Robbie (Operations Director), Spencer (Strategy Director)

**AI Concierge Excellence:**
- **Competence Assumption**: Assumes visitor sophistication and experience
- **No Stage Directions**: Absolutely no pauses, gestures, leans, nods, or theatrical elements
- **Implementation Focus**: Why context determines solution success over methodology selection
- **Natural Consultation Progression**: Strategic discussions emerge organically from value demonstration
- **Complete Email Integration**: Restored proper contact form with "Send Message" functionality and API email sending

**Status**: ✅ COMPLETE - Sophisticated AI concierge system fully implemented and deployed

### V6 - Professional Chat Experience + Smart Conversation Flow ✨
**Key Achievements:**
- **Single Active F Conversation**: Clicking different F buttons replaces previous F answer until user interaction
- **Natural Chat Anchoring**: Claude/ChatGPT-style scrolling to questions with natural reading flow
- **Professional Markdown Rendering**: Proper headers (##/###), bullet points (•), and bold formatting
- **Perfect Logo Centering**: Cropped PNG eliminates whitespace offset issues
- **Desktop Background Scroll**: Can scroll back to logo while maintaining chat functionality
- **Mobile Scroll Freedom**: Manual scrolling works perfectly after answers are given

**Technical Breakthroughs:**
- Smart conversation state management with `hasUserInteracted` tracking
- Proper markdown parser in `formatResponse` function handling all formatting elements
- Logo cropped from 1200x1200px to 923x266px for perfect centering
- Hybrid layout: fixed mountain background + scrollable content overlay
- Chat anchor system scrolling to questions (`block: 'start'`) not bottom

**User Experience Excellence:**
- **Exploration Mode**: Single F conversation until user engages (clean, focused)
- **Engagement Mode**: Full conversation history preserved after user interaction
- **Professional Formatting**: Business-grade presentation with proper typography hierarchy
- **Cross-Platform Consistency**: Identical sophisticated experience on all devices

### V4 - Mobile Perfection + Dark Elegance ✨
**Key Achievements:**
- **Background Color**: Sophisticated dark brown (#372528) for elegant, warm aesthetic
- **Mobile Viewport**: Perfect full-screen animated contours on all devices (resolved viewport constraints with direct JS positioning)
- **Chat Positioning**: Optimally placed at 22vh for perfect visual balance on mobile and desktop
- **Cross-Platform Consistency**: Identical experience across all devices and screen sizes
- **Performance**: Bulletproof canvas positioning with `cssText` and `!important` declarations

**Technical Breakthroughs:**
- Direct canvas styling bypasses all CSS constraints: `position: fixed !important; width: 100vw !important; height: 100vh !important`
- Mobile viewport issues completely resolved with JavaScript-first approach
- Chat interface positioned using viewport height (22vh) for consistent placement
- Maintains all V3 animation and contour features with enhanced stability

### V3 - Burgundy Mountain Contours
**Key Achievements:**
- **Background Color**: Deep burgundy (#611E45) replacing black for warmer brand feel
- **SVG Contour Mountain**: Successfully restored original flat-top.svg contour lines
- **Smooth Animation**: Continuous breathing effect using GSAP yoyo (4s cycle, sine.inOut)
- **Camera Rotation**: 90-degree Z-axis rotation for landscape orientation
- **Performance**: Optimized with single animation loop, no breaks or restarts

**Technical Details:**
- WireframeMountain component uses direct SVG path parsing
- Orange wireframe lines (#FF8800) against burgundy background
- Elevation animation: 0.5 units per contour ring
- Camera: FOV 50°, position.z = 5, rotation.z = π/2

### V2 - SVG Foundation
- Original flat-top.svg integration with geometric contour rings
- Black background with overlay experiments

### V1 - Initial Concept
- Basic 3D mountain wireframe prototype

## Project Overview

"Context is Everything" is a sophisticated Next.js website for an AI consultancy featuring clean geometric 3D branding, contextual theming, and conversational AI interface.

## Architecture

### Core Technologies
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **3D Graphics**: Three.js with @react-three/fiber
- **UI Components**: Shadcn/ui
- **State Management**: React hooks

### Key Components
```
src/
├── app/
│   ├── api/ai-consultant/     # AI chat API endpoint (placeholder)
│   ├── globals.css            # Global styles + contextual theme variables
│   └── page.tsx               # Main page with refined layout
├── components/
│   ├── ui/                    # Shadcn UI components
│   ├── Logo3D.tsx             # 3D geometric logo with mouse interaction
│   └── ChatInterface.tsx      # Google-style conversational interface
└── hooks/
    └── useContextualTheme.tsx # Time-based adaptive color system
```

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Deployment

### Vercel
Project is configured for automatic deployment via Vercel CLI:

```bash
# Deploy to production
vercel --prod
```

- **Production URL**: https://context-is-everything-nfkkycijc-sthursfields-projects.vercel.app
- **Custom domains**: www.context-is-everything.com and context-is-everything.com
- **SSL certificates**: Automatically managed by Vercel

### Git Workflow
- **Main branch**: `main` (used for production deployments)
- **Deployment**: Vercel CLI is authenticated and ready for immediate deployment
- **Process**: Make changes → commit → deploy with `vercel --prod`

## Design System

### Brand Identity
- **Logo**: 3D extruded geometric contour rings from exact SVG paths
- **Typography**: Inter, system-ui, -apple-system
- **Proportions**: 2:1 ratio (Logo to Typography)
- **Interaction**: Mouse-controlled 3D rotation on X, Y, Z axes

### Contextual Color Palette
Time-based automatic adaptation:
- **Dawn (5-9am)**: #FFF0F2, #FFD6C5, #FF7A59
- **Midday (9am-5pm)**: #EAF6FF, #C7EAFF, #0EA5E9  
- **Storm (5-8pm)**: #F2F3F4, #D9DEDF, #6B8E74
- **Night (8pm-5am)**: #0b1230, #192b4a, #FFD36E

### Layout Structure
1. **Header**: 3D logo + typography lockup with 2:1 proportions
2. **Main**: Google-style chat interface with suggestion buttons
3. **Footer**: Minimal brand tagline

## Key Features

### 3D Logo (Logo3D.tsx)
- Uses exact brand SVG paths: Three geometric contour rings
- Smooth mouse interaction with lerp interpolation
- Clean materials without complex lighting
- Responsive sizing with mobile optimization

### Chat Interface (ChatInterface.tsx)
- Google-style large input field with rounded design
- 5 contextual suggestion buttons for common queries
- Placeholder responses demonstrating rich content capability
- Ready for AI API integration (currently functional placeholder)

### Contextual Theming (useContextualTheme.tsx)
- Automatic time-based theme detection
- Manual theme override buttons
- CSS custom properties for smooth transitions
- Contrast-aware text color calculation

## Performance Optimizations

### Core Web Vitals
- **Lazy Loading**: 3D logo loads only when visible (Intersection Observer)
- **Progressive Enhancement**: Static SVG fallback before 3D loads
- **Reduced Motion**: Respects user preferences for accessibility
- **Performance Hints**: Optimized Three.js settings (limited DPR, selective antialiasing)
- **Mobile Optimization**: Reduced 3D complexity on smaller screens

### SEO Foundations
- **Technical SEO**: Complete meta tags, structured data, OpenGraph/Twitter cards
- **Semantic HTML**: Proper header hierarchy (H1→H2→H3), ARIA labels, roles
- **Hidden Content**: SEO-friendly invisible content for crawlers with service descriptions
- **Schema Markup**: Organization, Person, and Service structured data
- **Accessibility**: Screen reader support, skip links, keyboard navigation

### Performance Features
- GPU acceleration for smooth animations
- Font display optimization (swap)
- Efficient bundle size (238KB main route)
- Automated sitemap and robots.txt generation

## Future Development

### Phase 2 - AI Integration
- Connect ChatInterface to Anthropic Claude API
- Rich responses with case studies and team profiles
- Advanced conversational flows
- Rate limiting and security enhancements

### Content Enhancement
- Team member profiles and case studies
- Interactive portfolio pieces
- Advanced 3D interactions
- Weather-based contextual theming

## Brand Essence

**Visual Metaphor**: Clean geometric 3D contour rings demonstrate how context changes perspective through interactive rotation.

**Core Message**: "Identity emerges through perspective" - demonstrated through adaptive contextual theming and interactive 3D branding.