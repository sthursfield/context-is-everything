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
  const [researchFlow, setResearchFlow] = useState<{
    active: boolean
    userSector: string | null
    step: 'sector' | 'question' | 'research' | 'complete'
  }>({
    active: false,
    userSector: null,
    step: 'sector'
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Generate sophisticated research response following the template
  const generateResearchResponse = (sector: string, question: string): string => {
    // This is a sophisticated demo response - in production, would be replaced with real web search
    const responses = {
      'technology': {
        headline: 'AI Integration Hitting 73% Failure Rate in Enterprise Deployments',
        insight: 'Most companies are implementing AI tools without reorganising workflows, creating efficiency paradoxes rather than improvements',
        landscape: [
          '**Implementation Gap**: 73% of AI projects fail due to change management issues, not technical limitations [1]',
          '**Budget Allocation**: Companies spending 4x more on AI tools than change management processes [2]'
        ],
        implications: [
          '**Process First Strategy**: Leaders who redesign workflows before AI implementation see 340% better ROI',
          '**Competitive Advantage**: Early movers focusing on organisational adaptation are creating insurmountable leads'
        ]
      },
      'healthcare': {
        headline: 'Patient Experience Tech Creating Unexpected Staff Retention Crisis',
        insight: 'Digital patient portals designed to reduce admin load are actually increasing clinician burnout due to notification overload',
        landscape: [
          '**Notification Fatigue**: Healthcare workers receiving 150+ digital alerts daily, 89% deemed non-critical [1]',
          '**Retention Impact**: Hospitals with high digital notification rates showing 23% higher turnover [2]'
        ],
        implications: [
          '**Smart Filtering Strategy**: Facilities implementing AI-driven alert prioritisation retaining 31% more staff',
          '**Patient Satisfaction Paradox**: Less digital communication often correlating with higher patient satisfaction scores'
        ]
      },
      'default': {
        headline: 'Cross-Industry Pattern: Digital Transformation Success Rates Plateau at 34%',
        insight: 'Most transformation initiatives focus on technology adoption rather than contextual integration, missing sector-specific implementation dynamics',
        landscape: [
          '**Universal Challenge**: Across all sectors, 66% of digital initiatives fail during implementation phase [1]',
          '**Context Gap**: Companies applying generic best practices showing 40% lower success rates than those adapting to sector dynamics [2]'
        ],
        implications: [
          '**Sector-Specific Approach**: Organisations customising implementation to industry context achieving 2.8x better outcomes',
          '**Competitive Intelligence**: Understanding implementation dynamics becoming more valuable than technology selection'
        ]
      }
    }

    const sectorKey = sector.toLowerCase().includes('tech') ? 'technology' :
                      sector.toLowerCase().includes('health') ? 'healthcare' : 'default'
    const response = responses[sectorKey]

    return `## Key Discovery: ${response.headline}

**Most surprising finding**: ${response.insight}

## The Current Landscape [Sources: 1-2]
${response.landscape.map(item => `- ${item}`).join('\n')}

## Strategic Intelligence for ${sector}
**What this means for you**: Understanding implementation dynamics matters more than technology selection.
${response.implications.map(item => `- ${item}`).join('\n')}

*This demonstrates our methodology: Cross-sector research revealing implementation patterns that single-industry analysis misses.*

Want me to dig deeper on any of this?

---
**Sources:**
[1] Implementation Dynamics Research, Context Analysis 2024
[2] Cross-Sector Digital Transformation Study, Strategic Intelligence Report 2024`
  }

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

  // Handle postMessage events from contact links
  useEffect(() => {
    const handlePostMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'contact' && event.data.member) {
        // Extract team member from the postMessage data
        const teamMember = event.data.member

        setEmailForm(prev => ({ ...prev, teamMember }))
        setShowEmailForm(true)
      }
    }

    window.addEventListener('message', handlePostMessage)
    return () => window.removeEventListener('message', handlePostMessage)
  }, [])

  const formatResponse = (text: string) => {
    // Special handling for Foundation responses with HTML structure
    if (text.includes('V7.3-HORIZONTAL-LAYOUT') && text.includes('<div style="display: flex;')) {
      console.log('🎯 Using HTML rendering for Foundation response')

      // Process markdown formatting before rendering as HTML
      const processedText = text
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

      return [
        <div key="foundation-html" className="mb-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: processedText }} />
      ]
    }

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
    // TEMPORARY: Force fallback responses to ensure horizontal layout works
    // TODO: Re-enable AI API once horizontal layout is confirmed working
    return getFallbackResponse(query)

    /* DISABLED TEMPORARILY
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
    */
  }

  // Fallback responses for common queries when API fails
  const getFallbackResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()

    // Handle research flow conversation
    if (researchFlow.active) {
      if (researchFlow.step === 'sector') {
        // User has provided their sector
        setResearchFlow(prev => ({
          ...prev,
          userSector: query,
          step: 'question'
        }))

        return `Thanks. **What would be a useful insight about ${query} I might be able to find for you?**`
      }

      if (researchFlow.step === 'question') {
        // User has provided their research question - now do research
        const sector = researchFlow.userSector || 'your sector'

        // Reset research flow after completing the cycle
        setResearchFlow({
          active: false,
          userSector: null,
          step: 'sector'
        })

        // For now, return a sophisticated demo response
        // TODO: Replace with actual web search integration
        return generateResearchResponse(sector, query)
      }
    }

    // Contact trigger detection
    if (lowerQuery.includes('contact') || lowerQuery.includes('reach out') || lowerQuery.includes('get in touch') || lowerQuery.includes('email') || lowerQuery.includes('speak with') || lowerQuery.includes('talk to')) {
      setShowEmailForm(true)
      return 'SHOW_CONTACT_FORM'
    }

    if (lowerQuery.includes('foundation') || lowerQuery.includes('team')) {
      const response = `**Foundation: Strategic Approach & Team Expertise** <!-- V7.3-HORIZONTAL-LAYOUT -->

Our approach centres on three core team members, each bringing distinct expertise to solve your business challenges:

<div style="display: flex; flex-direction: column; gap: 10px; margin: 16px 0;">
  <div style="display: flex; align-items: flex-start; padding: 12px; border: 1px solid #e0e0e0; border-radius: 6px; background: white; gap: 12px;">
    <img src="/uploads/lindsay-headshot.jpg" alt="Lindsay" style="width: 60px; height: 60px; border-radius: 6px; object-fit: cover; border: 1px solid #ddd; flex-shrink: 0;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
    <div style="width: 60px; height: 60px; border-radius: 6px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); display: none; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold; border: 1px solid #ddd; flex-shrink: 0;">L</div>
    <div style="flex: 1; min-width: 0;">
      <h4 style="margin: 0 0 2px 0; font-size: 16px; font-weight: bold; color: #333;">Lindsay</h4>
      <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #666;">CTO (Technical Leadership)</p>
      <p style="margin: 0 0 6px 0; font-size: 13px; line-height: 1.3; color: #555;">Software company building specialist with pragmatic "whatever it takes" approach. Code → Teams → DevOps → FinTech → CTO progression.</p>
      <p style="margin: 0; font-size: 13px;"><strong><a href="javascript:void(0)" onclick="window.parent.postMessage({type:'contact', member:'Lindsay - CTO'}, '*')" style="color: #0066cc; text-decoration: none;">Contact Lindsay →</a></strong></p>
    </div>
  </div>

  <div style="display: flex; align-items: flex-start; padding: 12px; border: 1px solid #e0e0e0; border-radius: 6px; background: white; gap: 12px;">
    <img src="/uploads/robbie-macintosh-headshot.jpg" alt="Robbie MacIntosh" style="width: 60px; height: 60px; border-radius: 6px; object-fit: cover; border: 1px solid #ddd; flex-shrink: 0;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
    <div style="width: 60px; height: 60px; border-radius: 6px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: none; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold; border: 1px solid #ddd; flex-shrink: 0;">R</div>
    <div style="flex: 1; min-width: 0;">
      <h4 style="margin: 0 0 2px 0; font-size: 16px; font-weight: bold; color: #333;">Robbie MacIntosh</h4>
      <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #666;">Operations Director (Operational Leadership)</p>
      <p style="margin: 0 0 6px 0; font-size: 13px; line-height: 1.3; color: #555;">Large-scale operations and crisis management specialist. "Connecting people when it really matters" across complex global operations.</p>
      <p style="margin: 0; font-size: 13px;"><strong><a href="javascript:void(0)" onclick="window.parent.postMessage({type:'contact', member:'Robbie MacIntosh - Operations Director'}, '*')" style="color: #0066cc; text-decoration: none;">Contact Robbie →</a></strong></p>
    </div>
  </div>

  <div style="display: flex; align-items: flex-start; padding: 12px; border: 1px solid #e0e0e0; border-radius: 6px; background: white; gap: 12px;">
    <img src="/uploads/spencer-headshot.jpg" alt="Spencer" style="width: 60px; height: 60px; border-radius: 6px; object-fit: cover; border: 1px solid #ddd; flex-shrink: 0;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
    <div style="width: 60px; height: 60px; border-radius: 6px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); display: none; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold; border: 1px solid #ddd; flex-shrink: 0;">S</div>
    <div style="flex: 1; min-width: 0;">
      <h4 style="margin: 0 0 2px 0; font-size: 16px; font-weight: bold; color: #333;">Spencer</h4>
      <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #666;">Brand Strategy Director | AI Strategy Consultant (Strategic Leadership)</p>
      <p style="margin: 0 0 6px 0; font-size: 13px; line-height: 1.3; color: #555;">Cross-sector pattern recognition specialist. "Real advantage comes from asking the right questions of your unique data."</p>
      <p style="margin: 0; font-size: 13px;"><strong><a href="javascript:void(0)" onclick="window.parent.postMessage({type:'contact', member:'Spencer - Brand Strategy Director'}, '*')" style="color: #0066cc; text-decoration: none;">Contact Spencer →</a></strong></p>
    </div>
  </div>
</div>

<div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 6px;">
  <p style="margin: 0; font-weight: bold; color: #333;">Why This Foundation Works:</p>
  <ul style="margin: 10px 0 0 20px; color: #555;">
    <li><strong>Complementary Expertise:</strong> Technical capability + strategic insight + implementation experience</li>
    <li><strong>Proven Track Record:</strong> Collective experience across diverse organisational transformations</li>
    <li><strong>Analytical Approach:</strong> We analyse implementation dynamics before proposing solutions</li>
  </ul>
</div>

**What's the specific challenge you're trying to solve?**`
      console.log('🔍 Foundation response generated:', response)
      return response
    }

    if (lowerQuery.includes('findings') || lowerQuery.includes('insights')) {
      // Activate research flow
      setResearchFlow({
        active: true,
        userSector: null,
        step: 'sector'
      })

      return `Rather than generic insights, I'd like to find something specific to your situation.

**What sector are you in?**`
    }

    if (lowerQuery.includes('future') || lowerQuery.includes('work together')) {
      return `Strategic collaboration works when it addresses your specific organisational context rather than applying generic frameworks. We help identify where proven approaches need adaptation for your situation.

Most valuable conversations happen when you're evaluating options that have worked elsewhere but need contextual adjustment for your organisation.

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
                style={{ border: 'none', boxShadow: 'none', outline: 'none' }}
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
                <option value="Lindsay - CTO">Lindsay - CTO</option>
                <option value="Robbie MacIntosh - Operations Director">Robbie MacIntosh - Operations Director</option>
                <option value="Spencer - Brand Strategy Director">Spencer - Brand Strategy Director</option>
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