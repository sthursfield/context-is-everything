'use client'

import { useState, useEffect } from 'react'
import WireframeMountain from '@/components/WireframeMountain'
import ChatInterface from '@/components/ChatInterface'
import { useContextualTheme } from '@/hooks/useContextualTheme'

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const { colors } = useContextualTheme()
  
  // Track mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      setMousePosition({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Page load animation sequence
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])


  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Mountain background - absolute positioning to fill parent */}
      <div className="absolute inset-0 w-full h-full">
        <WireframeMountain />
      </div>

      {/* Page content - positioned over the animation */}
      <div className="absolute inset-0 z-10 text-white pointer-events-none">
        <header className="px-6 pb-6 pt-12 pointer-events-auto">
          <div className="max-w-4xl mx-auto w-full">
            {/* Desktop: SVG, Mobile: PNG for iOS compatibility */}
            <picture>
              <source
                media="(max-width: 768px)"
                srcSet="/assets/CIE_stacked_mobile.png"
              />
              <img
                src="/assets/CIE_stacked.svg"
                alt="Context is Everything"
                className="h-auto block"
                style={{
                  display: 'block',
                  minHeight: '20px',
                  width: '25%',
                  maxWidth: '300px',
                  height: 'auto'
                }}
                loading="eager"
                decoding="sync"
              />
            </picture>
          </div>
        </header>

        {/* Chat positioned higher up the screen */}
        <main 
          className="absolute left-0 right-0 p-6 pointer-events-auto"
          style={{ top: '22vh' }}
        >
          <div className="max-w-4xl mx-auto w-full">
            <ChatInterface currentColor={colors.accent} />
          </div>
        </main>
      </div>
    </div>
  )
}
