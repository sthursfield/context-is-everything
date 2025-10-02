'use client'

import { useState, useEffect } from 'react'
import WireframeMountain from '@/components/WireframeMountain'
import ChatInterface from '@/components/ChatInterface'
import CookieConsent from '@/components/CookieConsent'
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
        backgroundColor: currentTheme === 'dark' ? '#611E45' : '#f8f9fa',
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
        <header className="px-6 pt-12 pointer-events-auto">
          <div className="max-w-4xl mx-auto w-full">
            {/* ✅ BALANCED SPACING v10.1.0 - mb-20 for desktop, mobile needs CSS override check */}
            <img
              src={currentTheme === 'dark' ? "/assets/CIE_stacked_cropped.png" : "/assets/CIE_stacked_mobile_autumn.png"}
              alt="Context is Everything"
              className="h-auto block mx-auto cursor-pointer hover:opacity-90 transition-opacity duration-200 md:cursor-pointer cursor-default"
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
          className="relative p-4 md:p-6 pointer-events-auto mt-[25px] md:mt-[40px]"
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

        {/* Footer with copyright and policy links */}
        <footer className={`fixed left-0 right-0 z-20 pointer-events-auto p-4 md:p-6 bg-transparent ${isMobile ? 'bottom-[-120px]' : 'bottom-0'}`}>
          <div className="max-w-4xl mx-auto w-full">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm"
                 style={{ color: '#959595' }}>
              <div className="text-center md:text-left">
                <div className="md:inline">Copyright © 2025 Context-is-Everything</div>
                <div className="md:inline md:ml-2">All rights reserved</div>
              </div>
              <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6">
                <a href="/privacy"
                   className="hover:opacity-70 transition-opacity duration-200 underline"
                   style={{ color: '#959595' }}>
                  Privacy Policy
                </a>
                <a href="/cookies"
                   className="hover:opacity-70 transition-opacity duration-200 underline"
                   style={{ color: '#959595' }}>
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </footer>

        {/* Spacer to allow scrolling back to top */}
        <div className="h-screen pointer-events-none"></div>
      </div>

      {/* EU Cookie Consent Banner */}
      <CookieConsent />
    </div>
  )
}
