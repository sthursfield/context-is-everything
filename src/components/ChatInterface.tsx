'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
}

interface ChatInterfaceProps {
  currentColor: string
}

export default function ChatInterface({ currentColor }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const suggestions = [
    "Who should I talk to about AI strategy?",
    "Show me your best case study",
    "What makes you different?",
    "Tell me about your team", 
    "How can you help my business?"
  ]

  const handleSubmit = async (query: string) => {
    if (!query.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: query.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate response for now - replace with actual AI integration
    setTimeout(() => {
      const responses: Record<string, string> = {
        'Who should I talk to about AI strategy?': 'Our CTO Sarah Chen leads AI strategy consultations. With 15+ years in scalable architecture and AI integration, she can help you navigate complex technical decisions and build robust AI systems that scale with your business.',
        'Show me your best case study': 'We recently helped a Fortune 500 company implement contextual AI that adapts responses based on user context, increasing engagement by 340%. The solution combined natural language processing with real-time personalization.',
        'What makes you different?': 'We believe context is everything. Unlike traditional consultancies, we build AI solutions that adapt and respond to their environment - creating more natural, effective interactions that feel truly intelligent.',
        'Tell me about your team': 'Our core team brings together expertise in AI/ML, business operations, and strategic marketing. Sarah (CTO) handles technical architecture, Marcus (COO) manages delivery excellence, and Elena (CMO) ensures solutions align with business goals.',
        'How can you help my business?': 'We specialize in contextual AI implementation - from conversational interfaces to adaptive content systems. We help businesses create AI solutions that understand context, adapt to users, and scale efficiently.'
      }

      const response = responses[query] || 'That\'s an interesting question. Our team would love to discuss your specific needs in more detail. Each business has unique contexts that require tailored AI solutions.'

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      handleSubmit(inputValue)
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    setShowSuggestions(false)
    handleSubmit(suggestion)
  }

  const handleInputFocus = () => {
    setIsFocused(true)
    if (!inputValue.trim() && messages.length === 0) {
      setShowSuggestions(true)
    }
  }

  const handleInputBlur = () => {
    setIsFocused(false)
    // Delay hiding suggestions to allow clicking
    setTimeout(() => setShowSuggestions(false), 150)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    if (e.target.value.trim()) {
      setShowSuggestions(false)
    } else if (isFocused && messages.length === 0) {
      setShowSuggestions(true)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Input Field */}
      <div className="mb-8 relative">
        <form onSubmit={handleInputSubmit}>
          <div 
            className="relative bg-white rounded-full shadow-lg border-2 transition-all duration-300 hover:shadow-xl"
            style={{ 
              borderColor: currentColor,
              boxShadow: `0 4px 20px ${currentColor}20`
            }}
          >
            <div className="flex items-center px-6 py-4">
              <div className="mr-4">
                <svg 
                  className="w-6 h-6 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                  />
                </svg>
              </div>
              
              <Input
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Ask me anything about Context is Everything..."
                className="flex-1 border-0 bg-transparent text-lg py-0 px-0 focus:ring-0 focus:outline-none placeholder:text-gray-400"
                disabled={isLoading}
              />

              {inputValue.trim() && (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="ml-4 rounded-full h-10 w-10 p-0 transition-all duration-200"
                  style={{ 
                    background: currentColor,
                    color: 'white'
                  }}
                >
                  {isLoading ? (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <svg 
                      className="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                      />
                    </svg>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>

        {/* Google-style Suggestions Dropdown */}
        {showSuggestions && (
          <div 
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border z-50 overflow-hidden"
            style={{ 
              borderColor: currentColor + '20',
              boxShadow: `0 8px 32px ${currentColor}15`
            }}
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-4 border-b border-gray-100 last:border-b-0"
              >
                <svg 
                  className="w-4 h-4 text-gray-400 flex-shrink-0" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
                <span className="text-gray-700 text-sm">{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </div>


      {/* Messages */}
      {messages.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.type === 'user'
                      ? 'text-white text-right'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                  style={{
                    backgroundColor: message.type === 'user' ? currentColor : undefined
                  }}
                >
                  <div className="text-sm leading-relaxed">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-4 rounded-2xl">
                  <div className="flex space-x-1">
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: currentColor }}
                    />
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ 
                        backgroundColor: currentColor,
                        animationDelay: '0.2s'
                      }}
                    />
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ 
                        backgroundColor: currentColor,
                        animationDelay: '0.4s'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}