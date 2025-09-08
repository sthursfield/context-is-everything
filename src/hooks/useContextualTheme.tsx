'use client'

import { useState, useEffect } from 'react'

export type ContextualState = 'dawn' | 'midday' | 'storm' | 'night'

export interface ContextualColors {
  primary: string
  secondary: string  
  accent: string
}

const colorPalettes: Record<ContextualState, ContextualColors> = {
  dawn: {
    primary: '#F5F1F0',
    secondary: '#E67E44', 
    accent: '#D2451E'
  },
  midday: {
    primary: '#F0F4F8',
    secondary: '#2C5F7F',
    accent: '#1565C0'
  },
  storm: {
    primary: '#E8EAE6',
    secondary: '#5A6B47',
    accent: '#3E5D42'
  },
  night: {
    primary: '#1A1B23',
    secondary: '#2D3748',
    accent: '#F6AD55'
  }
}

export function useContextualTheme() {
  const [contextualState, setContextualState] = useState<ContextualState>('midday')
  const [colors, setColors] = useState<ContextualColors>(colorPalettes.midday)

  // Auto-detect contextual state based on time (per build prompt)
  useEffect(() => {
    const detectContextualState = (): ContextualState => {
      const hour = new Date().getHours()
      
      // Dawn: 6am-12pm, Midday: 12pm-6pm, Storm: weather-dependent, Night: 6pm-6am
      if (hour >= 6 && hour < 12) return 'dawn'
      if (hour >= 12 && hour < 18) return 'midday'  
      if (hour >= 18 && hour < 21) return 'storm' // Evening/dusk as "storm"
      return 'night'
    }

    const initialState = detectContextualState()
    setContextualState(initialState)
    setColors(colorPalettes[initialState])

    // Update every hour
    const interval = setInterval(() => {
      const newState = detectContextualState()
      setContextualState(newState)
      setColors(colorPalettes[newState])
    }, 60000 * 60)

    return () => clearInterval(interval)
  }, [])

  // Apply theme colors to CSS custom properties
  useEffect(() => {
    const root = document.documentElement
    
    // Set CSS custom properties for dynamic theming
    root.style.setProperty('--context-primary', colors.primary)
    root.style.setProperty('--context-secondary', colors.secondary)  
    root.style.setProperty('--context-accent', colors.accent)
    
    // Create gradient background
    const gradient = `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
    root.style.setProperty('--context-gradient', gradient)
    
    // Set text color based on background lightness
    const textColor = getContrastColor(colors.primary)
    root.style.setProperty('--context-text', textColor)
    
  }, [colors])

  const setManualState = (state: ContextualState) => {
    setContextualState(state)
    setColors(colorPalettes[state])
  }

  return {
    contextualState,
    colors,
    setContextualState: setManualState,
    colorPalettes
  }
}

// Utility function to get contrasting text color
function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)  
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  return luminance > 0.5 ? '#0a0a0a' : '#ffffff'
}