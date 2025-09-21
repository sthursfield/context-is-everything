'use client'

import { useState, useRef, useEffect } from 'react'
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

interface EmailFormData {
  name: string
  email: string
  teamMember: string
  message: string
}

export default function ChatInterface({ currentColor }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [emailForm, setEmailForm] = useState<EmailFormData>({
    name: '',
    email: '',
    teamMember: 'General Inquiry',
    message: ''
  })
  const [emailSending, setEmailSending] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Smart scrolling to questions, not bottom
  const scrollToMessage = (messageIndex: number) => {
    setTimeout(() => {
      const messageElements = document.querySelectorAll('[data-message-index]')
      const targetElement = messageElements[messageIndex] as HTMLElement
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        })
      }
    }, 100)
  }

  // Handle clicks on contact links
  useEffect(() => {
    const handleContactLinkClick = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.classList.contains('contact-link')) {
        e.preventDefault()
        const contactType = target.getAttribute('data-contact-type') || ''

        let teamMember = 'General Inquiry'
        if (contactType.includes('Lindsay') || contactType.includes('Technical')) {
          teamMember = 'Lindsay - Technical Architecture'
        } else if (contactType.includes('Robbie') || contactType.includes('Operations')) {
          teamMember = 'Robbie - Operations & Crisis Management'
        } else if (contactType.includes('Spencer') || contactType.includes('Strategy')) {
          teamMember = 'Spencer - AI Strategy & Positioning'
        }

        setEmailForm(prev => ({ ...prev, teamMember }))
        setShowEmailForm(true)
      }
    }

    document.addEventListener('click', handleContactLinkClick)
    return () => document.removeEventListener('click', handleContactLinkClick)
  }, [])

  const formatResponse = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim())

    return lines.map((line, index) => {
      const trimmedLine = line.trim()

      if (trimmedLine.startsWith('## ')) {
        const headerText = trimmedLine.replace(/^## \*\*(.+?)\*\*$/, '$1').replace(/^## /, '')
        return (
          <h2 key={index} className="text-lg font-bold text-gray-900 mt-6 mb-3 first:mt-0">
            {headerText}
          </h2>
        )
      }

      if (trimmedLine.startsWith('### ')) {
        const headerText = trimmedLine.replace(/^### \*\*(.+?)\*\*.*$/, '$1').replace(/^### /, '')
        return (
          <h3 key={index} className="text-md font-semibold text-gray-900 mt-4 mb-2">
            {headerText}
          </h3>
        )
      }

      if (trimmedLine.startsWith('• ')) {
        const bulletContent = trimmedLine.replace(/^• /, '')
        const formattedContent = bulletContent
          // Handle contact links with bold formatting first: **[Contact Name](javascript:void(0))**
          .replace(/\*\*\[([^\]]+)\]\(javascript:void\(0\)\)\*\*/g, (match, linkText) => {
            return `<button data-contact-type="${linkText}" class="contact-link text-blue-600 hover:text-blue-800 underline cursor-pointer bg-transparent border-none p-0 font-bold">${linkText}</button>`
          })
          // Handle regular contact links: [Contact Name](javascript:void(0))
          .replace(/\[([^\]]+)\]\(javascript:void\(0\)\)/g, (match, linkText) => {
            return `<button data-contact-type="${linkText}" class="contact-link text-blue-600 hover:text-blue-800 underline cursor-pointer bg-transparent border-none p-0 font-inherit">${linkText}</button>`
          })
          // Handle remaining bold text
          .replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>')
          // Handle regular external links
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener">$1</a>')
        return (
          <div key={index} className="ml-4 mb-2 leading-relaxed">
            <span className="inline-block w-2 text-gray-600 mr-2">•</span>
            <span dangerouslySetInnerHTML={{ __html: formattedContent }} />
          </div>
        )
      }

      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**') && trimmedLine.split('**').length === 3 && !trimmedLine.includes('[Contact')) {
        const boldText = trimmedLine.replace(/^\*\*(.+?)\*\*$/, '$1')
        return (
          <div key={index} className="font-bold text-gray-900 mt-4 mb-2">
            {boldText}
          </div>
        )
      }

      if (trimmedLine.length > 0) {
        const formattedText = trimmedLine
          // Handle contact links with bold formatting first: **[Contact Name](javascript:void(0))**
          .replace(/\*\*\[([^\]]+)\]\(javascript:void\(0\)\)\*\*/g, (match, linkText) => {
            return `<button data-contact-type="${linkText}" class="contact-link text-blue-600 hover:text-blue-800 underline cursor-pointer bg-transparent border-none p-0 font-bold">${linkText}</button>`
          })
          // Handle regular contact links: [Contact Name](javascript:void(0))
          .replace(/\[([^\]]+)\]\(javascript:void\(0\)\)/g, (match, linkText) => {
            return `<button data-contact-type="${linkText}" class="contact-link text-blue-600 hover:text-blue-800 underline cursor-pointer bg-transparent border-none p-0 font-inherit">${linkText}</button>`
          })
          // Handle remaining bold text
          .replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>')
          // Handle regular external links
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener">$1</a>')
        return (
          <div key={index} className="mb-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedText }} />
        )
      }

      return null
    }).filter(Boolean)
  }

  // AI API integration with fallback to curated responses
  const getApiResponse = async (query: string): Promise<string> => {
    try {
      const response = await fetch('/api/ai-consultant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      return data.answer
    } catch (error) {
      console.error('API error, falling back to curated response:', error)
      return getFallbackResponse(query)
    }
  }

  // Fallback responses for common queries when API fails
  const getFallbackResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()

    // Contact trigger detection
    if (lowerQuery.includes('contact') || lowerQuery.includes('reach out') || lowerQuery.includes('get in touch') || lowerQuery.includes('email') || lowerQuery.includes('speak with') || lowerQuery.includes('talk to')) {
      setShowEmailForm(true)
      return 'SHOW_CONTACT_FORM'
    }

    if (lowerQuery.includes('foundation') || lowerQuery.includes('team')) {
      return `We're Lindsay, Robbie, and Spencer. Lindsay handles technical complexity that most companies underestimate. Robbie manages operational reality where theory meets practice. Spencer provides strategic positioning based on cross-sector patterns.

Our approach focuses on why solutions succeed in one organisation but fail in another - it's rarely about the methodology itself.

**[Contact Lindsay - Technical Architecture](javascript:void(0))**

**[Contact Robbie - Operations & Crisis Management](javascript:void(0))**

**[Contact Spencer - AI Strategy & Positioning](javascript:void(0))**

**[Contact Us - General Inquiry](javascript:void(0))**

**What's the specific challenge you're trying to solve?**`
    }

    if (lowerQuery.includes('findings') || lowerQuery.includes('insights')) {
      return `Our analysis shows 67% success rates when solutions account for organisational context vs 23% for generic methodology application. Most failures happen when companies apply best practices without contextual adaptation.

Cross-sector insights reveal implementation patterns that single-industry experience misses.

**Which patterns would be most relevant to your current challenges?**`
    }

    if (lowerQuery.includes('future') || lowerQuery.includes('work together')) {
      return `Strategic collaboration works when it addresses your specific organisational context rather than applying generic frameworks. We help identify where proven approaches need adaptation for your situation.

Most valuable conversations happen when you're evaluating options that have worked elsewhere but need contextual adjustment for your organisation.

**[Contact Lindsay - Technical Architecture](javascript:void(0))**

**[Contact Robbie - Operations & Crisis Management](javascript:void(0))**

**[Contact Spencer - AI Strategy & Positioning](javascript:void(0))**

**[Contact Us - General Inquiry](javascript:void(0))**

**Interested in a strategic discussion about your specific situation?**`
    }

    return `Most solutions work brilliantly in one context but fail when context shifts. Implementation success depends more on organisational dynamics than methodology selection.

**What brings you here today?**

• **Foundation**: Strategic approach & team expertise
• **Findings**: Cross-sector intelligence & counter-intuitive patterns
• **Future**: Strategic collaboration framework`
  }

  const handleSubmit = async (query: string, isFromThreeFs = false) => {
    if (!query.trim()) return

    // Mark user as having interacted if this is a manual query
    if (!isFromThreeFs) {
      setHasUserInteracted(true)
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: query.trim()
    }

    const apiResponse = await getApiResponse(query.trim())

    if (apiResponse === "SHOW_CONTACT_FORM") {
      setMessages(prev => [...prev, userMessage])
      setInputValue('')
      setIsLoading(false)
      return
    }

    // Single F conversation: replace previous F answers if user hasn't interacted
    if (isFromThreeFs && !hasUserInteracted) {
      // Replace all messages with this F conversation
      setMessages([userMessage])
    } else {
      // Normal conversation flow
      setMessages(prev => [...prev, userMessage])
    }

    setInputValue('')
    setIsLoading(true)

    // Create assistant response immediately since API call is already complete
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: apiResponse
    }

    if (isFromThreeFs && !hasUserInteracted) {
      // Replace previous assistant response
      setMessages(prev => [...prev, assistantMessage])
    } else {
      // Add to conversation
      setMessages(prev => [...prev, assistantMessage])
    }

    setIsLoading(false)

    // Smart scrolling: to user's question, not bottom
    const messageCount = isFromThreeFs && !hasUserInteracted ? 0 : messages.length
    scrollToMessage(messageCount)
  }

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      handleSubmit(inputValue)
    }
  }

  const handleEmailFormChange = (field: keyof EmailFormData, value: string) => {
    setEmailForm(prev => ({ ...prev, [field]: value }))
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailSending(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: emailForm.name,
          email: emailForm.email,
          teamMember: emailForm.teamMember,
          message: emailForm.message
        })
      })

      const result = await response.json()

      if (response.ok) {
        // Show success message below chat input instead of in conversation
        setEmailSuccess(`✅ **Message sent successfully!**

Thank you ${emailForm.name}, your message has been sent to our team.

**What happens next:**
• You'll receive a confirmation email shortly
• We'll respond within 24 hours
• ${emailForm.teamMember === 'General Inquiry' ? 'Our team will review your inquiry and connect you with the right person' : `${emailForm.teamMember.split(' - ')[0]} will personally respond to your message`}

We appreciate you reaching out and look forward to connecting with you.`)

        // Clear conversation and form
        setMessages([])
        setEmailForm({ name: '', email: '', teamMember: 'General Inquiry', message: '' })
        setShowEmailForm(false)
        setHasUserInteracted(false)
      } else {
        throw new Error(result.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Email sending error:', error)

      // Show error message below chat input instead of in conversation
      setEmailSuccess(`❌ **Unable to send message**

We're experiencing technical difficulties with our contact form. Please try one of these alternatives:

• Email us directly: **spencer@point35.com**
• Try again in a few minutes
• Use the subject line: "${emailForm.teamMember} - Message from ${emailForm.name}"

We apologize for the inconvenience and appreciate your patience.`)
    }

    setEmailSending(false)
  }

  const threeFs = [
    { id: 'foundation', label: 'Foundation', description: 'Our team & approach' },
    { id: 'findings', label: 'Findings', description: 'Latest business insights' },
    { id: 'future', label: 'Future', description: 'How we work together' }
  ]

  const handleThreeFsClick = (selectedF: string) => {
    const queries = {
      foundation: "Tell me about your Foundation - your team and approach",
      findings: "Share your latest Findings and business insights",
      future: "How might we work together in the Future?"
    }
    const query = queries[selectedF as keyof typeof queries]

    setInputValue(query)
    handleSubmit(query, true) // Pass isFromThreeFs flag
  }

  return (
    <div className="w-full max-w-4xl mx-auto relative" style={{ zIndex: 10 }}>
      {/* 3 F's Navigation - Above Chat Input */}
      <div className="mb-4">
        <div className="flex gap-2 justify-center">
          {threeFs.map((f) => (
            <button
              key={f.id}
              onClick={() => handleThreeFsClick(f.id)}
              className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-200 flex items-center gap-2 text-sm"
            >
              <span className="font-medium">{f.label}</span>
              <span className="text-xs opacity-75 hidden sm:inline">{f.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Field */}
      <div className="mb-8 relative">
        <form onSubmit={handleInputSubmit}>
          <div className="relative bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl" style={{ boxShadow: `0 4px 20px rgba(0,0,0,0.1)` }}>
            <div className="flex items-center px-6 py-4">
              <div className="mr-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>

              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about our team..."
                className="flex-1 border-0 border-none bg-transparent text-lg py-0 px-0 focus:ring-0 focus:ring-offset-0 focus:border-0 focus:outline-none focus:shadow-none placeholder:text-gray-400 text-gray-900 shadow-none"
                disabled={isLoading}
              />

              <Button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="ml-4 rounded-full h-10 w-10 p-0 transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: inputValue.trim() ? '#BC302C' : '#e5e7eb',
                  color: inputValue.trim() ? 'white' : '#9ca3af',
                  opacity: inputValue.trim() ? 1 : 0.6
                }}
              >
                {isLoading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Email Success/Error Message */}
      {emailSuccess && (
        <div className="mb-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4" style={{ borderLeftColor: emailSuccess.includes('✅') ? '#10B981' : '#EF4444' }}>
            <div className="text-sm leading-relaxed text-gray-800">
              {formatResponse(emailSuccess)}
            </div>
            <button
              onClick={() => setEmailSuccess(null)}
              className="mt-4 px-4 py-2 text-sm rounded-lg transition-colors duration-200"
              style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
              onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#E5E7EB'}
              onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#F3F4F6'}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Email Contact Form */}
      {showEmailForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-4 border-2 border-blue-200">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Our Team</h3>
            <p className="text-sm text-gray-600">Send us a message and we&apos;ll get back to you within 24 hours.</p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  value={emailForm.name}
                  onChange={(e) => handleEmailFormChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                <input
                  type="email"
                  value={emailForm.email}
                  onChange={(e) => handleEmailFormChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Who would you like to reach?</label>
              <select
                value={emailForm.teamMember}
                onChange={(e) => handleEmailFormChange('teamMember', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Lindsay - Technical Architecture">Lindsay - Technical Architecture</option>
                <option value="Robbie - Operations & Crisis Management">Robbie - Operations & Crisis Management</option>
                <option value="Spencer - AI Strategy & Positioning">Spencer - AI Strategy & Positioning</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                value={emailForm.message}
                onChange={(e) => handleEmailFormChange('message', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white text-gray-900"
                placeholder="Tell us about your challenge or question..."
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={emailSending}
                className="flex-1 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{backgroundColor: '#A62F03'}}
                onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#F28322'}
                onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#A62F03'}
              >
                {emailSending ? 'Sending...' : 'Send Message'}
              </button>

              <button
                type="button"
                onClick={() => setShowEmailForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                data-message-index={index}
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
                    {message.type === 'assistant' ? (
                      <div>{formatResponse(message.content)}</div>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-4 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: currentColor }} />
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: currentColor, animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: currentColor, animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
    </div>
  )
}