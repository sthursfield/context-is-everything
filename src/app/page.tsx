'use client'

import { useState, useEffect, useRef } from 'react'
import WireframeMountain from '@/components/WireframeMountain'
import ChatInterface from '@/components/ChatInterface'
import CookieConsent from '@/components/CookieConsent'
import { useContextualTheme } from '@/hooks/useContextualTheme'

export default function HomePage() {
  const { colors } = useContextualTheme()
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('dark')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [hasChatMessages, setHasChatMessages] = useState(false)
  const chatInterfaceRef = useRef<{ resetChat: () => void }>(null)

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
        backgroundColor: currentTheme === 'dark' ? '#36292C' : '#f8f9fa',
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
                if (typeof window !== 'undefined') {
                  if (window.innerWidth >= 768) {
                    // Desktop: reset chat interface
                    chatInterfaceRef.current?.resetChat()
                  } else {
                    // Mobile: reset chat interface and return to dark mode
                    chatInterfaceRef.current?.resetChat()
                    setCurrentTheme('dark')
                    setIsTransitioning(false)
                  }
                }
              }}
            />

          </div>
        </header>

        {/* Chat positioned with consistent relative distances across mobile and desktop */}
        <main
          className="relative md:p-6 pointer-events-auto -mt-16 md:mt-10"
        >
          <div className="max-w-4xl mx-auto w-full">
            <ChatInterface
              ref={chatInterfaceRef}
              currentColor={colors.accent}
              currentTheme={currentTheme}
              isTransitioning={isTransitioning}
              onTriggerConversationMode={triggerConversationMode}
              onChatStateChange={setHasChatMessages}
            />
          </div>
        </main>

        {/* Spacer to allow scrolling back to top */}
        <div className="h-screen pointer-events-none"></div>
      </div>

      {/* Footer with copyright and policy links */}
      <footer className={`fixed left-0 right-0 z-20 pointer-events-auto p-4 md:p-6 bg-transparent ${isMobile ? (hasChatMessages ? 'hidden' : 'bottom-[-5px]') : 'bottom-[30px]'}`}>
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm"
               style={{ color: '#747071' }}>
            <div className="text-center md:text-left">
              <div className="block md:inline" style={{ color: '#C2C2C2' }}>Copyright © 2025 Context-is-Everything</div>
              <div className="block md:inline md:ml-2" style={{ color: '#C2C2C2' }}>All rights reserved</div>
              <div className="flex justify-center md:hidden gap-4 mt-1">
                <a href="/privacy"
                   className="hover:opacity-70 transition-opacity duration-200 underline"
                   style={{ color: '#747071' }}>
                  Privacy Policy
                </a>
                <a href="/cookies"
                   className="hover:opacity-70 transition-opacity duration-200 underline"
                   style={{ color: '#747071' }}>
                  Cookie Policy
                </a>
              </div>
            </div>
            <div className="hidden md:flex gap-6">
              <a href="/privacy"
                 className="hover:opacity-70 transition-opacity duration-200 underline"
                 style={{ color: '#747071' }}>
                Privacy Policy
              </a>
              <a href="/cookies"
                 className="hover:opacity-70 transition-opacity duration-200 underline"
                 style={{ color: '#747071' }}>
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* EU Cookie Consent Banner */}
      <CookieConsent />
    </div>
  )
}
