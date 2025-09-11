# Context is Everything - Website

A fully responsive, optimized website for the brand "Context is Everything" featuring 3D animation, typography reveal, adaptive color, and interactive AI consultation. V1

## 🌄 Core Metaphor

The website embodies the brand philosophy through a 3D mountain that morphs into flat topographic rings, demonstrating how context reveals new shapes depending on angle, light, and depth.

## ✨ Features

### 3D Animation & Interactions
- **Mountain-to-Topographic Morphing**: 3D mountain gradually transitions to flat contour rings on scroll
- **Chiaroscuro Lighting**: Interactive lighting that responds to mouse movement
- **GSAP ScrollTrigger**: Synchronized animations between 3D morphing and typography reveal

### Typography & Design
- **Progressive Word Reveal**: "Context is Everything" appears in reverse order with Swiss typography standards
- **Adaptive Color Palette**: Background and elements adapt to contextual states (Dawn, Midday, Storm, Night)
- **Responsive Design**: Optimized for mobile, tablet, and desktop

### Interactive Components
- **Team Section**: Professional team display with hover effects and chiaroscuro lighting
- **Contact Form**: Fully functional form with validation using Shadcn components
- **AI Consultant**: Google-style search interface powered by Anthropic Claude API

### Performance & Security
- **Performance Optimizations**: GPU acceleration, reduced motion support, optimized Three.js rendering
- **Security**: API key protection, rate limiting, input validation
- **Accessibility**: Proper semantic HTML, keyboard navigation, screen reader support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env.local
```
Add your Anthropic API key to `.env.local`:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open [http://localhost:3000](http://localhost:3000) to view the site**

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/ai-consultant/    # AI consultant API route
│   ├── globals.css           # Global styles and contextual theme variables
│   └── page.tsx              # Main homepage component
├── components/
│   ├── ui/                   # Shadcn UI components
│   ├── MountainAnimation.tsx # 3D mountain morphing animation
│   ├── TypographyReveal.tsx  # Progressive text reveal with GSAP
│   ├── TeamSection.tsx       # Professional team display
│   ├── ContactForm.tsx       # Contact form with validation
│   └── AIConsultant.tsx      # AI-powered consultant interface
├── hooks/
│   └── useContextualTheme.tsx # Adaptive color theme management
└── lib/
    ├── theme.json            # Design system configuration
    └── utils.ts              # Utility functions
```

## 🎨 Design System

### Contextual Color Palette
- **Dawn**: Soft gradients, warm highlights (#FFF0F2, #FFD6C5, #FF7A59)
- **Midday**: Cool, bright contrasts (#EAF6FF, #C7EAFF, #0EA5E9)
- **Storm**: Muted greys with green undertones (#F2F3F4, #D9DEDF, #6B8E74)
- **Night**: Deep navy/black with gold accents (#0b1230, #192b4a, #FFD36E)

### Typography
- **Font Stack**: Inter, GT America, Söhne, system-ui
- **Swiss Typography Standards**: Precise kerning, optical balance, geometric proportions
- **Responsive Scaling**: Fluid typography that adapts to screen size

## 🔒 Security Features

### AI Consultant Security
- API keys stored securely in environment variables
- Rate limiting (10 requests per hour per IP)
- Input sanitization and validation
- Error handling without exposing sensitive information

### General Security
- HTTPS enforcement in production
- Input validation on all forms
- No client-side secret exposure
- Proper CORS configuration

## 🎯 Performance Optimizations

- **GPU Acceleration**: Transform3d and will-change properties for smooth animations
- **Reduced Motion**: Respects user preferences for reduced motion
- **Code Splitting**: Dynamic imports for optimal bundle size
- **Image Optimization**: Next.js Image component with lazy loading
- **Three.js Optimization**: Efficient geometry updates and disposal

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px
- **Large Desktop**: > 1440px

## 🔧 Customization

### Theme Configuration
Edit `src/lib/theme.json` to customize:
- Color palettes for each contextual state
- Typography settings
- Spacing and sizing values
- Animation durations and easings

### Adding New Contextual States
1. Add colors to theme.json
2. Update `useContextualTheme.tsx` hook
3. Add detection logic (time-based, weather API, etc.)

---

**Context is Everything** 
