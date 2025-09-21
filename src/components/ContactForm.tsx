'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  subject: z.enum(['general', 'partnership', 'support', 'other']),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type FormData = z.infer<typeof formSchema>

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      subject: 'general',
      message: '',
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          teamMember: data.subject,
          message: data.message,
          company: data.company
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setIsSubmitted(true)
      form.reset()
    } catch (error) {
      console.error('Error submitting form:', error)
      // Could add error state here if needed
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <section className="py-24 px-6" style={{ background: 'var(--context-gradient)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <div 
            className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ background: 'var(--context-accent)' }}
          >
            <svg 
              className="w-8 h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          
          <h2 
            className="text-3xl font-semibold mb-4"
            style={{ color: 'var(--context-text)' }}
          >
            Message Sent
          </h2>
          
          <p 
            className="text-lg opacity-80 mb-8"
            style={{ color: 'var(--context-text)' }}
          >
            Thank you for reaching out. We&apos;ll get back to you within 24 hours.
          </p>
          
          <Button
            onClick={() => setIsSubmitted(false)}
            variant="outline"
            className="border-2"
            style={{ 
              borderColor: 'var(--context-accent)',
              color: 'var(--context-accent)'
            }}
          >
            Send Another Message
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 px-6" style={{ background: 'var(--context-gradient)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-semibold mb-6 uppercase tracking-[0.3em]"
            style={{ color: 'var(--context-text)' }}
          >
            Contact
          </h2>
          <p 
            className="text-lg max-w-2xl mx-auto opacity-80"
            style={{ color: 'var(--context-text)' }}
          >
            Ready to explore new contexts together? Let&apos;s start a conversation 
            about how we can help shape your narrative.
          </p>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Name and Email Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel 
                        className="text-sm font-medium uppercase tracking-wider"
                        style={{ color: 'var(--context-text)' }}
                      >
                        Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-12 border-0 border-b-2 rounded-none bg-transparent focus:ring-0 transition-all duration-300"
                          style={{ 
                            borderColor: 'var(--context-accent)',
                            color: 'var(--context-text)'
                          }}
                          placeholder="Your full name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel 
                        className="text-sm font-medium uppercase tracking-wider"
                        style={{ color: 'var(--context-text)' }}
                      >
                        Email *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          className="h-12 border-0 border-b-2 rounded-none bg-transparent focus:ring-0 transition-all duration-300"
                          style={{ 
                            borderColor: 'var(--context-accent)',
                            color: 'var(--context-text)'
                          }}
                          placeholder="your@email.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Company and Subject Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel 
                        className="text-sm font-medium uppercase tracking-wider"
                        style={{ color: 'var(--context-text)' }}
                      >
                        Company
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-12 border-0 border-b-2 rounded-none bg-transparent focus:ring-0 transition-all duration-300"
                          style={{ 
                            borderColor: 'var(--context-accent)',
                            color: 'var(--context-text)'
                          }}
                          placeholder="Your organization"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel 
                        className="text-sm font-medium uppercase tracking-wider"
                        style={{ color: 'var(--context-text)' }}
                      >
                        Subject *
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full h-12 border-0 border-b-2 rounded-none bg-transparent focus:ring-0 focus:outline-none transition-all duration-300"
                          style={{ 
                            borderColor: 'var(--context-accent)',
                            color: 'var(--context-text)'
                          }}
                        >
                          <option value="general">General Inquiry</option>
                          <option value="partnership">Partnership</option>
                          <option value="support">Support</option>
                          <option value="other">Other</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Message */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel 
                      className="text-sm font-medium uppercase tracking-wider"
                      style={{ color: 'var(--context-text)' }}
                    >
                      Message *
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={6}
                        className="border-0 border-b-2 rounded-none bg-transparent focus:ring-0 resize-none transition-all duration-300"
                        style={{ 
                          borderColor: 'var(--context-accent)',
                          color: 'var(--context-text)'
                        }}
                        placeholder="Tell us about your project or inquiry..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="text-center pt-8">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-12 py-4 text-sm font-semibold uppercase tracking-[0.2em] rounded-none transition-all duration-300 disabled:opacity-50"
                  style={{ 
                    background: 'var(--context-accent)',
                    color: 'white',
                    border: '2px solid var(--context-accent)'
                  }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  )
}