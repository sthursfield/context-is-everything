import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface SashaContext {
  visitorProfile: Record<string, unknown>;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  currentStage: string;
  teamMemberMatch: string | null;
  insightShared: string | null;
  leadCaptured: boolean;
}

class SashaConversation {
  private context: SashaContext;

  constructor(context: Partial<SashaContext> = {}) {
    this.context = {
      visitorProfile: {},
      conversationHistory: [],
      currentStage: 'greeting',
      teamMemberMatch: null,
      insightShared: null,
      leadCaptured: false,
      ...context
    };
  }

  buildSystemPrompt(): string {
    return `You are Sasha, an AI research analyst and website concierge for Context is Everything. Your role is to:

1. Greet visitors with: "Hi, I'm Sasha. You can ask me anything about the team, our product or services - or I'm also here to demonstrate how I can offer focused insights around your business."

2. Share valuable business insights from our research:
   - AI productivity implementation patterns
   - Remote work coordination vs communication findings
   - Economic uncertainty planning approaches
   - Digital transformation effectiveness data

3. Introduce team members when appropriate (use correct pronouns):
   - Lindsay (CTO, he/him): Technical solutions, software company building, no-code expertise
   - Spencer (Strategy Director, he/him): AI strategy, brand positioning, cross-sector insights
   - Robbie (Operations Director, he/him): Crisis management, operational transformation

4. Maintain authentic, analytical tone - avoid fake enthusiasm or overpromising.

5. Capture leads naturally through valuable content offers and strategic insights.

Current conversation context: ${JSON.stringify(this.context)}

Remember: You're intelligent, insightful, and genuinely helpful. Focus on providing value through your research insights and connecting visitors to the right team member.`;
  }

  async generateResponse(userMessage: string): Promise<{ response: string; updatedContext: SashaContext }> {
    const systemPrompt = this.buildSystemPrompt();

    try {
      const message = await anthropic.messages.create({
        model: process.env.SASHA_MODEL || 'claude-3-5-sonnet-20241022',
        max_tokens: parseInt(process.env.SASHA_MAX_TOKENS || '1024'),
        temperature: parseFloat(process.env.SASHA_TEMPERATURE || '0.7'),
        system: systemPrompt,
        messages: [
          ...this.context.conversationHistory,
          { role: 'user', content: userMessage }
        ]
      });

      const response = message.content[0].type === 'text' ? message.content[0].text : '';

      // Update conversation history
      this.context.conversationHistory.push(
        { role: 'user', content: userMessage },
        { role: 'assistant', content: response }
      );

      // Update context based on conversation
      this.updateContextFromResponse(userMessage, response);

      return {
        response,
        updatedContext: this.context
      };
    } catch (error) {
      console.error('Sasha API error:', error);
      return {
        response: "I'm experiencing some technical difficulties right now. Could you try again in a moment?",
        updatedContext: this.context
      };
    }
  }

  private updateContextFromResponse(userMessage: string, response: string) {
    // Simple keyword matching for team member detection
    const message = userMessage.toLowerCase();

    if (message.includes('technical') || message.includes('software') || message.includes('development')) {
      this.context.teamMemberMatch = 'lindsay';
    } else if (message.includes('strategy') || message.includes('ai') || message.includes('brand')) {
      this.context.teamMemberMatch = 'spencer';
    } else if (message.includes('operations') || message.includes('crisis') || message.includes('management')) {
      this.context.teamMemberMatch = 'robbie';
    }

    // Track if insights were shared
    if (response.toLowerCase().includes('insight') || response.toLowerCase().includes('pattern')) {
      this.context.insightShared = 'business_intelligence';
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId, context = {} } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const sasha = new SashaConversation(context);
    const result = await sasha.generateResponse(message);

    return NextResponse.json({
      response: result.response,
      context: result.updatedContext,
      sessionId: sessionId || 'anonymous'
    });

  } catch (error) {
    console.error('Sasha conversation error:', error);
    return NextResponse.json(
      { error: 'Failed to process conversation' },
      { status: 500 }
    );
  }
}