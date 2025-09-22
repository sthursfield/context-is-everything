import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name, email, teamMember, message } = await req.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create email content
    const subject = `${teamMember} - Message from ${name}`
    const emailBody = `
Name: ${name}
Email: ${email}
Team Member: ${teamMember}

Message:
${message}

---
Sent from Context is Everything contact form
    `.trim()

    // For now, we'll use a simple email service like Resend or SendGrid
    // This is a placeholder implementation that would need an email service

    // Option 1: Use Resend (recommended)
    if (process.env.RESEND_API_KEY) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev', // Use Resend's default verified domain
          to: ['spencer@point35.com'],
          subject: subject,
          text: emailBody,
          reply_to: email
        }),
      })

      if (!response.ok) {
        throw new Error(`Email service error: ${response.statusText}`)
      }

      return NextResponse.json({ success: true, message: 'Email sent successfully' })
    }

    // Option 2: Use Nodemailer with SMTP (fallback)
    else {
      // For development/testing, we'll simulate sending
      console.log('=== EMAIL WOULD BE SENT ===')
      console.log(`To: spencer@point35.com`)
      console.log(`Subject: ${subject}`)
      console.log(`From: ${name} <${email}>`)
      console.log(`Body:\n${emailBody}`)
      console.log('============================')

      // Return success for testing
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully (simulated in development)'
      })
    }

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}