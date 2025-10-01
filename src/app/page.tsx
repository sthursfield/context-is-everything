'use client'

import { useState, useEffect } from 'react'
import WireframeMountain from '@/components/WireframeMountain'
import ChatInterface from '@/components/ChatInterface'
import { useContextualTheme } from '@/hooks/useContextualTheme'

export default function HomePage() {
  const { colors } = useContextualTheme()
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('dark')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)

    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const triggerConversationMode = () => {
    if (currentTheme === 'dark') {
      setIsTransitioning(true)
      // Start transition immediately, no delay
      setCurrentTheme('light')
      setTimeout(() => {
        setIsTransitioning(false)
      }, 4000) // 4 seconds for smooth transition completion
    }
    // Once in light mode, stay in light mode (don't revert to dark)
  }

  return (
    <div
      className={`min-h-screen relative overflow-x-hidden transition-all duration-[4000ms] ease-in-out ${isTransitioning ? 'transitioning' : ''}`}
      data-theme={currentTheme}
      style={{
        backgroundColor: currentTheme === 'dark' ? '#372528' : '#f8f9fa',
        transition: 'background-color 4s cubic-bezier(0.23, 1, 0.32, 1)'
      }}
    >
      {/* Mountain background - fixed positioning with theme awareness */}
      <div
        className={`fixed inset-0 w-full h-full transition-all duration-[4000ms] ease-in-out ${
          currentTheme === 'light' ? 'mountain-conversation-mode' : ''
        }`}
        style={{
          zIndex: 1 // Above background, below UI
        }}
      >
        <WireframeMountain currentTheme={currentTheme} />
      </div>

      {/* Page content - scrollable over the animation with theme-aware text */}
      <div
        className={`relative z-10 pointer-events-none min-h-screen transition-colors duration-[4000ms] ${
          currentTheme === 'light' ? 'text-gray-900' : 'text-white'
        }`}
        style={{
          transition: 'color 4s cubic-bezier(0.23, 1, 0.32, 1)'
        }}
      >
        <header className="px-6 pb-6 pt-12 pointer-events-auto">
          <div className="max-w-4xl mx-auto w-full">
            {/* ✅ BALANCED SPACING v10.1.0 - mb-20 for desktop, mobile needs CSS override check */}
            <img
              src={currentTheme === 'dark' ? "/assets/CIE_stacked_cropped.png" : "/assets/CIE_stacked_mobile_autumn.png"}
              alt="Context is Everything"
              className="h-auto block mx-auto cursor-pointer hover:opacity-90 transition-opacity duration-200 md:cursor-pointer cursor-default mb-20"
              style={{
                display: 'block',
                minHeight: '20px',
                width: isMobile ? '94%' : '66%', // Desktop: 94% * 0.7 = 65.8% ≈ 66%, Mobile: keep 94%
                maxWidth: isMobile ? '350px' : '245px', // Desktop: 350px * 0.7 = 245px, Mobile: keep 350px
                height: 'auto'
              }}
              loading="eager"
              decoding="sync"
              onClick={() => {
                // Only refresh on desktop (md and up)
                if (typeof window !== 'undefined' && window.innerWidth >= 768) {
                  window.location.reload()
                }
              }}
            />

          </div>
        </header>

        {/* Chat positioned with consistent relative distances across mobile and desktop */}
        <main
          className="absolute left-0 right-0 p-4 md:p-6 pointer-events-auto"
          style={{
            top: isMobile
              ? (currentTheme === 'light'
                  ? 'calc(3rem + 4rem + 25px)'  // Mobile light: 25px from logo baseline
                  : 'calc(3rem + 4rem + 50px)')  // Mobile dark: 50px from logo baseline
              : (currentTheme === 'light'
                  ? 'calc(3rem + 2rem + 25px)'   // Desktop light: 25px from logo baseline
                  : 'calc(3rem + 2rem + 50px)')  // Desktop dark: 50px from logo baseline
          }}
        >
          <div className="max-w-4xl mx-auto w-full">
            <ChatInterface
              currentColor={colors.accent}
              currentTheme={currentTheme}
              isTransitioning={isTransitioning}
              onTriggerConversationMode={triggerConversationMode}
            />
          </div>
        </main>

        {/* Spacer to allow scrolling back to top */}
        <div className="h-screen pointer-events-none"></div>
      </div>
    </div>
  )
}
