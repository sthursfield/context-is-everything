'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

export default function AIConsultant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai-consultant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userMessage.content })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.answer,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])

    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
      console.error('AI consultant error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <section className="py-24 px-6" style={{ background: 'var(--context-gradient)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 
            className="text-4xl md:text-5xl font-semibold mb-6 uppercase tracking-[0.3em]"
            style={{ color: 'var(--context-text)' }}
          >
            AI Consultant
          </h2>
          <p 
            className="text-lg max-w-2xl mx-auto opacity-80 mb-8"
            style={{ color: 'var(--context-text)' }}
          >
            Ask our AI consultant about brand strategy, design thinking, 
            or how we approach contextual solutions for your business.
          </p>
        </div>

        {/* Chat Interface */}
        <div className="max-w-3xl mx-auto">
          {/* Google-style search input */}
          <div className="mb-8">
            <form onSubmit={handleSubmit} className="relative">
              <div 
                className="flex items-center bg-white rounded-full shadow-lg border-2 transition-all duration-300"
                style={{ 
                  borderColor: isExpanded ? 'var(--context-accent)' : 'transparent'
                }}
              >
                <div className="pl-6">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setIsExpanded(true)}
                  onBlur={() => setIsExpanded(messages.length === 0)}
                  placeholder="Ask about brand strategy, design, or contextual solutions..."
                  className="flex-1 border-0 bg-transparent text-gray-900 text-lg py-4 px-4 focus:ring-0 focus:outline-none"
                  disabled={isLoading}
                />

                <div className="pr-2">
                  <Button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className="rounded-full h-10 w-10 p-0"
                    style={{ background: 'var(--context-accent)' }}
                  >
                    {isLoading ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Messages */}
          {messages.length > 0 && (
            <div 
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-h-96 overflow-y-auto"
              style={{ border: '1px solid var(--context-accent)' }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 
                  className="font-semibold text-lg"
                  style={{ color: 'var(--context-text)' }}
                >
                  Conversation
                </h3>
                <Button
                  onClick={clearChat}
                  variant="ghost"
                  className="text-xs uppercase tracking-wider hover:opacity-70"
                  style={{ color: 'var(--context-accent)' }}
                >
                  Clear
                </Button>
              </div>

              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-white/20 text-right'
                          : 'bg-white/30'
                      }`}
                    >
                      <div 
                        className="text-sm leading-relaxed"
                        style={{ color: 'var(--context-text)' }}
                      >
                        {message.content}
                      </div>
                      <div 
                        className="text-xs mt-2 opacity-60"
                        style={{ color: 'var(--context-text)' }}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* Suggested Questions */}
          {messages.length === 0 && (
            <div className="text-center">
              <p 
                className="text-sm mb-4 opacity-70"
                style={{ color: 'var(--context-text)' }}
              >
                Try asking about:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  'How do you approach brand strategy?',
                  'What makes contextual design effective?',
                  'Tell me about your 3D visualization services',
                  'How do you measure brand success?'
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInputValue(suggestion)}
                    className="px-4 py-2 text-sm rounded-full transition-all duration-300 hover:opacity-80"
                    style={{ 
                      background: 'var(--context-accent)',
                      color: 'white'
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}