'use client'

import { useState, useEffect } from 'react'
import gsap from 'gsap'

interface TypographyRevealProps {
  currentColor: string
  className?: string
}

export default function TypographyReveal({ currentColor, className = '' }: TypographyRevealProps) {
  const [svgContent, setSvgContent] = useState<string>('')
  const [isLoaded, setIsLoaded] = useState(false)

  // Load SVG typography from logo-header.svg
  useEffect(() => {
    fetch('/assets/logo-header.svg')
      .then(response => response.text())
      .then(svgText => {
        // Parse and modify the SVG to use currentColor
        const parser = new DOMParser()
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml')
        const svgElement = svgDoc.querySelector('svg')
        
        if (svgElement) {
          // Update text fill to use currentColor for proper contrast
          const textElement = svgElement.querySelector('text')
          if (textElement) {
            textElement.setAttribute('fill', 'currentColor')
          }
          
          // Also update any tspan elements
          const tspanElements = svgElement.querySelectorAll('tspan')
          tspanElements.forEach(tspan => {
            tspan.setAttribute('fill', 'currentColor')
          })
          
          // Get the modified SVG content
          setSvgContent(new XMLSerializer().serializeToString(svgElement))
          setIsLoaded(true)
        }
      })
      .catch(error => {
        console.warn('Failed to load typography SVG:', error)
        setIsLoaded(true) // Show fallback
      })
  }, [])

  // Animate typography on load - fade up with stagger
  useEffect(() => {
    if (isLoaded) {
      const typographyElement = document.querySelector('.typography-reveal')
      if (typographyElement) {
        // Initial state
        gsap.set(typographyElement, { 
          opacity: 0, 
          y: 30 
        })
        
        // Animate in
        gsap.to(typographyElement, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.2
        })

        // Animate individual letter spans if they exist
        const letterSpans = typographyElement.querySelectorAll('tspan')
        if (letterSpans.length > 0) {
          gsap.set(letterSpans, { opacity: 0 })
          gsap.to(letterSpans, {
            opacity: 1,
            duration: 0.05,
            stagger: 0.03,
            ease: "none",
            delay: 0.4
          })
        }
      }
    }
  }, [isLoaded])

  // Update SVG color when currentColor changes
  useEffect(() => {
    const typographyElement = document.querySelector('.typography-reveal svg')
    if (typographyElement) {
      (typographyElement as HTMLElement).style.color = currentColor
    }
  }, [currentColor])

  if (!isLoaded) {
    return (
      <div 
        className={`typography-reveal ${className} flex items-center justify-center`}
        style={{ height: '80px', width: '100%' }}
      >
        <div 
          className="animate-pulse bg-gray-300 rounded"
          style={{ height: '40px', width: '300px' }}
        />
      </div>
    )
  }

  return (
    <div className={`typography-reveal ${className} flex items-center justify-center`}>
      {svgContent ? (
        <div
          dangerouslySetInnerHTML={{ __html: svgContent }}
          style={{ color: currentColor }}
          className="w-full max-w-2xl"
        />
      ) : (
        // Fallback text if SVG loading fails
        <h1 
          className="text-4xl lg:text-6xl font-bold uppercase tracking-[0.46em] leading-none"
          style={{ 
            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            color: currentColor
          }}
        >
          CONTEXT IS<br/>EVERYTHING
        </h1>
      )}
    </div>
  )
}