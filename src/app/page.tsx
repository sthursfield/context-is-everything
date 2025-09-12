'use client'

import { useState, useEffect } from 'react'
import WireframeMountain from '@/components/WireframeMountain'
import TypographyReveal from '@/components/TypographyReveal'
import ChatInterface from '@/components/ChatInterface'
import { useContextualTheme } from '@/hooks/useContextualTheme'

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [, setTypographyColor] = useState('#FFFFFF') // Start with white for dark background
  const { colors } = useContextualTheme() // Only need colors, no manual controls

  // Track mouse for 3D mountain interaction + typography color animation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      setMousePosition({ x, y })
      
      // Typography color animation - smooth HSL transitions through brand palette
      const brandColors = ['#F5F1F0', '#E67E44', '#1565C0', '#F6AD55'] // Brand palette
      const mouseDistance = Math.sqrt(x * x + y * y) // 0 to ~1.4
      const colorIndex = (mouseDistance / 1.4) * (brandColors.length - 1)
      const baseIndex = Math.floor(colorIndex)
      const nextIndex = Math.min(baseIndex + 1, brandColors.length - 1)
      const t = colorIndex - baseIndex
      
      // Smooth interpolation between brand colors
      const currentColor = brandColors[baseIndex]
      const nextColor = brandColors[nextIndex]
      
      // Convert hex to HSL and interpolate
      const interpolatedColor = interpolateColors(currentColor, nextColor, t)
      setTypographyColor(interpolatedColor)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  // Color interpolation helper
  const interpolateColors = (color1: string, color2: string, t: number): string => {
    const hex1 = color1.replace('#', '')
    const hex2 = color2.replace('#', '')
    
    const r1 = parseInt(hex1.substr(0, 2), 16)
    const g1 = parseInt(hex1.substr(2, 2), 16)
    const b1 = parseInt(hex1.substr(4, 2), 16)
    
    const r2 = parseInt(hex2.substr(0, 2), 16)
    const g2 = parseInt(hex2.substr(2, 2), 16)
    const b2 = parseInt(hex2.substr(4, 2), 16)
    
    const r = Math.round(r1 + (r2 - r1) * t)
    const g = Math.round(g1 + (g2 - g1) * t)
    const b = Math.round(b1 + (b2 - b1) * t)
    
    return `rgb(${r}, ${g}, ${b})`
  }

  // Page load animation sequence
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div 
      className="min-h-screen transition-all duration-1000"
      style={{ 
        background: '#0a0a0a' // Much darker background for better contrast 
      }}
    >

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        
        {/* Header Section - Typography First, Mountain Below */}
        <header className="text-center mb-4 w-full flex flex-col items-center" role="banner">
          
          {/* Typography → Mountain Hierarchy (V8 Spec) */}
          <div 
            className="opacity-100 translate-y-0" // Always visible - no animation delays
            // Removed animation delay - logo always visible
          >
            
            {/* Typography First - Load from logo-header.svg - PERFECTLY CENTERED */}
            <div className="mb-4 w-full flex justify-center" role="img" aria-label="Context is Everything brand typography">
              {/* DEBUG: Simple fallback text to test visibility */}
              <h1 
                className="text-4xl lg:text-6xl font-bold uppercase tracking-[0.46em] leading-none mb-2 text-center"
                style={{ 
                  fontFamily: 'DIN, "DIN Next", "Helvetica Neue", Helvetica, Arial, sans-serif',
                  color: '#FFFFFF',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)' // Extra visibility
                }}
              >
                CONTEXT IS<br/>EVERYTHING
              </h1>
              
              {/* Original TypographyReveal - hidden for debugging */}
              <div style={{ display: 'none' }}>
                <TypographyReveal 
                  currentColor="#FFFFFF" // Force white for visibility on dark background
                  className="mb-8"
                />
              </div>
            </div>
            
            {/* 3D Wireframe Mountain - Background Layer */}
            <WireframeMountain 
              mousePosition={mousePosition}
              className=""
            />
            
            {/* Additional context for SEO */}
            <p className="sr-only">
              Expert artificial intelligence consultancy specializing in contextual solutions. 
              We build intelligent systems that adapt, understand context, and scale with your business.
            </p>
          </div>
        </header>

        {/* Main Chat Interface */}
        <main 
          id="main-content"
          className={`transition-all duration-1000 mt-[33vh] md:mt-16 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ animationDelay: '0.6s' }}
          role="main"
          aria-labelledby="chat-heading"
        >
          <h2 id="chat-heading" className="sr-only">AI Consultation Interface</h2>
          <section aria-label="Interactive AI consultant for business inquiries">
            <ChatInterface currentColor={colors.accent} />
          </section>
          
          {/* Services Overview for SEO */}
          <section className="sr-only" aria-label="Our Services">
            <h2>AI Consultancy Services</h2>
            <ul>
              <li>
                <h3>AI Strategy Consulting</h3>
                <p>Strategic planning and roadmap development for AI implementation in your business.</p>
              </li>
              <li>
                <h3>Contextual AI Development</h3>
                <p>Custom AI solutions that understand and adapt to your specific business context.</p>
              </li>
              <li>
                <h3>AI System Architecture</h3>
                <p>Scalable architecture design for intelligent business systems and applications.</p>
              </li>
              <li>
                <h3>Machine Learning Implementation</h3>
                <p>End-to-end machine learning solutions from proof of concept to production deployment.</p>
              </li>
            </ul>
          </section>
        </main>

        {/* Simple Footer */}
        <footer 
          className={`text-center mt-20 transition-all duration-1000 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ animationDelay: '1s' }}
          role="contentinfo"
        >
          <p 
            className="text-xs opacity-60"
            style={{ fontFamily: 'DIN, "DIN Next", "Helvetica Neue", Helvetica, Arial, sans-serif' }}
          >
            © Context is Everything 2025
          </p>
          
          {/* Contact Information for SEO */}
          <div className="sr-only">
            <h2>Contact Information</h2>
            <address>
              <p>Context is Everything - AI Consultancy</p>
              <p>Email: <a href="mailto:hello@contextiseverything.ai">hello@contextiseverything.ai</a></p>
              <p>Phone: <a href="tel:+1555CONTEXT">+1-555-CONTEXT</a></p>
            </address>
          </div>
        </footer>
        
      </div>
    </div>
  )
}
