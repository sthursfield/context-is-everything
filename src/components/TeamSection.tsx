'use client'

import { useState } from 'react'
import Image from 'next/image'

interface TeamMember {
  name: string
  role: string
  bio: string
  photo: string
  linkedin?: string
  email?: string
}

const teamMembers: TeamMember[] = [
  {
    name: "Sarah Chen",
    role: "CTO",
    bio: "Leading technology strategy with 15+ years in scalable architecture and AI integration. Former Principal Engineer at Google Cloud.",
    photo: "/api/placeholder/400/400", // Placeholder - replace with actual photos
    linkedin: "https://linkedin.com/in/sarahchen",
    email: "sarah@contextiseverything.com"
  },
  {
    name: "Marcus Rodriguez", 
    role: "COO",
    bio: "Operations excellence focused on sustainable growth and team development. Previously scaled operations at three successful startups.",
    photo: "/api/placeholder/400/400",
    linkedin: "https://linkedin.com/in/marcusrodriguez",
    email: "marcus@contextiseverything.com"
  },
  {
    name: "Elena Kowalski",
    role: "CMO", 
    bio: "Brand strategist with expertise in contextual marketing and digital transformation. Led campaigns for Fortune 500 companies.",
    photo: "/api/placeholder/400/400",
    linkedin: "https://linkedin.com/in/elenakowalski",
    email: "elena@contextiseverything.com"
  }
]

export default function TeamSection() {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null)

  return (
    <section className="py-24 px-6" style={{ background: 'var(--context-gradient)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-semibold mb-6 uppercase tracking-[0.3em]"
            style={{ color: 'var(--context-text)' }}
          >
            Team
          </h2>
          <p 
            className="text-lg max-w-2xl mx-auto opacity-80"
            style={{ color: 'var(--context-text)' }}
          >
            Context emerges through diverse perspectives. Our leadership brings together 
            technology, operations, and marketing expertise to shape meaningful experiences.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-3 gap-12">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className="group relative"
              onMouseEnter={() => setHoveredMember(index)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              {/* Photo Container */}
              <div className="relative mb-6 overflow-hidden rounded-lg aspect-square">
                <div 
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 z-10 transition-opacity duration-300"
                  style={{ 
                    opacity: hoveredMember === index ? 1 : 0.7 
                  }}
                />
                
                <Image
                  src={member.photo}
                  alt={`${member.name} - ${member.role}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Chiaroscuro lighting effect overlay */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30 transition-opacity duration-300"
                  style={{
                    opacity: hoveredMember === index ? 0.8 : 0.4
                  }}
                />
              </div>

              {/* Member Info */}
              <div className="text-center">
                <h3 
                  className="text-xl font-semibold mb-2 transition-colors duration-300"
                  style={{ color: 'var(--context-text)' }}
                >
                  {member.name}
                </h3>
                
                <p 
                  className="text-sm uppercase tracking-[0.2em] mb-4 font-medium"
                  style={{ color: 'var(--context-accent)' }}
                >
                  {member.role}
                </p>
                
                <p 
                  className="text-sm leading-relaxed opacity-80 transition-opacity duration-300"
                  style={{ 
                    color: 'var(--context-text)',
                    opacity: hoveredMember === index ? 1 : 0.8 
                  }}
                >
                  {member.bio}
                </p>
                
                {/* Contact Links */}
                {(member.linkedin || member.email) && (
                  <div className="flex justify-center gap-4 mt-4">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs uppercase tracking-wider hover:opacity-70 transition-opacity"
                        style={{ color: 'var(--context-accent)' }}
                      >
                        LinkedIn
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="text-xs uppercase tracking-wider hover:opacity-70 transition-opacity"
                        style={{ color: 'var(--context-accent)' }}
                      >
                        Email
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Subtle geometric accent */}
              <div 
                className="absolute top-4 left-4 w-2 h-8 transition-all duration-300"
                style={{ 
                  background: 'var(--context-accent)',
                  opacity: hoveredMember === index ? 1 : 0,
                  transform: hoveredMember === index ? 'translateX(0)' : 'translateX(-8px)'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}