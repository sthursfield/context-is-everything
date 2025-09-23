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
      setTimeout(() => {
        setCurrentTheme('light')
        setIsTransitioning(false)
      }, 2500)
    }
  }

  return (
    <div
      className={`min-h-screen relative overflow-x-hidden transition-all duration-[2500ms] ease-out ${isTransitioning ? 'transitioning' : ''}`}
      data-theme={currentTheme}
      style={{
        backgroundColor: currentTheme === 'dark' ? '#372528' : '#ffffff'
      }}
    >
      {/* Mountain background - fixed positioning with theme awareness */}
      <div
        className={`fixed inset-0 w-full h-full transition-all duration-[2500ms] ease-out ${
          currentTheme === 'light' ? 'mountain-conversation-mode' : ''
        }`}
        style={{
          transform: currentTheme === 'light' ? 'scale(0.6) translateY(-40%)' : 'scale(1) translateY(0)',
          opacity: currentTheme === 'light' ? 0.8 : 1,
          zIndex: currentTheme === 'light' ? -1 : 1
        }}
      >
        <WireframeMountain currentTheme={currentTheme} />
      </div>

      {/* Page content - scrollable over the animation with theme-aware text */}
      <div
        className={`relative z-10 pointer-events-none min-h-screen transition-colors duration-[2500ms] ${
          currentTheme === 'light' ? 'text-gray-900' : 'text-white'
        }`}
      >
        <header className="px-6 pb-6 pt-12 pointer-events-auto">
          <div className="max-w-4xl mx-auto w-full">
            {/* PNG for both desktop and mobile - no font fallback risks */}
            <img
              src="/assets/CIE_stacked_cropped.png"
              alt="Context is Everything"
              className="h-auto block mx-auto cursor-pointer hover:opacity-90 transition-opacity duration-200 md:cursor-pointer cursor-default"
              style={{
                display: 'block',
                minHeight: '20px',
                width: '25%',
                maxWidth: '300px',
                height: 'auto'
              }}
              loading="eager"
              decoding="sync"
              onClick={() => {
                // Only refresh on desktop (md and up)
                if (window.innerWidth >= 768) {
                  window.location.reload()
                }
              }}
            />

            {/* New Header Buttons - Team and What we do */}
            <div className="header-buttons flex justify-center gap-8 mt-6 mb-4">
              <button
                className={`header-btn team-btn px-6 py-3 backdrop-blur-sm border rounded-full hover:scale-105 active:scale-95 transition-all duration-300 font-medium tracking-wide ${
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
                className={`header-btn whatwedo-btn px-6 py-3 backdrop-blur-sm border rounded-full hover:scale-105 active:scale-95 transition-all duration-300 font-medium tracking-wide ${
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

        {/* Chat positioned at 22vh for perfect visual balance */}
        <main className="absolute left-0 right-0 p-6 pointer-events-auto" style={{ top: '22vh' }}>
          <div className="max-w-4xl mx-auto w-full">
            <ChatInterface
              currentColor={colors.accent}
              currentTheme={currentTheme}
              isTransitioning={isTransitioning}
            />
          </div>
        </main>

        {/* Spacer to allow scrolling back to top */}
        <div className="h-screen pointer-events-none"></div>
      </div>
    </div>
  )
}
