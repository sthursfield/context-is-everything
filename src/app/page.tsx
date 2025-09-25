'use client'

import { useState } from 'react'
import WireframeMountain from '@/components/WireframeMountain'
import ChatInterface from '@/components/ChatInterface'
import { useContextualTheme } from '@/hooks/useContextualTheme'

export default function HomePage() {
  const { colors } = useContextualTheme()
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('dark')
  const [isTransitioning, setIsTransitioning] = useState(false)

  const triggerConversationMode = () => {
    if (currentTheme === 'dark') {
      setIsTransitioning(true)
      // Start transition immediately, no delay
      setCurrentTheme('light')
      setTimeout(() => {
        setIsTransitioning(false)
      }, 4000) // 4 seconds for smooth transition completion
    }
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
            {/* ✅ DEPLOYMENT PIPELINE CONFIRMED WORKING v8.4.0 */}
            <img
              src={currentTheme === 'dark' ? "/assets/CIE_stacked_cropped.png" : "/assets/CIE_stacked_mobile_autumn.png"}
              alt="Context is Everything"
              className="h-auto block mx-auto cursor-pointer hover:opacity-90 transition-opacity duration-200 md:cursor-pointer cursor-default mb-20"
              style={{
                display: 'block',
                minHeight: '20px',
                width: '94%', // 25% bigger: 75% * 1.25 = 93.75% ≈ 94%
                maxWidth: '350px', // 25% bigger: 280px * 1.25 = 350px
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

            {/* Header Buttons - Moved below logo for better layout */}
            <div className="header-buttons flex justify-center gap-4 md:gap-3 mb-6">
              <button
                className={`header-btn team-btn px-4 py-2 md:px-3 md:py-1.5 backdrop-blur-sm border rounded-full transition-all duration-200 flex items-center gap-2 text-xs md:text-xs font-medium ${
                  currentTheme === 'light'
                    ? 'bg-white/20 border-gray/20 text-gray-900 hover:bg-white/30 hover:border-gray/30'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30'
                }`}
                onClick={() => {
                  triggerConversationMode()
                  // Trigger team content in ChatInterface (Foundation functionality)
                  const event = new CustomEvent('headerButtonClick', {
                    detail: { action: 'team' }
                  })
                  window.dispatchEvent(event)
                }}
              >
                Team
              </button>
              <button
                className={`header-btn whatwedo-btn px-4 py-2 md:px-3 md:py-1.5 backdrop-blur-sm border rounded-full transition-all duration-200 flex items-center gap-2 text-xs md:text-xs font-medium ${
                  currentTheme === 'light'
                    ? 'bg-white/20 border-gray/20 text-gray-900 hover:bg-white/30 hover:border-gray/30'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30'
                }`}
                onClick={() => {
                  triggerConversationMode()
                  // Trigger what we do content in ChatInterface
                  const event = new CustomEvent('headerButtonClick', {
                    detail: { action: 'whatwedo' }
                  })
                  window.dispatchEvent(event)
                }}
              >
                What we do
              </button>
            </div>
          </div>
        </header>

        {/* Chat positioned responsively for optimal mobile and desktop experience */}
        <main className="absolute left-0 right-0 p-4 md:p-6 pointer-events-auto" style={{ top: 'clamp(15vh, 22vh, 25vh)' }}>
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
