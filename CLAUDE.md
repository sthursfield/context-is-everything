# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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