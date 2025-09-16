'use client'

import WireframeMountain from '@/components/WireframeMountain'
import ChatInterface from '@/components/ChatInterface'
import { useContextualTheme } from '@/hooks/useContextualTheme'

export default function HomePage() {
  const { colors } = useContextualTheme()


  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Mountain background - fixed positioning */}
      <div className="fixed inset-0 w-full h-full">
        <WireframeMountain />
      </div>

      {/* Page content - scrollable over the animation */}
      <div className="relative z-10 text-white pointer-events-none min-h-screen">
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
          </div>
        </header>

        {/* Chat positioned at 22vh for perfect visual balance */}
        <main className="absolute left-0 right-0 p-6 pointer-events-auto" style={{ top: '22vh' }}>
          <div className="max-w-4xl mx-auto w-full">
            <ChatInterface currentColor={colors.accent} />
          </div>
        </main>

        {/* Spacer to allow scrolling back to top */}
        <div className="h-screen pointer-events-none"></div>
      </div>
    </div>
  )
}
